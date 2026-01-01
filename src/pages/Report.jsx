import { FileText, Download, Calendar, Filter, Eye } from 'lucide-react'
import { useEffect, useState } from 'react'
import axios from 'axios'

const Report = () => {
  const [reportType, setReportType] = useState('Financial')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [bills, setBills] = useState([])
  const [units, setUnits] = useState([])
  const [tenants, setTenants] = useState([])
  const [summary, setSummary] = useState(null)
  const [pdfUrl, setPdfUrl] = useState(null)
  const [loading, setLoading] = useState(false)

  // Load jsPDF UMD from CDN once (reuse pattern from TenantsBillGenerate)
  useEffect(() => {
    if (window.jspdf && window.jspdf.jsPDF) return
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js'
    script.async = true
    document.body.appendChild(script)
    return () => { document.body.removeChild(script) }
  }, [])

  const canonicalizeStatus = (s) => {
    const n = (s || '').toString().trim().toLowerCase()
    if (n === 'paid') return 'Paid'
    if (n === 'pending') return 'Pending'
    if (n === 'overdue') return 'Overdue'
    if (n === 'unpaid') return 'Unpaid'
    return 'Pending'
  }

  const fetchReportData = async () => {
    setLoading(true)
    try {
      const [repRes, unitsRes, tenantsRes] = await Promise.all([
        axios.post('http://localhost/qadersheavennew/php/getreports.php', { start, end }),
        fetch('http://localhost/qadersheavennew/php/getunits.php').then(r => r.json()),
        fetch('http://localhost/qadersheavennew/php/gettenants.php').then(r => r.json())
      ])
      const rows = repRes.data?.data || []
      setBills(rows)
      setUnits(unitsRes || [])
      setTenants(tenantsRes || [])
      computeSummary(rows, unitsRes || [], tenantsRes || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const sum = (arr, sel) => arr.reduce((acc, x) => acc + (Number(sel(x)) || 0), 0)

  const computeSummary = (billsData, allUnits, allTenants) => {
    const paidAmount = sum(billsData.filter(b => canonicalizeStatus(b.status) === 'Paid'), b => b.amount)
    const totalBilled = sum(billsData, b => b.amount)
    const outstanding = totalBilled - paidAmount
    const collectionRate = totalBilled ? (paidAmount / totalBilled) : 0

    const statusCounts = billsData.reduce((acc, b) => {
      const s = canonicalizeStatus(b.status)
      acc[s] = (acc[s] || 0) + 1
      return acc
    }, {})

    const occupied = (allTenants || []).filter(t => (t.status || '').toLowerCase() === 'current').length
    const totalUnits = (allUnits || []).length
    const occupancyRate = totalUnits ? (occupied / totalUnits) : 0

    setSummary({ paidAmount, totalBilled, outstanding, collectionRate, statusCounts, occupied, totalUnits, occupancyRate })
  }

  const handleGenerate = async () => {
    if (!start || !end) return
    await fetchReportData()
  }

  const handleViewPdf = () => {
    if (pdfUrl) window.open(pdfUrl, '_blank')
  }

  const handleDownloadPdf = () => {
    if (!pdfUrl) return
    const a = document.createElement('a')
    a.href = pdfUrl
    a.download = `report-${reportType}-${start}-${end}.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const generatePdf = () => {
    try {
      const { jsPDF } = window.jspdf || {}
      if (!jsPDF) { alert('PDF generator not loaded yet.'); return }

      const doc = new jsPDF()
      // Header
      doc.setFillColor(44,62,80)
      doc.rect(0,0,210,20,'F')
      doc.setTextColor(255,255,255)
      doc.setFontSize(16)
      doc.text(`${reportType} Report`, 10, 12)
      doc.setTextColor(0,0,0)

      let y = 30
      doc.setFontSize(11)
      doc.text(`Period: ${start} to ${end}`, 10, y); y += 8

      if (summary) {
        doc.text(`Total Billed: ৳${Number(summary.totalBilled).toLocaleString()}`, 10, y); y += 6
        doc.text(`Collected (Paid): ৳${Number(summary.paidAmount).toLocaleString()}`, 10, y); y += 6
        doc.text(`Outstanding: ৳${Number(summary.outstanding).toLocaleString()}`, 10, y); y += 6
        doc.text(`Collection Rate: ${(summary.collectionRate*100).toFixed(1)}%`, 10, y); y += 8
        doc.text(`Occupancy: ${summary.occupied}/${summary.totalUnits} (${(summary.occupancyRate*100).toFixed(1)}%)`, 10, y); y += 8
        const sc = summary.statusCounts || {}
        doc.text(`Status Counts - Paid: ${sc.Paid||0}, Pending: ${sc.Pending||0}, Overdue: ${sc.Overdue||0}, Unpaid: ${sc.Unpaid||0}`, 10, y); y += 10
      }

      // Table header
      doc.setFont('helvetica','bold');
      doc.text('Bill ID', 10, y)
      doc.text('Tenant', 35, y)
      doc.text('Unit', 95, y)
      doc.text('Amount', 125, y)
      doc.text('Status', 160, y)
      y += 6
      doc.setFont('helvetica','normal');

      bills.slice(0, 30).forEach(b => {
        const tenant = b.tenant_name || '-'
        const unit = b.unit_number || ''
        doc.text(String(b.bill_id), 10, y)
        doc.text(String(tenant).substring(0, 28), 35, y)
        doc.text(String(unit), 95, y)
        doc.text(`৳${Number(b.amount).toLocaleString()}`, 125, y)
        doc.text(canonicalizeStatus(b.status), 160, y)
        y += 6
        if (y > 280) { doc.addPage(); y = 20 }
      })

      const blob = doc.output('blob')
      if (pdfUrl) URL.revokeObjectURL(pdfUrl)
      const url = URL.createObjectURL(blob)
      setPdfUrl(url)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
        <p className="text-gray-600 mt-1">Generate and download reports</p>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Generate New Report</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <select className="input-field" value={reportType} onChange={(e)=>setReportType(e.target.value)}>
              <option>Financial</option>
              <option>Occupancy</option>
              <option>Maintenance</option>
              <option>Payment</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input type="date" className="input-field" value={start} onChange={(e)=>setStart(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input type="date" className="input-field" value={end} onChange={(e)=>setEnd(e.target.value)} />
          </div>
          <div className="flex items-end">
            <button type="button" onClick={handleGenerate} className="btn-primary flex items-center space-x-2 w-full justify-center" disabled={!start || !end || loading}>
              <FileText className="w-5 h-5" />
              <span>{loading ? 'Generating...' : 'Generate Report'}</span>
            </button>
          </div>
        </div>
        {pdfUrl && (
          <div className="mt-4 inline-flex items-center space-x-3 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200">
            <FileText className="w-5 h-5 text-gray-700" />
            <span className="text-sm text-gray-700">Report PDF ready</span>
            <button type="button" onClick={handleViewPdf} className="btn-icon bg-blue-100 hover:bg-blue-200 text-blue-700">
              <Eye className="w-4 h-4" />
            </button>
            <button type="button" onClick={handleDownloadPdf} className="btn-icon bg-green-100 hover:bg-green-200 text-green-700">
              <Download className="w-4 h-4" />
            </button>
          </div>
        )}
        {bills.length > 0 && (
          <div className="mt-6 flex gap-4">
            <button type="button" onClick={generatePdf} className="btn-secondary">Generate PDF</button>
          </div>
        )}
      </div>

      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card">
            <p className="text-gray-500 text-sm">Total Billed</p>
            <h3 className="text-2xl font-bold">৳{Number(summary.totalBilled).toLocaleString()}</h3>
          </div>
          <div className="card">
            <p className="text-gray-500 text-sm">Collected (Paid)</p>
            <h3 className="text-2xl font-bold">৳{Number(summary.paidAmount).toLocaleString()}</h3>
          </div>
          <div className="card">
            <p className="text-gray-500 text-sm">Outstanding</p>
            <h3 className="text-2xl font-bold">৳{Number(summary.outstanding).toLocaleString()}</h3>
          </div>
          <div className="card">
            <p className="text-gray-500 text-sm">Collection Rate</p>
            <h3 className="text-2xl font-bold">{(summary.collectionRate*100).toFixed(1)}%</h3>
          </div>
          <div className="card">
            <p className="text-gray-500 text-sm">Occupied Units</p>
            <h3 className="text-2xl font-bold">{summary.occupied}/{summary.totalUnits}</h3>
          </div>
          <div className="card">
            <p className="text-gray-500 text-sm">Occupancy Rate</p>
            <h3 className="text-2xl font-bold">{(summary.occupancyRate*100).toFixed(1)}%</h3>
          </div>
          <div className="card">
            <p className="text-gray-500 text-sm">Paid Bills</p>
            <h3 className="text-2xl font-bold">{summary.statusCounts?.Paid || 0}</h3>
          </div>
          <div className="card">
            <p className="text-gray-500 text-sm">Unpaid/Pending/Overdue</p>
            <h3 className="text-2xl font-bold">{(summary.statusCounts?.Unpaid||0) + (summary.statusCounts?.Pending||0) + (summary.statusCounts?.Overdue||0)}</h3>
          </div>
        </div>
      )}

      {bills.length > 0 && (
        <div className="table-container">
          <table className="w-full">
            <thead className="table-header">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Bill ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Tenant</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Unit</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Period</th>
              </tr>
            </thead>
            <tbody>
              {bills.map(b => (
                <tr key={b.bill_id} className="table-row">
                  <td className="px-6 py-4 text-sm font-medium text-gray-700">{b.bill_id}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{b.tenant_name || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{b.unit_number}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-700">৳{Number(b.amount).toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{canonicalizeStatus(b.status)}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{b.period_start} → {b.period_end}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Report
