import React, { useState } from 'react';
import { Container, Row, Col, Form, FormGroup, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../../utils/config';
import loginImg from '../../assets/images/login.png'
import userIcon from '../../assets/images/user.png'

const ResetPassword = () => {
   const [formData, setFormData] = useState({
      email: '',
      newPassword: ''
   });
   const [message, setMessage] = useState('');

   const handleChange = e => {
      setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
   };

   const handleSubmit = async e => {
      e.preventDefault();

      try {
         const response = await fetch(`${BASE_URL}/auth/reset-password`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
         });

         const result = await response.json();

         if (response.ok) {
            setMessage(result.message);
         } else {
            setMessage(result.message);
         }
      } catch (error) {
         setMessage('An error occurred. Please try again later.');
      }
   };

   return (
      <section>
         <Container>
            <Row>
               <Col lg='8' className='m-auto'>
                  <div className="login__container d-flex justify-content-between">
                     <div className="login__img">
                        <img src={loginImg} alt="" />
                     </div>
                     <div className="login__form">
                        <div className="user">
                           <img src={userIcon} alt="" />
                        </div>
                        <h2>Reset Password</h2>
                        <p>Please enter your email and new password to reset your password.</p>
                        {message && <p className="text-danger">{message}</p>}
                        <Form onSubmit={handleSubmit}>
                           <FormGroup>
                              <input
                                 type="email"
                                 name="email"
                                 placeholder="Email"
                                 value={formData.email}
                                 onChange={handleChange}
                                 required
                              />
                           </FormGroup>
                           <FormGroup>
                              <input
                                 type="password"
                                 name="newPassword"
                                 placeholder="New Password"
                                 value={formData.newPassword}
                                 onChange={handleChange}
                                 required
                              />
                           </FormGroup>
                           <Button className='btn secondary__btn auth__btn' type='submit'>Reset Password</Button>
                        </Form>
                        <p>Remember your password? <Link to='/login'>Login</Link></p>
                     </div>
                  </div>
               </Col>
            </Row>
         </Container>
      </section>
   );
};

export default ResetPassword;
