import { Menu, LogOut, User } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'

const Header = ({ toggleSidebar }) => {
  const location = useLocation()
  const navigate=useNavigate();
  
  const getPageTitle = () => {
    const path = location.pathname
    const titles = {
      '/': 'Home',
      '/admin-management': 'Admin Management',
      '/report': 'Report',
      '/fund': 'Fund',
      '/service-provider-contact': 'Service Provider Contact',
      '/property': 'Property',
      '/floor': 'Floor',
      '/meter': 'Meter',
      '/unit-entry': 'Unit Entry',
      '/property-status': 'Property Status',
      '/tenants-details': 'Tenants Details',
      '/tenants-highlights': "Tenant's Highlights",
      '/tenants-bill-generate': "Tenant's Bill Generate",
      '/tenants-bill': 'Tenants Bill',
      '/payment-details': 'Payment Details',
      '/settings': 'Settings',
      '/basic-settings': 'Basic Settings',
    }
    return titles[path] || 'Dashboard'
  }


 const handleLogout =async () => {
    try{
     const res=await fetch('http://localhost/qadersheavennew/php/logout.php',
     {method: 'GET',
     credentials: 'include'
     })

     const data=await res.json()
     console.log(data)
     if(data.success){
      console.log('logout successful')
      navigate('/admin-signin')
     }
    }catch(error){
      console.log(error)
    }
    navigate('/admin-signin')
  }
  return (
    <header className="h-16 bg-white shadow-md flex items-center justify-between px-6 sticky top-0 z-10">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
        <h2 className="text-xl font-semibold text-gray-800">{getPageTitle()}</h2>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-lg">
          <User className="w-5 h-5 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">{localStorage.getItem('name')}</span>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                onClick={handleLogout}>
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </header>
  )
}

export default Header
