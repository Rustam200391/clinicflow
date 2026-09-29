import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

type Doctor = {
  id: string
  name: string
  email: string
  role: string
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? ''

async function getErrorMessage(response: Response) {
  try {
    const body = await response.json() as { detail?: string }
    return body.detail || `Request failed (${response.status}).`
  } catch {
    return `Request failed (${response.status}).`
  }
}

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
}

function Doctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    fetch(`${apiBaseUrl}/api/doctors`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(await getErrorMessage(response))
        return response.json() as Promise<Doctor[]>
      })
      .then(setDoctors)
      .catch((requestError: unknown) => {
        if (requestError instanceof DOMException && requestError.name === 'AbortError') return
        setError(requestError instanceof Error ? requestError.message : 'Unable to load doctors.')
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false)
      })

    return () => controller.abort()
  }, [])

  return (
    <section className="patients-page">
      <div className="patients-heading">
        <div>
          <h1>Doctors</h1>
          <p>Doctors registered at your clinic.</p>
        </div>
      </div>

      <div className="patients-card">
        <div className="patients-toolbar">
          <div>
            <h2>All doctors</h2>
            <span>{isLoading ? 'Loading...' : `${doctors.length} doctors`}</span>
          </div>
        </div>

        {error && <div className="patient-error" role="alert">{error}</div>}

        <div className="patients-table-wrap">
          <table className="patients-table">
            <thead>
              <tr><th>Doctor</th><th>Email</th><th>Role</th></tr>
            </thead>
            <tbody>
              {doctors.map((doctor) => (
                <tr key={doctor.id}>
                  <td>
                    <div className="patient-identity">
                      <span className="patient-avatar">{initials(doctor.name)}</span>
                      <Link className="patient-name-link" to={`/doctors/${doctor.id}`}><strong>{doctor.name}</strong></Link>
                    </div>
                  </td>
                  <td>{doctor.email}</td>
                  <td><span className="patient-status is-active">{doctor.role}</span></td>
                </tr>
              ))}
              {!isLoading && !error && doctors.length === 0 && (
                <tr><td className="patients-empty" colSpan={3}>No doctors found.</td></tr>
              )}
              {isLoading && (
                <tr><td className="patients-empty" colSpan={3}>Loading doctors...</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default Doctors
