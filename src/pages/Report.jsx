import { FileText, Download, Calendar, Filter } from 'lucide-react'

const Report = () => {
  const reports = [
    { id: 1, title: 'Monthly Revenue Report', date: '2024-01-31', type: 'Financial', size: '2.4 MB' },
    { id: 2, title: 'Tenant Occupancy Report', date: '2024-01-31', type: 'Occupancy', size: '1.8 MB' },
    { id: 3, title: 'Maintenance Report', date: '2024-01-31', type: 'Maintenance', size: '3.2 MB' },
    { id: 4, title: 'Payment Collection Report', date: '2024-01-31', type: 'Financial', size: '2.1 MB' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
        <p className="text-gray-600 mt-1">Generate and download reports</p>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Generate New Report</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <select className="input-field">
              <option>Financial Report</option>
              <option>Occupancy Report</option>
              <option>Maintenance Report</option>
              <option>Payment Report</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input type="date" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input type="date" className="input-field" />
          </div>
        </div>
        <button className="btn-primary mt-4 flex items-center space-x-2">
          <FileText className="w-5 h-5" />
          <span>Generate Report</span>
        </button>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Reports</h2>
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">{report.title}</h3>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-sm text-gray-600">{report.type}</span>
                    <span className="text-sm text-gray-600">{report.date}</span>
                    <span className="text-sm text-gray-600">{report.size}</span>
                  </div>
                </div>
              </div>
              <button className="btn-icon bg-primary-100 hover:bg-primary-200 text-primary-700">
                <Download className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Report
