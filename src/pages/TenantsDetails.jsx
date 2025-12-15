import { Plus, User, Phone, Mail, MapPin, Edit, Trash2, Eye } from 'lucide-react'
import { useState,useEffect } from 'react'
import axios from 'axios'

const TenantsDetails = () => {

  const [unitid, setunitid] = useState('');
  const [name, setName] = useState('');
  const [nid_num, setNidNum] = useState('');
  const [father, setFather] = useState('');
  const [mother, setMother] = useState('');
  const [occupation, setOccupation] = useState('');
  const [workAddress, setWorkAddress] = useState('');
  const [presentAddress, setPresentAddress] = useState('');
  const [permanentAddress, setPermanentAddress] = useState('');
  const [ward, setWard] = useState('');
  const [thana, setThana] = useState('');
  const [citycorp, setCitycorp] = useState('');
  const [advance, setAdvance] = useState('');
  const [phone1, setPhone1] = useState('');
  const [phone2, setPhone2] = useState('');
  const [famName, setFamName] = useState('');
  const [famRltn, setFamRltn] = useState('');
  const [famDOB, setFamDOB] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');
  const [renterPicture, setRenterPicture] = useState(null);
  const [nidAttachment, setNidAttachment] = useState(null);
  const [passportAttachment, setPassportAttachment] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [unitdata, setunitdata] = useState([]);
  const [tenantdata, settenantdata] = useState([]);
  const [propertydata, setpropertydata] = useState([]);
  const [popup,setpopup]=useState(false);
  const [selectedId,setselectedId]=useState(null);
  const [refresh,setrefresh]=useState(false);



  
  useEffect(()=>{
    fetch('http://localhost/qadersheavennew/php/gettenants.php')
    .then((res)=>res.json())
    .then((data)=>{
      settenantdata(data)
      console.log(data)    
 
    })
     .catch((error)=>{

        console.error('Error fetching tenant data:', error);

     }) 

  },[refresh])

  useEffect(()=>{

    fetch('http://localhost/qadersheavennew/php/getunits.php')
      .then((res)=>res.json())
      .then((data)=>{
        setunitdata(data);
        console.log(data);
      })
      .catch((err)=>{
        console.error('Error fetching unit data:', err);
      });


  },[])



  const handlesubmit=async (e)=>{

    e.preventDefault();
    setShowForm(false)

    console.log(name)

    try{  
      const response=await axios.post('http://localhost/qadersheavennew/php/tenant.php', {
      unitid,
      name,
      nid_num,
      father,
      mother,
      occupation,
      workAddress,
      presentAddress,
      permanentAddress,
      ward,
      thana,
      citycorp,
      advance,
      phone1,
      phone2,
      famName,
      famRltn,
      famDOB,
      startDate,
      endDate,
      notes,
      })
      console.log(response.data.success)
      console.log(response.data)
      setrefresh(!refresh)
      }catch(err){
        console.error(err)
      }
  }

  const handledelete = async (id) => {
    setpopup(false)
    try{
      const response = await axios.post('http://localhost/qadersheavennew/php/deletetenant.php', { id })
      console.log(response.data)
      settenantdata((prev) => prev.filter(t => t.tenant_id !== id))
    } catch(err){
      console.error(err)
    }
  }

  return (
    <>
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Tenants Details</h1>
          <p className="text-gray-600 mt-1">Manage tenant information</p>
        </div>
        <button className="btn-primary flex items-center space-x-2" onClick={()=>setShowForm(true)}>
          <Plus className="w-5 h-5" />
          <span>Add Tenant</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tenantdata.map((tenant) => (
          <div key={tenant.tenant_id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-primary-600" />
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                {tenant.status}
              </span>
            </div>
            
            <h3 className="text-lg font-bold text-gray-800 mb-1">{tenant.name}</h3>
            <p className="text-sm text-primary-600 font-medium mb-4">{tenant.unit_number}, {tenant.property_name}</p>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-4 h-4 mr-2" />
                {tenant.phone1}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="w-4 h-4 mr-2" />
                {tenant.phone2}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                Move-in: {tenant.start_date}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600">Monthly Rent</span>
                <span className="text-lg font-bold text-primary-600">৳{tenant.base_rent.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button className="flex-1 btn-icon bg-green-100 hover:bg-green-200 text-green-700">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="flex-1 btn-icon bg-blue-100 hover:bg-blue-200 text-blue-700">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="flex-1 btn-icon bg-red-100 hover:bg-red-200 text-red-700" onClick={() => { setpopup(true); setselectedId(tenant.tenant_id); }}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

   {popup && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50">
    <div className="bg-white w-full max-w-sm mx-auto rounded-2xl shadow-2xl p-6 space-y-4 border border-red-100">
      <h2 className="text-xl font-semibold text-center text-red-700 mb-4">
        Confirm Deletion
      </h2>
      <p className="text-gray-700 text-center">
        Are you sure you want to delete this tenant? This action cannot be undone.
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

   
    {showForm && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50 p-4">
    <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-sky-100 max-h-[90vh] overflow-y-auto">
      <form
        onSubmit={handlesubmit}
        className="p-6 space-y-2.5"
      >
        <h2 className="text-xl font-semibold text-center text-sky-700 mb-4">
          Register New Renter
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Unit Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unit
            </label>
            <select
              value={unitid}
              onChange={(e) => setunitid(e.target.value)}
              className="w-full border border-sky-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
              required
            >
              <option value="">Select Unit</option>
              {unitdata.map((unit) => (
                <option key={unit.unit_id} value={unit.unit_id}>
                  {unit.unit_number}
                </option>
              ))}
            </select>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-sky-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
              placeholder="Enter full name"
              required
            />
          </div>

          {/* NID Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              NID Number
            </label>
            <input
              type="text"
              value={nid_num}
              onChange={(e) => setNidNum(e.target.value)}
              className="w-full border border-sky-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
              placeholder="National ID number"
              required
            />
          </div>

          {/* Father's Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Father's Name
            </label>
            <input
              type="text"
              value={father}
              onChange={(e) => setFather(e.target.value)}
              className="w-full border border-sky-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
              placeholder="Father's name"
            />
          </div>

          {/* Mother's Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mother's Name
            </label>
            <input
              type="text"
              value={mother}
              onChange={(e) => setMother(e.target.value)}
              className="w-full border border-sky-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
              placeholder="Mother's name"
            />
          </div>

          {/* Occupation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Occupation
            </label>
            <input
              type="text"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              className="w-full border border-sky-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
              placeholder="Occupation"
            />
          </div>

          {/* Phone 1 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number 1
            </label>
            <input
              type="tel"
              value={phone1}
              onChange={(e) => setPhone1(e.target.value)}
              className="w-full border border-sky-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
              placeholder="+880 1XXX-XXXXXX"
              required
            />
          </div>

          {/* Phone 2 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number 2
            </label>
            <input
              type="tel"
              value={phone2}
              onChange={(e) => setPhone2(e.target.value)}
              className="w-full border border-sky-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
              placeholder="+880 1XXX-XXXXXX"
            />
          </div>
        </div>

        {/* Work Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Work Address
          </label>
          <input
            type="text"
            value={workAddress}
            onChange={(e) => setWorkAddress(e.target.value)}
            className="w-full border border-sky-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
            placeholder="Workplace address"
          />
        </div>

        {/* Present Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Present Address
          </label>
          <input
            type="text"
            value={presentAddress}
            onChange={(e) => setPresentAddress(e.target.value)}
            className="w-full border border-sky-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
            placeholder="Current address"
          />
        </div>

        {/* Permanent Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Permanent Address
          </label>
          <input
            type="text"
            value={permanentAddress}
            onChange={(e) => setPermanentAddress(e.target.value)}
            className="w-full border border-sky-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
            placeholder="Permanent address"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Ward */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ward
            </label>
            <input
              type="text"
              value={ward}
              onChange={(e) => setWard(e.target.value)}
              className="w-full border border-sky-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
              placeholder="Ward"
            />
          </div>

          {/* Thana */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thana
            </label>
            <input
              type="text"
              value={thana}
              onChange={(e) => setThana(e.target.value)}
              className="w-full border border-sky-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
              placeholder="Thana"
            />
          </div>

          {/* City Corporation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City Corporation
            </label>
            <input
              type="text"
              value={citycorp}
              onChange={(e) => setCitycorp(e.target.value)}
              className="w-full border border-sky-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
              placeholder="City corporation"
            />
          </div>
        </div>

        {/* Family Information Section */}
        <div className="pt-4 border-t border-sky-100">
          <h3 className="text-lg font-medium text-sky-700 mb-3">Family Member Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Family Member Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Family Member Name
              </label>
              <input
                type="text"
                value={famName}
                onChange={(e) => setFamName(e.target.value)}
                className="w-full border border-sky-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                placeholder="Name"
              />
            </div>

            {/* Family Relation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Relationship
              </label>
              <select
                value={famRltn}
                onChange={(e) => setFamRltn(e.target.value)}
                className="w-full border border-sky-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
              >
                <option value="">Select relation</option>
                <option value="spouse">Spouse</option>
                <option value="child">Child</option>
                <option value="parent">Parent</option>
                <option value="sibling">Sibling</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Family DOB */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                value={famDOB}
                onChange={(e) => setFamDOB(e.target.value)}
                className="w-full border border-sky-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Lease Information Section */}
        <div className="pt-4 border-t border-sky-100">
          <h3 className="text-lg font-medium text-sky-700 mb-3">Lease Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Advance */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Advance Payment
              </label>
              <input
                type="number"
                value={advance}
                onChange={(e) => setAdvance(e.target.value)}
                className="w-full border border-sky-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                placeholder="0"
              />
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-sky-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                required
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border border-sky-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Documents Section */}
        <div className="pt-4 border-t border-sky-100">
          <h3 className="text-lg font-medium text-sky-700 mb-3">Document Attachments</h3>
          
          <div className="space-y-3">
            {/* Renter Picture */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Renter Picture
              </label>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, setRenterPicture)}
                accept="image/*"
                className="w-full border border-sky-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none file:mr-4 file:py-1 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
              />
              {renterPicture && (
                <p className="text-xs text-green-600 mt-1">✓ {renterPicture.name}</p>
              )}
            </div>

            {/* NID Attachment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                NID Attachment
              </label>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, setNidAttachment)}
                accept="image/*,.pdf"
                className="w-full border border-sky-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none file:mr-4 file:py-1 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
              />
              {nidAttachment && (
                <p className="text-xs text-green-600 mt-1">✓ {nidAttachment.name}</p>
              )}
            </div>

            {/* Passport Attachment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Passport Attachment
              </label>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, setPassportAttachment)}
                accept="image/*,.pdf"
                className="w-full border border-sky-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none file:mr-4 file:py-1 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
              />
              {passportAttachment && (
                <p className="text-xs text-green-600 mt-1">✓ {passportAttachment.name}</p>
              )}
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border border-sky-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
            placeholder="Additional notes or comments"
            rows="3"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700 shadow-sm transition"
          >
            Register Renter
          </button>
        </div>
      </form>
    </div>
  </div>

    )}
    </>
  )
}

export default TenantsDetails
