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
import { format } from 'date-fns';
import CurrencyInput from 'react-currency-input-field';

export default function FormContaPagar() {
    
    let navigate = useNavigate()
    let { _id } = useParams();

    const endpoint = 'api/contapagars'
    const routeIndex = '/contapagars'
    const [fornecedores, setFornecedores] = useState([])
    const [contas, setContas] = useState([])
    const [desativado, setDesativado] = useState(false)
    const [initialValues, setInitialValues] = useState({
        documento: '', 
        emissao: format(new Date(), "yyyy-MM-dd"), 
        vencimento: format(new Date(), "yyyy-MM-dd"),
        valor: '0,00',
        conta_id: 1,
        fornecedor_id: 1,
    })

    const validationSchema = Yup.object().shape({
        documento: Yup.string()
            .max(10, 'Tamanho máximo 60 caracteres.')
            .required('O campo obrigatório..')
            .test('Documento único', 'Documento já existe', async (value) => {
                if (value == undefined)
                    return true

                if (value != "")
                {
                    return await api.get(`${endpoint}/find/documento/${value}`, {
                        params: {id: _id}
                    })
                    .then(res => {
                        return res.data.documento ? false : true
                    })
                    .catch(() => {
                        return true
                    }) 
                }
            }),
        emissao: Yup.date().required('O campo obrigatório.'),
        vencimento: Yup.date().required('O campo obrigatório.'),
        conta_id: Yup.number().integer('Aceita somente inteiro.').required('O campo obrigatório.') ,
        fornecedor_id: Yup.number().integer('Aceita somente inteiro.').required('O campo obrigatório.') ,

      });
   

    const onSubmitCreate = async ({documento, emissao, vencimento, conta_id, fornecedor_id, valor }) => {
        
        await api.post(endpoint,{
            documento,
            emissao,
            vencimento,
            conta_id,
            fornecedor_id,
            user_id: 1, //obs: remover linha depois que implementar tela de login
            valor: valor ? parseFloat(valor.replace(/[^0-9,]/gi, '').replace(',','.')) : 0
            
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

    const onSubmitUpdate = async ({documento, emissao, vencimento, conta_id, fornecedor_id, valor }) => {

        await api.put(`${endpoint}/${_id}`, {
            documento ,
            emissao,
            vencimento,
            conta_id,
            fornecedor_id,
            valor: valor ? parseFloat(valor.replace(/[^0-9,]/gi, '').replace(',','.')) : 0
        })
        .then(() => {
            navigate(routeIndex)
        }).catch(error => {
            alert('Error ao atualizar.')
        })
    }
    
    const getDado = async () => {
        if (_id) {
            await api.get(`${endpoint}/${_id}`)
            .then( res => {
                
                if (res.data.data_pagamento) 
                    setDesativado(true)

                setInitialValues({
                    documento: res.data.documento,
                    emissao: res.data.emissao,
                    vencimento: res.data.vencimento,
                    conta_id: res.data.conta_id,
                    fornecedor_id: res.data.fornecedor_id,
                    valor:  new Intl.NumberFormat('pt-BR', {useGrouping:false}).format(parseFloat(res.data.valor).toFixed(2)) ,
                })
              

            })
        }
    }

    const getFornecedores = async () => {
        await api.get('api/fornecedores/search/all')
            .then(res => setFornecedores(res.data))
    }
    const getContas = async () => {
        await api.get('api/contas/search/all')
            .then(res => setContas(res.data.data))
    }
 
    useEffect(() => {
        getDado()
        getFornecedores()
        getContas()
    },[])

    return (<Container fluid>
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
                <Card >
                    
                    <Card.Header>
                        <Row>
                            <Col xs={6} md={6} >                           
                                <Button disabled={desativado} className='me-1'  type='submit' variant={ _id ? 'success' : 'primary' }>{(_id? (<FaSave/>) : (<FaPlus/>))} { _id ? 'SALVAR' : 'CRIAR' }</Button>
                                <LinkContainer to={routeIndex}>
                                    <Button  variant="secondary"><FaArrowLeft/> VOLTAR</Button>
                                </LinkContainer>
                            </Col>
                            <Col xs={6} md={6} className="d-flex justify-content-end align-items-center">
                                <h5 className='titulo_cad' >CONTA A PAGAR</h5>
                            </Col>                                   
                        </Row>                                  
                    </Card.Header>
                    
                    <Card.Body>

                        <Row className="mb-2 g-2">

                            <Col md={2}>
                                <FormBootstrap.Group  controlId="documento">
                                    <FloatingLabel controlId="documento" label="Documento">
                                        <FormBootstrap.Control  type="text" value={values.documento} 
                                            onChange={handleChange} isInvalid={!!errors.documento} autoFocus
                                            maxLength={10} disabled={desativado} />
                                    </FloatingLabel>
                                    
                                    <FormBootstrap.Control.Feedback type="invalid">
                                        {errors.documento}
                                    </FormBootstrap.Control.Feedback>
                                </FormBootstrap.Group>
                            </Col>

                            <Col md={6}>

                                <FormBootstrap.Group  controlId="fornecedor_id">
                                    <FloatingLabel controlId="fornecedor_id" label="Fornecedores">
                                        <FormBootstrap.Select onChange={handleChange} value={values.fornecedor_id} disabled={desativado} >
                                            {fornecedores.map((e) => <option value={e.id} key={e.id} >{e.nome}</option>)}
                                        </FormBootstrap.Select>
                                    </FloatingLabel>
                                </FormBootstrap.Group>
                            </Col>

                            <Col md={4}>

                                <FormBootstrap.Group  controlId="conta_id">
                                <FloatingLabel controlId="conta_id" label="Contas" >
                                    <FormBootstrap.Select onChange={handleChange} value={values.conta_id} disabled={desativado} >
                                        {contas.map((e) => <option value={e.id} key={e.id}  >Bco: {e.numero_banco} - Ag: {e.numero_agencia} - CC: {e.numero_conta}</option>)}
                                    </FormBootstrap.Select>
                                </FloatingLabel>
                                </FormBootstrap.Group>
                            </Col>
                        </Row>

                        <Row className="g-2">
                            
                            <Col xs={6} md={2}>
                                <FormBootstrap.Group  controlId="emissao">
                                    <FloatingLabel controlId="emissao" label="Data da Emissão" >
                                        <FormBootstrap.Control type="date" value={values.emissao} onChange={handleChange}
                                            isInvalid={!!errors.emissao} disabled={desativado}/>
                                    </FloatingLabel>
                                    
                                    <FormBootstrap.Control.Feedback type="invalid">
                                        {errors.emissao}
                                    </FormBootstrap.Control.Feedback>
                                </FormBootstrap.Group>
                            </Col>

                            <Col  xs={6} md={2}>
                                <FormBootstrap.Group  controlId="vencimento">
                                    <FloatingLabel controlId="vencimento" label="Data do vencimento">
                                        <FormBootstrap.Control type="date" value={values.vencimento} onChange={handleChange}
                                            isInvalid={!!errors.vencimento} disabled={desativado}/>
                                    </FloatingLabel>
                                    
                                    <FormBootstrap.Control.Feedback type="invalid">
                                        {errors.vencimento}
                                    </FormBootstrap.Control.Feedback>
                                </FormBootstrap.Group>
                            </Col>
                            
                            <Col md={2}>
                                <FormBootstrap.Group >
                                    <FloatingLabel controlId="valor" label="Valor do título">
                                        <CurrencyInput className="form-control"
                                            value={values.valor} onValueChange={(value) => setFieldValue('valor', value)}
                                            disabled={desativado}/>
                                    </FloatingLabel>
                            
                                    <FormBootstrap.Control.Feedback type="invalid">
                                        {errors.valor}
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
