import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
console.log("Google Client ID:", clientId);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
 );
