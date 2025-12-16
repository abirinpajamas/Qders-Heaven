import { FileSpreadsheet, Plus, Calendar, Eye, Download, FileText } from 'lucide-react'
import { useState,useEffect } from 'react'
import axios from 'axios'

const TenantsBillGenerate = () => {

  const [units, setUnits] = useState([])
  const [property, setProperty] = useState([])
  const [selectedProperty, setSelectedProperty] = useState('')
  const [selectedUnit, setSelectedUnit] = useState('')
  const [startperiod, setStartperiod] = useState('')
  const [endperiod, setEndperiod] = useState('')
  const [rentAmount, setRentAmount] = useState(0)
  const [status, setStatus] = useState('')
  const [meterid, setMeterid] = useState('')
  const [note, setNote] = useState('')
  const [pdfUrl, setPdfUrl] = useState(null)
  const [popup, setpopup] = useState(false);

  // Load jsPDF UMD from CDN once
  useEffect(() => {
    if (window.jspdf && window.jspdf.jsPDF) return
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js'
    script.async = true
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [])
 useEffect(()=>{
  fetch('http://localhost/qadersheavennew/php/getunits.php')
  .then((res)=>res.json())
  .then((data)=>{
    setUnits(data)
    console.log(data)
  })
 },[])

 useEffect(()=>{
  fetch('http://localhost/qadersheavennew/php/fetchproperty.php')
  .then((res)=>res.json())
  .then((data)=>{
    setProperty(data)
    console.log(data)
  })
 },[])
 
 const handleSubmit=async (e)=>{
    e.preventDefault();
    
    console.log(name)
   try{
    const response=await axios.post('http://localhost/qadersheavennew/php/billgenerate.php', {
      selectedUnit,
      startperiod,
      endperiod,
      rentAmount,
      status,
      meterid,
      note
    })
    console.log(response.data.success)
    console.log(response.data)
    await generatePdf()

    }catch(err){
    console.error(err)
  }
}

 // Create a simple PDF with the bill info
 const generatePdf = async () => {
  try {
    const { jsPDF } = window.jspdf || {};
    if (!jsPDF) {
      alert('PDF generator not loaded. Please wait a moment and try again.');
      return;
    }

    const doc = new jsPDF();
    
    // --- 1. Header Design ---
    doc.setFillColor(44, 62, 80); // Professional Dark Blue/Grey
    doc.rect(0, 0, 210, 30, 'F'); // Fill a rectangle at the top
    
    doc.setTextColor(255, 255, 255); // White text
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("TENANT'S BILL", 15, 20);
    
    // Reset for Body
    doc.setTextColor(0, 0, 0); 
    
    // --- 2. Data Preparation ---
    // Using .find() instead of .filter()[0] is cleaner and faster
    const propName = property.find(p => p.property_id === selectedProperty)?.name || 'N/A';
    const unitNum = units.find(u => u.unit_id === selectedUnit)?.unit_number || 'N/A';

    const rows = [
      ['Property Name', propName],
      ['Unit Number', unitNum],
      ['Meter ID', meterid || 'N/A'],
      ['Billing Period', `${startperiod || '...'} to ${endperiod || '...'}`],
      ['Rent Amount', `${rentAmount || '0'} BDT`],
      ['Status', (status || 'Pending').toUpperCase()],
      ['Note', note || 'N/A']
    ];

    // --- 3. Rendering Content ---
    let y = 45; // Start below the header
    
    rows.forEach(([label, value]) => {
      // Draw Label (Bold & Grey)
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(100, 100, 100);
      doc.text(`${label}:`, 15, y);

      // Draw Value (Normal & Black)
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      doc.text(String(value), 70, y);

      // Draw a very light separator line
      doc.setDrawColor(230, 230, 230);
      doc.line(15, y + 2, 195, y + 2);

      y += 12; // More spacing between rows for a "clean" look
    });

    // --- 4. Notes Section ---
    if (note) {
      y += 10;
      doc.setFont("helvetica", "italic");
      doc.setFontSize(10);
      doc.setTextColor(120, 120, 120);
      doc.text("Note:", 15, y);
      // Use splitTextToSize in case the note is very long
      const splitNote = doc.splitTextToSize(note, 180);
      doc.text(splitNote, 15, y + 5);
    }

    // --- 5. Footer ---
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text(`Generated on ${new Date().toLocaleString()}`, 15, 285);

    // Output
    const blob = doc.output('blob');
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);

  } catch (err) {
    console.error("PDF Generation Error:", err);
  }
};

 // View and Download handlers for generated PDF
 const handleViewPdf = () => {
   if (pdfUrl) window.open(pdfUrl, '_blank')
 }

 const handleDownloadPdf = () => {
   if (!pdfUrl) return
   const a = document.createElement('a')
   a.href = pdfUrl
   a.download = `tenant-bill-${selectedUnit || 'unit'}-${startperiod || ''}-${endperiod || ''}.pdf`
   document.body.appendChild(a)
   a.click()
   document.body.removeChild(a)
 }

 const handlereset=()=>{
    window.location.reload();
 }
  return (
    <>
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Tenant's Bill Generate</h1>
        <p className="text-gray-600 mt-1">Generate bills for tenants</p>
      </div>

      <form onSubmit={handleSubmit}>
      <div className="card">
        <h2 className="text-lg font-bold text-gray-800 mb-6">Generate New Bill</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Property</label>
            <select className="input-field"
              value={selectedProperty}
              onChange={(e)=>setSelectedProperty(e.target.value)}
              required
            >
              <option>Select Property</option>
              {property.map((prop)=>(
              <option key={prop.property_id} value={prop.property_id}>
                {prop.name}
              </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Unit</label>
            <select 
            value={selectedUnit}
            onChange={(e)=>setSelectedUnit(e.target.value)}
            className="input-field" required>
              <option value=''>Select Unit</option>
              {units.filter(unit=>unit.property_id===selectedProperty).map((unit)=>(
              <option key={unit.unit_id} value={unit.unit_id}>
                {unit.unit_number}
                </option>
              ))}

            </select>
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Meter Id</label>
            <input type="text"value={meterid} onChange={(e)=>setMeterid(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fiscal Period</label>
          <div className="flex space-x-4"> 
          <div> 
            <input type="date" value={startperiod} onChange={(e)=>setStartperiod(e.target.value)} className="input-field" required/>
          </div>
           <p className='mx-4'>to</p>
          <div>
            <input type="date" value={endperiod} onChange={(e)=>setEndperiod(e.target.value)} className="input-field" required/>
          </div>
          </div> 
          </div> 

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rent Amount (৳)</label>
            <input type="number" value={rentAmount} 
            onChange={(e)=>setRentAmount(e.target.value)} 
            placeholder="25000" className="input-field" required/>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select className="input-field" value={status} onChange={(e)=>setStatus(e.target.value)} required>
              <option value="">Select Status</option>
              <option value="Unpaid">Unpaid</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Note</label>
            <input type="text" value={note} 
            onChange={(e)=>setNote(e.target.value)} 
            placeholder="Enter any notes here" className="input-field" />
          </div>
       {/*
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gas Bill (৳)</label>
            <input type="number" placeholder="800" className="input-field" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Water Bill (৳)</label>
            <input type="number" placeholder="500" className="input-field" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Service Charge (৳)</label>
            <input type="number" placeholder="2000" className="input-field" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Other Charges (৳)</label>
            <input type="number" placeholder="0" className="input-field" />
          </div>
*/}
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between text-lg font-bold">
            <span className="text-gray-700">Total Amount:</span>
            <span className="text-primary-600">৳{rentAmount}</span>
          </div>
        </div>

        <div className="mt-6 flex space-x-4">
          <button type="submit" className="btn-success flex items-center space-x-2">
            <FileSpreadsheet className="w-5 h-5" />
            <span>Generate Bill</span>
          </button>
          <button className="btn-secondary" onClick={handlereset}>Reset</button>
        </div>
        {pdfUrl && (
          <div className="mt-4 inline-flex items-center space-x-3 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200">
            <FileText className="w-5 h-5 text-gray-700" />
            <span className="text-sm text-gray-700">Bill PDF ready</span>
            <button type="button" onClick={handleViewPdf} className="btn-icon bg-blue-100 hover:bg-blue-200 text-blue-700">
              <Eye className="w-4 h-4" />
            </button>
            <button type="button" onClick={handleDownloadPdf} className="btn-icon bg-green-100 hover:bg-green-200 text-green-700">
              <Download className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      </form>
      
      <div className="card">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-primary-50 hover:bg-primary-100 rounded-lg text-left transition-colors" 
          onClick={() => setpopup(true)}>
            <Calendar className="w-8 h-8 text-primary-600 mb-2" />
            <h3 className="font-medium text-gray-800" >Generate Monthly Bills</h3>
            <p className="text-sm text-gray-600 mt-1">For all tenants</p>
          </button>
          <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-colors"
          onClick={() => setpopup(true)}>
            <FileSpreadsheet className="w-8 h-8 text-green-600 mb-2" />
            <h3 className="font-medium text-gray-800">Bulk Bill Generation</h3>
            <p className="text-sm text-gray-600 mt-1">Multiple properties</p>
          </button>
          <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-colors">
            <Plus className="w-8 h-8 text-purple-600 mb-2" />
            <h3 className="font-medium text-gray-800">Custom Bill</h3>
            <p className="text-sm text-gray-600 mt-1">Create custom bill</p>
          </button>
        </div>
      </div>
      
    
    </div>
     {popup && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50">
        <div className="bg-white w-full max-w-sm mx-auto rounded-2xl shadow-2xl p-6 space-y-4 border border-red-100">
          <h2 className="text-xl font-semibold text-center text-red-700 mb-4">
            Confirm Bulk Bill Generation
          </h2>
          <p className="text-gray-700 text-center">
            Are you sure you want generate all bills at once? Bills will be calculated based on base rent.
          </p>
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => setpopup(false)}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handledelete(selectedId)}
              className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 shadow-sm transition"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  )
}

export default TenantsBillGenerate;
