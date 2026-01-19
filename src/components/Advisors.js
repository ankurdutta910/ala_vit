import React, { useState, useEffect, Fragment } from "react";
import GoToTop from "../GoToTop";
import "../App.css";
import { Card } from "semantic-ui-react";
import washima_img from "./assets/image/Washima.webp";

function Advisors() {
  return (
    <Fragment>
      <>
        <GoToTop />
        <div
          className="container-fluid"
          style={{ marginTop: "10vh", maxWidth: "190vh" }}
        >
          <section id="team" className="team">
            <div className="section-title">
              <h2 className="advisorheading"
                style={{
                  fontWeight: "bold",
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                ADVISOR(S)
              </h2>
            </div>
            <div className="advisor-container">
              <div className="advisor-card">
                <Card style={{ textAlign: "center", width: "100%" }}>
                  <img
                    className="img-fluid"
                    src={washima_img}
                    alt="Washima Tasnin"
                  />

                  <a
                    className="ui orange right ribbon label"
                    style={{
                      marginTop: "-26px",
                      marginLeft: "-14px",
                      maxWidth: "20vh",
                    }}
                  >
                    Faculty Coordinator
                  </a>

                  <Card.Content>
                    <h5
                      className="advisorH1 mb-1"
                      style={{
                        textTransform: "uppercase",
                        marginBottom: "8px",
                      }}
                    >
                      DR. WASHIMA TASNIN
                    </h5>
                    <Card.Meta>
                      <span className="advisorH2">
                        Assistant Professor Sr. Grade 1
                        <br />
                        (SELECT)
                      </span>
                    </Card.Meta>
                  </Card.Content>
                </Card>
              </div>
            </div>
          </section>
        </div>
      </>
    </Fragment>
  );
}

export default Advisors;
