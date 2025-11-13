import { Plus, Building2, MapPin, Edit, Trash2, Eye } from 'lucide-react'
import { useState,useEffect } from 'react'
import axios from 'axios'

const Property = () => {



    const [prov,setprov]=useState(false)
    const [state,setstate]=useState(false)
    const [name,setname]=useState('')
    const [total_floors,settotal_floors]=useState('')
    const [address,setaddress]=useState('')
    const [total_units,settotal_units]=useState('')
    const [status,setstatus]=useState('')
    const [description,setdescription]=useState('')
    const [propertydata,setpropertydata]=useState([])

  const properties = [
    { id: 1, name: 'Rangs Qaders Heaven', address: 'Mirpur, Dhaka', floors: 5, units: 20, status: 'Active' },
    { id: 2, name: 'Green Valley Apartments', address: 'Gulshan, Dhaka', floors: 8, units: 32, status: 'Active' },
    { id: 3, name: 'Sunset Heights', address: 'Banani, Dhaka', floors: 6, units: 24, status: 'Active' },
  ]
 
   useEffect(()=>{
      fetch('http://localhost/qadersheavennew/php/fetchproperty.php')
      .then((res)=>res.json())
      .then((data)=>{
        setpropertydata(data)
        console.log(data)

      })
       .catch((error)=>{

          console.error('Error fetching property data:', error);

       })

    },[state])

  const handleSubmit=async (e)=>{
    e.preventDefault();
    setprov(false)
    console.log(name)
   try{
    const response=await axios.post('http://localhost/qadersheavennew/php/property.php', {
      name,
      total_floors,
      address,
      total_units,
      description,
      status
    })
    console.log(response.data.success)
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
          <h1 className="text-2xl font-bold text-gray-800">Property Management</h1>
          <p className="text-gray-600 mt-1">Manage all properties</p>
        </div>
        <button className="btn-primary flex items-center space-x-2" onClick={() => setprov(true)}>
          <Plus className="w-5 h-5" />
          <span>Add Property</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {propertydata.map((property) => (
          <div key={property.id} className="card hover:shadow-lg transition-shadow">
            <div className="w-full h-40 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg mb-4 flex items-center justify-center">
              <Building2 className="w-16 h-16 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">{property.name}</h3>
            <div className="flex items-center text-sm text-gray-600 mb-4">
              <MapPin className="w-4 h-4 mr-2" />
              {property.address}
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-primary-600">{property.total_floors}</p>
                <p className="text-xs text-gray-600">Floors</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-primary-600">{property.total_units}</p>
                <p className="text-xs text-gray-600">Units</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                {property.status}
              </span>
              <div className="flex items-center space-x-2">
                <button className="btn-icon bg-green-100 hover:bg-green-200 text-green-700">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="btn-icon bg-blue-100 hover:bg-blue-200 text-blue-700">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="btn-icon bg-red-100 hover:bg-red-200 text-red-700">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

   {prov && (
      
       <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-white w-full max-w-md mx-auto rounded-2xl shadow-2xl p-6 space-y-2.5 border border-sky-100"
          >
            <h2 className="text-xl font-semibold text-center text-sky-700 mb-4">
              Register New Property 
            </h2>

            {/* Provider Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setname(e.target.value)}
                className="w-full border border-sky-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                placeholder="e.g., ABC Plumbing Services"
                required
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setaddress(e.target.value)}
                className="w-full border border-sky-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                placeholder="Bailey Road, Dhaka"
                
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Floors
              </label>
              <input
                type="number"
                value={total_floors}
                onChange={(e) => settotal_floors(e.target.value)}
                className="w-full border border-sky-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                placeholder="10"
                
              />
            </div>

            {/* Contact Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Units
              </label>
              <input
                type="number"
                value={total_units}
                onChange={(e) => settotal_units(e.target.value)}
                className="w-full border border-sky-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                placeholder="5"
                
              />
            </div>

            {/* Contact Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setdescription(e.target.value)}
                className="w-full border border-sky-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                placeholder="Description of the property"
                
              />
            </div>

            {/* Service Type */}
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="archived">Archive</option>
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
                Register Property
              </button>
            </div>
          </form>
        </div>)}
   </>
  )
}

export default Property
