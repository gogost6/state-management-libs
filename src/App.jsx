import { useMachine } from "@xstate/react";
import { appMachine } from "./machines/appMachine";

export default function App() {
  const [state, send] = useMachine(appMachine);

  const { count, posts, error } = state.context;
  const isLoading = state.matches("loading");
  const isFailure = state.matches("failure");
  const isReady = state.matches("ready");

  return (
    <div className="page">
      <div className="container">
        <div className="card hero-card">
          <p className="eyebrow">XState Demo</p>
          <h1>Counter + API Fetch</h1>
          <p className="subtext">
            Small React project with a state machine for counter state and data
            loading.
          </p>

          <div className="counter-box">
            <span className="counter-label">Current value</span>
            <div className="counter-value">{count}</div>

            <div className="button-row">
              <button onClick={() => send({ type: "DECREMENT" })}>-1</button>
              <button
                className="primary"
                onClick={() => send({ type: "INCREMENT" })}
              >
                +1
              </button>
              <button onClick={() => send({ type: "RESET" })}>Reset</button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="section-head">
            <div>
              <p className="eyebrow">Example API Fetch</p>
              <h2>Latest posts</h2>
            </div>

            <button onClick={() => send({ type: "REFETCH" })}>Refetch</button>
          </div>

          {isLoading && <p className="status">Loading posts...</p>}

          {isFailure && <p className="status error">{error}</p>}

          {isReady && (
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
