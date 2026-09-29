import { createBrowserRouter } from 'react-router-dom'

import AppLayout from '../components/layout/AppLayout'
import PatientDetails from './PatientDetails'
import Patients from './Patients'
import Doctors from './Doctors'
import DoctorDetails from './DoctorDetails'

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
      {
        path: 'patients/:patientId',
        element: <PatientDetails />,
      },
      {
        path: 'doctors',
        element: <Doctors />,
      },
      {
        path: 'doctors/:doctorId',
        element: <DoctorDetails />,
      },
    ],
  },
])
