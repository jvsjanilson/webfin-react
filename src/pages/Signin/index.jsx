
import React, {useState} from "react";
import { Button, Card, Col, Container, Form, Row, FloatingLabel } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useAuth } from "../../hooks/auth";
import { FaSignInAlt } from 'react-icons/fa'

export default function Signin() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { signIn, msgError } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
   
        signIn(email, password);
       
    }

    return (
        <Container fluid className="" >
         {/* <Container fluid className="" style={{backgroundColor: '#1a565a'}}> */}

            <Form noValidate onSubmit={handleSubmit}>
                

                <Row className="d-flex justify-content-center align-items-center vh-100">
                    <Col sm={3} >
                        <Card className="card-outline">
                            <Card.Header className="text-center"><h5>Autenticação</h5></Card.Header>

                            <Card.Body>

                                <FloatingLabel controlId="email" label="E-mail" className="mb-2">
                                    <Form.Control type="email" autoFocus onChange={(e) => setEmail(e.target.value)} />
                                </FloatingLabel>

                                <FloatingLabel controlId="password" label="Senha" className="">
                                    <Form.Control type="password" onChange={(e) => setPassword(e.target.value)} />
                                </FloatingLabel>

                                <Form.Control.Feedback style={{display: msgError ? 'block': 'none'}} 
                                    type="invalid">{msgError}</Form.Control.Feedback>

                            </Card.Body>
                            <Card.Footer className="d-flex justify-content-between align-items-center">
                            <LinkContainer to="/register" className='me-1'>
                                <a>Registrar</a>
                            </LinkContainer>
                                <Button type="submit" variant="primary"><FaSignInAlt/>  Entrar</Button>
                            </Card.Footer>
                        </Card>
                    </Col>
                </Row>
                

            </Form>
        </Container>
    )
}