import React, { useState, useEffect } from 'react';

import Modal from './Modal';
import Button from './Button';

import ListTasksItem from './ListTasksItem';

const styleColumnId = { width: '10%' }
const styleColumnLevel = { width: '20%' }
const styleColumnAction = { width: '200px' }

// null undefined
// kieu du lieu trong Javascript typeof [] === 

export default function ListTasksTable({
  listTasks,
  handleEditTask,
  handleDeleteTask
}) {
  // 
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [taskDelete, setTaskDelete] = useState(null);

  useEffect(() => {
    if (taskDelete) {
      setIsOpenModal(true);
    } else {
      setIsOpenModal(false);
    }
  }, [taskDelete])

  function handleSetTaskDelete(task) {
    setTaskDelete(task);
  }

  function handleSubmit() {
    if (isLoading) return;
    setIsLoading(true);
    handleDeleteTask && typeof handleDeleteTask === 'function' &&
      handleDeleteTask(taskDelete, (responseData) => {
        setIsLoading(false);
        // Khi callback được gọi sau một khoảng thời gian X??? -> đưa loading về false
        if (responseData && responseData.error) alert(responseData.message);
        else setTaskDelete(null);
      });
  }

  return (
    <div className="panel panel-success">
      {/* <div className="panel-heading">List Task</div> */}
      <table className="table table-hover ">
        <thead>
          <tr>

            <th style={styleColumnId} className="text-center">#</th>
            <th>Task</th>
            <th style={styleColumnLevel} className="text-center">Level</th>
            <th style={styleColumnAction}>Action</th>
          </tr>
        </thead>

        <tbody>
          {
            listTasks && listTasks.length > 0 &&
            listTasks.map((task, index) => {
              return <ListTasksItem
                key={task.id} task={task} index={index}
                handleEditTask={handleEditTask}
                handleSetTaskDelete={handleSetTaskDelete}
              />
            })
          }

        </tbody>
      </table>
      <Modal
        title="Cảnh báo"
        isVisible={isOpenModal}
        renderFooter={() => {
          return (
            <>
              <Button
                loading={isLoading}
                onClick={handleSubmit}
                type="button"
                style={{ marginRight: 10 }}
                className="btn btn-primary"
              >Confirm</Button>
              <Button
                onClick={() => setTaskDelete(null)}
                type="button" className="btn btn-secondary">Cancel</Button>
            </>
          )
        }}>
        <h4>Bạn có chắc chắn muốn xoá task {taskDelete && taskDelete.name}</h4>
      </Modal>
    </div>
  )
}