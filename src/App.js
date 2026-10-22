
import { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  // Quản lý danh sách công việc
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  // Quản lý nội dung ô nhập
  const [taskName, setTaskName] = useState('');

  // Tham chiếu đến ô input
  const taskInputRef = useRef(null);

  // Lưu danh sách task vào localStorage khi tasks thay đổi
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Tự động focus ô input khi mở ứng dụng
  useEffect(() => {
    taskInputRef.current.focus();
  }, []);

  // Thêm task mới
  const addTask = () => {
    const title = taskName.trim();

    // Không thêm nếu nội dung rỗng
    if (title === '') {
      taskInputRef.current.focus();
      return;
    }

    const newTask = {
      id: Date.now(),
      title: title,
      completed: false
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);
    setTaskName('');

    // Focus lại ô nhập sau khi thêm task
    taskInputRef.current.focus();
  };

  
  const deleteTask = (id) => {
    setTasks((prevTasks) =>
      prevTasks.filter((task) => task.id !== id)
    );
  };


  return (
    <div className="app">
      <h1>TODO LIST</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          addTask();
        }}
      >
        <input
          ref={taskInputRef}
          type="text"
          placeholder="Enter task name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />

        <button type="submit">Add task</button>
      </form>


      {tasks.length === 0 ? (
        <p className="empty-message">There is no task</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li className="task-item" key={task.id}>
              <span className="task-title">{task.title}</span>

              <button
                type="button"
                className="delete-button"
                onClick={() => deleteTask(task.id)}
                aria-label={`Delete ${task.title}`}
                title="Delete task"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

    </div>
  );
}

export default App;