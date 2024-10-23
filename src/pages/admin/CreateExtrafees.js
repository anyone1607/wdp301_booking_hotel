import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import '../../styles/tourStyle.css';

function CreateExtrafees() {
    const [formData, setFormData] = useState({
        extraName: '',
        hotelId: '',
        extraPrice: '',
        status: 'active', // Đặt mặc định là "active"
        description: ''
    });

    const [hotels, setHotels] = useState([]); // List of hotels
    const navigate = useNavigate();

    // Fetch list of hotels on component mount
    useEffect(() => {
        const fetchHotels = async () => {
            const token = localStorage.getItem("accessToken");
            try {
                // Fetch the list of hotels from the tours API
                const response = await fetch("http://localhost:8000/api/v1/tours", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                console.log(data); // Check data returned from the API

                // Get the list of hotels from the data property
                if (data.success && Array.isArray(data.data)) {
                    setHotels(data.data); // Use data.data to get the list of hotels
                } else {
                    console.error("Invalid data format", data);
                }
            } catch (error) {
                console.error("Error fetching hotels:", error);
            }
        };

        fetchHotels();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem("accessToken");
    
        try {
            console.log("Submitting formData:", formData); // Check data before sending
            
            const response = await fetch("http://localhost:8000/api/v1/extrafee", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData), // Send data as JSON
            });

            const result = await response.json(); // Get the response data

            if (response.ok) {
                navigate('/extrafees-management'); // Navigate to the extrafees management page
            } else {
                console.error("Failed to create extra fee", result);
            }
          
        } catch (error) {
            console.error("Error creating extra fee:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        // Save the hotelId value directly if the name is hotelId
        const newValue = (name === 'hotelId') ? value :
            (name === 'extraPrice') ? Number(value) : value;
    
        setFormData({ ...formData, [name]: newValue });
    };

    return (
        <div className="container mt-5">
            <h2 className="title text-center mb-4">Create Extra Fee</h2>
            <Form onSubmit={handleSubmit}>
                <Card className="p-4 shadow-sm">
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="formExtraName">
                                <Form.Label>Extra Fee Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="extraName"
                                    value={formData.extraName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formHotel">
                                <Form.Label>Hotel</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="hotelId"
                                    value={formData.hotelId}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select a hotel</option>
                                    {hotels.map((hotel) => (
                                        <option key={hotel._id} value={hotel._id}>
                                            {hotel.title} {/* Assume hotel has a title property */}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formExtraPrice">
                                <Form.Label>Extra Fee Price ($)</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="extraPrice"
                                    value={formData.extraPrice}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formStatus">
                                <Form.Label>Status</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    readOnly // Nếu không cần người dùng chỉnh sửa, có thể để trường này là readOnly
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3" controlId="formDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>

                    <div className="text-center">
                        <Button variant="primary" type="submit" className="px-5">
                            Create Extra Fee
                        </Button>
                    </div>
                </Card>
            </Form>
        </div>
    );
}

export default CreateExtrafees;
