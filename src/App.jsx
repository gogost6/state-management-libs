import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AccountSection from "./components/AccountSection";
import AuthSection from "./components/AuthSection";
import CatSection from "./components/CatSection";
import PostComments from "./components/PostComments";
import { useLogoutMutation } from "./features/auth/authApi";
import {
  clearCredentials,
  selectIsAuthenticated,
} from "./features/auth/authSlice";
import { decrement, increment, reset } from "./features/counter/counterSlice";
import {
  useCreatePostMutation,
  useDeletePostMutation,
  useGetPostsQuery,
  useUpdatePostMutation,
} from "./features/posts/postsApi";

export default function App() {
  const count = useSelector((state) => state.counter.value);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const dispatch = useDispatch();

  const [page, setPage] = useState(0);
  const { data: pageData, isLoading, isError } = useGetPostsQuery(page);
  const posts = pageData?.content ?? [];
  const totalPages = pageData?.totalPages ?? 1;

  const [createPost] = useCreatePostMutation();
  const [updatePost] = useUpdatePostMutation();
  const [deletePost] = useDeletePostMutation();
  const [logout] = useLogoutMutation();

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

  const handleCreatePost = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const title = form.title.value;
    const body = form.body.value;
    await createPost({ title, body });
    form.reset();
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch {
      // swallow — clear credentials regardless
    }
    dispatch(clearCredentials());
  };

  if (!isAuthenticated) {
    return (
      <div className="page">
        <div className="container" style={{ maxWidth: 480 }}>
          <AuthSection />
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <div className="card hero-card">
          <p className="eyebrow">Redux Toolkit Demo</p>
          <h1>Counter + RTK Query</h1>
          <p className="subtext">
            Connected to the Spring Boot backend with JWT auth.
          </p>
          <div className="counter-box">
            <span className="counter-label">Current value</span>
            <div className="counter-value">{count}</div>
            <div className="button-row">
              <button onClick={() => dispatch(decrement())}>-1</button>
              <button className="primary" onClick={() => dispatch(increment())}>
                +1
              </button>
              <button onClick={() => dispatch(reset())}>Reset</button>
            </div>
          </div>
          <div style={{ marginTop: 20 }}>
            <button className="btn-delete" onClick={handleLogout}>
              Sign Out
            </button>
          </div>
        </div>

        {/* Posts */}
        <div className="card">
          <div className="section-head">
            <div>
              <p className="eyebrow">RTK Query</p>
              <h2>Posts</h2>
            </div>
            <div className="pagination-controls">
              <button
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
              >
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
                  <article
                    key={post.id}
                    className="post-card post-card--editing"
                  >
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
                      <button
                        className="primary"
                        onClick={() => saveEdit(post.id)}
                      >
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
                        {openCommentsId === post.id
                          ? "Hide Comments"
                          : "Comments"}
                      </button>
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

        {/* Create Post */}
        <form onSubmit={handleCreatePost} className="card post-form">
          <p className="eyebrow">Submit content</p>
          <h2>Create a new post</h2>
          <div className="form-field">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              id="title"
              placeholder="Enter a title…"
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="body">Body</label>
            <textarea
              name="body"
              id="body"
              rows="4"
              placeholder="Write something…"
              required
            ></textarea>
          </div>
          <button type="submit" className="primary form-submit">
            Create Post
          </button>
        </form>

        {/* Cat */}
        <CatSection />

        {/* Account */}
        <AccountSection />
      </div>
    </div>
  );
}
