import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import '../../styles/tourStyle.css';

function CreateRoom() {
    const [formData, setFormData] = useState({
        roomName: '',
        hotelId: '',
        roomPrice: '',
        maxOccupancy: '',
        quantity: '',
        description: ''
    });

    const [hotels, setHotels] = useState([]); // Danh sách khách sạn
    const navigate = useNavigate();

    // Fetch danh sách khách sạn khi component mount
    useEffect(() => {
        const fetchHotels = async () => {
            const token = localStorage.getItem("accessToken");
            try {
                // Lấy danh sách khách sạn từ API tours
                const response = await fetch("http://localhost:8000/api/v1/tours", { 
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                console.log(data); // Kiểm tra dữ liệu trả về từ API

                // Lấy danh sách khách sạn từ thuộc tính data
                if (data.success && Array.isArray(data.data)) {
                    setHotels(data.data); // Sử dụng data.data để lấy danh sách khách sạn
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
        console.log("Submitting formData: ssssssssssssssssssssssssssssssssss", formData); // Kiểm tra dữ liệu trước khi gửi
            
            const response = await fetch("http://localhost:8000/api/v1/roomCategory", {
                
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData), // Gửi dữ liệu dưới dạng JSON
            });

          
            if (formData.hotelId!==null) {
                navigate('/room-management');
            } else {
                console.error("Failed to create tour", formData);
            }
      
    
          
        } catch (error) {
            console.error("Error creating room:", error);
        }
    };
    

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        // Nếu tên là hotelId, lưu trực tiếp giá trị của khách sạn
        const newValue = (name === 'hotelId') ? value :
            (name === 'roomPrice' || name === 'maxOccupancy' || name === 'quantity') 
            ? Number(value) 
            : value;
    
        setFormData({ ...formData, [name]: newValue });
    };
    

    return (
        <div className="container mt-5">
            <h2 className="title text-center mb-4">Create Room</h2>
            <Form onSubmit={handleSubmit}>
                <Card className="p-4 shadow-sm">
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="formRoomName">
                                <Form.Label>Room Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="roomName"
                                    value={formData.roomName}
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
                                            {hotel.title} {/* Giả sử hotel có thuộc tính title */}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formRoomPrice">
                                <Form.Label>Room Price ($)</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="roomPrice"
                                    value={formData.roomPrice}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formMaxOccupancy">
                                <Form.Label>Max Occupancy</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="maxOccupancy"
                                    value={formData.maxOccupancy}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formQuantity">
                                <Form.Label>Quantity</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleInputChange}
                                    required
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
                            Create Room
                        </Button>
                    </div>
                </Card>
            </Form>
        </div>
    );
}

export default CreateRoom;
