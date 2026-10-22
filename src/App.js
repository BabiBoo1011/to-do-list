import React, { useState } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');

  return (
    <div className='app'>
      <h1>TODO LIST</h1>

      <form>
        <input
          type='text'
          placeholder='Enter task name'
          value={taskName} /*giá trị input lấy từ state*/
          onChange={(e) => {setTaskName(e.target.value)}} /*khi nhập vào thì state thay đổi*/
        />
      </form>
    </div>
  )
}