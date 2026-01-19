import { useState, useEffect } from "react";
import { supabase } from "../../../supabase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./Sidebar";
import { Button, Form, Input, Select } from "semantic-ui-react";

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Supabase does not require current password for authenticated users
  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }

    setLoading(false);
  };

  const [displayName, setDisplayName] = useState("");
  const [userType, setUserType] = useState("");
  const [userID, setUserID] = useState("");
  const [email, setEmail] = useState("");
  const [isloading, setIsLoading] = useState(false);

  // Fetch current user metadata
  const fetchUserProfile = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      toast.error("Error fetching user");
      return;
    }

    // take only the first part of UUID before "-"
    const shortId = user.id.split("-")[0].toUpperCase();
    setUserID(shortId);
    setEmail(user.email);
    setDisplayName(user.user_metadata?.display_name || "");
    setUserType(user.user_metadata?.user_type || "");
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Update profile
  const handleUpdate = async () => {
    if (!displayName || !userType) {
      toast.error("Please fill all fields");
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.auth.updateUser({
      data: {
        display_name: displayName,
        user_type: userType,
      },
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Profile updated successfully!");
    }

    setIsLoading(false);
  };

  return (
    <>
      <div className="main-wrapper">
        <Sidebar />
        <div className="page-wrapper">
          <div className="content">
            <ToastContainer />
            <div className="row ">
              <div className="col-md-6 col-xl-4 mb-3">
                <div
                  className="profile-card shadow p-4 rounded"
                  style={{
                    width: "100%",
                    background: "#fff",
                  }}
                >
                  <div className="section-title mb-4" data-aos="fade-left">
                    <h2
                      style={{
                        fontWeight: "bold",
                        fontFamily: "Montserrat, sans-serif",
                      }}
                    >
                      UPDATE PROFILE
                    </h2>
                  </div>

                  <label className="users-label">User ID</label>
                  <Input
                    value={userID}
                    readOnly
                    // onChange={(e) => setUserType(e.target.value)}
                    style={{
                      width: "100%",
                      marginTop: 0,
                    }}
                  />

                   <label className="users-label mt-3">User Email</label>
                  <Input
                    value={email}
                    readOnly
                    // onChange={(e) => setUserType(e.target.value)}
                    style={{
                      width: "100%",
                      marginTop: 0,
                    }}
                  />

                  
                  <label className="users-label mt-3">Fullname</label>
                  {/* Display Name */}
                  <br />
                  <div class="d-flex gap-1">
                    <Input
                      type="text"
                      placeholder="Enter Display Name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      style={{
                        width: "100%",
                      }}
                    />
                    <Button
                      primary
                      type="button"
                      className="ui button"
                      onClick={handleUpdate}
                      disabled={isloading}
                    >
                      {isloading ? "Updating..." : "Update"}
                    </Button>
                  </div>

                 
                  {/* User Type Dropdown */}
                  {/* <label className="users-label mt-3">User Role</label>
                  <Input
                    value={userType}
                    readOnly
                    // onChange={(e) => setUserType(e.target.value)}
                    style={{
                      width: "100%",
                      marginTop: 0,
                    }}
                  /> */}
                </div>
              </div>

              <div className="col-md-6 col-xl-4">
                <div
                  className="auth-card shadow p-4 rounded"
                  style={{
                    width: "100%",
                    background: "#fff",
              
                  }}
                >
                  <div className="section-title mb-4" data-aos="fade-left">
                    <h2
                      style={{
                        fontWeight: "bold",
                        fontFamily: "Montserrat, sans-serif",
                      }}
                    >
                      CHANGE PASSWORD
                    </h2>
                  </div>

                  {/* New Password */}
                  <label className="users-label">New Password</label>
                  <Input
                    type="text"
                    required
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={{
                      width: "100%",
                    }}
                  />

                  {/* Confirm Password */}
                  <label className="users-label mt-3">
                    Confirm New Password
                  </label>
                  <Input
                    type="text"
                    required
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{
                      width: "100%",
                      marginBottom: "15px",
                    }}
                  />

                  <Button
                    onClick={handleChangePassword}
                    disabled={loading}
                    color="orange"
                  >
                    {loading ? "Updating..." : "Update Password"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChangePassword;
