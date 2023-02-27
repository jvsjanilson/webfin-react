import React, { useState } from "react";
import { 
    Container, Form, Card, FloatingLabel,
    Row, Col, Button
} from "react-bootstrap";
import api from '../../config/api'

import { useNavigate } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { FaUserPlus } from 'react-icons/fa'

export default function Register() {
    const navigate = useNavigate()

    const [user, setUser] = useState({
        name: '',
        email: '',
        password: ''
    })

    const [messages, setMessages] = useState({
        name: '',
        email: '',
        password: ''
    })

    const handleChange = (event) => {
        let value = event.target.value
        let name = event.target.name

        setUser((state) => {
            return {
                ...state, [name]: value
            }
        })
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        await api.post('api/register', user)
            .then(() => {
                navigate('/')
            })
            .catch(error => {
                if (error.response.status == 422) {
                    const { data, ...rest } = error.response;
                    let fields = Object.entries(data)
                    fields.forEach((value) => {
                        setMessages((state) => {
                            return {
                                ...state, [value[0]]: value[1].join("\n ")
                            }
                        })
                    }) 
                }
            })

    }


    return (
        <Container fluid>
            <Form noValidate  onSubmit={handleSubmit}>
                <Row className="d-flex justify-content-center align-items-center vh-100">
                    <Col sm={3} >
                        <Card className="card-outline">
                            <Card.Header className="text-center"><h5>Registro de novo usuário</h5></Card.Header>

                            <Card.Body>

                                <FloatingLabel controlId="name" label="Nome do usuário" className="mb-2">
                                    <Form.Control name="name" type="text" autoFocus maxLength={60} onChange={handleChange} />
                                <Form.Control.Feedback type="invalid" style={{display: messages.name ? 'block': 'none'}}>
                                    {messages.name}
                                </Form.Control.Feedback>
                                </FloatingLabel>

                                <FloatingLabel controlId="email" label="E-mail" className="mb-2">
                                    <Form.Control name="email" type="email" maxLength={120} onChange={handleChange}/>
                                <Form.Control.Feedback type="invalid" style={{display: messages.email ? 'block': 'none'}}>
                                    {messages.email}
                                </Form.Control.Feedback>
                                </FloatingLabel>


                                <FloatingLabel controlId="password" label="Senha" className="">
                                    <Form.Control name="password" type="password" maxLength={60} onChange={handleChange} />

                                <Form.Control.Feedback type="invalid" style={{display: messages.password ? 'block': 'none'}}>
                                    {messages.password}
                                </Form.Control.Feedback>
                                </FloatingLabel>

                            </Card.Body>
                            <Card.Footer className="d-flex justify-content-between align-items-center">
                            <LinkContainer to="/" className='me-1'>
                                <a>Login</a>
                            </LinkContainer>
                                <Button type="submit" variant="primary"><FaUserPlus/> Registrar</Button>
                            </Card.Footer>
                        </Card>
                    </Col>
                </Row>
                

            </Form>
        </Container>
    )
}