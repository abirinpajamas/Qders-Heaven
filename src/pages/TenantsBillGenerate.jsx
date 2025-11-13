import { FileSpreadsheet, Plus, Calendar } from 'lucide-react'
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

    }catch(err){
    console.error(err)
  }
}


  return (
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
            >
              <option>Apartment</option>
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
            className="input-field">
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
            <input type="date" value={startperiod} onChange={(e)=>setStartperiod(e.target.value)} className="input-field" />
          </div>
           <p className='mx-4'>to</p>
          <div>
            <input type="date" value={endperiod} onChange={(e)=>setEndperiod(e.target.value)} className="input-field" />
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
            <select className="input-field" value={status} onChange={(e)=>setStatus(e.target.value)}>
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
          <button className="btn-secondary">Reset</button>
        </div>
      </div>
      </form>
      
      <div className="card">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-primary-50 hover:bg-primary-100 rounded-lg text-left transition-colors">
            <Calendar className="w-8 h-8 text-primary-600 mb-2" />
            <h3 className="font-medium text-gray-800">Generate Monthly Bills</h3>
            <p className="text-sm text-gray-600 mt-1">For all tenants</p>
          </button>
          <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-colors">
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
  )
}

export default TenantsBillGenerate;
