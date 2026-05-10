import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  useUpdateEmailMutation,
  useUpdatePasswordMutation,
} from "../features/auth/authApi";
import { setCredentials } from "../features/auth/authSlice";

export default function AccountSection() {
  const dispatch = useDispatch();
  const [updateEmail] = useUpdateEmailMutation();
  const [updatePassword] = useUpdatePasswordMutation();

  const [newEmail, setNewEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [emailMsg, setEmailMsg] = useState(null);
  const [passwordMsg, setPasswordMsg] = useState(null);

  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    setEmailMsg(null);
    try {
      const result = await updateEmail(newEmail).unwrap();
      dispatch(setCredentials(result));
      setEmailMsg({ ok: true, text: "Email updated." });
      setNewEmail("");
    } catch (err) {
      setEmailMsg({
        ok: false,
        text: err?.data?.message || "Failed to update email.",
      });
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPasswordMsg(null);
    try {
      const result = await updatePassword({
        oldPassword,
        newPassword,
      }).unwrap();
      dispatch(setCredentials(result));
      setPasswordMsg({ ok: true, text: "Password updated." });
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      setPasswordMsg({
        ok: false,
        text: err?.data?.message || "Failed to update password.",
      });
    }
  };

  return (
    <div className="card">
      <p className="eyebrow">Account</p>
      <h2>Manage Account</h2>

      <div className="account-forms">
        <form onSubmit={handleEmailUpdate} className="account-form">
          <h3>Change Email</h3>
          <div className="form-field">
            <label>New Email</label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="new@example.com"
              required
            />
          </div>
          {emailMsg && (
            <p className={`status ${emailMsg.ok ? "" : "error"}`}>
              {emailMsg.text}
            </p>
          )}
          <button type="submit" className="primary">
            Update Email
          </button>
        </form>

        <form onSubmit={handlePasswordUpdate} className="account-form">
          <h3>Change Password</h3>
          <div className="form-field">
            <label>Current Password</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          {passwordMsg && (
            <p className={`status ${passwordMsg.ok ? "" : "error"}`}>
              {passwordMsg.text}
            </p>
          )}
          <button type="submit" className="primary">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
