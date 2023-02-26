import React from "react";
import { Form, Card, Button,  Row, Col, Dropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'
import { FaArrowLeft, FaSave, FaEdit, FaTrash, FaPlus } from "react-icons/fa";

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

function Search({router, onChange, insertTitle}) {
    return (
        <Row className="mb-2 d-flex justify-content-between g-1" >
            <Col xs={6} md={11}>
                <Form.Control type="search" placeholder="Pesquisa"
                    onChange={onChange} className="me-2" />
            </Col>
            <Col xs={6} md={1} className="d-flex justify-content-end">
                <LinkContainer to={`/${router}/create`} className="btn-new">
                    <Button active variant="primary">
                        {insertTitle ? insertTitle : 'Adicionar'} <FaPlus/>
                    </Button>
                </LinkContainer>
            </Col>
        </Row>
    )
}

export { HeaderCadastro, FooterCadastro, Options, Search }
