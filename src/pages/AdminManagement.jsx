import { useState, useEffect } from 'react'
import { Plus, Eye, Edit, Trash2, Search, Mail, Phone } from 'lucide-react'

const AdminManagement = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [userdata,setUserdata]=useState([])



  useEffect(() => {
    fetch('http://localhost/qadersheavennew/php/getusers.php')
    .then(res => res.json())
    .then(data => {
      setUserdata(data)
      console.log(data)
    })
    
  }, [])
  
  const admins = [
    { id: 1, name: 'Bismillahir Rahman', email: 'admin@qadersheaven.com', phone: '+880 1234-567890', role: 'Super Admin', status: 'Active' },
    { id: 2, name: 'Ahmed Hassan', email: 'ahmed@qadersheaven.com', phone: '+880 1234-567891', role: 'Admin', status: 'Active' },
    { id: 3, name: 'Fatima Khan', email: 'fatima@qadersheaven.com', phone: '+880 1234-567892', role: 'Manager', status: 'Active' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Management</h1>
          <p className="text-gray-600 mt-1">Manage system administrators</p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Add Admin</span>
        </button>
      </div>

      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search admins..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userdata.map((admin) => (
          <div key={admin.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-600">{admin.fname}</span>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                {admin.user_type}
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">{admin.fname}{admin.lname}</h3>
            <p className="text-sm text-primary-600 font-medium mb-4">{admin.user_type}</p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="w-4 h-4 mr-2" />
                {admin.email}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <p  >
                Account Created: {admin.created_at}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="flex-1 btn-icon bg-blue-100 hover:bg-blue-200 text-blue-700">
                <Edit className="w-4 h-4" />
              </button>
              <button className="flex-1 btn-icon bg-red-100 hover:bg-red-200 text-red-700">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminManagement
