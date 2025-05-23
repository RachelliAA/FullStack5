import { useEffect, useState } from "react";
import { MdRefresh, MdAdd, MdSearch, MdSort } from 'react-icons/md';
import classes from "./ToDos.module.css";

export default function Todos() {
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [sortBy, setSortBy] = useState("id");
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [searchField, setSearchField] = useState("title");

  const fetchTodos = async () => {
    const res = await fetch("http://localhost:3000/todos");
    const data = await res.json();
    setTodos(data);
    setFilteredTodos(data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleSort = (criteria) => {
    setSortBy(criteria);
    const sorted = [...filteredTodos].sort((b, a) => {
      if (criteria === "title") return a.title.localeCompare(b.title);
      if (criteria === "completed") return a.completed - b.completed;
      return a.id - b.id;
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
    const todo = todos.find(t => t.id === id);
    const updated = { ...todo, completed: !todo.completed };
    await fetch(`http://localhost:3000/todos/${id}`, {
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
    const newTodo = {
      title: "New Todo",
      completed: false,
      userId: 1,
    };
    await fetch("http://localhost:3000/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTodo),
    });
    fetchTodos();
  };

  const handleUpdateTitle = async (id, title) => {
    const todo = todos.find(t => t.id === id);
    const updated = { ...todo, title };
    await fetch(`http://localhost:3000/todos/${id}`, {
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


      {/* <div className={classes.buttonGroup}>
        <button className={classes.btn} onClick={fetchTodos}>Reload</button>
        <button className={classes.btn} onClick={handleAdd}>Add New Todo</button>
      </div> */}

      {/* <div className={classes.searchSortRow}>
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
      </div> */}

      {/* <div className={classes.searchSortRow}>
        <label>Sort by:</label>
        <select onChange={(e) => handleSort(e.target.value)} value={sortBy}>
          <option value="id">ID</option>
          <option value="title">Title</option>
          <option value="completed">Completed</option>
        </select>
      </div> */}

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
