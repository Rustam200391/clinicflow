import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'

type Patient = {
  id: string
  name: string
  initials: string
  email: string | null
  phone: string | null
  lastVisit: string | null
  status: string
}

type Visit = {
  id: string
  visitDate: string
  notes: string | null
  createdAt: string
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? ''

async function responseError(response: Response) {
  try {
    const body = await response.json() as { detail?: string; errors?: Record<string, string> }
    return body.errors ? Object.values(body.errors).join(' ') : body.detail || `Request failed (${response.status}).`
  } catch {
    return `Request failed (${response.status}).`
  }
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`))
}

function PatientDetails() {
  const { patientId } = useParams()
  const [patient, setPatient] = useState<Patient | null>(null)
  const [visits, setVisits] = useState<Visit[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [notFound, setNotFound] = useState(false)
  const [formError, setFormError] = useState('')
  const [visitDate, setVisitDate] = useState(new Date().toISOString().slice(0, 10))
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (!patientId) {
      setNotFound(true)
      setIsLoading(false)
      return
    }

    const controller = new AbortController()
    setIsLoading(true)
    setError('')
    setNotFound(false)
    Promise.all([
      fetch(`${apiBaseUrl}/api/patients/${patientId}`, { signal: controller.signal }),
      fetch(`${apiBaseUrl}/api/patients/${patientId}/visits`, { signal: controller.signal }),
    ]).then(async ([patientResponse, visitsResponse]) => {
      if (patientResponse.status === 404) {
        setNotFound(true)
        return
      }
      if (!patientResponse.ok) throw new Error(await responseError(patientResponse))
      if (!visitsResponse.ok) throw new Error(await responseError(visitsResponse))
      const [patientData, visitData] = await Promise.all([
        patientResponse.json() as Promise<Patient>,
        visitsResponse.json() as Promise<Visit[]>,
      ])
      setPatient(patientData)
      setVisits(visitData)
    }).catch((requestError: unknown) => {
      if (requestError instanceof DOMException && requestError.name === 'AbortError') return
      setError(requestError instanceof Error ? requestError.message : 'Unable to load patient details.')
    }).finally(() => {
      if (!controller.signal.aborted) setIsLoading(false)
    })

    return () => controller.abort()
  }, [patientId])

  async function handleCreateVisit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!patientId) return
    setIsSaving(true)
    setFormError('')
    try {
      const response = await fetch(`${apiBaseUrl}/api/patients/${patientId}/visits`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitDate, notes: notes.trim() || null }),
      })
      if (!response.ok) throw new Error(await responseError(response))
      const createdVisit = await response.json() as Visit
      setVisits((current) => [createdVisit, ...current].sort((a, b) => b.visitDate.localeCompare(a.visitDate)))
      setPatient((current) => current && (!current.lastVisit || createdVisit.visitDate > current.lastVisit)
        ? { ...current, lastVisit: createdVisit.visitDate }
        : current)
      setNotes('')
    } catch (requestError) {
      setFormError(requestError instanceof Error ? requestError.message : 'Unable to save visit.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) return <section className="patient-details-page"><p>Loading patient...</p></section>
  if (notFound) return <section className="patient-details-page"><Link to="/patients">← Back to patients</Link><div className="patient-error" role="alert">Patient not found.</div></section>
  if (error) return <section className="patient-details-page"><Link to="/patients">← Back to patients</Link><div className="patient-error" role="alert">{error}</div></section>
  if (!patient) return null

  return (
    <section className="patient-details-page">
      <Link className="patient-back-link" to="/patients">← Back to patients</Link>
      <header className="patient-details-heading">
        <span className="patient-avatar patient-details-avatar">{patient.initials}</span>
        <div><h1>{patient.name}</h1><span className={`patient-status ${patient.status === 'Active' ? 'is-active' : 'needs-follow-up'}`}>{patient.status}</span></div>
      </header>

      <section className="patient-details-card" aria-labelledby="patient-information-title">
        <h2 id="patient-information-title">Patient information</h2>
        <dl className="patient-information-grid">
          <div><dt>Email</dt><dd>{patient.email || '—'}</dd></div>
          <div><dt>Phone</dt><dd>{patient.phone || '—'}</dd></div>
          <div><dt>Status</dt><dd>{patient.status}</dd></div>
          <div><dt>Last visit</dt><dd>{patient.lastVisit ? formatDate(patient.lastVisit) : 'No visits yet'}</dd></div>
        </dl>
      </section>

      <section className="patient-details-card" aria-labelledby="visit-history-title">
        <h2 id="visit-history-title">Visit history</h2>
        {visits.length === 0 ? <p className="visit-empty">No visits recorded yet.</p> : (
          <ol className="visit-list">
            {visits.map((visit) => <li key={visit.id}><time dateTime={visit.visitDate}>{formatDate(visit.visitDate)}</time><p>{visit.notes || 'No notes for this visit.'}</p></li>)}
          </ol>
        )}
        <form className="visit-form" onSubmit={handleCreateVisit}>
          <h3>Add visit</h3>
          {formError && <div className="patient-error" role="alert">{formError}</div>}
          <label>Visit date<input required type="date" value={visitDate} onChange={(event) => setVisitDate(event.target.value)} /></label>
          <label>Notes<textarea rows={4} maxLength={5000} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Optional notes" /></label>
          <button className="add-patient-button visit-submit-button" type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Add visit'}</button>
        </form>
      </section>
    </section>
  )
}

export default PatientDetails
