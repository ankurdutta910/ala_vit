import React, { useState, useEffect } from "react";
import { Button, Form, Loader, Icon, Message } from "semantic-ui-react";
import { supabase } from "../../../supabase";
import { useNavigate, useParams } from "react-router-dom";
import GoToTop from "../../../GoToTop";
import Sidebar from "../components/Sidebar";
import LoaderComponent from "../components/LoaderComponent";

const initialState = {
  name: "",
  position: "",
  year: "",
  img: "",
  file_path: "",
};

const EditBoard = () => {
  const [data, setData] = useState(initialState);
  const { name, position, year } = data;
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [progress, setProgress] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [globalError, setGlobalError] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  const handleChange = (e, { name, value }) => {
    setData({ ...data, [name]: value });
  };

  const validate = () => {
    let errors = {};
    if (!name) errors.name = "Name is required";
    if (!position) errors.position = "Position is required";
    if (!year) errors.year = "Year is required";
    return errors;
  };

  // ✅ Handle file select with size check
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 1024 * 1024) {
        setGlobalError("File size must be less than 1 MB");
        setFile(null);
        setPreview("");
        return;
      }
      setGlobalError("");
      setFile(selectedFile);
    }
  };

  // ✅ Preview selected file
  useEffect(() => {
    if (!file) {
      setPreview("");
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  // ✅ Fetch existing board data
  useEffect(() => {
    const fetchBoard = async () => {
      const { data: board, error } = await supabase
        .from("board")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Fetch error:", error.message);
        setLoading(false);
      } else {
        setData(board);
        setLoading(false);
      }
    };
    fetchBoard();
  }, [id]);

  // ✅ Upload new file
  const uploadFile = async (newFile) => {
    const fileName = `${Date.now()}_${newFile.name}`;
    const { error: uploadError } = await supabase.storage
      .from("board")
      .upload(fileName, newFile);

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from("board").getPublicUrl(fileName);

    return { img: publicUrl, file_path: fileName };
  };

  // ✅ Handle update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError("");
    let errors = validate();
    if (Object.keys(errors).length) return setErrors(errors);
    setIsSubmit(true);

    try {
      let uploadData = {};

      if (file) {
        // 1. Delete old file if exists
        if (data.file_path) {
          await supabase.storage.from("board").remove([data.file_path]);
        }

        // 2. Upload new file
        uploadData = await uploadFile(file);
      }

      // 3. Update row
      const { error } = await supabase
        .from("board")
        .update({
          ...data,
          ...uploadData,
        })
        .eq("id", id);

      if (error) throw error;

      navigate(-1);
    } catch (err) {
      setGlobalError("Failed to update. Please try again.");
      setIsSubmit(false);
    }
  };

  // ✅ Year options
  const currentYear = new Date().getFullYear();
  const startYear = 2023;
  const endYear = currentYear + 2;

  const yearOptions = [];
  for (let y = startYear; y <= endYear; y++) {
    yearOptions.push({
      key: y,
      text: `${y}-${(y + 1).toString().slice(-2)}`,
      value: `${y}-${(y + 1).toString().slice(-2)}`,
    });
  }

  return (
    <>
      <GoToTop />
      <div className="main-wrapper">
        <Sidebar />
        <div className="page-wrapper">
          <div className="content">
            {isSubmit ? (
              <LoaderComponent message={"Updating Data. Please Wait..."} />
            ) : null}

            {loading ? (
              <LoaderComponent message={"Fetching Data. Please Wait..."} />
            ) : null}

            <div className="section-title" data-aos="fade-left">
              <h2
                style={{
                  fontWeight: "bold",
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                UPDATE MEMBER
              </h2>
            </div>

            <div className="row mt-3">
              <div className="col-lg-4 text-center">
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "400px",
                    border: "1.6px solid #e1e1e1",
                    borderRadius: "6px",
                    backgroundColor: "white",
                    overflow: "hidden",
                  }}
                >
                  <img
                    className="img-fluid"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    src={
                      preview || data.img || "https://via.placeholder.com/300"
                    }
                    alt="Preview"
                  />

                  {/* ✅ Overlay Upload */}
                  <label
                    style={{
                      position: "absolute",
                      bottom: "10px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "rgba(0,0,0,0.6)",
                      color: "white",
                      padding: "6px 12px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                  >
                    Change Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                  </label>
                </div>
              </div>

              <div className="col-lg-8 my-2">
                {globalError && (
                  <Message negative>
                    <Message.Header>Error</Message.Header>
                    <p>{globalError}</p>
                  </Message>
                )}
                <div className="ui card w-100 p-4">
                  <Form onSubmit={handleSubmit}>
                    <Form.Input
                      error={errors.name ? { content: errors.name } : null}
                      label="Name"
                      name="name"
                      placeholder="Name"
                      onChange={(e) =>
                        setData({ ...data, name: e.target.value })
                      }
                      value={name}
                    />

                    <div className="row mb-3">
                      <div className="col-sm-6 mt-2">
                        <Form.Input
                          error={
                            errors.position
                              ? { content: errors.position }
                              : null
                          }
                          label="Designation"
                          name="position"
                          placeholder="Position"
                          onChange={(e) =>
                            setData({ ...data, position: e.target.value })
                          }
                          value={position}
                        />
                      </div>
                      <div className="col-sm-6 mt-2">
                        <Form.Select
                          error={errors.year ? { content: errors.year } : null}
                          label="Year"
                          name="year"
                          placeholder="Select Year"
                          options={yearOptions}
                          onChange={handleChange}
                          value={year}
                        />
                      </div>
                    </div>

                    <Button
                      color="blue"
                      icon
                      labelPosition="left"
                      size="small"
                      type="submit"
                      disabled={progress !== null && progress < 100}
                    >
                      <Icon name="save" /> Save
                    </Button>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditBoard;
