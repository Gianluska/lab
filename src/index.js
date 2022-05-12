import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css'

import reportWebVitals from './reportWebVitals';

function Overlay() {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', width: '100%', height: '100%' }}>
      <a href="https://www.linkedin.com/in/gianlucca-claudino" target='_blank' rel="noreferrer" style={{ position: 'absolute', bottom: 40, left: 40, fontSize: '13px' }}>
        Gianlucca Claudino
        <br />
        <small>Creative Developer</small>
      </a>
      <a href='https://www.blog.gianlucca.dev/' target='_blank' rel="noreferrer" style={{ position: 'absolute', top: 40, left: 40, fontSize: '13px' }}>blog —</a>
      <div style={{ position: 'absolute', bottom: 40, right: 40, fontSize: '13px' }}>11/01/2001</div>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    <Overlay />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
