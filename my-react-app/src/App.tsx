import { BaseSyntheticEvent, useState } from 'react'
import './App.css'

function ListItem({ taskName, id, onDrag, onDragOver, onDrop, button }) {

  return (
    <li key={id + "Li"} onDrag={onDrag} onDragOver={onDragOver} onDrop={onDrop}>
      {taskName}{button}
    </li>
  )
}

function App() {
  const [tasksArray, setTasksArray] = useState<{ id: string, value: string }[]>([])
  const [newTask, setNewTask] = useState<string>('')
  const [draggingElements, setDraggingElements] = useState<{ onDrag: string | null, onDragOver: string | null }>({ onDrag: null, onDragOver: null })

  function newTaskButtonHandler() {
    if (newTask != '') {
      setTasksArray([...tasksArray, { id: `${Math.random()}`, value: newTask }])
    }
  }

  function clearTasksButtonHandler() {
    setTasksArray([])
  }

  function clearOneTaskButtonHandler(id: string) {
    setTasksArray(tasksArray.filter((x) => x.id != id))
  }

  function handleInputChange(event: BaseSyntheticEvent) {
    const newValue = event.target.value
    setNewTask(newValue)
  }

  function onDragCallback(id: string) {
    setDraggingElements({ onDrag: id, onDragOver: null })
  }

  function onDragOverCallback(id: string) {
    const oldElements = draggingElements
    oldElements.onDragOver = id
    setDraggingElements(oldElements)

  }

  function onDropCallback() {
    console.log(draggingElements)
    if ((draggingElements.onDrag != null) && (draggingElements.onDragOver != null)) {
      console.log(draggingElements)
      const onDragEl = tasksArray.find((el) => el.id == draggingElements.onDrag)
      const onDragOverEl = tasksArray.find((el) => el.id == draggingElements.onDragOver)
      const onDragIndex = tasksArray.findIndex((el) => el.id == draggingElements.onDrag)
      const onDragOverIndex = tasksArray.findIndex((el) => el.id == draggingElements.onDragOver)
      const reorderedTasks = tasksArray
      if (onDragEl && onDragOverEl) {
        reorderedTasks.splice(onDragOverIndex, 1, onDragEl)
        reorderedTasks.splice(onDragIndex, 1, onDragOverEl)
      }
      setDraggingElements({ onDrag: null, onDragOver: null })
    }
  }

  return (
    <div className="taskApp">
      <h1>Task App</h1>
      <input onChange={handleInputChange} type="text" className="taskApp__newTaskInput" />
      <button className="taskApp__newTaskButton" onClick={newTaskButtonHandler}>Add task!</button>
      <button className="taskApp__clearTasksButton" onClick={clearTasksButtonHandler}>Clear all!</button>
      {tasksArray.length > 0 &&
        <ul>
          {[...tasksArray].map((el) => <ListItem key={el.id} taskName={el.value} id={el.id} onDrag={() => onDragCallback(el.id)} onDrop={onDropCallback} onDragOver={(event) => {event.preventDefault(); onDragOverCallback(el.id)}} button={<button key={el.id + "Button"} className={el.id} onClick={() => clearOneTaskButtonHandler(el.id)}>Clear</button>} />)}
        </ul>
      }
    </div>
  )
}

export default App
