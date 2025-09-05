import { Provider } from 'react-redux'
import './App.css'
import { RouterProvider } from '@tanstack/react-router'
// import { LoginPage } from './components/LoginPage'
import { store } from './store';
import { router } from './routes';

function App() {

  return (
    <>
      <Provider store={ store }>
        <RouterProvider router={ router } />
      </Provider>
    </>
  )
}

export default App
