# Shubham Portfolio

## Development

1. Install dependencies:
	npm install
2. Start dev server:
	npm run dev

## Auto-Deploy Setup (Admin Save -> GitHub Dispatch -> Vercel Deploy)

1. Generate a GitHub personal access token at https://github.com/settings/tokens with `repo` scope.
2. Add `VERCEL_DEPLOY_HOOK_URL` as a GitHub Actions secret.
	Get the URL from Vercel -> Project -> Settings -> Git -> Deploy Hooks.
3. Copy `.env.example` to `.env` and fill all values.
4. Never commit `.env`.

## Environment Variables

See `.env.example` for all required keys:

- `VITE_GITHUB_OWNER`
- `VITE_GITHUB_REPO`
- `VITE_GITHUB_TOKEN`
- `VITE_WEBHOOK_EVENT` (optional)
- `VITE_EMAILJS_SERVICE_ID`
- `VITE_EMAILJS_TEMPLATE_ID`
- `VITE_EMAILJS_PUBLIC_KEY`
