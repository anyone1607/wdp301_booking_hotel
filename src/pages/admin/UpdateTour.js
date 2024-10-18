import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import '../../styles/tourStyle.css';

function UpdateTour() {
    const [formData, setFormData] = useState({
        title: '',
        location: '',
        address: '',
        distance: '',
        desc: '',
        price: '',
        photo: '' // Thêm trường cho ảnh
    });

    const [locations, setLocations] = useState([]);
    const fileInput = useRef(null);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchLocations = async () => {
            const token = localStorage.getItem("accessToken");
            try {
                const response = await fetch("http://localhost:8000/api/v1/locations/getlocation", {
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

        const fetchTour = async () => {
            const token = localStorage.getItem("accessToken");
            try {
                const response = await fetch(`http://localhost:8000/api/v1/tours/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                if (data && data.data) {
                    const tourData = data.data;
                    setFormData({
                        title: tourData.title,
                        location: tourData.location[0]._id, // Giả định location là một mảng và lấy ID của vị trí đầu tiên
                        address: tourData.address,
                        distance: tourData.distance,
                        desc: tourData.desc,
                        price: tourData.price,
                        photo: tourData.photo // Lưu trữ URL của ảnh
                    });
                } else {
                    console.error("Failed to fetch tour data", data);
                }
            } catch (error) {
                console.error("Error fetching tour:", error);
            }
        };

        fetchLocations();
        fetchTour();
    }, [id]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem("accessToken");

        const formDataToSend = new FormData();
        formDataToSend.append("title", formData.title);
        formDataToSend.append("location", formData.location);
        formDataToSend.append("address", formData.address);
        formDataToSend.append("distance", formData.distance);
        formDataToSend.append("desc", formData.desc);
        formDataToSend.append("price", formData.price);
        if (fileInput.current.files[0]) {
            formDataToSend.append("file", fileInput.current.files[0]);
        }

        try {
            const response = await fetch(`http://localhost:8000/api/v1/tours/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formDataToSend,
            });

            const result = await response.json();

            if (result.success) {
                navigate('/tour-management');
            } else {
                console.error("Failed to update tour", result);
            }
        } catch (error) {
            console.error("Error updating tour:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <div className="container mt-5">
            <h2 className="title text-center mb-4">Update Tour</h2>
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
                                <Form.Label>City</Form.Label>
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

                            <Form.Group className="mb-3" controlId="formPrice">
                                <Form.Label>Price ($)</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6} className="d-flex justify-content-center align-items-center">
                            {/* Hiển thị hình ảnh hiện tại */}
                            <img
                                src={formData.photo}
                                alt={formData.title}
                                style={{ width: '100%', height: 'auto', maxHeight: '300px', objectFit: 'cover' }}
                            />
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
                            Update Tour
                        </Button>
                    </div>
                </Card>
            </Form>
        </div>
    );
}

export default UpdateTour;
