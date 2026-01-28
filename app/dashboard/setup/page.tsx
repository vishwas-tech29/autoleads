'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import FloatingElements from '@/components/3d/FloatingElements'
import { 
  Bot, 
  Building2, 
  MapPin, 
  Phone, 
  Clock, 
  Globe, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle,
  Stethoscope,
  GraduationCap,
  Home,
  Wrench
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const businessTypes = [
  {
    id: 'clinic',
    name: 'Medical Clinic',
    icon: Stethoscope,
    description: 'Dental, physiotherapy, general practice',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'coaching',
    name: 'Coaching Institute',
    icon: GraduationCap,
    description: 'Test prep, skills training, education',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'real_estate',
    name: 'Real Estate',
    icon: Home,
    description: 'Property sales, rentals, consulting',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'local_service',
    name: 'Local Service',
    icon: Wrench,
    description: 'Plumbers, electricians, salons',
    color: 'from-orange-500 to-red-500'
  }
]

export default function BusinessSetupPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    services: [''],
    city: '',
    whatsappNumber: '',
    hasWebsite: null as boolean | null,
    websiteUrl: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const totalSteps = 4

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleServiceChange = (index: number, value: string) => {
    const newServices = [...formData.services]
    newServices[index] = value
    setFormData({ ...formData, services: newServices })
  }

  const addService = () => {
    if (formData.services.length < 10) {
      setFormData({ ...formData, services: [...formData.services, ''] })
    }
  }

  const removeService = (index: number) => {
    if (formData.services.length > 1) {
      const newServices = formData.services.filter((_, i) => i !== index)
      setFormData({ ...formData, services: newServices })
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    
    try {
      // TODO: Implement business creation
      toast.success('Business setup completed!')
      router.push('/dashboard')
    } catch (error) {
      toast.error('Failed to setup business')
    } finally {
      setIsLoading(false)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.businessName.trim().length >= 3
      case 2:
        return formData.businessType !== ''
      case 3:
        return formData.services.filter(s => s.trim()).length >= 1 && 
               formData.city.trim().length >= 2 &&
               /^[6-9]\d{9}$/.test(formData.whatsappNumber.replace(/\D/g, ''))
      case 4:
        return formData.hasWebsite !== null
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <FloatingElements />
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 group mb-6">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center"
            >
              <Bot className="w-6 h-6 text-white" />
            </motion.div>
            <span className="text-2xl font-bold gradient-text">AutoLead AI</span>
          </Link>
          
          <h1 className="text-4xl font-bold text-white mb-2">
            Let's Set Up Your Business
          </h1>
          <p className="text-gray-300">
            This will take less than 5 minutes
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-300">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm text-gray-300">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Form Steps */}
        <Card variant="glass" className="backdrop-blur-xl">
          <CardContent className="p-8">
            <AnimatePresence mode="wait">
              {/* Step 1: Business Name */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <Building2 className="w-16 h-16 mx-auto mb-4 text-blue-400" />
                    <h2 className="text-2xl font-bold text-white mb-2">
                      What's your business name?
                    </h2>
                    <p className="text-gray-300">
                      This will be displayed to your visitors
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Input
                      placeholder="e.g., Dr. Sharma's Dental Clinic"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      className="text-lg h-12 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-500"
                    />
                    <p className="text-sm text-gray-400">
                      Minimum 3 characters required
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Business Type */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2">
                      What type of business is this?
                    </h2>
                    <p className="text-gray-300">
                      This helps us customize the AI for your industry
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {businessTypes.map((type) => (
                      <motion.div
                        key={type.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setFormData({ ...formData, businessType: type.id })}
                        className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                          formData.businessType === type.id
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-white/20 bg-white/5 hover:border-white/40'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${type.color} flex items-center justify-center mb-4`}>
                          <type.icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">{type.name}</h3>
                        <p className="text-gray-300 text-sm">{type.description}</p>
                        {formData.businessType === type.id && (
                          <CheckCircle className="w-6 h-6 text-blue-400 mt-2" />
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Services & Contact */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2">
                      Tell us about your services
                    </h2>
                    <p className="text-gray-300">
                      What services do you offer? We'll use this to train your AI
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <label className="text-sm font-medium text-gray-300">Services Offered</label>
                      {formData.services.map((service, index) => (
                        <div key={index} className="flex space-x-2">
                          <Input
                            placeholder={`Service ${index + 1}`}
                            value={service}
                            onChange={(e) => handleServiceChange(index, e.target.value)}
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-500"
                          />
                          {formData.services.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => removeService(index)}
                              className="border-white/20 text-white hover:bg-red-500/20"
                            >
                              ×
                            </Button>
                          )}
                        </div>
                      ))}
                      {formData.services.length < 10 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addService}
                          className="w-full border-white/20 text-white hover:bg-white/10"
                        >
                          + Add Service
                        </Button>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">City</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Input
                            placeholder="e.g., Mumbai"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">WhatsApp Number</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Input
                            placeholder="9876543210"
                            value={formData.whatsappNumber}
                            onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-500"
                          />
                        </div>
                        <p className="text-xs text-gray-400">
                          Enter 10-digit mobile number without country code
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Website */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <Globe className="w-16 h-16 mx-auto mb-4 text-blue-400" />
                    <h2 className="text-2xl font-bold text-white mb-2">
                      Do you have a website?
                    </h2>
                    <p className="text-gray-300">
                      We'll either give you a widget to embed or create a mini-website for you
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFormData({ ...formData, hasWebsite: true })}
                      className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.hasWebsite === true
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-white/20 bg-white/5 hover:border-white/40'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mb-4">
                        <Globe className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">Yes, I have a website</h3>
                      <p className="text-gray-300 text-sm">
                        We'll give you a simple code to add to your existing website
                      </p>
                      {formData.hasWebsite === true && (
                        <CheckCircle className="w-6 h-6 text-blue-400 mt-2" />
                      )}
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFormData({ ...formData, hasWebsite: false })}
                      className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.hasWebsite === false
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-white/20 bg-white/5 hover:border-white/40'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                        <Bot className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">No, create one for me</h3>
                      <p className="text-gray-300 text-sm">
                        We'll create a beautiful mini-website you can share anywhere
                      </p>
                      {formData.hasWebsite === false && (
                        <CheckCircle className="w-6 h-6 text-blue-400 mt-2" />
                      )}
                    </motion.div>
                  </div>

                  {formData.hasWebsite === true && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-2"
                    >
                      <label className="text-sm font-medium text-gray-300">Website URL (Optional)</label>
                      <Input
                        placeholder="https://yourwebsite.com"
                        value={formData.websiteUrl}
                        onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-500"
                      />
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/10">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={currentStep === 1}
                className="border-white/20 text-white hover:bg-white/10"
              >
                <ArrowLeft className="mr-2 w-4 h-4" />
                Previous
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  variant="gradient"
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="group"
                >
                  Next
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              ) : (
                <Button
                  variant="gradient"
                  onClick={handleSubmit}
                  disabled={!canProceed() || isLoading}
                  className="group"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                  ) : (
                    <>
                      Complete Setup
                      <CheckCircle className="ml-2 w-4 h-4 group-hover:scale-110 transition-transform" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}