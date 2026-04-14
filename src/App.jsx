import { useDispatch, useSelector } from "react-redux";
import { decrement, increment, reset } from "./features/counter/counterSlice";
import { useGetPostsQuery } from "./features/posts/postsApi";

export default function App() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  const { data: posts, isLoading, isError } = useGetPostsQuery();

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
