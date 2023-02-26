import React from "react";
import { Card, Button,  Row, Col, Dropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'
import { FaArrowLeft, FaSave, FaEdit, FaTrash } from "react-icons/fa";

function HeaderCadastro({router, title, buttonTitle}) {
    return (
        <Card.Header>
            <Row>
                <Col xs={6} md={6} className="d-flex justify-content-start align-items-center">
                    <LinkContainer to={router} className='me-1'>
                        <Button variant="light">
                            <FaArrowLeft/> {buttonTitle ? buttonTitle : 'VOLTAR'}
                        </Button>
                    </LinkContainer>
                </Col>
                <Col xs={6} md={6} className="d-flex align-items-center justify-content-end">
                    <h5 className='titulo_cad' >{title}</h5>
                </Col>
            </Row>                              
        </Card.Header>
    )
}

function FooterCadastro({saveTitle}) {
    return (
        <Card.Footer>
            <Row >
                <Col className="d-flex justify-content-end" >
                    <Button type='submit' variant='success'>
                        <FaSave/> {saveTitle ? saveTitle : 'SALVAR'}
                    </Button>
                </Col>
            </Row>
        </Card.Footer> 
    )
}

function Options({router, onDelete, editTitle, removeTitle, optionTitle, id}) {
    return (
        <Dropdown>
            <div className="d-grid gap-2">
                <Dropdown.Toggle size="sm" variant="primary" id="dropdown-basic">
                    {optionTitle ? optionTitle : 'Opções'}
                </Dropdown.Toggle>
        
                <Dropdown.Menu >
                    <LinkContainer to={`/${router}/edit/${id}`} >
                        <Dropdown.Item >
                            <FaEdit className="text-success" /> {editTitle ? editTitle : 'Editar'} 
                        </Dropdown.Item>
                    </LinkContainer>

                    <Dropdown.Item onClick={onDelete}>
                        <FaTrash color="red" /> {removeTitle ? removeTitle : 'Remover'}
                    </Dropdown.Item>
                </Dropdown.Menu>
            </div>
        </Dropdown>

    )
}

export { HeaderCadastro, FooterCadastro, Options }
