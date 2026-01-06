import { FileText, Download, Eye, Plus } from 'lucide-react'
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

    

  // Fetch bills and service providers
  useEffect(() => {
    // Fetch maintenance bills
    fetch('http://localhost/qadersheavennew/php/getmaintenancebills.php')
      .then(res => res.json())
      .then(data => {setBills(data || []);
       console.log('bills:', data)
      })
      .catch(console.error)
    
    // Fetch service providers
    fetch('http://localhost/qadersheavennew/php/getserviceprovider.php')
      .then(res => res.json())
      .then(data => {setServiceProviders(data || []);
       console.log('service providers:', data)
      })
      .catch(console.error)

    fetch('http://localhost/qadersheavennew/php/getunits.php')
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
        'http://localhost/qadersheavennew/php/maintenancebill.php',
        formData
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


  const filteredBills = selectedProvider === 'all' 
    ? bills 
    : bills.filter(bill => bill.provider_id === selectedProvider)

  return (
    <div className="relative min-h-screen">
      {/* Overlay for the form */}
      {showBillForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Create New Maintenance Bill</h2>
                <button 
                  onClick={() => setShowBillForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowBillForm(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Save Bill
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Maintenance Bills</h1>
            <p className="text-gray-600 mt-1">Manage maintenance service bills</p>
          </div>
          <button 
            onClick={() => setShowBillForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Generate Bill</span>
          </button>
        </div>


      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Maintenance Bills</h2>
          <div className="w-48">
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="input-field text-sm"
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

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>                
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBills.map((bill) => (
                <tr key={bill.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {bill.bill_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {bill.provider_name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                    {bill.sevicename}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                    {bill.unit_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${Number(bill.amount).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {bill.status}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(bill.servicedate).toLocaleDateString()}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
 
  <button
    className="bg-blue-100 hover:bg-blue-500 text-blue-900 px-2 py-1 rounded"
    onClick={() => setPaymentBill(bill)}
  >
    Make Payment
  </button>
</div>
                  </td>
                </tr>
              ))}
              {filteredBills.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
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
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-[9999]">
        <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-md relative">
          <button
            className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
            onClick={() => { setPaymentBill(null); setPaymentForm({ paid_on: '', amount: '', payment_method: 'cash', reference: '', note: '' }); setPaymentError(''); setPaymentSuccess(''); }}
          >
            ×
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
                  bill_type: 'service',
                  paid_on: paymentForm.paid_on,
                  amount: paymentForm.amount,
                  payment_method: paymentForm.payment_method,
                  reference: paymentForm.reference,
                  note: paymentForm.note
                });
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
                onChange={e => setPaymentForm(f => ({ ...f, note: e.target.value }))}
              />
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
  </div>
  )
}

export default MaintenanceBill
