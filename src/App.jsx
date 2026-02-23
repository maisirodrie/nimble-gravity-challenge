import { useState, useEffect } from 'react'
import { getCandidateByEmail, getJobsList } from './api/nimbleApi'
import JobList from './components/JobList'

const CANDIDATE_EMAIL = 'maisi8.5@gmail.com'

function App() {
    const [candidate, setCandidate] = useState(null)
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        async function fetchData() {
            try {
                const [candidateData, jobsData] = await Promise.all([
                    getCandidateByEmail(CANDIDATE_EMAIL),
                    getJobsList(),
                ])
                setCandidate(candidateData)
                setJobs(jobsData)
            } catch (err) {
                setError(err.message || 'No se pudo cargar la información. Intentá de nuevo más tarde.')
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    if (loading) {
        return (
            <div className="page-center">
                <div className="loader">
                    <div className="loader__ring" />
                    <p>Cargando posiciones...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="page-center">
                <div className="error-state">
                    <div className="error-state__icon">⚠</div>
                    <h2>Algo salió mal</h2>
                    <p>{error}</p>
                    <button className="btn-retry" onClick={() => window.location.reload()}>
                        Reintentar
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="app">
            <header className="app-header">
                <div className="app-header__inner">
                    <div className="logo">
                        <span className="logo__dot" />
                        <span className="logo__text">Nimble Gravity</span>
                    </div>
                    {candidate && (
                        <div className="candidate-badge">
                            <div className="candidate-badge__avatar">
                                {candidate.firstName[0]}{candidate.lastName[0]}
                            </div>
                            <div className="candidate-badge__info">
                                <span className="candidate-badge__name">
                                    {candidate.firstName} {candidate.lastName}
                                </span>
                                <span className="candidate-badge__email">{candidate.email}</span>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            <main className="app-main">
                <div className="container">
                    <div className="page-hero">
                        <h1 className="page-hero__title">Posiciones disponibles</h1>
                        <p className="page-hero__subtitle">
                            Seleccioná una posición, ingresá tu repositorio de GitHub y hacé click en <strong>Submit</strong>.
                        </p>
                    </div>

                    <JobList jobs={jobs} candidate={candidate} />
                </div>
            </main>

            <footer className="app-footer">
                <p>Nimble Gravity · Job Application Challenge</p>
            </footer>
        </div>
    )
}

export default App
