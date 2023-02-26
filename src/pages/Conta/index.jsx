import React, { useState, useEffect } from "react";
import { Table, Form, Button, Container, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'
import api from '../../config/api';
import Paginacao from "../../components/Paginacao";
import { FaPlus } from "react-icons/fa";
import MessageDelete from "../../components/MessageDelete";
import { Options } from "../../components/Components";

export default function IndexConta () {

    const endpoint = '/api/contas'
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
            <Row className="mb-2 d-flex justify-content-between g-1">
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
                    <LinkContainer to="/contas/create" className="btn-new">
                        <Button  active variant="primary">Adicionar <FaPlus/></Button>
                    </LinkContainer>
                </Col>
            </Row>      
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
                                    <Options delete={dialogDelete.bind(this, el.id)} 
                                        id={el.id} router="contas" /> 
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
