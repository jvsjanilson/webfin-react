import React, {useState, useEffect} from "react";
import { Table, Form, Dropdown} from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Paginacao from "../../components/Paginacao";

const Cidades = () => {
    const [cidades, setCidades ] = useState([])
    const [paginate, setPaginate ] = useState({});
    const [search, setSearch] = useState('')

    
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
            <Form>
                <Form.Group className="mb-2" controlId="formBasicEmail">
                    <Form.Control type="text" onChange={(e) => setSearch(e.target.value)} placeholder="Pesquisar" />
                </Form.Group>
            </Form>

            <Table responsive="sm" size="sm" bordered hover >
                {/* <caption style={{textAlign: 'center', captionSide: 'top '}} >Lista de Cidades</caption> */}
                <thead >
                    <tr>
                        <th style={{textAlign: 'center'}} >#</th>
                        <th>Nome da cidade</th>
                        <th style={{width: '4rem', textAlign: 'center'}}>UF</th>
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
                                        
                                                <Dropdown.Menu variant="dark">
                                                <Dropdown.Item href="#/action-1">Editar</Dropdown.Item>
                                                <Dropdown.Item href="#/action-2">Remover</Dropdown.Item>
                                                </Dropdown.Menu>
                                            </div>
                                        </Dropdown>
                                    }
                                </td>
                                <td>{el.nome}</td>
                                <td style={{textAlign: 'center'}}>{el.uf}</td>
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