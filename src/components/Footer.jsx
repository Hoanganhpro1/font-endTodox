import React from 'react'

const Footer = ({completedTaskCount = 0, activeTasksCount = 0}) => {
  return (
    <>
      {completedTaskCount + activeTasksCount > 0 && (
        <div className='text-center'>
          <p className='text-sm text-muted-foreground'>
            {completedTaskCount > 0 && (
              <>
                Tuyệt vời! Đã hoàn thành {completedTaskCount} việc
                {activeTasksCount > 0 && `, còn ${activeTasksCount} việc nữa thôi. Cố lên!`}
              </>
            )}
            {completedTaskCount === 0 && activeTasksCount > 0 && (
              <>
                Hãy bắt đầu làm {activeTasksCount} nhiệm vụ nào!
              </>
            )}
          </p>
        </div>
      )}
    </>
  )
}

export default Footer