function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">
        Clinic<span>Flow</span>
      </div>

      <nav>
        <div className="nav-item active">
          Dashboard
        </div>

        <div className="nav-item">
          Calendar
        </div>

        <div className="nav-item">
          Patients
        </div>

        <div className="nav-item">
          Doctors
        </div>

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