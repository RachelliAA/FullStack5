import { useState } from "react";
import { useParams } from "react-router-dom";
import Comments from "./Comments";

export default function Posts() {
  const { id } = useParams(); // Get the user ID from the URL
  const activeUserId = parseInt(id); // Convert to number if needed

  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [searchField, setSearchField] = useState("title");
  const [selectedPost, setSelectedPost] = useState(null);
  const [newPost, setNewPost] = useState({ title: "", body: "" });

  const fetchPosts = async () => {
    const res = await fetch(`http://localhost:3000/posts`);
    const data = await res.json();
    const userPosts = data.filter(post => post.userId === activeUserId);
    setPosts(userPosts);
  };

  const handleSearch = async () => {
    const res = await fetch(`http://localhost:3000/posts`);
    const data = await res.json();
    const userPosts = data.filter(post => post.userId === activeUserId);
    const value = search.toLowerCase();
    const filtered = userPosts.filter(post =>
      searchField === "title"
        ? post.title.toLowerCase().includes(value)
        : post.id.toString() === value
    );
    setPosts(filtered);
  };

  const handleAddPost = async () => {
    const post = { ...newPost, userId: activeUserId };
    await fetch(`http://localhost:3000/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    });
    setNewPost({ title: "", body: "" });
    fetchPosts();
  };

  const handleDeletePost = async (id) => {
    await fetch(`http://localhost:3000/posts/${id}`, { method: "DELETE" });
    setSelectedPost(null);
    fetchPosts();
  };

  const handleUpdatePost = async () => {
    await fetch(`http://localhost:3000/posts/${selectedPost.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(selectedPost),
    });
    fetchPosts();
  };

  return (
    <div>
      <h2>Posts for User #{activeUserId}</h2>
      <button onClick={fetchPosts}>Load Posts</button>

      <div>
        <input
          placeholder="New title"
          value={newPost.title}
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
        />
        <input
          placeholder="New body"
          value={newPost.body}
          onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
        />
        <button onClick={handleAddPost}>Add Post</button>
      </div>

      <div>
        <select onChange={(e) => setSearchField(e.target.value)}>
          <option value="title">Title</option>
          <option value="id">ID</option>
        </select>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <strong>{post.id}:</strong> {post.title}
            <button onClick={() => setSelectedPost(post)}>Select</button>
            <button onClick={() => handleDeletePost(post.id)}>Delete</button>
          </li>
        ))}
      </ul>

      {selectedPost && (
        <div style={{ border: "1px solid black", padding: "10px", marginTop: "10px" }}>
          <h3>Selected Post</h3>
          <input
            value={selectedPost.title}
            onChange={(e) =>
              setSelectedPost({ ...selectedPost, title: e.target.value })
            }
          />
          <textarea
            rows="4"
            value={selectedPost.body}
            onChange={(e) =>
              setSelectedPost({ ...selectedPost, body: e.target.value })
            }
          />
          <button onClick={handleUpdatePost}>Update Post</button>

          <Comments postId={selectedPost.id} activeUserId={activeUserId} />
        </div>
      )}
    </div>
  );
}
