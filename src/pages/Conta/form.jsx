import { React, useState, useEffect } from 'react'
import { Card, Button, Container, Form as FormBootstrap, Row, Col} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import api from '../../config/api';
import { FaArrowLeft, FaPlus, FaSave } from "react-icons/fa";
import { format } from 'date-fns';
import CurrencyInput from 'react-currency-input-field';

export default function FormConta() {

    let navigate = useNavigate()
    let { _id } = useParams();

    const recurso = 'contas'
    const routeIndex = '/contas'

    const [dado, setDado] = useState({})
       
    const dadoDefault = {
        numero_banco: '', 
        numero_agencia: '', 
        numero_conta: '',
        descricao: '',
        tipo_conta: 1,
        data_abertura: format(new Date(), "yyyy-MM-dd"),
        saldo: '0,00',

    }

    const DadoSchema = Yup.object().shape({
        descricao: Yup.string().max(60, 'Tamanho máximo 60 caracteres.').required('O campo obrigatório..'),
        numero_banco: Yup.string().max(4, 'Tamanho máximo 4 caracteres.').required('O campo obrigatório.') ,
        numero_agencia: Yup.string().max(15, 'Tamanho máximo 15 caracteres.').required('O campo obrigatório.') ,
        numero_conta: Yup.string().max(30, 'Tamanho máximo 30 caracteres.').required('O campo obrigatório.') ,
        tipo_conta: Yup.number().integer('Aceita somente inteiro').min(1, 'Minímo 1').max(2, 'Máximo 2').required('O campo obrigatório.') ,
        data_abertura: Yup.date().required('O campo obrigatório.')
      });
   

    const onSubmitCreate = async (values) => {
        console.log(values.saldo.toString())
        await api.post(recurso,{
            numero_banco: values.numero_banco,
            numero_agencia: values.numero_agencia,
            numero_conta: values.numero_conta,
            descricao: values.descricao,
            tipo_conta: values.tipo_conta,
            data_abertura: values.data_abertura,
            user_id: 1, //obs: remover linha depois que implementar tela de login
            saldo: values.saldo ? parseFloat(values.saldo.replace(/[^0-9,]/gi, '').replace(',','.')) : 0
            
        })
        .then(res => {
            navigate(routeIndex)
        })
        .catch(error => {
            console.log(error)
            if (error.response.status == 422) {
                alert('Erro campo obrigatorio')
            }
        })
    }

    const onSubmitUpdate = async (values) => {

        await api.put(`${recurso}/${_id}`, {
            numero_banco: values.numero_banco,
            numero_agencia: values.numero_agencia,
            numero_conta: values.numero_conta,
            descricao: values.descricao,
            tipo_conta: values.tipo_conta,
            data_abertura: values.data_abertura,
            saldo: values.saldo ? parseFloat(values.saldo.replace(/[^0-9,]/gi, '').replace(',','.')) : 0
        })
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
                setDado({
                    numero_banco: res.data.numero_banco,
                    numero_agencia: res.data.numero_agencia,
                    numero_conta: res.data.numero_conta,
                    descricao: res.data.descricao,
                    tipo_conta: res.data.tipo_conta,
                    data_abertura: res.data.data_abertura,
                    saldo: new Intl.NumberFormat('pt-BR', {useGrouping:false}).format(parseFloat(res.data.saldo).toFixed(2)),
                })
            })
        }
    }

 
    useEffect(() => {
        getDado()
       
    },[])

    return (<Container >
        <Formik 
             onSubmit={(values) => {
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

                        <Col sm={2}>
                            <FormBootstrap.Group  controlId="numero_banco">
                                <FormBootstrap.Label>Número do Banco</FormBootstrap.Label>
                                <FormBootstrap.Control 
                                    type="text" 
                                    value={values.numero_banco} 
                                    onChange={handleChange}
                                    isInvalid={!!errors.numero_banco}
                                    maxLength={4}
                                />
                                
                                <FormBootstrap.Control.Feedback type="invalid">
                                    {errors.numero_banco}
                                </FormBootstrap.Control.Feedback>
                            </FormBootstrap.Group>
                        </Col>
                        <Col sm={3}>
                            <FormBootstrap.Group  controlId="numero_agencia">
                                <FormBootstrap.Label>Número do Agencia</FormBootstrap.Label>
                                <FormBootstrap.Control 
                                    type="text" 
                                    value={values.numero_agencia} 
                                    onChange={handleChange}
                                    isInvalid={!!errors.numero_agencia}
                                    maxLength={15}
                                />
                                
                                <FormBootstrap.Control.Feedback type="invalid">
                                    {errors.numero_agencia}
                                </FormBootstrap.Control.Feedback>
                            </FormBootstrap.Group>
                        </Col>
                        <Col sm={3}>
                            <FormBootstrap.Group  controlId="numero_conta">
                                <FormBootstrap.Label>Número do Conta</FormBootstrap.Label>
                                <FormBootstrap.Control 
                                    type="text" 
                                    value={values.numero_conta} 
                                    onChange={handleChange}
                                    isInvalid={!!errors.numero_conta}
                                    maxLength={30}
                                />
                                
                                <FormBootstrap.Control.Feedback type="invalid">
                                    {errors.numero_conta}
                                </FormBootstrap.Control.Feedback>
                            </FormBootstrap.Group>
                        </Col>

                        <Col sm={4}>

                            <FormBootstrap.Group  controlId="tipo_conta">
                                <FormBootstrap.Label>Tipo Conta</FormBootstrap.Label>
                                <FormBootstrap.Select onChange={handleChange} value={values.tipo_conta}>
                                    <option key={1} selected={values.tipo_conta == 1} value="1">1 - Conta Corrente</option>
                                    <option key={2} selected={values.tipo_conta == 2} value="2">2 - Conta Poupança</option>

                                </FormBootstrap.Select>
                            </FormBootstrap.Group>
                        </Col>


                    </Row>


                    <Row className="mb-3">

                        <Col sm={2}>
                            <FormBootstrap.Group  controlId="data_abertura">
                                <FormBootstrap.Label>Data Abertura </FormBootstrap.Label>
                                <FormBootstrap.Control type="date" value={values.data_abertura} onChange={handleChange}
                                    isInvalid={!!errors.data_abertura}
                                />
                                
                                <FormBootstrap.Control.Feedback type="invalid">
                                    {errors.data_abertura}
                                </FormBootstrap.Control.Feedback>
                            </FormBootstrap.Group>
                        </Col>
                
                        <Col sm={8}>
                            <FormBootstrap.Group  controlId="descricao">
                                <FormBootstrap.Label>Descrição</FormBootstrap.Label>
                                <FormBootstrap.Control 
                                    type="text" 
                                    value={values.descricao} 
                                    onChange={handleChange}
                                    maxLength={60}
                                    isInvalid={!!errors.descricao}
                                />
                                
                                <FormBootstrap.Control.Feedback type="invalid">
                                    {errors.descricao}
                                </FormBootstrap.Control.Feedback>
                            </FormBootstrap.Group>
                        </Col>
                        <Col sm={2}>
                            <FormBootstrap.Group >
                                <FormBootstrap.Label>Saldo</FormBootstrap.Label>
        
                                <CurrencyInput
                                    value={values.saldo}
                                    className="form-control"
                                    onValueChange={(value) => {
                                        setFieldValue('saldo', value)

                                    }}
                                    >

                                </CurrencyInput>
                         
                                <FormBootstrap.Control.Feedback type="invalid">
                                    {errors.saldo}
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
