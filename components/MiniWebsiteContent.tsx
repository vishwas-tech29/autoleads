'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import FloatingElements from '@/components/3d/FloatingElements'
import FadeInView from '@/components/animations/FadeInView'
import { 
  MapPin, 
  Clock, 
  Phone, 
  Star,
  MessageCircle,
  CheckCircle,
  Stethoscope,
  GraduationCap,
  Home,
  Wrench
} from 'lucide-react'

// Mock data - replace with actual Supabase query
const mockBusiness = {
  id: '123',
  name: "Dr. Sharma's Dental Clinic",
  type: 'clinic',
  services: ['Root Canal Treatment', 'Teeth Cleaning', 'Dental Braces', 'Tooth Extraction'],
  city: 'Mumbai',
  location: 'Bandra West, Mumbai',
  whatsappNumber: '919876543210',
  description: 'Premium dental care with modern equipment and experienced doctors. We provide painless treatments with the latest technology.',
  operatingHours: {
    monday: '9:00 AM - 8:00 PM',
    tuesday: '9:00 AM - 8:00 PM',
    wednesday: '9:00 AM - 8:00 PM',
    thursday: '9:00 AM - 8:00 PM',
    friday: '9:00 AM - 8:00 PM',
    saturday: '9:00 AM - 6:00 PM',
    sunday: 'Closed'
  },
  rating: 4.8,
  totalReviews: 156
}

const industryIcons = {
  clinic: Stethoscope,
  coaching: GraduationCap,
  real_estate: Home,
  local_service: Wrench
}

const industryColors = {
  clinic: 'from-green-500 to-emerald-500',
  coaching: 'from-blue-500 to-cyan-500',
  real_estate: 'from-purple-500 to-pink-500',
  local_service: 'from-orange-500 to-red-500'
}

export default function MiniWebsiteContent({ slug }: { slug: string }) {
  const [showChat, setShowChat] = useState(false)
  const Icon = industryIcons[mockBusiness.type as keyof typeof industryIcons]
  const colorGradient = industryColors[mockBusiness.type as keyof typeof industryColors]

  useEffect(() => {
    // Auto-open chat after 3 seconds
    const timer = setTimeout(() => {
      setShowChat(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <FloatingElements />
      
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <FadeInView>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, type: "spring" }}
                className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-r ${colorGradient} rounded-2xl flex items-center justify-center`}
              >
                <Icon className="w-10 h-10 text-white" />
              </motion.div>
            </FadeInView>

            <FadeInView delay={0.2}>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
                {mockBusiness.name}
              </h1>
            </FadeInView>

            <FadeInView delay={0.3}>
              <div className="flex items-center justify-center space-x-2 mb-6">
                <MapPin className="w-5 h-5 text-blue-400" />
                <span className="text-xl text-gray-300">{mockBusiness.location}</span>
              </div>
            </FadeInView>

            <FadeInView delay={0.4}>
              <div className="flex items-center justify-center space-x-4 mb-8">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${i < Math.floor(mockBusiness.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} 
                    />
                  ))}
                  <span className="text-white ml-2">{mockBusiness.rating}</span>
                  <span className="text-gray-400">({mockBusiness.totalReviews} reviews)</span>
                </div>
              </div>
            </FadeInView>

            <FadeInView delay={0.5}>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                {mockBusiness.description}
              </p>
            </FadeInView>

            <FadeInView delay={0.6}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="gradient" 
                  size="xl" 
                  className="group"
                  onClick={() => setShowChat(true)}
                >
                  <MessageCircle className="mr-2 w-5 h-5" />
                  Chat with us now
                </Button>
                <Button 
                  variant="outline" 
                  size="xl" 
                  className="border-white/20 text-white hover:bg-white/10"
                  onClick={() => window.open(`https://wa.me/${mockBusiness.whatsappNumber}`, '_blank')}
                >
                  <Phone className="mr-2 w-5 h-5" />
                  Call Now
                </Button>
              </div>
            </FadeInView>
          </div>
        </section>

        {/* Services Section */}
        <section className="px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <FadeInView className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">Our Services</h2>
              <p className="text-xl text-gray-300">
                Professional services tailored to your needs
              </p>
            </FadeInView>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockBusiness.services.map((service, index) => (
                <FadeInView key={index} delay={index * 0.1}>
                  <Card variant="glass" className="h-full group hover:scale-105 transition-all duration-300">
                    <CardContent className="p-6 text-center">
                      <div className={`w-12 h-12 mx-auto mb-4 bg-gradient-to-r ${colorGradient} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">{service}</h3>
                      <p className="text-gray-300 text-sm">
                        Professional {service.toLowerCase()} with modern equipment and experienced staff
                      </p>
                    </CardContent>
                  </Card>
                </FadeInView>
              ))}
            </div>
          </div>
        </section>

        {/* Operating Hours */}
        <section className="px-6 py-20">
          <div className="max-w-4xl mx-auto">
            <FadeInView className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">Operating Hours</h2>
              <p className="text-xl text-gray-300">
                We're here when you need us
              </p>
            </FadeInView>

            <FadeInView delay={0.2}>
              <Card variant="glass" className="max-w-2xl mx-auto">
                <CardContent className="p-8">
                  <div className="space-y-4">
                    {Object.entries(mockBusiness.operatingHours).map(([day, hours]) => (
                      <div key={day} className="flex items-center justify-between py-2 border-b border-white/10 last:border-b-0">
                        <div className="flex items-center space-x-3">
                          <Clock className="w-5 h-5 text-blue-400" />
                          <span className="text-white font-medium capitalize">{day}</span>
                        </div>
                        <span className={`text-sm ${hours === 'Closed' ? 'text-red-400' : 'text-green-400'}`}>
                          {hours}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </FadeInView>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="px-6 py-20">
          <div className="max-w-4xl mx-auto">
            <FadeInView>
              <Card variant="glass" className="text-center">
                <CardContent className="p-12">
                  <h2 className="text-4xl font-bold text-white mb-4">
                    Ready to Get Started?
                  </h2>
                  <p className="text-xl text-gray-300 mb-8">
                    Chat with us now or give us a call. We're here to help!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      variant="gradient" 
                      size="xl" 
                      className="group"
                      onClick={() => setShowChat(true)}
                    >
                      <MessageCircle className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                      Start Chat
                    </Button>
                    <Button 
                      variant="outline" 
                      size="xl" 
                      className="border-white/20 text-white hover:bg-white/10"
                      onClick={() => window.open(`https://wa.me/${mockBusiness.whatsappNumber}`, '_blank')}
                    >
                      <Phone className="mr-2 w-5 h-5" />
                      WhatsApp
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </FadeInView>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 py-12 border-t border-white/10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className={`w-8 h-8 bg-gradient-to-r ${colorGradient} rounded-lg flex items-center justify-center`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">{mockBusiness.name}</span>
            </div>
            <p className="text-gray-400 mb-4">
              {mockBusiness.location}
            </p>
            <p className="text-gray-500 text-sm">
              Powered by AutoLead AI
            </p>
          </div>
        </footer>
      </div>

      {/* Chat Widget Integration */}
      {showChat && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md h-[600px] flex flex-col overflow-hidden"
          >
            {/* Chat Header */}
            <div className={`bg-gradient-to-r ${colorGradient} text-white p-4 flex items-center justify-between`}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">{mockBusiness.name}</h3>
                  <p className="text-sm opacity-90">Typically replies instantly</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowChat(false)}
                className="text-white hover:bg-white/20"
              >
                ×
              </Button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 bg-gray-50 overflow-y-auto">
              <div className="flex items-start space-x-3 mb-4">
                <div className={`w-8 h-8 bg-gradient-to-r ${colorGradient} rounded-full flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm max-w-xs">
                  <p className="text-sm text-gray-800">
                    Hi! Welcome to {mockBusiness.name}. How can we help you today? 👋
                  </p>
                </div>
              </div>
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t bg-white">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
                <Button size="sm" className={`bg-gradient-to-r ${colorGradient} rounded-full`}>
                  <MessageCircle className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}