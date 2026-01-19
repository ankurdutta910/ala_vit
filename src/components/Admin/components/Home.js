import React, { useEffect, useState } from "react";
import "./Style.css";
import { supabase } from "../../../supabase"; // ✅ make sure supabase is imported
import GoToTop from "../../../GoToTop";
import Sidebar from "./Sidebar";
import LoaderComponent from "./LoaderComponent";

const Home = () => {
  const [totalPhotos, setTotalPhotos] = useState(0);
  const [totalEvents, setTotalEvents] = useState(0);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchTotalPhotos = async () => {
    const { count, error } = await supabase
      .from("gallery")
      .select("id", { count: "exact", head: true });

    if (error) {
      console.error("Error fetching total photos:", error.message);
      setLoading(false);
    } else {
      setTotalPhotos(count);
      setLoading(false);
    }
  };

  const fetchTotalEvents = async () => {
    const { count, error } = await supabase
      .from("events")
      .select("id", { count: "exact", head: true });

    if (error) {
      setLoading(false);
      console.error("Error fetching total photos:", error.message);
    } else {
      setLoading(false);
      setTotalEvents(count);
    }
  };

  const fetchTotalBlogs = async () => {
    const { count, error } = await supabase
      .from("blogs")
      .select("id", { count: "exact", head: true });

    if (error) {
      setLoading(false);
      console.error("Error fetching total photos:", error.message);
    } else {
      setLoading(false);
      setTotalBlogs(count);
    }
  };

  useEffect(() => {
    fetchTotalPhotos();
    fetchTotalEvents();
    fetchTotalBlogs();
  }, []);

  return (
    <>
      <GoToTop />

      {loading ? (
        <LoaderComponent message={"Fetching Data. Please wait..."} />
      ) : null}
      <div className="main-wrapper">
        <Sidebar />
        <div className="page-wrapper">
          <div className="content">
            <div className="section-title" data-aos="fade-left">
              <h2
                style={{ fontWeight: "bold", fontFamily: "Montserrat" }}
                className="page-title"
              >
                DASHBOARD
              </h2>
            </div>
            <div className="row mt-1">
              <div className="col-md-3 mt-2">
                <div className="ui card p-3 w-100">
                  <p className="mb-1">Total Images</p>
                  <h1 style={{ fontWeight: "800", color: "cornflowerblue" }}>
                    {totalPhotos}
                  </h1>
                  <i
                    className="fa fa-image"
                    style={{
                      position: "absolute",
                      top: "15px",
                      right: "15px",
                      fontSize: "2.5rem",
                      color: "cornflowerblue",
                    }}
                  ></i>
                </div>
              </div>

              <div className="col-md-3 mt-2">
                <div className="ui card p-3 w-100">
                  <p className="mb-1">Total Events</p>
                  <h1 style={{ fontWeight: "800", color: "orange" }}>
                    {totalEvents}
                  </h1>
                  <i
                    className="fa fa-cubes"
                    style={{
                      position: "absolute",
                      top: "15px",
                      right: "15px",
                      fontSize: "2.5rem",
                      color: "orange",
                    }}
                  ></i>
                </div>
              </div>

              <div className="col-md-3 mt-2">
                <div className="ui card p-3 w-100">
                  <p className="mb-1">Total Blogs</p>
                  <h1 style={{ fontWeight: "800", color: "#ff2c2c" }}>
                    {totalBlogs}
                  </h1>
                  <i
                    className="fa fa-book"
                    style={{
                      position: "absolute",
                      top: "15px",
                      right: "15px",
                      fontSize: "2.5rem",
                      color: "#ff2c2c",
                    }}
                  ></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
