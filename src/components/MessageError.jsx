import { React, useState, useEffect } from 'react'
import { Button, Toast, ToastContainer, Col} from 'react-bootstrap';

const MessageError = (props) => {
    const [mostrar, setMostrar] = useState(false)
    
    useEffect(() => {
        setMostrar(props.show)
    }, [props.show])

    return (
        <div
        aria-live="polite"
        aria-atomic="true">
            <ToastContainer position="top-end" className="p-3">

            <Toast onClose={() => setMostrar(false)} show={mostrar} >
            <Toast.Header>
                <strong className="me-auto">{props.title}</strong>
            </Toast.Header>
            <Toast.Body>{props.message}</Toast.Body>
            </Toast>
                  
            </ToastContainer>
        
      </div>  
    )
}

export default MessageError