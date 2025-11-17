import { CheckSquare, Building2, DoorOpen } from 'lucide-react'
import { useState,useEffect } from 'react'

const PropertyStatus = () => {

  const [statusdate,setStatusdata]=useState([])
  const properties = [
    {
      id: 1,
      name: 'Rangs Qaders Heaven',
      totalUnits: 20,
      occupied: 15,
      vacant: 5,
      maintenance: 0,
      occupancyRate: 75
    },
    {
      id: 2,
      name: 'Green Valley Apartments',
      totalUnits: 32,
      occupied: 28,
      vacant: 3,
      maintenance: 1,
      occupancyRate: 87.5
    },
    {
      id: 3,
      name: 'Sunset Heights',
      totalUnits: 24,
      occupied: 20,
      vacant: 4,
      maintenance: 0,
      occupancyRate: 83.3
    }
  ]

  useEffect(()=>{
    fetch('http://localhost/qadersheavennew/php/getpropertystatus.php')
    .then((res)=>res.json())
    .then((data)=>{
      setStatusdata(data)
      console.log(data) 
    .catch((error) => { // <-- ADD THIS CATCH BLOCK
      console.error("Fetch Error:", error);
      // Optional: Set some error state here to show a message to the user
    });
    })



  },[])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Property Status</h1>
        <p className="text-gray-600 mt-1">Overview of all property statuses</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {properties.map((property) => (
          <div key={property.id} className="card">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{property.name}</h3>
                  <p className="text-sm text-gray-600">{property.totalUnits} Total Units</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{property.occupied}</p>
                <p className="text-xs text-gray-600 mt-1">Occupied</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600">{property.vacant}</p>
                <p className="text-xs text-gray-600 mt-1">Vacant</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-2xl font-bold text-red-600">{property.maintenance}</p>
                <p className="text-xs text-gray-600 mt-1">Maintenance</p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Occupancy Rate</span>
                <span className="text-sm font-bold text-primary-600">{property.occupancyRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-primary-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${property.occupancyRate}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Overall Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg text-white">
            <p className="text-3xl font-bold">76</p>
            <p className="text-sm mt-2">Total Units</p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-green-500 to-green-600 rounded-lg text-white">
            <p className="text-3xl font-bold">63</p>
            <p className="text-sm mt-2">Occupied</p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg text-white">
            <p className="text-3xl font-bold">12</p>
            <p className="text-sm mt-2">Vacant</p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-red-500 to-red-600 rounded-lg text-white">
            <p className="text-3xl font-bold">1</p>
            <p className="text-sm mt-2">Maintenance</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertyStatus
