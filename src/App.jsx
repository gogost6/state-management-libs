import { useDispatch, useSelector } from "react-redux";
import AccountSection from "./components/AccountSection";
import AuthSection from "./components/AuthSection";
import CatSection from "./components/CatSection";
import CreatePostForm from "./components/CreatePostForm";
import PaymentSection from "./components/PaymentSection";
import PostsSection from "./components/PostsSection";
import UserSection from "./components/UserSection";
import { useLogoutMutation } from "./features/auth/authApi";
import {
  clearCredentials,
  selectIsAuthenticated,
} from "./features/auth/authSlice";
import { decrement, increment, reset } from "./features/counter/counterSlice";

export default function App() {
  const count = useSelector((state) => state.counter.value);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const dispatch = useDispatch();

  const [logout] = useLogoutMutation();

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

        <PostsSection />
        <CreatePostForm />
        <CatSection />
        <PaymentSection />
        <UserSection />
        <AccountSection />
      </div>
    </div>
  );
}
