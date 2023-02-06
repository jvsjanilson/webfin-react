import React, {useState, useEffect} from "react";
import { Table, Form, Dropdown, Button, FloatingLabel, Row, Col} from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Paginacao from "../../components/Paginacao";

const Estados = () => {
    const [estados, setEstados ] = useState([])
    const [paginate, setPaginate ] = useState({});
    const [search, setSearch] = useState('')
  
 
    async function getEstados(page = 1) {
        page = page > 1 ? '?page='+page : ''

        let busca = ''      

        if (search != "" && page == '') {
            busca = '?nome=' + search
        } else if (search != "" && page != '') {
            busca = '&nome=' + search
        }
        
        await fetch(`http://webfin.test/api/estados${page}${busca}`)
            .then(response => response.json())
            .then((res) => {
                setEstados(res.data)
                setPaginate({
                    meta: res.meta,
                    links: res.links
                })
            });
    }
    useEffect( () => {
        getEstados()

    }, [search])

    return (
        <Container fluid>
            
            <Form className="d-flex mb-2">
                <Button active className="me-2" variant="primary">Adicionar</Button>
                  <Form.Control
                    type="search"
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
                                                <Dropdown.Item href="javascript:void(0)">Remover</Dropdown.Item>
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