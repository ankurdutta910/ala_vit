import React from "react";
import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  // helper function to check active path
  const isActive = (path) => location.pathname === path;
  return (
    <>
      {" "}
      <div className="sidebar" id="sidebar">
        <div className="sidebar">
          <div id="sidebar-menu" class="sidebar-menu">
            <ul className="mt-3">
              <li className={isActive("/portal") ? "active" : ""}>
                <Link to="/portal">
                  <i className="fa fa-dashboard"></i> <span>Dashboard</span>
                </Link>
              </li>

              <li className={isActive("/boardview") ? "active" : ""}>
                <Link to="/boardview">
                  <i className="fa fa-users" aria-hidden="true"></i>{" "}
                  <span>Board</span>
                </Link>
              </li>

              <li className={isActive("/galleryview") ? "active" : ""}>
                <Link to="/galleryview">
                  <i className="fa fa-image" aria-hidden="true"></i>{" "}
                  <span>Gallery</span>
                </Link>
              </li>

              <li className={isActive("/view-blogs") ? "active" : ""}>
                <Link to="/view-blogs">
                  <i className="fa fa-book" aria-hidden="true"></i>{" "}
                  <span>Blogs</span>
                </Link>
              </li>

              <li className={isActive("/admin-events") ? "active" : ""}>
                <Link to="/admin-events">
                  <i className="fa fa-cubes" aria-hidden="true"></i>{" "}
                  <span>Events</span>
                </Link>
              </li>

              <li >
                <Link style={{ cursor: "not-allowed" }}>
                  <i className="fa fa-envelope" aria-hidden="true"></i>{" "}
                  <span>Messages</span>
                </Link>
              </li>

              <li className={isActive("/change-password") ? "active" : ""}>
                <Link to="/change-password">
                  <i className="fa fa-key" aria-hidden="true"></i>{" "}
                  <span>Profile</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
