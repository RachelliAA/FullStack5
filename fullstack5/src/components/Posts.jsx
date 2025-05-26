import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Comments from "./Comments";
import classes from "./Posts.module.css";

function Posts() {
  const { id } = useParams();
  const activeUserId = parseInt(id);

  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [searchField, setSearchField] = useState("title");
  const [selectedPost, setSelectedPost] = useState(null);
  const [newPost, setNewPost] = useState({ title: "", body: "" });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const res = await fetch(`http://localhost:3000/posts`);
    const data = await res.json();
    const userPosts = data.filter((post) => post.userId === activeUserId);
    setPosts(userPosts);
  };

  const handleSearch = async () => {
    const res = await fetch(`http://localhost:3000/posts`);
    const data = await res.json();
    const userPosts = data.filter((post) => post.userId === activeUserId);
    const value = search.toLowerCase();
    const filtered = userPosts.filter((post) =>
      searchField === "title"
        ? post.title.toLowerCase().includes(value)
        : post.id.toString() === value
    );
    setPosts(filtered);
  };
  const getNextPostId = async () => {
    const res = await fetch(`http://localhost:3000/posts`);
    const data = await res.json();
    //const userPosts = data.filter((post) => post.userId === activeUserId);
    const ids = data.map(post => post.id);
    const maxId = ids.length > 0 ? Math.max(...ids) : 0;
    return maxId + 1;
  };

  const handleAddPost = async () => {
    if (!newPost.title.trim()) return;// Don't add empty albums
    const nextId = await getNextPostId();
    const post = {
      userId: activeUserId,
      id: nextId,
      title: newPost.title,
      body: newPost.body,
    };

    const response = await fetch(`http://localhost:3000/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    });

    if (!response.ok) {
      console.error("Failed to add post");
      return;
    }
    const createdPost = await response.json();
    setPosts((prevPosts) => [...prevPosts, createdPost]);
    setNewPost({ title: "", body: "" });
    //fetchPosts();
  };


  const handleDeletePost = async (id) => {
    await fetch(`http://localhost:3000/posts/${id}`, {
      method: "DELETE",
    });
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
    <div className={classes.container}>
      <h2>Posts for User #{activeUserId}</h2>

      <div className={classes.controls}>
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

      <div className={classes.searchRow}>
        <select
          onChange={(e) => setSearchField(e.target.value)}
          value={searchField}
        >
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

      <ul className={classes.postList}>
        {posts.map((post) => (
          <li key={post.id} className={classes.postItem}>
            <strong>{post.id}:</strong> {post.title}
            <div>
              <button onClick={() => setSelectedPost(post)}>Select</button>
              <button onClick={() => handleDeletePost(post.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>

      {selectedPost && (
        <div className={classes.selectedPost}>
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

          <Comments
            postId={selectedPost.id}
            activeUserId={activeUserId}
          />
        </div>
      )}
    </div>
  );
}

export default Posts;