import AddTask from '@/components/AddTask'
import LogoutButton from '@/components/auth/LogoutButton'
import DateTimeFillter from '@/components/DateTimeFillter'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import StatsAndFillter from '@/components/StatsAndFillter'
import TaskList from '@/components/TaskList'
import TaskListPagination from '@/components/TaskListPagination'
import api from '@/lib/axios'
import { visibleTaskLimit } from '@/lib/data'
import React, { useEffect, useState } from 'react'

const Homepage = () => {
  const [taskBuffer, setTaskBuffer] = useState([])
  const [filter, setFilter] = useState('all')
  const [timeFilter, setTimeFilter] = useState('all')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetchTask();
  }, [timeFilter])

  useEffect(() => {
    setPage(1)
  }, [filter, timeFilter])

  const fetchTask = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await api.get(`/Todos?timeFilter=${timeFilter}`)
      console.log('Data from API:', res.data)
      setTaskBuffer(Array.isArray(res.data) ? res.data : [])
    } catch (error) {
      console.error('Error fetching tasks:', error)
      setError(error.message)
      setTaskBuffer([])
    } finally {
      setLoading(false)
    }
  }

  // Lọc tasks theo status filter
  const filteredTasks = taskBuffer.filter(task => {
    const status = task.status?.toLowerCase()
    if (filter === 'active') return status === 'active'
    if (filter === 'completed') return status === 'completed'
    return true
  })

  // Tính số lượng
  const completedCount = taskBuffer.filter(t => t.status?.toLowerCase() === 'completed').length
  const activeCount = taskBuffer.filter(t => t.status?.toLowerCase() === 'active').length

  // Tính pagination
  const totalPages = Math.ceil(filteredTasks.length / visibleTaskLimit)
  
  const visibleTasks = filteredTasks.slice(
    (page - 1) * visibleTaskLimit,
    page * visibleTaskLimit
  )

  // ✅ Fix: Dùng useEffect thay vì gọi trực tiếp
  useEffect(() => {
    if (visibleTasks.length === 0 && page > 1) {
      setPage(page - 1)
    }
  }, [visibleTasks.length, page])

  const handleNext = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1)
    }
  }

  const handlePrev = () => {
    if (page > 1) {
      setPage((prev) => prev - 1)
    }
  }

  const handlePageChange = (newPage) => {
    setPage(newPage)
  }

  return (
    <div className="min-h-screen w-full bg-white relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            radial-gradient(125% 125% at 50% 90%, #ffffff 40%, #ec4899 100%)
          `,
          backgroundSize: "100% 100%",
        }}
      />

      <div className='container pt-8 mx-auto relative z-10'>
         <div className="flex justify-end">
            <LogoutButton />
          </div>
        <div className='w-full max-w-2xl p-6 mx-auto space-y-6'>
       
          <Header />
          <AddTask handleNewTaskAdded={fetchTask} />

          <StatsAndFillter
            completedTaskcount={completedCount}
            activeTaskCount={activeCount}
            fillter={filter}
            onFilterChange={setFilter}
          />

          {loading && <p className="text-center">Đang tải...</p>}
          {error && <p className="text-center text-red-500">Lỗi: {error}</p>}

          <TaskList
            filterTask={visibleTasks}  // ✅ Chỉ truyền visibleTasks
            filter={filter}
            handleTaskChanged={fetchTask}
          />

          <div className='flex flex-col items-center justify-between gap-6 sm:flex-row'>
            {/* ✅ Chỉ hiển thị khi có nhiều hơn 1 trang */}
            {totalPages > 1 && (
              <TaskListPagination
                handleNext={handleNext}
                handlePrev={handlePrev}
                handlePageChange={handlePageChange}
                page={page}
                totalPages={totalPages}
              />
            )}
            
            <DateTimeFillter
              value={timeFilter}
              onFilterChange={setTimeFilter}
            />
          </div>

          <Footer
            completedTaskCount={completedCount}
            activeTasksCount={activeCount}
          />
        </div>
      </div>
    </div>
  )
}

export default Homepage