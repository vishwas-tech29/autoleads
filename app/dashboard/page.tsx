'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import FloatingElements from '@/components/3d/FloatingElements'
import AnimatedCounter from '@/components/animations/AnimatedCounter'
import FadeInView from '@/components/animations/FadeInView'
import { 
  Bot, 
  MessageCircle, 
  Users, 
  TrendingUp, 
  Settings,
  Copy,
  ExternalLink,
  Smartphone,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap,
  Globe,
  BarChart3,
  Bell
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

// Mock data - replace with real data from Supabase
const mockBusiness = {
  id: '123',
  name: "Dr. Sharma's Dental Clinic",
  type: 'clinic',
  slug: 'dr-sharmas-dental-clinic-mumbai',
  hasWebsite: true,
  planStatus: 'trial',
  trialEndsAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
}

const mockStats = {
  totalLeads: 23,
  todayLeads: 5,
  totalMessages: 156,
  todayMessages: 12,
  responseRate: 98,
  avgResponseTime: 2.3
}

const mockRecentLeads = [
  {
    id: '1',
    name: 'Rahul Kumar',
    phone: '9876543210',
    intent: 'Root canal treatment',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    status: 'new'
  },
  {
    id: '2',
    name: 'Priya Singh',
    phone: '9876543211',
    intent: 'Teeth cleaning appointment',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    status: 'contacted'
  },
  {
    id: '3',
    name: 'Amit Patel',
    phone: '9876543212',
    intent: 'Dental consultation',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    status: 'qualified'
  }
]

export default function DashboardPage() {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const trialEnd = mockBusiness.trialEndsAt.getTime()
      const distance = trialEnd - now

      if (distance > 0) {
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        setTimeLeft(`${hours}h ${minutes}m`)
      } else {
        setTimeLeft('Expired')
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const copyWidgetCode = () => {
    const widgetCode = `<script src="https://autolead.ai/widget.js" data-business-id="${mockBusiness.id}" data-position="bottom-right"></script>`
    navigator.clipboard.writeText(widgetCode)
    toast.success('Widget code copied to clipboard!')
  }

  const copyMiniWebsiteUrl = () => {
    const url = `https://autolead.ai/biz/${mockBusiness.slug}`
    navigator.clipboard.writeText(url)
    toast.success('Mini-website URL copied to clipboard!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <FloatingElements />
      
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/10 backdrop-blur-md bg-white/5">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/" className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xl font-bold gradient-text">AutoLead AI</span>
                </Link>
                <div className="hidden md:block">
                  <h1 className="text-xl font-semibold text-white">{mockBusiness.name}</h1>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {mockBusiness.planStatus === 'trial' && (
                  <div className="flex items-center space-x-2 px-3 py-1 bg-orange-500/20 border border-orange-500/30 rounded-full">
                    <Clock className="w-4 h-4 text-orange-400" />
                    <span className="text-sm text-orange-300">Trial: {timeLeft}</span>
                  </div>
                )}
                <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
                <Button variant="gradient" size="sm">
                  <Zap className="w-4 h-4 mr-2" />
                  Upgrade
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Trial Banner */}
          {mockBusiness.planStatus === 'trial' && (
            <FadeInView>
              <Card variant="glass" className="mb-8 border-orange-500/30 bg-orange-500/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                        <AlertCircle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">Free Trial Active</h3>
                        <p className="text-orange-200">
                          {timeLeft} remaining • 15 messages left • 3 leads left
                        </p>
                      </div>
                    </div>
                    <Button variant="gradient" size="lg">
                      Upgrade to Pro - ₹999/month
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </FadeInView>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <FadeInView delay={0.1}>
              <Card variant="floating" className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-200 text-sm font-medium">Total Leads</p>
                      <AnimatedCounter 
                        end={mockStats.totalLeads} 
                        className="text-3xl font-bold text-white"
                      />
                      <p className="text-blue-300 text-xs">
                        +<AnimatedCounter end={mockStats.todayLeads} /> today
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-500/30 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeInView>

            <FadeInView delay={0.2}>
              <Card variant="floating" className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-200 text-sm font-medium">Messages</p>
                      <AnimatedCounter 
                        end={mockStats.totalMessages} 
                        className="text-3xl font-bold text-white"
                      />
                      <p className="text-green-300 text-xs">
                        +<AnimatedCounter end={mockStats.todayMessages} /> today
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-500/30 rounded-lg flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeInView>

            <FadeInView delay={0.3}>
              <Card variant="floating" className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-200 text-sm font-medium">Response Rate</p>
                      <div className="text-3xl font-bold text-white">
                        <AnimatedCounter end={mockStats.responseRate} suffix="%" />
                      </div>
                      <p className="text-purple-300 text-xs">Excellent!</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-500/30 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-purple-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeInView>

            <FadeInView delay={0.4}>
              <Card variant="floating" className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-200 text-sm font-medium">Avg Response</p>
                      <div className="text-3xl font-bold text-white">
                        <AnimatedCounter end={mockStats.avgResponseTime} suffix="s" />
                      </div>
                      <p className="text-orange-300 text-xs">Lightning fast</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-500/30 rounded-lg flex items-center justify-center">
                      <Zap className="w-6 h-6 text-orange-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeInView>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Deployment Options */}
            <FadeInView delay={0.5}>
              <Card variant="glass">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Globe className="w-5 h-5 mr-2" />
                    Deployment Options
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Choose how you want to capture leads
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockBusiness.hasWebsite ? (
                    <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-white">Widget Code</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={copyWidgetCode}
                          className="border-blue-500/30 text-blue-300 hover:bg-blue-500/20"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Code
                        </Button>
                      </div>
                      <p className="text-blue-200 text-sm mb-3">
                        Add this code to your website before the closing &lt;/body&gt; tag
                      </p>
                      <div className="bg-black/30 p-3 rounded text-xs text-gray-300 font-mono overflow-x-auto">
                        {`<script src="https://autolead.ai/widget.js" data-business-id="${mockBusiness.id}"></script>`}
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-white">Mini-Website</h3>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={copyMiniWebsiteUrl}
                            className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy URL
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Visit
                          </Button>
                        </div>
                      </div>
                      <p className="text-purple-200 text-sm mb-3">
                        Share this beautiful mini-website anywhere
                      </p>
                      <div className="bg-black/30 p-3 rounded text-sm text-gray-300 font-mono">
                        https://autolead.ai/biz/{mockBusiness.slug}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2 text-green-400">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm">AI Assistant is active and ready</span>
                  </div>
                </CardContent>
              </Card>
            </FadeInView>

            {/* Recent Leads */}
            <FadeInView delay={0.6}>
              <Card variant="glass">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <div className="flex items-center">
                      <Smartphone className="w-5 h-5 mr-2" />
                      Recent Leads
                    </div>
                    <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                      View All
                    </Button>
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Latest qualified leads from your AI assistant
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockRecentLeads.map((lead, index) => (
                    <motion.div
                      key={lead.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold text-white">{lead.name}</h4>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              lead.status === 'new' ? 'bg-blue-500/20 text-blue-300' :
                              lead.status === 'contacted' ? 'bg-orange-500/20 text-orange-300' :
                              'bg-green-500/20 text-green-300'
                            }`}>
                              {lead.status}
                            </span>
                          </div>
                          <p className="text-gray-300 text-sm">{lead.phone}</p>
                          <p className="text-gray-400 text-xs">{lead.intent}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-400 text-xs">
                            {new Date(lead.createdAt).toLocaleTimeString('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                          <Button variant="outline" size="sm" className="mt-2 border-white/20 text-white hover:bg-white/10">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            Chat
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {mockRecentLeads.length === 0 && (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400">No leads yet</p>
                      <p className="text-gray-500 text-sm">Share your widget or mini-website to start capturing leads</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </FadeInView>
          </div>

          {/* Quick Actions */}
          <FadeInView delay={0.7} className="mt-8">
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
                <CardDescription className="text-gray-300">
                  Common tasks to manage your AutoLead AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-auto p-4 border-white/20 text-white hover:bg-white/10 flex-col space-y-2">
                    <BarChart3 className="w-6 h-6" />
                    <span>View Analytics</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 border-white/20 text-white hover:bg-white/10 flex-col space-y-2">
                    <Settings className="w-6 h-6" />
                    <span>Edit Business</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 border-white/20 text-white hover:bg-white/10 flex-col space-y-2">
                    <Bell className="w-6 h-6" />
                    <span>Notifications</span>
                  </Button>
                  <Button variant="gradient" className="h-auto p-4 flex-col space-y-2">
                    <Zap className="w-6 h-6" />
                    <span>Upgrade Plan</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </FadeInView>
        </div>
      </div>
    </div>
  )
}