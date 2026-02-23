const BASE_URL = 'https://botfilter-h5ddh6dye8exb7ha.centralus-01.azurewebsites.net'

export async function getCandidateByEmail(email) {
  const res = await fetch(`${BASE_URL}/api/candidate/get-by-email?email=${encodeURIComponent(email)}`)
  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.message || `Error ${res.status}`)
  }
  return res.json()
}

export async function getJobsList() {
  const res = await fetch(`${BASE_URL}/api/jobs/get-list`)
  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.message || `Error ${res.status}`)
  }
  return res.json()
}

export async function applyToJob({ uuid, jobId, candidateId, repoUrl }) {
  const res = await fetch(`${BASE_URL}/api/candidate/apply-to-job`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uuid, jobId, candidateId, repoUrl }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.message || `Error ${res.status}`)
  }
  return data
}
