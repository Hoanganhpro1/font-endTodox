import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, CheckSquare, CheckCircle2, XCircle } from 'lucide-react'
import api from '@/lib/axios'
import { toast } from 'sonner'

const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await api.get('/Admin/stats')
      setStats(response.data)
    } catch (error) {
      console.error('Error fetching stats:', error)
      toast.error('Không thể tải thống kê')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Đang tải...</p>
      </div>
    )
  }

  const statsCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      description: `${stats?.activeUsers || 0} active, ${stats?.lockedUsers || 0} locked`
    },
    {
      title: 'Total Todos',
      value: stats?.totalTodos || 0,
      icon: CheckSquare,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      description: `${stats?.todosCreatedToday || 0} created today`
    },
    {
      title: 'Completed Todos',
      value: stats?.completedTodos || 0,
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      description: `${Math.round((stats?.completedTodos / stats?.totalTodos) * 100) || 0}% completion rate`
    },
    {
      title: 'Active Todos',
      value: stats?.activeTodos || 0,
      icon: XCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      description: 'Pending completion'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`w-10 h-10 rounded-full ${stat.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">New Users This Week</span>
                <span className="text-sm font-semibold">{stats?.newUsersThisWeek || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Users</span>
                <span className="text-sm font-semibold">{stats?.activeUsers || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Locked Users</span>
                <span className="text-sm font-semibold text-red-600">{stats?.lockedUsers || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Todo Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completion Rate</span>
                <span className="text-sm font-semibold text-green-600">
                  {Math.round((stats?.completedTodos / stats?.totalTodos) * 100) || 0}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Todos Created Today</span>
                <span className="text-sm font-semibold">{stats?.todosCreatedToday || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average per User</span>
                <span className="text-sm font-semibold">
                  {Math.round((stats?.totalTodos / stats?.totalUsers)) || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard