import React from 'react';
import { BrowserRouter } from 'react-router-dom';


import AppRoutes from './app.routes';
import AuthRoute from './auth.routes';


export default function Routes() {
   
    return (
        <BrowserRouter>
            { <AppRoutes/> }
        </BrowserRouter>
    );
}

