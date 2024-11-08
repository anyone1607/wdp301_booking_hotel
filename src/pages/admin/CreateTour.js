import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Card, Alert } from 'react-bootstrap';
import '../../styles/tourStyle.css';

function CreateTour() {
    const [formData, setFormData] = useState({
        title: '',
        location: '',
        address: '',
        distance: '',
        desc: '',
        price: ''
    });
    const [locations, setLocations] = useState([]);
    const [error, setError] = useState("");
    const fileInput = useRef(null);
    const navigate = useNavigate();

    // Fetch locations when component mounts
    useEffect(() => {
        const fetchLocations = async () => {
            const token = localStorage.getItem("accessToken");
            try {
                const response = await fetch("http://localhost:8000/api/v1/locations/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                if (Array.isArray(data)) {
                    setLocations(data);
                } else {
                    console.error("Invalid data format", data);
                }
            } catch (error) {
                console.error("Error fetching locations:", error);
            }
        };
        fetchLocations();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        // Validation
        if (!formData.title || !formData.location || !formData.address || !formData.distance || !formData.desc) {
            setError("All fields are required.");
            return;
        }
        if (isNaN(formData.distance) || formData.distance <= 0) {
            setError("Distance must be a positive number.");
            return;
        }
        
        if (!fileInput.current.files[0]) {
            setError("Photo is required.");
            return;
        }

        const token = localStorage.getItem("accessToken");
        const formDataToSend = new FormData();
        formDataToSend.append("title", formData.title);
        formDataToSend.append("location", formData.location);
        formDataToSend.append("address", formData.address);
        formDataToSend.append("distance", formData.distance);
        formDataToSend.append("desc", formData.desc);
        formDataToSend.append("price", formData.price);
        formDataToSend.append("file", fileInput.current.files[0]);

        try {
            const response = await fetch("http://localhost:8000/api/v1/tours", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formDataToSend,
            });
            const result = await response.json();
            if (result.success && result.data) {
                navigate('/hotel-management');
            } else {
                setError("Failed to create hotel");
            }
        } catch (error) {
            console.error("Error creating tour:", error);
            setError("An error occurred while creating the tour.");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <div className="container mt-5">
            <h2 className="title text-center mb-4">Create Hotel</h2>
            {error && <Alert variant="danger">{error}</Alert>}
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
                                <Form.Control
                                    type="file"
                                    name="file"
                                    ref={fileInput}
                                    required
                                />
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
                                    <option value="">Select a Location</option>
                                    {locations.map((location) => (
                                        <option key={location._id} value={location._id}>
                                            {location.title}
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
{/* 
                            <Form.Group className="mb-3" controlId="formPrice">
                                <Form.Label>Price ($)</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group> */}
                        </Col>
                        <Col md={6} className="d-flex justify-content-center align-items-center">
                            {fileInput.current && fileInput.current.files[0] && (
                                <img
                                    src={URL.createObjectURL(fileInput.current.files[0])}
                                    alt={formData.title}
                                    style={{ width: '100%', height: 'auto', maxHeight: '300px', objectFit: 'cover' }}
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
                        <Button variant="primary" type="submit" className="px-5">
                            Create Hotel
                        </Button>
                    </div>
                </Card>
            </Form>
        </div>
    );
}

export default CreateTour;
