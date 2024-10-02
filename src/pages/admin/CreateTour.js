import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import '../../styles/tourStyle.css';
function CreateTour() {
    const [formData, setFormData] = useState({
        title: '',
        city: '',
        address: '',
        distance: '',
        photo: '',
        desc: '',
        price: '',
        maxGroupSize: '',
        itinerary: [{ day: 1, detail: '' }]
    });

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem("accessToken");

        try {
            const response = await fetch("http://localhost:8000/api/v1/tours", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            const id = result.data._id;
            formData.itinerary.forEach(async (item, index) => {
                const itinerary = {
                    tourId: id,
                    day: item.day,
                    detail: item.detail
                    
                };
                const addItinerary = await fetch(`http://localhost:8000/api/v1/itinerary`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(itinerary),
                });
                const addItineraryResult = await addItinerary.json();
                console.log(addItineraryResult);
            })
            
            
            navigate('/admin/tour-management');
        } catch (error) {
            console.error("Error creating tour:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleItineraryChange = (index, e) => {
        const { name, value } = e.target;
        const newItinerary = formData.itinerary.map((item, i) => {
            if (i === index) {
                return { ...item, [name]: value };
            }
            return item;
        });
        setFormData({ ...formData, itinerary: newItinerary });
    };

    const addItineraryItem = () => {
        setFormData({
            ...formData,
            itinerary: [...formData.itinerary, { day: formData.itinerary.length + 1, detail: '' }]
        });
    };

    const removeItineraryItem = (index) => {
        setFormData({
            ...formData,
            itinerary: formData.itinerary.filter((_, i) => i !== index)
        });
    };

    return (
           <div className="container">
            <h2 className="title">Create Tour</h2>
            <Form onSubmit={handleSubmit}>
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
                <Row>
                    <Col md={6}>
                    <Form.Group className="mb-3" controlId="formPhoto">
                    <Form.Label>Photo</Form.Label>
                    <Form.Control
                        type="text"
                        name="photo"
                        value={formData.photo}
                        onChange={handleInputChange}
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
                    <Form.Label>City</Form.Label>
                    <Form.Control
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formDistance">
                    <Form.Label>Distance</Form.Label>
                    <Form.Control
                        type="number"
                        name="distance"
                        value={formData.distance}
                        onChange={handleInputChange}
                        required
                    />
                </Form.Group>
                <Row>
                    <Col md={6}>
                    <Form.Group className="mb-3" controlId="formMaxGroupSize">
                    <Form.Label>Max Group Size</Form.Label>
                    <Form.Control
                        type="number"
                        name="maxGroupSize"
                        value={formData.maxGroupSize}
                        onChange={handleInputChange}
                        required
                    />
                </Form.Group>
                </Col>
                <Col md={6}>
                <Form.Group className="mb-3" controlId="formPrice">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                    />
                </Form.Group>
                </Col>
                </Row>
                    </Col>
                    <Col md={6}>
                    <img src={formData.photo} alt={formData.title} />
                    </Col>
                </Row>
                <Form.Label>Itinerary: </Form.Label>
               
                <Button variant="secondary" onClick={addItineraryItem} style={{padding: '0px 5px', margin: '5px'}}>+</Button>
                <br/>
                {formData.itinerary.map((item, index) => (
    <div key={index} className="mb-3">
        <div className="card">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="card-title">Day {index + 1}</h5>
                    <Button 
                        variant="link" 
                        className="text-danger p-0" 
                        onClick={() => removeItineraryItem(index)}
                    >
                        <span aria-hidden="true">&times;</span>
                    </Button>
                </div>
                <div className="mb-3">
                    <Form.Group controlId={`formItineraryDay${index}`}>
                        <Form.Label>Day</Form.Label>
                        <Form.Control
                            type="number"
                            name="day"
                            value={item.day}
                            onChange={(e) => handleItineraryChange(index, e)}
                            required
                        />
                    </Form.Group>
                </div>
                <div className="mb-3">
                    <Form.Group controlId={`formItineraryDetail${index}`}>
                        <Form.Label>Detail</Form.Label>
                        <Form.Control
                            type="text"
                            name="detail"
                            value={item.detail}
                            onChange={(e) => handleItineraryChange(index, e)}
                            required
                        />
                    </Form.Group>
                </div>
            </div>
        </div>
    </div>
))}



                
                <Form.Group className="mb-3" controlId="formDesc" id='formDesc'>
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        name="desc"
                        value={formData.desc}
                        onChange={handleInputChange}
                        required
                    />
                </Form.Group>
                
                <Button variant="primary" type="submit">Create Tour</Button>
            </Form>
        </div>
    );
}

export default CreateTour;

