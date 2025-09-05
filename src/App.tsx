import { Provider } from 'react-redux'
import './App.css'
import { RouterProvider } from '@tanstack/react-router'
// import { LoginPage } from './components/LoginPage'
import { store } from './store';
import { router } from './routes';
import { Toaster } from 'sonner';

function App() {

  return (
    <>
      <Provider store={ store }>
        <Toaster
          position="top-right"
          richColors
          closeButton
        />
        <RouterProvider router={ router } />
      </Provider>
    </>
  )
}

export default App
