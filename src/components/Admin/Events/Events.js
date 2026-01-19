import React, { useState, useEffect } from "react";
import { Button, ButtonGroup, Card, Icon } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../supabase"; // ✅ Supabase client
import GoToTop from "../../../GoToTop";
import Sidebar from "../components/Sidebar";
import LoaderComponent from "../components/LoaderComponent";
import { toast, ToastContainer } from "react-toastify";

function Events() {
  const [event, setEvent] = useState({});
  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔹 Fetch Events from Supabase
  useEffect(() => {
    getEvents();
  }, []);

  const getEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (err) {
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Delete Event and its images
  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this event and all its images?"
      )
    )
      return;

    try {
      setOpen(false);

      // 1️⃣ Fetch all images for the event
      const { data: images, error: fetchError } = await supabase
        .from("event_images")
        .select("*")
        .eq("event_id", id);
      if (fetchError) throw fetchError;

      // 2️⃣ Delete images from Supabase Storage
      if (images && images.length > 0) {
        const paths = images.map((img) => img.path);
        const { error: storageError } = await supabase.storage
          .from("events")
          .remove(paths);
        if (storageError) throw storageError;
      }

      // 3️⃣ Delete image records from event_images table
      const { error: deleteImagesError } = await supabase
        .from("event_images")
        .delete()
        .eq("event_id", id);
      if (deleteImagesError) throw deleteImagesError;

      // 4️⃣ Delete the event itself
      const { error: deleteEventError } = await supabase
        .from("events")
        .delete()
        .eq("id", id);
      if (deleteEventError) throw deleteEventError;

      // 5️⃣ Update local state
      setEvents(events.filter((item) => item.id !== id));
      toast.success("Event deleted successfully!");
      // console.log("Event and all images deleted successfully!");
    } catch (err) {
      toast.error(err.message);
      console.error("Error deleting event:", err.message);
    }
  };

  return (
    <>
      <ToastContainer />
      <GoToTop />
      <div className="main-wrapper">
        <Sidebar />
        <div className="page-wrapper">
          <div className="content">
            <div className="section-title" data-aos="fade-left">
              <h2
                style={{
                  fontWeight: "bold",
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                EVENTS (ONLINE/OFFLINE)
              </h2>
            </div>

            <div className="container-fluid">
              <div className="text-right" style={{ marginTop: "-30px" }}>
                <Button
                  floated="right"
                  icon
                  labelPosition="left"
                  primary
                  size="small"
                  onClick={() => navigate(`/add-event`)}
                >
                  <Icon name="upload" /> Add Event
                </Button>
              </div>
            </div>

            {loading ? (
              <LoaderComponent message={"Fetching Data. Please wait..."} />
            ) : null}

            <div className="container-fluid">
              <div className="row" style={{ marginTop: "50px" }}>
                {events &&
                  events.map((data) => (
                    <div
                      key={data.id}
                      className="col-sm-6 col-md-4 col-xl-3 mb-3"
                    >
                      <div className="ui card" style={{ width: "100%" }}>
                        <div className="image">
                          <img
                            className="img-fluid"
                            alt=" "
                            style={{
                              width: "100%",
                              aspectRatio: "5/3",
                              objectFit: "cover",
                            }}
                            src={data.cover_url}
                          />
                          <ButtonGroup
                            size="mini"
                            style={{ position: "absolute", right: 0 }}
                          >
                            <Button
                              negative
                              icon="trash"
                              onClick={() =>
                                handleDelete(data.id, data.file_path)
                              }
                            ></Button>

                            <Button
                              onClick={() => navigate(`/edit-event/${data.id}`)}
                              icon="pencil"
                            ></Button>
                          </ButtonGroup>
                        </div>

                        <div className="content">
                          <p
                            className="header mb-0"
                            style={{
                              fontWeight: "bold",
                              fontSize: "1.1rem",
                            }}
                          >
                            {data.title}
                          </p>
                          <div className="meta">
                            <span className="date" style={{ fontSize: "11px" }}>
                              <i style={{ color: "grey" }}>Event Date:</i>{" "}
                              <b style={{ color: "black" }}>
                                {data.date
                                  ? new Date(data.date).toLocaleDateString(
                                      "en-GB",
                                      {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                      }
                                    )
                                  : "No date"}
                              </b>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <br />
          </div>
        </div>
      </div>
    </>
  );
}

export default Events;
