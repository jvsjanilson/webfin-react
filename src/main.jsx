import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/global.css'

import { AuthProvider } from './hooks/auth';


ReactDOM.createRoot(document.getElementById('root')).render(
	//  <React.StrictMode >
	<AuthProvider>
		<App />
	</AuthProvider>
	//   {/* </React.StrictMode>, */}
)
