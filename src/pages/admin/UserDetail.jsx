import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ArrowLeft, Mail, Calendar, CheckSquare, Lock, Unlock } from 'lucide-react'
import { toast } from 'sonner'
import api from '@/lib/axios'

const UserDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [userDetail, setUserDetail] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserDetail()
  }, [id])

  const fetchUserDetail = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/Admin/users/${id}`)
      setUserDetail(response.data)
    } catch (error) {
      console.error('Error fetching user detail:', error)
      toast.error('Không thể tải thông tin user')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async () => {
    try {
      const response = await api.patch(`/Admin/users/${id}/toggle-status`)
      setUserDetail({ ...userDetail, isActive: response.data.isActive })
      toast.success(
        response.data.isActive 
          ? 'Đã mở khóa user thành công!' 
          : 'Đã khóa user thành công!'
      )
    } catch (error) {
      console.error('Error toggling user status:', error)
      if (error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error('Không thể thay đổi trạng thái user')
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Đang tải...</p>
      </div>
    )
  }

  if (!userDetail) {
    return (
      <div className="text-center">
        <p className="text-gray-500">Không tìm thấy user</p>
        <Button onClick={() => navigate('/admin/users')} className="mt-4">
          Quay lại
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/users')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Detail</h1>
            <p className="text-gray-500 mt-1">Chi tiết thông tin user</p>
          </div>
        </div>

        <Button
          variant={userDetail.isActive ? 'destructive' : 'default'}
          onClick={handleToggleStatus}
        >
          {userDetail.isActive ? (
            <>
              <Lock className="h-4 w-4 mr-2" />
              Khóa User
            </>
          ) : (
            <>
              <Unlock className="h-4 w-4 mr-2" />
              Mở Khóa User
            </>
          )}
        </Button>
      </div>

      {/* User Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Thông Tin User</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Username</label>
              <p className="text-lg font-semibold">{userDetail.username}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <div className="flex items-center gap-2 mt-1">
                <Mail className="h-4 w-4 text-gray-400" />
                <p className="text-lg">{userDetail.email}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Role</label>
              <div className="mt-1">
                <Badge variant={userDetail.role === 'Admin' ? 'destructive' : 'default'}>
                  {userDetail.role}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Status</label>
              <div className="mt-1">
                <Badge variant={userDetail.isActive ? 'success' : 'secondary'}>
                  {userDetail.isActive ? 'Active' : 'Locked'}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Created At</label>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4 text-gray-400" />
                <p className="text-lg">
                  {new Date(userDetail.createdAt).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Total Todos</label>
              <div className="flex items-center gap-2 mt-1">
                <CheckSquare className="h-4 w-4 text-gray-400" />
                <p className="text-lg font-semibold">{userDetail.todos.length}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Todos List */}
      <Card>
        <CardHeader>
          <CardTitle>Todos của User ({userDetail.todos.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {userDetail.todos.length === 0 ? (
            <p className="text-center text-gray-500 py-8">User chưa có todo nào</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Completed At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userDetail.todos.map((todo) => (
                  <TableRow key={todo.id}>
                    <TableCell className="font-medium">{todo.id}</TableCell>
                    <TableCell>{todo.title}</TableCell>
                    <TableCell>
                      <Badge variant={todo.status === 'completed' ? 'success' : 'secondary'}>
                        {todo.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(todo.createdAt).toLocaleDateString('vi-VN')}
                    </TableCell>
                    <TableCell>
                      {todo.completedAt 
                        ? new Date(todo.completedAt).toLocaleDateString('vi-VN')
                        : '-'
                      }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default UserDetail