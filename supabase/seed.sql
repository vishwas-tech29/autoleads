-- Sample data for development and testing

-- Insert sample businesses (Note: user_id should be replaced with actual auth.users IDs)
INSERT INTO businesses (
  user_id,
  business_name,
  industry_type,
  services,
  city,
  whatsapp_number,
  business_description,
  location,
  slug,
  has_website,
  plan_status,
  trial_ends_at,
  widget_settings
) VALUES 
(
  '00000000-0000-0000-0000-000000000001', -- Replace with actual user ID
  'Dr. Sharma''s Dental Clinic',
  'clinic',
  ARRAY['Root Canal Treatment', 'Teeth Cleaning', 'Dental Braces', 'Tooth Extraction', 'Dental Implants'],
  'Mumbai',
  '919876543210',
  'Premium dental care with modern equipment and experienced doctors. We provide painless treatments with the latest technology.',
  'Bandra West, Mumbai',
  'dr-sharmas-dental-clinic-mumbai',
  true,
  'trial',
  NOW() + INTERVAL '24 hours',
  '{"theme_color": "#3b82f6", "welcome_message": "Hi! Welcome to Dr. Sharma''s Dental Clinic. How can we help you with your dental needs today?", "position": "bottom-right"}'::jsonb
),
(
  '00000000-0000-0000-0000-000000000002', -- Replace with actual user ID
  'Excel Coaching Institute',
  'coaching',
  ARRAY['JEE Preparation', 'NEET Coaching', 'Class 12 Physics', 'Class 12 Chemistry', 'Mathematics'],
  'Delhi',
  '919876543211',
  'Top coaching institute for JEE and NEET preparation with experienced faculty and proven results.',
  'Karol Bagh, Delhi',
  'excel-coaching-institute-delhi',
  false,
  'active',
  NULL,
  '{"theme_color": "#10b981", "welcome_message": "Hello! Welcome to Excel Coaching Institute. What would you like to learn about today?", "position": "bottom-right"}'::jsonb
),
(
  '00000000-0000-0000-0000-000000000003', -- Replace with actual user ID
  'Prime Properties',
  'real_estate',
  ARRAY['Property Sales', 'Property Rentals', 'Property Management', 'Investment Consulting'],
  'Bangalore',
  '919876543212',
  'Your trusted real estate partner in Bangalore. We help you find the perfect property for your needs.',
  'Koramangala, Bangalore',
  'prime-properties-bangalore',
  true,
  'trial',
  NOW() + INTERVAL '12 hours',
  '{"theme_color": "#8b5cf6", "welcome_message": "Hi there! Welcome to Prime Properties. Are you looking to buy, sell, or rent a property?", "position": "bottom-right"}'::jsonb
);

-- Insert sample conversations
INSERT INTO conversations (
  business_id,
  visitor_id,
  status,
  lead_qualified,
  metadata
) VALUES 
(
  (SELECT id FROM businesses WHERE slug = 'dr-sharmas-dental-clinic-mumbai'),
  'visitor_abc123_1703123456789',
  'active',
  true,
  '{"source": "widget", "browser": "Chrome", "referrer": "https://google.com"}'::jsonb
),
(
  (SELECT id FROM businesses WHERE slug = 'excel-coaching-institute-delhi'),
  'visitor_def456_1703123456790',
  'human_takeover',
  true,
  '{"source": "mini_website", "browser": "Safari", "referrer": "direct"}'::jsonb
);

-- Insert sample messages
INSERT INTO messages (
  conversation_id,
  sender_type,
  message_text,
  metadata
) VALUES 
-- Conversation 1 messages
(
  (SELECT id FROM conversations WHERE visitor_id = 'visitor_abc123_1703123456789'),
  'ai',
  'Hi! Welcome to Dr. Sharma''s Dental Clinic. How can we help you with your dental needs today? 🏥',
  '{"type": "greeting"}'::jsonb
),
(
  (SELECT id FROM conversations WHERE visitor_id = 'visitor_abc123_1703123456789'),
  'visitor',
  'I have severe tooth pain and need root canal treatment',
  '{}'::jsonb
),
(
  (SELECT id FROM conversations WHERE visitor_id = 'visitor_abc123_1703123456789'),
  'ai',
  'I understand your pain. Our root canal treatments start from ₹8,000. May I have your name so we can assist you better?',
  '{}'::jsonb
),
(
  (SELECT id FROM conversations WHERE visitor_id = 'visitor_abc123_1703123456789'),
  'visitor',
  'My name is Rahul Kumar',
  '{}'::jsonb
),
(
  (SELECT id FROM conversations WHERE visitor_id = 'visitor_abc123_1703123456789'),
  'ai',
  'Thanks Rahul! What''s the best number to reach you on?',
  '{}'::jsonb
),
(
  (SELECT id FROM conversations WHERE visitor_id = 'visitor_abc123_1703123456789'),
  'visitor',
  '9876543210',
  '{}'::jsonb
),
(
  (SELECT id FROM conversations WHERE visitor_id = 'visitor_abc123_1703123456789'),
  'ai',
  'Perfect! Our team will contact you shortly on 9876543210 to schedule your consultation. Is there anything else you''d like to know?',
  '{"lead_qualified": true}'::jsonb
);

-- Insert sample leads
INSERT INTO leads (
  business_id,
  conversation_id,
  name,
  phone_number,
  lead_source,
  qualification_data,
  status,
  whatsapp_sent,
  whatsapp_sent_at
) VALUES 
(
  (SELECT id FROM businesses WHERE slug = 'dr-sharmas-dental-clinic-mumbai'),
  (SELECT id FROM conversations WHERE visitor_id = 'visitor_abc123_1703123456789'),
  'Rahul Kumar',
  '9876543210',
  'chat_widget',
  '{"intent": "Root canal treatment", "pain_level": "severe", "messages": 7}'::jsonb,
  'new',
  true,
  NOW() - INTERVAL '2 hours'
),
(
  (SELECT id FROM businesses WHERE slug = 'excel-coaching-institute-delhi'),
  (SELECT id FROM conversations WHERE visitor_id = 'visitor_def456_1703123456790'),
  'Priya Singh',
  '9876543211',
  'mini_website',
  '{"intent": "JEE preparation", "class": "12th", "messages": 5}'::jsonb,
  'contacted',
  true,
  NOW() - INTERVAL '4 hours'
);

-- Insert sample usage tracking
INSERT INTO usage_tracking (
  business_id,
  date,
  message_count,
  lead_count
) VALUES 
(
  (SELECT id FROM businesses WHERE slug = 'dr-sharmas-dental-clinic-mumbai'),
  CURRENT_DATE,
  12,
  3
),
(
  (SELECT id FROM businesses WHERE slug = 'excel-coaching-institute-delhi'),
  CURRENT_DATE,
  8,
  2
),
(
  (SELECT id FROM businesses WHERE slug = 'prime-properties-bangalore'),
  CURRENT_DATE,
  5,
  1
);

-- Insert sample subscription
INSERT INTO subscriptions (
  business_id,
  razorpay_subscription_id,
  plan_name,
  amount,
  status,
  current_period_start,
  current_period_end
) VALUES 
(
  (SELECT id FROM businesses WHERE slug = 'excel-coaching-institute-delhi'),
  'sub_razorpay_12345',
  'pro',
  99900,
  'active',
  NOW() - INTERVAL '15 days',
  NOW() + INTERVAL '15 days'
);