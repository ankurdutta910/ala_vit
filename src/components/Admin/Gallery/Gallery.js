import React, { useState, useEffect } from "react";
import { Button, ButtonGroup, ButtonOr, Card, Icon } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../supabase";
import GoToTop from "../../../GoToTop";
import Sidebar from "../components/Sidebar";
import LoaderComponent from "../components/LoaderComponent";
import { toast, ToastContainer } from "react-toastify";

function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1); // ✅ current page
  const [total, setTotal] = useState(0); // ✅ total records
  const limit = 12; // ✅ items per page (4x2 grid)
  const navigate = useNavigate();

  // ✅ Fetch total count & current page data
  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true);

      // 1️⃣ Get total count
      const { count } = await supabase
        .from("gallery")
        .select("*", { count: "exact", head: true });

      setTotal(count || 0);

      // 2️⃣ Fetch only the page data
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) {
        console.error("Error fetching gallery:", error.message);
      } else {
        setPhotos(data || []);
      }
      setLoading(false);
    };

    fetchPhotos();
  }, [page]);

  // ✅ Format date (same as before)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();

    const getDaySuffix = (d) => {
      if (d > 3 && d < 21) return "th";
      switch (d % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    return `${day}${getDaySuffix(day)} ${month} ${year}`;
  };

  // ✅ Delete image
  const handleDelete = async (id, file_path) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;

    try {
      if (file_path) {
        const { error: storageError } = await supabase.storage
          .from("gallery")
          .remove([file_path]);
        if (storageError) throw storageError;
      }

      const { error: dbError } = await supabase
        .from("gallery")
        .delete()
        .eq("id", id);

      if (dbError) throw dbError;

      // reload after delete
      toast.success("Image deleted successfully!");
      setPhotos((prev) => prev.filter((p) => p.id !== id));
      setTotal((prev) => prev - 1);
    } catch (err) {
      toast.error(err.message);
      console.error("Delete error:", err.message);
    }
  };

  // ✅ Pagination controls
  const totalPages = Math.ceil(total / limit);

  return (
    <>
      <GoToTop />
      <ToastContainer />

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
                GALLERY
              </h2>
            </div>

            <div className="text-right" style={{ marginTop: "-20px" }}>
              <Button
                floated="right"
                icon
                labelPosition="left"
                primary
                size="small"
                onClick={() => navigate(`/add-image`)}
              >
                <Icon name="photo" /> Add Image
              </Button>
            </div>

            {/* ✅ Gallery Grid */}
            <div className="row mt-5" style={{ minHeight: "20vh" }}>
              {loading ? (
                <LoaderComponent message={"Fetching. Please wait..."} />
              ) : photos.length > 0 ? (
                photos.map((item) => (
                  <div
                    className="col-sm-6 col-md-4 col-lg-3 mb-4"
                    key={item.id}
                  >
                    <Card
                      style={{
                        textAlign: "center",
                        width: "100%",
                      }}
                    >
                      <img
                        className="img-fluid"
                        style={{
                          width: "100%",
                          aspectRatio: "16 / 9",
                          objectFit: "cover",
                        }}
                        src={item.img}
                        alt={item.name}
                      />

                      <Card.Content className="p-2">
                        <p className="mb-0">{item.name}</p>
                        <Card.Meta>
                          <span
                            className="position"
                            style={{ fontSize: "11px" }}
                          >
                            Posted on:{" "}
                            <span style={{ fontWeight: "bold" }}>
                              {formatDate(item.created_at)}
                            </span>
                          </span>
                        </Card.Meta>
                        <div>
                          <ButtonGroup
                            size="tiny"
                            style={{ border: "3px solid white" }}
                          >
                            <Button
                              negative
                              icon="trash"
                              onClick={() =>
                                handleDelete(item.id, item.file_path)
                              }
                            ></Button>

                            <Button
                            
                              onClick={() => navigate(`/edit-image/${item.id}`)}
                              icon="pencil"
                            ></Button>
                          </ButtonGroup>
                        </div>
                      </Card.Content>
                    </Card>
                  </div>
                ))
              ) : (
                <p>No photos found.</p>
              )}
            </div>

            {/* ✅ Pagination Controls */}
            <div className="d-flex justify-content-center mt-4">
              <Button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span style={{ padding: "10px 20px" }}>
                Page {page} of {totalPages}
              </span>
              <Button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Gallery;
