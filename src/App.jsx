import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/global.css'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Routes, Route, BrowserRouter, Link } from 'react-router-dom'
import Home from './pages/Home'
import {LinkContainer} from 'react-router-bootstrap'
import IndexEstado from "./pages/Estado";
import FormEstado from "./pages/Estado/form";
import IndexCidade from "./pages/Cidade";
import FormCidade from "./pages/Cidade/form";
import IndexConta from "./pages/Conta";
import FormConta from "./pages/Conta/form";
import IndexCliente from "./pages/Cliente";
import FormCliente from "./pages/Cliente/form";
import IndexFornecedor from "./pages/Fornecedor";
import FormFornecedor from "./pages/Fornecedor/form";
import IndexContaReceber from "./pages/Contareceber";
import FormContaReceber from "./pages/Contareceber/form";
import IndexContaPagar from "./pages/Contapagar";
import FormContaPagar from "./pages/Contapagar/form";

const App = () => {

	
  return (
    <BrowserRouter>
	
	<div className="App">
	
		<header className="mb-2">
		
			<Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
				<Container>
					<LinkContainer to="/">
						<Navbar.Brand href="javascript:void(0)">Home</Navbar.Brand>
					</LinkContainer>
					<Navbar.Toggle aria-controls="responsive-navbar-nav" />
					<Navbar.Collapse id="responsive-navbar-nav">
						<Nav className="me-auto">
							<NavDropdown title="Cadastros" id="collasible-nav-dropdown-cadastro" >
								<LinkContainer to="/clientes">
									<NavDropdown.Item href="javascript:void(0)">Clientes</NavDropdown.Item>
								</LinkContainer>
								
								<LinkContainer to="/fornecedores">
									<NavDropdown.Item href="#action/3.2">Fornecedores </NavDropdown.Item>
								</LinkContainer>

								<LinkContainer to="/contas">
									<NavDropdown.Item href="javascript:void(0)">Contas</NavDropdown.Item>
								</LinkContainer>
								
								{/* <Link to="/estados">Estados</Link> */}
								<LinkContainer to="/estados">
									<NavDropdown.Item href="javascript:void(0)" >Estados</NavDropdown.Item>
								</LinkContainer>
								<LinkContainer to="/cidades">
									<NavDropdown.Item href="javascript:void(0)">Cidades</NavDropdown.Item>
								</LinkContainer>
							</NavDropdown>

							<NavDropdown title="Financeiro" id="collasible-nav-dropdown_financeiro" >
							<LinkContainer to="/contarecebers">
								<NavDropdown.Item href="jsvascript:void(0)">Contas a Receber</NavDropdown.Item>
							</LinkContainer>
							<LinkContainer to="/contapagars">
								<NavDropdown.Item href="jsvascript:void(0)">Contas a Pagar</NavDropdown.Item>
							</LinkContainer>
								
								
							</NavDropdown>
						</Nav>

						<Nav>
							<NavDropdown title="Janilson Varela" id="collasible-nav-dropdown-user" >
								<NavDropdown.Item href="#action/3.1">Sair</NavDropdown.Item>
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
			<Route path="/estados/create" element={<FormEstado/>}/>
			<Route path="/estados/edit/:_id" element={<FormEstado/>}/>

			<Route path="/cidades" element={<IndexCidade/>}/>
			<Route path="/cidades/create" element={<FormCidade/>}/>
			<Route path="/cidades/edit/:_id" element={<FormCidade/>}/>

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
		</Routes>
		</main>
	</div>   	
 
    </BrowserRouter>
  );
}

export default App;