import { Plus, Layers, Building2, Edit, Trash2, Eye } from 'lucide-react'

const Floor = () => {
  const floors = [
    { id: 1, floorNo: 'Ground Floor', property: 'Rangs Qaders Heaven', units: 4, status: 'Active' },
    { id: 2, floorNo: '1st Floor', property: 'Rangs Qaders Heaven', units: 4, status: 'Active' },
    { id: 3, floorNo: '2nd Floor', property: 'Rangs Qaders Heaven', units: 4, status: 'Active' },
    { id: 4, floorNo: '3rd Floor', property: 'Rangs Qaders Heaven', units: 4, status: 'Active' },
    { id: 5, floorNo: '4th Floor', property: 'Rangs Qaders Heaven', units: 4, status: 'Active' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Floor Management</h1>
          <p className="text-gray-600 mt-1">Manage property floors</p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Add Floor</span>
        </button>
      </div>

      <div className="table-container">
        <table className="w-full">
          <thead className="table-header">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">Sl.No</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Floor No</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Property</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Total Units</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {floors.map((floor) => (
              <tr key={floor.id} className="table-row">
                <td className="px-6 py-4 text-sm text-gray-700">{floor.id}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <Layers className="w-5 h-5 text-primary-600 mr-2" />
                    <span className="text-sm font-medium text-gray-700">{floor.floorNo}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">{floor.property}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{floor.units}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    {floor.status}
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

export default Floor
