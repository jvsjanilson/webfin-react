import {React, useState} from 'react'
import { Card, Form, Button, Container, Row, Col} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap'
import { useNavigate } from 'react-router-dom';
import api from '../../config/api';

const CreateEstado = () => {

    const [ uf, setUf ] = useState('')
    const [ nome, setNome ] = useState('')
    let navigate = useNavigate()

    const handleCriarEstado = async () => {
        let data = {}
        data['nome'] = nome;
        data['uf'] = uf;

        await api.post('estados',{
            uf: uf,
            nome: nome  
        })
        .then(res => {
            if (res.status == 201)
                navigate('/estados')
        })
        .catch(error => {
            console.log(error)
            if (error.response.status == 422) {
                alert('Erro campo obrigatorio')
            }
        })
       
    }

    


    return (<Container >
        <Form >
            <Card >
                <Card.Header>
                    <Button className='me-1' onClick={handleCriarEstado} variant="primary">Criar</Button>
                    <LinkContainer to="/estados">
                        <Button variant="secondary">Voltar</Button>
                    </LinkContainer>
                </Card.Header>
                <Card.Body>
                <Row className="mb-3">
                    <Col sm={2}>
                        <Form.Group  controlId="uf">
                            <Form.Label>UF</Form.Label>
                            <Form.Control autoFocus type="text" value={uf} onChange={(e) => setUf(e.target.value)} />
                        </Form.Group>
                    </Col>

                    <Col sm={10}>
                        <Form.Group  controlId="nome">
                            <Form.Label>Nome do estado</Form.Label>
                            <Form.Control type="text" value={nome} onChange={(e) => setNome(e.target.value)}/>
                        </Form.Group>
                    </Col>
            
                </Row>
                    
                    
                </Card.Body>
            </Card>
        </Form>
    </Container>)
}

export default CreateEstado