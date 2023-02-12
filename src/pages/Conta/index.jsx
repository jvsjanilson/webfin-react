import React, {useState, useEffect} from "react";
import { Table, Form, Dropdown, Button, Container, Modal} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap'
import api from '../../config/api';
import Paginacao from "../../components/Paginacao";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";


const IndexConta = () => {

    const [dados, setDados ] = useState([])
    const [paginate, setPaginate ] = useState({});
    const [search, setSearch] = useState('')
    const [register, setRegister] = useState(0)
    const [show, setShow] = useState(false);

    const recurso = 'contas'

    const handleClose = () => setShow(false);

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
            console.log(error)
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
                        <th style={{width: '6rem'}}>N. Banco</th>
                        <th style={{width: '7rem'}}>N. Agencia</th>
                        <th style={{width: '8rem'}}>N. Conta</th>
                        <th>Descrição</th>
                        <th style={{width: '10rem', textAlign: 'right'}}>Saldo</th>
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
                                                    <LinkContainer to={`/estados/edit/${el.id}`}>
                                                        <Dropdown.Item href="javascript:void(0)"><FaEdit className="text-success" /> Editar</Dropdown.Item>
                                                    </LinkContainer>
                                                    <Dropdown.Item href="javascript:void(0)" onClick={handleDeleteRegistro.bind(this,el.id)}><FaTrash color="red" /> Remover</Dropdown.Item>
                                                </Dropdown.Menu>
                                            </div>
                                        </Dropdown>
                                    }   
                                </td>                                
                                <td>{el.numero_banco}</td>
                                <td>{el.numero_agencia}</td>
                                <td>{el.numero_conta}</td>
                                <td>{el.descricao}</td>
                                <td style={{textAlign: 'right'}}>
                                    {new Intl.NumberFormat('pt-BR',{ style: 'currency', currency: 'BRL' }).format(parseFloat(el.saldo).toFixed(2))}
                                </td>
                                
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

export default IndexConta