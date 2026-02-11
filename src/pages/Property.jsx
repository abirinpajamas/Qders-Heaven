import { Check, ChevronDown, Plus, Building2, MapPin, Edit, Trash2, Eye, FileInput } from 'lucide-react'
import { useState,useEffect, useRef } from 'react'
import axios from 'axios'
import { useLocation } from 'react-router-dom';
import AnimatedCard from '../components/AnimatedCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { handleFileChange, createFormData } from '../utils/fileUpload';

const Property = () => {

  const EditablePhoto=({id, currentUrl, onSave, propertyName})=>{
    const [selectedFile,setselectedFile]=useState(null);
    const [uploading,setuploading]=useState(false);
    const fileInputRef=useRef(null);

    const handleFileSelect=(e)=>{
      handleFileChange(e, (file) => {
        if(file){
          setselectedFile(file);
          handleUpload(file);
        }
      });
    };

    const handleUpload=async(file)=>{
      setuploading(true);
      try{
        const formdata=createFormData({
          property_id: id,
          field: 'property_image'
        }, { property_image: file });

        const response=await axios.post(`${import.meta.env.VITE_API_BASE_URL}/updateproperty.php`, 
          formdata, 
          { withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' } });

        if(response.data.success){
          onSave(id, 'property_picture_url', response.data.new_url);
        }
      }catch(err){
        console.error('Photo upload failed:', err);
      }finally{
        setuploading(false);
        setselectedFile(null);
      }
    };

    return (
      <div className="relative w-full h-40 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg mb-4 flex items-center justify-center overflow-hidden group cursor-pointer">
        {currentUrl ? (
          <img 
            src={`/${currentUrl}`} 
            alt={propertyName} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <Building2 className="w-16 h-16 text-white" />
        )}
        
        {/* Overlay on hover */}
        <div className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity ${
          uploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}>
          {uploading ? (
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
              <p className="text-sm">Uploading...</p>
            </div>
          ) : (
            <div className="text-white text-center">
              <Edit className="w-6 h-6 mx-auto mb-2" />
              <p className="text-sm">Change Photo</p>
            </div>
          )}
        </div>

        {/* Hidden file input that covers the entire clickable area */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />
      </div>
    );
  };



    const [prov,setprov]=useState(false)
    const [state,setstate]=useState(false)
    const [name,setname]=useState('')
    const [total_floors,settotal_floors]=useState('')
    const [address,setaddress]=useState('')
    const [total_units,settotal_units]=useState('')
    const [status,setstatus]=useState('')
    const [description,setdescription]=useState('')
    const [propertydata,setpropertydata]=useState([])
    const [popup,setpopup]=useState(false)
    const [selectedId,setselectedId]=useState(null)
    const [editing,setEditing]=useState({})
    const [property_image,setproperty_image]=useState(null)
    const [tempValue,setTempValue]=useState('')
    const [role,setRole]=useState('')
    

  
  useEffect(() => {
    // Check if the navigation sent "openForm: true"
    if (location.state?.openForm) {
      setprov(true);
    }
  }, [location]);

   useEffect(()=>{
      fetch(`${import.meta.env.VITE_API_BASE_URL}/fetchproperty.php`,{
      method: 'GET',
      credentials: 'include'
    })
      .then((res)=>res.json())
      .then((data)=>{
        setpropertydata(data?.success ? data.data : [])
        console.log(data)
        setRole(data.role)

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
   const formdata=createFormData({
      name,
      total_floors,
      address,
      total_units,
      description,
      status

   },{
    property_image
   })




    const response=await axios.post(`${import.meta.env.VITE_API_BASE_URL}/property.php`, 
      formdata, 
      { withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    console.log(response.data.success)
    console.log(response.data)
    setstate(!state)

    }catch(err){
    console.error(err)
  }
}

  const handledelete = async (id) => {
    setpopup(false)
    try{
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/deleteproperty.php`, { id }, { withCredentials: true })
      console.log(response.data)
      setstate(!state)
    } catch(err){
      console.error(err)
    }
  }
  const Editablefield=({id,field,value,onSave})=>{
    const isediting=editing.id===id && editing.field===field;
    
    if(isediting){
      return(
        field=='status'?(
         <Select
          defaultValue={value}
          onValueChange={(newValue) => {
              onSave(id, field, newValue);
          }}
         >
          <SelectTrigger 
           className="w-[120px] h-8 rounded-full border-primary-500 bg-transparent focus:ring-1 focus:ring-primary-400"
          >
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
      
          <SelectContent className="rounded-xl border-gray-100 shadow-lg">
          <SelectItem 
            value="active" 
            className="cursor-pointer focus:bg-primary-50 focus:text-primary-700 rounded-md"
          >
            <span className="flex items-center">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-2" />
            Active
            </span>
          </SelectItem>
        
          <SelectItem 
            value="inactive" 
            className="cursor-pointer focus:bg-red-50 focus:text-red-700 rounded-md"
          >
            <span className="flex items-center">
            <span className="w-2 h-2 rounded-full bg-gray-400 mr-2" />
            Inactive
            </span>
          </SelectItem>
        </SelectContent>
      </Select>
        ):(
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

  const updateproperty = async (id, field, value) => {
    try{
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/updateproperty.php`, { 
        property_id: id,
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
    <AnimatedCard key={property.property_id ?? property.id}>
        <div className="card hover:shadow-lg transition-all p-4 bg-white rounded-xl border border-gray-100">
          
          {/* Property Image/Icon */}
          <EditablePhoto 
            id={property.property_id ?? property.id}
            currentUrl={property.property_picture_url}
            onSave={updateproperty}
            propertyName={property.name}
          />

          {/* Property Name */}
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            <Editablefield 
              id={property.property_id ?? property.id}
              field="name"
              value={property.name}
              onSave={updateproperty}
            />
          </h3>

          {/* Address */}
          <div className="flex items-center text-sm text-gray-600 mb-4">
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
            <Editablefield 
              id={property.property_id ?? property.id}
              field="address"
              value={property.address}
              onSave={updateproperty}
            />
          </div>

          {/* Floors and Units Grid */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="text-2xl font-bold text-primary-600">
                <Editablefield 
                  id={property.property_id ?? property.id}
                  field="total_floors"
                  value={property.total_floors}
                  onSave={updateproperty}
                />
              </div>
              <p className="text-xs text-gray-600">Floors</p>
            </div>

            <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="text-2xl font-bold text-primary-600">
                <Editablefield 
                  id={property.property_id ?? property.id}
                  field="total_units"
                  value={property.total_units}
                  onSave={updateproperty}
                />
              </div>
              <p className="text-xs text-gray-600">Units</p>
            </div>
          </div>

          {/* Status and Action Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-50">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              property.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
            }`}>
              <Editablefield 
                id={property.property_id ?? property.id}
                field="status"
                value={property.status}
                onSave={updateproperty}
              />
            </span>
            
            {role === 'super admin' && (
            <div className="flex items-center space-x-2">
              <button 
                className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                onClick={() => { 
                  setpopup(true); 
                  setselectedId(property.property_id ?? property.id); 
                }}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            )}
          </div>
        </div>
      </AnimatedCard>
    )
  )}
</div>
    </div>

    {popup && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50">
        <div className="bg-white w-full max-w-sm mx-auto rounded-2xl shadow-2xl p-6 space-y-4 border border-red-100">
          <h2 className="text-xl font-semibold text-center text-red-700 mb-4">
            Confirm Deletion
          </h2>
          <p className="text-gray-700 text-center">
            Are you sure you want to delete this property? This action cannot be undone.
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
            className="bg-white w-auto sm:w-full max-w-md mx-auto sm:max-h-[95vh] rounded-2xl shadow-2xl p-6 space-y-1.5 border border-sky-100 overflow-y-auto"
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Image
              </label>
              <input type="file"
              onChange={(e) => handleFileChange(e,setproperty_image)}
              accept='image/*'
                className="w-full border border-sky-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none file:mr-4 file:py-1 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 "
              />
              {property_image && (
                <p className="text-xs text-green-600 mt-1">✓ {property_image.name}</p>
              )}
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
