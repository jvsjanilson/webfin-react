import { React, useState, useEffect } from 'react'
import { Card, Button, Container, Form as FormBootstrap, Row, Col} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import api from '../../config/api';
import { FaArrowLeft, FaPlus, FaSave } from "react-icons/fa";

const CreateEstado = (props) => {
    
    let navigate = useNavigate()
    let { _id } = useParams();

    const [estado, setEstado] = useState({})
    const estadoDefault = {uf: '', nome: ''}

    const EstadoSchema = Yup.object().shape({
        uf: Yup.string()
          .max(2, 'Tamanho máximo do UF é 2 caracteres.')
          .required('O campo UF é obrigatório')
          .test('UF unico', 'UF já cadastrada',  async (value) => {
            return await api.get(`estados/search/${value}`, {params: {id: _id}})
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
          .required('O campo Nome é obrigatório.'),
      });
   

    const onSubmitCreate = async (values) => {
        await api.post('estados',{
            uf: values.uf,
            nome: values.nome  
        })
        .then(res => {
            navigate('/estados')
        })
        .catch(error => {
            if (error.response.status == 422) {
                alert('Erro campo obrigatorio')
            }
        })
    }

    const onSubmitUpdate = async (values) => {
        
        await api.put(`/estados/${_id}`, {
            uf: values.uf,
            nome: values.nome
        })
        .then(res => {
            navigate('/estados')
        }).catch(error => {
            console.log(error)
            alert('Error ao atualizar.')
        })
    }
    
    const findEstado = async () => {
        if (_id) {
            await api.get(`estados/${_id}`)
            .then( res => {
                setEstado({
                        uf: res.data.uf, 
                        nome: res.data.nome
                    })
            })
        }
    }

    useEffect(() => {
        findEstado()
        
        
    },[])

    return (<Container >
        <Formik 
            onSubmit={(values) => {

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
           handleBlur,
           values,
           errors,
           touched
                 
        }) => (

            <Form >
                <Card >
                    <Card.Header>
                        <Button className='me-1'  type='submit' variant={ _id ? 'success' : 'primary' }>{(_id? (<FaSave/>) : (<FaPlus/>))} { _id ? 'SALVAR' : 'CRIAR' }</Button>
                        <LinkContainer to="/estados">
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

export default CreateEstado