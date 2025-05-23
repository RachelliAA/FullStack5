import { useEffect, useState } from "react";

export default function Comments({ postId, activeUserId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const fetchComments = async () => {
    const res = await fetch(`http://localhost:3000/comments?postId=${postId}`);
    const data = await res.json();
    setComments(data);
  };

  useEffect(() => {
    if (postId) fetchComments();
  }, [postId]);

  const handleAddComment = async () => {
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

  const handleUpdateComment = async (commentId, newBody, userId) => {
    if (userId !== activeUserId) return;
    const updated = { body: newBody };
    await fetch(`http://localhost:3000/comments/${commentId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    fetchComments();
  };

  return (
    <div>
      <h4>Comments</h4>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            <textarea
              defaultValue={comment.body}
              onBlur={(e) =>
                handleUpdateComment(comment.id, e.target.value, comment.userId)
              }
            />
            {comment.userId === activeUserId && (
              <button onClick={() => handleDeleteComment(comment.id, comment.userId)}>
                Delete
              </button>
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
  );
}
