import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

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

function DoctorDetails() {
  const { doctorId } = useParams()
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!doctorId) {
      setNotFound(true)
      setIsLoading(false)
      return
    }

    const controller = new AbortController()
    fetch(`${apiBaseUrl}/api/doctors/${doctorId}`, { signal: controller.signal })
      .then(async (response) => {
        if (response.status === 404) {
          setNotFound(true)
          return null
        }
        if (!response.ok) throw new Error(await getErrorMessage(response))
        return response.json() as Promise<Doctor>
      })
      .then((doctorData) => {
        if (doctorData) setDoctor(doctorData)
      })
      .catch((requestError: unknown) => {
        if (requestError instanceof DOMException && requestError.name === 'AbortError') return
        setError(requestError instanceof Error ? requestError.message : 'Unable to load doctor details.')
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false)
      })

    return () => controller.abort()
  }, [doctorId])

  if (isLoading) {
    return <section className="patient-details-page"><Link className="patient-back-link" to="/doctors">Back to Doctors</Link><p>Loading doctor...</p></section>
  }

  if (notFound) {
    return <section className="patient-details-page"><Link className="patient-back-link" to="/doctors">Back to Doctors</Link><div className="patient-error" role="alert">Doctor not found.</div></section>
  }

  if (error) {
    return <section className="patient-details-page"><Link className="patient-back-link" to="/doctors">Back to Doctors</Link><div className="patient-error" role="alert">{error}</div></section>
  }

  if (!doctor) return null

  return (
    <section className="patient-details-page">
      <Link className="patient-back-link" to="/doctors">Back to Doctors</Link>
      <header className="patient-details-heading">
        <span className="patient-avatar patient-details-avatar">{initials(doctor.name)}</span>
        <h1>{doctor.name}</h1>
      </header>

      <section className="patient-details-card" aria-labelledby="doctor-information-title">
        <h2 id="doctor-information-title">Doctor information</h2>
        <dl className="patient-information-grid">
          <div><dt>Email</dt><dd>{doctor.email}</dd></div>
          <div><dt>Role</dt><dd><span className="patient-status is-active">{doctor.role}</span></dd></div>
        </dl>
      </section>
    </section>
  )
}

export default DoctorDetails
