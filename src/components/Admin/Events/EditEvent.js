import React, { useState, useEffect } from "react";
import { supabase } from "../../../supabase";
import { Button, Form, Icon, Image } from "semantic-ui-react";
import Sidebar from "../components/Sidebar";
import { toast, ToastContainer } from "react-toastify";
import GoToTop from "../../../GoToTop";
import imageCompression from "browser-image-compression";
import { useNavigate, useParams } from "react-router-dom";
import LoaderComponent from "../components/LoaderComponent";

function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("Online");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]); // mix of old + new
  const [coverIndex, setCoverIndex] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch existing event + images
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const { data: eventData, error: eventError } = await supabase
          .from("events")
          .select("*")
          .eq("id", id)
          .single();
        if (eventError) throw eventError;

        setTitle(eventData.title);
        setDate(eventData.date);
        setType(eventData.type);
        setContent(eventData.content);

        const { data: imgs, error: imgError } = await supabase
          .from("event_images")
          .select("*")
          .eq("event_id", id);
        if (imgError) throw imgError;

        // Keep both old + new images in one array
        setImages(imgs.map((img) => ({ ...img, isNew: false })));

        const coverIdx = imgs.findIndex((img) => img.is_cover);
        setCoverIndex(coverIdx >= 0 ? coverIdx : 0);
      } catch (err) {
        console.error(err);
        toast.error("Error fetching event data");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  // 🔹 Handle new image selection
  const handleImageChange = (e) => {
    const newFiles = Array.from(e.target.files).map((file) => ({
      file,
      isNew: true,
    }));
    setImages([...images, ...newFiles]);
  };

  // 🔹 Remove an image (old → delete from storage & DB, new → just from state)
  const handleRemoveImage = async (idx) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;

    const img = images[idx];

    if (!img.isNew) {
      // delete from storage
      const { error: storageError } = await supabase.storage
        .from("events")
        .remove([img.path]);
      if (storageError) {
        toast.error("Error deleting image from storage");
        return;
      }

      // delete from DB
      const { error: dbError } = await supabase
        .from("event_images")
        .delete()
        .eq("id", img.id);
      if (dbError) {
        toast.error("Error deleting image record");
        return;
      }
    }

    // remove from state
    const updated = [...images];
    updated.splice(idx, 1);
    setImages(updated);

    // adjust cover
    if (coverIndex === idx) setCoverIndex(0);
    else if (coverIndex > idx) setCoverIndex(coverIndex - 1);
  };

  // 🔹 Upload a new image file
  const uploadFile = async (file, eventId) => {
    const options = { maxSizeMB: 0.2, maxWidthOrHeight: 1920 };
    const compressedFile = await imageCompression(file, options);

    const filePath = `events/${eventId}/${Date.now()}-${compressedFile.name}`;
    const { error: uploadError } = await supabase.storage
      .from("events")
      .upload(filePath, compressedFile, { upsert: true });
    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage
      .from("events")
      .getPublicUrl(filePath);
    return { url: urlData.publicUrl, path: filePath };
  };

  // 🔹 Submit updated event
  const handleSubmit = async () => {
    if (!title || !date || !content || images.length === 0) {
      toast.error("Please fill all fields and upload at least one image");
      return;
    }

    setUploading(true);

    try {
      // 1️⃣ Update event info
      const { error: updateError } = await supabase
        .from("events")
        .update({ title, date, type, content })
        .eq("id", id);
      if (updateError) throw updateError;

      let coverUrl = "";
      let coverPath = "";

      // 2️⃣ Handle images
      for (let i = 0; i < images.length; i++) {
        const img = images[i];

        if (img.isNew) {
          // Upload new image
          const { url, path } = await uploadFile(img.file, id);

          if (i === coverIndex) {
            coverUrl = url;
            coverPath = path;
          }

          const { error: imgError } = await supabase
            .from("event_images")
            .insert([
              {
                event_id: id,
                url,
                path,
                is_cover: i === coverIndex,
              },
            ]);
          if (imgError) throw imgError;
        } else {
          // Existing image → just update cover flag
          if (i === coverIndex) {
            coverUrl = img.url;
            coverPath = img.path;
          }

          const { error: updateImgError } = await supabase
            .from("event_images")
            .update({ is_cover: i === coverIndex })
            .eq("id", img.id);
          if (updateImgError) throw updateImgError;
        }
      }

      // 3️⃣ Update event cover
      const { error: coverError } = await supabase
        .from("events")
        .update({ cover_url: coverUrl, cover_path: coverPath })
        .eq("id", id);
      if (coverError) throw coverError;

      toast.success("Event updated successfully!");
      navigate(-1);
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
                EDIT EVENT
              </h2>
            </div>
            {loading ? (
              <LoaderComponent message={"Fetching Data. Please wait..."} />
            ) : null}

            {uploading ? (
              <LoaderComponent message={"Updating Data. Please wait..."} />
            ) : null}
            <Form>
              <div className="row mt-3">
                <div className="col-md-4">
                  <div className="ui card p-3 w-100">
                    <Form.Input
                      type="file"
                      multiple
                      onChange={handleImageChange}
                      label="Add Images"
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
                                src={
                                  img.isNew
                                    ? URL.createObjectURL(img.file)
                                    : img.url
                                }
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

export default EditEvent;
