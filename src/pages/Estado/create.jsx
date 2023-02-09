import {React, useState, useEffect, useCallback} from 'react'
import { Card, Button, Container, Form as FormBootstrap, Row, Col} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap'
import { useNavigate } from 'react-router-dom';
import api from '../../config/api';
import { Formik, Form } from 'formik';
import EstadoSchema from '../../schemas/EstadoSchema';
import { useParams } from 'react-router-dom';


const CreateEstado = (props) => {
    
    let navigate = useNavigate()
    let { _id } = useParams();

    const [estado, setEstado] = useState({})

    const estadoDefault = {uf: '', nome: ''}

    const onSubmitCreate = async (values) => {
        console.log('onSubmit')
        await api.post('estados',{
            uf: values.uf,
            nome: values.nome  
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

    const onSubmitUpdate = async (values) => {
        console.log('update: ' + _id)
        console.log('values: ' + values.uf)
        console.log('values: ' + values.nome)
    }

    
    async function findId() {
        if (_id) {
            await api.get(`estados/${_id}`)
            .then( res => {
                setEstado({uf: res.data.uf, nome: res.data.nome})
            })
        }
    }

    useEffect(() => {
        findId()
        
    },[])

    return (<Container >
        <Formik 
            onSubmit={(values) => {
                console.log(_id)
                if (_id)
                    return onSubmitUpdate(values)
                else
                    return onSubmitCreate(values)
            }}
            validationSchema={EstadoSchema}
            initialValues={_id ? estado : estadoDefault}
            enableReinitialize
        >
        {({
           handleChange,
           values,
           errors,
                 
        }) => (

            <Form >
                <Card >
                    <Card.Header>
                        <Button className='me-1' type='submit' variant="primary">Criar</Button>
                        <LinkContainer to="/estados">
                            <Button variant="secondary">Voltar</Button>
                        </LinkContainer>
                    </Card.Header>
                    <Card.Body>
                    <Row className="mb-3">
                        <Col sm={2}>
                            <FormBootstrap.Group  controlId="uf">
                                <FormBootstrap.Label>UF</FormBootstrap.Label>
                                <FormBootstrap.Control 
                                        autoFocus type="text" value={values.uf} onChange={handleChange} 
                                        isInvalid={!!errors.uf}
                                    />
                                <FormBootstrap.Control.Feedback type="invalid">
                                    {errors.uf}
                                </FormBootstrap.Control.Feedback>
                            </FormBootstrap.Group>
                        </Col>

                        <Col sm={10}>
                            <FormBootstrap.Group  controlId="nome">
                                <FormBootstrap.Label>Nome do estado</FormBootstrap.Label>
                                <FormBootstrap.Control type="text" value={values.nome} onChange={handleChange}
                                    isInvalid={!!errors.nome}
                                />
                                <FormBootstrap.Control.Feedback type="invalid">
                                    {errors.nome}
                                </FormBootstrap.Control.Feedback>
                            </FormBootstrap.Group>
                        </Col>
                
                    </Row>
                        
                        
                    </Card.Body>
                </Card>
            </Form>

          )}
        </Formik>
    </Container>)
}

export default CreateEstado