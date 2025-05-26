import { useEffect, useState } from "react";
import classes from "./Comments.module.css";

function Comments({ postId, activeUserId, showMineOnly }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editedBodies, setEditedBodies] = useState({});
  const [activeUser, setUser] = useState(null);

  useEffect(() => {
    if (activeUserId) fetchUserDetails();
  }, [activeUserId]);

  useEffect(() => {
    if (postId && activeUser) fetchComments();
  }, [postId, activeUser, showMineOnly]);

  const fetchUserDetails = async () => {
    const res = await fetch(`http://localhost:3000/users`);
    const data = await res.json();
    
    const user = data.find((u) => u.id === activeUserId);
    if (user) {
      setUser(user);
    }
  };

  const fetchComments = async () => {
    console.log(postId);
    const res = await fetch(`http://localhost:3000/comments?postId=${postId}`);
    const data = await res.json();
    console.log(data);
    const filtered = showMineOnly
      ? data.filter((c) => c.email === activeUser?.email)
      : data;
    setComments(filtered);

    const initialBodies = filtered.reduce((acc, c) => {
      acc[c.id] = c.body;
      return acc;
    }, {});
    setEditedBodies(initialBodies);
  };

  const getNextCommentId = async () => {
    const res = await fetch(`http://localhost:3000/comments`);
    const data = await res.json();
    const ids = data.map((comment) => comment.id);
    const maxId = ids.length > 0 ? Math.max(...ids) : 0;
    return maxId + 1;
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !activeUser) return;

    const nextId = await getNextCommentId();

    const comment = {
      postId: String(postId),
      id: String(nextId),
      name: activeUser.name,
      email: activeUser.email,
      body: newComment,
    };

    const res = await fetch(`http://localhost:3000/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(comment),
    });

    if (!res.ok) return;

    const created = await res.json();
    setComments((prev) => [created, ...prev]);
    setEditedBodies((prev) => ({ ...prev, [created.id]: created.body }));
    setNewComment("");
  };

  const handleDeleteComment = async (commentId, commentEmail) => {
    if (commentEmail !== activeUser?.email) return;

    await fetch(`http://localhost:3000/comments/${commentId}`, {
      method: "DELETE",
    });

    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  const handleUpdateComment = async (commentId, commentEmail) => {
    if (commentEmail !== activeUser?.email) return;

    const updated = { body: editedBodies[commentId] };

    const res = await fetch(`http://localhost:3000/comments/${commentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });

    if (res.ok) {
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId ? { ...c, body: editedBodies[commentId] } : c
        )
      );
    }
  };

  return (
    <div className={classes.commentsContainer}>
      <h4>Comments</h4>
      <ul className={classes.commentList}>
        {comments.map((comment) => (
          <li key={comment.id} className={classes.commentItem}>
            <textarea
              className={classes.commentTextarea}
              value={editedBodies[comment.id] || ""}
              onChange={(e) =>
                setEditedBodies({ ...editedBodies, [comment.id]: e.target.value })
              }
              readOnly={comment.email !== activeUser?.email}
            />
            <div>
              <strong>{comment.name}</strong> ({comment.email})
            </div>
            {comment.email === activeUser?.email && (
              <div className={classes.commentButtonGroup}>
                <button
                  className={classes.commentButton}
                  onClick={() => handleUpdateComment(comment.id, comment.email)}
                >
                  Update
                </button>
                <button
                  className={classes.commentButton}
                  onClick={() => handleDeleteComment(comment.id, comment.email)}
                >
                  Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      <div className={classes.commentInputRow}>
        <input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add comment..."
        />
        <button
          className={classes.commentButton}
          onClick={handleAddComment}
          disabled={!activeUser}
        >
          Add Comment
        </button>
      </div>
    </div>
  );
}

export default Comments;
