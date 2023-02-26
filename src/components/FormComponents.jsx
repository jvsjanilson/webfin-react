import React from "react";
import { 
    Card, Button,  Row, Col 
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'
import { FaArrowLeft, FaSave } from "react-icons/fa";

function HeaderCadastro({router, title}) {
    return (
        <Card.Header>
            <Row>
                <Col xs={6} md={6} className="d-flex justify-content-start align-items-center">
                    <LinkContainer to={router} className='me-1'>
                        <Button  variant="light"><FaArrowLeft/> VOLTAR</Button>
                    </LinkContainer>
                </Col>
                <Col xs={6} md={6} className="d-flex align-items-center justify-content-end">
                    <h5 className='titulo_cad' >{title}</h5>
                </Col>
            </Row>                              
        </Card.Header>
    )
}

function FooterCadastro(props) {
    return (
        <Card.Footer>
            <Row >
                <Col className="d-flex justify-content-end" >
                    <Button  type='submit' variant='success'><FaSave/> {props.saveTitle ? props.saveTitle : 'SALVAR'}</Button>
                </Col>
            </Row>
        </Card.Footer> 
    )
}

export { HeaderCadastro, FooterCadastro }