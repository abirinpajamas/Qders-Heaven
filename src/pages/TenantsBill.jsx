import { Receipt, Download, Eye, Send } from 'lucide-react'
import { useEffect, useState } from 'react'
import axios from 'axios'

const TenantsBill = () => {
  const [bills, setBills] = useState([])
  const [refresh, setRefresh] = useState(false)
  const [property, setproperty] = useState([])
  const [selectedPropertyId, setSelectedPropertyId] = useState('all')

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
      const res = await axios.post('http://localhost/qadersheavennew/php/updatebillstatus.php', { bill_id, status })
      if (res.data && res.data.success) {
        setBills(prev => prev.map(b => b.bill_id === bill_id ? { ...b, status, changes_date: new Date().toISOString().slice(0,10) } : b))
      }
    } catch (e) {
      console.error(e)
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
          <p className="text-red-100 mb-2">Overdue</p>
          <h3 className="text-3xl font-bold">{bills.filter(b => b.status==='overdue').length}</h3>
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
              <th className="px-6 py-4 text-left text-sm font-semibold">Amount</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Due Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {displayBills.map((bill) => (
              <tr key={bill.bill_id} className="table-row">
                <td className="px-6 py-4 text-sm font-medium text-gray-700">{`BILL-${bill.bill_id}`}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{bill.tenant_name || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{bill.unit_number}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{new Date(bill.period_start).toLocaleString('en-US', { month: 'long', year: 'numeric' })}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-700">৳{Number(bill.amount).toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{bill.period_end}</td>
                <td className="px-6 py-4">
                  <select
                    value={bill.status}
                    onChange={(e) => handleStatusChange(bill.bill_id, e.target.value)}
                    className="px-2 py-1 rounded border text-sm"
                  >
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="overdue">Overdue</option>
                    <option value="unpaid">Unpaid</option>
                  </select>
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
