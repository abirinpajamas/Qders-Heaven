import { Plus, DoorOpen, Edit, Trash2, Eye } from 'lucide-react'
import { useState,useEffect } from 'react'
import axios from 'axios'




const UnitEntry = () => {

  const [prov,setprov]=useState(false)
    const [property,setproperty]=useState('')
    const [propertydata,setpropertydata]=useState([])
    const [unitnum,setunitnum]=useState('')
    const [bathroom,setbathroom]=useState('')
    const [bedrooms,setbedrooms]=useState('')
    const [status,setstatus]=useState('')
    const [type,settype]=useState('')
    const [meter,setmeter]=useState('')
    const [squareFootage,setsquareFootage]=useState('')
    const [baseRent,setbaseRent]=useState('')
    const [unitdata,setunitdata]=useState([])
    const [state,setstate]=useState(false)
    const [popup,setpopup]=useState(false)
    const [selectedId,setselectedId]=useState(null)

  const units = [
    { id: 1, unitNo: 'Unit 1', property: 'Rangs Qaders Heaven', floor: 'Ground Floor', size: '1200 sqft', bedrooms: 3, status: 'Occupied' },
    { id: 2, unitNo: 'Unit 2', property: 'Rangs Qaders Heaven', floor: 'Ground Floor', size: '1200 sqft', bedrooms: 3, status: 'Occupied' },
    { id: 3, unitNo: 'Unit 3', property: 'Rangs Qaders Heaven', floor: '1st Floor', size: '1200 sqft', bedrooms: 3, status: 'Vacant' },
    { id: 4, unitNo: 'Unit 4', property: 'Rangs Qaders Heaven', floor: '1st Floor', size: '1200 sqft', bedrooms: 3, status: 'Occupied' },
    { id: 5, unitNo: 'Unit 5', property: 'Rangs Qaders Heaven', floor: '2nd Floor', size: '1200 sqft', bedrooms: 3, status: 'Occupied' },
  ]

  useEffect(()=>{
    fetch('http://localhost/qadersheavennew/php/fetchproperty.php')
     .then((res)=>res.json())
     .then((data)=>{

      setpropertydata(data);
      console.log(data)
     })
      .catch((err)=>console.error(err));

  },[])
  useEffect(()=>{
    fetch('http://localhost/qadersheavennew/php/getunits.php')
     .then((res)=>res.json())
     .then((data)=>{

      setunitdata(data);
      console.log(data)
     })
      .catch((err)=>console.error(err));

  },[state])


  const handleSubmit=async (e)=>{
    e.preventDefault();
    setprov(false)
    console.log(unitnum)
   try{
    const response=await axios.post('http://localhost/qadersheavennew/php/unitentry.php', {
      property,
      unitnum,
      bathroom,
      bedrooms,
      meter,
      squareFootage,
      baseRent,
      type,
      status
    })
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
      const response=await axios.post('http://localhost/qadersheavennew/php/deleteunit.php', { id })
      console.log(response.data)
      setstate(!state)
    }catch(err){
      console.error(err)
    }
  }

  return (
    <>
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Unit Entry</h1>
          <p className="text-gray-600 mt-1">Manage property units</p>
        </div>
        <button className="btn-primary flex items-center space-x-2"
        onClick={() => {setprov(true)}}>
          <Plus className="w-5 h-5" />
          <span>Add Unit</span>
        </button>
      </div>

      <div className="table-container">
        <table className="w-full">
          <thead className="table-header">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">Sl.No</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Unit No</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Property</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Floor</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Size</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Bedrooms</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {unitdata.map((unit) => (
              <tr key={unit.unit_id} className="table-row">
                <td className="px-6 py-4 text-sm text-gray-700">{unit.unit_id}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <DoorOpen className="w-5 h-5 text-primary-600 mr-2" />
                    <span className="text-sm font-medium text-gray-700">{unit.unit_number}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">{unit.name}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{unit.floor_id}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{unit.square_footage}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{unit.bedrooms}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    unit.status === 'Occupied' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {unit.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <button className="btn-icon bg-green-100 hover:bg-green-200 text-green-700">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="btn-icon bg-blue-100 hover:bg-blue-200 text-blue-700">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="btn-icon bg-red-100 hover:bg-red-200 text-red-700" onClick={() => { setpopup(true); setselectedId(unit.unit_id); }}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {popup && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50">
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
      
       <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-white w-full max-w-md mx-auto rounded-2xl shadow-2xl p-6 space-y-2.5 border border-sky-100"
          >
            <h2 className="text-xl font-semibold text-center text-sky-700 mb-4">
              Register New Unit 
            </h2>

            {/* Provider Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Name
              </label>
              <select
                value={property}
                onChange={(e) => setproperty(e.target.value)}
                className="w-full border border-sky-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
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

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit Number
              </label>
              <input
                type="text"
                value={unitnum}
                onChange={(e) => setunitnum(e.target.value)}
                className="w-full border border-sky-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                placeholder="C2-101"
                required
              />
            </div>

            {/* Email */}
          <div className="flex space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bedrooms
              </label>
              <input
                type="number"
                value={bedrooms}
                onChange={(e) => setbedrooms(e.target.value)}
                className="w-full border border-sky-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                placeholder="10"
                
              />
            </div>

            {/* Contact Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bathrooms
              </label>
              <input
                type="number"
                value={bathroom}
                onChange={(e) => setbathroom(e.target.value)}
                className="w-full border border-sky-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                placeholder="5"
                
              />
            </div>
         </div>
          <div className="flex space-x-4">
            {/* Contact Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meter
              </label>
              <input
                type="text"
                value={meter}
                onChange={(e) => setmeter(e.target.value)}
                className="w-full border border-sky-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                placeholder="11222854"
                
              />
            </div>
              <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Square Footage
              </label>
              <input
                type="text"
                value={squareFootage}
                onChange={(e) => setsquareFootage(e.target.value)}
                className="w-full border border-sky-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                placeholder="2200"
                
              />
            </div>
          </div>
          <div className="flex space-x-4">
              <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Base Rent
              </label>
              <input
                type="number"
                value={baseRent}
                onChange={(e) => setbaseRent(e.target.value)}
                className="w-full border border-sky-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                placeholder="30000"
                
              />
            </div>


            {/* Service Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => settype(e.target.value)}

                className="w-full border border-sky-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
              >
                <option value="">Select Type</option>
                <option value="apt">Apartment</option>
                <option value="shop">Shop</option>
                <option value="office">Office</option>
                <option value="other">Other</option>
              </select>
                
            </div>
          </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setstatus(e.target.value)}

                className="w-full border border-sky-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
              >
                <option value="">Select Status</option>
                <option value="vacant">Vacant</option>
                <option value="occupied">Occupied</option>
                <option value="under_renovation">Under Renovation</option>
              </select>
                
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={() => setprov(false)}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700 shadow-sm transition"
              >
                Register Unit
              </button>
            </div>
          </form>
        </div>)}
     </>
  )
}

export default UnitEntry
