import { User, LogOut, Home } from 'lucide-react'
import { useState } from 'react'

const TenantLayout = ({ children }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  
  const handleLogout = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/logout.php`, {
        method: 'POST',
        credentials: 'include'
      })
      
      if (response.ok) {
        window.location.href = '/signin'
      }
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Tenant Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <Home className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">Tenant Portal</h1>
            </div>

            {/* User Info & Logout */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg">
                <User className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Tenant</span>
              </div>
              <button 
                onClick={() => setShowLogoutModal(true)}
                className="flex items-center space-x-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50">
          <div className="bg-white w-full max-w-sm mx-auto rounded-2xl shadow-2xl p-6 space-y-4 border border-red-100">
            <h2 className="text-xl font-semibold text-center text-red-700 mb-4">
              Confirm Logout
            </h2>
            <p className="text-gray-700 text-center">
              Are you sure you want to logout?
            </p>
            <div className="flex justify-between mt-6 space-x-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TenantLayout
