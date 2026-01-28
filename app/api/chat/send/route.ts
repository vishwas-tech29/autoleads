import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface LeadData {
  hasNameAndPhone: boolean
  name?: string
  phone?: string
  intent?: string
}

export async function POST(request: NextRequest) {
  try {
    const { chatId, message } = await request.json()

    if (!chatId || !message) {
      return NextResponse.json(
        { error: 'Chat ID and message are required' },
        { status: 400 }
      )
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
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      )
    }

    const business = conversation.businesses

    // Check if human takeover is active
    if (conversation.status === 'human_takeover') {
      return NextResponse.json({
        response: "A team member will assist you shortly. Please wait for their response.",
        metadata: { humanTakeover: true }
      })
    }

    // Check trial limits
    if (business.plan_status === 'trial') {
      const today = new Date().toISOString().split('T')[0]
      
      const { data: usage } = await supabase
        .from('usage_tracking')
        .select('message_count')
        .eq('business_id', business.id)
        .eq('date', today)
        .single()

      if (usage && usage.message_count >= 20) {
        return NextResponse.json({
          response: 'Trial message limit reached. Please upgrade to continue conversations.',
          upgradeRequired: true,
          upgradeUrl: '/dashboard/billing'
        }, { status: 429 })
      }
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

    // Check if lead should be created
    const leadData = extractLeadData(messages || [], message)
    let leadCreated = false
    let leadId = null

    if (leadData.hasNameAndPhone && !conversation.lead_qualified) {
      // Create lead
      const { data: lead, error: leadError } = await supabase
        .from('leads')
        .insert({
          business_id: business.id,
          conversation_id: chatId,
          name: leadData.name!,
          phone_number: leadData.phone!,
          intent: leadData.intent || 'General inquiry',
          lead_source: 'chat_widget',
          qualification_data: { messages: messages?.length || 0 }
        })
        .select()
        .single()

      if (!leadError && lead) {
        leadCreated = true
        leadId = lead.id

        // Update conversation as lead qualified
        await supabase
          .from('conversations')
          .update({ lead_qualified: true })
          .eq('id', chatId)

        // Send WhatsApp notification
        await sendWhatsAppNotification(lead, business)

        // Update usage tracking for leads
        if (business.plan_status === 'trial') {
          const today = new Date().toISOString().split('T')[0]
          
          const { data: currentUsage } = await supabase
            .from('usage_tracking')
            .select('lead_count')
            .eq('business_id', business.id)
            .eq('date', today)
            .single()

          await supabase
            .from('usage_tracking')
            .upsert({
              business_id: business.id,
              date: today,
              lead_count: (currentUsage?.lead_count || 0) + 1
            }, {
              onConflict: 'business_id,date'
            })
        }
      }
    }

    // Update message usage tracking
    if (business.plan_status === 'trial') {
      const today = new Date().toISOString().split('T')[0]
      
      const { data: currentUsage } = await supabase
        .from('usage_tracking')
        .select('message_count')
        .eq('business_id', business.id)
        .eq('date', today)
        .single()

      await supabase
        .from('usage_tracking')
        .upsert({
          business_id: business.id,
          date: today,
          message_count: (currentUsage?.message_count || 0) + 1
        }, {
          onConflict: 'business_id,date'
        })
    }

    return NextResponse.json({
      response: aiResponse.message,
      metadata: {
        leadCreated,
        leadId,
        ...aiResponse.metadata
      }
    })

  } catch (error) {
    console.error('Error in chat send:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function generateAIResponse({ business, conversationHistory, latestMessage }: {
  business: any
  conversationHistory: any[]
  latestMessage: string
}) {
  const systemPrompt = buildSystemPrompt(business)
  
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

function buildSystemPrompt(business: any): string {
  const industryContext = {
    clinic: 'medical clinic providing healthcare services',
    coaching: 'coaching institute providing educational services',
    real_estate: 'real estate business helping with property needs',
    local_service: 'local service business providing professional services'
  }

  const services = business.services?.join(', ') || 'our services'
  const context = industryContext[business.industry_type as keyof typeof industryContext] || 'business'

  return `You are a professional AI assistant for ${business.business_name}, a ${context} based in ${business.location || 'your area'}.

BUSINESS CONTEXT:
- Services: ${services}
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

CONVERSATION FLOW:
1. First, answer their question clearly and briefly
2. Then, ask ONE qualifying question related to their interest
3. Naturally ask for their name if not provided
4. Once you have their name, ask for their phone number
5. After getting name + phone, confirm you'll have someone contact them

CONTACT COLLECTION:
- Be natural and conversational when asking for details
- If visitor resists, don't pressure - continue helping them
- Once you have name + phone, your job is done - confirm next steps

Respond to the visitor's latest message professionally and helpfully.`
}

function extractLeadData(messages: any[], latestMessage: string): LeadData {
  const allText = [...messages.map(m => m.message_text), latestMessage].join(' ')
  
  // Extract phone number (Indian format)
  const phoneRegex = /(?:\+91|91)?[\s-]?[6-9]\d{9}/g
  const phones = allText.match(phoneRegex)
  
  // Extract name patterns
  const namePatterns = [
    /(?:my name is|i am|this is|i'm)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i,
    /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)$/m
  ]
  
  let name = null
  for (const pattern of namePatterns) {
    const match = allText.match(pattern)
    if (match) {
      name = match[1]
      break
    }
  }
  
  // Extract intent from visitor messages
  const visitorMessages = messages
    .filter(m => m.sender_type === 'visitor')
    .slice(0, 3)
    .map(m => m.message_text)
    .join(' ')
  
  const intent = visitorMessages.slice(0, 200)
  
  return {
    hasNameAndPhone: !!(name && phones?.length),
    name: name || undefined,
    phone: phones?.[0]?.replace(/[\s-]/g, '') || undefined,
    intent: intent || undefined
  }
}

async function sendWhatsAppNotification(lead: any, business: any) {
  try {
    const message = `🚀 *NEW ENQUIRY*

*Name:* ${lead.name}
*Phone:* ${lead.phone_number}
*Interest:* ${lead.intent}
*Time:* ${new Date().toLocaleTimeString('en-IN', {
  hour: '2-digit',
  minute: '2-digit'
})}

━━━━━━━━━━━━━━━
Reply:
• *YES* - I'll handle this
• *NO* - Let bot continue`

    // TODO: Implement actual WhatsApp API call
    console.log('WhatsApp notification would be sent:', {
      to: business.whatsapp_number,
      message
    })

    // Update lead record
    await supabase
      .from('leads')
      .update({
        whatsapp_sent: true,
        whatsapp_sent_at: new Date().toISOString()
      })
      .eq('id', lead.id)

  } catch (error) {
    console.error('Error sending WhatsApp notification:', error)
  }
}