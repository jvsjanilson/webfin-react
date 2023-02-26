import React, { useState, useEffect } from "react";
import { Table, Form, Container } from 'react-bootstrap';
import api from '../../config/api';
import { Options, Search, Paginacao, MessageDelete } from "../../components";

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
            <Search onChange={(e) => setSearch(e.target.value)} router="clientes" />          
            
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
                                    <Options onDelete={dialogDelete.bind(this, el.id)} 
                                        id={el.id} router="clientes" /> 
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
