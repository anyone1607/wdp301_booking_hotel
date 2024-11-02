import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Sử dụng useParams và useNavigate
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import '../../styles/tourStyle.css';

function UpdateExtrafees() {
    const { id } = useParams(); // Lấy id từ URL
    const navigate = useNavigate(); // Để điều hướng sau khi cập nhật thành công
    const [formData, setFormData] = useState({
        extraName: '',
        hotelId: '',
        extraPrice: '',
        status: 'active', // Giá trị mặc định là "active"
        description: ''
    });

    const [hotels, setHotels] = useState([]); // Lưu danh sách khách sạn để chọn
    const [loading, setLoading] = useState(true); // Trạng thái chờ khi tải dữ liệu

    // Fetch dữ liệu phí phát sinh khi component mount
    useEffect(() => {
        if (!id) {
            console.error("Extra fee ID is undefined");
            return;
        }

        const fetchExtraFeeData = async () => {
            const token = localStorage.getItem("accessToken");
            try {
                const url = `http://localhost:8000/api/v1/extrafee/${id}`;
                console.log("Fetching from URL:", url); // Kiểm tra URL API
                const response = await fetch(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                if (data) {
                    setFormData({
                        extraName: data.extraName,
                        hotelId: data.hotelId._id,
                        extraPrice: data.extraPrice,
                        status: data.status, // Giữ giá trị status từ API
                        description: data.description
                    });
                }
            } catch (error) {
                console.error("Error fetching extra fee data:", error);
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
                    setHotels(data.data); // Cập nhật danh sách khách sạn
                } else {
                    console.error("Invalid data format", data);
                }
            } catch (error) {
                console.error("Error fetching hotels:", error);
            }
        };

        fetchExtraFeeData();
        fetchHotels();
        setLoading(false); // Sau khi dữ liệu được tải, ngừng loading
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Nếu tên là hotelId, lưu trực tiếp giá trị của khách sạn
        const newValue = (name === 'hotelId') ? value :
            (name === 'extraPrice') ? Number(value) : value;

        setFormData({ ...formData, [name]: newValue });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem("accessToken");

        try {
            const response = await fetch(`http://localhost:8000/api/v1/extrafee/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.ok) {
                navigate('/extrafees-management'); // Điều hướng sau khi cập nhật thành công
            } else {
                console.error("Failed to update extra fee", data);
            }

        } catch (error) {
            console.error("Error updating extra fee:", error);
        }
    };

    if (loading) {
        return <div>Loading...</div>; // Hiển thị trạng thái chờ khi tải dữ liệu
    }

    return (
        <div className="container mt-5">
            <h2 className="title text-center mb-4">Update Extra Fee</h2>
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
                                            {hotel.title} {/* Giả sử hotel có thuộc tính title */}
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
                        </Col>
                    </Row>

                    {/* <Form.Group className="mb-3" controlId="formDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="description"
                            value={formData.desc}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group> */}

                    <div className="text-center">
                        <Button variant="primary" type="submit" className="px-5">
                            Update Extra Fee
                        </Button>
                    </div>
                </Card>
            </Form>
        </div>
    );
}

export default UpdateExtrafees;
