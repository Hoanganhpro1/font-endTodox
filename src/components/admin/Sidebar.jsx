import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Users, CheckSquare, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'

const Sidebar = () => {
  const location = useLocation()

  const menuItems = [
    {
      title: 'Dashboard',
      icon: Home,
      path: '/admin',
      exact: true
    },
    {
      title: 'Users',
      icon: Users,
      path: '/admin/users'
    },
    {
      title: 'Todos',
      icon: CheckSquare,
      path: '/admin/todos'
    },
    {
      title: 'Statistics',
      icon: BarChart3,
      path: '/admin/stats'
    }
  ]

  const isActive = (item) => {
    if (item.exact) {
      return location.pathname === item.path
    }
    return location.pathname.startsWith(item.path)
  }

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-4">
      {/* Logo */}
      <div className="mb-8 px-4">
        <h1 className="text-2xl font-bold text-primary">Admin Panel</h1>
        <p className="text-sm text-gray-400">TodoX Management</p>
      </div>

      {/* Menu Items */}
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item)

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                active
                  ? "bg-primary text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.title}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

export default Sidebar