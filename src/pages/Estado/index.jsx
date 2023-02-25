import React, {useState, useEffect} from "react";
import { Table, Form, Dropdown, Button, Container, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'
import api from '../../config/api';
import Paginacao from "../../components/Paginacao";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import MessageDelete from "../../components/MessageDelete";

export default function IndexEstado() {

    const [ dados, setDados ] = useState([])
    const [ paginate, setPaginate ] = useState({});
    const [ searchText, setSearchText ] = useState('')
    const [ pk, setPk ] = useState(0)
    const [ showDelete, setShowDelete] = useState(false);
    const endpoint = '/api/estados';

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

    const handleClose = () => setShowDelete(false);
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
                
            <Row className="mb-2 d-flex justify-content-between g-1">
                <Col xs={6} md={11}>
                    <Form.Control
                        type="search"
                        placeholder="Pesquisa"
                        onChange={(e) => setSearchText(e.target.value)}
                        aria-label="Search"
                        className="me-2"
                        />
                </Col>
                <Col xs={6} md={1} className="d-flex justify-content-end">
                    <LinkContainer to="/estados/create" className="btn-new">
                        <Button  active variant="primary">Adicionar <FaPlus/></Button>
                    </LinkContainer>
                </Col>
            </Row>            
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
                                                        <Dropdown.Item ><FaEdit className="text-success" /> Editar</Dropdown.Item>
                                                    </LinkContainer>
                                                    <Dropdown.Item onClick={dialogDelete.bind(this,el.id)}><FaTrash color="red" /> Remover</Dropdown.Item>
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
