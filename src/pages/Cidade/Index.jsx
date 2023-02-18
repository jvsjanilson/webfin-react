import React, {useState, useEffect} from "react";
import { Table, Form, Dropdown, Button, Modal} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'
import Container from 'react-bootstrap/Container';
import Paginacao from "../../components/Paginacao";
import { FaEdit, FaTrash } from "react-icons/fa";
import api from '../../config/api';
import MessageDelete from "../../components/MessageDelete";

const Cidades = () => {
    const [cidades, setCidades ] = useState([])
    const [paginate, setPaginate ] = useState({});
    const [search, setSearch] = useState('')

    const [register, setRegister] = useState(0)
    const [show, setShow] = useState(false);
    
    const handleClose = () => setShow(false);
    
    const handleAtivo = async (id, status) => {

        await api.put(`cidades/${id}`,{
            ativo : status == 1 ? 0 : 1
        })
        .then(res => {
            if (res.status == 204) {
                setCidades([...cidades], cidades.map((el) => {
                    if (el.id == id) {
                        el.ativo = el.ativo == 0 ? 1 : 0
                        return el
                    }
                    return el
                }))
            }
        }).catch(error => {
            alert('Error')
        })        
    }

    const handleConfirmarDelete = async () => {
        setShow(false)
       
        await api.delete('cidades/'+register)
            .then(res => {
                console.log(res)
                if (res.status == 204){
                    setCidades(cidades.filter((i) => i.id != register))
                } 
            })
            .catch(e => {
                console.log(e)
                if (e.response.status == 400)
                    alert(e.response.data.message)
            })
        
    }

    const handleDeleteCidade = async (id) => {
        setRegister(id)
        setShow(true)

    }

    async function getCidades(page = 1) {

        page = page > 1 ? '?page='+page : ''
        let busca = ''      

        if (search != "" && page == '') {
            busca = '?nome=' + search
        } else if (search != "" && page != '') {
            busca = '&nome=' + search
        }
   
        await fetch(`http://webfin.test/api/cidades${page}${busca}`)
            .then(response => response.json())
            .then((res) => {
                setCidades(res.data)
                setPaginate({
                    meta: res.meta,
                    links: res.links
                })
            });
    }

    useEffect( () => {
        getCidades()

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
                {/* <caption style={{textAlign: 'center', captionSide: 'top '}} >Lista de Cidades</caption> */}
                <thead className="table-dark">
                    <tr>
                        <th style={{textAlign: 'center'}} >#</th>
                        <th>Nome da cidade</th>
                        <th style={{width: '4rem', textAlign: 'center'}}>UF</th>
                        
                        <th style={{width: '4rem'}}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {cidades.map(el => {
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
                                                
                                                <Dropdown.Item href="javascript:void(0)" onClick={handleDeleteCidade.bind(this, el.id)}><FaTrash color="red" /> Remover</Dropdown.Item>
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

                                    onChange={handleAtivo.bind(this, el.id, el.ativo)}
                                />
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
                </Table>
                <tfoot>
                    <Paginacao paginas={paginate} evento={getCidades.bind(this)} />
                </tfoot>
        </Container>
    )
}

export default Cidades