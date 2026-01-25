import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Eye, EyeOff, Mail, Lock, Shield, User, ArrowRight } from 'lucide-react'

const AdminPortal = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [checkingAuth, setCheckingAuth] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if admin is already logged in via session
    fetch(`${import.meta.env.VITE_API_BASE_URL}/checkSession.php`, { 
      credentials: 'include' 
    })
      .then(res => res.json())
      .then(data => {
        if (data.loggedIn) {
          navigate('/', { replace: true })
        }
      })
      .catch(err => console.error('Auth check failed:', err))
      .finally(() => setCheckingAuth(false))
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const endpoint = isLogin ? 'admin-login' : 'admin-signup'
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : { 
            name: formData.name,
            email: formData.email, 
            password: formData.password,
            role: formData.role
          }
    
      console.log("payload:", payload)
      
      // IMPORTANT: Add credentials: 'include' to send/receive cookies
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/${endpoint}.php`, 
        payload,
        { withCredentials: true } // This enables session cookies
      )
      
      console.log("res:", response.data)
      
      if (response.data && response.data.success) {
        // Don't use localStorage anymore - session is handled by PHP
        // Force a page reload to ensure App.jsx re-checks the session
        window.location.href = '/'
      } else {
        setError(response.data.message || 'Authentication failed')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError(err.response?.data?.message || 'Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <Shield className="h-12 w-12 text-gray-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            {isLogin ? 'Admin Portal' : 'Admin Registration'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin 
              ? 'Access your administrative dashboard' 
              : 'Create your administrator account to get started'
            }
          </p>
        </div>

        {/* Login/Signup Form */}
        <div className="bg-white py-8 px-6 shadow-xl rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="pl-10 block w-full border border-gray-300 rounded-lg py-3 focus:ring-2 focus:ring-gray-500 focus:outline-none"
                  placeholder="Enter your admin email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="pl-10 pr-10 block w-full border border-gray-300 rounded-lg py-3 focus:ring-2 focus:ring-gray-500 focus:outline-none"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Additional Fields for Signup */}
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={formData.name || ''}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="pl-10 block w-full border border-gray-300 rounded-lg py-3 focus:ring-2 focus:ring-gray-500 focus:outline-none"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      required
                      value={formData.role || ''}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      className="pl-10 block w-full border border-gray-300 rounded-lg py-3 focus:ring-2 focus:ring-gray-500 focus:outline-none"
                    >
                      <option value="">Select Role</option>
                      <option value="admin">Administrator</option>
                      <option value="manager">Manager</option>
                      <option value="staff">Staff</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center">
                    {isLogin ? 'Sign In' : 'Sign Up'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                )}
              </button>
            </div>

            {/* 
            <div className="text-center">
              <p className="text-sm text-gray-600">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin)
                    setError('')
                    setFormData({ email: '', password: '' })
                  }}
                  className="font-medium text-gray-600 hover:text-gray-500 focus:outline-none underline"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
            */}
          </form>
        </div>

        {/* Tenant Portal Link */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Are you a tenant?{' '}
            <Link 
              to="/signin" 
              className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none underline"
            >
              Access Tenant Portal
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default AdminPortal