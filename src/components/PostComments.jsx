import { useState } from "react";
import { useSelector } from "react-redux";
import {
  selectCurrentUserEmail,
  selectIsAuthenticated,
} from "../features/auth/authSlice";
import {
  useAddCommentMutation,
  useDeleteCommentMutation,
  useGetCommentsByPostIdQuery,
  useUpdateCommentMutation,
} from "../features/comments/commentsApi";

export default function PostComments({ postId }) {
  const { data: comments, isLoading } = useGetCommentsByPostIdQuery(postId);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUserEmail = useSelector(selectCurrentUserEmail);
  const [addComment] = useAddCommentMutation();
  const [updateComment] = useUpdateCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();

  const [newContent, setNewContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    if (!newContent.trim()) return;
    await addComment({ postId, content: newContent.trim() });
    setNewContent("");
  };

  const startEdit = (comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  const saveEdit = async () => {
    await updateComment({ commentId: editingId, content: editContent });
    setEditingId(null);
  };

  if (isLoading) return <p className="status">Loading comments…</p>;

  return (
    <div className="comments-section">
      <h4 className="comments-title">
        Comments ({comments?.content.length ?? 0})
      </h4>

      {comments && comments.content.length > 0 && (
        <ul className="comments-list">
          {comments.content.map((c) =>
            editingId === c.id ? (
              <li key={c.id} className="comment-item">
                <textarea
                  rows="2"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
                <div className="comment-actions">
                  <button onClick={() => setEditingId(null)}>Cancel</button>
                  <button className="primary" onClick={saveEdit}>
                    Save
                  </button>
                </div>
              </li>
            ) : (
              <li key={c.id} className="comment-item">
                <p>{c.content}</p>
                {c.ownerEmail && (
                  <span className="comment-owner">{c.ownerEmail}</span>
                )}
                {c.ownerEmail === currentUserEmail && (
                  <div className="comment-actions">
                    <button className="btn-edit" onClick={() => startEdit(c)}>
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => deleteComment(c.id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </li>
            ),
          )}
        </ul>
      )}

      <form onSubmit={handleAdd} className="comment-form">
        <input
          type="text"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          placeholder={
            isAuthenticated ? "Add a comment…" : "Sign in to comment…"
          }
          disabled={!isAuthenticated}
        />
        <button type="submit" className="primary" disabled={!isAuthenticated}>
          Post
        </button>
      </form>
    </div>
  );
}
