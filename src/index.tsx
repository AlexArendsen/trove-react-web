import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { Auth0Provider } from '@auth0/auth0-react';
import { Auth0Constants } from './constants/Auth0';

const getRedirectUrl = () => {
  const r = window.location.origin
  console.log(`Setting redirect to ${r}`)
  return r
}

ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
      domain={ Auth0Constants.domain }
      clientId={ Auth0Constants.clientId }
      authorizationParams={{
        redirect_uri: getRedirectUrl(),
        audience: 'https://nulist.app/api',
        scope: 'read:items write:items'
      }}
      >
      <App />
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
