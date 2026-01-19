import React, { useState } from "react";
import { supabase } from "../../../supabase";
import { Button, Form, Icon, Image } from "semantic-ui-react";
import Sidebar from "../components/Sidebar";
import { toast, ToastContainer } from "react-toastify";
import GoToTop from "../../../GoToTop";
import imageCompression from "browser-image-compression";
import { useNavigate } from "react-router-dom";
import LoaderComponent from "../components/LoaderComponent";

function AddEvent() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("Online");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]); // File objects
  const [coverIndex, setCoverIndex] = useState(0); // index of cover image
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setImages([...images, ...Array.from(e.target.files)]);
    setCoverIndex(0);
  };

  const handleRemoveImage = (idx) => {
    setImages(images.filter((_, index) => index !== idx));
    // adjust coverIndex if needed
    if (coverIndex === idx) setCoverIndex(0);
    else if (coverIndex > idx) setCoverIndex(coverIndex - 1);
  };

  // Upload a single file and return its URL + path
  const uploadFile = async (file, eventId) => {
    const options = { maxSizeMB: 0.2, maxWidthOrHeight: 1920 };
    const compressedFile = await imageCompression(file, options);

    const filePath = `events/${eventId}/${compressedFile.name}`;
    const { error: uploadError } = await supabase.storage
      .from("events")
      .upload(filePath, compressedFile, { upsert: true });
    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage
      .from("events")
      .getPublicUrl(filePath);
    return { url: urlData.publicUrl, path: filePath };
  };

  const handleSubmit = async () => {
    if (!title || !date || !content || images.length === 0) {
      toast.error("Please fill all fields and upload at least one image");
      return;
    }

    setUploading(true);

    try {
      // 1️⃣ Insert event
      const { data: eventData, error: eventError } = await supabase
        .from("events")
        .insert([{ title, date, type, content }])
        .select()
        .single();
      if (eventError) throw eventError;

      const eventId = eventData.id;
      let coverUrl = "";
      let coverPath = "";

      // 2️⃣ Upload images and store paths + URLs
      for (let i = 0; i < images.length; i++) {
        const { url, path } = await uploadFile(images[i], eventId);

        // Set cover image info
        if (i === coverIndex) {
          coverUrl = url;
          coverPath = path;
        }

        // Insert each image record
        const { error: imgError } = await supabase.from("event_images").insert([
          {
            event_id: eventId,
            url,
            path,
            is_cover: i === coverIndex,
          },
        ]);
        if (imgError) throw imgError;
      }

      // 3️⃣ Update event table with cover image
      const { error: updateError } = await supabase
        .from("events")
        .update({ cover_url: coverUrl, cover_path: coverPath })
        .eq("id", eventId);
      if (updateError) throw updateError;

      toast.success("Event added successfully!");
      navigate(-1);

      // Reset form
      setTitle("");
      setDate("");
      setType("Online");
      setContent("");
      setImages([]);
      setCoverIndex(0);
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setUploading(false);
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
                ADD EVENT
              </h2>
            </div>

            {uploading ? (
              <LoaderComponent message={"Adding Data. Please wait..."} />
            ) : null}
            <Form>
              <div className="row mt-3">
                <div className="col-md-4">
                  <div className="ui card p-3 w-100">
                    <Form.Input
                      type="file"
                      multiple
                      label="Upload Images"
                      onChange={handleImageChange}
                    />
                    {images.length > 0 && (
                      <div style={{ marginTop: "10px" }}>
                        <p className="mb-2">Preview & Select Cover:</p>
                        <div
                          style={{
                            display: "flex",
                            gap: "5px",
                            flexWrap: "wrap",
                          }}
                        >
                          {images.map((img, idx) => (
                            <div
                              key={idx}
                              style={{
                                border:
                                  idx === coverIndex
                                    ? "3px solid orange"
                                    : "1px solid #ccc",
                                padding: "0px",
                                cursor: "pointer",
                                position: "relative",
                              }}
                            >
                              <Image
                                src={URL.createObjectURL(img)}
                                style={{
                                  height: "93px",
                                  aspectRatio: "5/4",
                                  objectFit: "cover",
                                }}
                                onClick={() => setCoverIndex(idx)}
                              />
                              {idx === coverIndex && (
                                <span
                                  style={{
                                    color: "orange",
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    background: "white",
                                    padding: "0 4px",
                                  }}
                                >
                                  Cover
                                </span>
                              )}
                              <Button
                                size="mini"
                                icon="trash"
                                color="red"
                                style={{
                                  position: "absolute",
                                  top: "2px",
                                  right: 0,
                                }}
                                onClick={() => handleRemoveImage(idx)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-md-8">
                  <div className="ui card p-3 w-100">
                    <Form.Input
                      label="Event Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                    <div className="row">
                      <div className="col-6 mb-3">
                        <Form.Input
                          type="date"
                          label="Event Date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                        />
                      </div>
                      <div className="col-6 mb-3">
                        <Form.Select
                          label="Event Type"
                          options={[
                            { key: "o", value: "Online", text: "Online" },
                            { key: "f", value: "Offline", text: "Offline" },
                          ]}
                          value={type}
                          onChange={(e, { value }) => setType(value)}
                        />
                      </div>
                    </div>
                    <Form.TextArea
                      label="Content"
                      style={{ height: "35vh" }}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                  </div>
                  <Button
                    color="blue"
                    icon
                    labelPosition="left"
                    size="small"
                    type="submit"
                    onClick={handleSubmit}
                    style={{ marginTop: "10px" }}
                    loading={uploading}
                  >
                    <Icon name="save" /> Save
                  </Button>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddEvent;
