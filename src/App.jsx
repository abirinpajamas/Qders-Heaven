import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import TenantPortal from './pages/TenantPortal'
import AdminManagement from './pages/AdminManagement'
import Report from './pages/Report'
import Fund from './pages/Fund'
import ServiceProviderContact from './pages/ServiceProviderContact'
import Property from './pages/Property'
import Floor from './pages/Floor'
import Meter from './pages/Meter'
import UnitEntry from './pages/UnitEntry'
import PropertyStatus from './pages/PropertyStatus'
import TenantsDetails from './pages/TenantsDetails'
import TenantsHighlights from './pages/TenantsHighlights'
import TenantsBillGenerate from './pages/TenantsBillGenerate'
import TenantsBill from './pages/TenantsBill'
import PaymentDetails from './pages/PaymentDetails'
import Settings from './pages/Settings'
import BasicSettings from './pages/BasicSettings'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="tenant-portal" element={<TenantPortal />} />
          <Route path="admin-management" element={<AdminManagement />} />
          <Route path="report" element={<Report />} />
          <Route path="fund" element={<Fund />} />
          <Route path="service-provider-contact" element={<ServiceProviderContact />} />
          <Route path="property" element={<Property />} />
          <Route path="floor" element={<Floor />} />
          <Route path="meter" element={<Meter />} />
          <Route path="unit-entry" element={<UnitEntry />} />
          <Route path="property-status" element={<PropertyStatus />} />
          <Route path="tenants-details" element={<TenantsDetails />} />
          <Route path="tenants-highlights" element={<TenantsHighlights />} />
          <Route path="tenants-bill-generate" element={<TenantsBillGenerate />} />
          <Route path="tenants-bill" element={<TenantsBill />} />
          <Route path="payment-details" element={<PaymentDetails />} />
          <Route path="settings" element={<Settings />} />
          <Route path="basic-settings" element={<BasicSettings />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
