import { useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUserEmail } from "../features/auth/authSlice";
import {
  useDeletePostMutation,
  useGetPostsQuery,
  useUpdatePostMutation,
} from "../features/posts/postsApi";
import PostComments from "./PostComments";

export default function PostsSection() {
  const [page, setPage] = useState(0);
  const { data: pageData, isLoading, isError } = useGetPostsQuery(page);
  const posts = pageData?.content ?? [];
  const totalPages = pageData?.totalPages ?? 1;

  const currentUserEmail = useSelector(selectCurrentUserEmail);
  const [updatePost] = useUpdatePostMutation();
  const [deletePost] = useDeletePostMutation();

  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ title: "", body: "" });
  const [openCommentsId, setOpenCommentsId] = useState(null);

  const startEdit = (post) => {
    setEditingId(post.id);
    setEditValues({ title: post.title, body: post.body });
  };
  const cancelEdit = () => setEditingId(null);
  const saveEdit = async (id) => {
    await updatePost({ id, ...editValues });
    setEditingId(null);
  };

  const handleDelete = (id) => deletePost(id);
  const toggleComments = (id) =>
    setOpenCommentsId((prev) => (prev === id ? null : id));

  return (
    <div className="card">
      <div className="section-head">
        <div>
          <p className="eyebrow">RTK Query</p>
          <h2>Posts</h2>
        </div>
        <div className="pagination-controls">
          <button disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
            ← Prev
          </button>
          <span style={{ opacity: 0.7, fontSize: "0.9rem" }}>
            Page {page + 1} / {totalPages}
          </span>
          <button
            disabled={page + 1 >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next →
          </button>
        </div>
      </div>

      {isLoading && <p className="status">Loading posts…</p>}
      {isError && <p className="status error">Failed to load posts.</p>}

      {posts.length > 0 && (
        <div className="posts-grid">
          {posts.map((post) =>
            editingId === post.id ? (
              <article key={post.id} className="post-card post-card--editing">
                <span className="post-id">#{post.id}</span>
                <div className="form-field">
                  <label>Title</label>
                  <input
                    value={editValues.title}
                    onChange={(e) =>
                      setEditValues((v) => ({
                        ...v,
                        title: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="form-field">
                  <label>Body</label>
                  <textarea
                    rows="3"
                    value={editValues.body}
                    onChange={(e) =>
                      setEditValues((v) => ({ ...v, body: e.target.value }))
                    }
                  />
                </div>
                <div className="post-card-actions">
                  <button onClick={cancelEdit}>Cancel</button>
                  <button className="primary" onClick={() => saveEdit(post.id)}>
                    Save
                  </button>
                </div>
              </article>
            ) : (
              <article key={post.id} className="post-card">
                <span className="post-id">#{post.id}</span>
                <h3>{post.title}</h3>
                <p>{post.body}</p>
                <p className="post-owner">{post.ownerEmail}</p>
                <div className="post-card-actions">
                  <button
                    className="btn-comments"
                    onClick={() => toggleComments(post.id)}
                  >
                    {openCommentsId === post.id ? "Hide Comments" : "Comments"}
                  </button>
                  {post.ownerEmail === currentUserEmail && (
                    <>
                      <button
                        className="btn-edit"
                        onClick={() => startEdit(post)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(post.id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
                {openCommentsId === post.id && (
                  <PostComments postId={post.id} />
                )}
              </article>
            ),
          )}
        </div>
      )}
    </div>
  );
}
