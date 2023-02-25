import { React, useState, useEffect } from 'react'
import { 
    Card, Button, Container, Form as FormBootstrap, 
    Row, Col, FloatingLabel
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import api from '../../config/api';
import { FaArrowLeft, FaPlus, FaSave } from "react-icons/fa";

export default function FormCidade() {
    
    let navigate = useNavigate()
    let { _id } = useParams();
    
    const endpoint = '/api/cidades'
    const routeIndex = '/cidades'

    const [initialValues, setInitialValues] = useState({nome: '', capital: 0, estado_id: 1});
    const [estados, setEstados] = useState([])

    const schema = Yup.object().shape({
        nome: Yup.string()
          .max(60, 'Tamanho máximo do Nome é 60 caracteres.')
          .required('O campo Nome da cidade é obrigatório.'),
        estado_id: Yup.number().required('O UF é obrigatório')
    });
   
    const onSubmitCreate = async ({nome, estado_id, capital}) => {
        await api.post(`${endpoint}`,{
            nome,
            estado_id,
            capital
        })
        .then(() => navigate(routeIndex))
        .catch(error => {
            if (error.response.status == 422) 
                alert('Erro campo obrigatorio')
            
        })
    }

    const onSubmitUpdate = async ({nome, estado_id, capital}) => {
        await api.put(`${endpoint}/${_id}`, {
            nome,
            estado_id,
            capital
        })
        .then(() => navigate(routeIndex))
        .catch(error => {
            alert('Error ao atualizar.')
        })
    }
    
    const findCidade = async () => {
        if (_id) {
            await api.get(`${endpoint}/${_id}`)
            .then(res => {
                setInitialValues({
                    nome: res.data.nome,
                    estado_id: res.data.estado_id,
                    capital: res.data.capital
                })
            })
        }
    }

    const getEstados = async () => {
        await api.get('api/estados/search/all')
            .then(res => setEstados(res.data.data))
    }

    useEffect(() => {
        findCidade()
        getEstados()
    },[])

    return (<Container fluid >
        <Formik 
            onSubmit={(values) => _id ? onSubmitUpdate(values) : onSubmitCreate(values) }
            validationSchema={schema}
            initialValues={initialValues}
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
                        <Button className='me-1' type='submit' variant={ _id ? 'success' : 'primary' }>{(_id? (<FaSave/>) : (<FaPlus/>))} { _id ? 'SALVAR' : 'CRIAR' }</Button>
                        <LinkContainer to={routeIndex}>
                            <Button  variant="secondary"><FaArrowLeft/> VOLTAR</Button>
                        </LinkContainer>
                    </Card.Header>
                    <Card.Body>
                        <Row className="mb-3 g-2">

                            <Col sm={10}>
                                <FormBootstrap.Group  controlId="nome">
                                    <FloatingLabel controlId="nome" label="Nome" >
                                        <FormBootstrap.Control type="text" value={values.nome} onChange={handleChange}
                                            isInvalid={!!errors.nome} />
                                    </FloatingLabel>
                                    
                                    <FormBootstrap.Control.Feedback type="invalid">
                                        {errors.nome}
                                    </FormBootstrap.Control.Feedback>
                                </FormBootstrap.Group>
                            </Col>
                            <Col sm={2}>

                            <FormBootstrap.Group  controlId="estado_id">
                            <FloatingLabel controlId="estado_id" label="UF" >
                                <FormBootstrap.Select onChange={handleChange} value={values.estado_id}>
                                    {estados.map((e) => <option  value={e.id} key={e.id} >{e.uf}</option>)}
                                </FormBootstrap.Select>
                            </FloatingLabel>
                            </FormBootstrap.Group>
                            </Col>
                    
                        </Row>
                        <Row >
                        <Col sm={2}>

                            <FormBootstrap.Group  controlId="capital">
                                <FormBootstrap.Switch 
                                        type="switch"
                                        value={values.capital}
                                        checked={values.capital == 1 ? true: false}
                                        onChange={(e) => setFieldValue('capital', e.target.checked ? 1 : 0)}
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
