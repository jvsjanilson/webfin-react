import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './app.routes';
import AuthRoute from './auth.routes';

import { useAuth } from '../hooks/auth';

export default function Routes() {
    const { logado } = useAuth()
  
    return (
        <BrowserRouter>
            { logado ? <AppRoutes/> : <AuthRoute/> }
        </BrowserRouter>
    );
}

