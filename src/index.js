import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap-reboot.min.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min'
import './services/i18n'
import './index.css';
import App from './App';
import {AuthProvider} from "./contexts/AuthContext";
//import reportWebVitals from './reportWebVitals';

ReactDOM.render(
    <React.StrictMode>
        <AuthProvider>
            <Router>
                <React.Suspense fallback="Loading...">
                    <App/>
                </React.Suspense>
            </Router>
        </AuthProvider>
    </React.StrictMode>
    ,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
