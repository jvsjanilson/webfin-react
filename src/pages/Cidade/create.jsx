import { React, useState, useEffect } from 'react'
import { Card, Button, Container, Form as FormBootstrap, Row, Col} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Formik, Form, Field, useFormikContext } from 'formik';
import * as Yup from 'yup';
import api from '../../config/api';
import { FaArrowLeft, FaPlus, FaSave } from "react-icons/fa";

const CreateCidade = () => {
    
    let navigate = useNavigate()
    let { _id } = useParams();

    const [cidade, setCidade] = useState({})
    const [estados, setEstados] = useState([])
    

    const cidadeDefault = {nome: '', capital: 0, estado_id: 1}

    const CidadeSchema = Yup.object().shape({
        nome: Yup.string()
          .max(60, 'Tamanho máximo do Nome é 60 caracteres.')
          .required('O campo Nome da cidade é obrigatório.'),
        estado_id: Yup.number().required('O UF é obrigatório')
      });
   

    const onSubmitCreate = async (values) => {
        await api.post('cidades',{
            nome: values.nome,
            estado_id: values.estado_id,
            capital: values.capital
        })
        .then(res => {
            navigate('/cidades')
        })
        .catch(error => {
            if (error.response.status == 422) {
                alert('Erro campo obrigatorio')
            }
        })
    }

    const onSubmitUpdate = async (values) => {
        console.log('update')
        console.log(values)
        await api.put(`/cidades/${_id}`, {
            nome: values.nome,
            estado_id: values.estado_id,
            capital: values.capital
        })
        .then(res => {
            navigate('/cidades')
        }).catch(error => {
            console.log(error)
            alert('Error ao atualizar.')
        })
    }
    
    const findCidade = async () => {
        if (_id) {
            await api.get(`cidades/${_id}`)
            .then( res => {
                console.log(res.data.capital)
                setCidade({
                        nome: res.data.nome,
                        estado_id: res.data.estado_id,
                        capital: res.data.capital
                    })
            })
        }
    }

    const getEstados = async () => {
        await api.get('estados/search/all')
            .then(res => {
                setEstados(res.data.data)
            })
    }

    useEffect(() => {
        findCidade()
        getEstados()
        
        
    },[])

    return (<Container >
        <Formik 
             onSubmit={(values) => {
                if (_id)
                    return onSubmitUpdate(values)
                else
                    return onSubmitCreate(values)
            }}
            validationSchema={CidadeSchema}
            initialValues={_id ? cidade : cidadeDefault}
            enableReinitialize
            
        >
        {({
           handleChange,
           values,
           errors,
           setFieldValue
           
        }) => (

            <Form >
                <Card >
                    <Card.Header>
                        <Button className='me-1'  type='submit' variant={ _id ? 'success' : 'primary' }>{(_id? (<FaSave/>) : (<FaPlus/>))} { _id ? 'SALVAR' : 'CRIAR' }</Button>
                        <LinkContainer to="/cidades">
                            <Button  variant="secondary"><FaArrowLeft/> VOLTAR</Button>
                        </LinkContainer>
                    </Card.Header>
                    <Card.Body>
                    <Row className="mb-3">

                        <Col sm={10}>
                            <FormBootstrap.Group  controlId="nome">
                                <FormBootstrap.Label>Nome da cidade</FormBootstrap.Label>
                                <FormBootstrap.Control type="text" value={values.nome} onChange={handleChange}
                                    isInvalid={!!errors.nome}
                                />
                                
                                <FormBootstrap.Control.Feedback type="invalid">
                                    {errors.nome}
                                </FormBootstrap.Control.Feedback>
                            </FormBootstrap.Group>
                        </Col>
                        <Col sm={2}>

                        <FormBootstrap.Group  controlId="estado_id">
                            <FormBootstrap.Label>UF</FormBootstrap.Label>
                            <FormBootstrap.Select onChange={handleChange} value={values.estado_id}>
                                {estados.map((e) => (<option  value={e.id} key={e.id} selected={cidade.estado_id == e.id ? true: false} >{e.uf}</option>))}
                            </FormBootstrap.Select>
                        </FormBootstrap.Group>
                        </Col>
                
                    </Row>
                    <Row className="mb-3">
                    <Col sm={2}>

                        <FormBootstrap.Group  controlId="capital">
                            
                            <FormBootstrap.Switch 
                                    type="switch"
                                    value={values.capital}
                                    checked={values.capital == 1 ? true: false}
                                    onChange={(e) => {
                                        if (e.target.checked) 
                                            setFieldValue('capital', 1)
                                        else
                                            setFieldValue('capital', 0)
                                    }}
                                    
                                    label="Capital?"
                                />
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

export default CreateCidade