import React, {useState, useEffect} from "react";
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Paginacao from "../../components/Paginacao";

const Estados = () => {
    const [estados, setEstados ] = useState([])
    const [paginate, setPaginate ] = useState({});
  
 
    async function getEstados(page = 1) {
        page = page > 1 ? '?page='+page : ''
        
        await fetch(`http://webfin.test/api/estados${page}`)
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

    }, [])

    return (
        <Container fluid>
            <h1 style={{textAlign: "center"}}>Lista de Estados</h1>
            

            <Table responsive="sm" size="sm" bordered hover >
                <thead >
                    <tr>
                        <th style={{width: '4rem', textAlign: 'center'}}>UF</th>
                        <th>Nome do estado</th>
                    </tr>
                </thead>
                <tbody>
                    {estados.map(el => {
                        return (
                            <tr key={el.id}>
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