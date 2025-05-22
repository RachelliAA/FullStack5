import { useEffect, useState } from "react";

export default function Todos() {
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [sortBy, setSortBy] = useState("id");
  const [search, setSearch] = useState("");
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
    const sorted = [...filteredTodos].sort((a, b) => {
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
    <div>
      <h2>Todos</h2>
      <button onClick={fetchTodos}>Load Todos</button>
      <button onClick={handleAdd}>Add New Todo</button>

      <div>
        <select onChange={(e) => setSearchField(e.target.value)}>
          <option value="title">Title</option>
          <option value="id">ID</option>
          <option value="completed">Completed</option>
        </select>
        <input value={search} onChange={(e) => setSearch(e.target.value)} />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div>
        <label>Sort by: </label>
        <select onChange={(e) => handleSort(e.target.value)} value={sortBy}>
          <option value="id">ID</option>
          <option value="title">Title</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <ul>
        {filteredTodos.map(todo => (
          <li key={todo.id}>
            <input
              type="text"
              defaultValue={todo.title}
              onBlur={(e) => handleUpdateTitle(todo.id, e.target.value)}
            />
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggle(todo.id)}
            />
            <span> (ID: {todo.id}) </span>
            <button onClick={() => handleDelete(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
