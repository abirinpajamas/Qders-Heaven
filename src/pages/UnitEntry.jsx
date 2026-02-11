import { Plus, DoorOpen, Edit, Trash2, Eye } from 'lucide-react'
import { useState,useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'
import { hex } from 'framer-motion';

const UnitEntry = () => {

  const [prov,setprov]=useState(false)
    const [property,setproperty]=useState('')
    const [propertydata,setpropertydata]=useState([])
    const [unitnum,setunitnum]=useState('')
    const [bathroom,setbathroom]=useState('')
    const [bedrooms,setbedrooms]=useState('')
    const [status,setstatus]=useState('')
    const [type,settype]=useState('')
    const [electricmeter,setelectricmeter]=useState('')
    const [gasmeter,setgasmeter]=useState('')
    const [squareFootage,setsquareFootage]=useState('')
    const [baseRent,setbaseRent]=useState('')
    const [unitdata,setunitdata]=useState([])
    const [state,setstate]=useState(false)
    const [popup,setpopup]=useState(false)
    const [selectedId,setselectedId]=useState(null)
    const [propmessage,setpropmessage]=useState('')
    const [viewinfo,setviewinfo]=useState('')
    const [editinfo,seteditinfo]=useState('')
    const [editing,setEditing]=useState([])
    const [tempValue,setTempValue]=useState('')
    const [role,setRole]=useState('')

  
  useEffect(()=>{
    fetch(`${import.meta.env.VITE_API_BASE_URL}/fetchproperty.php`,{
      method: 'GET',
      credentials: 'include'
    })
     .then((res)=>res.json())
     .then((data)=>{
      if(data.success){
      setpropertydata(data.data);
      console.log(data)
      setRole(data.role)
      }else{
        console.log(data.message)
        setpropmessage('Add properties in the Properties Page')
      }
     })
      .catch((err)=>console.error(err));

  },[])
  useEffect(()=>{
    fetch(`${import.meta.env.VITE_API_BASE_URL}/getunits.php`)
     .then((res)=>res.json())
     .then((data)=>{

      setunitdata(data? data : []);
      console.log(data)
     })
      .catch((err)=>console.error(err));

  },[state])


  const handleSubmit=async (e)=>{
    e.preventDefault();
    setprov(false)
    console.log(unitnum)
   try{
    const response=await axios.post(`${import.meta.env.VITE_API_BASE_URL}/unitentry.php`, {
      property,
      unitnum,
      bathroom,
      bedrooms,
      electricmeter,
      gasmeter,
      squareFootage,
      baseRent,
      type,
      status
    }, { withCredentials: true })
    console.log(response.data.success)
    console.log(response.data)
    setstate(!state)

    }catch(err){
    console.error(err)
  }
}

  const handledelete=async(id)=>{
    setpopup(false)
    try{
      const response=await axios.post(`${import.meta.env.VITE_API_BASE_URL}/deleteunit.php`, { id }, { withCredentials: true })
      console.log(response.data)
      setstate(!state)
    }catch(err){
      console.error(err)
    }
  }

  const Editablefield=({id,field,value,onSave})=>{
    const isediting=editing.id===id && editing.field===field;
    
    if(isediting){
      return(
        <input
           autoFocus
           className="border-b border-primary-500 outline-none bg-transparent w-full text-gray-800"
           value={tempValue}
           onChange={(e)=>setTempValue(e.target.value)}
           onBlur={() => {
             if(tempValue.trim() && tempValue !== value){
               onSave(id, field, tempValue);
             } else {
               setEditing({id:null, field:null});
             }
           }}
           onKeyDown={(e) => {
             if(e.key === 'Enter'){
               if(tempValue.trim() && tempValue !== value){
                 onSave(id, field, tempValue);
               } else {
                 setEditing({id:null, field:null});
               }
             } else if(e.key === 'Escape'){
               setEditing({id:null, field:null});
             }
           }}
        />
      )
    }
    return (
      <div className="flex items-center justify-between group">
        <span 
          className="cursor-pointer hover:bg-gray-100 px-1 rounded flex-1"
          onClick={() => {
            setEditing({id, field});
            setTempValue(value);
          }}
        >
          {value}
        </span>
        <button 
          className="p-1 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors opacity-0 group-hover:opacity-100"
          onClick={() => { 
            setEditing({id, field}); 
            setTempValue(value); 
          }}
        >
          <Edit className="w-3 h-3" />
        </button>
      </div>
    )
  }

  const updateunit = async (id, field, value) => {
    try{
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/updateunit.php`, { 
        unit_id: id,
        field: field,
        value: value
      }, { withCredentials: true })
      
      console.log(response.data)
      setstate(!state)
      setEditing({id:null, field:null})
      setTempValue('')
    } catch(err){
      console.error(err)
      setEditing({id:null, field:null})
      setTempValue('')
    }
  }

  return (
    <>
    <div className="space-y-6 px-4 md:px-0">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Unit Entry</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">Manage property units</p>
        </div>
        <button 
          className="btn-primary flex items-center justify-center space-x-2 w-full md:w-auto"
          onClick={() => {setprov(true)}}
        >
          <Plus className="w-5 h-5" />
          <span>Add Unit</span>
        </button>
      </div>

      {propmessage && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
          <p className="text-sm">No properties found. Add properties in the {' '}
            <Link to="/property" className="font-bold underline hover:text-yellow-900">
              Properties Page
            </Link>.
          </p>
        </div>
      )}

      <div className="card">
        <h2 className="text-base md:text-lg font-bold text-gray-800 mb-4">Units List</h2>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3">
          {unitdata.length === 0 ? (
            <div className="text-center py-8 text-sm text-gray-500">
              No units found
            </div>
          ) : (
            unitdata.map((unit) => (
              <div key={unit.unit_id} className="border rounded-lg p-4 space-y-3">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <DoorOpen className="w-5 h-5 text-primary-600 mr-2" />
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{unit.unit_number}</p>
                      <p className="text-xs text-gray-500">ID: {unit.unit_id}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    unit.status === 'Occupied' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {unit.status}
                  </span>
                </div>

                {/* Property Name */}
                <div className="pt-2 border-t">
                  <p className="text-xs text-gray-500">Property</p>
                  <p className="text-sm text-gray-700 font-medium">{unit.name}</p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t text-sm">
                  <div>
                    <p className="text-xs text-gray-500">Base Rent</p>
                    <p className="text-gray-700 font-semibold">৳{unit.base_rent}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Size</p>
                    <p className="text-gray-700">{unit.square_footage} sqft</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Bedrooms</p>
                    <p className="text-gray-700">{unit.bedrooms}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t">
                  <button 
                    className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 px-3 py-2 rounded text-sm font-medium transition flex items-center justify-center gap-1"
                    onClick={() => setviewinfo(unit)}
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  
                  {role==='super admin' && (
                  <button 
                    className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded transition"
                    onClick={() => { setpopup(true); setselectedId(unit.unit_id); }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="table-header">
              <tr>
                <th className="px-4 lg:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold">Sl.No</th>
                <th className="px-4 lg:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold">Unit No</th>
                <th className="px-4 lg:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold">Property</th>
                <th className="px-4 lg:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold">Base Rent(৳)</th>
                <th className="px-4 lg:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold">Size(sq.ft)</th>
                <th className="px-4 lg:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold">Bedrooms</th>
                <th className="px-4 lg:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold">Status</th>
                <th className="px-4 lg:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {unitdata.map((unit) => (
                <tr key={unit.unit_id} className="table-row">
                  <td className="px-4 lg:px-6 py-4 text-sm text-gray-700">{unit.unit_id}</td>
                  <td className="px-4 lg:px-6 py-4">
                    <div className="flex items-center">
                      <DoorOpen className="w-5 h-5 text-primary-600 mr-2" />
                      <span className="text-sm font-medium text-gray-700">{unit.unit_number}</span>
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-4 text-sm text-gray-700">{unit.name}</td>
                  <td className="px-4 lg:px-6 py-4 text-sm text-gray-700">{unit.base_rent}</td>
                  <td className="px-4 lg:px-6 py-4 text-sm text-gray-700">{unit.square_footage}</td>
                  <td className="px-4 lg:px-6 py-4 text-sm text-gray-700">{unit.bedrooms}</td>
                  <td className="px-4 lg:px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      unit.status === 'Occupied' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {unit.status}
                    </span>
                  </td>
                  <td className="px-4 lg:px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="btn-icon bg-green-100 hover:bg-green-200 text-green-700"
                              onClick={() => setviewinfo(unit)}>
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      {role==='super admin' && (
                      <button className="btn-icon bg-red-100 hover:bg-red-200 text-red-700" onClick={() => { setpopup(true); setselectedId(unit.unit_id); }}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {unitdata.length === 0 && (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                    No units found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    {viewinfo && (

      <Dialog
        open={!!viewinfo}
        onOpenChange={() => setviewinfo(null)}
      >
       <DialogContent className="w-[calc(100vw-2rem)] sm:md:w-md rounded-2xl"> 
        
        <DialogHeader className="relative">
          <div className="flex items justify-between">
            <Badge className="bg-white/20 hover:bg-white/30 text-white border-none capitalize"
                  style={{backgroundColor: viewinfo.status === 'occupied' ? '#055f26ff' : '#9ca3af'}}

            >
                {viewinfo.status}
            </Badge>
          
          <DialogTitle className="flex items-center">
            
            Unit-{viewinfo.unit_number} Information
          </DialogTitle>
          <div className="w-[70px] invisible" aria-hidden="true" />
          </div>
        </DialogHeader>
        
           
         <div className="p-6 space-y-6">
        {/* Primary Details Grid */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-gray-100 p-3 rounded-xl">
            <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Rent</p>
            <p className="text-lg font-semibold text-gray-800">
              <Editablefield 
                id={viewinfo.unit_id} 
                field="base_rent" 
                value={viewinfo.base_rent} 
                onSave={updateunit}
              />
            </p>
          </div>
          <div className="bg-gray-100 p-3 rounded-xl">
            <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Beds</p>
            <p className="text-lg font-semibold text-gray-800">
              <Editablefield 
                id={viewinfo.unit_id} 
                field="bedrooms" 
                value={viewinfo.bedrooms} 
                onSave={updateunit}
              />
            </p>
          </div>
          <div className="bg-gray-100 p-3 rounded-xl">
            <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Baths</p>
            <p className="text-lg font-semibold text-gray-800">
              <Editablefield 
                id={viewinfo.unit_id} 
                field="bathrooms" 
                value={viewinfo.bathrooms} 
                onSave={updateunit}
              />
            </p>
          </div>
        </div>

        {/* Property & Tenant Info */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Occupancy Details</h3>
          <div className="grid grid-cols-2 gap-y-3 border-t pt-3">
            <div>
              <p className="text-xs text-gray-500">Tenant Name</p>
              <p className="text-sm font-medium text-gray-700">{viewinfo.tenantname || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Tenant ID</p>
              <p className="text-sm font-medium text-gray-700">#{viewinfo.tenant_id}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Size</p>
              <p className="text-sm font-medium text-gray-800">
                <Editablefield 
                  id={viewinfo.unit_id} 
                  field="square_footage" 
                  value={viewinfo.square_footage} 
                  onSave={updateunit}
                />
                sqft
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Unit Type</p>
              <p className="text-sm font-medium text-gray-800">
                <Editablefield 
                  id={viewinfo.unit_id} 
                  field="type" 
                  value={viewinfo.type} 
                  onSave={updateunit}
                />
              </p>
            </div>
          </div>
        </div>

        {/* Technical Info */}
        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
           <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-blue-600 font-semibold">Electric Meter</p>
                <p className="text-sm text-gray-800">
                  <Editablefield 
                    id={viewinfo.unit_id} 
                    field="electricmeter" 
                    value={viewinfo.electricmeter || ""} 
                    onSave={updateunit}
                  />
                </p>
              </div>
              <div>
                <p className="text-xs text-blue-600 font-semibold">Gas Meter</p>
                <p className="text-sm text-gray-800">
                  <Editablefield 
                    id={viewinfo.unit_id} 
                    field="gasmeter" 
                    value={viewinfo.gasmeter || ""} 
                    onSave={updateunit}
                  />
                </p>
              </div>
           </div>
        </div>

        <div className="flex justify-between items-center pt-2 text-[10px] text-gray-600 italic">
          <span>Added: {new Date(viewinfo.created_at).toLocaleDateString()}</span>
        </div>
       </div>
       
       </DialogContent>
      </Dialog>
    )}

    {popup && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50 p-4">
        <div className="bg-white w-full max-w-sm mx-auto rounded-2xl shadow-2xl p-6 space-y-4 border border-red-100">
          <h2 className="text-xl font-semibold text-center text-red-700 mb-4">
            Confirm Deletion
          </h2>
          <p className="text-gray-700 text-center">
            Are you sure you want to delete this unit? This action cannot be undone.
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
              Delete
            </button>
          </div>
        </div>
      </div>
    )}
    
    {prov && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50 p-4"
           onClick={()=>setprov(false)}
    >

        <form
          onSubmit={handleSubmit}
          onClick={(e) => e.stopPropagation()}
          className="bg-white w-full max-w-md mx-auto rounded-2xl shadow-2xl p-4 sm:p-6 space-y-2.5 border border-sky-100 max-h-[90vh] overflow-y-auto"
        >
          <h2 className="text-lg sm:text-xl font-semibold text-center text-sky-700 mb-4">
            Register New Unit 
          </h2>

          {/* Property Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Property Name
            </label>
            <select
              value={property}
              onChange={(e) => setproperty(e.target.value)}
              className="w-full border border-sky-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-400 focus:outline-none"
              required
            >
              <option value="">Select Property</option>
              {propertydata.map((prop) => (
                <option key={prop.property_id} value={prop.property_id}>
                  {prop.name}
                </option>
              ))}
            </select>
          </div>

          {/* Unit Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unit Number
            </label>
            <input
              type="text"
              value={unitnum}
              onChange={(e) => setunitnum(e.target.value)}
              className="w-full border border-sky-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-400 focus:outline-none"
              placeholder="C2-101"
              required
            />
          </div>

          {/* Bedrooms & Bathrooms */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Square Footage
              </label>
              <input
                type="text"
                value={squareFootage}
                onChange={(e) => setsquareFootage(e.target.value)}
                className="w-full border border-sky-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-400 focus:outline-none"
                placeholder="1200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bedrooms
              </label>
              <input
                type="number"
                value={bedrooms}
                onChange={(e) => setbedrooms(e.target.value)}
                className="w-full border border-sky-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-400 focus:outline-none"
                placeholder="3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bathrooms
              </label>
              <input
                type="number"
                value={bathroom}
                onChange={(e) => setbathroom(e.target.value)}
                className="w-full border border-sky-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-400 focus:outline-none"
                placeholder="2"
              />
            </div>
          </div>

          {/* Meter & Square Footage */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Electric Meter
              </label>
              <input
                type="text"
                value={electricmeter}
                onChange={(e) => setelectricmeter(e.target.value)}
                className="w-full border border-sky-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-400 focus:outline-none"
                placeholder="11222854"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gas Meter
              </label>
              <input
                type="text"
                onChange={(e) => setgasmeter(e.target.value)}
                className="w-full border border-sky-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-400 focus:outline-none"
                placeholder="11222854"
              />
            </div>
            
            
          </div>

          {/* Base Rent & Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Base Rent
              </label>
              <input
                type="number"
                value={baseRent}
                onChange={(e) => setbaseRent(e.target.value)}
                className="w-full border border-sky-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-400 focus:outline-none"
                placeholder="30000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => settype(e.target.value)}
                className="w-full border border-sky-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-400 focus:outline-none"
              >
                <option value="">Select Type</option>
                <option value="apt">Apartment</option>
                <option value="shop">Shop</option>
                <option value="office">Office</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setstatus(e.target.value)}
              className="w-full border border-sky-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-400 focus:outline-none"
            >
              <option value="">Select Status</option>
              <option value="vacant">Vacant</option>
              <option value="under_renovation">Under Renovation</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-0 mt-6">
            <button
              type="button"
              onClick={() => setprov(false)}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition w-full sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700 shadow-sm transition w-full sm:w-auto"
            >
              Register Unit
            </button>
          </div>
        </form>
      </div>
    )}
    </>
  )
}

export default UnitEntry