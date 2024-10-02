import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/contact.css';
import CommonSection from '../../shared/CommonSection';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/api/v1/contact ', formData);
      setStatus(response.data.message);
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setStatus('Failed to send message');
    }
  };

  return (
    <>
      <CommonSection title={"Contact"} />
      <div className="contact-container">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h2>Thông tin liên hệ</h2>
              <p><strong>Địa chỉ:</strong> Km29, Đại lộ Thăng Long, Hà Nội</p>
              <p><strong>Email:</strong> quanghiennguyen.business@fpt.edu.vn</p>
              <p><strong>Phone:</strong> 0123456789</p>
            </div>
            <div className="col-md-6">
              <h2>Gửi tin nhắn cho chúng tôi</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Tên</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="message" className="form-label">Tin nhắn</label>
                  <textarea
                    className="form-control"
                    id="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Gửi</button>
              </form>
              {status && <p>{status}</p>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
