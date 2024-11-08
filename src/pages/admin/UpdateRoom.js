import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Card, Alert } from 'react-bootstrap';
import '../../styles/tourStyle.css';

function UpdateRoom() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        roomName: '',
        hotelId: '',
        roomPrice: '',
        maxOccupancy: '',
        quantity: '',
        description: '',
        status: 'active',
        photo: ''
    });

    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const fileInput = useRef(null);
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchRoomData = async () => {
            const token = localStorage.getItem("accessToken");
            try {
                const response = await fetch(`http://localhost:8000/api/v1/roomCategory/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await response.json();
                if (data) {
                    setFormData({
                        roomName: data.roomName,
                        hotelId: data.hotelId ? data.hotelId._id : '',
                        roomPrice: data.roomPrice,
                        maxOccupancy: data.maxOccupancy,
                        quantity: data.quantity,
                        description: data.description,
                        status: data.status || 'active',
                        photo: data.photo
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
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await response.json();
                if (data.success && Array.isArray(data.data)) {
                    setHotels(data.data);
                } else {
                    console.error("Invalid data format", data);
                }
            } catch (error) {
                console.error("Error fetching hotels:", error);
            }
        };

        fetchRoomData();
        fetchHotels();
        setLoading(false);
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        const newValue = (name === 'hotelId') ? value :
            (name === 'roomPrice' || name === 'maxOccupancy' || name === 'quantity')
                ? Number(value)
                : (name === 'file') ? files[0] : value;

        setFormData({ ...formData, [name]: newValue });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prevState => ({
                ...prevState,
                photo: URL.createObjectURL(file)
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                photo: prevState.photo
            }));
        }
    };

    const validateForm = () => {
        const { roomName, hotelId, roomPrice, maxOccupancy, quantity, description } = formData;
        if (!roomName || !hotelId || !roomPrice || !maxOccupancy || !quantity || !description) {
            return "Please fill in all required fields.";
        }
        if (roomPrice <= 0) return "Room price must be a positive number.";
        if (maxOccupancy <= 0) return "Max occupancy must be a positive number.";
        if (quantity <= 0) return "Quantity must be a positive number.";
        
        const file = fileInput.current?.files[0];
        if (file && !file.type.startsWith('image/')) {
            return "Invalid file type. Please select an image.";
        }
        return null;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem("accessToken");

        const validationError = validateForm();
        if (validationError) {
            setErrorMessage(validationError);
            setMessage('');
            return;
        }

        const roomData = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            roomData.append(key, value);
        });
        if (fileInput.current.files[0]) {
            roomData.append('file', fileInput.current.files[0]);
        }

        try {
            const response = await fetch(`http://localhost:8000/api/v1/roomCategory/${id}`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
                body: roomData,
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                console.error("Server error:", errorMessage);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data) {
                setMessage('Room updated successfully!');
                setErrorMessage('');
                navigate('/room-management');
            } else {
                setMessage('No changes were made.');
                setErrorMessage('');
                console.error("Failed to update room", formData);
            }

        } catch (error) {
            console.error("Error updating room:", error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-5">
            <h2 className="title text-center mb-4">Update Room</h2>
            {message && <Alert variant="success">{message}</Alert>}
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
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

                            <Form.Group className="mb-3" controlId="formStatus">
                                <Form.Label>Status</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </Form.Control>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formPhoto">
                                <Form.Label>Photo</Form.Label>
                                <Form.Control
                                    type="file"
                                    name="file"
                                    ref={fileInput}
                                    onChange={handleFileChange}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6} className="d-flex justify-content-center align-items-center">
                            {formData.photo && (
                                <img
                                    src={formData.photo}
                                    alt="Room Preview"
                                    style={{ width: '100%', height: 'auto', maxHeight: '300px', objectFit: 'cover', marginBottom: '20px' }}
                                />
                            )}
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

                    <Button variant="primary" type="submit">
                        Update Room
                    </Button>
                </Card>
            </Form>
        </div>
    );
}

export default UpdateRoom;
