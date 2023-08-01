import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

if (!window.ethereum) {
    root.render(
        <React.StrictMode>
            You need to install a Web3 browser wallet (such as MetaMask) to use this dapp.
        </React.StrictMode>
    );
} else {
    import('./App').then(({default: App}) => {
        root.render(
            <React.StrictMode>
                <App/>
            </React.StrictMode>
        );
    })
}