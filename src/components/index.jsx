import React from "react";
import { Form, Card, Button,  Row, Col, Dropdown, Pagination } from 'react-bootstrap';
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

function Paginacao({evento, paginas }) {
    const { meta, links, ...rest } = paginas;
    return (
        
        <Pagination >
            <Pagination.First onClick={evento.bind(this,1)}/>
            <Pagination.Prev disabled={ links?.prev == null ? true : false } 
                onClick={links?.prev == null ? null: evento.bind(this, links?.prev.split('?')[1].split('=')[1])}
            />
            
            {
            
                meta?.links?.map((item, index )=> {
                    
                    if (index > 0) {
                        if (item.url == null && item.label == '...')
                            return (<Pagination.Ellipsis key={index} disabled />)
                        else {
                            if (!isNaN(parseInt(item.label))) {

                                return <Pagination.Item key={index}
                                            disabled={item.active ? true: false} 
                                            onClick={evento.bind(this, parseInt(item.label))}
                                        >{item.label}</Pagination.Item>
                            }
                        }
                    }

                })
            }
            <Pagination.Next  disabled={ links?.next == null ? true : false }
                onClick={links?.next == null ? null : evento.bind(this, links?.next.split('?')[1].split('=')[1])}
            />
            <Pagination.Last onClick={evento.bind(this, meta?.last_page)}/>
        </Pagination> 
    )
}

export { 
    HeaderCadastro, 
    FooterCadastro, 
    Options, 
    Search,
    Paginacao
}
