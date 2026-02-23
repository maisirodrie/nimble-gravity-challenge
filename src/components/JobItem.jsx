import { useState } from 'react'
import { applyToJob } from '../api/nimbleApi'

function JobItem({ job, candidate }) {
    const [repoUrl, setRepoUrl] = useState('')
    const [status, setStatus] = useState('idle') // idle | loading | success | error
    const [errorMsg, setErrorMsg] = useState('')

    const isValidUrl = repoUrl.trim().startsWith('https://github.com/')

    async function handleSubmit() {
        if (!repoUrl.trim()) {
            setErrorMsg('Por favor ingresá la URL de tu repositorio de GitHub.')
            setStatus('error')
            return
        }
        if (!isValidUrl) {
            setErrorMsg('La URL debe comenzar con https://github.com/')
            setStatus('error')
            return
        }

        setStatus('loading')
        setErrorMsg('')

        try {
            await applyToJob({
                uuid: candidate.uuid,
                jobId: job.id,
                candidateId: candidate.candidateId,
                repoUrl: repoUrl.trim(),
            })
            setStatus('success')
        } catch (err) {
            setStatus('error')
            setErrorMsg(err.message || 'Ocurrió un error inesperado.')
        }
    }

    return (
        <div className={`job-card ${status === 'success' ? 'job-card--success' : ''}`}>
            <div className="job-card__header">
                <div className="job-card__icon">
                    {status === 'success' ? '✓' : '#'}
                </div>
                <div className="job-card__info">
                    <h3 className="job-card__title">{job.title}</h3>
                    <span className="job-card__id">ID: {job.id}</span>
                </div>
                {status === 'success' && (
                    <span className="badge badge--success">Aplicación enviada</span>
                )}
            </div>

            {status !== 'success' && (
                <div className="job-card__body">
                    <div className="input-group">
                        <label htmlFor={`repo-${job.id}`} className="input-label">
                            URL del repositorio de GitHub
                        </label>
                        <input
                            id={`repo-${job.id}`}
                            type="url"
                            className={`input-field ${status === 'error' ? 'input-field--error' : ''}`}
                            placeholder="https://github.com/tu-usuario/tu-repo"
                            value={repoUrl}
                            onChange={(e) => {
                                setRepoUrl(e.target.value)
                                if (status === 'error') setStatus('idle')
                            }}
                            disabled={status === 'loading'}
                        />
                        {status === 'error' && errorMsg && (
                            <p className="input-error">{errorMsg}</p>
                        )}
                    </div>

                    <button
                        className={`btn-submit ${status === 'loading' ? 'btn-submit--loading' : ''}`}
                        onClick={handleSubmit}
                        disabled={status === 'loading'}
                    >
                        {status === 'loading' ? (
                            <>
                                <span className="spinner" />
                                Enviando...
                            </>
                        ) : (
                            'Submit'
                        )}
                    </button>
                </div>
            )}

            {status === 'success' && (
                <div className="success-msg">
                    <p>¡Tu postulación fue enviada correctamente!</p>
                    <a href={repoUrl} target="_blank" rel="noreferrer" className="repo-link">
                        {repoUrl}
                    </a>
                </div>
            )}
        </div>
    )
}

export default JobItem
