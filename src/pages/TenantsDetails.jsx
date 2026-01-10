import { UserCheck,Plus, User, Phone, Mail, MapPin, Edit, Trash2, Eye, UserPlus } from 'lucide-react'
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
  const [editing,setEditing]=useState({id:null, field:null});
  const [tempValue,setTempValue]=useState("");
  const [showinput,setshowinput]=useState(false);
  const[baseRent,setBaseRent]=useState(0);
  const[role,setRole]=useState('');
  const [tenantaccounts,settenantaccounts]=useState([]);
  // Portal account creation states
  const [showPortalModal, setShowPortalModal] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [portalForm, setPortalForm] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [portalLoading, setPortalLoading] = useState(false);
  const [portalError, setPortalError] = useState('');
  const [portalSuccess, setPortalSuccess] = useState('');



  
  useEffect(()=>{
    fetch('http://localhost/qadersheavennew/php/gettenants.php',{
      method: 'GET',
      credentials: 'include'
    })
    .then((res)=>res.json())
    .then((data)=>{
      settenantdata(data.tenants)
      setRole(data.role)
      settenantaccounts(data.tenantsaccounts)
      console.log('tenant data',data)    
 
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

  const Editablefield=({id,field,value,onSave})=>{
    const isediting=editing.id===id && editing.field===field;
    
    if(isediting){
      return(
        <input
           autoFocus
           className="border-b border-primary-500 outline-none bg-transparent w-full text-gray-800"
           value={tempValue}
           onChange={(e)=>setTempValue(e.target.value)}
        
        />
      )
    }
  }

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
      }, { withCredentials: true })
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
      const response = await axios.post('http://localhost/qadersheavennew/php/deletetenant.php', { id }, { withCredentials: true })
      console.log(response.data)
      settenantdata((prev) => prev.filter(t => t.tenant_id !== id))
    } catch(err){
      console.error(err)
    }
  }

  const updatetenant = async () => {
    try{
      const response = await axios.post('http://localhost/qadersheavennew/php/updatetenant.php', { 
        unit_id: editing.id,
        field: editing.field,
        value: editing.field === 'base_rent' ? baseRent : name
      }, { withCredentials: true })
      console.log(response.data)
      setrefresh(!refresh)
      setEditing({id:null,field:null})
      setBaseRent('')
      setName('')
    } catch(err){
      console.error(err)
      setEditing({id:null,field:null})
      setBaseRent('')
      setName('')
    }
  }
  
  const handleCreatePortalAccount = async () => {
    setPortalLoading(true);
    setPortalError('');
    setPortalSuccess('');

    // Validate form
    if (!portalForm.email || !portalForm.password || !portalForm.confirmPassword) {
      setPortalError('All fields are required');
      setPortalLoading(false);
      return;
    }

    if (portalForm.password !== portalForm.confirmPassword) {
      setPortalError('Passwords do not match');
      setPortalLoading(false);
      return;
    }

    if (portalForm.password.length < 6) {
      setPortalError('Password must be at least 6 characters long');
      setPortalLoading(false);
      return;
    }
    console.log(selectedTenant)
    try {
      const response = await axios.post('http://localhost/qadersheavennew/php/createtenantportal.php', {
        tenant_id: selectedTenant.tenant_id,
        tenant_name: selectedTenant.name,
        email: portalForm.email,
        password: portalForm.password
      }, { withCredentials: true });

      if (response.data.success) {
        setPortalSuccess('Portal account created successfully!');
        setrefresh(!refresh)
        setTimeout(() => {
          setShowPortalModal(false);
          setPortalForm({ email: '', password: '', confirmPassword: '' });
          setPortalSuccess('');
        }, 1000);
      } else {
        setPortalError(response.data.message || 'Failed to create');
        console.log(response.data)
      }
    } catch (error) {
      console.error('Error creating portal account:', error);
      setPortalError('Network error. Please try again.');
    } finally {
      setPortalLoading(false);
    }
  }

  const openPortalModal = (tenant) => {
    setSelectedTenant(tenant);
    setPortalForm({
      email: tenant.email || '', // Pre-fill with tenant's email if available
      password: '',
      confirmPassword: ''
    });
    setPortalError('');
    setPortalSuccess('');
    setShowPortalModal(true);
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
            <div className="flex items-center space-x-2"> {/* space-x-2 adds the gap */}
  <h3 className="text-lg font-bold text-gray-800">
    <span 
      
    > 
      {editing.id === tenant.tenant_id && editing.field === 'name' ? (
        <input 
          type="text" 
          value={name}
          className="border-b-2 border-blue-500 outline-none bg-transparent" 
          onChange={(e) => setName(e.target.value)} 
          onBlur={() => setEditing({id: null, field: null})} 
          autoFocus
        /> 
      ) : (
        tenant.name
      )}
    </span>
  </h3>

  {/* Only show the button when NOT editing */}
  {!(editing.id === tenant.tenant_id && editing.field === 'name') && (
    <button 
      className="p-1 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
      onClick={() => { setEditing({id: tenant.tenant_id, field: 'name'}); }}
    >
      <Edit className="w-3 h-3" />
    </button>
  )}
</div>
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
                <div>
                <span className="text-lg font-bold text-primary-600">
                  {
                    editing.id === tenant.unit_id && editing.field === 'base_rent' ? (
                      <input 
                        type="number" 
                        value={null}
                        className="w-20 border-b-2 border-blue-500 outline-none bg-transparent" 
                        onChange={(e) => setBaseRent(e.target.value)} 
                        onBlur={() => baseRent>0? updatetenant():setEditing({ id: null, field: null })} 
                        autoFocus
                      /> 
                    ) : (
                      '৳' + tenant.base_rent.toLocaleString()
                    )
                  }
                </span>

                {!(editing.id === tenant.unit_id && editing.field === 'base_rent') && (
                  <button 
                    className="p-1 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                    onClick={() => { setEditing({id: tenant.unit_id, field: 'base_rent'}); }}
                  >
                    <Edit className="w-3 h-3" />
                  </button>
                )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {/*
                <button className="flex-1 btn-icon bg-green-100 hover:bg-green-200 text-green-700">
                  <Eye className="w-4 h-4" />
                </button>
                */}
                {tenantaccounts.some(acc=>acc.tenant_id===tenant.tenant_id)?(
                  <span className="flex-1 btn-icon bg-green-400">
                    <UserCheck className="w-4 h-4" />
                  </span>
                ):(
                <button 
                  className="flex-1 btn-icon bg-blue-200 hover:bg-blue-400 text-blue-700" 
                  onClick={() => openPortalModal(tenant)}
                  title="Register Portal Account"
                >
                  <UserPlus className="w-4 h-4" />
                </button>
                )}
                {role==='super admin' &&(
                <button className="flex-1 btn-icon bg-red-100 hover:bg-red-300 text-red-700" onClick={() => { setpopup(true); setselectedId(tenant.tenant_id); }}>
                  <Trash2 className="w-4 h-4" />
                </button>
                )}
                
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

  {/* Portal Account Creation Modal */}
  {showPortalModal && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50 p-4">
      <div className="bg-white w-full max-w-md mx-auto rounded-2xl shadow-2xl p-6 space-y-4 border border-blue-100">
        <h2 className="text-xl font-semibold text-center text-blue-700 mb-4">
          Create Portal Account
        </h2>
        
        {selectedTenant && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Tenant:</span> {selectedTenant.name}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Unit:</span> {selectedTenant.unit_number}
            </p>
          </div>
        )}

        {/* Error Message */}
        {portalError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm">{portalError}</p>
          </div>
        )}

        {/* Success Message */}
        {portalSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-green-600 text-sm">{portalSuccess}</p>
          </div>
        )}

        <div className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={portalForm.email}
              onChange={(e) => setPortalForm({...portalForm, email: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Enter email for portal account"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={portalForm.password}
              onChange={(e) => setPortalForm({...portalForm, password: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Enter password (min 6 characters)"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={portalForm.confirmPassword}
              onChange={(e) => setPortalForm({...portalForm, confirmPassword: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Confirm password"
              required
            />
          </div>
        </div>

        <div className="flex justify-between mt-6 space-x-3">
          <button
            type="button"
            onClick={() => setShowPortalModal(false)}
            className="flex-1 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
            disabled={portalLoading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCreatePortalAccount}
            className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={portalLoading}
          >
            {portalLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </div>
            ) : (
              'Create Account'
            )}
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
