import React, { useState, useEffect } from "react";
import { supabase } from "../supabase"; 
import GoToTop from "../GoToTop";
import { Link } from "react-router-dom";
import coverImg from "./assets/image/2150951243.webp";
import { Placeholder } from "semantic-ui-react"; // ✅ Skeleton loader

function ALAEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("events")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        setEvents(data || []);
      } catch (err) {
        console.error("Error fetching events:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // ✅ Skeleton Loader for events
  const renderSkeletons = () => {
    return Array(4)
      .fill(0)
      .map((_, idx) => (
        <div key={idx} className="col-lg-3 col-md-6 mb-4">
          <div className="ui card" style={{ width: "100%" }}>
            <Placeholder>
              <Placeholder.Image square />
            </Placeholder>
            <div className="content">
              <Placeholder>
                <Placeholder.Header>
                  <Placeholder.Line length="medium" />
                  <Placeholder.Line length="short" />
                </Placeholder.Header>
              </Placeholder>
              <Placeholder>
                <Placeholder.Paragraph>
                  <Placeholder.Line length="full" />
                  <Placeholder.Line length="very long" />
                </Placeholder.Paragraph>
              </Placeholder>
            </div>
            <div className="extra content">
              <Placeholder>
                <Placeholder.Line length="short" />
              </Placeholder>
            </div>
          </div>
        </div>
      ));
  };

  return (
    <>
      <GoToTop />
      <section
        id="contactus"
        style={{
          background: `url(${coverImg}) top center`,
          backgroundSize: "cover",
          backgroundPosition: "50% 35%",
        }}
        className="d-flex align-items-center justify-content-center"
      >
        <div className="container" style={{ marginBottom: "30px" }}>
          <div
            className="row justify-content-center"
            data-aos="fade-up"
            data-aos-delay="150"
          >
            <div className="col-xl-12 col-lg-8">
              <h1>Events</h1>
              <h2>A showcase of creativity and moments that matter.</h2>
            </div>
          </div>
        </div>
      </section>

      <section style={{ minHeight: "5vh" }}>
        <div className="container-fluid" style={{ maxWidth: "195vh" }}>
          <div className="row" style={{ marginTop: "25px" }}>
            {loading
              ? renderSkeletons() // ✅ show skeletons while loading
              : events.length === 0
              ? <p>No events found.</p>
              : events.map((data) => (
                  <div
                    key={data.id}
                    className="col-lg-3 col-md-6 mb-4"
                  >
                    <div className="ui card" style={{ width: "100%" }}>
                      <div className="image">
                        <img
                          className="img-fluid"
                          alt={data.title || "event"}
                          style={{
                            width: "100%",
                            height: "25vh",
                            objectFit: "cover",
                          }}
                          src={data.cover_url || coverImg}
                        />
                      </div>
                      <div className="content">
                        <a
                          className="header"
                          style={{
                            textTransform: "uppercase",
                            fontWeight: "bold",
                            fontFamily: "montserrat",
                            color: "#2e2e2e",
                          }}
                        >
                          {data.title}
                        </a>

                        <div
                          className="blogItem-desc mt-2"
                          style={{
                            textAlign: "justify",
                            height: "60px",
                            overflow: "hidden",
                            fontSize: "13px",
                          }}
                          dangerouslySetInnerHTML={{
                            __html: ` ${data.content}`,
                          }}
                        ></div>
                        <Link
                          style={{ marginTop: "10px", color: "orange" }}
                          to={`/events/${data.id}`}
                          className="read-more"
                        >
                          Know more{" "}
                          <i
                            className="fa fa-angle-double-right"
                            aria-hidden="true"
                          ></i>
                        </Link>
                      </div>
                      <div
                        className="extra content"
                        style={{ marginTop: "-20px" }}
                      >
                        <a style={{ fontSize: "11px" }}>
                          <i className="calendar icon"></i>
                          {data.date
                            ? new Date(data.date).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })
                            : "No date"}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default ALAEvents;
