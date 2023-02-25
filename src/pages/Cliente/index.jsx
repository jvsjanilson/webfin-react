import React, { useState, useEffect } from "react";
import { Table, Form, Dropdown, Button, Container, FloatingLabel, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'
import api from '../../config/api';
import Paginacao from "../../components/Paginacao";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import MessageDelete from "../../components/MessageDelete";

export default function IndexCliente() {

    const endpoint = '/api/clientes'
    const [dados, setDados ] = useState([])
    const [paginate, setPaginate ] = useState({})
    const [search, setSearch] = useState('')
    const [register, setRegister] = useState(0)
    const [show, setShow] = useState(false)

    const handleClose = () => setShow(false)
    const handleStatus = async ({id, ativo}) => {

        await api.put(`${endpoint}/${id}`,{
            ativo : !ativo
        })
        .then(res => {
            if (res.status == 204) {
                setDados(dados.map(e => {
                    if (e.id == id) e.ativo = !ativo
                    return e
                }))
            }
        }).catch(error => {
            alert('Error')
        })        
    }


    async function getDados(page = 1) {
        page = page > 1 ? '?page='+page : ''

        let busca = ''      

        if (search != "" && page == '') {
            busca = '?nome=' + search
        } else if (search != "" && page != '') {
            busca = '&nome=' + search
        }
        
        await api.get(`${endpoint}${page}${busca}`)
           
            .then((res) => {
                setDados(res.data.data)
                setPaginate({
                    meta: res.data.meta,
                    links: res.data.links
                })
            });
    }

    const handleConfirmarDelete = async () => {
        setShow(false)
       
        await api.delete(`${endpoint}/${register}`)
            .then(res => {
                if (res.status == 204){
                    setDados(dados.filter(e => e.id != register))
                } 
            })
            .catch(e => {
                if (e.response.status == 400)
                    alert(e.response.data.message)
            })
        
    }

    const dialogDelete = async (id) => {
        setRegister(id)
        setShow(true)
    }

    useEffect( () => {
        getDados()

    }, [search])

    return (
        <Container fluid>
            <MessageDelete show={show} onHide={handleClose} onConfirm={handleConfirmarDelete} />
                  
            <Row className="mb-2 d-flex justify-content-between g-1" >
                <Col xs={6} md={11}>
                <Form.Control
                    type="search"
                    placeholder="Pesquisa"
                    onChange={(e) => setSearch(e.target.value)}
                    aria-label="Search"
                    className="me-2"
                    />
                </Col>
                <Col xs={6} md={1} className="d-flex justify-content-end">
                    <LinkContainer to="/clientes/create" className="btn-new">
                        <Button  active variant="primary">Adicionar <FaPlus/></Button>
                    </LinkContainer>
                </Col>
            </Row>
    
            
            <Table responsive="sm" size="sm" striped bordered hover >
                <thead  className="table-dark">
                    <tr>
                        <th style={{textAlign: 'center'}} >#</th>
                        <th >Nome do cliente</th>
                        <th style={{width: '10rem'}}>CPF/CNPJ</th>
                        <th style={{width: '8rem'}}>Celular</th>
                        <th style={{width: '5rem', textAlign: 'center'}}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {dados.map(el => {
                        return (
                            <tr key={el.id}>
                                <td style={{width: '5rem'}} >
                                    {
                                        
                                        <Dropdown >
                                        {/* <Dropdown style={{display: 'flex', height: '25px', alignItems: 'center'}}> */}
                                            <div className="d-grid gap-2">
                                                <Dropdown.Toggle   size="sm" variant="primary" id="dropdown-basic">
                                                    Opções
                                                </Dropdown.Toggle>
                                        
                                                <Dropdown.Menu variant="">
                                                    <LinkContainer to={`/clientes/edit/${el.id}`}>
                                                        <Dropdown.Item ><FaEdit className="text-success" /> Editar</Dropdown.Item>
                                                    </LinkContainer>
                                                    <Dropdown.Item  onClick={dialogDelete.bind(this,el.id)}><FaTrash color="red" /> Remover</Dropdown.Item>
                                                </Dropdown.Menu>
                                            </div>
                                        </Dropdown>
                                    }   
                                </td>                                
                                <td>{el.nome}</td>
                                <td>{el.cpfcnpj}</td>
                                <td>{el.celular}</td>
                                
                                <td>
                                    <Form.Switch style={{textAlign: 'center'}}
                                        type="switch"
                                        id="custom-switch"
                                        checked={el.ativo ? true: false}
                                        onChange={handleStatus.bind(this, el)}
                                    />
                                </td>

                            </tr>
                        )
                    })}
                </tbody>
                </Table>
                <Paginacao paginas={paginate} evento={getDados.bind(this)} />
                
        </Container>
    )    
}
