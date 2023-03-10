import { React, useState, useEffect } from 'react'
import { 
    Card, Container, Form as FormBootstrap, 
    Row, Col, FloatingLabel
} from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import api from '../../config/api';
import { FooterCadastro, HeaderCadastro } from '../../components';

export default function FormEstado() {
    
    let navigate = useNavigate()
    let { _id } = useParams();
    const endpoint = '/api/estados'
    const routeIndex = '/estados'

    const [initialValues, setInitialValues] = useState({uf: '', nome: ''})

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
   

    const onSubmitCreate = async ({uf, nome}) => {
        await api.post(`${endpoint}`,{
            uf,
            nome
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

    const onSubmitUpdate = async ({uf, nome}) => {
        
        await api.put(`${endpoint}/${_id}`, {
            uf,
            nome
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
            .then( res => setInitialValues({uf: res.data.uf, nome: res.data.nome}))
        }
    }

    useEffect(() => {
        findDado()
    },[])

    return (<Container fluid>
        <Formik 
            onSubmit={(values) =>_id ? onSubmitUpdate(values) : onSubmitCreate(values)}
            validationSchema={validationSchema}
            initialValues={initialValues}
            enableReinitialize
        >
        {({
           handleChange,
           values,
           errors,
        }) => (

            <Form >
                <Card >
                    <HeaderCadastro router={routeIndex} title="ESTADO"/>                

                    <Card.Body>
                    <Row className="g-2">
                        <Col md={2}>
                            <FormBootstrap.Group  controlId="uf">
                                <FloatingLabel controlId="uf" label="UF" >
                                    <FormBootstrap.Control autoFocus type="text" value={values.uf} 
                                        onChange={handleChange} isInvalid={!!errors.uf}/>
                                
                                <FormBootstrap.Control.Feedback type="invalid">
                                    {errors.uf}
                                </FormBootstrap.Control.Feedback>
                                </FloatingLabel>
                            </FormBootstrap.Group>
                        </Col>

                        <Col md={10}>
                            <FormBootstrap.Group  controlId="nome">
                                <FloatingLabel controlId="nome" label="Nome do estado" >
                                    <FormBootstrap.Control type="text" value={values.nome} 
                                        onChange={handleChange} isInvalid={!!errors.nome}/>
                                
                                <FormBootstrap.Control.Feedback type="invalid">
                                    {errors.nome}
                                </FormBootstrap.Control.Feedback>
                                </FloatingLabel>
                            </FormBootstrap.Group>
                        </Col>
                        
                    </Row>
                    </Card.Body>
                    <FooterCadastro/>                   
                </Card>
            </Form>

          )}
        </Formik>
    </Container>)
}
