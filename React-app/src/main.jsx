import  React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
 <React.StrictMode>
    <Router> {/* Open the context at the absolute top */}
      <App path="home" />
    </Router>
  </React.StrictMode>
)
