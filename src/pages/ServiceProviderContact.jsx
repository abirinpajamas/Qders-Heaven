import { Plus, Phone, Mail, MapPin, Edit, Trash2 } from 'lucide-react'
import { useState } from 'react'
import axios from 'axios'


const ServiceProviderContact = () => {


  const [prov,setprov]=useState(false)
  const [name,setname]=useState('')
  const [phone,setphone]=useState('')
  const [email,setemail]=useState('')
  const [address,setaddress]=useState('')
  const [category,setcategory]=useState('')
  const [contact,setcontact]=useState('')
  const [contact_phone, setcontact_phone] = useState('')
  


  const providers = [
    { id: 1, name: 'ABC Plumbing Services', category: 'Plumbing', phone: '+880 1711-123456', email: 'abc@plumbing.com', address: 'Dhaka, Bangladesh' },
    ]

  const handleSubmit=async (e)=>{
    e.preventDefault();
    setprov(false)
    console.log(name)
    try{
     const response=await axios.post('http://localhost/qadersheavennew/php/servprovide.php', {
        name,
        category,
        phone,
        email,
        address,
        contact,
        contact_phone,
     })
     console.log(response.data.success)
     console.log(response.data)
    }catch(err){
      console.error(err)
    }
    
  }
  
  return (
    <>
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Service Provider Contact</h1>
          <p className="text-gray-600 mt-1">Manage service provider contacts</p>
        </div>
        <button onClick={() => setprov(true)} 
        className="btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Add Provider</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {providers.map((provider) => (
          <div key={provider.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-800">{provider.name}</h3>
                <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium mt-2">
                  {provider.category}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button className="btn-icon bg-blue-100 hover:bg-blue-200 text-blue-700">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="btn-icon bg-red-100 hover:bg-red-200 text-red-700">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-4 h-4 mr-3 text-primary-600" />
                {provider.phone}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="w-4 h-4 mr-3 text-primary-600" />
                {provider.email}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-3 text-primary-600" />
                {provider.address}
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
              Register New Service Provider
            </h2>

            {/* Provider Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Provider Name (Company)
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
                Provider Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setphone(e.target.value)}
                className="w-full border border-sky-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                placeholder="+880 1711-123456"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Provider Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setemail(e.target.value)}
                className="w-full border border-sky-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                placeholder="abc@plumbing.com"
                required
              />
            </div>

            {/* Contact Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Primary Contact Name
              </label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setcontact(e.target.value)}
                className="w-full border border-sky-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                placeholder="John Doe"
                required
              />
            </div>

            {/* Contact Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Primary Contact Phone
              </label>
              <input
                type="tel"
                value={contact_phone}
                onChange={(e) => setcontact_phone(e.target.value)}
                className="w-full border border-sky-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                placeholder="+880 1777-654321"
                required
              />
            </div>

            {/* Service Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service Type
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setcategory(e.target.value)}
                className="w-full border border-sky-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                placeholder="Plumbing, Electrical, Cleaning..."
                required
              />
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
                Register Provider
              </button>
            </div>
          </form>
        </div>)}
    </>
  );
}

export default ServiceProviderContact
