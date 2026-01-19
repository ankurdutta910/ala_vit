import React, { useState, useEffect } from "react";
import { Button, Form, Loader, Icon } from "semantic-ui-react";
import { db } from "../firebase";
import { useParams, useNavigate } from "react-router-dom";
import GoToTop from '../../../GoToTop'

// import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import {
  addDoc,
  updateDoc,
  doc,
  collection,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";

const initialState = {
  pa: "",
  pb: "",
  pc: "",
};

const EditAboutUs = () => {
  const [data, setData] = useState(initialState);
  const { name, pa, pb, pc } = data;
  // const [file, setFile] = useState(null);
  // const [progress, setProgress] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    id && getSingleBoard();
  }, [id]);

  const getSingleBoard = async () => {
    const docRef = doc(db, "about", id);
    const snapshot = await getDoc(docRef, "about");
    if (snapshot.exists()) {
      setData({ ...snapshot.data() });
    }
  };

  // useEffect(() => {
  //   const uploadFile = () => {
  //     const name = new Date().getTime + file.name;
  //     const storageRef = ref(storage, `board/${file.name}`);

  //     const uploadTask = uploadBytesResumable(storageRef, file);

  //     uploadTask.on(
  //       "state_changed",
  //       (snapshot) => {
  //         const progress =
  //           (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //         setProgress(progress);
  //         switch (snapshot.state) {
  //           case "paused":
  //             console.log("Upload is paused");
  //             break;

  //           case "running":
  //             console.log("Upload is running");
  //             break;
  //           default:
  //             break;
  //         }
  //       },
  //       (error) => {
  //         console.log(error);
  //       },
  //       () => {
  //         getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
  //           setData((prev) => ({ ...prev, img: downloadURL }));
  //         });
  //       }
  //     );
  //   };
  //   file && uploadFile();
  // }, [file]);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let errors = {};
    if (!pa) {
      errors.pa = "Paragraph 1 is required";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errors = validate();
    if (Object.keys(errors).length) return setErrors(errors);
    setIsSubmit(true);
    if (!id) {
      try {
        await addDoc(collection(db, "about"), {
          ...data,

          timestamp: serverTimestamp(),
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        await updateDoc(doc(db, "about", id), {
          ...data,

          timestamp: serverTimestamp(),
        });
      } catch (error) {
        console.log(error);
      }
    }

    navigate(-1);
  };

  return (
    <>  <GoToTop />
      <div className="container" style={{ marginTop: "15vh" }}>
        <div>
          {isSubmit ? (
            <Loader active inline="centered" size="huge" />
          ) : (
            <>
              <h2>{id ? "UPDATE" : "ADD"} ABOUT US</h2>
              <Form onSubmit={handleSubmit}>
             

                <Form.TextArea
                  error={errors.pa ? { content: errors.pa } : null}
                 
                  name="pa"
                  placeholder="Paragraph 1"
                 style={{height: '18vh'}}
                  onChange={handleChange}
                  value={pa}
                />

<Form.TextArea
                  error={errors.pb ? { content: errors.pb } : null}
                
                  name="pb"
                  placeholder="Paragraph 2"
                  style={{height: '18vh'}}
                  onChange={handleChange}
                  value={pb}
                />

<Form.TextArea
                  error={errors.pc ? { content: errors.pc } : null}
                  style={{height: '18vh'}}
                  name="pc"
                  placeholder="Paragraph 3"
                  onChange={handleChange}
                  value={pc}
                />

             
                {/* <Form.Input
                  label="Image upload"
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                ></Form.Input> */}

<Button icon labelPosition='left' size='small' 
             color="green"
              type="submit"
            >
               <Icon name='save'/> Save
            </Button>

         
              </Form>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default EditAboutUs;
