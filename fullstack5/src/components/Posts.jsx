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
  }, [showMineOnly]);

  const fetchPosts = async () => {
    const res = await fetch(`http://localhost:3000/posts`);
    const data = await res.json();
    const filtered = showMineOnly
      ? data.filter((post) => post.userId === activeUserId)
      : data;
    setPosts(filtered);
  };

  const handleSearch = async () => {
    const res = await fetch(`http://localhost:3000/posts`);
    const data = await res.json();
    const value = search.toLowerCase();
    const filtered = (showMineOnly
      ? data.filter((post) => post.userId === activeUserId)
      : data).filter((post) =>
      searchField === "title"
        ? post.title.toLowerCase().includes(value)
        : post.id.toString() === value
    );
    setPosts(filtered);
  };
  const getNexPostId = async () => {
    const res = await fetch(`http://localhost:3000/posts`);
    const data = await res.json();
    const ids = data.map((post) => post.id);
    const maxId = ids.length > 0 ? Math.max(...ids) : 0;
    return maxId + 1;
  };
  const handleAddPost = async () => {
    if (!newPost.title.trim()) return;
    const nextId = await getNexPostId();
    const post = {
      userId: Number(activeUserId),
      id: Number(nextId),
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
    await fetch(`http://localhost:3000/posts/${String(id)}`, { method: "DELETE" });
    await fetch(`http://localhost:3000/comments?postId=${id}`)
      .then((res) => res.json())
      .then((comments) => {
        comments.forEach((comment) => {
          fetch(`http://localhost:3000/comments/${comment.id}`, {
            method: "DELETE",
          });
        });
      });
    setPosts((prev) => prev.filter((post) => post.id !== id));
    setSelectedPost((prev) => (prev?.id === id ? null : prev));
  };

  const handleUpdatePost = async () => {
    if (!selectedPost.title.trim()) return;
    console.log("Updating post:", selectedPost);
    const response = await fetch(
      `http://localhost:3000/posts/${selectedPost.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: activeUserId,
          id: selectedPost.id,
          title: selectedPost.title,
          body: selectedPost.body,
        }),
      }
    );

    if (!response.ok) return;

    const updatedPost = await response.json();
    setPosts((prevPosts) =>
      prevPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
  };

  return (
    <div className={classes.pageLayout}>
      <div className={classes.leftPanel}>
        <h2>Posts for User #{activeUserId}</h2>

        <label className={classes.toggleSwitch}>
          <input
            type="checkbox"
            checked={showMineOnly}
            onChange={() => setShowMineOnly((prev) => !prev)}
          />
          <span className={classes.slider}></span>
          <span className={classes.toggleLabel}>
            {showMineOnly ? "My Posts" : "All Posts"}
          </span>
        </label>

        <div className={classes.controls}>
          <input
            placeholder="New title"
            value={newPost.title}
            onChange={(e) =>
              setNewPost({ ...newPost, title: e.target.value })
            }
          />
          <input
            placeholder="New body"
            value={newPost.body}
            onChange={(e) =>
              setNewPost({ ...newPost, body: e.target.value })
            }
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
                  <button onClick={() => handleDeletePost(post.id)}>
                    Delete
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className={classes.rightPanel}>
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
    </div>
  );
}

export default Posts;