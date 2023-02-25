import React, { useState, useEffect } from "react";
import { 
    Table, Form , Dropdown, Button, Container, Modal, 
    Row, Col, FloatingLabel 
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'
import api from '../../config/api';
import Paginacao from "../../components/Paginacao";
import { FaEdit, FaTrash, FaFileInvoiceDollar, FaUndo, FaPlus } from "react-icons/fa";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import CurrencyInput from 'react-currency-input-field';
import MessageDelete from "../../components/MessageDelete";


export default function IndexContaPagar() {

    const endpoint = '/api/contapagars'
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
        await api.get('api/contas/search/all')
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
        
        await api.get(`${endpoint}${page}${busca}`)
           
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
       
        await api.delete(`${endpoint}/${register}`)
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
        await api.put(`${endpoint}/estornar/${register}`)
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

        await api.put(`${endpoint}/baixar/${register}`, payload)
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
                    <Modal.Title>Pagamento de Titulo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row className="mb-3 g-2">
                        <Col xs={6} md={3}>
                            <Form.Group  controlId="data_pagamento">
                            <FloatingLabel controlId="data_pagamento" label="Data do Pagto">
                                <Form.Control type="date" autoFocus 
                                    value={dataPagamento}
                                    onChange={e => setDataPagamento(e.target.value) }
                                />
                            </FloatingLabel>
                            
                            <Form.Control.Feedback type="invalid">
                                
                            </Form.Control.Feedback>
                        </Form.Group>
                        </Col>

                        <Col xs={6} md={2}>
                            <Form.Group >
                                <FloatingLabel controlId="juros" label="Juros">
                                    <CurrencyInput className="form-control" style={{textAlign: 'right'}}
                                        value={juros} onValueChange={value => setJuros(value) }
                                        maxLength={9}/>
                                </FloatingLabel>
                               
                            </Form.Group>
                        </Col>

                        <Col xs={6} md={2}>
                            <Form.Group >
                                <FloatingLabel controlId="multa" label="Multa">
                                    <CurrencyInput className="form-control" style={{textAlign: 'right'}}
                                        value={multa} onValueChange={value => setMulta(value) }
                                        maxLength={9}/>
                                </FloatingLabel>
                            </Form.Group>
                        </Col>

                        <Col xs={6} md={2}>
                            <Form.Group >
                                <FloatingLabel controlId="desconto" label="Desconto">
                                    <CurrencyInput className="form-control" style={{textAlign: 'right'}}
                                        value={desconto} onValueChange={value => setDesconto(value) }
                                        maxLength={9}/>
                                </FloatingLabel>        
                            </Form.Group>
                        </Col>

                        <Col xs={6} md={3}>
                            <Form.Group >
                                <FloatingLabel controlId="tota_pago" label="Total Pago">
                                    <CurrencyInput className="form-control"
                                        value={totalPago} disabled
                                        style={{textAlign: 'right'}} />
                                </FloatingLabel>

                                <Form.Control.Feedback type="invalid">

                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                    </Row>
                    <Row  className="mb-3 g-2">
                        <Col>
                            <Form.Group  controlId="conta_id">
                                <FloatingLabel controlId="conta_id" label="Conta do débito">
                                    <Form.Select onChange={(e) => setContaSelected(e.target.value)} defaultValue={contaSeleted} >
                                        {contas.map((e) => (<option  value={e.id} key={e.id} >
                                            Banco: {e.numero_banco.padStart(4,'0')} - 
                                            Agencia: {e.numero_agencia.padStart(6,'0')} - 
                                            CC: {e.numero_conta.padStart(10,'0')} - 
                                            Saldo: {new Intl.NumberFormat('pt-BR',{ style: 'currency', currency: 'BRL' }).format(parseFloat(e.saldo).toFixed(2))}</option>)
                                        )}
                                    </Form.Select>
                                </FloatingLabel>
                            </Form.Group>
                        </Col>
                    </Row>
                        
                    
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleCloseBaixar} >Cancelar</Button>
                    <Button variant="success" onClick={handleBaixar}>Confirmar</Button>
                </Modal.Footer>
            </Modal>
                
            <Row className="mb-2 d-flex justify-content-between g-1">
                <Col xs={6} md={11}>
                    <Form.Control
                        type="search"
                        placeholder="Pesquisa"
                        onChange={(e) => setSearch(e.target.value)}
                        aria-label="Search"
                        className="me-2"
                        />
                </Col>
                <Col xs={6} md={1} className="d-flex justify-content-end">
                    <LinkContainer to="/contapagars/create" className="btn-new">
                        <Button  active variant="primary">Adicionar <FaPlus/></Button>
                    </LinkContainer>
                </Col>
            </Row>  
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
                                                            <Dropdown.Item ><FaEdit className="text-success" /> Editar</Dropdown.Item>
                                                        </LinkContainer>
                                                    }

                                                    { el.total_pago == 0 && <Dropdown.Item onClick={dialogDelete.bind(this,el.id)}><FaTrash color="red" /> Remover</Dropdown.Item>}
                                                    { el.total_pago == 0 && <Dropdown.Item onClick={dialogBaixar.bind(this, el.id, el.valor, el.conta_id)} ><FaFileInvoiceDollar color="blue" /> Baixar</Dropdown.Item>}
                                                    { el.total_pago != 0 && <Dropdown.Item onClick={dialogEstornar.bind(this, el.id)}><FaUndo color="red" /> Estornar</Dropdown.Item>} 
                                                    
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
            <Paginacao paginas={paginate} evento={getDados.bind(this)} />
        </Container>
    )    
}
