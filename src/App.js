import { useState, useEffect, useRef } from 'react';
import useTaskStore from './taskStore';
import './App.css';

function App() {
  /*=======================================================
  Hooks
  =======================================================*/

  // Quản lý danh sách công việc
  const tasks = useTaskStore((state) => state.tasks);
  const loading = useTaskStore((state) => state.loading);
  const error = useTaskStore((state) => state.error);

  const fetchTasks = useTaskStore((state) => state.fetchTasks);
  const addTaskToStore = useTaskStore((state) => state.addTask);
  const editTaskInStore = useTaskStore((state) => state.editTask);
  const toggleTaskInStore = useTaskStore((state) => state.toggleTask);
  const deleteTaskFromStore = useTaskStore((state) => state.deleteTask);

  //Quản lý chỉnh sửa task
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskName, setEditTaskName] = useState('');

  // Quản lý nội dung ô nhập
  const [taskName, setTaskName] = useState('');

  // Tham chiếu đến ô input
  const taskInputRef = useRef(null);

  //Quản lý giao diện sáng - tối
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  })

  // Lưu danh sách task vào localStorage khi tasks thay đổi
  useEffect(() => {
    fetchTasks()
  }, [fetchTasks]);

  // Tự động focus ô input khi mở ứng dụng
  useEffect(() => {
    taskInputRef.current.focus();
  }, []);

  //Chuyển chế độ sáng tối
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);

    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  /*=====================================================
  Hàm chức năng
  =======================================================*/

  // Thêm task mới
  const addTask = async () => {
    const title = taskName.trim();

    // Không thêm nếu nội dung rỗng
    if (title === '') {
      taskInputRef.current?.focus();
      return;
    }

    const task = await addTaskToStore(title);

    if (task) {
      setTaskName('');
      taskInputRef.current?.focus();
    }
  };

  //Xóa task cũ
  const deleteTask = async (id) => {
    await deleteTaskFromStore(id);
  };

  //Đánh dấu task hoàn thành
  const toggleTask = async (id) => {
    await toggleTaskInStore(id);
  };

  //Bắt đầu chỉnh sửa task
  const startEdit = async (task) => {
    setEditTaskId(task.id);
    setEditTaskName(task.title);
  };

  const cancelEdit = () => {
    setEditTaskId(null);
    setEditTaskName('');
  };

  const saveTask = async (id) => {
    const checkedName = editTaskName.trim();
    
    if (!checkedName) return;

    const task = await editTaskInStore(id, checkedName);

    if (task) {
      cancelEdit();
    }
  };

  return (
    <div className="app">
      <div className='app-header'>
        <h1>TODO LIST</h1>

        <button
          type="button"
          className={`theme-switch ${darkMode ? 'active' : ''}`}
          onClick={() => setDarkMode((prev) => !prev)}
          role="switch"
          aria-checked={darkMode}
          aria-label="Toggle dark mode"
        >
          <span className="switch-icon">
            {darkMode ? '' : ''}
          </span>
        </button>
      </div>

      {loading && <p>Loading tasks...</p>}

      {error && <p className="error-message">{error}</p>}

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
        <p className="empty-message">You don't have any tasks yet</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li className="task-item" key={task.id}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                aria-label={`Mark ${task.title} as completed`}
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