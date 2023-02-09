import React, {useState, useEffect} from "react";
import { Table, Form, Dropdown, Button, Container, Modal, FloatingLabel, Row, Col} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap'
import api from '../../config/api';
import Paginacao from "../../components/Paginacao";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";


const Estados = () => {
    const [estados, setEstados ] = useState([])
    const [paginate, setPaginate ] = useState({});
    const [search, setSearch] = useState('')
    const [register, setRegister] = useState(0)
    const [show, setShow] = useState(false);
    const [ativo, setAtivo] = useState(false)
    const handleClose = () => setShow(false);
  

    const handleAtivo = async (id, status) => {

        await api.put(`estados/${id}`,{
            ativo : status == 1 ? 0 : 1
        })
        .then(res => {
            if (res.status == 204) {
                setEstados([...estados], estados.map((el) => {
                    if (el.id == id) {
                        el.ativo = el.ativo == 0 ? 1 : 0
                        return el
                    }
                    return el
                }))
            }
        }).catch(error => {
            console.log(error)
            alert('Error')
        })        
    }

    async function getEstados(page = 1) {
        page = page > 1 ? '?page='+page : ''

        let busca = ''      

        if (search != "" && page == '') {
            busca = '?nome=' + search
        } else if (search != "" && page != '') {
            busca = '&nome=' + search
        }
        
        await api.get(`estados${page}${busca}`)
           
            .then((res) => {
                setEstados(res.data.data)
                setPaginate({
                    meta: res.data.meta,
                    links: res.data.links
                })
            });
    }

    const handleConfirmarDelete = async () => {
        setShow(false)
       
        await api.delete('estados/'+register)
            .then(res => {

                if (res.status == 204){
                    setEstados(estados.filter((i) => i.id != register))
                } 
            })
            .catch(e => {
                if (e.response.status == 400)
                    alert(e.response.data.message)
            })
        
    }

    const handleDeleteEstado = async (id) => {
        setRegister(id)
        setShow(true)

    }

    useEffect( () => {
        getEstados()

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
                <LinkContainer to="/estados/create">
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
                        <th style={{width: '4rem', textAlign: 'center'}}>UF</th>
                        <th>Nome do estado</th>
                        <th style={{width: '4rem'}}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {estados.map(el => {
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
                                                    <LinkContainer to={`/estados/edit/${el.id}`}>
                                                        <Dropdown.Item href="javascript:void(0)"><FaEdit className="text-success" /> Editar</Dropdown.Item>
                                                    </LinkContainer>
                                                    <Dropdown.Item href="javascript:void(0)" onClick={handleDeleteEstado.bind(this,el.id)}><FaTrash color="red" /> Remover</Dropdown.Item>
                                                </Dropdown.Menu>
                                            </div>
                                        </Dropdown>
                                    }   
                                </td>                                
                                <td style={{textAlign: 'center'}}>{el.uf}</td>
                                <td>{el.nome}</td>
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
                    <Paginacao paginas={paginate} evento={getEstados.bind(this)} />
                </tfoot>
        </Container>
    )
}

export default Estados