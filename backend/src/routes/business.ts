import express from 'express'
import { createClient } from '@supabase/supabase-js'
import { generateSlug, validateIndianPhone } from '../utils/helpers'

const router = express.Router()

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Create new business
router.post('/', async (req, res) => {
  try {
    const {
      userId,
      businessName,
      businessType,
      services,
      city,
      whatsappNumber,
      hasWebsite,
      websiteUrl
    } = req.body

    // Validation
    if (!userId || !businessName || !businessType || !whatsappNumber) {
      return res.status(400).json({
        error: 'Missing required fields'
      })
    }

    if (!validateIndianPhone(whatsappNumber)) {
      return res.status(400).json({
        error: 'Invalid WhatsApp number format'
      })
    }

    // Generate unique slug
    const baseSlug = generateSlug(`${businessName} ${city}`)
    let slug = baseSlug
    let counter = 1

    while (true) {
      const { data: existing } = await supabase
        .from('businesses')
        .select('id')
        .eq('slug', slug)
        .single()

      if (!existing) break
      
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Create business
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .insert({
        user_id: userId,
        business_name: businessName,
        industry_type: businessType,
        services: services || [],
        city: city,
        whatsapp_number: whatsappNumber,
        slug: slug,
        has_website: hasWebsite || false,
        plan_status: 'trial',
        trial_ends_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
        widget_settings: {
          theme_color: '#3b82f6',
          welcome_message: `Hi! Welcome to ${businessName}. How can we help you today?`,
          position: 'bottom-right'
        }
      })
      .select()
      .single()

    if (businessError) {
      console.error('Error creating business:', businessError)
      return res.status(500).json({ error: 'Failed to create business' })
    }

    // Initialize usage tracking
    const today = new Date().toISOString().split('T')[0]
    await supabase
      .from('usage_tracking')
      .insert({
        business_id: business.id,
        date: today,
        message_count: 0,
        lead_count: 0
      })

    res.status(201).json({
      business,
      widgetCode: hasWebsite ? 
        `<script src="${process.env.FRONTEND_URL}/widget.js" data-business-id="${business.id}" data-position="bottom-right"></script>` :
        null,
      miniWebsiteUrl: !hasWebsite ? 
        `${process.env.FRONTEND_URL}/biz/${slug}` :
        null
    })

  } catch (error) {
    console.error('Error in business creation:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get business by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const { data: business, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !business) {
      return res.status(404).json({ error: 'Business not found' })
    }

    res.json(business)

  } catch (error) {
    console.error('Error fetching business:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get business by slug (for mini-website)
router.get('/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params

    const { data: business, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error || !business) {
      return res.status(404).json({ error: 'Business not found' })
    }

    res.json(business)

  } catch (error) {
    console.error('Error fetching business by slug:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Update business
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body

    // Remove fields that shouldn't be updated directly
    delete updates.id
    delete updates.user_id
    delete updates.created_at
    delete updates.plan_status
    delete updates.trial_ends_at

    const { data: business, error } = await supabase
      .from('businesses')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating business:', error)
      return res.status(500).json({ error: 'Failed to update business' })
    }

    res.json(business)

  } catch (error) {
    console.error('Error in business update:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get business analytics
router.get('/:id/analytics', async (req, res) => {
  try {
    const { id } = req.params

    // Get leads count
    const { count: totalLeads } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', id)

    // Get today's leads
    const today = new Date().toISOString().split('T')[0]
    const { count: todayLeads } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', id)
      .gte('created_at', today)

    // Get messages count
    const { data: conversations } = await supabase
      .from('conversations')
      .select('id')
      .eq('business_id', id)

    const conversationIds = conversations?.map(c => c.id) || []
    
    let totalMessages = 0
    let todayMessages = 0

    if (conversationIds.length > 0) {
      const { count: totalCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .in('conversation_id', conversationIds)

      const { count: todayCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .in('conversation_id', conversationIds)
        .gte('created_at', today)

      totalMessages = totalCount || 0
      todayMessages = todayCount || 0
    }

    // Calculate response rate (simplified)
    const responseRate = totalMessages > 0 ? Math.min(98, Math.round((totalLeads || 0) / (totalMessages / 10) * 100)) : 0

    res.json({
      totalLeads: totalLeads || 0,
      todayLeads: todayLeads || 0,
      totalMessages: totalMessages,
      todayMessages: todayMessages,
      responseRate: responseRate,
      avgResponseTime: 2.3 // Mock value
    })

  } catch (error) {
    console.error('Error fetching analytics:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router