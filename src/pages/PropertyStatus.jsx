import { CheckSquare, Building2, DoorOpen } from 'lucide-react'
import { useState,useEffect } from 'react'

const PropertyStatus = () => {

  const [statusdata,setStatusdata]=useState([])
  const [unitdata,setunitdata]=useState([])
  const [totalunits,settotalunits]=useState(0)
  const [occupiedunits,setoccupiedunits]=useState(0)
  const [vacantunits,setvacantunits]=useState(0)
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
      setStatusdata(data.details)
      setunitdata(data.count)
      console.log(data.count) 
      })
    .catch((error) => { // <-- ADD THIS CATCH BLOCK
      console.error("Fetch Error:", error);
      // Optional: Set some error state here to show a message to the user
    });
    

  

  },[])



  useEffect(()=>{
   settotalunits(statusdata.reduce((acc,prop)=>{return acc+Number(prop.total_units)}, 0))
   setoccupiedunits(unitdata.reduce((acc,prop)=>{return acc+Number(prop.unit_count)}, 0))
   setvacantunits(totalunits - occupiedunits)

  },[])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Property Status</h1>
        <p className="text-gray-600 mt-1">Overview of all property statuses</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {statusdata.map((property) => (

          
          <div key={property.property_id} className="card">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{property.name}</h3>
                  <p className="text-sm text-gray-600">{property.total_units} Total Units</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{unitdata.filter(unit=>unit.property_id===property.property_id)[0]?.unit_count || 0}</p>
                <p className="text-xs text-gray-600 mt-1">Occupied</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600">{property.total_units - (unitdata.filter(unit=>unit.property_id===property.property_id)[0]?.unit_count || 0)}</p>
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
                <span className="text-sm font-bold text-primary-600">{Math.ceil((unitdata.filter(unit=>unit.property_id===property.property_id)[0]?.unit_count || 0)*100/property.total_units)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-primary-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(unitdata.filter(unit=>unit.property_id===property.property_id)[0]?.unit_count || 0)*100/property.total_units}%` }}
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
            <p className="text-3xl font-bold">{totalunits}</p>
            <p className="text-sm mt-2">Total Units</p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-green-500 to-green-600 rounded-lg text-white">
            <p className="text-3xl font-bold">{occupiedunits}</p>
            <p className="text-sm mt-2">Occupied</p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg text-white">
            <p className="text-3xl font-bold">{vacantunits}</p>
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
