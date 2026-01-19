import React, { useState, useEffect } from "react";
import { Button, Form, Icon } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import GoToTop from "../../../GoToTop";
import { supabase } from "../../../supabase"; // supabase client
import Sidebar from "../components/Sidebar";
import NoImage from "../../assets/image/no-image.png";
import LoaderComponent from "../components/LoaderComponent";
import { toast, ToastContainer } from "react-toastify";
import imageCompression from "browser-image-compression"; // ✅ import

const initialState = {
  name: "",
  visibilty: "None",
  img: "",
  file_path: "",
  users: "",
};

const AddGallery = () => {
  const [data, setData] = useState(initialState);
  const { name, visibilty, users } = data;
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  // ✅ Preview on file select
  useEffect(() => {
    if (!file) {
      setPreview(NoImage);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  // ✅ Get logged-in user
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setData((prev) => ({ ...prev, users: user?.email || "anonymous" }));
    };
    getUser();
  }, []);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // ✅ Handle file select, compress & preview
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    try {
      const options = {
        maxSizeMB: 0.3, // ✅ ensures < 300KB
        maxWidthOrHeight: 1080,
        fileType: "image/webp", // ✅ convert to webp
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(selectedFile, options);
      setFile(compressedFile);

      const objectUrl = URL.createObjectURL(compressedFile);
      setPreview(objectUrl);
    } catch (err) {
      toast.error("Image compression failed!");
    }
  };

  const validate = () => {
    let errors = {};
    if (!name) errors.name = "Image title is required";
    if (!file) errors.file = "Please select an image";
    return errors;
  };

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    let errors = validate();
    if (Object.keys(errors).length) return setErrors(errors);
    setIsSubmit(true);

    try {
      // Upload file to Supabase storage
      const fileName = `${Date.now()}_${file.name.replace(
        /\.[^/.]+$/,
        ""
      )}.webp`; // ✅ force .webp
      const { error: uploadError } = await supabase.storage
        .from("gallery")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("gallery")
        .getPublicUrl(fileName);

      // Save to DB
      const { error } = await supabase.from("gallery").insert([
        {
          ...data,
          img: publicUrlData.publicUrl,
          file_path: fileName,
          users: user?.email || "anonymous",
        },
      ]);

      if (error) throw error;

      navigate(-1); // back to gallery
      setTimeout(() => {
        toast.success("Image uploaded successfully!");
      }, 1500);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmit(false);
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
            <div className="section-title" data-aos="fade-left">
              <h2
                style={{
                  fontWeight: "bold",
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                ADD IMAGE
              </h2>
            </div>

            {isSubmit ? (
              <LoaderComponent message={"Uploading Image. Please Wait..."} />
            ) : null}
            <div className="row mt-3">
              {/* Left: Preview */}
              <div className="col-lg-4 text-center mb-2">
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "280px",
                    border: "1.6px solid #e1e1e1ff",
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
                    src={preview || NoImage}
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
                    Choose Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                  </label>
                </div>
              </div>

              {/* Right: Form */}
              <div className="col-lg">
                <div className="ui card p-3 w-100">
                  <Form onSubmit={handleSubmit}>
                    {errors.file && (
                      <p style={{ color: "red" }}>{errors.file}</p>
                    )}

                    <Form.Input
                      error={errors.name ? { content: errors.name } : null}
                      label="Title"
                      name="name"
                      placeholder="Title"
                      maxLength="42"
                      onChange={handleChange}
                      value={name}
                    />

                    <Form.Field
                      label="Mainpage visibility"
                      name="visibilty"
                      control="select"
                      value={visibilty}
                      onChange={handleChange}
                    >
                      <option value="">--Select--</option>
                      <option value="None">Hide</option>
                      <option value="Visible">Show</option>
                    </Form.Field>

                    {/* Hidden user field */}
                    <Form.Input name="users" hidden readOnly value={users} />

                    <Button
                      color="blue"
                      type="submit"
                      icon
                      labelPosition="left"
                      size="small"
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

export default AddGallery;
