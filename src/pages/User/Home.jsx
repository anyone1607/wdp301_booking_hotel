import React from "react";
import "../../styles/home.css";
import { Container, Row, Col, CardSubtitle } from "reactstrap";

import heroVideo from "../../assets/images/hero-video.mp4";
import heroVideo1 from "../../assets/images/hero-video1.mp4";
import heroVideo2 from "../../assets/images/hero-video2.mp4";

import worldImg from "../../assets/images/world.png";
import experienceImg from "../../assets/images/experience.png";

import Subtitle from "../../shared/subtitle";
import SearchBar from "../../shared/SearchBar";
import ServiceList from "../../services/ServiceList";
import FeaturedTourList from "../../components/Featured-tours/FeaturedTourList";
import MasonryImagesGallery from "../../components/Image-gallery/MasonryImagesGallery";
import Testimonials from "../../components/Testimonial/Testimonials";

const Home = () => {
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

            <SearchBar />
          </Row>
        </Container>
      </section>
      {/* ============================================================== */}

      {/* ==================== HERO SECTION START ====================== */}
      <section>
        <Container>
          <Row>
            <Col lg="3">
              <h5 className="services__subtitle">What we serve</h5>
              <h2 className="services__title">We offer our best services</h2>
            </Col>
            <ServiceList />
          </Row>
        </Container>
      </section>

      {/* ========== FEATURED TOUR SECTION START ========== */}
      <section>
        <Container>
          <Row>
            <Col lg="12" className="mb-5">
              <Subtitle subtitle={"Explore"} />
              <h2 className="featured__tour-title">Our Featured Hotels</h2>
            </Col>
            <FeaturedTourList />
          </Row>
        </Container>
      </section>
      {/* ========== FEATURED TOUR SECTION END =========== */}

      {/* ========== EXPERIENCE SECTION START ============ */}
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
                  <br />
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
      {/* ========== EXPERIENCE SECTION END ============== */}

      {/* ========== GALLERY SECTION START ============== */}
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
      {/* ========== GALLERY SECTION END ================ */}

      {/* ========== TESTIMONIAL SECTION START ================ */}
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
      {/* ========== TESTIMONIAL SECTION END ================== */}
    </>
  );
};

export default Home;
