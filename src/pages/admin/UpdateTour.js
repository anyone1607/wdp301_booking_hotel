import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col, Card, Alert } from "react-bootstrap";
import "../../styles/tourStyle.css";

function UpdateTour() {
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    address: "",
    distance: "",
    desc: "",
    photo: "",
  });

  const [locations, setLocations] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInput = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch locations và tour khi component mount
  useEffect(() => {
    const fetchLocations = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const response = await fetch(
          "http://localhost:8000/api/v1/locations/getlocation",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        if (Array.isArray(data)) {
          setLocations(data);
        } else {
          setError("Invalid data format");
        }
      } catch (error) {
        setError("Error fetching locations.");
      }
    };

    const fetchTour = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const response = await fetch(
          `http://localhost:8000/api/v1/tours/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (data && data.data) {
          const tourData = data.data;
          setFormData({
            title: tourData.title,
            location: tourData.location[0]?._id || "",
            address: tourData.address,
            distance: tourData.distance,
            desc: tourData.desc,
            photo: tourData.photo,
          });
        } else {
          setError("Failed to fetch hotel data.");
        }
      } catch (error) {
        setError("Error fetching hotel.");
      }
    };

    fetchLocations();
    fetchTour();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.title || !formData.location || !formData.address || !formData.distance || !formData.desc) {
      setError("All fields are required.");
      return;
    }

    const token = localStorage.getItem("accessToken");
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("location", formData.location);
    formDataToSend.append("address", formData.address);
    formDataToSend.append("distance", formData.distance);
    formDataToSend.append("desc", formData.desc);

    if (fileInput.current.files[0]) {
      formDataToSend.append("file", fileInput.current.files[0]);
    }

    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/v1/tours/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(`Failed to update hotel: ${errorData.message || "Unknown error"}`);
        setIsLoading(false);
        return;
      }

      const result = await response.json();
      if (result.success) {
        setSuccess("Hotel updated successfully!");
        setTimeout(() => {
          navigate("/hotel-management");
        }, 2000);
      } else {
        setError(`Failed to update hotel: ${result.message || "Unknown error"}`);
      }
    } catch (error) {
      setError(`Error updating hotel: ${error.message}`);
    }
    setIsLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="container mt-5">
      <h2 className="title text-center mb-4">Update Hotel</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Card className="p-4 shadow-sm">
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formPhoto">
                <Form.Label>Photo</Form.Label>
                <Form.Control type="file" name="file" ref={fileInput} />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formAddress">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formCity">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  as="select"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a city</option>
                  {locations.map((location) => (
                    <option key={location._id} value={location._id}>
                      {location.city}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formDistance">
                <Form.Label>Distance (km)</Form.Label>
                <Form.Control
                  type="number"
                  name="distance"
                  value={formData.distance}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6} className="d-flex justify-content-center align-items-center">
              {fileInput.current && fileInput.current.files[0] ? (
                <img
                  src={URL.createObjectURL(fileInput.current.files[0])}
                  alt={formData.title}
                  style={{
                    width: "100%",
                    height: "auto",
                    maxHeight: "300px",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <img
                  src={formData.photo}
                  alt={formData.title}
                  style={{
                    width: "100%",
                    height: "auto",
                    maxHeight: "300px",
                    objectFit: "cover",
                  }}
                />
              )}
            </Col>
          </Row>

          <Form.Group className="mb-3" controlId="formDesc">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="desc"
              value={formData.desc}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <div className="text-center">
            <Button variant="primary" type="submit" className="px-5" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Hotel"}
            </Button>
          </div>
        </Card>
      </Form>
    </div>
  );
}

export default UpdateTour;
