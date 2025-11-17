import { User, Receipt, DollarSign, FileText, TrendingUp, TrendingDown } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

const TenantPortal = () => {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const tenantId = useMemo(() => {
    const params = new URLSearchParams(window.location.search)
    return params.get('tenant_id') || '1'
  }, [])

  const stats = [
    {
      title: 'Bills Due',
      value: data.due_bills_count || '0',
      change: data.due_change || '+0%'
,      trend: (data.due_trend || 'up'),
      icon: FileText,
      color: 'bg-orange-500'
    },
    {
      title: 'Paid This Month',
      value: `৳${data.paid_this_month || '0'}`,
      change: data.paid_change || '+0%'
,      trend: (data.paid_trend || 'up'),
      icon: DollarSign,
      color: 'bg-green-600'
    },
    {
      title: 'Last Payment',
      value: data.last_payment_amount ? `৳${data.last_payment_amount}` : '৳0',
      change: data.last_payment_date ? new Date(data.last_payment_date).toLocaleDateString() : 'N/A',
      trend: 'up',
      icon: Receipt,
      color: 'bg-blue-600'
    },
    {
      title: 'Tenant',
      value: data.tenant_name || `#${tenantId}`,
      change: data.unit_label || 'Current Unit',
      trend: 'up',
      icon: User,
      color: 'bg-purple-600'
    }
  ]

  useEffect(() => {
    setLoading(true)
    fetch(`http://localhost/qadersheavennew/php/getTenantDashboard.php?tenant_id=${tenantId}`)
      .then((res) => res.json())
      .then((payload) => {
        setData(payload || {})
        setLoading(false)
        console.log(payload)
      })
      .catch((e) => {
        setError('Failed to load tenant dashboard')
        setLoading(false)
        console.error(e)
      })
  }, [tenantId])

  if (loading) {
    return <div className="card">Loading...</div>
  }

  if (error) {
    return <div className="card text-red-600">{error}</div>
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Tenant Portal</h1>
        <p className="text-gray-600">Overview of your bills and payments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
                <div className="flex items-center mt-2">
                  {stat.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className={`${stat.color} p-4 rounded-lg`}>
                <stat.icon className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a className="btn-primary" href={`/tenants-bill?tenant_id=${tenantId}`}>View Bills</a>
          <a className="btn-success" href={`/payment-details?tenant_id=${tenantId}`}>Payment History</a>
          <button className="btn-secondary" onClick={() => window.print()}>Download Statement</button>
        </div>
      </div>
    </div>
  )
}

export default TenantPortal
