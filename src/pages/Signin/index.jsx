import axios from "axios";
import React, {useState} from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useAuth } from "../../hooks/auth";

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
                            <Card.Header className="text-center">Autenticação</Card.Header>
                            <Card.Body>
                                <Form.Label>E-mail</Form.Label>
                                <Form.Control type="email" required autoFocus 
                                    className="mb-3" onChange={(e) => setEmail(e.target.value)}/>
                    
                                <Form.Label>Senha</Form.Label>
                                <Form.Control type="password" required minLength={6}
                                    className="mb-3"  onChange={(e) => setPassword(e.target.value)}/>
                                <Form.Control.Feedback style={{display: msgError ? 'block': 'none'}} type="invalid">{msgError}</Form.Control.Feedback>

                            </Card.Body>
                            <Card.Footer className="d-flex justify-content-end">
                                <Button type="submit" variant="primary">ENTRAR</Button>
                            </Card.Footer>
                        </Card>
                    </Col>
                </Row>
                

            </Form>
        </Container>
    )
}