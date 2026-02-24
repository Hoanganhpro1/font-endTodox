import React from 'react'
import { Card } from './ui/card'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import api from '@/lib/axios'

const AddTask = ({handleNewTaskAdded }) => {
  const [newTaskTitle,setnewTaskTitle] = useState("")
  const addTask = async () =>{
    if(newTaskTitle.trim()){
      try {
        await api.post("/Todos",{title : newTaskTitle})
        toast.success(`Nhiệm vụ ${newTaskTitle} đã được thêm vào`)
        handleNewTaskAdded()
      } catch (error) {
        console.error("lỗi xảy ra khi thêm nhiệm vụ",error)
        toast.error("lỗi xảy ra khi thêm nhiệm vụ mới")
      }

      setnewTaskTitle("")
    }else{
       toast.error("bạn cần nhập thêm nhiệm vụ")
    }
  }
  const handleKeyPress = (even)=>{
    if(even.key==="Enter"){
      addTask();
    }
  }
  return (
    <Card className="p-6 border-0 bg-gradient-card shadow-custom-lg">
        <div className='flex flex-col gap-3 sm:flex-row'>
            <Input type='text'placeholder="can phai lam gi" 
            className="h-12 text-base bg-slate-50 sm:flex-1 border-border/50 focus:border-primary/50 focus:ring-primary/20"
            value={newTaskTitle}
            onChange={(even)=>setnewTaskTitle(even.target.value)}
            onKeyPress={handleKeyPress}
            />
          <Button
          variant='gradient'
          size='xl'
          className="px-6"
          onClick={addTask}
          disabled={!newTaskTitle.trim()}
          >
            <Plus className='size-5'/>Thêm
          </Button>

        </div>
    </Card>
  )
}

export default AddTask