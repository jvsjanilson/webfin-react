import React, {useState, useEffect} from "react";
import { Table, Form, Dropdown, Button, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'
import api from '../../config/api';
import Paginacao from "../../components/Paginacao";
import { FaEdit, FaTrash } from "react-icons/fa";
import MessageDelete from "../../components/MessageDelete";

export default function IndexEstado() {

    const [ dados, setDados ] = useState([])
    const [ paginate, setPaginate ] = useState({});
    const [ searchText, setSearchText ] = useState('')
    const [ pk, setPk ] = useState(0)
    const [ showDelete, setShowDelete] = useState(false);
    const endpoint = 'estados';

    const handleClose = () => setShowDelete(false);
    const handleStatus = async (id, status) => {

        await api.put(`${endpoint}/${id}`,{
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

    async function getDados(page = 1) {
        page = page > 1 ? '?page='+page : ''

        let busca = ''      

        if (searchText != "" && page == '') {
            busca = '?nome=' + searchText
        } else if (searchText != "" && page != '') {
            busca = '&nome=' + searchText
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
        setShowDelete(false)
       
        await api.delete(`${endpoint}/${pk}`)
            .then(res => {
                if (res.status == 204){
                    setDados(dados.filter(e => e.id != pk))
                } 
            })
            .catch(e => {
                if (e.response.status == 400)
                    alert(e.response.data.message)
            })
        
    }

    const dialogDelete = async (id) => {
        setPk(id)
        setShowDelete(true)
    }

    useEffect( () => {
        getDados()

    }, [searchText])

    return (
        <Container fluid>

            <MessageDelete show={showDelete} onHide={handleClose} onConfirm={handleConfirmarDelete} />
                
            <Form className="d-flex mb-2">
                <LinkContainer to="/estados/create">
                    <Button active className="me-2" variant="primary">Adicionar</Button>
                </LinkContainer>
                  <Form.Control
                    type="search"
                    placeholder="Pesquisar"
                    onChange={(e) => setSearchText(e.target.value)}
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
                                                    <Dropdown.Item href="javascript:void(0)" onClick={dialogDelete.bind(this,el.id)}><FaTrash color="red" /> Remover</Dropdown.Item>
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
