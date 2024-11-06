import React, { useState } from "react";
import "../../styles/home.css";
import { Container, Row, Col, Form, FormGroup, Input } from "reactstrap";

import heroVideo from "../../assets/images/hero-video.mp4";
import heroVideo1 from "../../assets/images/hero-video1.mp4";
import heroVideo2 from "../../assets/images/hero-video2.mp4";

import worldImg from "../../assets/images/world.png";
import experienceImg from "../../assets/images/experience.png";
import { FaMapMarkerAlt } from "react-icons/fa";

import Subtitle from "../../shared/subtitle";
import SearchBar from "../../shared/SearchBar";
import useFetch from "../../hooks/useFetch";
import { BASE_URL } from "../../utils/config";
import FeaturedTourList from "../../components/Featured-tours/FeaturedTourList";
import MasonryImagesGallery from "../../components/Image-gallery/MasonryImagesGallery";
import Testimonials from "../../components/Testimonial/Testimonials";
import ServiceList from "../../services/ServiceList";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const {
    data: featuredTours,
    loading,
    error,
  } = useFetch(`${BASE_URL}/tours/search/getFeaturedTour`);

  // Filter tours based on search term
  const filteredTours = featuredTours?.filter((tour) =>
    tour.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* ========== HERO SECTION ========== */}
      <section>
        <Container>
          <Row>
            <Col lg="2">
              <div className="hero__img-box">
                <video
                  src={heroVideo1}
                  alt="Hero Video 1"
                  controls
                  autoPlay
                  muted
                  loop
                />
              </div>
            </Col>
            <Col lg="2">
              <div className="hero__img-box hero__video-box mt-4">
                <video
                  src={heroVideo}
                  alt="Hero Video 2"
                  controls
                  autoPlay
                  muted
                  loop
                />
              </div>
            </Col>
            <Col lg="2">
              <div className="hero__img-box mt-5">
                <video
                  src={heroVideo2}
                  alt="Hero Video 3"
                  controls
                  autoPlay
                  loop
                />
              </div>
            </Col>

            <Col lg="6">
              <div className="hero__content">
                <div className="hero__subtitle d-flex align-items-center">
                  <Subtitle subtitle={"Know Before You Stay"} />
                  <img src={worldImg} alt="" />
                </div>
                <h1>
                  Staying at the perfect hotel opens the door to
                  <span className="hightlight"> unforgettable memories</span>
                </h1>
                <p>
                  From accommodations, services, to nearby attractions, trust
                  our comprehensive offerings for a memorable hotel experience.
                </p>
              </div>
            </Col>

            <Col lg="12">
              <div
                className="search__bar"
                style={{
                  padding: "15px",
                  backgroundColor: "#f9f9f9",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Form className="d-flex align-items-center gap-4">
                  <FormGroup
                    className="d-flex gap-3 align-items-center form__group"
                    style={{
                      backgroundColor: "#fff",
                      border: "1px solid #e0e0e0",
                      borderRadius: "5px",
                      padding: "8px 12px",
                      width: "100%",
                    }}
                  >
                    <span
                      className="icon-wrapper"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#ffba00",
                        color: "#fff",
                        borderRadius: "50%",
                        padding: "8px",
                        fontSize: "1.2rem",
                      }}
                    >
                      <FaMapMarkerAlt style={{ fontSize: "1.4rem" }} />
                    </span>
                    <div style={{ flexGrow: 1 }}>
                      <h6
                        style={{
                          fontSize: "0.9rem",
                          fontWeight: 600,
                          color: "#333",
                          marginBottom: "3px",
                        }}
                      >
                        Hotel
                      </h6>
                      <Input
                        type="text"
                        placeholder="You can search for hotels!"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                          width: "100%",
                          border: "none",
                          borderBottom: "1px solid #ccc",
                          outline: "none",
                          padding: "6px 0",
                          transition: "border-color 0.3s",
                        }}
                        onFocus={(e) => (e.target.style.borderColor = "#ffba00")}
                        onBlur={(e) => (e.target.style.borderColor = "#ccc")}
                      />
                    </div>
                  </FormGroup>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      {/* ============================================================== */}

      {/* ==================== HERO SECTION START ====================== */}
      {/* <section>
        <Container>
          <Row>
            <Col lg="3">
              <h5 className="services__subtitle">What we serve</h5>
              <h2 className="services__title">We offer our best services</h2>
            </Col>
            <ServiceList />
          </Row>
        </Container>
      </section> */}

      {/* FEATURED TOUR SECTION */}
      <section>
        <Container>


          <Row>
            <Col lg="12" className="mb-5">
              <Subtitle subtitle={"Explore"} />
              <h2 className="featured__tour-title">Our Featured Hotels</h2>
            </Col>

            {loading ? (
              <h4>Loading.....</h4>
            ) : error ? (
              <h4>{error}</h4>
            ) : (
              <FeaturedTourList tours={filteredTours} />
            )}
          </Row>
        </Container>
      </section>

      {/* EXPERIENCE SECTION */}
      <section>
        <Container>
          <Row>
            <Col lg="6">
              <div className="experience__content">
                <Subtitle subtitle={"Experience"} />
                <h2>
                  With our all experience <br /> we will serve you
                </h2>
                <p>
                  With our wealth of experience, we are dedicated to providing
                  you with exceptional service. Our team is committed to
                  ensuring your satisfaction, offering personalized solutions
                  tailored to your needs.
                </p>
              </div>

              <div className="counter__wrapper d-flex align-items-center gap-5">
                <div className="counter__box">
                  <span>12k+</span>
                  <h6>Successful trip</h6>
                </div>
                <div className="counter__box">
                  <span>2k+</span>
                  <h6>Regular clients</h6>
                </div>
                <div className="counter__box">
                  <span>15</span>
                  <h6>Year experience</h6>
                </div>
              </div>
            </Col>
            <Col lg="6">
              <div className="experience__img">
                <img src={experienceImg} alt="" />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* GALLERY SECTION */}
      <section>
        <Container>
          <Row>
            <Col lg="12">
              <Subtitle subtitle={"Gallery"} />
              <h2 className="gallery__title">
                Visit our customers tour gallery
              </h2>
            </Col>
            <Col lg="12">
              <MasonryImagesGallery />
            </Col>
          </Row>
        </Container>
      </section>

      {/* TESTIMONIAL SECTION */}
      <section>
        <Container>
          <Row>
            <Col lg="12">
              <Subtitle subtitle={"Fans Love"} />
              <h2 className="testimonial__title">What our fans say about us</h2>
            </Col>
            <Col lg="12">
              <Testimonials />
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Home;