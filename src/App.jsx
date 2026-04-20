import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { decrement, increment, reset } from "./features/counter/counterSlice";
import {
  useDeletePostMutation,
  useGetPostsQuery,
  useUpdatePostMutation,
} from "./features/posts/postsApi";

export default function App() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  const { data: posts, isLoading, isError, refetch } = useGetPostsQuery();
  const [updatePost] = useUpdatePostMutation();
  const [deletePost] = useDeletePostMutation();

  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ title: "", body: "" });

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

  const createPost = async (formData) => {
    const title = formData.get("title");
    const body = formData.get("body");

    try {
      await fetch(import.meta.env.VITE_PUBLIC_API_URL + "/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, body }),
      });
      alert("Post created successfully!");
      refetch();
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post.");
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="card hero-card">
          <p className="eyebrow">Redux Toolkit Demo</p>
          <h1>Counter + RTK Query</h1>
          <p className="subtext">
            Small React project with a nice UI and a real API fetch.
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
        </div>

        <div className="card">
          <div className="section-head">
            <div>
              <p className="eyebrow">RTK Query Fetch</p>
              <h2>Latest example posts</h2>
            </div>
          </div>

          {isLoading && <p className="status">Loading posts...</p>}
          {isError && (
            <p className="status error">
              Something went wrong while fetching the posts.
            </p>
          )}

          {posts && (
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
                    <div className="post-card-actions">
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
                  </article>
                ),
              )}
            </div>
          )}
        </div>
        <form action={createPost} className="card post-form">
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
      </div>
    </div>
  );
}
