import { useState, useEffect } from 'react'
import { Plus, Eye, Edit, Trash2, Search, Mail, Phone, User, Lock, UserPlus } from 'lucide-react'
import axios from 'axios'
import AnimatedCard from '../components/AnimatedCard'

const AdminManagement = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [userdata, setUserdata] = useState([])
  const [popup, setpopup] = useState(false)
  const [selectedId, setselectedId] = useState(null)
  const [refresh, setrefresh] = useState(false)
  const [showAddAdmin, setShowAddAdmin] = useState(false)
  const [role,setRole]=useState('')
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    email: '',
    phone: '',
    username: '',
    user_type: 'admin',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})



  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/getusers.php`,{
      method: 'GET',
      credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
      setUserdata(data.users)
      setRole(data.role)
      console.log('admin data',data)
    })
    
  }, [refresh])
  


  const handledelete = async (id) => {
    setpopup(false)
    console.log(`this is the id ${id}`)
    try{
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/deleteuser.php`, { id }, { withCredentials: true })
      console.log(response.data)
      setrefresh(!refresh)
    } catch(err){
      console.error(err)
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.fname) newErrors.fname = 'First name is required'
    if (!formData.lname) newErrors.lname = 'Last name is required'
    if (!formData.email) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'
    if (!formData.phone) newErrors.phone = 'Phone number is required'
    if (!formData.username) newErrors.username = 'Username is required'
    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters'
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAddAdmin = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    
    try {
      console.log('formData', formData)
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/adduser.php`, {
        fname: formData.fname,
        lname: formData.lname,
        email: formData.email,
        phone: formData.phone,
        username: formData.username,
        user_type: formData.user_type,
        password: formData.password
      }, { withCredentials: true })
      console.log('response', response.data)
      
      if (response.data.success) {
        setShowAddAdmin(false)
        setFormData({
          fname: '',
          lname: '',
          email: '',
          phone: '',
          username: '',
          user_type: 'admin',
          password: '',
          confirmPassword: ''
        })
        setrefresh(!refresh)
      }else{
        alert(response.data.message)
      }

    } catch (error) {
      console.error('Error adding admin:', error)
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {/* Add Admin Modal */}
      {showAddAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">Add New Admin</h2>
                <button 
                  onClick={() => setShowAddAdmin(false)}
                  className="text-gray-500 hover:text-gray-700 p-1"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleAddAdmin} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="fname"
                        value={formData.fname}
                        onChange={handleInputChange}
                        className={`input-field pl-9 sm:pl-10 w-full text-sm ${errors.fname ? 'border-red-500' : ''}`}
                        placeholder="John"
                      />
                    </div>
                    {errors.fname && <p className="mt-1 text-xs text-red-600">{errors.fname}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      name="lname"
                      value={formData.lname}
                      onChange={handleInputChange}
                      className={`input-field w-full text-sm ${errors.lname ? 'border-red-500' : ''}`}
                      placeholder="Doe"
                    />
                    {errors.lname && <p className="mt-1 text-xs text-red-600">{errors.lname}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className={`input-field pl-9 sm:pl-10 w-full text-sm ${errors.username ? 'border-red-500' : ''}`}
                      placeholder="username"
                    />
                  </div>
                  {errors.username && <p className="mt-1 text-xs text-red-600">{errors.username}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`input-field pl-9 sm:pl-10 w-full text-sm ${errors.email ? 'border-red-500' : ''}`}
                      placeholder="email@example.com"
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`input-field pl-9 sm:pl-10 w-full text-sm ${errors.phone ? 'border-red-500' : ''}`}
                      placeholder="+880 1234-567890"
                    />
                  </div>
                  {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    name="user_type"
                    value={formData.user_type}
                    onChange={handleInputChange}
                    className="input-field w-full text-sm"
                  >
                    <option value="admin">Admin</option>
                    <option value="super admin">Super Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`input-field pl-9 sm:pl-10 w-full text-sm ${errors.password ? 'border-red-500' : ''}`}
                      placeholder="••••••"
                    />
                  </div>
                  {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`input-field pl-9 sm:pl-10 w-full text-sm ${errors.confirmPassword ? 'border-red-500' : ''}`}
                      placeholder="••••••"
                    />
                  </div>
                  {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddAdmin(false)}
                    className="btn-secondary w-full sm:w-auto"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary flex items-center justify-center space-x-2 w-full sm:w-auto">
                    <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Add Admin</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-full px-4 py-6 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Admin Management</h1>
            <p className="text-sm md:text-base text-gray-600 mt-1">Manage system administrators</p>
          </div>

          {role === 'super admin' && (
            <button 
              onClick={() => setShowAddAdmin(true)}
              className="btn-primary flex items-center justify-center space-x-2 w-full md:w-auto"
            >
              <UserPlus className="w-5 h-5" />
              <span>Add Admin</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {userdata.map((admin) => (
            <AnimatedCard key={admin.user_id}>
              <div className="card hover:shadow-lg transition-shadow w-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-lg sm:text-2xl font-bold text-primary-600">{admin.fname.charAt(0)}</span>
                  </div>
                  <span className="px-2 sm:px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium whitespace-nowrap">
                    {admin.user_type}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-1 break-words">{admin.fname} {admin.lname}</h3>
                <p className="text-xs sm:text-sm text-primary-600 font-medium mb-3 sm:mb-4">{admin.user_type}</p>
                <div className="space-y-2 mb-3 sm:mb-4">
                  <div className="flex items-center text-xs sm:text-sm text-gray-600 break-all">
                    <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{admin.email}</span>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    <p className="truncate">Account Created: {admin.created_at}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex-1 btn-icon bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm sm:text-base py-2">
                    <Edit className="w-3 h-3 sm:w-4 sm:h-4 mx-auto" />
                  </button>
                  {role === 'super admin' && (
                    <button 
                      className="flex-1 btn-icon bg-red-100 hover:bg-red-200 text-red-700 text-sm sm:text-base py-2" 
                      onClick={() => { setpopup(true); setselectedId(admin.user_id); }}
                    >
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mx-auto" />
                    </button>
                  )}
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </div>

      {popup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50 p-4">
          <div className="bg-white w-full max-w-sm mx-auto rounded-2xl shadow-2xl p-6 space-y-4 border border-red-100">
            <h2 className="text-lg sm:text-xl font-semibold text-center text-red-700 mb-4">
              Confirm Deletion
            </h2>
            <p className="text-sm sm:text-base text-gray-700 text-center">
              Are you sure you want to delete this admin? This action cannot be undone.
            </p>
            <div className="flex justify-between mt-6 gap-3">
              <button
                type="button"
                onClick={() => setpopup(false)}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handledelete(selectedId)}
                className="flex-1 px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 shadow-sm transition text-sm sm:text-base"
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

export default AdminManagement