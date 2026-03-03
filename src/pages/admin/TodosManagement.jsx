import React, { useEffect, useState, useCallback, useRef } from 'react' // 👈 Thêm useCallback, useRef
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
import { Search, Trash2, CheckCircle2, Circle, ChevronLeft, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import api from '@/lib/axios'

const TodosManagement = () => {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [todoToDelete, setTodoToDelete] = useState(null)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(20)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  // 👇 Track xem có phải lần mount đầu tiên không
  const isInitialMount = useRef(true)
  
  // 👇 Track xem có đang trong quá trình search không
  const isSearching = useRef(false)

  // 👇 Sử dụng useCallback để tránh tạo function mới mỗi lần render
  const fetchTodos = useCallback(async (page = currentPage, search = searchTerm) => {
    try {
      setLoading(true)
      const response = await api.get('/Admin/todos', {
        params: {
          page: page,
          pageSize: pageSize,
          searchTerm: search || undefined
        }
      })
      
      setTodos(response.data.items)
      setTotalPages(response.data.totalPages)
      setTotalCount(response.data.totalCount)
    } catch (error) {
      console.error('Error fetching todos:', error)
      toast.error('Không thể tải danh sách todos')
    } finally {
      setLoading(false)
    }
  }, [pageSize]) // Chỉ phụ thuộc vào pageSize

  // 👇 Effect cho pagination - CHỈ gọi khi currentPage thay đổi
  useEffect(() => {
    // Không gọi trong lần mount đầu tiên
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    
    // Không gọi nếu đang trong quá trình search
    if (isSearching.current) return
    
    fetchTodos(currentPage, searchTerm)
  }, [currentPage, fetchTodos, searchTerm])

  // 👇 Effect cho search - XỬ LÝ ĐÚNG CÁCH
  useEffect(() => {
    // Bỏ qua lần mount đầu tiên
    if (isInitialMount.current) return
    
    // Đánh dấu đang search
    isSearching.current = true
    
    const timer = setTimeout(() => {
      // Reset về page 1 và fetch với search term mới
      setCurrentPage(1)
      fetchTodos(1, searchTerm)
      
      // Kết thúc search
      setTimeout(() => {
        isSearching.current = false
      }, 100)
    }, 500)

    return () => {
      clearTimeout(timer)
      // Không reset isSearching ở đây vì có thể cleanup trước khi timeout chạy
    }
  }, [searchTerm, fetchTodos])

  // 👇 Effect cho statusFilter - filter phía client, không gọi API
  // (Không cần useEffect, chỉ filter trong render)

  const handleToggleStatus = async (todoId, currentStatus) => {
    try {
      const response = await api.patch(`/Todos/${todoId}/toggle`)
      
      setTodos(todos.map(todo => 
        todo.id === todoId 
          ? { 
              ...todo, 
              status: response.data.status,
              completedAt: response.data.completedAt
            }
          : todo
      ))

      toast.success('Đã cập nhật trạng thái todo!')
    } catch (error) {
      console.error('Error toggling todo:', error)
      toast.error('Không thể thay đổi trạng thái todo')
    }
  }

  const confirmDelete = (todo) => {
    setTodoToDelete(todo)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!todoToDelete) return

    try {
      await api.delete(`/Todos/${todoToDelete.id}`)
      
      // Refresh lại data
      fetchTodos(currentPage, searchTerm)
      
      toast.success('Đã xóa todo thành công!')
      setDeleteDialogOpen(false)
      setTodoToDelete(null)
    } catch (error) {
      console.error('Error deleting todo:', error)
      toast.error('Không thể xóa todo')
    }
  }

  // Filter theo status (client-side)
  const filteredTodos = todos.filter(todo => {
    if (statusFilter === 'all') return true
    return todo.status === statusFilter
  })

  if (loading && todos.length === 0) {
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
          <h1 className="text-3xl font-bold text-gray-900">Todos Management</h1>
          <p className="text-gray-500 mt-1">
            Quản lý tất cả todos trong hệ thống ({totalCount} todos)
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
              placeholder="Tìm kiếm theo title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Todos Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Completed At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTodos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-500">
                  Không tìm thấy todo nào
                </TableCell>
              </TableRow>
            ) : (
              filteredTodos.map((todo) => (
                <TableRow key={todo.id}>
                  <TableCell className="font-medium">{todo.id}</TableCell>
                  <TableCell className="max-w-md truncate">{todo.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">User #{todo.userId}</Badge>
                  </TableCell>
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
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(todo.id, todo.status)}
                        title={todo.status === 'active' ? 'Mark as completed' : 'Mark as active'}
                      >
                        {todo.status === 'completed' ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <Circle className="h-4 w-4" />
                        )}
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => confirmDelete(todo)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="Xóa todo"
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
              Page {currentPage} of {totalPages} • Total: {totalCount} todos
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
            <AlertDialogTitle>Xác nhận xóa todo</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa todo: <strong>{todoToDelete?.title}</strong>?
              <br />
              <span className="text-red-600 font-medium">
                Hành động này không thể hoàn tác!
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

export default TodosManagement