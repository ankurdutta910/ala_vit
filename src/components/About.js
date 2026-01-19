import React, { useState, useEffect } from "react";
import GoToTop from "../GoToTop";
import aboutus from "./assets/image/1.webp";

function About() {
  return (
    <>
      <GoToTop />

      <section
        id="contactus"
        style={{
          width: "100%",
          background:
            'url("https://firebasestorage.googleapis.com/v0/b/website-e921e.appspot.com/o/cover.jpg?alt=media&token=b9051e5a-239d-485b-84c1-9d37795a48ff") top center',
          backgroundSize: "cover",
          backgroundPosition: "50% 15%",
          position: "relative",
        }}
        className="d-flex align-items-center justify-content-center"
      >
        <div className="container" style={{ marginBottom: "30px" }}>
          <div
            className="row justify-content-center"
            data-aos="fade-up"
            data-aos-delay="150"
          >
            <div className="col-xl-12 col-lg-8">
              <h1>About Us</h1>
              <h2>Enajori- The Assamese Literary Association</h2>
            </div>
          </div>
        </div>
      </section>

      <div
        className="container-fluid mt-5"
        style={{ maxWidth: "190vh" }}
      >
        <div
          className="row"
         
        >
          <div className="col-lg-7" id="con">
            <h2
              style={{
                fontWeight: "bold",
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              WHO WE ARE
            </h2>

            <p
              className="mt-3"
              style={{ textAlign: "justify", fontSize: "14px", lineHeight:'25px' }}
            >
              "Enajori" is a wonderful Assamese word that encapsulates an
              invisible yet powerful connection of love, affection, and care.
              Enajori- Assamese Literary Association is a Literary Club that is
              functioning under Office of Students’ Welfare, Vellore Institute
              of Technology, Vellore, Tamilnadu. The association is dedicated to
              fostering these bonds among students through literature and
              language. It hosts various events, such as literary affairs,
              seminars, contests, magazines, and newsletters, to promote the
              Assamese language and inspire college students to explore and
              appreciate its rich cultural heritage.
              <br />
              <img
                src={aboutus}
                alt="aboutus"
                style={{ borderRadius: "10px" }}
                className="aboutusImg2 img-fluid my-3"
              />
              <br />
              Through active participation in these events, students not only
              enhance their language skills but also form close connections with
              like-minded individuals who share their enthusiasm for Assamese
              literature and culture. Joining this university-level club
              provides a unique opportunity for students to broaden their
              horizons and immerse themselves in the rich cultural heritage of
              Assam while also strengthening their ties with their peers.
            </p>
          </div>
          <div className="col-lg-5 mt-5">
            <img
              src={aboutus}
              alt="aboutus"
              style={{ borderRadius: "10px" }}
              className="aboutusImg1 img-fluid"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default About;
