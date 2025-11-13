import { Building2, Users, DollarSign, FileText, TrendingUp, TrendingDown } from 'lucide-react'
import { useState,useEffect } from 'react'

const Home = () => {


  const [propertydata,setpropertydata]=useState([])
  const [tenantdata,settenantdata]=useState([])
  const [homevalues,sethomevalues]=useState([])

  const stats = [
    {
      title: 'Total Properties',
      value:  homevalues.properties_count || '0',
      change: '+12%',
      trend: 'up',
      icon: Building2,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Tenants',
      value: homevalues.tenants_count || '0',
      change: '+8%',
      trend: 'up',
      icon: Users,
      color: 'bg-green-500'
    },
    {
      title: 'Monthly Revenue',
      value: `৳${homevalues.revenue || '0'}`,
      change: '+15%',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-purple-500'
    },
    {
      title: 'Pending Bills',
      value: homevalues.duebills_count || '0',
      change: '-5%',
      trend: 'down',
      icon: FileText,
      color: 'bg-orange-500'
    }
  ]

  const recentActivities = [
    { id: 1, action: 'New tenant registered', property: 'Rangs Qaders Heaven', time: '2 hours ago' },
    { id: 2, action: 'Payment received', property: 'Unit 3, Floor 2', time: '4 hours ago' },
    { id: 3, action: 'Meter reading updated', property: 'Meter #12345789', time: '6 hours ago' },
    { id: 4, action: 'Maintenance request', property: 'Unit 5, Floor 1', time: '1 day ago' },
  ]

useEffect(()=>{
      fetch('http://localhost/qadersheavennew/php/getHomevalues.php')
      .then((res)=>res.json())
      .then((data)=>{
        sethomevalues(data)
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
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to Qaders Heaven</h1>
        <p className="text-gray-600">Property Management Dashboard</p>
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
                  {stat.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.change}
                  </span>
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
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div>
                <p className="font-medium text-gray-800">{activity.action}</p>
                <p className="text-sm text-gray-600">{activity.property}</p>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="btn-primary">Add New Property</button>
          <button className="btn-success">Generate Bill</button>
          <button className="btn-secondary">View Reports</button>
        </div>
      </div>
    </div>
  )
}

export default Home
