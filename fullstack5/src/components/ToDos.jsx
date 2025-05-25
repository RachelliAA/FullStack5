import { useEffect, useState } from "react";
import { MdRefresh, MdAdd, MdSearch, MdSort } from 'react-icons/md';
import classes from "./ToDos.module.css";

function Todos() {
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [sortBy, setSortBy] = useState("id");
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [searchField, setSearchField] = useState("title");

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const userId = loggedInUser ? Number(loggedInUser.id) : null;

  if (!userId) {
    alert("No logged-in user found");
    return;
  }

  const fetchTodos = async () => {

    const res = await fetch("http://localhost:3000/todos");
    const data = await res.json();

    const userTodos = data.filter(todo => todo.userId === userId);

    setTodos(userTodos);
    setFilteredTodos(userTodos);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleSort = (criteria) => {
    setSortBy(criteria);

    const sorted = [...filteredTodos].sort((a, b) => {
      if (criteria === "title") return a.title.localeCompare(b.title);
      if (criteria === "completed") return b.completed -a.completed;
      
      return Number(a.id) - Number(b.id);
    });
    setFilteredTodos(sorted);
  };

  const handleSearch = () => {
    const value = search.toLowerCase();
    const results = todos.filter(todo => {
      if (searchField === "title") return todo.title.toLowerCase().includes(value);
      if (searchField === "id") return todo.id.toString() === value;
      if (searchField === "completed") return (value === "true" ? true : false) === todo.completed;
      return true;
    });
    setFilteredTodos(results);
  };

  const handleToggle = async (id) => {
    const todo = todos.find(t => t.id.toString() === id.toString());
    if (!todo) return;

    const updated = { ...todo, completed: !todo.completed };

    await fetch(`http://localhost:3000/todos/${todo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });

    fetchTodos();
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:3000/todos/${id}`, {
      method: "DELETE",
    });
    fetchTodos();
  };

  const handleAdd = async () => {
    const maxId = todos.length ? Math.max(...todos.map(todo => Number(todo.id))) : 0;

    const newTodo = {
      userId: userId,
      id: (maxId + 1).toString(),
      title: "New Todo",
      completed: false
    };

    await fetch("http://localhost:3000/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTodo),
    });

    fetchTodos();
  };

  const handleUpdateTitle = async (id, title) => {
    const todo = todos.find(t => t.id.toString() === id.toString());
    if (!todo) return;

    const updated = { ...todo, title };

    await fetch(`http://localhost:3000/todos/${todo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    fetchTodos();
  };

  return (
    <div className={classes.todosContainer}>
      <div className={classes.iconBar}>
        <MdRefresh
          className={classes.iconButton}
          title="Reload"
          onClick={fetchTodos}
        />
        <MdAdd
          className={classes.iconButton}
          title="Add New Todo"
          onClick={handleAdd}
        />
        <MdSearch
          className={classes.iconButton}
          title="Search"
          onClick={() => setShowSearch(!showSearch)}
        />
        <MdSort
          className={classes.iconButton}
          title="Sort"
          onClick={() => setShowSort(prev => !prev)}
        />
      </div>

      {showSearch && (
        <div className={classes.searchSortRow}>
          <select onChange={(e) => setSearchField(e.target.value)} value={searchField}>
            <option value="title">Title</option>
            <option value="id">ID</option>
            <option value="completed">Completed</option>
          </select>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
          />
          <button className={classes.btn} onClick={handleSearch}>Search</button>
        </div>
      )}

      {showSort && (
        <div className={classes.searchSortRow}>
          <label>Sort by:</label>
          <select onChange={(e) => handleSort(e.target.value)} value={sortBy}>
            <option value="id">ID</option>
            <option value="title">Title</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      )}

      <h2 className={classes.title}>To-Do List</h2>

      <ul>
        {filteredTodos.map(todo => (
          <li key={todo.id} className={classes.todoItem}>
            <span className={classes.todoID}>ID: {todo.id}</span>
            <input
              className={classes.checkbox}
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggle(todo.id)}
            />
            <input
              className={`${classes.todoText} ${todo.completed ? classes.completed : ""}`}
              type="text"
              defaultValue={todo.title}
              onBlur={(e) => handleUpdateTitle(todo.id, e.target.value)}
            />
            <button className={classes.deleteBtn} onClick={() => handleDelete(todo.id)} />
          </li>
        ))}
      </ul>
    </div >
  );
}

export default Todos;
