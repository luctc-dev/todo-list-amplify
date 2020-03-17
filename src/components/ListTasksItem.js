import React, { useState, useCallback } from 'react';

import Button from './Button';

import { TASK_LEVEL } from '../constants';

export default function ListTasksItem({
  task,
  index,
  handleEditTask = () => { },
  handleSetTaskDelete = () => { }
}) {
  const [taskEdit, setTaskEdit] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { name, level } = task;

  const handleClickDelete = useCallback(() => {
    typeof handleSetTaskDelete === "function" && handleSetTaskDelete(task);
  }, [handleSetTaskDelete, task])

  const handleClickEdit = useCallback(() => {
    setTaskEdit(task);
  }, [task])

  const handleCancelEdit = useCallback(() => {
    setTaskEdit(null);
  }, [])

  const handleSaveEdit = useCallback(() => {
    console.log("save", taskEdit);
    setIsLoading(true);
    typeof handleEditTask === "function" && handleEditTask(taskEdit, () => {
      setTaskEdit(null);
      setIsLoading(false);
    })
  }, [handleEditTask, taskEdit])

  const handleOnChange = useCallback((keyField) => (e) => setTaskEdit({ ...taskEdit, [keyField]: e.target.value }), [taskEdit])

  return (
    <>
      <tr>
        <td className="text-center">{index + 1}</td>
        <td>
          {/* {name} */}
          {
            !taskEdit ? name :
              <input
                value={taskEdit.name}
                onChange={handleOnChange('name')}
                type="text"
                className="form-control"
                placeholder="Task Name" />
          }

        </td>
        <td className="text-center">

          {
            !taskEdit ?
              <span className={`badge ${TASK_LEVEL[level].class}`}>
                {TASK_LEVEL[level].name}
              </span>
              :
              <select
                value={taskEdit.level}
                onChange={handleOnChange('level')}
                className="form-control">
                {TASK_LEVEL.map((level, idx) => <option
                  key={level.name + idx}
                  value={idx}>{level.name}</option>)}
              </select>
          }
        </td>
        <td>
          {
            !taskEdit ?
              <button
                onClick={handleClickEdit}
                type="button" className="btn btn-warning">Edit</button> :
              <Button
                loading={isLoading}
                onClick={handleSaveEdit}
                type="button" className="btn btn-warning">Save</Button>
          }

          {
            !taskEdit ?
              <button
                onClick={handleClickDelete}
                type="button" className="btn btn-danger">Delete</button> :
              <button
                onClick={handleCancelEdit}
                type="button" className="btn btn-info">Cancel</button>
          }
        </td>
      </tr>

    </>
  )
}