import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import React from 'react'
import { Toaster } from 'react-hot-toast'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import store from './store/index.ts'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
  <Provider store={store}>
    <BrowserRouter>
      <App />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          }
        }}
      />
    </BrowserRouter>
  </Provider>
</React.StrictMode>
)
