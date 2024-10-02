import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import '../../styles/ContactManagement.css';

function ContactManagement() {
    const [contacts, setContacts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showReplyModal, setShowReplyModal] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);
    const [replyMessage, setReplyMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [contactsPerPage] = useState(8);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        axios.get('http://localhost:8000/api/v1/contact', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(response => setContacts(response.data))
        .catch(error => console.error(error));
    }, []);

    const handleReplyContact = id => {
        setSelectedContact(id);
        setShowReplyModal(true);
    };

    const handleSendReply = () => {
        const token = localStorage.getItem("accessToken");
        axios.post('http://localhost:8000/api/v1/contact/reply', {
            contactId: selectedContact._id,
            replyMessage
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        .then(() => {
            setShowReplyModal(false);
            setReplyMessage('');
        })
        .catch(error => console.error(error));
    };

    const handleShowModal = contact => {
        setSelectedContact(contact);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedContact(null);
    };

    const indexOfLastContact = currentPage * contactsPerPage;
    const indexOfFirstContact = indexOfLastContact - contactsPerPage;
    const currentContacts = contacts.slice(indexOfFirstContact, indexOfLastContact);

    return (
        <div className="contacts-container p-6 bg-gray-100">
            <h2 className="text-2xl font-bold mb-4">Contact Management</h2>
            <Table striped bordered hover>
                <thead className="bg-gray-200">
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Message</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentContacts.map(contact => (
                        <tr key={contact._id} className="bg-white hover:bg-gray-50">
                            <td onClick={() => handleShowModal(contact)}>{contact.name}</td>
                            <td onClick={() => handleShowModal(contact)}>{contact.email}</td>
                            <td onClick={() => handleShowModal(contact)}>{contact.message}</td>
                            <td>
                                <Button variant="secondary" onClick={() => handleReplyContact(contact._id)}>Reply</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {selectedContact && (
                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Contact Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p><strong>Name:</strong> {selectedContact.name}</p>
                        <p><strong>Email:</strong> {selectedContact.email}</p>
                        <p><strong>Message:</strong> {selectedContact.message}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
                    </Modal.Footer>
                </Modal>
            )}

            {selectedContact && (
                <Modal show={showReplyModal} onHide={() => setShowReplyModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Reply to {selectedContact.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="replyMessage">
                                <Form.Label>Reply Message</Form.Label>
                                <Form.Control 
                                    as="textarea" 
                                    rows={5} 
                                    value={replyMessage} 
                                    onChange={e => setReplyMessage(e.target.value)} 
                                    placeholder="Type your reply here..."
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowReplyModal(false)}>Close</Button>
                        <Button variant="primary" onClick={handleSendReply}>Send Reply</Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
}

export default ContactManagement;
