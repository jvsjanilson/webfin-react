import { React, useState, useEffect } from 'react'
import { Card, Button, Container, Form as FormBootstrap, Row, Col, FloatingLabel} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import api from '../../config/api';
import { FaSave } from "react-icons/fa";
import MaskedInput from 'react-text-mask'
import HeaderCadastro from '../../components/HeaderCadastro';


export default function FormCliente(){

    let navigate = useNavigate()
    let { _id } = useParams();

    const endpoint = 'api/clientes'
    const routeIndex = '/clientes'

    const [estados, setEstados] = useState([])
    const [cidades, setCidades] = useState([])
    const [initialValues, setInitialValues] = useState({
        nome: '', 
        nome_fantasia: '', 
        cpfcnpj: '',
        logradouro: '',
        numero: '',
        cep: '',
        complemento: '',
        bairro: '',
        estado_id: 12, //12=RN
        cidade_id: 1161, //1161=NATAL
        fone: '',
        celular: '',
        email: ''
    })

    const validationSchema = Yup.object().shape({
        nome: Yup.string().max(60, 'Tamanho máximo 60 caracteres.').required('O campo obrigatório.'),
        nome_fantasia: Yup.string().nullable().max(60, 'Tamanho máximo 60 caracteres.'),
        logradouro: Yup.string().nullable().max(60, 'Tamanho máximo 60 caracteres.'),
        numero: Yup.string().nullable().max(10, 'Tamanho máximo 60 caracteres.'),
        cep: Yup.string().nullable().max(9, 'Tamanho máximo 9 caracteres.'),
        complemento: Yup.string().nullable().max(60, 'Tamanho máximo 60 caracteres.'),
        bairro: Yup.string().nullable().max(60, 'Tamanho máximo 60 caracteres.'),
        estado_id: Yup.number().integer().required('O campo obrigatório.'),
        cidade_id: Yup.number().integer().required('O campo obrigatório.'),
        fone: Yup.string().nullable().max(15, 'Tamanho máximo 15 caracteres.'),
        celular: Yup.string().nullable().max(15, 'Tamanho máximo 15 caracteres.'),
        email: Yup.string().email('e-mail inválido').nullable().max(120, 'Tamanho máximo 60 caracteres.'),
        cpfcnpj: Yup.string().nullable().notRequired()
            .test('Validade CPFCNPJ', 'CPF/CNPJ Inválido', async (value) => {
                if (value == undefined)
                    return true
                return validaDocumento().valid(value)
            })
            .test('CPFCNPJ já existente','O CPF/CNPJ já cadastrado', async (value) => {
                if (value == undefined)
                    return true
               
                if (value.length == 11 || value.length == 14) {
                    return await api.get(`${endpoint}/find/cpfcnpj/${value}`, {
                        params: {id: _id}
                    })
                        .then(res => {
                            return res.data.cpfcnpj ? false : true
                        })
                        .catch(() => {
                            return true
                        })
                }

            })
      });
   

    const onSubmitCreate = async (values) => {
        const payload = {
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
        }
        
        await api.post(endpoint,payload)
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

       const payload = {
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

        await api.put(`${endpoint}/${_id}`, payload)
        .then(res => {
            navigate(routeIndex)
        }).catch(error => {
            alert('Error ao atualizar.')
        })
    }
    
    const getDado = async () => {
        if (_id) {
            await api.get(`${endpoint}/${_id}`)
            .then( res => {
               let data = res.data;
               getCidades(data.estado_id)
               setInitialValues({
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
        await api.get('api/estados/search/all')
            .then(res => {
                setEstados(res.data.data)
            }).catch(error => {
                console.error(error)
            })
    }

    const getCidades = async (estado_id) => {
        await api.get(`api/cidades/lookup/${estado_id}`)
            .then(res => {
                setCidades(res.data.data)
            }).catch(error => {
                console.error(error)
            })
    }

    useEffect(() => {

        getDado()
        getEstados()
        if (_id == undefined)
            getCidades(initialValues.estado_id)
       
    },[])

    return (<Container fluid >
        <Formik 
            onSubmit={(values) => _id ? onSubmitUpdate(values) : onSubmitCreate(values)}
            validationSchema={validationSchema}
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
                <Card className='mb-2'>
                    <HeaderCadastro router={routeIndex} title="CLIENTE"/>
                    <Card.Body>

                        <Row className="mb-2 g-2">

                            <Col md={5}>
                                <FormBootstrap.Group  controlId="nome">
                                    <FloatingLabel controlId="nome" label="Nome do cliente" >
                                        <FormBootstrap.Control type="text"  value={values.nome} 
                                            onChange={handleChange} isInvalid={!!errors.nome}
                                            maxLength={60} autoFocus />
                                    </FloatingLabel>
                                    
                                    <FormBootstrap.Control.Feedback type="invalid">
                                        {errors.nome}
                                    </FormBootstrap.Control.Feedback>
                                </FormBootstrap.Group>
                            </Col>
                            
                            <Col md={5}>
                                <FormBootstrap.Group  controlId="nome_fantasia">
                                    <FloatingLabel controlId="nome_fantasia" label="Nome Fantasia" >
                                        <FormBootstrap.Control  type="text" value={values.nome_fantasia} 
                                            onChange={handleChange} isInvalid={!!errors.nome_fantasia}
                                            maxLength={60}  />
                                    </FloatingLabel>
                                    
                                    <FormBootstrap.Control.Feedback type="invalid">
                                        {errors.nome_fantasia}
                                    </FormBootstrap.Control.Feedback>
                                </FormBootstrap.Group>
                            </Col>

                            <Col md={2}>
                                <FormBootstrap.Group  controlId="cpfcnpj">
                                    <FloatingLabel controlId="cpfcnpj" label="CPF/CNPJ" >
                                        <FormBootstrap.Control  type="text" value={values.cpfcnpj} 
                                            onChange={handleChange} isInvalid={!!errors.cpfcnpj}
                                            maxLength={14}/>
                                    </FloatingLabel>
                                    
                                    <FormBootstrap.Control.Feedback type="invalid">
                                        {errors.cpfcnpj}
                                    </FormBootstrap.Control.Feedback>
                                </FormBootstrap.Group>
                            </Col>

                        </Row>

                        <Row className="mb-2 g-2">

                            <Col md={8}>
                                <FormBootstrap.Group  controlId="logradouro">
                                    <FloatingLabel controlId="logradouro" label="Logradouro" >
                                        <FormBootstrap.Control type="text" value={values.logradouro} 
                                            onChange={handleChange} maxLength={60}
                                            isInvalid={!!errors.logradouro} />
                                    </FloatingLabel>
                                    
                                    <FormBootstrap.Control.Feedback type="invalid">
                                        {errors.logradouro}
                                    </FormBootstrap.Control.Feedback>
                                </FormBootstrap.Group>
                            </Col>
                    
                            <Col xs={6} md={2}>
                                <FormBootstrap.Group  controlId="numero">
                                    <FloatingLabel controlId="numero" label="Número" >
                                        <FormBootstrap.Control type="text" value={values.numero} 
                                            onChange={handleChange} maxLength={10}
                                            isInvalid={!!errors.numero} />
                                    </FloatingLabel>
                                    
                                    <FormBootstrap.Control.Feedback type="invalid">
                                        {errors.numero}
                                    </FormBootstrap.Control.Feedback>
                                </FormBootstrap.Group>
                            </Col>

                            <Col xs={6} md={2}>
                                <FormBootstrap.Group  controlId="cep">
                                <FloatingLabel controlId="cep" label="CEP" >
                                    <MaskedInput id="cep" mask={[/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/]}
                                        onChange={handleChange} value={values.cep}
                                        className="form-control" />
                                </FloatingLabel>
                                    
                                    <FormBootstrap.Control.Feedback type="invalid">
                                        {errors.cep}
                                    </FormBootstrap.Control.Feedback>
                                </FormBootstrap.Group>
                            </Col>
                    
                        </Row>

                        <Row className="mb-2 g-2">
                            <Col md={5}>
                                <FormBootstrap.Group  controlId="complemento">
                                    <FloatingLabel controlId="complemento" label="Complemento" >
                                        <FormBootstrap.Control type="text" value={values.complemento} 
                                            onChange={handleChange} maxLength={60}
                                            isInvalid={!!errors.complemento}/>
                                    </FloatingLabel>
                                    
                                    <FormBootstrap.Control.Feedback type="invalid">
                                        {errors.complemento}
                                    </FormBootstrap.Control.Feedback>
                                </FormBootstrap.Group>
                            </Col>

                            <Col xs={3} md={2}>
                                <FormBootstrap.Group  controlId="estado_id">
                                    <FloatingLabel controlId="estado_id" label="UFs" >
                                        <FormBootstrap.Select value={values.estado_id}
                                            onChange={ async (e) => {
                                                setFieldValue('estado_id', e.target.value)
                                                getCidades(e.target.value)  
                                                
                                            }}>
                                            {estados.map((e) => <option value={e.id} key={e.id}>{e.uf}</option>)}
                                        </FormBootstrap.Select>
                                    </FloatingLabel>
                                </FormBootstrap.Group>
                            </Col>

                            <Col xs={9} md={5}>
                                <FormBootstrap.Group  controlId="cidade_id">
                                    <FloatingLabel controlId="cidade_id" label="Cidades" >
                                        <FormBootstrap.Select onChange={handleChange} value={values.cidade_id}>
                                            {cidades.map((e) => <option value={e.id} key={e.id} >{e.nome}</option>)}
                                        </FormBootstrap.Select>
                                </FloatingLabel>
                                </FormBootstrap.Group>
                            </Col>
                        </Row>

                        <Row className="g-2">
                            <Col xs={6} md={2}>
                                <FormBootstrap.Group  controlId="fone">
                                    <FloatingLabel controlId="fone" label="Fone" >
                                        <MaskedInput id="fone"
                                            mask={['(', /[1-9]/, /\d/, ')',  /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                            onChange={handleChange} value={values.fone} className="form-control"/>
                                    </FloatingLabel>

                                    <FormBootstrap.Control.Feedback type="invalid">
                                        {errors.fone}
                                    </FormBootstrap.Control.Feedback>
                                </FormBootstrap.Group>
                            </Col>
                            <Col xs={6} md={2}>
                                <FormBootstrap.Group  controlId="celular">
                                    <FloatingLabel controlId="celular" label="Celular" >
                                        <MaskedInput id="celular"
                                            mask={['(', /[1-9]/, /\d/, ')',  /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                            onChange={handleChange} value={values.celular} className="form-control"/>
                                    </FloatingLabel>
                                    <FormBootstrap.Control.Feedback type="invalid">
                                        {errors.celular}
                                    </FormBootstrap.Control.Feedback>
                                </FormBootstrap.Group>
                            </Col>

                            <Col sm={8}>
                                <FormBootstrap.Group  controlId="email">
                                    <FloatingLabel controlId="email" label="E-mail" >
                                        <FormBootstrap.Control type="text" value={values.email} onChange={handleChange}
                                            maxLength={120} isInvalid={!!errors.email}/>
                                    </FloatingLabel>
                                    
                                    <FormBootstrap.Control.Feedback type="invalid">
                                        {errors.email}
                                    </FormBootstrap.Control.Feedback>
                                </FormBootstrap.Group>
                            </Col>

                        </Row>

                    </Card.Body>
                    <Card.Footer>
                        <Row >
                            <Col className="d-flex justify-content-end" >
                                <Button  type='submit' variant='success'><FaSave/> SALVAR</Button>
                            </Col>
                        </Row>
                    </Card.Footer>
                </Card>
            </Form>

          )}
        </Formik>
    </Container>)
}
