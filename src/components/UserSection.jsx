import { useState } from "react";
import { useDispatch } from "react-redux";
import { clearCredentials } from "../features/auth/authSlice";
import { useDeleteMeMutation, useGetMeQuery } from "../features/users/usersApi";

export default function UserSection() {
  const dispatch = useDispatch();
  const { data: user, isLoading } = useGetMeQuery();
  const [deleteMe, { isLoading: deleting }] = useDeleteMeMutation();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState(null);

  const handleDelete = async () => {
    setDeleteMsg(null);
    try {
      await deleteMe().unwrap();
      dispatch(clearCredentials());
    } catch (err) {
      setDeleteMsg(err?.data?.message || "Failed to delete account.");
      setConfirmDelete(false);
    }
  };

  if (isLoading) {
    return (
      <div className="card">
        <p className="subtext">Loading profile…</p>
      </div>
    );
  }

  return (
    <div className="card">
      <p className="eyebrow">Profile</p>
      <h2>My Account</h2>

      {user && (
        <div style={{ marginBottom: 16 }}>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Roles:</strong> {user.roles?.join(", ") ?? "—"}
          </p>
          <p>
            <strong>Member since:</strong>{" "}
            {user.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : "—"}
          </p>
        </div>
      )}

      {!confirmDelete ? (
        <button className="btn-delete" onClick={() => setConfirmDelete(true)}>
          Delete Account
        </button>
      ) : (
        <div>
          <p className="status error">
            This will permanently delete your account. Are you sure?
          </p>
          <div className="button-row">
            <button
              className="btn-delete"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting…" : "Yes, delete"}
            </button>
            <button onClick={() => setConfirmDelete(false)}>Cancel</button>
          </div>
        </div>
      )}

      {deleteMsg && <p className="status error">{deleteMsg}</p>}
    </div>
  );
}
