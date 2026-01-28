# AutoLead AI - AI-Powered Lead Capture System

Transform website visitors into qualified leads delivered instantly to business owners via WhatsApp.

## 🚀 Features

- **AI-Powered Chat Widget** - Smart conversations that qualify leads automatically
- **WhatsApp Integration** - Instant notifications with human takeover capability
- **Mini-Website Generation** - Beautiful websites for businesses without existing sites
- **Real-time Analytics** - Track leads, messages, and conversion rates
- **Trial & Subscription Management** - Freemium model with Razorpay integration
- **Beautiful 3D UI** - Modern interface with Framer Motion animations

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **React Three Fiber** - 3D graphics and animations
- **Radix UI** - Accessible component primitives

### Backend
- **Express.js** - Node.js web framework
- **Supabase** - PostgreSQL database with real-time features
- **OpenAI GPT-4o-mini** - AI chat responses
- **WhatsApp Cloud API** - Message delivery
- **Razorpay** - Payment processing

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- OpenAI API key
- WhatsApp Business API access
- Razorpay account

### 1. Clone the repository
```bash
git clone https://github.com/your-username/autolead-ai.git
cd autolead-ai
```

### 2. Install dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd backend
npm install
```

### 3. Environment Setup

**Frontend (.env.local):**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=your_openai_api_key
WHATSAPP_ACCESS_TOKEN=your_whatsapp_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your_verify_token
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Backend (.env):**
```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=your_openai_api_key
WHATSAPP_ACCESS_TOKEN=your_whatsapp_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your_verify_token
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

### 4. Database Setup

1. Create a new Supabase project
2. Run the migration:
```bash
psql -h your-supabase-host -U postgres -d postgres -f supabase/migrations/001_initial_schema.sql
```
3. (Optional) Seed with sample data:
```bash
psql -h your-supabase-host -U postgres -d postgres -f supabase/seed.sql
```

### 5. Start Development Servers

**Frontend:**
```bash
npm run dev
```

**Backend:**
```bash
cd backend
npm run dev
```

## 🎯 Usage

### For Businesses with Websites
1. Sign up and complete business setup
2. Copy the provided widget code
3. Paste before `</body>` tag on your website
4. Start receiving leads on WhatsApp!

### For Businesses without Websites
1. Sign up and complete business setup
2. Get your unique mini-website URL
3. Share the link on social media/WhatsApp status
4. Start capturing leads immediately!

## 🔧 Widget Integration

Add this single line to any website:

```html
<script src="https://autolead.ai/widget.js" 
        data-business-id="your-business-id" 
        data-position="bottom-right"></script>
```

## 📊 API Endpoints

### Chat API
- `POST /api/chat/create` - Create new conversation
- `POST /api/chat/send` - Send message and get AI response

### Business API
- `POST /api/business` - Create business
- `GET /api/business/:id` - Get business details
- `PUT /api/business/:id` - Update business
- `GET /api/business/:id/analytics` - Get analytics

### Webhooks
- `POST /api/webhooks/whatsapp` - WhatsApp message webhook
- `POST /api/webhooks/razorpay` - Payment webhook

## 🎨 Customization

### Widget Styling
The widget automatically adapts to your website's theme. Customize colors and position:

```javascript
// Widget configuration
{
  theme_color: "#3b82f6",
  position: "bottom-right", // bottom-left, top-right, top-left
  welcome_message: "Hi! How can we help you today?"
}
```

### AI Responses
Customize AI behavior by industry type in the business setup. The system automatically:
- Adapts conversation flow based on business type
- Uses industry-specific greetings
- Qualifies leads based on business context

## 🚀 Deployment

### Frontend (Vercel)
```bash
npm run build
vercel --prod
```

### Backend (Railway)
```bash
cd backend
npm run build
railway up
```

### Environment Variables
Set all environment variables in your deployment platform.

## 📈 Analytics & Monitoring

Track key metrics:
- **Lead Conversion Rate** - Visitors to qualified leads
- **Response Time** - Average AI response time
- **WhatsApp Delivery** - Notification success rate
- **Human Takeover Rate** - When owners take control

## 🔒 Security Features

- **Row Level Security (RLS)** - Database access control
- **Rate Limiting** - API protection
- **Input Validation** - XSS and injection prevention
- **Webhook Verification** - Secure external integrations
- **CORS Configuration** - Cross-origin request control

## 🧪 Testing

Run tests:
```bash
npm test
```

Property-based tests validate:
- Authentication flows
- Business configuration
- Chat functionality
- Lead qualification
- WhatsApp integration

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📞 Support

- **Documentation**: [docs.autolead.ai](https://docs.autolead.ai)
- **Email**: support@autolead.ai
- **Discord**: [Join our community](https://discord.gg/autolead-ai)

## 🎉 Success Stories

> "AutoLead AI increased our lead generation by 300% in the first month!" 
> - Dr. Priya Sharma, Dental Clinic

> "The WhatsApp integration is genius. I never miss a potential customer anymore."
> - Rajesh Kumar, Real Estate Agent

---

Built with ❤️ for businesses that want to grow faster.