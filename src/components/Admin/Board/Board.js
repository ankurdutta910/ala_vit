import React, { useState, useEffect } from "react";
import { Button, ButtonGroup, Icon, Loader } from "semantic-ui-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../../supabase"; // supabase client
import GoToTop from "../../../GoToTop";
import { Card } from "semantic-ui-react";
import Sidebar from "../components/Sidebar";
import LoaderComponent from "../components/LoaderComponent";
import { ToastContainer, toast } from "react-toastify";

function Board() {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState("2025-26"); // ✅ default year (active option)
  const navigate = useNavigate();

  // ✅ Fetch boards by year
  useEffect(() => {
    const fetchBoards = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("board")
        .select("*")
        .eq("year", year) // ✅ filter by selected year
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching boards:", error.message);
      } else {
        setBoards(data || []);
      }
      setLoading(false);
    };

    fetchBoards();

    // ✅ Realtime updates (filtered by year)
    const channel = supabase
      .channel("board-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "board" },
        (payload) => {
          if (payload.eventType === "INSERT" && payload.new.year === year) {
            setBoards((prev) => [payload.new, ...prev]);
          } else if (
            payload.eventType === "UPDATE" &&
            payload.new.year === year
          ) {
            setBoards((prev) =>
              prev.map((b) => (b.id === payload.new.id ? payload.new : b))
            );
          } else if (payload.eventType === "DELETE") {
            setBoards((prev) => prev.filter((b) => b.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [year]); // ✅ re-run fetch when year changes

  // ✅ Delete board + image
  const handleDelete = async (id, filePath) => {
    if (window.confirm("Are you sure you want to delete?")) {
      try {
        const { error: dbError } = await supabase
          .from("board")
          .delete()
          .eq("id", id);
        if (dbError) throw dbError;

        if (filePath) {
          await supabase.storage.from("board").remove([filePath]);
        }

        setBoards((prev) => prev.filter((b) => b.id !== id));
        toast.success("Board Member deleted successfully!");
      } catch (err) {
        console.error("Delete error:", err.message);
        toast.error(err.message);
      }
    }
  };

  return (
    <>
      <GoToTop />
      <ToastContainer />
      <div className="main-wrapper">
        <Sidebar />
        <div className="page-wrapper">
          <div className="content">
            <div className="row">
              <div className="col-md-7 col-lg-8">
                <div className="section-title" data-aos="fade-left">
                  <h2
                    style={{
                      fontWeight: "bold",
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    BOARD MEMBERS
                  </h2>
                </div>
              </div>

              <div className="col-md-5 col-lg-4">
                <div className="d-flex justify-content-center gap-2">
                  {/* ✅ Select year filter */}
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                  >
                    <option value="2023-24">2023-24</option>
                    <option value="2024-25">2024-25</option>
                    <option value="2025-26">2025-26</option>
                    <option value="2026-27">2026-27</option>
                  </select>
                  <Button
                    color="blue"
                    size="small"
                    style={{ height: "45px", marginTop: "5px" }}
                    onClick={() => navigate("/add-board-member")}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>

            {loading ? (
              <LoaderComponent message={"Fetching, Please wait..."} />
            ) : (
              <>
                <div
                  className="d-flex flex-wrap justify-content-left"
                  style={{ gap: "20px" }}
                >
                  {boards && boards.length > 0 ? (
                    boards.map((data) => (
                      <Card
                        key={data.id}
                        style={{
                          textAlign: "center",
                          width: "220px",
                          flex: "1 1 220px",
                          maxWidth: "250px",
                        }}
                      >
                        <img
                          className="img-fluid"
                          src={data.img}
                          alt=""
                          style={{ objectFit: "cover", aspectRatio: "1 / 1" }}
                        />

                        <Card.Content>
                          <Card.Header
                            style={{
                              textTransform: "uppercase",
                              fontSize: "15px",
                            }}
                          >
                            {data.name}
                          </Card.Header>
                          <Card.Meta>
                            <span
                              className="position"
                              style={{ fontSize: "13px" }}
                            >
                              {data.position}
                            </span>
                          </Card.Meta>
                          <div className="mt-2">
                            <ButtonGroup size="tiny">
                              <Button
                                negative
                                icon="trash"
                                onClick={() =>
                                  handleDelete(data.id, data.file_path)
                                }
                              ></Button>

                              <Button
                             
                                onClick={() =>
                                  navigate(`/edit-board-member/${data.id}`)
                                }
                                icon="pencil"
                              ></Button>
                            </ButtonGroup>
                          </div>
                        </Card.Content>
                      </Card>
                    ))
                  ) : (
                    <p className="text-center" style={{ color: "red" }}>
                      No board members found for the <b>Academic Year {year}</b>
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Board;
