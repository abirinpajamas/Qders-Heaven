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
  const [totalDue, setTotalDue] = useState(0);
  const [pendingBills, setPendingBills] = useState(0);
  const [totalOverdue, setTotalOverdue] = useState(0);
  const [overdueBills, setOverdueBills] = useState(0);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/getpayments.php`, {
          start_date: startDate,
          end_date: endDate
        }, { withCredentials: true });
        console.log("Payment data:", res.data);
        if (res.data && res.data.success) {
          setPayments(res.data.payments || []);
          setTotalDue(res.data.total_due_amount);
          setPendingBills(res.data.pending_bills_count);
          setTotalOverdue(res.data.total_overdue_amount);
          setOverdueBills(res.data.overdue_bills_count);
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
    <div className="space-y-6 px-4 md:px-0">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Payment Details</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">Track all payment transactions</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <label className="text-xs md:text-sm text-gray-600 whitespace-nowrap">From:</label>
            <input 
              type="date" 
              value={startDate} 
              onChange={e => setStartDate(e.target.value)} 
              className="border rounded px-2 py-1 text-xs md:text-sm flex-1 min-w-0" 
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs md:text-sm text-gray-600 whitespace-nowrap">To:</label>
            <input 
              type="date" 
              value={endDate} 
              onChange={e => setEndDate(e.target.value)} 
              className="border rounded px-2 py-1 text-xs md:text-sm flex-1 min-w-0" 
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs md:text-sm text-gray-600">Total Collected</p>
            <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 break-words">৳{totalCollected.toLocaleString()}</h3>
          <p className="text-xs md:text-sm text-green-600 mt-2">In {duration >= 0 ? `${duration} days` : "Invalid Range"}</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs md:text-sm text-gray-600">Pending Bills</p>
            <Clock className="w-4 h-4 md:w-5 md:h-5 text-yellow-600" />
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 break-words">৳{Number(totalDue).toLocaleString()}</h3>
          <p className="text-xs md:text-sm text-yellow-600 mt-2">{Number(pendingBills).toLocaleString()} Bills</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs md:text-sm text-gray-600">Overdue Bills</p>
            <XCircle className="w-4 h-4 md:w-5 md:h-5 text-red-600" />
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 break-words">৳{Number(totalOverdue).toLocaleString()}</h3>
          <p className="text-xs md:text-sm text-red-600 mt-2">{Number(overdueBills).toLocaleString()} Bills</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs md:text-sm text-gray-600">Total Transactions</p>
            <CreditCard className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-gray-800">{payments.length}</h3>
        </div>
      </div>

      <div className="card">
        <h2 className="text-base md:text-lg font-bold text-gray-800 mb-4">Payment Transactions</h2>
        
        {/* Mobile Card View */}
        <div className="md:hidden space-y-3">
          {loading ? (
            <div className="text-center py-6 text-sm">Loading...</div>
          ) : payments.length === 0 ? (
            <div className="text-center py-6 text-sm text-gray-500">No payments found</div>
          ) : (
            payments.map((payment) => (
              <div key={payment.payment_id} className="border rounded-lg p-4 space-y-3">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-gray-500">Transaction ID</p>
                    <p className="text-sm font-semibold text-gray-800 mt-1">#{payment.payment_id}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    payment.status === 'Completed' 
                      ? 'bg-green-100 text-green-700' 
                      : payment.status === 'Pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {payment.status}
                  </span>
                </div>

                {/* Tenant & Unit */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-xs text-gray-500">Tenant</p>
                    <p className="text-gray-700 truncate">{payment.tenant_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Unit</p>
                    <p className="text-gray-700">{payment.unit_number}</p>
                  </div>
                </div>

                {/* Amount & Date */}
                <div className="flex justify-between items-center pt-2 border-t">
                  <div>
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="text-sm text-gray-700">{payment.paid_on}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Amount</p>
                    <p className="text-lg font-bold text-green-600">
                      ৳{payment.amount.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="pt-2 border-t">
                  <p className="text-xs text-gray-500">Payment Method</p>
                  <p className="text-sm text-gray-700 capitalize">{payment.payment_method}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="table-header">
              <tr>
                <th className="px-4 lg:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold">Transaction ID</th>
                <th className="px-4 lg:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold">Tenant</th>
                <th className="px-4 lg:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold">Unit</th>
                <th className="px-4 lg:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold">Amount</th>
                <th className="px-4 lg:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold">Date</th>
                <th className="px-4 lg:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold">Method</th>
                <th className="px-4 lg:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center py-6">Loading...</td></tr>
              ) : payments.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-6 text-sm text-gray-500">No payments found</td></tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment.payment_id} className="table-row">
                    <td className="px-4 lg:px-6 py-4 text-sm font-medium text-gray-700">#{payment.payment_id}</td>
                    <td className="px-4 lg:px-6 py-4 text-sm text-gray-700">{payment.tenant_name}</td>
                    <td className="px-4 lg:px-6 py-4 text-sm text-gray-700">{payment.unit_number}</td>
                    <td className="px-4 lg:px-6 py-4 text-sm font-medium text-gray-700">৳{payment.amount.toLocaleString()}</td>
                    <td className="px-4 lg:px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{payment.paid_on}</td>
                    <td className="px-4 lg:px-6 py-4 text-sm text-gray-700 capitalize">{payment.payment_method}</td>
                    <td className="px-4 lg:px-6 py-4">
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default PaymentDetails