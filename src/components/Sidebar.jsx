import { NavLink } from 'react-router-dom'
import { useState } from 'react'
import { 
  Home, 
  Users, 
  FileText, 
  DollarSign, 
  Phone, 
  Building2, 
  DoorOpen, 
  CheckSquare, 
  UserCheck, 
  Star, 
  FileSpreadsheet, 
  Receipt, 
  CreditCard, 
  Settings,
  Sliders,
  Wrench,
  ChevronDown,
  ChevronRight
} from 'lucide-react'

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [openSections, setOpenSections] = useState({
    maintenance: false,
    settings: false
  })

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }
  const menuItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/tenant-portal', icon: UserCheck, label: 'Tenant Portal' },
    { path: '/report', icon: FileText, label: 'Report' },
    { path: '/payment-details', icon: CreditCard, label: 'Payment Details' },

    // Maintenance Section
    {
      section: 'Management',
      icon: Users,
      items: [
        { path: '/admin-management', icon: Users, label: 'Admin Management' },
        { path: '/tenants-details', icon: UserCheck, label: 'Tenants Details' }
      ]
    },

    {
      section: 'Properties',
      icon: Building2,
      items: [
        { path: '/property', icon: Building2, label: 'Property' },
    { path: '/unit-entry', icon: DoorOpen, label: 'Units' },
    { path: '/property-status', icon: CheckSquare, label: 'Property Status' },
      ]
    },
    
    {
      section: 'Financials',
      icon: DollarSign,
      items: [
       { path: '/fund', icon: DollarSign, label: 'Fund' },
       { path: '/tenants-bill-generate', icon: FileSpreadsheet, label: "Tenant's Bill Generate" },
       { path: '/tenants-bill', icon: Receipt, label: 'Tenants Bill' },
       { path: '/maintenance-bill', icon: FileText, label: 'Maintenance Bills' }


      ]
    },

    {
      section: 'Maintenance',
      icon: Wrench,
      items: [
        { path: '/service-provider-contact', icon: Phone, label: 'Service Provider Contact' },
      ]
    },
     
    
    
    
    
    { path: '/tenants-highlights', icon: Star, label: "Tenant's Highlights" },
    
    // Settings Section
    {
      section: 'Settings',
      icon: Settings,
      items: [
        { path: '/settings', icon: Settings, label: 'Settings' },
        { path: '/basic-settings', icon: Sliders, label: 'Basic Settings' }
      ]
    }
  ]

  const renderMenuItems = (items, level = 0, parentSection = null) => {
    return items.map((item, index) => {
      // If it's a section
      if (item.section) {
        const sectionKey = item.section.toLowerCase().replace(/\s+/g, '-')
        const isOpen = openSections[sectionKey] || false
        
        return (
          <li key={`section-${index}`} className={`${level > 0 ? 'pl-4' : ''} mt-4`}>
            <div 
              className="flex items-center justify-between px-4 py-2 text-xs font-semibold text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-700 rounded-lg"
              onClick={() => toggleSection(sectionKey)}
            >
              <div className="flex items-center">
                <item.icon className="w-4 h-4 mr-2" />
                {item.section}
              </div>
              {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </div>
            {isOpen && (
              <ul className="mt-1">
                {renderMenuItems(item.items, level + 1, sectionKey)}
              </ul>
            )}
          </li>
        )
      }
      
      // It's a regular menu item
      return (
        <li key={`item-${index}`} className={level > 0 ? 'pl-4' : ''}>
          <NavLink
            to={item.path}
            className={({ isActive }) => 
              `flex items-center px-4 py-3 text-sm font-medium rounded-lg group ${isActive ? 'bg-blue-700 text-white' : 'text-gray-300 hover:bg-gray-700'}`
            }
            onClick={() => window.innerWidth < 1024 && toggleSidebar()}
          >
            <item.icon className={`w-5 h-5 mr-3 ${level > 0 ? 'text-gray-400' : 'text-gray-300'} group-hover:text-white`} />
            {item.label}
          </NavLink>
        </li>
      )
    })
  }

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
        <div className="h-16 flex items-center justify-center border-b border-sidebar-light">
          <div className="flex items-center space-x-3">
            <Building2 className="w-8 h-8 text-primary-400" />
            <div>
              <h1 className="text-xl font-bold">Property Heaven</h1>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-4 overflow-y-auto h-[calc(100vh-4rem)] pb-4">
          <ul className="space-y-1 px-3">
            {renderMenuItems(menuItems)}
          </ul>
        </nav>
      </aside>
    </>
  )
}

export default Sidebar
