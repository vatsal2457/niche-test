// App.js
import React, { useState } from 'react';
import './App.css';

function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  // Add a new task to the list
  const addTask = () => {
    if (task.trim()) {
      setTasks([...tasks, task]);
      setTask('');
    }
  };

  // Delete a task from the list
  const deleteTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  return (
    <div className="App">
      <h1>To-Do List</h1>

      {/* Input for adding a task */}
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Enter a new task"
      />
      <button onClick={addTask}>Add Task</button>

      {/* Display the list of tasks */}
      <div className="task-list">
        {tasks.length === 0 ? (
          <p>No tasks added.</p>
        ) : (
          tasks.map((task, index) => (
            <div key={index} className="task-item">
              <span>{task}</span>
              <button onClick={() => deleteTask(index)}>Delete</button>
            </div>
          ))
        )}
      </div>
    </div>







  );
}

export default App;
