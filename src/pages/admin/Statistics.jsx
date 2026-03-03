import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, CheckSquare, CheckCircle2, XCircle, TrendingUp, UserCheck, UserX, Calendar } from 'lucide-react'
import api from '@/lib/axios'
import { toast } from 'sonner'

const Statistics = () => {
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

  const allStatsCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: `+${stats?.newUsersThisWeek || 0} this week`
    },
    {
      title: 'Active Users',
      value: stats?.activeUsers || 0,
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: `${Math.round((stats?.activeUsers / stats?.totalUsers) * 100) || 0}% of total`
    },
    {
      title: 'Locked Users',
      value: stats?.lockedUsers || 0,
      icon: UserX,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      change: `${Math.round((stats?.lockedUsers / stats?.totalUsers) * 100) || 0}% of total`
    },
    {
      title: 'New Users This Week',
      value: stats?.newUsersThisWeek || 0,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: 'Last 7 days'
    },
    {
      title: 'Total Todos',
      value: stats?.totalTodos || 0,
      icon: CheckSquare,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      change: `+${stats?.todosCreatedToday || 0} today`
    },
    {
      title: 'Completed Todos',
      value: stats?.completedTodos || 0,
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: `${Math.round((stats?.completedTodos / stats?.totalTodos) * 100) || 0}% completion rate`
    },
    {
      title: 'Active Todos',
      value: stats?.activeTodos || 0,
      icon: XCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      change: 'Pending completion'
    },
    {
      title: 'Todos Created Today',
      value: stats?.todosCreatedToday || 0,
      icon: Calendar,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
      change: 'Today'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Statistics</h1>
        <p className="text-gray-500 mt-1">Thống kê chi tiết toàn bộ hệ thống</p>
      </div>

      {/* All Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {allStatsCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`w-12 h-12 rounded-full ${stat.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Analytics */}
        <Card>
          <CardHeader>
            <CardTitle>User Analytics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Users</span>
              <span className="text-2xl font-bold">{stats?.totalUsers || 0}</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Active Users</span>
                <span className="font-semibold text-green-600">{stats?.activeUsers || 0}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all"
                  style={{ width: `${(stats?.activeUsers / stats?.totalUsers) * 100 || 0}%` }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Locked Users</span>
                <span className="font-semibold text-red-600">{stats?.lockedUsers || 0}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-600 h-2 rounded-full transition-all"
                  style={{ width: `${(stats?.lockedUsers / stats?.totalUsers) * 100 || 0}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Todo Analytics */}
        <Card>
          <CardHeader>
            <CardTitle>Todo Analytics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Todos</span>
              <span className="text-2xl font-bold">{stats?.totalTodos || 0}</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Completed</span>
                <span className="font-semibold text-green-600">{stats?.completedTodos || 0}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all"
                  style={{ width: `${(stats?.completedTodos / stats?.totalTodos) * 100 || 0}%` }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Active</span>
                <span className="font-semibold text-orange-600">{stats?.activeTodos || 0}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-600 h-2 rounded-full transition-all"
                  style={{ width: `${(stats?.activeTodos / stats?.totalTodos) * 100 || 0}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Completion Rate</span>
              <span className="text-lg font-bold text-green-600">
                {Math.round((stats?.completedTodos / stats?.totalTodos) * 100) || 0}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Average Todos per User</span>
              <span className="text-lg font-bold">
                {Math.round((stats?.totalTodos / stats?.totalUsers)) || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Active User Rate</span>
              <span className="text-lg font-bold text-blue-600">
                {Math.round((stats?.activeUsers / stats?.totalUsers) * 100) || 0}%
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">New Users This Week</span>
              <span className="text-lg font-bold text-purple-600">
                {stats?.newUsersThisWeek || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Todos Created Today</span>
              <span className="text-lg font-bold text-pink-600">
                {stats?.todosCreatedToday || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Active vs Locked Ratio</span>
              <span className="text-lg font-bold">
                {stats?.activeUsers || 0} : {stats?.lockedUsers || 0}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Statistics