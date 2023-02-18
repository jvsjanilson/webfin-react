import React from "react";
import { Button, Container, Modal } from 'react-bootstrap';

export default function MessageDelete({onHide, onConfirm, show})  {
    return (<Container>
         <Modal show={show} onHide={onHide} animation={true}  
                aria-labelledby="contained-modal-title-vcenter" centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Remover</Modal.Title>
                </Modal.Header>
                <Modal.Body>Deseja realmente remover?</Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={onHide} >Cancelar</Button>
                    <Button variant="success" onClick={onConfirm}>Confirmar</Button>
                </Modal.Footer>
            </Modal>
    </Container>)
}