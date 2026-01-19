import React, { useState, useEffect } from "react";
import { Button, Form, Icon } from "semantic-ui-react";
import { useParams, useNavigate } from "react-router-dom";
import GoToTop from "../../../GoToTop";
import { supabase } from "../../../supabase"; // supabase client
import Sidebar from "../components/Sidebar";
import NoImage from "../../assets/image/no-image.png";
import LoaderComponent from "../components/LoaderComponent";
import { toast, ToastContainer } from "react-toastify";
import imageCompression from "browser-image-compression"; // ✅ import

const EditGallery = () => {
  const [data, setData] = useState({
    name: "",
    visibilty: "None",
    img: "",
    file_path: "",
    users: "",
  });

  const { name, visibilty, img, users } = data;
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(NoImage);
  const [errors, setErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();

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

  // ✅ Fetch single image for edit
  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      const { data: photo, error } = await supabase
        .from("gallery")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        setLoading(false);
        console.error("Fetch error:", error.message);
      } else if (photo) {
        setData(photo);
        setLoading(false);
        setPreview(photo.img || NoImage);
      }
    };
    fetchData();
  }, [id]);

  // ✅ Handle file select + compress + convert to webp
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    try {
      const options = {
        maxSizeMB: 0.3, // ✅ ensures < 300KB
        maxWidthOrHeight: 1200, // ✅ resize
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

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let errors = {};
    if (!name) errors.name = "Image title is required";
    return errors;
  };

  // ✅ Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    let errors = validate();
    if (Object.keys(errors).length) return setErrors(errors);
    setIsSubmit(true);

    try {
      let imageUrl = img;
      let filePath = data.file_path;

      // If user selected a new file, upload it
      if (file) {
        const fileName = `${Date.now()}_${file.name.replace(/\.[^/.]+$/, "")}.webp`; // ✅ enforce .webp
        const { error: uploadError } = await supabase.storage
          .from("gallery")
          .upload(fileName, file, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("gallery")
          .getPublicUrl(fileName);

        imageUrl = publicUrlData.publicUrl;
        filePath = fileName;
      }

      // ✅ Update existing record
      const { error } = await supabase
        .from("gallery")
        .update({
          name,
          visibilty,
          img: imageUrl,
          file_path: filePath,
          users: user?.email || "anonymous",
        })
        .eq("id", id);

      if (error) throw error;

      navigate(-1); // back to gallery
      setTimeout(() => {
        toast.success("Image updated successfully!");
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
                EDIT IMAGE
              </h2>
            </div>

            {isSubmit && (
              <LoaderComponent message="Updating Image. Please wait..." />
            )}
            {loading && <LoaderComponent message="Fetching Please wait..." />}

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

                  {/* Upload overlay */}
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

              {/* Right: Form */}
              <div className="col-lg">
                <div className="ui card p-3 w-100">
                  <Form onSubmit={handleSubmit}>
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
                      <Icon name="save" /> Update
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

export default EditGallery;
