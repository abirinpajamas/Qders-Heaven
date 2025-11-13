import { CreditCard, CheckCircle, Clock, XCircle } from 'lucide-react'

const PaymentDetails = () => {
  const payments = [
    {
      id: 1,
      transactionId: 'TXN-2024-001',
      tenant: 'Ahmed Rahman',
      unit: 'Unit 2',
      amount: 31800,
      date: '2024-01-28',
      method: 'Bank Transfer',
      status: 'Completed'
    },
    {
      id: 2,
      transactionId: 'TXN-2024-002',
      tenant: 'Nasrin Akter',
      unit: 'Unit 7',
      amount: 31800,
      date: '2024-01-27',
      method: 'Cash',
      status: 'Completed'
    },
    {
      id: 3,
      transactionId: 'TXN-2024-003',
      tenant: 'Fatima Begum',
      unit: 'Unit 5',
      amount: 31800,
      date: '2024-01-26',
      method: 'Online Payment',
      status: 'Pending'
    },
    {
      id: 4,
      transactionId: 'TXN-2024-004',
      tenant: 'Karim Hossain',
      unit: 'Unit 1',
      amount: 31800,
      date: '2024-01-25',
      method: 'Bank Transfer',
      status: 'Failed'
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Payment Details</h1>
        <p className="text-gray-600 mt-1">Track all payment transactions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Collected</p>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">৳2,54,400</h3>
          <p className="text-sm text-green-600 mt-2">This month</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Pending</p>
            <Clock className="w-5 h-5 text-yellow-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">৳63,600</h3>
          <p className="text-sm text-yellow-600 mt-2">2 payments</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Failed</p>
            <XCircle className="w-5 h-5 text-red-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">৳31,800</h3>
          <p className="text-sm text-red-600 mt-2">1 payment</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Transactions</p>
            <CreditCard className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">156</h3>
          <p className="text-sm text-blue-600 mt-2">All time</p>
        </div>
      </div>

      <div className="table-container">
        <table className="w-full">
          <thead className="table-header">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">Transaction ID</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Tenant</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Unit</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Amount</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Method</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="table-row">
                <td className="px-6 py-4 text-sm font-medium text-gray-700">{payment.transactionId}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{payment.tenant}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{payment.unit}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-700">৳{payment.amount.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{payment.date}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{payment.method}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    payment.status === 'Completed' 
                      ? 'bg-green-100 text-green-700' 
                      : payment.status === 'Pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {payment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PaymentDetails
