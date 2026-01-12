import { Home, User, Receipt, DollarSign, FileText, TrendingUp, TrendingDown, Filter, CreditCard } from 'lucide-react'
import { useEffect, useState } from 'react'
import TenantLayout from '../components/TenantLayout'

const TenantPortal = () => {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [bills, setBills] = useState([])
  const [payments, setPayments] = useState([])
  const [billsLoading, setBillsLoading] = useState(true)
  const [paymentsLoading, setPaymentsLoading] = useState(true)
  const [billFilter, setBillFilter] = useState('pending') // 'pending' or 'all'
  const [activeView, setActiveView] = useState('bills') // 'bills' or 'payments'

  useEffect(() => {
    setLoading(true)
    fetch('http://localhost/qadersheavennew/php/getTenantDashboard.php', {
      method: 'GET',
      credentials: 'include'
    })
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
  }, [])

  // Fetch tenant bills
  useEffect(() => {
    setBillsLoading(true)
    fetch('http://localhost/qadersheavennew/php/getTenantBills.php', {
      method: 'GET',
      credentials: 'include'
    })
      .then((res) => res.json())
      .then((payload) => {
        if (payload.success) {
          setBills(payload.bills || [])
        }
        setBillsLoading(false)
      })
      .catch((e) => {
        console.error('Failed to load bills:', e)
        setBillsLoading(false)
      })
  }, [])

  // Fetch tenant payments
  useEffect(() => {
    setPaymentsLoading(true)
    fetch('http://localhost/qadersheavennew/php/getTenantPayments.php', {
      method: 'GET',
      credentials: 'include'
    })
      .then((res) => res.json())
      .then((payload) => {
        if (payload.success) {
          setPayments(payload.payments || [])
        }
        setPaymentsLoading(false)
      })
      .catch((e) => {
        console.error('Failed to load payments:', e)
        setPaymentsLoading(false)
      })
  }, [])

  // Filter bills based on selected filter
  const filteredBills = bills.filter(bill => {
    if (billFilter === 'pending') {
      return bill.status === 'unpaid' || bill.status === 'partially paid' || bill.status === 'overdue'
    }
    return true // Show all bills
  })

  const stats = [
    {
      flag: true,
      title: 'Unit',
      value: data.unit_label || 'Current Unit',
      trend: 'up',
      icon: Home,
      color: 'bg-purple-600'
    },
    {
      title: 'Bills Due',
      value: data.due_bills_count || '0',
      change: data.due_change || '+0%',
      trend: (data.due_trend || 'up'),
      icon: FileText,
      color: 'bg-orange-500'
    },
    {
      title: 'Paid This Month',
      value: `৳${data.paid_this_month || '0'}`,
      change: data.paid_change || '+0%',
      trend: (data.paid_trend || 'up'),
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
    }
    
  ]

  if (loading) {
    return <div className="card">Loading...</div>
  }

  if (error) {
    return <div className="card text-red-600">{error}</div>
  }

  return (
    <TenantLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="card">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome back, {data.tenant_name || 'Tenant'}!
          </h1>
          <p className="text-gray-600">Here's your rental overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
                  
                </div>
                <div className={`${stat.color} p-4 rounded-lg`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bills and Payments Section */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            {/* Left: Bills/Payments Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveView('bills')}
                className={`flex items-center space-x-2 px-3 py-2 rounded text-sm font-medium transition-colors ${
                  activeView === 'bills'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Bills</span>
              </button>
              <button
                onClick={() => setActiveView('payments')}
                className={`flex items-center space-x-2 px-3 py-2 rounded text-sm font-medium transition-colors ${
                  activeView === 'payments'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Payments</span>
              </button>
            </div>
            
            {/* Right: Pending/All Bills Toggle (only show in bills view) */}
            {activeView === 'bills' && (
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600"></label>
                <select
                  value={billFilter}
                  onChange={(e) => setBillFilter(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="all">All Bills</option>
                </select>
              </div>
            )}
          </div>
          
          {/* Bills View */}
          {activeView === 'bills' && (
            <>
              {billsLoading ? (
                <div className="text-center py-8 text-gray-500">Loading bills...</div>
              ) : filteredBills.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {billFilter === 'pending' ? 'No pending bills found' : 'No bills found'}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredBills.map((bill) => (
                        <tr key={bill.bill_id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{bill.bill_id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(bill.period_start).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">৳{bill.amount.toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">৳{bill.paid.toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">৳{bill.remaining.toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              bill.status === 'paid' ? 'bg-green-100 text-green-800' :
                              bill.status === 'unpaid' ? 'bg-red-100 text-red-800' :
                              bill.status === 'partially paid' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-orange-100 text-orange-800'
                            }`}>
                              {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* Payments View */}
          {activeView === 'payments' && (
            <>
              {paymentsLoading ? (
                <div className="text-center py-8 text-gray-500">Loading payments...</div>
              ) : payments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No payments found</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {payments.map((payment) => (
                        <tr key={payment.payment_id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{payment.payment_id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(payment.paid_on).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">৳{payment.amount.toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800`}>
                              {payment.payment_method.charAt(0).toUpperCase() + payment.payment_method.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.reference || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.note || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>

        <div className="card">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <button className="btn-secondary" onClick={() => window.print()}>Download Statement</button>
          </div>
        </div>
      </div>
    </TenantLayout>
  )
}

export default TenantPortal
