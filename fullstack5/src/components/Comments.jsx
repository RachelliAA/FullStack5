import { useEffect, useState } from "react";
import classes from "./Comments.module.css";

export default function Comments({ postId, activeUserId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editedBodies, setEditedBodies] = useState({});

  const fetchComments = async () => {
    const res = await fetch(`http://localhost:3000/comments?postId=${postId}`);
    const data = await res.json();
    setComments(data);
    const initialBodies = data.reduce((acc, c) => {
      acc[c.id] = c.body;
      return acc;
    }, {});
    setEditedBodies(initialBodies);
  };

  useEffect(() => {
    if (postId) fetchComments();
  }, [postId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const comment = {
      postId,
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
    fetchComments();
  };

  const handleDeleteComment = async (commentId, userId) => {
    if (userId !== activeUserId) return;

    await fetch(`http://localhost:3000/comments/${commentId}`, {
      method: "DELETE",
    });

    fetchComments();
  };

  const handleUpdateComment = async (commentId, userId) => {
    if (userId !== activeUserId) return;

    const updated = { body: editedBodies[commentId] };

    await fetch(`http://localhost:3000/comments/${commentId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });

    fetchComments();
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
            />
            {comment.userId === activeUserId && (
              <div>
                <button
                  className={classes.commentButton}
                  onClick={() => handleUpdateComment(comment.id, comment.userId)}
                >
                  Update
                </button>
                <button
                  className={classes.commentButton}
                  onClick={() => handleDeleteComment(comment.id, comment.userId)}
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
        >
          Add Comment
        </button>
      </div>
    </div>
  );
}
