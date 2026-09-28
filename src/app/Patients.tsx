import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Plus, Search, X } from 'lucide-react'

type Patient = {
  id: number
  name: string
  initials: string
  email: string
  phone: string
  lastVisit: string
  status: 'Active' | 'Follow-up'
}

const initialPatients: Patient[] = [
  { id: 1, name: 'Aylin Mammadova', initials: 'AM', email: 'aylin.m@example.com', phone: '+994 50 234 18 62', lastVisit: 'Sep 24, 2026', status: 'Active' },
  { id: 2, name: 'Rashad Aliyev', initials: 'RA', email: 'rashad.a@example.com', phone: '+994 55 416 72 09', lastVisit: 'Sep 22, 2026', status: 'Follow-up' },
  { id: 3, name: 'Leyla Hasanli', initials: 'LH', email: 'leyla.h@example.com', phone: '+994 70 325 44 81', lastVisit: 'Sep 19, 2026', status: 'Active' },
  { id: 4, name: 'Murad Karimov', initials: 'MK', email: 'murad.k@example.com', phone: '+994 50 891 06 33', lastVisit: 'Sep 16, 2026', status: 'Active' },
  { id: 5, name: 'Nigar Safarova', initials: 'NS', email: 'nigar.s@example.com', phone: '+994 51 773 29 14', lastVisit: 'Sep 12, 2026', status: 'Follow-up' },
  { id: 6, name: 'Tural Huseynov', initials: 'TH', email: 'tural.h@example.com', phone: '+994 55 602 11 47', lastVisit: 'Sep 08, 2026', status: 'Active' },
]

function Patients() {
  const [patients, setPatients] = useState(initialPatients)
  const [query, setQuery] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  useEffect(() => {
    if (!isAddDialogOpen) return
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsAddDialogOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isAddDialogOpen])

  const filteredPatients = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase()
    if (!normalizedQuery) return patients
    return patients.filter((patient) =>
      `${patient.name} ${patient.email} ${patient.phone}`.toLocaleLowerCase().includes(normalizedQuery),
    )
  }, [patients, query])

  function handleAddPatient(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedName = name.trim()
    if (!trimmedName) return
    const initials = trimmedName.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
    setPatients((currentPatients) => [
      { id: Date.now(), name: trimmedName, initials, email: email.trim(), phone: phone.trim(), lastVisit: 'No visits yet', status: 'Active' },
      ...currentPatients,
    ])
    setQuery('')
    setName('')
    setEmail('')
    setPhone('')
    setIsAddDialogOpen(false)
  }

  return (
    <section className="patients-page">
      <div className="patients-heading">
        <div>
          <h1>Patients</h1>
          <p>Manage your clinic's patient records.</p>
        </div>
        <button className="add-patient-button" type="button" aria-label="Add patient" title="Add patient" onClick={() => setIsAddDialogOpen(true)}><Plus size={21} aria-hidden="true" /></button>
      </div>

      {isAddDialogOpen && (
        <div className="patient-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsAddDialogOpen(false) }}>
          <section className="patient-modal" role="dialog" aria-modal="true" aria-labelledby="add-patient-title">
            <div className="patient-modal-heading">
              <div><h2 id="add-patient-title">Add patient</h2><p>Enter the patient's contact details.</p></div>
              <button className="patient-modal-close" type="button" aria-label="Close" onClick={() => setIsAddDialogOpen(false)}><X size={19} /></button>
            </div>
            <form className="patient-form" onSubmit={handleAddPatient}>
              <label>Full name<input autoFocus required value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Aylin Mammadova" /></label>
              <label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="patient@example.com" /></label>
              <label>Phone<input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+994 50 123 45 67" /></label>
              <div className="patient-form-actions">
                <button className="patient-cancel-button" type="button" onClick={() => setIsAddDialogOpen(false)}>Cancel</button>
                <button className="add-patient-button patient-submit-button" type="submit">Add patient</button>
              </div>
            </form>
          </section>
        </div>
      )}

      <div className="patients-card">
        <div className="patients-toolbar">
          <div>
            <h2>All patients</h2>
            <span>{filteredPatients.length} patients</span>
          </div>
          <label className="patient-search">
            <Search size={17} aria-hidden="true" />
            <input
              type="search"
              placeholder="Search patients..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search patients by name, email, or phone"
            />
          </label>
        </div>

        <div className="patients-table-wrap">
          <table className="patients-table">
            <thead>
              <tr><th>Patient</th><th>Phone</th><th>Last visit</th><th>Status</th></tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <tr key={patient.id}>
                  <td>
                    <div className="patient-identity">
                      <span className="patient-avatar">{patient.initials}</span>
                      <span><strong>{patient.name}</strong><small>{patient.email}</small></span>
                    </div>
                  </td>
                  <td>{patient.phone}</td>
                  <td>{patient.lastVisit}</td>
                  <td><span className={`patient-status ${patient.status === 'Active' ? 'is-active' : 'needs-follow-up'}`}>{patient.status}</span></td>
                </tr>
              ))}
              {filteredPatients.length === 0 && (
                <tr><td className="patients-empty" colSpan={4}>No patients match “{query}”.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default Patients
