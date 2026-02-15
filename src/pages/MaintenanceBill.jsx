import { FileText, Download, Eye, Plus, Trash2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

const paymentMethods = [
  { value: 'cash', label: 'Cash' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'check', label: 'Check' },
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'other', label: 'Other' },
];

const MaintenanceBill = () => {
  // State for bill listing
  const [bills, setBills] = useState([])
  const [refresh, setRefresh] = useState(false)
  const [serviceProviders, setServiceProviders] = useState([])
  const [selectedProvider, setSelectedProvider] = useState('all')
  const [showBillForm, setShowBillForm] = useState(false)
  const [units, setunits] = useState([])
  
  // State for new bill form
  const [formData, setFormData] = useState({
    provider_id: '',
    amount: '',
    description: '',
    bill_date: new Date().toISOString().split('T')[0],
    due_date: '',
  })

  // Payment modal state
  const [paymentBill, setPaymentBill] = useState(null)
  const [paymentForm, setPaymentForm] = useState({
    paid_on: '',
    amount: '',
    payment_method: 'cash',
    reference: '',
    note: ''
  })
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [paymentError, setPaymentError] = useState('')
  const [paymentSuccess, setPaymentSuccess] = useState('')
  const [deletePopup, setDeletePopup] = useState(false)
  const [selectedBillId, setSelectedBillId] = useState(null)

    

  // Fetch bills and service providers
  useEffect(() => {
    // Fetch maintenance bills
    fetch(`${import.meta.env.VITE_API_BASE_URL}/getmaintenancebills.php`)
      .then(res => res.json())
      .then(data => {setBills(data || []);
       console.log('bills:', data)
      })
      .catch(console.error)
    
    // Fetch service providers
    fetch(`${import.meta.env.VITE_API_BASE_URL}/getserviceprovider.php`)
      .then(res => res.json())
      .then(data => {setServiceProviders(data || []);
       console.log('service providers:', data)
      })
      .catch(console.error)

    fetch(`${import.meta.env.VITE_API_BASE_URL}/getunits.php`,{
      method: 'GET',
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {setunits(data || []);
       console.log('units:', data)
      })
      .catch(console.error)  
  }, [refresh])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('formdata:',formData)
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/maintenancebill.php`,
        formData,
        { withCredentials: true }
      )
      if (response.data.success) {
        setRefresh(!refresh)
        setShowBillForm(false)
        setFormData({
          provider_id: '',
          unit_id: '',
          amount: '',
          description: '',
          due_date: ''
        })
      }
    } catch (error) {
      console.error('Error creating maintenance bill:', error)
    }
  }

  const handleDeleteBill = async (bill_id) => {
    setDeletePopup(false)
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/deletemaintenancebill.php`, { id: bill_id }, { withCredentials: true })
      if (response.data && response.data.success) {
        setBills(prev => prev.filter(b => b.bill_id !== bill_id))
        setRefresh(r => !r)
      } else {
        alert(response.data.message || 'Failed to delete maintenance bill')
      }
    } catch (err) {
      console.error(err)
      alert('Error deleting maintenance bill')
    }
  }


  const filteredBills = selectedProvider === 'all' 
    ? bills 
    : bills.filter(bill => bill.provider_id === selectedProvider)

  return (
    <div className="relative min-h-screen">
      {/* Overlay for the form */}
      {showBillForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">Create New Maintenance Bill</h2>
                <button 
                  onClick={() => setShowBillForm(false)}
                  className="text-gray-500 hover:text-gray-700 p-1"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Service Provider</label>
                    <select
                      name="provider_id"
                      value={formData.provider_id}
                      onChange={handleInputChange}
                      className="input-field w-full"
                      required
                    >
                      <option value="">Select Provider</option>
                      {serviceProviders.map(provider => (
                        <option key={provider.provider_id} value={provider.provider_id}>
                          {provider.provider_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                    <select
                      name="unit_id"
                      value={formData.unit_id}
                      onChange={handleInputChange}
                      className="input-field w-full"
                      required
                    >
                      <option value="">Select Unit</option>
                      {units.map(unit => (
                        <option key={unit.unit_id} value={unit.unit_id}>
                          {unit.unit_number}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      className="input-field w-full"
                      placeholder="Enter amount"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                    <input
                      type="date"
                      name="due_date"
                      value={formData.due_date}
                      onChange={handleInputChange}
                      className="input-field w-full"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="input-field w-full min-h-[100px]"
                      placeholder="Enter bill description"
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-end gap-2 sm:space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowBillForm(false)}
                    className="btn-secondary w-full sm:w-auto"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary w-full sm:w-auto">
                    Save Bill
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6 px-4 md:px-0">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Maintenance Bills</h1>
            <p className="text-sm md:text-base text-gray-600 mt-1">Manage maintenance service bills</p>
          </div>
          <button 
            onClick={() => setShowBillForm(true)}
            className="btn-primary flex items-center justify-center space-x-2 w-full md:w-auto"
          >
            <Plus className="w-5 h-5" />
            <span>Generate Bill</span>
          </button>
        </div>


        <div className="card">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
            <h2 className="text-base md:text-lg font-semibold">Maintenance Bills</h2>
            <div className="w-full sm:w-48">
              <select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
                className="input-field text-sm w-full"
              >
                <option value="all">All Providers</option>
                {serviceProviders.map(provider => (
                  <option key={provider.provider_id} value={provider.provider_id}>
                    {provider.provider_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {filteredBills.length === 0 ? (
              <div className="text-center py-8 text-sm text-gray-500">
                No maintenance bills found
              </div>
            ) : (
              filteredBills.map((bill) => (
                <div key={bill.bill_id} className="border rounded-lg p-4 space-y-3">
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-gray-500">Bill #{bill.bill_id}</p>
                      <p className="text-sm font-semibold text-gray-800 mt-1">{bill.provider_name}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      bill.status === 'Paid' 
                        ? 'bg-green-100 text-green-700' 
                        : bill.status === 'Partial'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {bill.status}
                    </span>
                  </div>

                  {/* Service & Unit */}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-xs text-gray-500">Service</p>
                      <p className="text-gray-700 truncate">{bill.sevicename}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Unit</p>
                      <p className="text-gray-700">{bill.unit_number}</p>
                    </div>
                  </div>

                  {/* Amount & Date */}
                  <div className="flex justify-between items-center pt-2 border-t">
                    <div>
                      <p className="text-xs text-gray-500">Service Date</p>
                      <p className="text-sm text-gray-700">{new Date(bill.servicedate).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Amount Due</p>
                      <p className="text-lg font-bold text-red-600">
                        ${Number(bill.amount - bill.paid).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t">
                    <button
                      className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded text-sm font-medium transition"
                      onClick={() => setPaymentBill(bill)}
                    >
                      Make Payment
                    </button>
                    <button 
                      className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded transition"
                      onClick={() => { setDeletePopup(true); setSelectedBillId(bill.bill_id); }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill #</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>                
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Due</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Date</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBills.map((bill) => (
                  <tr key={bill.bill_id}>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {bill.bill_id}
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {bill.provider_name}
                    </td>
                    <td className="px-4 lg:px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {bill.sevicename}
                    </td>
                    <td className="px-4 lg:px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {bill.unit_number}
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${Number(bill.amount-bill.paid).toFixed(2)}
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {bill.status}
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(bill.servicedate).toLocaleDateString()}
                    </td>
                    
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          className="bg-blue-100 hover:bg-blue-500 text-blue-900 px-2 py-1 rounded"
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
                {filteredBills.length === 0 && (
                  <tr>
                    <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                      No maintenance bills found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {paymentBill && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-[9999] p-4">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto relative">
            <button
              className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors text-xl"
              onClick={() => { setPaymentBill(null); setPaymentForm({ paid_on: '', amount: '', payment_method: 'cash', reference: '', note: '' }); setPaymentError(''); setPaymentSuccess(''); }}
            >
              ×
            </button>
            <h2 className="text-lg sm:text-xl font-bold mb-4 pr-8">Make Payment for BILL-{paymentBill.bill_id}</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setPaymentLoading(true);
                setPaymentError('');
                setPaymentSuccess('');
                try {
                  const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/addpayment.php`, {
                    bill_id: paymentBill.bill_id,
                    bill_type: 'service',
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
                <input type="date" className="w-full border rounded px-3 py-2 text-sm" required
                  value={paymentForm.paid_on}
                  onChange={e => setPaymentForm(f => ({ ...f, paid_on: e.target.value }))} />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Amount</label>
                <input type="number" className="w-full border rounded px-3 py-2 text-sm" required min="1"
                  value={paymentForm.amount}
                  max={paymentBill.amount-paymentBill.paid}
                  
                  placeholder={paymentBill.amount-paymentBill.paid}
                  onChange={e => setPaymentForm(f => ({ ...f, amount: e.target.value }))} />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Payment Method</label>
                <select className="w-full border rounded px-3 py-2 text-sm"
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
                <input type="text" className="w-full border rounded px-3 py-2 text-sm"
                  value={paymentForm.reference}
                  onChange={e => setPaymentForm(f => ({ ...f, reference: e.target.value }))} />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Note</label>
                <textarea className="w-full border rounded px-3 py-2 text-sm"
                  value={paymentForm.note}
                  onChange={e => setPaymentForm(f => ({ ...f, note: e.target.value }))}
                />
              </div>
              {paymentError && <div className="text-red-600 text-sm mb-2">{paymentError}</div>}
              {paymentSuccess && <div className="text-green-600 text-sm mb-2">{paymentSuccess}</div>}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2.5 rounded hover:bg-blue-700 disabled:opacity-60 transition text-sm sm:text-base"
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50 p-4">
          <div className="bg-white w-full max-w-sm mx-auto rounded-2xl shadow-2xl p-6 space-y-4 border border-red-100">
            <h2 className="text-xl font-semibold text-center text-red-700 mb-4">
              Confirm Deletion
            </h2>
            <p className="text-gray-700 text-center">
              Are you sure you want to delete this maintenance bill? Any recorded payments for this bill will be lost. This action cannot be undone.
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

export default MaintenanceBill