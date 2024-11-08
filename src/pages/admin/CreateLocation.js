// frontend/src/components/CreateLocation.js
import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Alert, Row, Col } from "react-bootstrap";

function CreateLocation() {
  const [formData, setFormData] = useState({
    title: "",
    city: "",
    address: "",
    description: "",
    status: "active",
  });
  const [logo, setLogo] = useState(null);
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogoChange = (e) => setLogo(e.target.files[0]);

  const handleImagesChange = (e) => setImages([...e.target.files]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.title || !formData.city || !formData.address || !formData.description || !logo) {
      setError("All fields are required.");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("city", formData.city);
    data.append("address", formData.address);
    data.append("description", formData.description);
    data.append("status", formData.status);
    data.append("logo", logo);
    images.forEach((image) => data.append("images", image));

    try {
      const response = await axios.post("http://localhost:8000/api/v1/locations", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setSuccess("Location created successfully!");
    } catch (error) {
      setError("Error creating location.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Create Location</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="city">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="address">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="status">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
        <Form.Group controlId="logo">
          <Form.Label>Logo</Form.Label>
          <Form.Control type="file" onChange={handleLogoChange} />
        </Form.Group>
        <Form.Group controlId="images">
          <Form.Label>Images</Form.Label>
          <Form.Control type="file" multiple onChange={handleImagesChange} />
        </Form.Group>
        <Button type="submit" className="mt-3">
          Create Location
        </Button>
      </Form>
    </div>
  );
}

export default CreateLocation;
