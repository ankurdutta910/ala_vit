import React from "react";
// import { db } from "../firebase";
import GoToTop from "../GoToTop";
import { Link } from "react-router-dom";
import Nav from "./Assam/Nav";

function Assam() {
  return (
    <>
      <GoToTop />
      <div>
        <div>
          <section
            id="assamtop"
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

          <section
            id="about-us"
            className="about-us"
            style={{ marginTop: "40px" }}
          >
            <div
              className="container-fluid"
              style={{
                maxWidth: "190vh",
                textAlign: "justify",
                fontSize: "14px",
              }}
            >
              <h2
                style={{
                  fontWeight: "bold",
                  fontFamily: "Montserrat, sans-serif",
                  textAlign: "left",
                }}
              >
                ASSAM
              </h2>

              <div className="row content">
                <div className="col-lg-4 pt-lg-0">
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/assamesecommunity-b95c8.appspot.com/o/Assam%2F5.jpg?alt=media&token=d5c5290d-277a-4c91-a69c-03a43d00a156"
                    className="img-fluid"
                    alt=""
                  />
                </div>

                <div className="col-lg-8" data-aos="fade-right">
                  <p>
                    Assam, located in the North-East region of India, is the
                    largest state in the region in terms of population and the
                    second-largest in terms of area. It covers a vast area of
                    78,438 km² (30,285 sq miles) and is bordered by Bhutan and
                    the state of Arunachal Pradesh to the north, Nagaland,
                    Arunachal Pradesh and Manipur to the east, Meghalaya,
                    Tripura, Mizoram, and Bangladesh to the south, and West
                    Bengal to the west.
                  </p>
                  <p>
                    A unique feature of Assam's geography is that it encompasses
                    three of the six physiographic divisions of India, including
                    the Northern Himalayas (Eastern Hills), the Northern Plains
                    (Brahmaputra plain), and the Deccan Plateau (Karbi Anglong).
                  </p>
                  <p>
                    Assam is renowned for its abundant forest resources, which
                    cover a significant portion of the state's landscape. The
                    forests are home to an array of valuable trees, and the
                    state tree of Assam is the Dipterocarpus macrocarpus,
                    locally known as the Hollong tree. Assam's forests are also
                    home to a diverse range of orchid species, with the Foxtail
                    orchid (Rhynchostylis retusa), also known as the Kopou Phul,
                    recognized as the state flower of Assam.
                  </p>
                  <p>
                    Recently established, the Kaziranga National Orchid and
                    Biodiversity Park is a testament to the state's diverse
                    flora, boasting over 500 of the estimated 1,314 orchid
                    species found in India. Along with orchids, Assam is home to
                    a vast array of medicinal herbs and plants. The state boasts
                    about 300 types of medicinal herbs and plants, with the
                    Brahmaputra valley alone having 150 varieties of herbs and
                    plants with commercial value.
                  </p>
                </div>
              </div>

              <div className="row content my-5">
                <div className="col-lg-8" data-aos="fade-right">
                  <p>
                    Assam is a treasure trove for wildlife enthusiasts, boasting
                    several wildlife sanctuaries, with the most notable being
                    two UNESCO World Heritage sites - the Kaziranga National
                    Park and the Manas Wildlife Sanctuary. Additionally, the
                    state has three other national parks: Dibru Saikhowa
                    National Park, Nameri National Park, and Orang National
                    Park.{" "}
                  </p>
                  <p>
                    Kaziranga National Park, in particular, is home to the
                    fast-disappearing Indian one-horned rhinoceros, which has
                    also been recognized as the state animal of Assam. Along
                    with the one-horned rhinoceros, the park is home to several
                    other rare and endangered species, making it a vital
                    conservation area for wildlife.
                  </p>
                  <p>
                    Assam is also home to a diverse range of bird species, and
                    the state bird of Assam is the white-winged wood duck. The
                    bird's striking appearance and endangered status make it a
                    significant symbol of the state's rich wildlife.
                  </p>
                  <p>
                    Overall, Assam's abundant wildlife sanctuaries and national
                    parks offer a unique opportunity to experience the diverse
                    flora and fauna of the region, making it a must-visit
                    destination for nature lovers.
                  </p>
                </div>
                <div className="col-lg-4 pt-4 pt-lg-0">
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/assamesecommunity-b95c8.appspot.com/o/Assam%2F9.jpg?alt=media&token=026f07f1-c9f3-4e52-ae06-546ea267694a"
                    className="img-fluid"
                    alt=""
                  />
                </div>
              </div>

              <small>
                Source:{" "}
                <a
                  href="https://assam.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://assam.gov.in/
                </a>
              </small>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default Assam;
