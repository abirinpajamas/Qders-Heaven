import { Save } from 'lucide-react'

const BasicSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Basic Settings</h1>
        <p className="text-gray-600 mt-1">Configure basic application settings</p>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-gray-800 mb-6">Company Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
            <input type="text" placeholder="Qaders Heaven" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
            <input type="email" placeholder="info@qadersheaven.com" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
            <input type="tel" placeholder="+880 1234-567890" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
            <input type="url" placeholder="www.qadersheaven.com" className="input-field" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <textarea rows="3" placeholder="Enter company address" className="input-field"></textarea>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-gray-800 mb-6">Currency & Format</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
            <select className="input-field">
              <option>BDT (৳)</option>
              <option>USD ($)</option>
              <option>EUR (€)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
            <select className="input-field">
              <option>DD-MM-YYYY</option>
              <option>MM-DD-YYYY</option>
              <option>YYYY-MM-DD</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
            <select className="input-field">
              <option>Asia/Dhaka (GMT+6)</option>
              <option>UTC</option>
              <option>America/New_York</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
            <select className="input-field">
              <option>English</option>
              <option>Bengali</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-gray-800 mb-6">Payment Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Default Payment Due Days</label>
            <input type="number" placeholder="5" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Late Payment Fee (%)</label>
            <input type="number" placeholder="5" className="input-field" />
          </div>
          <div className="md:col-span-2">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="w-4 h-4 text-primary-600 rounded" />
              <span className="text-sm text-gray-700">Enable automatic payment reminders</span>
            </label>
          </div>
          <div className="md:col-span-2">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="w-4 h-4 text-primary-600 rounded" />
              <span className="text-sm text-gray-700">Send email notifications for overdue payments</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button className="btn-secondary">Reset</button>
        <button className="btn-success flex items-center space-x-2">
          <Save className="w-5 h-5" />
          <span>Save Settings</span>
        </button>
      </div>
    </div>
  )
}

export default BasicSettings
