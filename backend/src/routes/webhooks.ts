import express from 'express'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

const router = express.Router()

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// WhatsApp webhook verification and message handling
router.get('/whatsapp', (req, res) => {
  const mode = req.query['hub.mode']
  const token = req.query['hub.verify_token']
  const challenge = req.query['hub.challenge']

  if (mode === 'subscribe' && token === process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN) {
    console.log('WhatsApp webhook verified')
    res.status(200).send(challenge)
  } else {
    res.status(403).send('Forbidden')
  }
})

router.post('/whatsapp', async (req, res) => {
  try {
    const body = req.body

    // Handle incoming WhatsApp messages
    const message = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]
    if (!message) {
      return res.status(200).send('OK')
    }

    const from = message.from // Business owner's WhatsApp number
    const text = message.text?.body?.toUpperCase()

    // Find latest lead from this business
    const { data: business } = await supabase
      .from('businesses')
      .select('id')
      .eq('whatsapp_number', from)
      .single()

    if (!business) {
      return res.status(200).send('OK')
    }

    const { data: lead } = await supabase
      .from('leads')
      .select('*')
      .eq('business_id', business.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (!lead) {
      return res.status(200).send('OK')
    }

    if (text === 'YES') {
      // Activate human takeover
      await supabase
        .from('conversations')
        .update({ status: 'human_takeover' })
        .eq('id', lead.conversation_id)

      await supabase
        .from('leads')
        .update({ owner_response: 'YES' })
        .eq('id', lead.id)

      // Send confirmation
      await sendWhatsAppMessage(from, "✅ You're now handling this chat. The bot has been paused.")

    } else if (text === 'NO') {
      // Keep bot active
      await supabase
        .from('leads')
        .update({ owner_response: 'NO' })
        .eq('id', lead.id)

      // Send confirmation
      await sendWhatsAppMessage(from, "✅ Bot will continue the conversation. You'll get updates.")
    }

    res.status(200).send('OK')

  } catch (error) {
    console.error('WhatsApp webhook error:', error)
    res.status(500).send('Error')
  }
})

// Razorpay webhook for payment processing
router.post('/razorpay', async (req, res) => {
  try {
    const body = req.body
    const signature = req.headers['x-razorpay-signature'] as string

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(JSON.stringify(body))
      .digest('hex')

    if (signature !== expectedSignature) {
      return res.status(400).json({ error: 'Invalid signature' })
    }

    const event = body.event
    const subscription = body.payload.subscription.entity

    switch (event) {
      case 'subscription.activated':
        await activateSubscription(subscription)
        break

      case 'subscription.charged':
        await recordPayment(subscription)
        break

      case 'subscription.cancelled':
        await deactivateSubscription(subscription)
        break
    }

    res.status(200).send('OK')

  } catch (error) {
    console.error('Razorpay webhook error:', error)
    res.status(500).send('Error')
  }
})

// Helper functions
async function sendWhatsAppMessage(to: string, message: string) {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: to,
          type: 'text',
          text: { body: message }
        })
      }
    )

    if (!response.ok) {
      throw new Error(`WhatsApp API error: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error sending WhatsApp message:', error)
    throw error
  }
}

async function activateSubscription(subscription: any) {
  await supabase
    .from('businesses')
    .update({
      plan_status: 'active',
      trial_ends_at: null
    })
    .eq('id', subscription.notes.business_id)

  await supabase
    .from('subscriptions')
    .insert({
      business_id: subscription.notes.business_id,
      razorpay_subscription_id: subscription.id,
      plan_name: 'pro',
      amount: subscription.plan_id === 'plan_starter' ? 99900 : 199900,
      status: 'active',
      current_period_start: new Date(subscription.current_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_end * 1000).toISOString()
    })
}

async function recordPayment(subscription: any) {
  await supabase
    .from('subscriptions')
    .update({
      current_period_start: new Date(subscription.current_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_end * 1000).toISOString()
    })
    .eq('razorpay_subscription_id', subscription.id)
}

async function deactivateSubscription(subscription: any) {
  await supabase
    .from('businesses')
    .update({ plan_status: 'expired' })
    .eq('id', subscription.notes.business_id)

  await supabase
    .from('subscriptions')
    .update({ status: 'cancelled' })
    .eq('razorpay_subscription_id', subscription.id)
}

export default router