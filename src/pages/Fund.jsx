import { DollarSign, TrendingUp, TrendingDown, Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import axios from 'axios'

const Fund = () => {

const [startDate, setStartDate] = useState(() => {
  const d = new Date();
  d.setDate(d.getDate() - 30);
  return d.toISOString().slice(0, 10);
});
const [endDate, setEndDate] = useState(() => new Date().toISOString().slice(0, 10));
const [totals, setTotals] = useState({ total_income: 0, total_expense: 0, total_revenue: 0 });
const [transactions, setTransactions] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchFunds = async () => {
    setLoading(true);
    console.log('Fetching funds with dates:', startDate, endDate);
    try {
      const res = await axios.post('http://localhost/qadersheavennew/php/getfunds.php', {
        start_date: startDate,
        end_date: endDate
      }, { withCredentials: true });
      if (res.data && res.data.success) {
        console.log(res.data);
        setTotals({
          total_income: res.data.total_income,
          total_expense: res.data.total_expense,
          total_revenue: res.data.total_revenue
        });
        setTransactions(res.data.transactions || []);
      }
    } catch (err) {
      // handle error
    } finally {
      setLoading(false);
    }
  };
  fetchFunds();
}, [startDate, endDate]);


const calculateDays = (start, end) => {
  if (!start || !end) return 0;
  
  const startDateObj = new Date(start);
  const endDateObj = new Date(end);
  
  // Difference in milliseconds
  const diffInMs = endDateObj - startDateObj;
  
  // Convert ms to days
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
  
  return Math.round(diffInDays);
};

// Use it like this:
const duration = calculateDays(startDate, endDate);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Fund Management</h1>
          <p className="text-gray-600 mt-1">Track income and expenses</p>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-2">
          <label className="text-sm text-gray-600">From:</label>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="border rounded px-2 py-1 text-sm" />
          <label className="text-sm text-gray-600">To:</label>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="border rounded px-2 py-1 text-sm" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-green-100">Total Income</p>
            <ArrowUpRight className="w-5 h-5" />
          </div>
          <h3 className="text-3xl font-bold">৳{totals.total_income.toLocaleString()}</h3>
          <p className="text-sm text-white-600 mt-2">In {duration >= 0 ? `${duration} days` : "Invalid Range"}</p>

        </div>

        <div className="card bg-gradient-to-br from-red-500 to-red-600 text-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-red-100">Total Expenses</p>
            <ArrowDownRight className="w-5 h-5" />
          </div>
          <h3 className="text-3xl font-bold">৳{totals.total_expense.toLocaleString()}</h3>
          </div>

        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-blue-100">Net Balance</p>
            <DollarSign className="w-5 h-5" />
          </div>
          <h3 className="text-3xl font-bold">৳{totals.total_revenue.toLocaleString()}</h3>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Transactions</h2>
        <div className="table-container">
          <table className="w-full">
            <thead className="table-header">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Reference</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Method</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Note</th>
                <th className="px-6 py-4 text-right text-sm font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-6">Loading...</td></tr>
              ) : transactions.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-6">No transactions found</td></tr>
              ) : (
                transactions.map((transaction) => (
                  <tr key={transaction.payment_id} className="table-row">
                    <td className="px-6 py-4 text-sm text-gray-700">{transaction.paid_on}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{transaction.reference_number}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        transaction.type === 'Income' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{transaction.payment_method}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{transaction.notes}</td>
                    <td className={`px-6 py-4 text-sm font-medium text-right ${
                      transaction.type === 'Income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'Income' ? '+' : '-'}৳{Number(transaction.amount).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Fund
