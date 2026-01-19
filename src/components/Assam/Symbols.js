import React from "react";
import GoToTop from "../../GoToTop";
import Nav from "./Nav";

function Symbols() {
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
            State Symbols
          </h2>
          <hr></hr>
          <p>
            The official state symbols of Assam embody the region's rich
            cultural heritage and natural wonders.
          </p>

          <table class="table table-bordered">
            <thead>
              <tr>
                <th scope="col">Category</th>
                <th scope="col">Assamese Term</th>
                <th scope="col">English Term</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>State Song</td>
                <td>O Mur Apunar Dekh</td>
                <td>O my dearest country</td>
              </tr>
              <tr>
                <td>State Motto</td>
                <td>Joi Aai Axom</td>
                <td>Hail mother Assam</td>
              </tr>
              <tr>
                <td>State Seal</td>
                <td>Axom sorkar</td>
                <td>Government of Assam</td>
              </tr>
              <tr>
                <td>State Language</td>
                <td>Axomiya</td>
                <td>Assamese</td>
              </tr>
              <tr>
                <td>State Literary Society</td>
                <td>Axom Xahityo Xobha</td>
                <td>Assam Literary Society</td>
              </tr>
              <tr>
                <td>State Festival</td>
                <td>Bihu</td>
                <td>Bihu</td>
              </tr>
              <tr>
                <td>State Dance</td>
                <td>Bihu nas</td>
                <td>Bihu Dance</td>
              </tr>
              <tr>
                <td>State Flower</td>
                <td>Kopou phul</td>
                <td>Foxtail Orchids</td>
              </tr>
              <tr>
                <td>State Animal</td>
                <td>Gor</td>
                <td>One-horned rhinoceros</td>
              </tr>
              <tr>
                <td>State Tree</td>
                <td>Hollong</td>
                <td>Dipterocarpus macrocarpus</td>
              </tr>
              <tr>
                <td>State Bird</td>
                <td>Deo haah</td>
                <td>White-winged wood duck</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

export default Symbols;
