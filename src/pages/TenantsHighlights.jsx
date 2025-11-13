import { Star, Award, TrendingUp, AlertCircle } from 'lucide-react'

const TenantsHighlights = () => {
  const highlights = [
    {
      id: 1,
      tenant: 'Ahmed Rahman',
      unit: 'Unit 2',
      type: 'Excellent Payment Record',
      description: 'Never missed a payment in 12 months',
      icon: Award,
      color: 'green'
    },
    {
      id: 2,
      tenant: 'Fatima Begum',
      unit: 'Unit 5',
      type: 'Long-term Tenant',
      description: 'Residing for over 2 years',
      icon: Star,
      color: 'blue'
    },
    {
      id: 3,
      tenant: 'Karim Hossain',
      unit: 'Unit 1',
      type: 'Early Payment',
      description: 'Always pays before due date',
      icon: TrendingUp,
      color: 'purple'
    },
    {
      id: 4,
      tenant: 'Nasrin Akter',
      unit: 'Unit 7',
      type: 'Pending Payment',
      description: 'Payment overdue by 5 days',
      icon: AlertCircle,
      color: 'red'
    }
  ]

  const colorClasses = {
    green: 'bg-green-100 text-green-700 border-green-200',
    blue: 'bg-blue-100 text-blue-700 border-blue-200',
    purple: 'bg-purple-100 text-purple-700 border-purple-200',
    red: 'bg-red-100 text-red-700 border-red-200'
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Tenant's Highlights</h1>
        <p className="text-gray-600 mt-1">Notable tenant activities and achievements</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {highlights.map((highlight) => (
          <div key={highlight.id} className={`card border-l-4 ${colorClasses[highlight.color]}`}>
            <div className="flex items-start space-x-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[highlight.color]}`}>
                <highlight.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800 mb-1">{highlight.type}</h3>
                <p className="text-sm text-gray-600 mb-2">{highlight.tenant} - {highlight.unit}</p>
                <p className="text-sm text-gray-700">{highlight.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Tenant Performance Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-green-50 rounded-lg">
            <Award className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">12</p>
            <p className="text-sm text-gray-600 mt-1">Excellent Tenants</p>
          </div>
          <div className="text-center p-6 bg-blue-50 rounded-lg">
            <Star className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">8</p>
            <p className="text-sm text-gray-600 mt-1">Long-term Tenants</p>
          </div>
          <div className="text-center p-6 bg-purple-50 rounded-lg">
            <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">15</p>
            <p className="text-sm text-gray-600 mt-1">Early Payers</p>
          </div>
          <div className="text-center p-6 bg-red-50 rounded-lg">
            <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-600">3</p>
            <p className="text-sm text-gray-600 mt-1">Pending Issues</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TenantsHighlights
