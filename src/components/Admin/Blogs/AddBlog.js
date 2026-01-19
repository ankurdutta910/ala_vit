import React, { useState, useEffect } from "react";
import { Button, Form, Icon, Card, Image } from "semantic-ui-react";
import { useParams, useNavigate } from "react-router-dom";
import GoToTop from "../../../GoToTop";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { supabase } from "../../../supabase";
import { toast, ToastContainer } from "react-toastify";
import Sidebar from "../components/Sidebar";
import LoaderComponent from "../components/LoaderComponent";
import imageCompression from "browser-image-compression";
import NoImage from "../../assets/image/no-image.png";

const initialState = {
  title: "",
  author: "",
  cover_img: "",
  content: "",
  approval: "1",
};

const AddBlog = () => {
  const [data, setData] = useState(initialState);
  const { title, cover_img, author, content, approval } = data;
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch blog if editing
  useEffect(() => {
    id && getSingleBlog();
  }, [id]);

  const getSingleBlog = async () => {
    const { data: blog, error } = await supabase
      .from("blogs")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(error.message);
    } else if (blog) {
      setData(blog);
    }
  };

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setData({ ...data, cover_img: URL.createObjectURL(selectedFile) }); // preview
    }
  };

  const validate = () => {
    let errors = {};
    if (!title) errors.title = "Title is required";
    if (!author) errors.author = "Author is required";
    if (!content) errors.content = "Content is required";
    if (!file && !cover_img) errors.cover_img = "Image is required";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errors = validate();
    if (Object.keys(errors).length) return setErrors(errors);
    setIsSubmit(true);

    let uploadedFileName = null;
    try {
      let imageUrl = cover_img;
      let imagePath = null; // store Supabase path

      // ✅ Upload image first (if file selected)
      if (file) {
        const options = {
          maxSizeMB: 0.3,
          maxWidthOrHeight: 1080,
          fileType: "image/webp",
          initialQuality: 0.7,
          useWebWorker: true,
        };

        const compressedFile = await imageCompression(file, options);
        if (compressedFile.size > 300 * 1024) {
          toast.error(
            "Image is still larger than 300KB. Please choose a smaller image."
          );
          setIsSubmit(false);
          return;
        }

        const fileName = `${Date.now()}_${file.name.split(".")[0]}.webp`;

        const { error: uploadError } = await supabase.storage
          .from("blogs-images")
          .upload(fileName, compressedFile, { upsert: true });

        if (uploadError) throw uploadError;

        uploadedFileName = fileName;
        imagePath = fileName; // store file path in DB

        const { data: publicUrlData } = supabase.storage
          .from("blogs-images")
          .getPublicUrl(fileName);

        imageUrl = publicUrlData.publicUrl; // public URL for frontend
      }

      // ✅ Insert / Update blog in DB with both values
      let error;
      if (!id) {
        ({ error } = await supabase.from("blogs").insert([
          {
            title,
            cover_img: imageUrl, // Public URL
            cover_img_path: imagePath, // File path in storage
            author,
            content,
            approval: Number(approval),
          },
        ]));
        if (error) throw error;
        toast.success("Blog added successfully!");
      } else {
        ({ error } = await supabase
          .from("blogs")
          .update({
            title,
            cover_img: imageUrl,
            cover_img_path: imagePath || data.cover_img_path, // keep old if no new file
            author,
            content,
            approval: Number(approval),
          })
          .eq("id", id));
        if (error) throw error;
        toast.success("Blog updated successfully!");
      }

      navigate(-1);
    } catch (error) {
      toast.error(error.message);

      // Rollback uploaded file if DB fails
      if (uploadedFileName) {
        await supabase.storage.from("blogs-images").remove([uploadedFileName]);
        console.warn("Rolled back uploaded image:", uploadedFileName);
      }
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
            {isSubmit ? (
              <LoaderComponent message={"Saving to Database. Please Wait..."} />
            ) : null}

            <div className="section-title" data-aos="fade-left">
              <h2
                style={{
                  fontWeight: "bold",
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                ADD BLOG
              </h2>
            </div>

            <Form onSubmit={handleSubmit}>
              <div className="row mt-3">
                <div className="col-lg-4 mb-2">
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
                      src={cover_img || NoImage}
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
                        border: "1px solid white",
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

                  <Form.Input name="approval" hidden value={approval} />
                </div>

                <div className="col-lg-8">
                  <div className="ui card p-3 w-100">
                    <div className="row mb-3">
                      <div className="col-8">
                        <Form.Input
                          error={
                            errors.title ? { content: errors.title } : null
                          }
                          label="Title"
                          name="title"
                          placeholder="Title"
                          onChange={handleChange}
                          value={title}
                        />
                      </div>
                      <div className="col-4">
                        <Form.Input
                          error={
                            errors.author ? { content: errors.author } : null
                          }
                          label="Author"
                          name="author"
                          placeholder="Author"
                          onChange={handleChange}
                          value={author}
                        />
                      </div>
                    </div>

                    <ReactQuill
                      theme="snow"
                      style={{ height: "40vh" }}
                      value={content}
                      onChange={(val) => setData({ ...data, content: val })}
                    />

                    <br />
                    <br />
                  </div>
                  <Button
                    color="blue"
                    icon
                    labelPosition="left"
                    size="small"
                    type="submit"
                  >
                    <Icon name="upload" /> Submit
                  </Button>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddBlog;
