import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  useLoginMutation,
  useRegisterMutation,
} from "../features/auth/authApi";
import { setCredentials } from "../features/auth/authSlice";

export default function AuthSection() {
  const dispatch = useDispatch();
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const [register, { isLoading: isRegistering }] = useRegisterMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const body = { email, password };
    try {
      const result =
        tab === "login"
          ? await login(body).unwrap()
          : await register(body).unwrap();
      dispatch(setCredentials(result));
    } catch (err) {
      setError(err?.data?.message || err?.data || "Something went wrong.");
    }
  };

  return (
    <div className="card auth-card">
      <p className="eyebrow">Welcome</p>
      <h2>{tab === "login" ? "Sign In" : "Create Account"}</h2>

      <div className="tab-row">
        <button
          className={tab === "login" ? "tab-btn active" : "tab-btn"}
          onClick={() => {
            setTab("login");
            setError("");
          }}
        >
          Login
        </button>
        <button
          className={tab === "register" ? "tab-btn active" : "tab-btn"}
          onClick={() => {
            setTab("register");
            setError("");
          }}
        >
          Register
        </button>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-field">
          <label htmlFor="auth-email">Email</label>
          <input
            id="auth-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="auth-password">Password</label>
          <input
            id="auth-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            required
          />
        </div>
        {error && <p className="status error">{error}</p>}
        <button
          type="submit"
          className="primary form-submit"
          disabled={isLoggingIn || isRegistering}
        >
          {isLoggingIn || isRegistering
            ? "Please wait…"
            : tab === "login"
              ? "Sign In"
              : "Create Account"}
        </button>
      </form>
    </div>
  );
}
