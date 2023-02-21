import { React, useState, useEffect } from 'react'
import { Card, Button, Container, Form as FormBootstrap, Row, Col} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import api from '../../config/api';
import { FaArrowLeft, FaPlus, FaSave } from "react-icons/fa";

export default function FormEstado() {
    
    let navigate = useNavigate()
    let { _id } = useParams();
    const endpoint = '/api/estados'
    const routeIndex = '/estados'

    const [dado, setDado] = useState({})

    const initialValues = {uf: '', nome: ''}

    const validationSchema = Yup.object().shape({
        uf: Yup.string()
          .max(2, 'Tamanho máximo do UF é 2 caracteres.')
          .required('Preenchimento obrigatório')
          .test('UF unico', 'UF já cadastrada',  async (value) => {
            return await api.get(`${endpoint}/search/${value}`, {params: {id: _id}})
              .then(() => {
                return false
              })
              .catch(() => {
                return true
              })
          })
        ,
        nome: Yup.string()
          .max(60, 'Tamanho máximo do Nome é 60 caracteres.')
          .required('Preenchimento obrigatório.'),
      });
   

    const onSubmitCreate = async (values) => {
        await api.post(`${endpoint}`,{
            uf: values.uf,
            nome: values.nome  
        })
        .then(() => {
            navigate(routeIndex)
        })
        .catch(error => {
            if (error.response.status == 422) {
                alert('Erro campo obrigatorio')
            }
        })
    }

    const onSubmitUpdate = async (values) => {
        
        await api.put(`${endpoint}/${_id}`, {
            uf: values.uf,
            nome: values.nome
        })
        .then(() => {
            navigate(routeIndex)
        }).catch(error => {
            alert('Error ao atualizar.')
        })
    }
    
    const findDado = async () => {
        if (_id) {
            await api.get(`${endpoint}/${_id}`)
            .then( res => {
                setDado({
                    uf: res.data.uf, 
                    nome: res.data.nome
                })
            })
        }
    }

    useEffect(() => {
        findDado()
    },[])

    return (<Container >
        <Formik 
            onSubmit={(values) => {
                if (_id)
                    return onSubmitUpdate(values)
                else
                    return onSubmitCreate(values)
            }}
            validationSchema={validationSchema}
            initialValues={_id ? dado : initialValues}
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
                        <Button className='me-1'  type='submit' variant={ _id ? 'success' : 'primary' }>{(_id? (<FaSave/>) : (<FaPlus/>))} { _id ? 'SALVAR' : 'CRIAR' }</Button>
                        <LinkContainer to={routeIndex}>
                            <Button  variant="secondary"><FaArrowLeft/> VOLTAR</Button>
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
