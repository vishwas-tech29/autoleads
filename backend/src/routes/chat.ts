import express from 'express'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

const router = express.Router()

// Initialize clients
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

// Create new chat conversation
router.post('/create', async (req, res) => {
  try {
    const { businessId, visitorId, metadata } = req.body

    if (!businessId || !visitorId) {
      return res.status(400).json({
        error: 'Business ID and visitor ID are required'
      })
    }

    // Get business details
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', businessId)
      .single()

    if (businessError || !business) {
      return res.status(404).json({ error: 'Business not found' })
    }

    // Check trial limits
    if (business.plan_status === 'trial') {
      const today = new Date().toISOString().split('T')[0]
      
      const { data: usage } = await supabase
        .from('usage_tracking')
        .select('message_count')
        .eq('business_id', businessId)
        .eq('date', today)
        .single()

      if (usage && usage.message_count >= 20) {
        return res.status(429).json({
          error: 'Trial message limit reached',
          upgradeRequired: true,
          upgradeUrl: '/dashboard/billing'
        })
      }
    }

    // Create conversation
    const { data: conversation, error: conversationError } = await supabase
      .from('conversations')
      .insert({
        business_id: businessId,
        visitor_id: visitorId,
        status: 'active',
        metadata
      })
      .select()
      .single()

    if (conversationError) {
      console.error('Error creating conversation:', conversationError)
      return res.status(500).json({ error: 'Failed to create conversation' })
    }

    // Generate AI greeting
    const greetings = {
      clinic: `Hi! Welcome to ${business.business_name}. How can we help you with your health needs today? 🏥`,
      coaching: `Hello! Welcome to ${business.business_name}. What would you like to learn about today? 📚`,
      real_estate: `Hi there! Welcome to ${business.business_name}. Are you looking to buy, sell, or rent a property? 🏠`,
      local_service: `Hello! Welcome to ${business.business_name}. What service can we help you with today? 🔧`
    }

    const greeting = greetings[business.industry_type as keyof typeof greetings] || 
                    `Hi! Welcome to ${business.business_name}. How can we help you today? 👋`

    // Save greeting message
    await supabase
      .from('messages')
      .insert({
        conversation_id: conversation.id,
        sender_type: 'ai',
        message_text: greeting,
        metadata: { type: 'greeting' }
      })

    res.json({
      chatId: conversation.id,
      status: 'active',
      greeting: greeting
    })

  } catch (error) {
    console.error('Error in chat create:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Send message in chat
router.post('/send', async (req, res) => {
  try {
    const { chatId, message } = req.body

    if (!chatId || !message) {
      return res.status(400).json({
        error: 'Chat ID and message are required'
      })
    }

    // Get conversation and business details
    const { data: conversation, error: conversationError } = await supabase
      .from('conversations')
      .select(`
        *,
        businesses (*)
      `)
      .eq('id', chatId)
      .single()

    if (conversationError || !conversation) {
      return res.status(404).json({ error: 'Conversation not found' })
    }

    const business = conversation.businesses

    // Check if human takeover is active
    if (conversation.status === 'human_takeover') {
      return res.json({
        response: "A team member will assist you shortly. Please wait for their response.",
        metadata: { humanTakeover: true }
      })
    }

    // Save visitor message
    await supabase
      .from('messages')
      .insert({
        conversation_id: chatId,
        sender_type: 'visitor',
        message_text: message
      })

    // Get conversation history
    const { data: messages } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', chatId)
      .order('created_at', { ascending: true })

    // Generate AI response
    const aiResponse = await generateAIResponse({
      business,
      conversationHistory: messages || [],
      latestMessage: message
    })

    // Save AI response
    await supabase
      .from('messages')
      .insert({
        conversation_id: chatId,
        sender_type: 'ai',
        message_text: aiResponse.message,
        metadata: aiResponse.metadata
      })

    res.json({
      response: aiResponse.message,
      metadata: aiResponse.metadata
    })

  } catch (error) {
    console.error('Error in chat send:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Helper function to generate AI response
async function generateAIResponse({ business, conversationHistory, latestMessage }: {
  business: any
  conversationHistory: any[]
  latestMessage: string
}) {
  const systemPrompt = `You are a professional AI assistant for ${business.business_name}, a ${business.industry_type} based in ${business.location || 'your area'}.

BUSINESS CONTEXT:
- Services: ${business.services?.join(', ') || 'our services'}
- Industry: ${business.industry_type}
- Location: ${business.location || 'Local area'}

YOUR ROLE:
- Help visitors by answering questions about our services
- Collect contact information (name and phone number) 
- Qualify leads by understanding their needs
- Be helpful, professional, and friendly

STRICT RULES:
1. Always identify as an AI assistant for ${business.business_name}
2. NEVER claim to be human or a specific person
3. Keep responses under 40 words
4. Be professional and friendly
5. Never give medical, legal, or financial advice
6. Never commit to prices without saying "starting from" or "approximately"
7. Never book appointments - only collect information

Respond to the visitor's latest message professionally and helpfully.`
  
  const messages = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory
      .filter(msg => msg.sender_type !== 'system')
      .map(msg => ({
        role: msg.sender_type === 'visitor' ? 'user' : 'assistant',
        content: msg.message_text
      })),
    { role: 'user', content: latestMessage }
  ]

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages as any,
      temperature: 0.7,
      max_tokens: 150,
    })

    const aiMessage = response.choices[0].message.content || 'I apologize, but I encountered an issue. Please try again.'

    return {
      message: aiMessage,
      metadata: {
        model: 'gpt-4o-mini',
        tokens: response.usage?.total_tokens || 0
      }
    }
  } catch (error) {
    console.error('OpenAI API error:', error)
    return {
      message: 'I apologize, but I encountered a technical issue. Please try again in a moment.',
      metadata: { error: 'openai_api_error' }
    }
  }
}

export default router