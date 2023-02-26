import React from "react";
import { 
    Card, Button,  Row, Col 
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'
import { FaArrowLeft } from "react-icons/fa";

export default function HeaderCadastro(props) {
    return (
        <Card.Header>
            <Row>
                <Col xs={6} md={6} className="d-flex justify-content-start align-items-center">
                    <LinkContainer to={props.router} className='me-1'>
                        <Button  variant="light"><FaArrowLeft/> VOLTAR</Button>
                    </LinkContainer>
                </Col>
                <Col xs={6} md={6} className="d-flex align-items-center justify-content-end">
                    <h5 className='titulo_cad' >CONTA A PAGAR</h5>
                </Col>
            </Row>                              
        </Card.Header>
    )
}