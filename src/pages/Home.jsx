import { Building2, Users, DollarSign, FileText, TrendingUp, TrendingDown, UserPlus, CreditCard, Receipt, HelpCircle, BookOpen, MessageCircle, X, Send } from 'lucide-react'
import { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom'; // Add this line
import TutorialGuide from '../components/TutorialGuide'

const Home = () => {

  const navigate = useNavigate(); 
  const [propertydata,setpropertydata]=useState([])
  const [tenantdata,settenantdata]=useState([])
  const [homevalues,sethomevalues]=useState([])
  const [recentActivities, setRecentActivities] = useState([])
  const [activitiesLoading, setActivitiesLoading] = useState(true)
  const [showTutorial, setShowTutorial] = useState(false)
  
  // Chatbot states
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [currentMessage, setCurrentMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  // Handle sending message to AI
  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return
    
    const userMessage = currentMessage.trim()
    setCurrentMessage('')
    setIsLoading(true)
    
    // Add user message to chat
    setMessages(prev => [...prev, { type: 'user', text: userMessage }])
    
    try {
      // Call our PHP backend API
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/aichat.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          prompt: userMessage,
        }),
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.success) {
        setMessages(prev => [...prev, { type: 'ai', text: data.response }])
      } else {
        setMessages(prev => [...prev, { type: 'ai', text: 'Sorry, I encountered an error: ' + data.message }])
      }
      
    } catch (error) {
  console.error('Error sending message:', error)
  
  // Try to get the response text
  if (error.response) {
    const text = await error.response.text()
    console.error('Error response body:', text)
  }
  
  setMessages(prev => [...prev, { type: 'ai', text: 'Sorry, I encountered an error. Please try again.' }])
} finally {
      setIsLoading(false)
    }
  }
  
  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }


  
  const stats = [
    {
      title: 'Total Properties',
      value:  homevalues.properties_count || '0',
      change: homevalues.properties_prev>0?`${(((homevalues.properties_count - homevalues.properties_prev) / homevalues.properties_prev) * 100).toFixed(0)}%`:'',
      trend: homevalues.properties_count >= homevalues.properties_prev ? 'up' : 'down',
      icon: Building2,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Tenants',
      value: homevalues.tenants_count || '0',
      change: homevalues.tenants_prev>0?`${(((homevalues.tenants_count - homevalues.tenants_prev) / homevalues.tenants_prev) * 100).toFixed(0)}%`:'',
      trend: homevalues.tenants_count >= homevalues.tenants_prev ? 'up' : 'down',
      icon: Users,
      color: 'bg-green-500'
    },
    {
      title: 'Monthly Revenue',
      value: `৳${Math.round(homevalues.revenue) || '0'}`,
      change: homevalues.prev_revenue>0?`${(((homevalues.revenue - homevalues.prev_revenue) / homevalues.prev_revenue) * 100).toFixed(0)}%`:'',
      trend: homevalues.tenants_count >= homevalues.tenants_prev ? 'up' : 'down',
      icon: DollarSign,
      color: 'bg-purple-500'
    },
    {
      title: 'Pending Bills',
      value: homevalues.duebills_count || '0',
      //change: '-5%',
      //trend: 'down',
      icon: FileText,
      color: 'bg-orange-500'
    }
  ]

  // Fetch recent activities
  useEffect(() => {
    const fetchRecentActivities = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/getRecentActivities.php`, {
          method: 'GET',
          credentials: 'include'
        })
        const data = await response.json()
        if (data.success) {
          setRecentActivities(data.activities)
        }
      } catch (error) {
        console.error('Error fetching recent activities:', error)
      } finally {
        setActivitiesLoading(false)
      }
    }

    fetchRecentActivities()
  }, [])

  // Get icon for activity type
  const getActivityIcon = (type) => {
    switch(type) {
      case 'tenant_registered': return UserPlus
      case 'payment_received': return CreditCard
      case 'bill_generated': return Receipt
      default: return FileText
    }
  }

  // Get color for activity type
  const getActivityColor = (type) => {
    switch(type) {
      case 'tenant_registered': return 'bg-green-100 text-green-700'
      case 'payment_received': return 'bg-blue-100 text-blue-700'
      case 'bill_generated': return 'bg-orange-100 text-orange-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

useEffect(()=>{
      fetch(`${import.meta.env.VITE_API_BASE_URL}/getHomevalues.php`,{
        method: 'GET',
        credentials: 'include'
      })
      .then((res)=>res.json())
      .then((data)=>{
        localStorage.setItem('name',data.name)
        sethomevalues(data.res)
        
        console.log(data)

      })
       .catch((error)=>{

          console.error('Error fetching property data:', error);

       })

    },[])
    
    


  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to Property Heaven</h1>
            <p className="text-gray-600">Property Management Dashboard</p>
          </div>
          <div className="flex items-center space-x-3">
           {/* 
            <button
              onClick={() => setShowTutorial(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <HelpCircle className="w-5 h-5" />
              <span>Getting Started Guide</span>
            </button>
            */}
            <button
              onClick={() => setShowTutorial(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <BookOpen className="w-5 h-5" />
              <span>Tutorial</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
 <div className="flex items-center mt-2">
  {stat.trend && (
    <>
      {stat.trend === 'up' ? (
        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
      ) : (
        <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
      )}
      <span className={`text-sm ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
        {stat.change}
      </span>
    </>
  )}
</div>
              </div>
              <div className={`${stat.color} p-4 rounded-lg`}>
                <stat.icon className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activities */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activities</h2>
        {activitiesLoading ? (
          <div className="text-center py-8 text-gray-500">Loading recent activities...</div>
        ) : recentActivities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No recent activities found</div>
        ) : (
          <div className="space-y-3">
            {recentActivities.map((activity, index) => {
              const Icon = getActivityIcon(activity.type)
              const colorClass = getActivityColor(activity.type)
              return (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${colorClass}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.details}</p>
                      <p className="text-xs text-gray-500">{activity.property}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 whitespace-nowrap">{activity.time}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="btn-primary" onClick={() => navigate('/property', { state: { openForm: true } })}>Add New Property</button>
          <button className="btn-success" onClick={() => navigate('/tenants-bill-generate')}>Generate Bill</button>
          <button className="btn-secondary">View Reports</button>
        </div>
      </div>

      {/* Tutorial Guide */}
      <TutorialGuide isOpen={showTutorial} onClose={() => setShowTutorial(false)} />
      
      {/* AI Chatbot */}
      {/* Floating Chat Head */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      </div>
      
      {/* Chat Box */}
      {isChatOpen && (
        <div className="fixed bottom-20 right-6 w-96 h-[400px] bg-white rounded-lg shadow-2xl z-50 flex flex-col">
          {/* Chat Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-5 h-5" />
              <h3 className="font-semibold">Property Heaven AI Assistant</h3>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-white hover:bg-blue-700 rounded p-1 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Hello! I'm your AI assistant.</p>
                <p className="text-sm mt-1">Ask me anything about your properties!</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Chat Input */}
          <div className="border-t p-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about your properties..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !currentMessage.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
