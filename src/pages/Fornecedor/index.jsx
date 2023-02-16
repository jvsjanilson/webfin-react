import React, { useState, useEffect } from "react";
import { Table, Form, Dropdown, Button, Container, Modal } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'
import api from '../../config/api';
import Paginacao from "../../components/Paginacao";
import { FaEdit, FaTrash } from "react-icons/fa";

const IndexFornecedor = () => {

    const recurso = 'fornecedores'

    const [dados, setDados ] = useState([])
    const [paginate, setPaginate ] = useState({})
    const [search, setSearch] = useState('')
    const [register, setRegister] = useState(0)
    const [show, setShow] = useState(false)

    const handleClose = () => setShow(false)

    const handleAtivo = async (id, status) => {

        await api.put(`${recurso}/${id}`,{
            ativo : status == 1 ? 0 : 1
        })
        .then(res => {
            if (res.status == 204) {
                setDados([...dados], dados.map((el) => {
                    if (el.id == id) {
                        el.ativo = el.ativo == 0 ? 1 : 0
                        return el
                    }
                    return el
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
        
        await api.get(`${recurso}${page}${busca}`)
           
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
       
        await api.delete(`${recurso}/${register}`)
            .then(res => {
                if (res.status == 204){
                    setDados(dados.filter((i) => i.id != register))
                } 
            })
            .catch(e => {
                if (e.response.status == 400)
                    alert(e.response.data.message)
            })
        
    }

    const handleDeleteRegistro = async (id) => {
        setRegister(id)
        setShow(true)
    }

    useEffect( () => {
        getDados()

    }, [search])

    return (
        <Container fluid>

            <Modal show={show} onHide={handleClose} animation={true}  
                aria-labelledby="contained-modal-title-vcenter" centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Remover</Modal.Title>
                </Modal.Header>
                <Modal.Body>Deseja realmente remover?</Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleClose} >Cancelar</Button>
                    <Button variant="success" onClick={handleConfirmarDelete}>Confirmar</Button>
                </Modal.Footer>
            </Modal>
                
            <Form className="d-flex mb-2">
                <LinkContainer to="/fornecedores/create">
                    <Button active className="me-2" variant="primary">Adicionar</Button>
                </LinkContainer>
                  <Form.Control
                    type="search"
                    placeholder="Pesquisar"
                    onChange={(e) => setSearch(e.target.value)}
                    aria-label="Search"
                  />
    
            </Form>
            <Table responsive="sm" size="sm" striped bordered hover >
                <thead  className="table-dark">
                    <tr>
                        <th style={{textAlign: 'center'}} >#</th>
                        <th >Nome do fornecedor</th>
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
                                        
                                        <Dropdown>
                                            <div className="d-grid gap-2">
                                                <Dropdown.Toggle   size="sm" variant="primary" id="dropdown-basic">
                                                    Opções
                                                </Dropdown.Toggle>
                                        
                                                <Dropdown.Menu variant="">
                                                    <LinkContainer to={`/fornecedores/edit/${el.id}`}>
                                                        <Dropdown.Item href="javascript:void(0)"><FaEdit className="text-success" /> Editar</Dropdown.Item>
                                                    </LinkContainer>
                                                    <Dropdown.Item href="javascript:void(0)" onClick={handleDeleteRegistro.bind(this,el.id)}><FaTrash color="red" /> Remover</Dropdown.Item>
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
                                        onChange={handleAtivo.bind(this, el.id, el.ativo)}
                                    />
                                </td>

                            </tr>
                        )
                    })}
                </tbody>
                </Table>
                 <tfoot>
                    <Paginacao paginas={paginate} evento={getDados.bind(this)} />
                </tfoot>
        </Container>
    )    
}

export default IndexFornecedor