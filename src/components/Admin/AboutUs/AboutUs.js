import React, { useState, useEffect } from "react";
import { Button , Icon} from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { onSnapshot } from "firebase/firestore";
import { collection,} from "firebase/firestore";
import GoToTop from '../../../GoToTop'


function AboutUs() {
     const [abouts, setAbouts] = useState([]);
    //  const [about, setBoard] = useState({});
    //  const [open, setOpen] = useState(false);
     const [loading, setLoading] = useState(false);
     const navigate = useNavigate();

     useEffect(() => {
          const unsub = onSnapshot(collection(db, "about"), (snapshot) => {
               let list = [];
               snapshot.docs.forEach((doc) => {
                    list.push({id: doc.id, ...doc.data()})
               });
               setAbouts(list);
               setLoading(false)

          },
          
          (error)=>{
               console.error(error);
          });
return() =>{
     unsub();
}
     }, []);




  return (
    <>    <GoToTop />

        <div className="container" style={{ maxWidth: "200vh", marginTop: "15vh" }}>

        
          <div className="section-title" data-aos="fade-left">
            <h2
              style={{
                fontWeight: "bold",
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              ABOUT US
            </h2>
          </div>


          <div className="row">


          {abouts && abouts.map((item) => (
                  <div className="col-lg"  style={{ marginTop: "20px" }}
                  id="imggg" key={item.id}>

              {/* <p>
                <img className="img-fluid" style={{border: '1px solid grey'}} src={item.img} alt="" id="picteam"/>
              </p> */}
              <p style={{fontSize: '15px'}}>{item.pa}</p>
              <p style={{fontSize: '15px'}}>{item.pb}</p>
                   <p style={{fontSize: '15px'}}>{item.pc}</p>
             {/* <h3>{item.name}</h3> */}
            
       
             <Button icon labelPosition='left' size='small' color="grey" onClick={() => navigate(`/editaboutus/${item.id}`)}><Icon name='pencil'/> Update</Button>
        
                   <hr></hr>
                  </div>
                ))}


        
          </div>
        </div>
 
    </>
  )
}

export default AboutUs
