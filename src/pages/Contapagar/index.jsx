import React, { useState, useEffect } from "react";
import { Table, Form , Dropdown, Button, Container, Modal, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'
import api from '../../config/api';
import Paginacao from "../../components/Paginacao";
import { FaEdit, FaTrash, FaFileInvoiceDollar, FaUndo } from "react-icons/fa";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import CurrencyInput from 'react-currency-input-field';
import MessageDelete from "../../components/MessageDelete";


export default function IndexContaPagar() {

    const recurso = 'contapagars'
    const [dados, setDados ] = useState([])
    const [paginate, setPaginate ] = useState({})
    const [search, setSearch] = useState('')
    const [register, setRegister] = useState(0)
    const [showDelete, setShowDelete] = useState(false)
    const [showEstornar, setShowEstornar] = useState(false)
    const [showBaixar, setShowBaixar] = useState(false)
    const [juros, setJuros] = useState("0,00")
    const [multa, setMulta] = useState("0,00")
    const [desconto, setDesconto] = useState("0,00")
    const [totalPago, setTotalPago] = useState("0,00")
    const [dataPagamento, setDataPagamento] = useState(format(new Date(), "yyyy-MM-dd"))
    const [valor, setValor] = useState("0,00")
    const [contaSeleted, setContaSelected ] = useState(1)
    const [contas, setContas ] = useState([])

    const DefaultValueBaixar = () => {
        setJuros("0,00")
        setMulta("0,00")
        setDesconto("0,00")
        setTotalPago("0,00")
        setDataPagamento(format(new Date(), "yyyy-MM-dd"))
    }
   
    async function getContas() {
        await api.get('contas/search/all')
            .then(res => {

                setContas(res.data.data)
            })
    }

    async function getDados(page = 1) {
        page = page > 1 ? '?page='+page : ''

        let busca = ''      

        if (search != "" && page == '') {
            busca = '?nome=' + search
        } else if (search != "" && page != '') {
            busca = '&nome=' + search
        }
        
        await api.get(`${recurso}${page}${busca}`)
           
            .then((res) => {
                setDados(res.data.data)
                setPaginate({
                    meta: res.data.meta,
                    links: res.data.links
                })
            });
    }

    /**
     * Handles
     */

    const handleClose = () => setShow(false)
    const handleCloseEstornar = () => setShowEstornar(false)
    const handleCloseBaixar = () => setShowBaixar(false)

    const handleConfirmarDelete = async () => {
        setShowDelete(false)
       
        await api.delete(`${recurso}/${register}`)
            .then(res => {
                if (res.status == 204){
                    setDados(dados.filter(e => e.id != register))
                } 
            })
            .catch(e => {
                if (e.response.status == 400)
                    alert(e.response.data.message)
            })
    }

    const handleEstornar = async () => {
        await api.put(`${recurso}/estornar/${register}`)
        .then(res => {
            if (res.status == 200) {
                setDados(dados.map((value) => {
                    if (value.id == register) {
                        value.data_pagamento = null
                        value.juros = 0
                        value.multa = 0
                        value.desconto = 0
                        value.total_pago = 0
                    }
                    return value
                }))
                setShowEstornar(false)
            } 
        })
        .catch(e => {
            if (e.response.status == 400)
                alert(e.response.data.message)
        })
    }

    const handleBaixar = async () => {
   
        let j, m, d = 0;
        j = juros ? parseFloat(juros.replace(/[^0-9,]/gi, '').replace(',','.')) : 0
        m = multa ? parseFloat(multa.replace(/[^0-9,]/gi, '').replace(',','.')) : 0
        d = desconto ? parseFloat(desconto.replace(/[^0-9,]/gi, '').replace(',','.')) : 0

        let payload = {
            juros: j,
            multa: m,
            desconto: d,
            data_pagamento: dataPagamento,
            conta_id: contaSeleted
        }

        await api.put(`${recurso}/baixar/${register}`, payload)
        .then(() => {
            setDados(dados.map((value) => {
                if (value.id == register) {
                    value.data_pagamento = dataPagamento
                    value.total_pago = parseFloat(value.valor) + j + m - d
                }
                return value
            }))
            setShowBaixar(false)
        })
        .catch(e => {
            alert(e.response.data.message)
        })
    }

    /*
    * Dialogs
    */
    const dialogBaixar = async (id, vlr, conta_id) => {
        setRegister(id)
        getContas()
        setShowBaixar(true)
        DefaultValueBaixar()
        setTotalPago((parseFloat(vlr).toFixed(2)))
        setValor((parseFloat(vlr).toFixed(2)))
        setContaSelected(conta_id)
    }

    const dialogEstornar = async (id) => {
        setRegister(id)
        setShowEstornar(true)
    }

    const dialogDelete = async (id) => {
        setRegister(id)
        setShowDelete(true)
    }

    useEffect( () => {
        getDados()
    }, [search])

    useEffect(()=>{
        let j, m, d, v = 0;
        j = juros ? parseFloat(juros.replace(/[^0-9,]/gi, '').replace(',','.')) : 0
        m = multa ? parseFloat(multa.replace(/[^0-9,]/gi, '').replace(',','.')) : 0
        d = desconto ? parseFloat(desconto.replace(/[^0-9,]/gi, '').replace(',','.')) : 0
        v = valor ? parseFloat(valor.replace(/[^0-9,]/gi, '').replace(',','.')) : 0
        setTotalPago((parseFloat(valor)+parseFloat(j)+parseFloat(m)-parseFloat(d)).toFixed(2))
    },[juros, multa, desconto])

    return (
        <Container fluid>

            <MessageDelete show={showDelete} onHide={handleClose} onConfirm={handleConfirmarDelete} />


            <Modal show={showEstornar} onHide={handleCloseEstornar} animation={true} id="dlgEstornar" 
                aria-labelledby="contained-modal-title-vcenter" centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Estorno de título</Modal.Title>
                </Modal.Header>
                <Modal.Body>Confirma o estorno?</Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleCloseEstornar} >Cancelar</Button>
                    <Button variant="success" onClick={handleEstornar}>Confirmar</Button>
                </Modal.Footer>
            </Modal>


            <Modal size="lg" show={showBaixar} onHide={handleCloseBaixar} animation={true} id="dlgBaixar" 
                aria-labelledby="contained-modal-title-vcenter" centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Baixa de Titulo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row className="mb-3">
                        <Col xs={6} md={3}>
                            <Form.Group  controlId="data_pagamento">
                            <Form.Label>Data Pagto</Form.Label>
                            <Form.Control type="date" 
                               value={dataPagamento}
                               onChange={e => {
                                console.log(e.target.value)
                                setDataPagamento(e.target.value)
                               } }
                            />
                            
                            <Form.Control.Feedback type="invalid">
                                
                            </Form.Control.Feedback>
                        </Form.Group>
                        </Col>

                        <Col xs={6} md={2}>
                            <Form.Group >
                                <Form.Label>Juros</Form.Label>
        
                                <CurrencyInput
                                    className="form-control"
                                    style={{textAlign: 'right'}}
                                    value={juros}
                                    onValueChange={value => setJuros(value) }
                                    maxLength={9}
                                    >

                                </CurrencyInput>
                            </Form.Group>
                        </Col>

                        <Col xs={6} md={2}>
                            <Form.Group >
                                <Form.Label>Multa</Form.Label>
        
                                <CurrencyInput
                                    className="form-control"
                                    style={{textAlign: 'right'}}
                                    value={multa}
                                    onValueChange={value => setMulta(value) }
                                    maxLength={9}
                                    >

                                </CurrencyInput>
                            </Form.Group>
                        </Col>

                        <Col xs={6} md={2}>
                            <Form.Group >
                                <Form.Label>Desconto</Form.Label>
        
                                <CurrencyInput
                                    className="form-control"
                                    style={{textAlign: 'right'}}
                                    value={desconto}
                                    onValueChange={value => setDesconto(value) }
                                    maxLength={9}
                                    >

                                </CurrencyInput>
                            </Form.Group>
                        </Col>

                        <Col xs={6} md={3}>
                            <Form.Group >
                                <Form.Label>Total Pago</Form.Label>
        
                                <CurrencyInput
                                    className="form-control"
                                    value={totalPago}
                                    disabled
                                    style={{textAlign: 'right'}}
                                    >

                                </CurrencyInput>
                        
                                <Form.Control.Feedback type="invalid">

                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                    </Row>
                    <Row>
                        <Col>
                            <Form.Group  controlId="fornecedor_id">
                                <Form.Label>Conta do débito</Form.Label>
                                <Form.Select onChange={(e) => setContaSelected(e.target.value)} defaultValue={contaSeleted} >
                                    {contas.map((e) => (<option  value={e.id} key={e.id} >
                                        Banco: {e.numero_banco.padStart(4,'0')} - 
                                        Agencia: {e.numero_agencia.padStart(6,'0')} - 
                                        CC: {e.numero_conta.padStart(10,'0')} - 
                                        Saldo: {new Intl.NumberFormat('pt-BR',{ style: 'currency', currency: 'BRL' }).format(parseFloat(e.saldo).toFixed(2))}</option>)
                                    )}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                        
                    
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleCloseBaixar} >Cancelar</Button>
                    <Button variant="success" onClick={handleBaixar}>Confirmar</Button>
                </Modal.Footer>
            </Modal>
                
            <Form className="d-flex mb-2">
                <LinkContainer to="/contapagars/create">
                    <Button active className="me-2" variant="primary">Adicionar</Button>
                </LinkContainer>
                  <Form.Control
                    type="search"
                    placeholder="Pesquisar"
                    onChange={(e) => setSearch(e.target.value)}
                    aria-label="Search"
                  />
    
            </Form>
            <Table responsive="sm" size="sm" striped bordered hover >
                <thead  className="table-dark">
                    <tr>
                        <th style={{textAlign: 'center'}} >#</th>
                        <th style={{width: '10rem',textAlign: 'center'}}>Documento</th>
                        <th style={{textAlign: 'center'}} >Nome do Fornecedor</th>
                        <th style={{width: '6.5rem',textAlign: 'center'}} >Emissão</th>
                        <th style={{width: '6.5rem',textAlign: 'center'}} >Vencimento</th>
                        <th style={{width: '7rem',textAlign: 'center'}} >Valor</th>
                        <th style={{width: '6.5rem',textAlign: 'center'}} >Dt. Pagto</th>
                        <th style={{width: '7rem',textAlign: 'center'}} >Vlr. Pago</th>
                    </tr>
                </thead>
                <tbody>
                    {dados.map(el => {
                        return (
                            <tr key={el.id}>
                                <td style={{width: '5rem'}} >
                                    {
                                        
                                        <Dropdown>
                                            <div className="d-grid gap-2">
                                                <Dropdown.Toggle size="sm" variant="primary" id="dropdown-basic">
                                                    Opções
                                                </Dropdown.Toggle>
                                        
                                                <Dropdown.Menu variant="">
                                                    
                                                    { el.total_pago == 0 && 
                                                        <LinkContainer to={`/contapagars/edit/${el.id}`}>
                                                            <Dropdown.Item href="javascript:void(0)"><FaEdit className="text-success" /> Editar</Dropdown.Item>
                                                        </LinkContainer>
                                                    }

                                                    { el.total_pago == 0 && <Dropdown.Item href="javascript:void(0)" onClick={dialogDelete.bind(this,el.id)}><FaTrash color="red" /> Remover</Dropdown.Item>}
                                                    { el.total_pago == 0 && <Dropdown.Item href="javascript:void(0)" onClick={dialogBaixar.bind(this, el.id, el.valor, el.conta_id)} ><FaFileInvoiceDollar color="blue" /> Baixar</Dropdown.Item>}
                                                    { el.total_pago != 0 && <Dropdown.Item href="javascript:void(0)" onClick={dialogEstornar.bind(this, el.id)}><FaUndo color="red" /> Estornar</Dropdown.Item>} 
                                                    
                                                </Dropdown.Menu>
                                            </div>
                                        </Dropdown>
                                    }   
                                </td>                                
                                <td>{el.documento}</td>
                                <td>{el.fornecedor.nome}</td>
                                <td>{format(new Date(el.emissao.replace("-","/")), "dd/MM/Y", {locale: ptBR})}</td>
                                
                                
                                <td>{format(new Date(el.vencimento.replace("-","/")), "dd/MM/Y", {locale: ptBR})}</td>
                                
                                
                                <td style={{textAlign: 'right'}}>{new Intl.NumberFormat('pt-BR',{ style: 'currency', currency: 'BRL' }).format(parseFloat(el.valor).toFixed(2))}</td>
                                
                                
                                <td>{el.data_pagamento ? format(new Date(el.data_pagamento.replace("-","/") ), "dd/MM/Y ", {locale: ptBR}) : ''}</td>
                                
                                <td style={{textAlign: 'right'}}>{new Intl.NumberFormat('pt-BR',{ style: 'currency', currency: 'BRL' }).format(parseFloat(el.total_pago).toFixed(2))}</td>

                            </tr>
                        )
                    })}
                </tbody>
                </Table>
                 <tfoot>
                    <Paginacao paginas={paginate} evento={getDados.bind(this)} />
                </tfoot>
        </Container>
    )    
}
