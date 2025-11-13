import { DollarSign, TrendingUp, TrendingDown, Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react'

const Fund = () => {
  const transactions = [
    { id: 1, type: 'Income', description: 'Rent Payment - Unit 2', amount: 25000, date: '2024-01-28', category: 'Rent' },
    { id: 2, type: 'Expense', description: 'Maintenance - Floor 3', amount: 5000, date: '2024-01-27', category: 'Maintenance' },
    { id: 3, type: 'Income', description: 'Utility Payment - Unit 5', amount: 3500, date: '2024-01-26', category: 'Utility' },
    { id: 4, type: 'Expense', description: 'Security Service', amount: 8000, date: '2024-01-25', category: 'Service' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Fund Management</h1>
          <p className="text-gray-600 mt-1">Track income and expenses</p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Add Transaction</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-green-100">Total Income</p>
            <ArrowUpRight className="w-5 h-5" />
          </div>
          <h3 className="text-3xl font-bold">৳3,45,000</h3>
          <p className="text-green-100 mt-2 text-sm">+12% from last month</p>
        </div>

        <div className="card bg-gradient-to-br from-red-500 to-red-600 text-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-red-100">Total Expenses</p>
            <ArrowDownRight className="w-5 h-5" />
          </div>
          <h3 className="text-3xl font-bold">৳1,25,000</h3>
          <p className="text-red-100 mt-2 text-sm">+5% from last month</p>
        </div>

        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-blue-100">Net Balance</p>
            <DollarSign className="w-5 h-5" />
          </div>
          <h3 className="text-3xl font-bold">৳2,20,000</h3>
          <p className="text-blue-100 mt-2 text-sm">Current balance</p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Transactions</h2>
        <div className="table-container">
          <table className="w-full">
            <thead className="table-header">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Description</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Type</th>
                <th className="px-6 py-4 text-right text-sm font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="table-row">
                  <td className="px-6 py-4 text-sm text-gray-700">{transaction.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{transaction.description}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{transaction.category}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      transaction.type === 'Income' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-sm font-medium text-right ${
                    transaction.type === 'Income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'Income' ? '+' : '-'}৳{transaction.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Fund
