import React from 'react'
import { Container, Row, Col, Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import '../../styles/thank-you.css'

const SuccessPayment = () => {
    return (
        <section>
            <Container>
                <Row>
                    <Col lg='12' className='pt-5 text-center'>
                        <div className="Success_Payment">
                            <span><i classsname='ri-checkbox-circle-line'></i></span>
                            <h1 className='mb-3 fw-semibold'>Payment Successfull</h1>
                            <h3 className='mb-4'>Waiting 24h to staff check and confirm for you</h3>

                            <Button className='btn primary__btn w-25'><Link to='/home'>Back To Home</Link></Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    )
}

export default SuccessPayment