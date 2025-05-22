import { useState, useEffect } from "react";

const activeUserId = 1;

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [searchField, setSearchField] = useState("title");
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", body: "" });
  const [newComment, setNewComment] = useState("");

  const fetchPosts = async () => {
    const res = await fetch(`http://localhost:3000/posts`);
    const data = await res.json();
    const userPosts = data.filter(post => post.userId === activeUserId);
    setPosts(userPosts);
  };

  const fetchComments = async (postId) => {
    const res = await fetch(`http://localhost:3000/comments?postId=${postId}`);
    const data = await res.json();
    setComments(data);
  };

  const handleSearch = () => {
    fetch(`http://localhost:3000/posts`)
      .then(res => res.json())
      .then(data => {
        const userPosts = data.filter(post => post.userId === activeUserId);
        const filtered = userPosts.filter(post => {
          const value = search.toLowerCase();
          if (searchField === "title") return post.title.toLowerCase().includes(value);
          if (searchField === "id") return post.id.toString() === value;
          return true;
        });
        setPosts(filtered);
      });
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
    const updated = { ...selectedPost };
    await fetch(`http://localhost:3000/posts/${updated.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    fetchPosts();
  };

  const handleAddComment = async () => {
    const comment = {
      postId: selectedPost.id,
      name: "User Comment",
      email: "user@example.com",
      body: newComment,
      userId: activeUserId,
    };
    await fetch(`http://localhost:3000/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(comment),
    });
    setNewComment("");
    fetchComments(selectedPost.id);
  };

  const handleDeleteComment = async (comment) => {
    if (comment.userId !== activeUserId) return;
    await fetch(`http://localhost:3000/comments/${comment.id}`, {
      method: "DELETE",
    });
    fetchComments(selectedPost.id);
  };

  const handleUpdateComment = async (commentId, newBody) => {
    const comment = comments.find(c => c.id === commentId);
    if (comment.userId !== activeUserId) return;
    const updated = { ...comment, body: newBody };
    await fetch(`http://localhost:3000/comments/${commentId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    fetchComments(selectedPost.id);
  };

  return (
    <div>
      <h2>Posts</h2>
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
          <button onClick={() => fetchComments(selectedPost.id)}>Show Comments</button>

          {comments.length > 0 && (
            <div>
              <h4>Comments</h4>
              <ul>
                {comments.map((comment) => (
                  <li key={comment.id}>
                    <textarea
                      defaultValue={comment.body}
                      onBlur={(e) => handleUpdateComment(comment.id, e.target.value)}
                    />
                    {comment.userId === activeUserId && (
                      <button onClick={() => handleDeleteComment(comment)}>Delete</button>
                    )}
                  </li>
                ))}
              </ul>

              <input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add comment..."
              />
              <button onClick={handleAddComment}>Add Comment</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
