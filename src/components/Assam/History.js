import React from "react";
import GoToTop from "../../GoToTop";
import Nav from "./Nav";
function History() {
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
            Assam History
          </h2>
          <hr></hr>

          <p style={{ textAlign: "justify", fontSize: "14px" }}>
            Assam, the easternmost state of India, is blessed with enchanting
            natural beauty, lush greenery, and a chain of hills and rivers,
            including the Brahmaputra and the Barak. Its rich history is marked
            by the synthesis and assimilation of various races, tribes, and
            ethnic groups that have made Assam their home since ancient times.
          </p>

          <p style={{ textAlign: "justify", fontSize: "14px" }}>
            The origin of the name "Assam" is uncertain, and in ancient Sanskrit
            literature, it was referred to as "Pragjyotisha" or "Kamrupa."
            Pragjyotishpura may mean "City of Eastern Astrology," while
            Kamarupa's mythology tells the story of Sati, whose body fell into
            different places, one of which became known as Kamakhya. Shiva's
            penance led to the country being known as Kamarupa, where Kama
            regained his form. The name "Aham" or "Asom" was probably given by
            the Ahoms who ruled Assam for six hundred years and entered the
            state fully assimilated.
          </p>

          <p style={{ textAlign: "justify", fontSize: "14px" }}>
            The rule of the Ahom dynasty between the 13th and 19th centuries was
            a glorious chapter in Assam's history, which ended with the Burmese
            invasion and the subsequent annexation by the British East India
            Company following the Treaty of Yandaboo in 1826. Assam lost much of
            its territory to new states that emerged from within its borders,
            and it became a separate province with Shillong as its capital in
            1874.
          </p>

          <p style={{ textAlign: "justify", fontSize: "14px" }}>
            Assam played an active role in the freedom movement and became a
            constituent state of India in 1950. It witnessed further reduction
            of its area when Dewangiri in North Kamrupa was ceded to Bhutan in
            1951. The capital shifted to Dispur, a suburb of Guwahati, in 1972,
            and the state of Meghalaya, Nagaland, Arunachal Pradesh, and Mizoram
            got their own separate states.
          </p>

          <p style={{ textAlign: "justify", fontSize: "14px" }}>
            The history of Assam can be divided into four eras - ancient,
            medieval, colonial, and post-colonial - with each marked by
            significant developments that have led to the state's present state.
            The foundations laid by leaders like Gopinath Bordoloi witnessed the
            establishment of Gauhati University, Gauhati High Court, and All
            India Radio's Guwahati station.
          </p>
        </div>
      </section>
    </>
  );
}

export default History;
