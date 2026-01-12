import { useState } from 'react'
import { User, Mail, Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react'
import axios from 'axios'
const AccountSettings = ({ userType = 'admin' }) => {
  const [formData, setFormData] = useState({
    current_password: '',
    new_email: '',
    new_password: '',
    confirm_password: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('') // 'success' or 'error'

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const validateForm = () => {
    if (!formData.current_password) {
      setMessage('Current password is required')
      setMessageType('error')
      return false
    }

    if (formData.new_email && !formData.new_email.includes('@')) {
      setMessage('Please enter a valid email address')
      setMessageType('error')
      return false
    }

    if (formData.new_password) {
      if (formData.new_password.length < 6) {
        setMessage('New password must be at least 6 characters long')
        setMessageType('error')
        return false
      }

      if (formData.new_password !== formData.confirm_password) {
        setMessage('New passwords do not match')
        setMessageType('error')
        return false
      }
    }

    if (!formData.new_email && !formData.new_password) {
      setMessage('Please provide either a new email or new password')
      setMessageType('error')
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const response = await axios.post('http://localhost/qadersheavennew/php/updateAccount.php', {
        current_password: formData.current_password,
        new_email: formData.new_email,
        new_password: formData.new_password,
        user_type: userType
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
       
      })

      const data = response.data

      if (data.success) {
        setMessage('Account updated successfully!')
        setMessageType('success')
        // Clear form
        setFormData({
          current_password: '',
          new_email: '',
          new_password: '',
          confirm_password: ''
        })
      } else {
        setMessage(data.message || 'Failed to update account')
        setMessageType('error')
      }
    } catch (error) {
      setMessage('Network error. Please try again.')
      setMessageType('error')
      console.error('Update error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="card">
        <div className="flex items-center mb-6">
          <User className="w-6 h-6 text-gray-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-800">
            Account Settings
          </h1>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center ${
            messageType === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {messageType === 'success' ? (
              <CheckCircle className="w-5 h-5 mr-2" />
            ) : (
              <AlertCircle className="w-5 h-5 mr-2" />
            )}
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Lock className="w-4 h-4 inline mr-1" />
              Current Password *
            </label>
            <div className="relative">
              <input
                type={showPasswords.current ? 'text' : 'password'}
                name="current_password"
                value={formData.current_password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your current password"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              >
                {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* New Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-1" />
              New Email
            </label>
            <input
              type="email"
              name="new_email"
              value={formData.new_email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter new email (optional)"
            />
            <p className="mt-1 text-sm text-gray-500">
              Leave blank to keep current email
            </p>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Lock className="w-4 h-4 inline mr-1" />
              New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? 'text' : 'password'}
                name="new_password"
                value={formData.new_password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter new password (optional)"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              >
                {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Leave blank to keep current password. Minimum 6 characters.
            </p>
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Lock className="w-4 h-4 inline mr-1" />
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              >
                {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Updating...' : 'Update Account'}
            </button>
          </div>
        </form>

        {/* Security Tips */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">Security Tips:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Use a strong password with letters, numbers, and symbols</li>
            <li>• Don't share your password with anyone</li>
            <li>• Update your password regularly</li>
            <li>• Keep your email address current for notifications</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default AccountSettings
