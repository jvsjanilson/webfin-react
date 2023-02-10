import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/global.css'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Routes, Route, BrowserRouter, Link } from 'react-router-dom'
import Estados from './pages/Estado'
import Home from './pages/Home'
import {LinkContainer} from 'react-router-bootstrap'
import Cidades from "./pages/Cidade/Index";
import CreateEstado from "./pages/Estado/create";

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
								<NavDropdown.Item href="#action/3.1">Clientes</NavDropdown.Item>
								<NavDropdown.Item href="#action/3.2">Fornecedores </NavDropdown.Item>
								<NavDropdown.Item href="#action/3.3">Contas</NavDropdown.Item>
								
								{/* <Link to="/estados">Estados</Link> */}
								<LinkContainer to="/estados">
									<NavDropdown.Item href="javascript:void(0)" >Estados</NavDropdown.Item>
								</LinkContainer>
								<LinkContainer to="/cidades">
									<NavDropdown.Item href="javascript:void(0)">Cidades</NavDropdown.Item>
								</LinkContainer>
							</NavDropdown>

							<NavDropdown title="Financeiro" id="collasible-nav-dropdown_financeiro" >
								<NavDropdown.Item href="#action/3.6">Contas a Receber</NavDropdown.Item>
								<NavDropdown.Item href="#action/3.7">Contas a Pagar</NavDropdown.Item>
								
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
			<Route path="/estados" element={<Estados/>}/>
			<Route path="/estados/create" element={<CreateEstado/>}/>
			<Route path="/estados/edit/:_id" element={<CreateEstado/>}/>

			<Route path="/cidades" element={<Cidades/>}/>
		</Routes>
		</main>
	</div>   	
 
    </BrowserRouter>
  );
}

export default App;