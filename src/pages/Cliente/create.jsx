import { React, useState, useEffect } from 'react'
import { Card, Button, Container, Form as FormBootstrap, Row, Col} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import api from '../../config/api';
import { FaArrowLeft, FaPlus, FaSave } from "react-icons/fa";



const CreateCliente = () => {

    let navigate = useNavigate()
    let { _id } = useParams();

    const recurso = 'clientes'
    const routeIndex = '/clientes'

    const [dado, setDado] = useState({})
    const [estados, setEstados] = useState([])
    const [cidades, setCidades] = useState([])

       
    const dadoDefault = {
        nome: '', 
        nome_fantasia: '', 
        cpfcnpj: '',
        logradouro: '',
        numero: '',
        cep: '',
        complemento: '',
        bairro: '',
        estado_id: 1,
        cidade_id: 1,
        fone: '',
        celular: '',
        email: '',

    }

    const DadoSchema = Yup.object().shape({
        nome: Yup.string().max(60, 'Tamanho máximo 60 caracteres.').required('O campo obrigatório.'),
        nome_fantasia: Yup.string().nullable().max(60, 'Tamanho máximo 60 caracteres.'),
        logradouro: Yup.string().nullable().max(60, 'Tamanho máximo 60 caracteres.'),
        numero: Yup.string().nullable().max(10, 'Tamanho máximo 60 caracteres.'),
        cep: Yup.string().nullable().max(8, 'Tamanho máximo 60 caracteres.'),
        complemento: Yup.string().nullable().max(60, 'Tamanho máximo 60 caracteres.'),
        bairro: Yup.string().nullable().max(60, 'Tamanho máximo 60 caracteres.'),
        estado_id: Yup.number().integer().required('O campo obrigatório.'),
        cidade_id: Yup.number().integer().required('O campo obrigatório.'),
        fone: Yup.string().nullable().max(14, 'Tamanho máximo 60 caracteres.'),
        celular: Yup.string().nullable().max(14, 'Tamanho máximo 60 caracteres.'),
        email: Yup.string().nullable().max(120, 'Tamanho máximo 60 caracteres.'),
      });
   

    const onSubmitCreate = async (values) => {
        
        await api.post(recurso,{
            nome: values.nome,
            nome_fantasia: values.nome_fantasia,
            cpfcnpj: values.cpfcnpj,
            logradouro: values.logradouro,
            numero: values.numero,
            cep: values.cep,
            complemento: values.complemento,
            bairro: values.bairro,
            estado_id: values.estado_id,
            cidade_id: values.cidade_id,
            fone: values.fone,
            celular: values.celular,
            email: values.email,
            user_id: 1, //obs: remover linha depois que implementar tela de login
            
            
        })
        .then(res => {
            navigate(routeIndex)
        })
        .catch(error => {
            if (error.response.status == 422) {
                alert('Erro campo obrigatorio')
            }
        })
    }

    const onSubmitUpdate = async (values) => {

        payload = {
            nome: values.nome,
            nome_fantasia: values.nome_fantasia,
            cpfcnpj: values.cpfcnpj,
            logradouro: values.logradouro,
            numero: values.numero,
            cep: values.cep,
            complemento: values.complemento,
            bairro: values.bairro,
            estado_id: values.estado_id,
            cidade_id: values.cidade_id,
            fone: values.fone,
            celular: values.celular,
            email: values.email,

        }

        await api.put(`${recurso}/${_id}`, payload)
        .then(res => {
            navigate(routeIndex)
        }).catch(error => {
            alert('Error ao atualizar.')
        })
    }
    
    const getDado = async () => {
        if (_id) {
            await api.get(`${recurso}/${_id}`)
            .then( res => {
                console.log(res.data)
               let data = res.data;
               getCidades(data.estado_id)
                setDado({
                    nome: data.nome,
                    nome_fantasia: data.nome_fantasia,
                    cpfcnpj: data.cpfcnpj,
                    logradouro: data.logradouro,
                    numero: data.numero,
                    cep: data.cep,
                    complemento: data.complemento,
                    bairro: data.bairro,
                    estado_id: data.estado_id,
                    cidade_id: data.cidade_id,
                    fone: data.fone,
                    celular: data.celular,
                    email: data.email,
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

    const getCidades = async (estado_id) => {
        await api.get(`cidades/lookup/${estado_id}`)
            .then(res => {
                setCidades(res.data.data)
            })
    }

    useEffect(() => {
        getDado()
        getEstados()
        if (_id == undefined)
            getCidades(1)
       
    },[])

    return (<Container >
        <Formik 
             onSubmit={(values) => {
                // console.log(values)
                if (_id)
                    return onSubmitUpdate(values)
                else
                    return onSubmitCreate(values)
            }}
            validationSchema={DadoSchema}
            initialValues={_id ? dado : dadoDefault}
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
                        <LinkContainer to={routeIndex}>
                            <Button  variant="secondary"><FaArrowLeft/> VOLTAR</Button>
                        </LinkContainer>
                    </Card.Header>
                    <Card.Body>

                        <Row className="mb-3">

                            <Col sm={5}>
                                <FormBootstrap.Group  controlId="nome">
                                    <FormBootstrap.Label>Nome</FormBootstrap.Label>
                                    <FormBootstrap.Control 
                                        type="text" 
                                        value={values.nome} 
                                        onChange={handleChange}
                                        isInvalid={!!errors.nome}
                                        maxLength={60}
                                        autoFocus
                                    />
                                    
                                    <FormBootstrap.Control.Feedback type="invalid">
                                        {errors.nome}
                                    </FormBootstrap.Control.Feedback>
                                </FormBootstrap.Group>
                            </Col>
                            
                            <Col sm={5}>
                                <FormBootstrap.Group  controlId="nome_fantasia">
                                    <FormBootstrap.Label>Nome Fantasia</FormBootstrap.Label>
                                    <FormBootstrap.Control 
                                        type="text" 
                                        value={values.nome_fantasia} 
                                        onChange={handleChange}
                                        isInvalid={!!errors.nome_fantasia}
                                        maxLength={60}
                                    />
                                    
                                    <FormBootstrap.Control.Feedback type="invalid">
                                        {errors.nome_fantasia}
                                    </FormBootstrap.Control.Feedback>
                                </FormBootstrap.Group>
                            </Col>

                            <Col sm={2}>
                                <FormBootstrap.Group  controlId="cpfcnpj">
                                    <FormBootstrap.Label>CPF/CNPJ</FormBootstrap.Label>
                                    <FormBootstrap.Control 
                                        type="text" 
                                        value={values.cpfcnpj} 
                                        onChange={handleChange}
                                        isInvalid={!!errors.cpfcnpj}
                                        maxLength={14}
                                    />
                                    
                                    <FormBootstrap.Control.Feedback type="invalid">
                                        {errors.cpfcnpj}
                                    </FormBootstrap.Control.Feedback>
                                </FormBootstrap.Group>
                            </Col>

                        </Row>

                        <Row className="mb-3">

                            <Col sm={8}>
                                <FormBootstrap.Group  controlId="logradouro">
                                    <FormBootstrap.Label>Logradouro </FormBootstrap.Label>
                                    <FormBootstrap.Control type="text" 
                                        value={values.logradouro} 
                                        onChange={handleChange}
                                        maxLength={60}
                                        isInvalid={!!errors.logradouro}
                                    />
                                    
                                    <FormBootstrap.Control.Feedback type="invalid">
                                        {errors.logradouro}
                                    </FormBootstrap.Control.Feedback>
                                </FormBootstrap.Group>
                            </Col>
                    
                            <Col sm={2}>
                                <FormBootstrap.Group  controlId="numero">
                                    <FormBootstrap.Label>Número</FormBootstrap.Label>
                                    <FormBootstrap.Control 
                                        type="text" 
                                        value={values.numero} 
                                        onChange={handleChange}
                                        maxLength={10}
                                        isInvalid={!!errors.numero}
                                    />
                                    
                                    <FormBootstrap.Control.Feedback type="invalid">
                                        {errors.numero}
                                    </FormBootstrap.Control.Feedback>
                                </FormBootstrap.Group>
                            </Col>

                            <Col sm={2}>
                                <FormBootstrap.Group  controlId="cep">
                                    <FormBootstrap.Label>CEP</FormBootstrap.Label>
                                    <FormBootstrap.Control 
                                        type="text" 
                                        value={values.cep} 
                                        onChange={handleChange}
                                        maxLength={8}
                                        isInvalid={!!errors.cep}
                                    />
                                    
                                    <FormBootstrap.Control.Feedback type="invalid">
                                        {errors.cep}
                                    </FormBootstrap.Control.Feedback>
                                </FormBootstrap.Group>
                            </Col>
                    
                        </Row>

                        <Row className='mb-3'>
                            <Col sm={5}>
                                <FormBootstrap.Group  controlId="complemento">
                                    <FormBootstrap.Label>Complemento</FormBootstrap.Label>
                                    <FormBootstrap.Control 
                                        type="text" 
                                        value={values.complemento} 
                                        onChange={handleChange}
                                        maxLength={60}
                                        isInvalid={!!errors.complemento}
                                    />
                                    
                                    <FormBootstrap.Control.Feedback type="invalid">
                                        {errors.complemento}
                                    </FormBootstrap.Control.Feedback>
                                </FormBootstrap.Group>
                            </Col>

                            <Col sm={2}>
                                <FormBootstrap.Group  controlId="estado_id">
                                    <FormBootstrap.Label>UF</FormBootstrap.Label>
                                    <FormBootstrap.Select o
                                        //onChange={handleChange}
                                        onChange={(e) => {
                                        setFieldValue('estado_id', e.target.value)
                                        getCidades(e.target.value)  
                                        
                                        }} 
                                        value={values.estado_id}>
                                        {estados.map((e) => (<option  value={e.id} key={e.id}  >{e.uf}</option>))}
                                    </FormBootstrap.Select>
                                </FormBootstrap.Group>
                            </Col>

                            <Col sm={5}>
                                <FormBootstrap.Group  controlId="cidade_id">
                                    <FormBootstrap.Label>Cidade</FormBootstrap.Label>
                                    <FormBootstrap.Select 
                                        onChange={handleChange} 
                                        value={values.cidade_id}
                                        >
                                        {cidades.map((e) => {
                                                return (
                                                    <option value={e.id} key={e.id} >{e.nome}</option>
                                                )
                                            })}
                                    </FormBootstrap.Select>
                                </FormBootstrap.Group>
                            </Col>
                        </Row>

                        <Row className='mb-3'>
                            <Col sm={2}>
                                <FormBootstrap.Group  controlId="fone">
                                    <FormBootstrap.Label>Fone</FormBootstrap.Label>
                                    <FormBootstrap.Control 
                                        type="text" 
                                        value={values.fone} 
                                        onChange={handleChange}
                                        maxLength={14}
                                        isInvalid={!!errors.fone}
                                    />
                                    
                                    <FormBootstrap.Control.Feedback type="invalid">
                                        {errors.fone}
                                    </FormBootstrap.Control.Feedback>
                                </FormBootstrap.Group>
                            </Col>
                            <Col sm={2}>
                                <FormBootstrap.Group  controlId="celular">
                                    <FormBootstrap.Label>Celular</FormBootstrap.Label>
                                    <FormBootstrap.Control 
                                        type="text" 
                                        value={values.celular} 
                                        onChange={handleChange}
                                        maxLength={14}
                                        isInvalid={!!errors.celular}
                                    />
                                    
                                    <FormBootstrap.Control.Feedback type="invalid">
                                        {errors.celular}
                                    </FormBootstrap.Control.Feedback>
                                </FormBootstrap.Group>
                            </Col>

                            <Col sm={8}>
                                <FormBootstrap.Group  controlId="email">
                                    <FormBootstrap.Label>e-mail</FormBootstrap.Label>
                                    <FormBootstrap.Control 
                                        type="text" 
                                        value={values.email} 
                                        onChange={handleChange}
                                        maxLength={120}
                                        isInvalid={!!errors.email}
                                    />
                                    
                                    <FormBootstrap.Control.Feedback type="invalid">
                                        {errors.email}
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

export default CreateCliente    