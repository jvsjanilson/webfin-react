import React, {useState, useEffect} from "react";
import { Table, Form, Dropdown, Button, Container, Modal} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap'
import api from '../../config/api';
import Paginacao from "../../components/Paginacao";
import { Navigate, useNavigate } from 'react-router-dom';

const Estados = () => {
    const [estados, setEstados ] = useState([])
    const [paginate, setPaginate ] = useState({});
    const [search, setSearch] = useState('')
    const [register, setRegister] = useState(0)
    

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
   
  
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
                console.log(res)
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

        <Modal show={show} onHide={handleClose} animation={true}  aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title>Remover</Modal.Title>
            </Modal.Header>
            <Modal.Body>Deseja realmente remover?</Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={handleClose} >
                    Cancelar
                </Button>
                <Button variant="success" onClick={handleConfirmarDelete}>
                    Confirmar
                </Button>
            </Modal.Footer>
        </Modal>
            
            <Form className="d-flex mb-2">
                <LinkContainer to="/estados/create">
                    <Button active className="me-2" variant="primary">Adicionar</Button>
                </LinkContainer>
                  <Form.Control
                    type="search"
                    autoFocus
                    placeholder="Pesquisar"
                    onChange={(e) => setSearch(e.target.value)}
                    aria-label="Search"
                    
                    
                  />
            </Form>

            <Table responsive="sm" size="sm" bordered hover >
                <thead >
                    <tr>
                        <th style={{textAlign: 'center'}} >#</th>
                        <th style={{width: '4rem', textAlign: 'center'}}>UF</th>
                        <th>Nome do estado</th>
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
                                        
                                                <Dropdown.Menu variant="dark">
                                                    <Dropdown.Item href="javascript:void(0)">Editar</Dropdown.Item>
                                                    <Dropdown.Item href="javascript:void(0)" onClick={handleDeleteEstado.bind(this,el.id)}>Remover</Dropdown.Item>
                                                </Dropdown.Menu>
                                            </div>
                                        </Dropdown>
                                    }   
                                </td>                                
                                <td style={{textAlign: 'center'}}>{el.uf}</td>
                                <td>{el.nome}</td>
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