import React, { useState, useEffect } from "react";
import { Button, ButtonGroup, Card, Icon, Item } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../supabase"; // ✅ Supabase client
import GoToTop from "../../../GoToTop";
import Sidebar from "../components/Sidebar";
import LoaderComponent from "../components/LoaderComponent";

function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Fetch blogs from Supabase
  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .order("created_at", { ascending: false }); // ✅ same as Firestore orderBy("date", "desc")

      if (error) throw error;
      setBlogs(data || []);
    } catch (err) {
      console.error("Error fetching blogs:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete blog from Supabase
  const handleDelete = async (id, cover_img_path) => {
    if (window.confirm("Are you sure you want to delete?")) {
      try {
        // First delete row from DB
        const { error } = await supabase.from("blogs").delete().eq("id", id);
        if (error) throw error;

        // Then remove the image from storage (if you stored path)
        if (cover_img_path) {
          await supabase.storage.from("blogs-images").remove([cover_img_path]);
        }

        setBlogs(blogs.filter((blog) => blog.id !== id));
      } catch (err) {
        console.error("Error deleting blog:", err.message);
      }
    }
  };

  return (
    <>
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
                BLOGS
              </h2>
            </div>

            {loading ? (
              <LoaderComponent message={"Fetching Data. Please wait..."} />
            ) : null}

            <div className="text-right" style={{ marginTop: "-22px" }}>
              <Button
                floated="right"
                icon
                labelPosition="left"
                primary
                size="small"
                onClick={() => navigate(`/add-new-blog`)}
              >
                <Icon name="upload" /> Add Blog
              </Button>

              <Button
                floated="right"
                icon
                labelPosition="left"
                color="orange"
                size="small"
                disabled
              
              >
                <Icon name="refresh" /> Pending Blogs
              </Button>
            </div>

            <div className="row mt-5">
              {blogs &&
                blogs.map((item) => (
                  <div className="col-sm-6 col-md-4 col-lg-3 mb-4">
                    <Card
                      key={item.id}
                      style={{
                        width: "100%",
                        position: "relative",
                      }}
                    >
                      <div
                        className="image"
                        style={{ backgroundColor: "#fff" }}
                      >
                        <img
                          style={{
                            width: "100%",
                            aspectRatio: "4 / 3", // keeps 16:9 ratio
                            objectFit: "cover",
                          }}
                          src={item.cover_img} // ✅ Supabase public URL
                          alt="cover"
                        />
                        <ButtonGroup
                          size="tiny"
                          style={{ border: "3px solid white" }}
                        >
                          <Button
                            negative
                            icon="trash"
                            onClick={() =>
                              handleDelete(item.id, item.cover_img_path)
                            }
                          ></Button>

                          <Button
                            primary
                            onClick={() => navigate(`/edit-blog/${item.id}`)}
                            icon="pencil"
                          ></Button>
                        </ButtonGroup>

                        <div
                          style={{ float: "right", margin: "2px 2px 0 0" }}
                          className={`badge ${
                            item.approval == 0
                              ? "badge-warning"
                              : item.approval == 1
                              ? "badge-success"
                              : "badge-danger"
                          }`}
                        >
                          {item.approval == 0
                            ? "Pending"
                            : item.approval == 1
                            ? "Approved"
                            : "Rejected"}
                        </div>
                      </div>
                      <div className="content">
                        <p>{item.title}</p>
                      </div>
                      <div className="extra content">
                        <span
                          style={{
                            fontSize: "12px",
                            textTransform: "uppercase",
                          }}
                        >
                          <i className="user icon"></i>
                          {item.author}
                        </span>
                      </div>
                    </Card>
                  </div>
                ))}
            </div>

            <br />
          </div>
        </div>
      </div>
    </>
  );
}

export default Blog;
