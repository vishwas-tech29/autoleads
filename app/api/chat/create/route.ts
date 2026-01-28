import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { businessId, visitorId, metadata } = await request.json()

    if (!businessId || !visitorId) {
      return NextResponse.json(
        { error: 'Business ID and visitor ID are required' },
        { status: 400 }
      )
    }

    // Get business details
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', businessId)
      .single()

    if (businessError || !business) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      )
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
        return NextResponse.json({
          error: 'Trial message limit reached',
          upgradeRequired: true,
          upgradeUrl: '/dashboard/billing'
        }, { status: 429 })
      }
    }

    // Create conversation
    const { data: conversation, error: conversationError } = await supabase
      .from('conversations')
      .insert({
        business_id: businessId,
        visitor_id: visitorId,
        status: 'active'
      })
      .select()
      .single()

    if (conversationError) {
      console.error('Error creating conversation:', conversationError)
      return NextResponse.json(
        { error: 'Failed to create conversation' },
        { status: 500 }
      )
    }

    // Generate AI greeting based on business type
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

    // Update usage tracking
    if (business.plan_status === 'trial') {
      const today = new Date().toISOString().split('T')[0]
      
      await supabase
        .from('usage_tracking')
        .upsert({
          business_id: businessId,
          date: today,
          message_count: 1
        }, {
          onConflict: 'business_id,date'
        })
    }

    return NextResponse.json({
      chatId: conversation.id,
      status: 'active',
      greeting: greeting
    })

  } catch (error) {
    console.error('Error in chat create:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}