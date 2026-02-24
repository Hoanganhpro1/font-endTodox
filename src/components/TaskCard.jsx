import React, { useState } from 'react'
import { Card } from './ui/card'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import { CheckCircle2, Circle, Calendar, SquarePen, Trash2 } from 'lucide-react'
import { Input } from './ui/input'
import api from '@/lib/axios'
import { toast } from 'sonner'

const TaskCard = ({task, index, handleTaskChanged}) => {
    const [isEditing, setIsEditing] = useState(false)
    const [updateTaskTitle, setUpdateTaskTitle] = useState(task.title || "")
    const isCompleted = task.status === 'completed'
    
    const deleteTask = async (taskId) => {
        try {
            // ✅ Fix: Xóa khoảng trắng trong URL
            await api.delete(`/Todos/${taskId}`)
            toast.success('Nhiệm vụ đã xóa')
            handleTaskChanged()
        } catch (error) {
            console.error("Lỗi xảy ra khi xóa task:", error)
            console.error("Error response:", error.response?.data) // Debug
            toast.error("Lỗi xảy ra khi xóa nhiệm vụ")
        }
    }
    
    const updateTask = async () => {
        if (!updateTaskTitle.trim()) {
            toast.error("Tên nhiệm vụ không được để trống")
            return
        }
        
        try {
            // ✅ Fix: Dùng task.id, không phải taskId
            // ✅ Fix: Xóa khoảng trắng trong URL
            await api.put(`/Todos/${task.id}`, {
                title: updateTaskTitle,
                status: task.status,
                completedAt: task.completedAt
            })
            toast.success(`Nhiệm vụ đã đổi thành "${updateTaskTitle}"`)
            setIsEditing(false)
            handleTaskChanged()
        } catch (error) {
            console.error("Lỗi xảy ra khi update task:", error)
            console.error("Error response:", error.response?.data) // Debug
            toast.error("Lỗi xảy ra khi cập nhật nhiệm vụ")
        }
    }
    
    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            updateTask()
        }
    }
    
    const toggleStatus = async () => {
        try {
            await api.patch(`/Todos/${task.id}/toggle`)
            toast.success(isCompleted ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu hoàn thành')
            handleTaskChanged()
        } catch (error) {
            console.error("Lỗi xảy ra khi toggle status:", error)
            toast.error("Lỗi xảy ra khi thay đổi trạng thái")
        }
    }
    
    return (
        <Card className={cn(
            "p-4 bg-gradient-card border-0 shadow-custom-md hover:shadow-custom-lg transition-all duration-200 animate-fade-in group",
            isCompleted && 'opacity-75'
        )}
            style={{ animationDelay: `${index * 50}ms` }}
        >
            <div className='flex items-center gap-4'>
                <Button
                    variant='ghost'
                    size='icon'
                    onClick={toggleStatus}
                    className={cn(
                        "flex-shrink-0 size-8 rounded-full transition-all duration-200",
                        isCompleted ? 'text-success hover:text-success/80' :
                            "text-muted-foreground hover:text-primary"
                    )}>
                    {isCompleted ? (
                        <CheckCircle2 className='size-5' />
                    ) : (<Circle className='size-5' />)}
                </Button>

                <div className='flex-1 min-w-0'>
                    {isEditing ? (
                        <Input
                            placeholder='cần phải làm gì'
                            className='flex-1 h-12 text-base border-border/50 focus:border-primary/50 focus:ring-primary/20'
                            type='text'
                            value={updateTaskTitle}
                            // ✅ Fix: onChange và e.target.value
                            onChange={(e) => setUpdateTaskTitle(e.target.value)}
                            onKeyPress={handleKeyPress}
                            onBlur={() => {
                                setIsEditing(false)
                                setUpdateTaskTitle(task.title || "")
                            }}
                            autoFocus
                        />
                    ) : (
                        <p className={cn('text-base transition-all duration-200',
                            isCompleted ? 'line-through text-muted-foreground'
                                : 'text-foreground'
                        )}>
                            {task.title}
                        </p>
                    )}
                    <div className='flex items-center gap-2 mt-1'>
                        <Calendar className='size-3 text-muted-foreground' />
                        <span className='text-xs text-muted-foreground'>
                            {new Date(task.createdAt).toLocaleString('vi-VN')}
                        </span>
                        {task.completedAt && (
                            <>
                                <span className='text-xs text-muted-foreground'>→</span>
                                <Calendar className='size-3 text-muted-foreground' />
                                <span className='text-xs text-muted-foreground'>
                                    {new Date(task.completedAt).toLocaleString('vi-VN')}
                                </span>
                            </>
                        )}
                    </div>
                </div>
               
                <div className='hidden gap-2 group-hover:inline-flex animate-slide-up'>
                    <Button
                        variant='ghost'
                        size='icon'
                        className="flex-shrink-0 transition-colors size-8 text-muted-foreground hover:text-info"
                        onClick={() => {
                            setIsEditing(true)
                            setUpdateTaskTitle(task.title || "")
                        }}
                    >
                        <SquarePen className='size-4' />
                    </Button>

                    <Button
                        variant='ghost'
                        size='icon'
                        className="flex-shrink-0 transition-colors size-8 text-muted-foreground hover:text-destructive"
                        onClick={() => deleteTask(task.id)}
                    >
                        <Trash2 className='size-4' />
                    </Button>
                </div>
            </div>
        </Card>
    )
}

export default TaskCard