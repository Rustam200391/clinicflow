import { createBrowserRouter } from 'react-router-dom'

import AppLayout from '../components/layout/AppLayout'
import Patients from './Patients'

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Clinic overview</p>
    </div>
  )
}

function Login() {
  return (
    <div>
      <h1>Login</h1>
    </div>
  )
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'patients',
        element: <Patients />,
      },
    ],
  },
])
