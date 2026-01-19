import React from "react";
import GoToTop from "../../GoToTop";
import Nav from "./Nav";
function Anthem() {
  return (
    <>
      <GoToTop />
      <section
        id="assamtopp"
        className="d-flex align-items-center justify-content-center"
      >
        <div className="container" style={{ marginBottom: "30px" }}>
          <div
            className="row justify-content-center"
            data-aos="fade-up"
            data-aos-delay="150"
          >
            <div className="col-xl-12 col-lg-8">
              <h1>ASSAM</h1>
            </div>
          </div>
        </div>
      </section>

      <Nav />

      <section id="about-us" className="about-us" style={{ marginTop: "40px" }}>
        <div
          className="container-fluid"
          style={{ maxWidth: "190vh", textAlign: "justify", fontSize: "14px" }}
        >
          <h2
            style={{
              fontWeight: "bold",
              fontFamily: "Montserrat, sans-serif",
              textAlign: "left",
              textTransform: "uppercase",
            }}
          >
            State Anthem
          </h2>
          <hr></hr>

          <p>
            <b>"O Mur Apunar Dekh"</b> is the state song of Assam, written by
            the famous Assamese litterateur Lakshminath Bezbarua and composed by
            Kamala Prasad Agarwala. The song was first presented at the Assam
            Student Conference held in Tezpur in 1927 and was later adopted as
            the official state song of Assam.
          </p>
          <p>
            The song, with its soulful lyrics and melodious tune, captures the
            beauty of Assam and its vibrant culture. The title "O Mur Apunar
            Dekh" translates to <b>"O my endearing homeland,"</b> and it speaks
            to the love and pride that the people of Assam have for their state.
          </p>
          <p>The Lyrics of the State Song in English is given below -</p>
          <p style={{ marginLeft: "10px" }}>
            O Mur Apunar Dekh<br></br>O Mur Sikuni Dekh<br></br>
            Enekhon Huola<br></br>
            Enekhon Hufola<br></br>
            Enekhon Moromor Dekh<br></br>O Mur Huriya Maat<br></br>
            Axomor Huodi Maat<br></br>
            Prithibir Kotu Bisari Jonom Tu<br></br>
            Nupua Korileo Paat<br></br>O Mur Upoja Thai<br></br>O Mur Akhomi Aai
            <br></br>
            Sai Lou Ebar Mukhkhoni Tumar<br></br>
            Hepah Mur Polua Nai
          </p>
        </div>
      </section>
    </>
  );
}

export default Anthem;
