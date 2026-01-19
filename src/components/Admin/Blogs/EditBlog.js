import React, { useState, useEffect } from "react";
import { Button, Form, Icon } from "semantic-ui-react";
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

const EditBlog = () => {
  const [data, setData] = useState({
    title: "",
    author: "",
    cover_img: "",
    cover_img_path: "",
    content: "",
    approval: "0",
  });
  const { title, author, cover_img, cover_img_path, content, approval } = data;

  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  // ✅ Fetch existing blog
  useEffect(() => {
    const fetchBlog = async () => {
      const { data: blog, error } = await supabase
        .from("blogs")
        .select(
          "id, title, author, cover_img, cover_img_path, content, approval"
        )
        .eq("id", id)
        .single();

      if (error) {
        setLoading(false)
        console.error(error.message);
        toast.error(error.message);
      } else if (blog) {
        setLoading(false)
        setData({
          title: blog.title ?? "",
          author: blog.author ?? "",
          cover_img: blog.cover_img ?? "",
          cover_img_path: blog.cover_img_path ?? "",
          content: blog.content ?? "",
          approval: blog.approval?.toString() ?? "0",
        });
      }
    };
    fetchBlog();
  }, [id]);

  // ✅ File change (preview + set for upload)
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // show local preview without overriding DB url
      setData((prev) => ({
        ...prev,
        cover_img: URL.createObjectURL(selectedFile),
      }));
    }
  };

  // ✅ Input changes
  const handleChange = (e) => {
    setData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ✅ Validation
  const validate = () => {
    let errors = {};
    if (!title.trim()) errors.title = "Title is required";
    if (!author.trim()) errors.author = "Author is required";
    if (!content.trim()) errors.content = "Content is required";
    return errors;
  };

  // ✅ Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    let errors = validate();
    if (Object.keys(errors).length) return setErrors(errors);
    setIsSubmit(true);

    let newFileName = null;
    try {
      let imageUrl = data.cover_img;
      let imagePath = data.cover_img_path;

      if (file) {
        // compress
        const options = {
          maxSizeMB: 0.3,
          maxWidthOrHeight: 1080,
          fileType: "image/webp",
          initialQuality: 0.7,
          useWebWorker: true,
        };

        const compressedFile = await imageCompression(file, options);
        if (compressedFile.size > 300 * 1024) {
          toast.error("Image must be below 300KB.");
          setIsSubmit(false);
          return;
        }

        // delete old image if exists
        if (imagePath) {
          await supabase.storage.from("blogs-images").remove([imagePath]);
        }

        // upload new
        newFileName = `${Date.now()}_${file.name.split(".")[0]}.webp`;
        const { error: uploadError } = await supabase.storage
          .from("blogs-images")
          .upload(newFileName, compressedFile, { upsert: true });
        if (uploadError) throw uploadError;

        imagePath = newFileName;
        const { data: publicUrlData } = supabase.storage
          .from("blogs-images")
          .getPublicUrl(newFileName);
        imageUrl = publicUrlData.publicUrl;
      }

      const { error } = await supabase
        .from("blogs")
        .update({
          title,
          author,
          content,
          approval: Number(approval),
          cover_img: imageUrl,
          cover_img_path: imagePath,
        })
        .eq("id", id);

      if (error) throw error;

      toast.success("Blog updated successfully!");
      navigate(-1);
    } catch (err) {
      toast.error(err.message);
      if (newFileName) {
        await supabase.storage.from("blogs-images").remove([newFileName]);
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
            {isSubmit && (
              <LoaderComponent message="Updating Blog. Please wait..." />
            )}

              {loading && (
              <LoaderComponent message="Fetching Data. Please wait..." />
            )}

            <div className="section-title" data-aos="fade-left">
              <h2
                style={{
                  fontWeight: "bold",
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                EDIT BLOG
              </h2>
            </div>

            <Form onSubmit={handleSubmit}>
              <div className="row mt-3">
                {/* Cover Image */}
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
                      Replace Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                      />
                    </label>
                  </div>
                </div>

                {/* Form Inputs */}
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
                          value={title || ""}
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
                          value={author || ""}
                        />
                      </div>
                    </div>

                    {/* ✅ Content editor */}
                    <ReactQuill
                      theme="snow"
                      style={{ height: "35vh" }}
                      value={content || ""}
                      onChange={(val) =>
                        setData((prev) => ({ ...prev, content: val }))
                      }
                    />
                    <br/>
                    <br/>
                    <br/>

                    {/* ✅ Approval Dropdown */}
                    <Form.Select
                      label="Approval Status"
                      name="approval"
                      value={approval}
                      options={[
                        { key: "0", text: "Pending", value: "0" },
                        { key: "1", text: "Approved", value: "1" },
                        { key: "2", text: "Rejected", value: "2" },
                      ]}
                      onChange={(e, { value }) =>
                        setData((prev) => ({ ...prev, approval: value }))
                      }
                    />
                  </div>

                  <Button
                    color="blue"
                    icon
                    labelPosition="left"
                    size="small"
                    type="submit"
                  >
                    <Icon name="save" /> Update Blog
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

export default EditBlog;
