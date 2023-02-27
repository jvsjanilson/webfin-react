import React from "react"    
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import {LinkContainer} from 'react-router-bootstrap'
import IndexEstado from "../pages/Estado";
import FormEstado from "../pages/Estado/form";
import IndexCidade from "../pages/Cidade";
import FormCidade from "../pages/Cidade/form";
import IndexConta from "../pages/Conta";
import FormConta from "../pages/Conta/form";
import IndexCliente from "../pages/Cliente";
import FormCliente from "../pages/Cliente/form";
import IndexFornecedor from "../pages/Fornecedor";
import FormFornecedor from "../pages/Fornecedor/form";
import IndexContaReceber from "../pages/Contareceber";
import FormContaReceber from "../pages/Contareceber/form";
import IndexContaPagar from "../pages/Contapagar";
import FormContaPagar from "../pages/Contapagar/form";

import { useAuth } from "../hooks/auth";
import { useNavigate } from "react-router-dom";
import { MdExitToApp, MdPayment, MdAccountBalance,MdRealEstateAgent } from 'react-icons/md'
import { GiReceiveMoney } from 'react-icons/gi'
import { FaUsers, FaCity, FaHome } from 'react-icons/fa'

export default function AppRoutes() {
    const { signOut, nomeLogin } = useAuth()
    const navigate = useNavigate()
    

    const handleLogout = async () => {
        signOut()
        navigate("/")
    }

    return (
        <div className="App">
        <header className="mb-2">
        
            <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark"  >
                <Container  >
                    <LinkContainer to="/">
                        <Navbar.Brand href="javascript:void(0)"><FaHome/></Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto">
                            <NavDropdown title="Cadastros" id="collasible-nav-dropdown-cadastro" >
                                <LinkContainer to="/clientes">
                                    <NavDropdown.Item href="javascript:void(0)"><FaUsers/>  Clientes</NavDropdown.Item>
                                </LinkContainer>
                                
                                <LinkContainer to="/fornecedores">
                                    <NavDropdown.Item href="#action/3.2"><FaUsers/> Fornecedores </NavDropdown.Item>
                                </LinkContainer>

                                <LinkContainer to="/contas">
                                    <NavDropdown.Item href="javascript:void(0)"><MdAccountBalance/> Contas</NavDropdown.Item>
                                </LinkContainer>
                                
                                <LinkContainer to="/estados">
                                    <NavDropdown.Item href="javascript:void(0)"><MdRealEstateAgent/> Estados</NavDropdown.Item>
                                </LinkContainer>
                                <LinkContainer to="/cidades">
                                    <NavDropdown.Item href="javascript:void(0)"><FaCity/> Cidades</NavDropdown.Item>
                                </LinkContainer>
                            </NavDropdown>

                            <NavDropdown title="Financeiro" id="collasible-nav-dropdown_financeiro" >
                            <LinkContainer to="/contarecebers">
                                <NavDropdown.Item href="javascript:void(0)"><GiReceiveMoney/> Contas a Receber</NavDropdown.Item>
                            </LinkContainer>
                            <LinkContainer to="/contapagars">
                                <NavDropdown.Item href="javascript:void(0)"><MdPayment/> Contas a Pagar</NavDropdown.Item>
                            </LinkContainer>
                                
                                
                            </NavDropdown>
                        </Nav>

                        <Nav  >
                            <NavDropdown title={nomeLogin} id="collasible-nav-dropdown-user" >
                                <NavDropdown.Item onClick={handleLogout} href="javascript:void(0)"><MdExitToApp/> Sair</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>  
    </header>
    <main>
        <Routes>
                
            <Route path="/" element={<Home/>}/>
            
            <Route path="/estados" element={<IndexEstado/>}/>

            <Route path="/cidades" element={<IndexCidade/>}/>
            
            <Route path="/contas" element={<IndexConta/>}/>
            <Route path="/contas/create" element={<FormConta/>}/>
            <Route path="/contas/edit/:_id" element={<FormConta/>}/>

            <Route path="/clientes" element={<IndexCliente/>}/>
            <Route path="/clientes/create" element={<FormCliente/>}/>
            <Route path="/clientes/edit/:_id" element={<FormCliente/>}/>

            <Route path="/fornecedores" element={<IndexFornecedor/>}/>
            <Route path="/fornecedores/create" element={<FormFornecedor/>}/>
            <Route path="/fornecedores/edit/:_id" element={<FormFornecedor/>}/>

            <Route path="/contarecebers" element={<IndexContaReceber/>}/>
            <Route path="/contarecebers/create" element={<FormContaReceber/>}/>
            <Route path="/contarecebers/edit/:_id" element={<FormContaReceber/>}/>

            <Route path="/contapagars" element={<IndexContaPagar/>}/>
            <Route path="/contapagars/create" element={<FormContaPagar/>}/>
            <Route path="/contapagars/edit/:_id" element={<FormContaPagar/>}/>
            <Route path="*" element={<Home/>}/>   
            
        </Routes>
        </main>
    </div> 
    )
}
    
    