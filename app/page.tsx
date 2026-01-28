'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import FloatingElements from '@/components/3d/FloatingElements'
import AnimatedCounter from '@/components/animations/AnimatedCounter'
import FadeInView from '@/components/animations/FadeInView'
import { 
  MessageCircle, 
  Zap, 
  Users, 
  TrendingUp, 
  Smartphone, 
  Bot,
  ArrowRight,
  CheckCircle,
  Star,
  Play
} from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      <FloatingElements />
      
      {/* Navigation */}
      <nav className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">AutoLead AI</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-4"
          >
            <Link href="/login">
              <Button variant="ghost" className="text-white hover:text-blue-300">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="gradient" size="lg">
                Get Started Free
              </Button>
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
              Transform{' '}
              <span className="gradient-text">Visitors</span>
              <br />
              into{' '}
              <span className="gradient-text">Leads</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              AI-powered lead capture system that delivers qualified prospects 
              directly to your WhatsApp in seconds
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <Button variant="gradient" size="xl" className="group">
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="xl" className="group border-white/20 text-white hover:bg-white/10">
              <Play className="mr-2 w-5 h-5" />
              Watch Demo
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            <div className="text-center">
              <AnimatedCounter 
                end={2500} 
                suffix="+" 
                className="text-4xl font-bold gradient-text block"
              />
              <p className="text-gray-400 mt-2">Test Leads Generated</p>
            </div>
            <div className="text-center">
              <AnimatedCounter 
                end={150} 
                suffix="+" 
                className="text-4xl font-bold gradient-text block"
              />
              <p className="text-gray-400 mt-2">Demo Businesses</p>
            </div>
            <div className="text-center">
              <AnimatedCounter 
                end={85} 
                suffix="%" 
                className="text-4xl font-bold gradient-text block"
              />
              <p className="text-gray-400 mt-2">Success Rate</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <FadeInView className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">
              Why Choose <span className="gradient-text">AutoLead AI</span>?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to capture, qualify, and convert website visitors 
              into paying customers
            </p>
          </FadeInView>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: MessageCircle,
                title: "AI-Powered Chat",
                description: "Smart conversations that qualify leads automatically",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: Smartphone,
                title: "WhatsApp Integration",
                description: "Get instant notifications on your phone",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Responses in under 3 seconds, notifications in 10",
                color: "from-yellow-500 to-orange-500"
              },
              {
                icon: Users,
                title: "Human Takeover",
                description: "Take control when you need to close the deal",
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: TrendingUp,
                title: "No Website? No Problem",
                description: "Get a beautiful mini-website automatically",
                color: "from-indigo-500 to-purple-500"
              },
              {
                icon: Bot,
                title: "Industry Specific",
                description: "Tailored for clinics, coaching, real estate & more",
                color: "from-red-500 to-pink-500"
              }
            ].map((feature, index) => (
              <FadeInView key={index} delay={index * 0.1}>
                <Card variant="glass" className="h-full group hover:scale-105 transition-all duration-300">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-white">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-300">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <FadeInView className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-xl text-gray-300">
              From setup to lead conversion in just 3 simple steps
            </p>
          </FadeInView>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Quick Setup",
                description: "Sign up and configure your business details in under 5 minutes"
              },
              {
                step: "02", 
                title: "Deploy Anywhere",
                description: "Add our widget to your site or share your auto-generated mini-website"
              },
              {
                step: "03",
                title: "Get Leads",
                description: "AI qualifies visitors and sends you instant WhatsApp notifications"
              }
            ].map((step, index) => (
              <FadeInView key={index} delay={index * 0.2} direction="up">
                <div className="text-center group">
                  <motion.div
                    whileHover={{ scale: 1.1, rotateY: 180 }}
                    className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl font-bold preserve-3d"
                  >
                    <span className="backface-hidden">{step.step}</span>
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-4 text-white">{step.title}</h3>
                  <p className="text-gray-300">{step.description}</p>
                </div>
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <FadeInView className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">
              What Our <span className="gradient-text">Customers</span> Say
            </h2>
          </FadeInView>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Beta Tester 1",
                business: "Testing Phase",
                rating: 5,
                text: "The lead capture system works perfectly! Great for testing our conversion flows."
              },
              {
                name: "Demo User 2",
                business: "QA Testing",
                rating: 5,
                text: "WhatsApp integration is seamless. Easy to test different scenarios."
              },
              {
                name: "Test Account 3",
                business: "Development Testing",
                rating: 4,
                text: "Setup was quick and the demo leads help validate our process."
              }
            ].map((testimonial, index) => (
              <FadeInView key={index} delay={index * 0.1}>
                <Card variant="glass" className="h-full">
                  <CardHeader>
                    <div className="flex items-center space-x-1 mb-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <CardTitle className="text-white">{testimonial.name}</CardTitle>
                    <CardDescription className="text-gray-400">
                      {testimonial.business}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 italic">"{testimonial.text}"</p>
                  </CardContent>
                </Card>
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <FadeInView className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">
              Simple <span className="gradient-text">Pricing</span>
            </h2>
            <p className="text-xl text-gray-300">
              Start free, upgrade when you're ready
            </p>
          </FadeInView>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FadeInView delay={0.1}>
              <Card variant="glass" className="h-full">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-white">Free Trial</CardTitle>
                  <div className="text-4xl font-bold gradient-text">₹0</div>
                  <CardDescription className="text-gray-300">
                    24 hours • 20 messages • 5 leads
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    "AI-powered chat widget",
                    "WhatsApp notifications", 
                    "Mini-website generation",
                    "Basic analytics"
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full mt-6 border-white/20 text-white hover:bg-white/10">
                    Start Free Trial
                  </Button>
                </CardContent>
              </Card>
            </FadeInView>

            <FadeInView delay={0.2}>
              <Card variant="glow" className="h-full border-2 border-blue-500/50 relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-white">Pro Plan</CardTitle>
                  <div className="text-4xl font-bold gradient-text">₹999</div>
                  <CardDescription className="text-gray-300">
                    per month • Unlimited everything
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    "Unlimited messages & leads",
                    "Human takeover feature",
                    "Advanced analytics",
                    "Priority support",
                    "Custom branding",
                    "API access"
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                  <Button variant="gradient" className="w-full mt-6">
                    Upgrade Now
                  </Button>
                </CardContent>
              </Card>
            </FadeInView>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <FadeInView>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-md border border-white/10 rounded-3xl p-12"
            >
              <h2 className="text-5xl font-bold mb-6">
                Ready to <span className="gradient-text">Transform</span> Your Business?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Join our testing phase and help us perfect the lead capture experience
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button variant="gradient" size="xl" className="group">
                    Start Free Trial
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Button variant="outline" size="xl" className="border-white/20 text-white hover:bg-white/10">
                  Schedule Demo
                </Button>
              </div>
            </motion.div>
          </FadeInView>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">AutoLead AI</span>
          </div>
          <p className="text-gray-400">
            © 2024 AutoLead AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}