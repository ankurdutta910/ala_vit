import React from "react";
import { Link } from "react-router-dom";

function Nav() {
  return (
    <>
      <section style={{ marginTop: "40px" }}>
        <div className="container-fluid" style={{ maxWidth: "190vh" }}>
          <Link
            to="/stateanthem"
            class="ui image label"
            style={{ margin: "2px" }}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/556/556130.png"
              alt=""
            />
            State Anthem
          </Link>

          <Link
            to="/statesymbols"
            class="ui image label"
            style={{ margin: "2px" }}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/556/556130.png"
              alt=""
            />
            State Symbols
          </Link>

          <Link
            to="/assamhistory"
            class="ui image label"
            style={{ margin: "2px" }}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/556/556130.png"
              alt=""
            />
            Assam History
          </Link>

          <Link
            to="/assamculture"
            class="ui image label"
            style={{ margin: "2px" }}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/556/556130.png"
              alt=""
            />
            Assam Culture
          </Link>

          <Link
            to="/assamparks"
            class="ui image label"
            style={{ margin: "2px" }}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/556/556130.png"
              alt=""
            />
            National Parks
          </Link>

          <Link
            to="/assamvideogallery"
            class="ui image label"
            style={{ margin: "2px" }}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/556/556130.png"
              alt=""
            />
            Video Gallery
          </Link>
        </div>
      </section>
    </>
  );
}

export default Nav;
