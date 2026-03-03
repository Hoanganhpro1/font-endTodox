import React, { useEffect, useState, useCallback, useRef } from 'react' // 👈 Thêm useCallback, useRef
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from '@/components/ui/badge'
import { Search, Lock, Unlock, Trash2, Eye, ChevronLeft, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import api from '@/lib/axios'

const UsersManagement = () => {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(20)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  // 👇 Track lần mount đầu tiên
  const isInitialMount = useRef(true)
  
  // 👇 Track đang search
  const isSearching = useRef(false)

  // 👇 Sử dụng useCallback để tránh tạo function mới
  const fetchUsers = useCallback(async (page = currentPage, search = searchTerm) => {
    try {
      setLoading(true)
      const response = await api.get('/Admin/users', {
        params: {
          page: page,
          pageSize: pageSize,
          searchTerm: search || undefined
        }
      })
      
      setUsers(response.data.items)
      setTotalPages(response.data.totalPages)
      setTotalCount(response.data.totalCount)
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Không thể tải danh sách users')
    } finally {
      setLoading(false)
    }
  }, [pageSize]) // Chỉ phụ thuộc vào pageSize

  // 👉 Effect cho PAGINATION - Chạy khi currentPage thay đổi
  useEffect(() => {
    // Không gọi trong lần mount đầu tiên
    if (isInitialMount.current) {
      isInitialMount.current = false
      // Fetch lần đầu tiên
      fetchUsers(1, searchTerm)
      return
    }
    
    // Không gọi nếu đang search
    if (isSearching.current) return
    
    fetchUsers(currentPage, searchTerm)
  }, [currentPage, fetchUsers, searchTerm])

  // 👉 Effect cho SEARCH - Xử lý debounce
  useEffect(() => {
    // Bỏ qua lần mount đầu tiên
    if (isInitialMount.current) return
    
    // Đánh dấu đang search
    isSearching.current = true
    
    const timer = setTimeout(() => {
      // Reset về page 1 và fetch với search term mới
      setCurrentPage(1)
      fetchUsers(1, searchTerm)
      
      // Kết thúc search sau khi fetch xong
      setTimeout(() => {
        isSearching.current = false
      }, 100)
    }, 500)

    return () => {
      clearTimeout(timer)
    }
  }, [searchTerm, fetchUsers])

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      const response = await api.patch(`/Admin/users/${userId}/toggle-status`)
      
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, isActive: response.data.isActive }
          : user
      ))

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

  const confirmDelete = (user) => {
    setUserToDelete(user)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!userToDelete) return

    try {
      await api.delete(`/Admin/users/${userToDelete.id}`)
      
      // Refresh lại data
      fetchUsers(currentPage, searchTerm)
      
      toast.success(`Đã xóa user ${userToDelete.username} thành công!`)
      setDeleteDialogOpen(false)
      setUserToDelete(null)
    } catch (error) {
      console.error('Error deleting user:', error)
      if (error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error('Không thể xóa user')
      }
    }
  }

  // Filter theo role (client-side)
  const filteredUsers = users.filter(user => {
    if (roleFilter === 'all') return true
    return user.role.toLowerCase() === roleFilter.toLowerCase()
  })

  // Loading state đẹp hơn
  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-500 mt-1">
            Quản lý tất cả users trong hệ thống ({totalCount} users)
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Tìm kiếm theo username hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Role Filter */}
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Users Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Todos</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-gray-500">
                  Không tìm thấy user nào
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'Admin' ? 'destructive' : 'default'}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.isActive ? 'success' : 'secondary'}>
                      {user.isActive ? 'Active' : 'Locked'}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.todoCount}</TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {/* View Detail Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/admin/users/${user.id}`)}
                        title="Xem chi tiết"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      {/* Toggle Status Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(user.id, user.isActive)}
                        title={user.isActive ? 'Khóa user' : 'Mở khóa user'}
                      >
                        {user.isActive ? (
                          <Lock className="h-4 w-4" />
                        ) : (
                          <Unlock className="h-4 w-4" />
                        )}
                      </Button>

                      {/* Delete Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => confirmDelete(user)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="Xóa user"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <div className="text-sm text-gray-500">
              Page {currentPage} of {totalPages} • Total: {totalCount} users
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa user</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa user <strong>{userToDelete?.username}</strong>?
              <br />
              <span className="text-red-600 font-medium">
                Hành động này không thể hoàn tác và sẽ xóa tất cả todos của user này!
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default UsersManagement