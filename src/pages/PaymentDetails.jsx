import { CreditCard, CheckCircle, Clock, XCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import axios from 'axios'

const PaymentDetails = () => {
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d.toISOString().slice(0, 10);
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const res = await axios.post('http://localhost/qadersheavennew/php/getpayments.php', {
          start_date: startDate,
          end_date: endDate
        }, { withCredentials: true });
        console.log("Payment data:", res.data);
        if (res.data && res.data.success) {
          setPayments(res.data.payments || []);
        }
      } catch (err) {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [startDate, endDate]);

   

  // Calculate stats
  const totalCollected = payments.reduce((sum, p) => sum + (p.amount ? Number(p.amount) : 0), 0);
  const pending = payments.filter(p => p.bill_status === 'partially paid' || p.bill_status === 'unpaid');
  const failed = payments.filter(p => p.bill_status === 'failed');
  const completed = payments.filter(p => p.bill_status === 'paid');


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
          <h1 className="text-2xl font-bold text-gray-800">Payment Details</h1>
          <p className="text-gray-600 mt-1">Track all payment transactions</p>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-2">
          <label className="text-sm text-gray-600">From:</label>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="border rounded px-2 py-1 text-sm" />
          <label className="text-sm text-gray-600">To:</label>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="border rounded px-2 py-1 text-sm" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Collected</p>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">৳{totalCollected}</h3>
          <p className="text-sm text-green-600 mt-2">In {duration >= 0 ? `${duration} days` : "Invalid Range"}</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Due</p>
            <Clock className="w-5 h-5 text-yellow-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">৳{pending.reduce((sum, p) => sum + (p.due ? Number(p.due) : 0), 0)}</h3>
          <p className="text-sm text-yellow-600 mt-2">{pending.length} payments</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Failed</p>
            <XCircle className="w-5 h-5 text-red-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">৳{failed.reduce((sum, p) => sum + (p.amount ? Number(p.amount) : 0), 0)}</h3>
          <p className="text-sm text-red-600 mt-2">{failed.length} payment</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Transactions</p>
            <CreditCard className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{payments.length}</h3>
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
                <td className="px-6 py-4 text-sm font-medium text-gray-700">{payment.payment_id}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{payment.tenant_name}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{payment.unit_number}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-700">৳{payment.amount.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{payment.paid_on}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{payment.payment_method}</td>
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
