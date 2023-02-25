import { React, useState, useEffect } from 'react'
import { FloatingLabel, Card, Button, Container, Form as FormBootstrap, Row, Col} from 'react-bootstrap';
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

    const endpoint = '/api/contas'
    const routeIndex = '/contas'

    const [initialValues, setInitialValues] = useState({
        numero_banco: '', 
        numero_agencia: '', 
        numero_conta: '',
        descricao: '',
        tipo_conta: 1,
        data_abertura: format(new Date(), "yyyy-MM-dd"),
        saldo: '0,00',

    })
    
    const validationSchema = Yup.object().shape({
        descricao: Yup.string().max(60, 'Tamanho máximo 60 caracteres.').required('O campo obrigatório..'),
        numero_banco: Yup.string().max(4, 'Tamanho máximo 4 caracteres.').required('O campo obrigatório.') ,
        numero_agencia: Yup.string().max(15, 'Tamanho máximo 15 caracteres.').required('O campo obrigatório.') ,
        numero_conta: Yup.string().max(30, 'Tamanho máximo 30 caracteres.').required('O campo obrigatório.') ,
        tipo_conta: Yup.number().integer('Aceita somente inteiro').min(1, 'Minímo 1').max(2, 'Máximo 2').required('O campo obrigatório.') ,
        data_abertura: Yup.date().required('O campo obrigatório.')
      });
   

    const onSubmitCreate = async ({
        numero_banco, numero_agencia, numero_conta, descricao, 
        tipo_conta, data_abertura, saldo
    }) => {
        await api.post(endpoint,{
            numero_banco,
            numero_agencia,
            numero_conta,
            descricao,
            tipo_conta,
            data_abertura,
            user_id: 1, //obs: remover linha depois que implementar tela de login
            saldo: saldo ? parseFloat(saldo.replace(/[^0-9,]/gi, '').replace(',','.')) : 0
            
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

    const onSubmitUpdate = async ({
        numero_banco, numero_agencia, numero_conta, descricao, 
        tipo_conta, data_abertura, saldo
    }) => {

        await api.put(`${endpoint}/${_id}`, {
            numero_banco,
            numero_agencia,
            numero_conta,
            descricao,
            tipo_conta,
            data_abertura,
            saldo: saldo ? parseFloat(saldo.replace(/[^0-9,]/gi, '').replace(',','.')) : 0
        })
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
                setInitialValues({
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

    return (<Container fluid>
        <Formik 
            onSubmit={(values) => _id ? onSubmitUpdate(values) : onSubmitCreate(values) }
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
                        <Button className='me-1'  type='submit' variant={ _id ? 'success' : 'primary' }>{(_id? (<FaSave/>) : (<FaPlus/>))} { _id ? 'SALVAR' : 'CRIAR' }</Button>
                        <LinkContainer to={routeIndex}>
                            <Button  variant="secondary"><FaArrowLeft/> VOLTAR</Button>
                        </LinkContainer>
                    </Card.Header>
                    <Card.Body>

                        <Row className="mb-2 g-2">
                            <Col md={2}>
                                <FormBootstrap.Group  controlId="numero_banco">
                                    <FloatingLabel controlId="numero_banco" label="Número do Banco" >
                                        <FormBootstrap.Control type="text" value={values.numero_banco} autoFocus
                                            onChange={handleChange} isInvalid={!!errors.numero_banco} maxLength={4} />
                                    </FloatingLabel>
                                   
                                    <FormBootstrap.Control.Feedback type="invalid">
                                        {errors.numero_banco}
                                    </FormBootstrap.Control.Feedback>
                                </FormBootstrap.Group>
                            </Col>

                            <Col xs={5} md={3}>
                                <FormBootstrap.Group  controlId="numero_agencia">
                                    <FloatingLabel controlId="numero_agencia" label="Número do Agencia" >
                                        <FormBootstrap.Control type="text" value={values.numero_agencia} 
                                            onChange={handleChange} isInvalid={!!errors.numero_agencia} maxLength={15}/>
                                    </FloatingLabel>
                                    
                                    <FormBootstrap.Control.Feedback type="invalid">
                                        {errors.numero_agencia}
                                    </FormBootstrap.Control.Feedback>
                                </FormBootstrap.Group>
                            </Col>

                            <Col xs={7} md={3}>
                                <FormBootstrap.Group  controlId="numero_conta">
                                    <FloatingLabel controlId="numero_conta" label="Número do Conta" >
                                        <FormBootstrap.Control type="text" value={values.numero_conta} onChange={handleChange}
                                            isInvalid={!!errors.numero_conta} maxLength={30}/>
                                    </FloatingLabel>
                                    
                                    <FormBootstrap.Control.Feedback type="invalid">
                                        {errors.numero_conta}
                                    </FormBootstrap.Control.Feedback>
                                </FormBootstrap.Group>
                            </Col>

                            <Col md={4}>
                                <FormBootstrap.Group  controlId="tipo_conta">
                                    <FloatingLabel controlId="tipo_conta" label="Tipo Conta" >
                                        <FormBootstrap.Select onChange={handleChange} value={values.tipo_conta}>
                                            <option key={1} value={1} >1 - Conta Corrente</option>
                                            <option key={2} value={2} >2 - Conta Poupança</option>
                                        </FormBootstrap.Select>
                                    </FloatingLabel>
                                </FormBootstrap.Group>
                            </Col>

                        </Row>

                        <Row className="g-2">
                            <Col md={2}>
                                <FormBootstrap.Group  controlId="data_abertura">
                                    <FloatingLabel controlId="data_abertura" label="Data Abertura" >
                                        <FormBootstrap.Control type="date" value={values.data_abertura} onChange={handleChange}
                                            isInvalid={!!errors.data_abertura}/>
                                    </FloatingLabel>
                                    
                                    <FormBootstrap.Control.Feedback type="invalid">
                                        {errors.data_abertura}
                                    </FormBootstrap.Control.Feedback>
                                </FormBootstrap.Group>
                            </Col>
                    
                            <Col md={8}>
                                <FormBootstrap.Group  controlId="descricao">
                                    <FloatingLabel controlId="descricao" label="Descrição" >
                                        <FormBootstrap.Control type="text" value={values.descricao} onChange={handleChange}
                                            maxLength={60} isInvalid={!!errors.descricao}/>
                                    </FloatingLabel>
                                    
                                    <FormBootstrap.Control.Feedback type="invalid">
                                        {errors.descricao}
                                    </FormBootstrap.Control.Feedback>
                                </FormBootstrap.Group>
                            </Col>
                            <Col md={2}>
                                <FormBootstrap.Group >
                                    <FloatingLabel controlId="saldo" label="Saldo" >
                                        <CurrencyInput className="form-control" value={values.saldo}
                                            onValueChange={(value) => setFieldValue('saldo', value)}/>
                                    </FloatingLabel>
                                    
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
