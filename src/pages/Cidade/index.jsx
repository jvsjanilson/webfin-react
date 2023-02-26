import React, {useState, useEffect} from "react";
import { Table, Form, Button, Col, Row} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'
import Container from 'react-bootstrap/Container';
import Paginacao from "../../components/Paginacao";
import { FaPlus } from "react-icons/fa";
import api from '../../config/api';
import MessageDelete from "../../components/MessageDelete";
import { Options } from "../../components/Components";

export default function IndexCidade() {
    
    const endpoint = '/api/cidades'
    const [dados, setDados ] = useState([])
    const [paginate, setPaginate ] = useState({});
    const [search, setSearch] = useState('')
    const [register, setRegister] = useState(0)
    const [show, setShow] = useState(false);

    /**
     * Handles
     */
    const handleClose = () => setShow(false);
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
        
        await api.get(`${endpoint}${page}${busca}`)
           
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
                    <LinkContainer to="/cidades/create" className="btn-new">
                        <Button  active variant="primary">Adicionar <FaPlus/></Button>
                    </LinkContainer>
                </Col>
            </Row>

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
                                    <Options delete={dialogDelete.bind(this, el.id)} 
                                        id={el.id} router="cidades" /> 
                                </td>
                                <td>{el.nome}</td>
                                <td style={{textAlign: 'center'}}>{el.uf}</td>
                                
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
