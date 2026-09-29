import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Plus, Search, X } from 'lucide-react'
import { Link } from 'react-router-dom'

type Patient = {
  id: string
  name: string
  initials: string
  email: string | null
  phone: string | null
  lastVisit: string | null
  status: 'Active' | 'Follow-up'
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? ''

async function getErrorMessage(response: Response) {
  try {
    const body = await response.json() as { detail?: string; errors?: Record<string, string> }
    return body.errors ? Object.values(body.errors).join(' ') : body.detail || `Request failed (${response.status}).`
  } catch {
    return `Request failed (${response.status}).`
  }
}

function Patients() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [formError, setFormError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
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

  useEffect(() => {
    const controller = new AbortController()
    const params = new URLSearchParams()
    if (query.trim()) params.set('search', query.trim())
    setIsLoading(true)
    setLoadError('')
    fetch(`${apiBaseUrl}/api/patients?${params}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(await getErrorMessage(response))
        return response.json() as Promise<Patient[]>
      })
      .then(setPatients)
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setLoadError(error instanceof Error ? error.message : 'Unable to load patients.')
      })
      .finally(() => { if (!controller.signal.aborted) setIsLoading(false) })
    return () => controller.abort()
  }, [query])

  function handleAddPatient(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedName = name.trim()
    if (!trimmedName) return
    setIsSaving(true)
    setFormError('')
    fetch(`${apiBaseUrl}/api/patients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: trimmedName, email: email.trim(), phone: phone.trim() }),
    }).then(async (response) => {
      if (!response.ok) throw new Error(await getErrorMessage(response))
      const createdPatient = await response.json() as Patient
      setPatients((currentPatients) => [createdPatient, ...currentPatients])
      setQuery('')
      setName('')
      setEmail('')
      setPhone('')
      setIsAddDialogOpen(false)
    }).catch((error: unknown) => {
      setFormError(error instanceof Error ? error.message : 'Unable to save patient.')
    }).finally(() => setIsSaving(false))
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
              {formError && <div className="patient-error" role="alert">{formError}</div>}
              <label>Full name<input autoFocus required value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Aylin Mammadova" /></label>
              <label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="patient@example.com" /></label>
              <label>Phone<input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+994 50 123 45 67" /></label>
              <div className="patient-form-actions">
                <button className="patient-cancel-button" type="button" onClick={() => setIsAddDialogOpen(false)}>Cancel</button>
                <button className="add-patient-button patient-submit-button" type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Add patient'}</button>
              </div>
            </form>
          </section>
        </div>
      )}

      <div className="patients-card">
        <div className="patients-toolbar">
          <div>
            <h2>All patients</h2>
            <span>{isLoading ? 'Loading...' : `${patients.length} patients`}</span>
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

        {loadError && <div className="patient-error" role="alert">{loadError}</div>}

        <div className="patients-table-wrap">
          <table className="patients-table">
            <thead>
              <tr><th>Patient</th><th>Phone</th><th>Last visit</th><th>Status</th></tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id}>
                  <td>
                    <div className="patient-identity">
                      <span className="patient-avatar">{patient.initials}</span>
                      <span><Link className="patient-name-link" to={`/patients/${patient.id}`}><strong>{patient.name}</strong></Link><small>{patient.email}</small></span>
                    </div>
                  </td>
                  <td>{patient.phone || '—'}</td>
                  <td>{patient.lastVisit ? new Intl.DateTimeFormat('en', { month: 'short', day: '2-digit', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${patient.lastVisit}T00:00:00Z`)) : 'No visits yet'}</td>
                  <td><span className={`patient-status ${patient.status === 'Active' ? 'is-active' : 'needs-follow-up'}`}>{patient.status}</span></td>
                </tr>
              ))}
              {!isLoading && patients.length === 0 && (
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
