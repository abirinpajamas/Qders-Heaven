import { Building2, Users, DollarSign, FileText, TrendingUp, TrendingDown, UserPlus, CreditCard, Receipt, HelpCircle, BookOpen } from 'lucide-react'
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


  
  const stats = [
    {
      title: 'Total Properties',
      value:  homevalues.properties_count || '0',
      change: `${(((homevalues.properties_count - homevalues.properties_prev) / homevalues.properties_prev) * 100).toFixed(0)}%`,
      trend: homevalues.properties_count >= homevalues.properties_prev ? 'up' : 'down',
      icon: Building2,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Tenants',
      value: homevalues.tenants_count || '0',
      change: `${(((homevalues.tenants_count - homevalues.tenants_prev) / homevalues.tenants_prev) * 100).toFixed(0)}%`,
      trend: homevalues.tenants_count >= homevalues.tenants_prev ? 'up' : 'down',
      icon: Users,
      color: 'bg-green-500'
    },
    {
      title: 'Monthly Revenue',
      value: `৳${Math.round(homevalues.revenue) || '0'}`,
      change: `${(((homevalues.revenue - homevalues.prev_revenue) / homevalues.prev_revenue) * 100).toFixed(0)}%`,
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
        const response = await fetch('http://localhost/qadersheavennew/php/getRecentActivities.php', {
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
      fetch('http://localhost/qadersheavennew/php/getHomevalues.php',{
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
    </div>
  )
}

export default Home
