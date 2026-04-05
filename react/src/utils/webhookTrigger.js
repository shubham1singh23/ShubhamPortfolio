/**
 * Triggers a GitHub repository dispatch event to kick off a Vercel redeploy
 * when portfolio.json is updated via the admin panel.
 *
 * Required environment variables (set in .env and Vercel dashboard):
 *   VITE_GITHUB_OWNER      - your GitHub username
 *   VITE_GITHUB_REPO       - your repo name
 *   VITE_GITHUB_TOKEN      - GitHub personal access token (repo scope)
 *   VITE_WEBHOOK_EVENT     - event type string, e.g. "portfolio-updated"
 */
export async function triggerGithubWebhook() {
  const owner = import.meta.env.VITE_GITHUB_OWNER
  const repo = import.meta.env.VITE_GITHUB_REPO
  const token = import.meta.env.VITE_GITHUB_TOKEN
  const eventType = import.meta.env.VITE_WEBHOOK_EVENT || 'portfolio-updated'

  if (!owner || !repo || !token) {
    console.warn('Webhook env vars not set - skipping trigger')
    return { success: false, reason: 'missing_env' }
  }

  try {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/dispatches`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${token}`,
          'X-GitHub-Api-Version': '2022-11-28',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          event_type: eventType,
          client_payload: {
            updated_at: new Date().toISOString(),
            source: 'admin-panel'
          }
        })
      }
    )

    if (res.status === 204) {
      return { success: true }
    }

    const err = await res.json().catch(() => ({}))
    return { success: false, reason: err.message || res.statusText }
  } catch (e) {
    return { success: false, reason: e.message }
  }
}
