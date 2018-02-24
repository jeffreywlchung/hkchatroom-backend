import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { Helmet } from 'react-helmet'

ReactDOM.render(
    [<Helmet>
        <title>Chatroom</title>
    </Helmet>,
    <App />], document.getElementById('root'));
registerServiceWorker();
