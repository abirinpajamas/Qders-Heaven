import { useState } from 'react'
import { Plus, Eye, Edit, Trash2, Search } from 'lucide-react'

const Meter = () => {
  const [searchTerm, setSearchTerm] = useState('')
  
  const meters = [
    {
      id: 1,
      meterNo: '12345789',
      installationDate: '2010-04-01',
      property: 'Rangs Qaders Heaven',
      unitNo: 'unit 2',
      status: 'Active'
    },
    {
      id: 2,
      meterNo: '12345788',
      installationDate: '2010-04-01',
      property: 'Rangs Qaders Heaven',
      unitNo: 'unit 3',
      status: 'Active'
    },
    {
      id: 3,
      meterNo: '12345788',
      installationDate: '2010-04-01',
      property: 'Rangs Qaders Heaven',
      unitNo: 'unit 5',
      status: 'Active'
    },
    {
      id: 4,
      meterNo: '',
      installationDate: '',
      property: 'Rangs Qaders Heaven',
      unitNo: 'unit 1',
      status: 'N/A'
    },
    {
      id: 5,
      meterNo: '',
      installationDate: '',
      property: 'Rangs Qaders Heaven',
      unitNo: 'unit 1',
      status: 'N/A'
    },
    {
      id: 6,
      meterNo: '12345787',
      installationDate: '2010-01-01',
      property: 'Rangs Qaders Heaven',
      unitNo: 'unit 1',
      status: 'Active'
    },
    {
      id: 7,
      meterNo: '12345787',
      installationDate: '2010-01-01',
      property: 'Rangs Qaders Heaven',
      unitNo: 'B1',
      status: 'Active'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Meter List</h1>
          <p className="text-gray-600 mt-1">Manage all property meters</p>
        </div>
        <button className="btn-success flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Meter Add</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search meters..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="w-full">
          <thead className="table-header">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">Sl.No</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Meter No.</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Installation date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Property</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Unit No</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {meters.map((meter) => (
              <tr key={meter.id} className="table-row">
                <td className="px-6 py-4 text-sm text-gray-700">{meter.id}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{meter.meterNo || 'N/A'}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{meter.installationDate || 'N/A'}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{meter.property}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{meter.unitNo}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    meter.status === 'Active' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {meter.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <button className="btn-icon bg-green-100 hover:bg-green-200 text-green-700">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="btn-icon bg-blue-100 hover:bg-blue-200 text-blue-700">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="btn-icon bg-red-100 hover:bg-red-200 text-red-700">
                      <Trash2 className="w-4 h-4" />
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

export default Meter
