import { NavLink } from 'react-router-dom'
import { 
  Home, 
  Users, 
  FileText, 
  DollarSign, 
  Phone, 
  Building2, 
  Layers, 
  Gauge, 
  DoorOpen, 
  CheckSquare, 
  UserCheck, 
  Star, 
  FileSpreadsheet, 
  Receipt, 
  CreditCard, 
  Settings,
  Sliders
} from 'lucide-react'

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const menuItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/tenant-portal', icon: UserCheck, label: 'Tenant Portal' },
    { path: '/admin-management', icon: Users, label: 'Admin Management' },
    { path: '/report', icon: FileText, label: 'Report' },
    { path: '/fund', icon: DollarSign, label: 'Fund' },
    { path: '/service-provider-contact', icon: Phone, label: 'Service Provider Contact' },
    { path: '/property', icon: Building2, label: 'Property' },
    //{ path: '/floor', icon: Layers, label: 'Floor' },
    //{ path: '/meter', icon: Gauge, label: 'Meter' },
    { path: '/unit-entry', icon: DoorOpen, label: 'Unit Entry' },
    { path: '/property-status', icon: CheckSquare, label: 'Property Status' },
    { path: '/tenants-details', icon: UserCheck, label: 'Tenants Details' },
    { path: '/tenants-highlights', icon: Star, label: "Tenant's Highlights" },
    { path: '/tenants-bill-generate', icon: FileSpreadsheet, label: "Tenant's Bill Generate" },
    { path: '/tenants-bill', icon: Receipt, label: 'Tenants Bill' },
    { path: '/payment-details', icon: CreditCard, label: 'Payment Details' },
    { path: '/settings', icon: Settings, label: 'Settings' },
    { path: '/basic-settings', icon: Sliders, label: 'Basic Settings' },
  ]

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 h-full bg-sidebar-dark text-white w-64 transform transition-transform duration-300 ease-in-out z-30 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-center border-b border-sidebar-light bg-sidebar-dark">
          <div className="flex items-center space-x-3">
            <Building2 className="w-8 h-8 text-primary-400" />
            <div>
              <h1 className="text-xl font-bold">Qaders Heaven</h1>
              <p className="text-xs text-gray-400">@SuperAdmin</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-4 overflow-y-auto h-[calc(100vh-4rem)] pb-4">
          <ul className="space-y-1 px-3">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-primary-600 text-white shadow-lg'
                        : 'text-gray-300 hover:bg-sidebar-light hover:text-white'
                    }`
                  }
                  onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  )
}

export default Sidebar
