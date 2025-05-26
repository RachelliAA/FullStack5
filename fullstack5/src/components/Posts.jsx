import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Comments from "./Comments";
import classes from "./Posts.module.css";

function Posts() {
  const { userId } = useParams();
  const activeUserId = parseInt(userId);

  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [searchField, setSearchField] = useState("title");
  const [selectedPost, setSelectedPost] = useState(null);
  const [newPost, setNewPost] = useState({ title: "", body: "" });
  const [showMineOnly, setShowMineOnly] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, [activeUserId, showMineOnly]);

  const fetchPosts = async () => {
    const res = await fetch(`http://localhost:3000/posts`);
    const data = await res.json();
    const filteredPosts = showMineOnly
      ? data.filter((post) => post.userId === activeUserId)
      : data;
    setPosts(filteredPosts);
  };

  const handleSearch = async () => {
    const res = await fetch(`http://localhost:3000/posts`);
    const data = await res.json();
    const value = search.toLowerCase();
    const visiblePosts = showMineOnly
      ? data.filter((post) => post.userId === activeUserId)
      : data;
    const filtered = visiblePosts.filter((post) =>
      searchField === "title"
        ? post.title.toLowerCase().includes(value)
        : post.id.toString() === value
    );
    setPosts(filtered);
  };

  const getNextPostId = async () => {
    const res = await fetch(`http://localhost:3000/posts`);
    const data = await res.json();
    const ids = data.map(post => post.id);
    const maxId = ids.length > 0 ? Math.max(...ids) : 0;
    return maxId + 1;
  };

  const handleAddPost = async () => {
    if (!newPost.title.trim()) return;
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

    if (!response.ok) return;

    const createdPost = await response.json();
    setPosts((prevPosts) => [...prevPosts, createdPost]);
    setNewPost({ title: "", body: "" });
  };

  const handleDeletePost = async (id) => {
    const post = posts.find((p) => p.id === id);
    if (!post || post.userId !== activeUserId) return;

    await fetch(`http://localhost:3000/posts/${id}`, { method: "DELETE" });

    // Delete related comments
    const res = await fetch(`http://localhost:3000/comments?postId=${id}`);
    const comments = await res.json();

    await Promise.all(
      comments.map((comment) =>
        fetch(`http://localhost:3000/comments/${comment.id}`, {
          method: "DELETE",
        })
      )
    );

    setPosts((prev) => prev.filter((post) => post.id !== id));
    setSelectedPost((prev) => (prev?.id === id ? null : prev));
  };

  const handleUpdatePost = async () => {
    if (!selectedPost.title.trim()) return;

    const response = await fetch(`http://localhost:3000/posts/${selectedPost.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: activeUserId,
        id: selectedPost.id,
        title: selectedPost.title,
        body: selectedPost.body,
      }),
    });

    if (!response.ok) return;

    const updatedPost = await response.json();

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === updatedPost.id ? updatedPost : post
      )
    );
  };

  return (
    <div className={classes.container}>
      <h2>Posts for User #{activeUserId}</h2>

      <div className={classes.toggleRow}>
        <button onClick={() => setShowMineOnly((prev) => !prev)}>
          Show: {showMineOnly ? "Mine" : "Everyone's"}
        </button>
      </div>

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
              {post.userId === activeUserId && (
                <button onClick={() => handleDeletePost(post.id)}>Delete</button>
              )}
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
          {selectedPost.userId === activeUserId && (
            <button onClick={handleUpdatePost}>Update Post</button>
          )}

          <Comments
            postId={selectedPost.id}
            activeUserId={activeUserId}
            showMineOnly={showMineOnly}
          />
        </div>
      )}
    </div>
  );
}

export default Posts;
