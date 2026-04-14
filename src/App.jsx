import { useQuery } from "@tanstack/react-query";
import { getPosts } from "./api/postsApi";
import { useCounterStore } from "./store/useCounterStore";

export default function App() {
  const { count, increment, decrement, reset } = useCounterStore();

  const {
    data: posts,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  return (
    <div className="page">
      <div className="container">
        <div className="card hero-card">
          <p className="eyebrow">Zustand + React Query</p>
          <h1>Counter + API Fetch</h1>
          <p className="subtext">
            Small React project with Zustand for local state and React Query for
            server data.
          </p>

          <div className="counter-box">
            <span className="counter-label">Current value</span>
            <div className="counter-value">{count}</div>

            <div className="button-row">
              <button onClick={decrement}>-1</button>
              <button className="primary" onClick={increment}>
                +1
              </button>
              <button onClick={reset}>Reset</button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="section-head">
            <div>
              <p className="eyebrow">React Query Fetch</p>
              <h2>Latest posts</h2>
            </div>
          </div>

          {isLoading && <p className="status">Loading posts...</p>}

          {isError && (
            <p className="status error">
              {error?.message || "Something went wrong."}
            </p>
          )}

          {posts && (
            <div className="posts-grid">
              {posts.map((post) => (
                <article key={post.id} className="post-card">
                  <span className="post-id">#{post.id}</span>
                  <h3>{post.title}</h3>
                  <p>{post.body}</p>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
