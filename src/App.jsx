import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { counterState } from "./state/counterAtom";

export default function App() {
  const [count, setCount] = useRecoilState(counterState);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts?_limit=5",
      );

      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }

      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="page">
      <div className="container">
        <div className="card hero-card">
          <p className="eyebrow">Recoil Demo</p>
          <h1>Counter + API Fetch</h1>
          <p className="subtext">
            Small React project with Recoil state and a real example API.
          </p>

          <div className="counter-box">
            <span className="counter-label">Current value</span>
            <div className="counter-value">{count}</div>

            <div className="button-row">
              <button onClick={() => setCount((prev) => prev - 1)}>-1</button>
              <button
                className="primary"
                onClick={() => setCount((prev) => prev + 1)}
              >
                +1
              </button>
              <button onClick={() => setCount(0)}>Reset</button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="section-head">
            <div>
              <p className="eyebrow">Example API Fetch</p>
              <h2>Latest posts</h2>
            </div>

            <button onClick={fetchPosts}>Refetch</button>
          </div>

          {loading && <p className="status">Loading posts...</p>}
          {error && <p className="status error">{error}</p>}

          {!loading && !error && (
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
