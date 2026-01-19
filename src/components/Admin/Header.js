import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../../supabase";
import { useLocation, useNavigate } from "react-router";
import logo from "../assets/image/blacklogo.png";
import { Link } from "react-router-dom";
import "../../App.css";
import { Button, Icon } from "semantic-ui-react";
import defaultProfile from "../assets/image/user.jpg"; // add a default image in assets
import Sidebar from "./components/Sidebar";

function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [userID, setUserID] = useState("");
  const [profileImg, setProfileImg] = useState(defaultProfile);

  const collapseRef = useRef(null);

  const closeNavbar = () => {
    if (collapseRef.current) {
      // Remove the 'show' class to collapse
      collapseRef.current.classList.remove("show");
    }
  };

  // Get current session/user
  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        navigate("/signin"); // redirect if not logged in
      } else {
        const currentUser = data.user;
        setUser(currentUser);

        // Display name
        setDisplayName(currentUser.user_metadata?.display_name || "User");

        // Short user ID (before first "-") and uppercase
        setUserID(currentUser.id.split("-")[0].toUpperCase());

        // Profile Image (if you want to allow custom images later via metadata)
        setProfileImg(currentUser.user_metadata?.avatar_url || defaultProfile);
      }
    };
    getUser();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/signin");
    window.location.reload();
  };

  return (
    <>
      <a
        className="close-navbar-toggler collapsed"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      ></a>

      {/* Custom Light Theme Navbar */}
      <nav
        id="portal-navbar"
        className="navbar navbar-expand-lg custom-navbar fixed-top"
      >
        <div className="container-fluid" style={{ maxWidth: "210vh" }}>
          <Link className="navbar-brand" to="/">
            <img id="logoimg" src={logo} alt="Logo" />
          </Link>

          <i
            className="fa fa-bars navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          ></i>
          {/* <Button
            size="mini"
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span
              className="navbar-toggler-icon"
              style={{ color: "grey" }}
            ></span>
          </Button> */}

          <div
            className="collapse navbar-collapse"
            ref={collapseRef}
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav ml-auto">
              <li className="nav-item d-flex align-items-center gap-2">
                <ul className="topmenu">
                  <li>
                    <Link to="/portal" onClick={closeNavbar}>
                      <i className="fa fa-dashboard"></i> <span>Dashboard</span>
                    </Link>
                  </li>

                  <li>
                    <Link to="/boardview" onClick={closeNavbar}>
                      <i className="fa fa-users" aria-hidden="true"></i>{" "}
                      <span>Board</span>
                    </Link>
                  </li>

                  <li>
                    <Link to="/galleryview" onClick={closeNavbar}>
                      <i className="fa fa-image" aria-hidden="true"></i>{" "}
                      <span>Gallery</span>
                    </Link>
                  </li>

                  <li>
                    <Link to="/view-blogs" onClick={closeNavbar}>
                      <i className="fa fa-book" aria-hidden="true"></i>{" "}
                      <span>Blogs</span>
                    </Link>
                  </li>

                  <li>
                    <Link to="/admin-events" onClick={closeNavbar}>
                      <i className="fa fa-cubes" aria-hidden="true"></i>{" "}
                      <span>Events</span>
                    </Link>
                  </li>

                  <li>
                    <Link
                      style={{ cursor: "not-allowed" }}
                      onClick={closeNavbar}
                    >
                      <i className="fa fa-envelope" aria-hidden="true"></i>{" "}
                      <span>Messages</span>
                    </Link>
                  </li>

                  <li>
                    <Link to="/change-password" onClick={closeNavbar}>
                      <i className="fa fa-key" aria-hidden="true"></i>{" "}
                      <span>Profile</span>
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="nav-item d-flex align-items-center gap-2">
                {/* Profile Image */}
                <img
                  src={profileImg}
                  alt="Profile"
                  style={{
                    width: "35px",
                    height: "35px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
                {/* Display Name + UserID */}
                <div
                  style={{ lineHeight: "1.2" }}
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                >
                  <span className="fw-bold">{displayName}</span>
                  <br />
                  <small style={{ fontSize: "12px", color: "gray" }}>
                    {userID}
                  </small>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Profile Modal */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body text-center">
              <img
                src={profileImg}
                alt="Profile"
                style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              <h5 className="mt-3 mb-0">{displayName}</h5>
              <small className="text-secondary">
                USER ID: <b>{userID}</b>
              </small>
              <br /> <br />
              <Button type="button" size="small" data-bs-dismiss="modal">
                Cancel
              </Button>
              <Button
                icon
                labelPosition="left"
                size="small"
                color="red"
                style={{ marginTop: "9px" }}
                onClick={handleLogout}
              >
                <Icon name="sign-out" /> LogOut
              </Button>
              <br /> <br />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
