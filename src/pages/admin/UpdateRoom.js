import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';  // Sử dụng useParams và useNavigate
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import '../../styles/tourStyle.css';

function UpdateRoom() {
    const { id } = useParams();  // Lấy id từ URL
    const navigate = useNavigate();  // Để điều hướng sau khi cập nhật thành công
    const [formData, setFormData] = useState({
        roomName: '',
        hotelId: '',
        roomPrice: '',
        maxOccupancy: '',
        quantity: '',
        description: ''
    });
    
    const [hotels, setHotels] = useState([]);  // Lưu danh sách khách sạn để chọn
    const [loading, setLoading] = useState(true);  // Trạng thái chờ khi tải dữ liệu

    // Fetch dữ liệu phòng khi component mount
    useEffect(() => {
        if (!id) {
            console.error("Room ID is undefined");
            return;
        }

        const fetchRoomData = async () => {
            const token = localStorage.getItem("accessToken");
            try {
                const url = `http://localhost:8000/api/v1/roomCategory/${id}`;
                console.log("Fetching from URL:", url);  // Kiểm tra URL API
                const response = await fetch(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                if (data) {
                    setFormData({
                        roomName: data.roomName,
                        hotelId: data.hotelId._id,
                        roomPrice: data.roomPrice,
                        maxOccupancy: data.maxOccupancy,
                        quantity: data.quantity,
                        description: data.description
                    });
                }
            } catch (error) {
                console.error("Error fetching room data:", error);
            }
        };
        

        const fetchHotels = async () => {
            const token = localStorage.getItem("accessToken");
            try {
                const response = await fetch("http://localhost:8000/api/v1/tours", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                if (data.success && Array.isArray(data.data)) {
                    setHotels(data.data);  // Cập nhật danh sách khách sạn
                } else {
                    console.error("Invalid data format", data);
                }
            } catch (error) {
                console.error("Error fetching hotels:", error);
            }
        };

        fetchRoomData();
        fetchHotels();
        setLoading(false);  // Sau khi dữ liệu được tải, ngừng loading
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        // Nếu tên là hotelId, lưu trực tiếp giá trị của khách sạn
        const newValue = (name === 'hotelId') ? value :
            (name === 'roomPrice' || name === 'maxOccupancy' || name === 'quantity') 
            ? Number(value) 
            : value;
    
        setFormData({ ...formData, [name]: newValue });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem("accessToken");

        try {
            const response = await fetch(`http://localhost:8000/api/v1/roomCategory/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (data) {
                navigate('/room-management');  // Điều hướng sau khi cập nhật thành công
            } else {
                console.error("Failed to update room", formData);
            }

        } catch (error) {
            console.error("Error updating room:", error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;  // Hiển thị trạng thái chờ khi tải dữ liệu
    }

    return (
        <div className="container mt-5">
            <h2 className="title text-center mb-4">Update Room</h2>
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
                                            {hotel.title}
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
                            Update Room
                        </Button>
                    </div>
                </Card>
            </Form>
        </div>
    );
}

export default UpdateRoom;
