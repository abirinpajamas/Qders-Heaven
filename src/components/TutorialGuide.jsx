import { useState, useEffect } from 'react'
import { 
  X, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Users, 
  Building2, 
  DoorOpen, 
  UserCheck, 
  FileText, 
  Phone, 
  DollarSign, 
  CheckCircle,
  Play,
  Pause,
  Settings
} from 'lucide-react'

const TutorialGuide = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const tutorialSteps = [
    {
      id: 'admin',
      title: 'Step 1: Add Admin Users',
      description: 'Start by creating admin accounts who will manage the property system.',
      icon: Users,
      color: 'bg-blue-500',
      details: [
        'Navigate to Admin Management',
        'Click "Add New Admin"',
        'Fill in admin details (name, email, role)',
        'Set secure password',
        'Assign appropriate permissions'
      ],
      navigation: '/admin-management',
      tips: 'Super admins have create, delete and edit permissions for all records. So be careful when creating them.'
    },
    {
      id: 'properties',
      title: 'Step 2: Add Properties',
      description: 'Register your rental properties in the system.',
      icon: Building2,
      color: 'bg-green-500',
      details: [
        'Go to Properties section',
        'Click "Add New Property"',
        'Enter property name and address',
        'Set property type (residential/commercial)',
        'Add property photos if available'
      ],
      navigation: '/property',
      tips: 'Include complete address details for accurate reporting.'
    },
    {
      id: 'units',
      title: 'Step 3: Add Units',
      description: 'Create individual rental units within each property.',
      icon: DoorOpen,
      color: 'bg-purple-500',
      details: [
        'Navigate to Units section',
        'Select the property',
        'Click "Add New Unit"',
        'Enter unit number and floor',
        'Set base rent amount',
        'Add unit specifications (size, rooms)'
      ],
      navigation: '/unit-entry',
      tips: 'Use consistent unit numbering (e.g., 101, 201, 301 for floor 1, 2, 3).'
    },
    {
      id: 'tenants',
      title: 'Step 4: Add Tenants',
      description: 'Register tenant information and assign them to units.',
      icon: UserCheck,
      color: 'bg-orange-500',
      details: [
        'Go to Tenants Details',
        'Click "Add New Tenant"',
        'Fill personal information',
        'Upload required documents',
        'Assign to specific unit',
        'Set lease start/end dates'
      ],
      navigation: '/tenants-details',
      tips: 'Keep tenant contact information updated for better communication.'
    },
    
    {
      id: 'bill-generation',
      title: 'Step 5: Generate Bills',
      description: 'Create monthly bills for all tenants automatically.',
      icon: FileText,
      color: 'bg-red-500',
      details: [
        'Go to Tenant Bill Generate',
        'Select billing period',
        'Choose units/tenants',
        'Review rent amounts',
        'Add additional charges if needed',
        'Generate bills in bulk'
      ],
      navigation: '/tenants-bill-generate',
      tips: 'Generate bills at the beginning of each month for consistent cash flow.'
    },
    {
      id: 'service-providers',
      title: 'Step 6: Add Service Providers',
      description: 'Maintain a directory of maintenance and service providers.',
      icon: Phone,
      color: 'bg-cyan-500',
      details: [
        'Navigate to Service Provider Contact',
        'Click "Add Service Provider"',
        'Enter provider details',
        'Add contact information',
        'Specify services offered',
        'Include emergency contacts'
      ],
      navigation: '/service-provider-contact',
      tips: 'Include multiple providers for each service type for backup options.'
    },
    {
      id: 'maintenance-bills',
      title: 'Step 7: Maintenance Bills',
      description: 'Create and track maintenance-related charges.',
      icon: DollarSign,
      color: 'bg-yellow-500',
      details: [
        'Navigate to Maintenance Bills',
        'Click "Add Maintenance Bill"',
        'Select property/unit',
        'Enter maintenance details',
        'Set amount and due date',
        'Assign to responsible party'
      ],
      navigation: '/maintenance-bill',
      tips: 'Document maintenance work details for future reference.'
    },
    {
      id: 'payment-tracking',
      title: 'Step 8: Track Payments & Confirm Bills',
      description: 'Record and monitor all tenant payments with confirmation system.',
      icon: DollarSign,
      color: 'bg-emerald-500',
      details: [
        'Go to Tenants Bill or Maintaince Bill section',
        'View all pending bills in the table',
        'Click "Make Payment" on any pending bill',
        'Fill in payment details (date, amount, method)',
        'Add reference number and notes if needed',
        'Submit payment to confirm and record',
        'View updated bill status automatically'
      ],
      navigation: '/tenants-bill',
      tips: 'Use the payment confirmation feature to instantly update bill status and maintain accurate financial records. The system automatically calculates remaining balances.'
    },
    {
      id: 'system-overview',
      title: 'System Features & Accessibility',
      description: 'Complete overview of all available features and how they help your business.',
      icon: Settings,
      color: 'bg-indigo-500',
      details: [
        '🏠 Home Dashboard: Real-time metrics and recent activities',
        '📊 Reports: Generate financial, tenant, and property reports',
        '💰 Fund Management: Track income, expenses, and revenue',
        '💳 Payment Details: Complete payment history and tracking',
        '🏢 Properties: Manage all rental properties efficiently',
        '🚪 Units: Individual unit management and assignments',
        '👥 Tenants: Complete tenant lifecycle management',
        '📋 Bills: Automated billing and payment tracking',
        '🔧 Service Providers: Maintenance and service contacts',
        '⚙️ Settings: System configuration and preferences'
      ],
      navigation: '/',
      tips: 'Each feature is designed to streamline your property management operations. Use the dashboard for quick insights and detailed sections for comprehensive management.',
      flag: true
    }
  ]

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const goToStep = (stepIndex) => {
    setCurrentStep(stepIndex)
  }

  const toggleAutoPlay = () => {
    setIsPlaying(!isPlaying)
  }

  const currentTutorial = tutorialSteps[currentStep]
  const progress = ((currentStep + 1) / (tutorialSteps.length-1)) * 100

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && currentStep < tutorialSteps.length - 1) {
      const timer = setTimeout(() => {
        nextStep()
      }, 5000) // 5 seconds per step
      return () => clearTimeout(timer)
    }
  }, [isPlaying, currentStep])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header with Navigation */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${currentTutorial.color}`}>
              <currentTutorial.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{currentTutorial.title}</h2>
              <p className="text-gray-600">{currentTutorial.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {/* Navigation Buttons */}
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={nextStep}
              disabled={currentStep === tutorialSteps.length - 1}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentStep === tutorialSteps.length - 2 ? <span>Accesibility</span> : <span>Next</span>}
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        {!currentTutorial.flag && (
        <div className="px-6 py-3 bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">
              Step {currentStep + 1} of {tutorialSteps.length-1}
            </span>
            <span className="text-sm font-medium text-gray-800">{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        )}
        {/* Content */}
        <div className="flex-1 p-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* How to Complete This Step */}
            <div className="md:col-span-2 space-y-4">
              {!currentTutorial.flag && (
                <h3 className="text-lg font-semibold text-gray-800">How to Complete This Step</h3>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentTutorial.details.map((detail, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium mt-0.5 flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 text-sm">{detail}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips and Quick Access */}
            <div className="space-y-4">
              {/* Pro Tips */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <h4 className="font-semibold text-yellow-800 mb-2 text-sm">💡 Pro Tip</h4>
                <p className="text-yellow-700 text-xs">{currentTutorial.tips}</p>
              </div>

              {/* Quick Navigation */}
              {!currentTutorial.flag && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h4 className="font-semibold text-blue-800 mb-2 text-sm">🔗 Quick Access</h4>
                <p className="text-blue-700 text-xs mb-2">Go directly to this section:</p>
                <button
                  onClick={() => window.location.href = currentTutorial.navigation}
                  className="w-full inline-flex items-center justify-center space-x-2 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                >
                  <span>Open {currentTutorial.title.replace(/Step \d+: /, '')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              )}
            </div>
          </div>
        </div>

        </div>
    </div>
  )
}

export default TutorialGuide
