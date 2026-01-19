import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../supabase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UpdatePassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const navigate = useNavigate();

  // Parse token from URL and store in state
  useEffect(() => {
    const hash = window.location.hash;
    const tokenMatch = hash.match(/access_token=([^&]+)/);
    const token = tokenMatch ? tokenMatch[1] : null;
    setAccessToken(token);
  }, []);

  // Set Supabase session once token is available
  useEffect(() => {
    if (!accessToken) return;

    supabase.auth
      .setSession({ access_token: accessToken })
      .then(({ error }) => {
        if (error) {
        //   toast.error(error.message);
          console.log("Error setting session: " + error.message);
        } else {
          console.log("Session set");
        }
      });
  }, [accessToken]);

  const handleUpdatePassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in both fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password updated successfully!");
      setTimeout(() => navigate("/signin"), 2000);
    }

    setLoading(false);
  };

  return (
    <div className="login-wrapper d-flex align-items-center justify-content-center">
      <ToastContainer />
      <div className="login-card shadow p-4 rounded" style={{ width: "100%", maxWidth: "400px" }}>
        <h3 className="fw-bold mb-3">Set New Password</h3>
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={{ width: "100%", marginBottom: "15px", padding: "10px" }}
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={{ width: "100%", marginBottom: "15px", padding: "10px" }}
        />
        <button
          onClick={handleUpdatePassword}
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </div>
    </div>
  );
}

export default UpdatePassword;
