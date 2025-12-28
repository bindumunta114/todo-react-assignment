import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");
  const [editId, setEditId] = useState(null);

  // Load tasks from localStorage (component mount)
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (storedTasks) {
      setTasks(storedTasks);
    }
  }, []);

  // Save tasks to localStorage (component update)
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addOrUpdateTask = () => {
    if (input.trim() === "") return;

    if (editId) {
      setTasks(
        tasks.map((task) =>
          task.id === editId ? { ...task, text: input } : task
        )
      );
      setEditId(null);
    } else {
      setTasks([
        ...tasks,
        { id: Date.now(), text: input, completed: false }
      ]);
    }
    setInput("");
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  const editTask = (task) => {
    setInput(task.text);
    setEditId(task.id);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  return (
    <div className="container">
      <h2>To-Do List</h2>

      <div className="input-section">
        <input
          type="text"
          placeholder="Enter task"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={addOrUpdateTask}>
          {editId ? "Update" : "Add"}
        </button>
      </div>

      <div className="filters">
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("active")}>Active</button>
        <button onClick={() => setFilter("completed")}>Completed</button>
      </div>

      {filteredTasks.length === 0 ? (
        <p className="empty">No Tasks</p>
      ) : (
        <ul>
          {filteredTasks.map((task) => (
            <li key={task.id}>
  <span className={task.completed ? "done" : ""}>
    {task.text}
  </span>
  <div>
    <button onClick={() => toggleTask(task.id)}>
      {task.completed ? "Undo" : "Complete"}
    </button>
    <button onClick={() => editTask(task)}>Edit</button>
    <button onClick={() => deleteTask(task.id)}>Delete</button>
  </div>
</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
