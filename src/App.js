
import { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  /*=======================================================
  Hooks
  =======================================================*/

  // Quản lý danh sách công việc
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  //Quản lý chỉnh sửa task
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskName, setEditTaskName] = useState('');

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

  /*=====================================================
  Hàm chức năng
  =======================================================*/

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

  //Xóa task cũ
  const deleteTask = (id) => {
    setTasks((prevTasks) =>
      prevTasks.filter((task) => task.id !== id)
    );
  };

  //Đánh dấu task hoàn thành
  const toggleTask = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id
          ? {...task, completed: !task.completed}
          : task
      ) 
    );
  };

  //Bắt đầu chỉnh sửa task
  const startEdit = (task) => {
    setEditTaskId(task.id);
    setEditTaskName(task.title);
  };

  const cancelEdit = () => {
    setEditTaskId(null);
    setEditTaskName('');
  };

  const saveTask = (id) => {
    const trimmedName = editTaskName.trim();
    
    if (!trimmedName) return;

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
      task.id === id
        ? { ...task, title: trimmedName }
        : task
      )
    );

    cancelEdit();
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
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                arial-label={`Mark ${task.title} as completed`}
              />

              {editTaskId === task.id ? (
                <>
                  <input
                    type="text"
                    value={editTaskName}
                    onChange={(e) => setEditTaskName(e.target.value)}
                    aria-label="Edit"
                  />

                  <button
                    type="button"
                    onClick={() => saveTask(task.id)}
                  >
                    Save
                  </button>

                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="cancel-button"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span
                    className={`task-title ${
                      task.completed ? 'completed' : ''
                    }`}
                  >
                    {task.title}
                  </span>

                  <button
                    type="button"
                    onClick={() => startEdit(task)}
                    disabled={task.completed}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => deleteTask(task.id)}
                    aria-label={`Delete ${task.title}`}
                    title="Delete task"
                  >
                    Delete
                  </button>
                </>
              )
            }
            </li>
          ))}
        </ul>
      )}

    </div>
  );
}

export default App;