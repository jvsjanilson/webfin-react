import React, {useState, useEffect} from "react";
import { Table, Form, Dropdown, Button, Modal} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'
import Container from 'react-bootstrap/Container';
import Paginacao from "../../components/Paginacao";
import { FaEdit, FaTrash } from "react-icons/fa";
import api from '../../config/api';
import MessageDelete from "../../components/MessageDelete";

const Cidades = () => {
    
    const recurso = 'cidades'
    const [dados, setDados ] = useState([])
    const [paginate, setPaginate ] = useState({});
    const [search, setSearch] = useState('')
    const [register, setRegister] = useState(0)
    const [show, setShow] = useState(false);

    /**
     * Handles
     */
    const handleClose = () => setShow(false);
    const handleStatus = async (id, status) => {

        await api.put(`${recurso}/${id}`,{
            ativo : status == 1 ? 0 : 1
        })
        .then(res => {
            if (res.status == 204) {
                setDados(dados.map(e => {
                    if (e.id == id) 
                        e.ativo = e.ativo == 0 ? 1 : 0
                    return e
                }))
            }
        }).catch(error => {
            alert('Error')
        })        
    }

    const handleConfirmarDelete = async () => {
        setShow(false)
       
        await api.delete(`${recurso}/${register}`)
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

    /**
     * Dialogs
     */
    const dialogDelete = async (id) => {
        setRegister(id)
        setShow(true)

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

    useEffect( () => {
        getDados()

    }, [search])

    return (
        <Container fluid>

            <MessageDelete show={show} onHide={handleClose} onConfirm={handleConfirmarDelete} />

            <Form className="d-flex mb-2">
                
                <LinkContainer to="/cidades/create">
                    <Button active className="me-2" variant="primary">Adicionar</Button>
                </LinkContainer>

                <Form.Control
                    type="search"
                    placeholder="Pesquisar"
                    onChange={(e) => setSearch(e.target.value)}
                    aria-label="Search"
                />
            </Form>

            <Table responsive="sm" size="sm" bordered hover >
                <thead className="table-dark">
                    <tr>
                        <th style={{textAlign: 'center'}} >#</th>
                        <th>Nome da cidade</th>
                        <th style={{width: '4rem', textAlign: 'center'}}>UF</th>
                        
                        <th style={{width: '4rem'}}>Status</th>
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
                                        
                                                <Dropdown.Menu >
                                                    <LinkContainer to={`/cidades/edit/${el.id}`}>
                                                            <Dropdown.Item href="javascript:void(0)"><FaEdit className="text-success" /> Editar</Dropdown.Item>
                                                    </LinkContainer>

                                                    <Dropdown.Item href="javascript:void(0)" onClick={dialogDelete.bind(this, el.id)}><FaTrash color="red" /> Remover</Dropdown.Item>
                                                </Dropdown.Menu>
                                            </div>
                                        </Dropdown>
                                    }
                                </td>
                                <td>{el.nome}</td>
                                <td style={{textAlign: 'center'}}>{el.uf}</td>
                                
                                <td>
                                <Form.Switch style={{textAlign: 'center'}}
                                    type="switch"
                                    id="custom-switch"
                                    checked={el.ativo ? true: false}
                                    onChange={handleStatus.bind(this, el.id, el.ativo)}
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

export default Cidades