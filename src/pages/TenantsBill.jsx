import { X,Receipt, Download, Eye, Send, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import axios from 'axios'

const paymentMethods = [
  { value: 'cash', label: 'Cash' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'check', label: 'Check' },
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'other', label: 'Other' },
];

const TenantsBill = () => {
  const [bills, setBills] = useState([])
  const [refresh, setRefresh] = useState(false)
  const [property, setproperty] = useState([])
  const [selectedPropertyId, setSelectedPropertyId] = useState('all')
  const [paymentBill, setPaymentBill] = useState(null)
  const [paymentForm, setPaymentForm] = useState({
    paid_on: '',
    amount: '',
    payment_method: 'cash',
    reference: '',
    note: '',
    bill_type: 'rent'
  })
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [paymentError, setPaymentError] = useState('')
  const [paymentSuccess, setPaymentSuccess] = useState('')
  const [deletePopup, setDeletePopup] = useState(false)
  const [selectedBillId, setSelectedBillId] = useState(null)

  useEffect(() => {
    fetch('http://localhost/qadersheavennew/php/getbills.php')
      .then(res => res.json())
      .then(data => setBills(data || []))
      .catch(console.error)
  }, [refresh])

   useEffect(()=>{

    fetch('http://localhost/qadersheavennew/php/fetchproperty.php')
    .then(res=>res.json())
    .then(data=>setproperty(data||[]))
    .catch(console.error)
   },[])
  const isCurrentMonth = (dateStr) => {
    if (!dateStr) return false
    const d = new Date(dateStr)
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }

const displayBills = bills.filter(bill => {
    // 1. Apply the original complex status filter:
    const passesStatusFilter = (bill.status.toLowerCase() === 'paid' ? isCurrentMonth(bill.period_start) : true);
    
    // 2. Apply the property filter:
    const passesPropertyFilter = (
      // If no ID is selected (or 'all' is selected), pass all bills
      !selectedPropertyId || selectedPropertyId === 'all' ||
      // Otherwise, check if the bill's property_id matches the selected ID
      String(bill.property_id) === String(selectedPropertyId)
    );

    // Only include bills that pass BOTH filters
    return passesStatusFilter && passesPropertyFilter;
  });  

  const handleStatusChange = async (bill_id, status) => {
    try {
      const res = await axios.post('http://localhost/qadersheavennew/php/updatebillstatus.php', { bill_id, status }, { withCredentials: true })
      if (res.data && res.data.success) {
        setBills(prev => prev.map(b => b.bill_id === bill_id ? { ...b, status, changes_date: new Date().toISOString().slice(0,10) } : b))
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleDeleteBill = async (bill_id) => {
    setDeletePopup(false)
    try {
      const response = await axios.post('http://localhost/qadersheavennew/php/deletebill.php', { id: bill_id }, { withCredentials: true })
      if (response.data && response.data.success) {
        setBills(prev => prev.filter(b => b.bill_id !== bill_id))
        setRefresh(r => !r)
      } else {
        alert(response.data.message || 'Failed to delete bill')
      }
    } catch (err) {
      console.error(err)
      alert('Error deleting bill')
    }
  }

 
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Tenants Bill</h1>
        <p className="text-gray-600 mt-1">View and manage tenant bills</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <p className="text-blue-100 mb-2">Total Bills</p>
          <h3 className="text-3xl font-bold">{bills.length}</h3>
        </div>
        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <p className="text-green-100 mb-2">Paid</p>
          <h3 className="text-3xl font-bold">{bills.filter(b => b.status==='paid').length}</h3>
        </div>
        <div className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <p className="text-yellow-100 mb-2">Unpaid</p>
          <h3 className="text-3xl font-bold">{bills.filter(b => b.status==='unpaid').length}</h3>
        </div>
        <div className="card bg-gradient-to-br from-red-500 to-red-600 text-white">
          <p className="text-red-100 mb-2">Partially Paid</p>
          <h3 className="text-3xl font-bold">{bills.filter(b => b.status==='partially paid').length}</h3>
        </div>
      </div>
      <div className="flex justify-end"> {/* Use flex to push content to the right */}
       <div className="w-40 sm:w-64"> {/* Control the width of the select box */}
        <label htmlFor="property-select" className="sr-only">Filter by Property</label>
          <select
           id="property-select"
           value={selectedPropertyId} // Change this state name to something like 'selectedPropertyId' for clarity
           onChange={(e)=>setSelectedPropertyId(e.target.value)}
           // Use full width and common form styles
           className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
           required
          >
            {property.map((prop) => (
              <option key={prop.property_id} value={prop.property_id}>
                {prop.name}
              </option>
            ))}
            <option value="all">All Properties</option>
          </select>
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
              <th className="px-6 py-4 text-left text-sm font-semibold">Amount Due</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Due Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {displayBills.map((bill) => (
              <tr key={bill.bill_id} className="table-row">
                <td className="px-6 py-4 text-sm font-medium text-gray-700">{`${bill.bill_id}`}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{bill.tenant_name || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{bill.unit_number}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{new Date(bill.period_start).toLocaleString('en-US', { month: 'long', year: 'numeric' })}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-700">৳{Number(bill.amount-bill.paid).toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{bill.period_end}</td>
                <td className="px-6 py-4">
  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold 
    ${bill.status === 'paid' ? 'bg-green-100 text-green-700' :
      bill.status === 'unpaid' ? 'bg-yellow-100 text-yellow-700' :
      bill.status === 'partially paid' ? 'bg-orange-100 text-orange-700' : 
      'bg-gray-100 text-gray-700'}`}
  >
    {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
  </span>
</td>
                <td className="px-6 py-4">
  <div className="flex items-center space-x-2">
    {/*<button className="btn-icon bg-green-100 hover:bg-green-200 text-green-700">
      <Eye className="w-4 h-4" />
    </button>
    <button className="btn-icon bg-blue-100 hover:bg-blue-200 text-blue-700">
      <Download className="w-4 h-4" />
    </button>
    <button className="btn-icon bg-purple-100 hover:bg-purple-200 text-purple-700">
      <Send className="w-4 h-4" />
    </button>*/}
    <button
      className="btn-icon bg-blue-100 hover:bg-blue-500 text-blue-900"
      onClick={() => setPaymentBill(bill)}
    >
      Make Payment
    </button>
    <button 
      className="btn-icon bg-red-100 hover:bg-red-200 text-red-700"
      onClick={() => { setDeletePopup(true); setSelectedBillId(bill.bill_id); }}
    >
      <Trash2 className="w-4 h-4" />
    </button>
  </div>
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Payment Modal */}
      {paymentBill && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-[9999]">
          <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-md relative">
            <button
              className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
              onClick={() => { setPaymentBill(null); setPaymentForm({ paid_on: '', amount: '', payment_method: 'cash', reference: '', note: '' }); setPaymentError(''); setPaymentSuccess(''); }}
            >
              <X className="w-4 h-4" />
            </button>
            <h2 className="text-xl font-bold mb-4">Make Payment for BILL-{paymentBill.bill_id}</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setPaymentLoading(true);
                setPaymentError('');
                setPaymentSuccess('');
                try {
                  const res = await axios.post('http://localhost/qadersheavennew/php/addpayment.php', {
                    bill_id: paymentBill.bill_id,
                    bill_type: paymentForm.bill_type || 'rent',
                    paid_on: paymentForm.paid_on,
                    amount: paymentForm.amount,
                    payment_method: paymentForm.payment_method,
                    reference: paymentForm.reference,
                    note: paymentForm.note
                  }, { withCredentials: true });
                  if (res.data && res.data.success) {
                    setPaymentSuccess('Payment recorded successfully!');
                    setTimeout(() => {
                      setPaymentBill(null);
                      setPaymentForm({ paid_on: '', amount: '', payment_method: 'cash', reference: '', note: '' });
                      setRefresh(r => !r);
                    }, 1200);
                  } else {
                    setPaymentError(res.data && res.data.message ? res.data.message : 'Failed to record payment.');
                  }
                } catch (err) {
                  setPaymentError('Error recording payment.');
                } finally {
                  setPaymentLoading(false);
                }
              }}
            >
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Paid On</label>
                <input type="date" className="w-full border rounded px-3 py-2" required
                  value={paymentForm.paid_on}
                  onChange={e => setPaymentForm(f => ({ ...f, paid_on: e.target.value }))} />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Amount</label>
                <input type="number" className="w-full border rounded px-3 py-2" required min="1"
                  value={paymentForm.amount}
                  placeholder={paymentBill.amount-paymentBill.paid}
                  onChange={e => setPaymentForm(f => ({ ...f, amount: e.target.value }))} />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Payment Method</label>
                <select className="w-full border rounded px-3 py-2"
                  value={paymentForm.payment_method}
                  onChange={e => setPaymentForm(f => ({ ...f, payment_method: e.target.value }))}
                  required
                >
                  {paymentMethods.map(m => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Reference Number</label>
                <input type="text" className="w-full border rounded px-3 py-2"
                  value={paymentForm.reference}
                  onChange={e => setPaymentForm(f => ({ ...f, reference: e.target.value }))} />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Note</label>
                <textarea className="w-full border rounded px-3 py-2"
                  value={paymentForm.note}
                  onChange={e => setPaymentForm(f => ({ ...f, note: e.target.value }))} />
              </div>
              {paymentError && <div className="text-red-600 text-sm mb-2">{paymentError}</div>}
              {paymentSuccess && <div className="text-green-600 text-sm mb-2">{paymentSuccess}</div>}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60"
                disabled={paymentLoading}
              >
                {paymentLoading ? 'Processing...' : 'Submit Payment'}
              </button>
            </form>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Popup */}
      {deletePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50">
          <div className="bg-white w-full max-w-sm mx-auto rounded-2xl shadow-2xl p-6 space-y-4 border border-red-100">
            <h2 className="text-xl font-semibold text-center text-red-700 mb-4">
              Confirm Deletion
            </h2>
            <p className="text-gray-700 text-center">
              Are you sure you want to delete this bill? This action cannot be undone.
            </p>
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={() => setDeletePopup(false)}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteBill(selectedBillId)}
                className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 shadow-sm transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TenantsBill
