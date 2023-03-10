import React, {useState, useEffect} from "react";
import { Table, Form, Col, Row } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import api from '../../config/api';
import { Options, Search, Paginacao, MessageDelete } from "../../components";

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
                <Col md={12}>
                    <Form.Control type="search" placeholder="Pesquisa"
                        onChange={(e) => setSearch(e.target.value)} className="me-2" />
                </Col>
            
            </Row>
            
            <Table responsive="sm" size="sm" bordered hover >
                <thead className="table-dark">
                    <tr>
                       
                        <th>Nome da cidade</th>
                        <th style={{width: '4rem', textAlign: 'center'}}>UF</th>
                        <th style={{width: '4rem'}}>Capital</th>
                        <th style={{width: '4rem'}}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {dados.map(el => {
                        return (
                            <tr key={el.id}>
                               
                                <td>{el.nome}</td>
                                <td style={{textAlign: 'center'}}>{el.uf}</td>
                                
                                <td>
                                <Form.Switch style={{textAlign: 'center'}}
                                    type="switch"
                                    id="custom-switch"
                                    checked={el.capital ? true: false}

                                />
                                </td>
                                <td>
                                <Form.Switch style={{textAlign: 'center'}}
                                    type="switch"
                                    id="custom-switch"
                                    checked={el.ativo ? true: false}

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
