import { Receipt, Download, Eye, Send } from 'lucide-react'

const TenantsBill = () => {
  const bills = [
    {
      id: 1,
      billNo: 'BILL-2024-001',
      tenant: 'Ahmed Rahman',
      unit: 'Unit 2',
      month: 'January 2024',
      amount: 31800,
      dueDate: '2024-02-05',
      status: 'Paid'
    },
    {
      id: 2,
      billNo: 'BILL-2024-002',
      tenant: 'Fatima Begum',
      unit: 'Unit 5',
      month: 'January 2024',
      amount: 31800,
      dueDate: '2024-02-05',
      status: 'Pending'
    },
    {
      id: 3,
      billNo: 'BILL-2024-003',
      tenant: 'Karim Hossain',
      unit: 'Unit 1',
      month: 'January 2024',
      amount: 31800,
      dueDate: '2024-02-05',
      status: 'Overdue'
    },
    {
      id: 4,
      billNo: 'BILL-2024-004',
      tenant: 'Nasrin Akter',
      unit: 'Unit 7',
      month: 'January 2024',
      amount: 31800,
      dueDate: '2024-02-05',
      status: 'Paid'
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Tenants Bill</h1>
        <p className="text-gray-600 mt-1">View and manage tenant bills</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <p className="text-blue-100 mb-2">Total Bills</p>
          <h3 className="text-3xl font-bold">156</h3>
        </div>
        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <p className="text-green-100 mb-2">Paid</p>
          <h3 className="text-3xl font-bold">132</h3>
        </div>
        <div className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <p className="text-yellow-100 mb-2">Pending</p>
          <h3 className="text-3xl font-bold">21</h3>
        </div>
        <div className="card bg-gradient-to-br from-red-500 to-red-600 text-white">
          <p className="text-red-100 mb-2">Overdue</p>
          <h3 className="text-3xl font-bold">3</h3>
        </div>
      </div>

      <div className="table-container">
        <table className="w-full">
          <thead className="table-header">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">Bill No</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Tenant</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Unit</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Month</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Amount</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Due Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill) => (
              <tr key={bill.id} className="table-row">
                <td className="px-6 py-4 text-sm font-medium text-gray-700">{bill.billNo}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{bill.tenant}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{bill.unit}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{bill.month}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-700">৳{bill.amount.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{bill.dueDate}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    bill.status === 'Paid' 
                      ? 'bg-green-100 text-green-700' 
                      : bill.status === 'Pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {bill.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <button className="btn-icon bg-green-100 hover:bg-green-200 text-green-700">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="btn-icon bg-blue-100 hover:bg-blue-200 text-blue-700">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="btn-icon bg-purple-100 hover:bg-purple-200 text-purple-700">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TenantsBill
