import { NavLink } from 'react-router-dom'

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">
        Clinic<span>Flow</span>
      </div>

      <nav>
        <NavLink to="/" end className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          Dashboard
        </NavLink>

        <div className="nav-item">
          Calendar
        </div>

        <NavLink to="/patients" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          Patients
        </NavLink>

        <NavLink to="/doctors" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          Doctors
        </NavLink>

        <div className="nav-item">
          Employees
        </div>

        <div className="nav-item">
          Reports
        </div>

        <div className="nav-item">
          Settings
        </div>
      </nav>

      <div className="sidebar-bottom">
        Baku Medical Clinic
      </div>
    </aside>
  )
}

export default Sidebar
