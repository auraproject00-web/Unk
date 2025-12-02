# Portofolio Unk

Small personal portfolio — static HTML/CSS/JS.

## What I changed

- Added distinct section layouts (Tentang, Proyek, Skill, Kontak) with a soft, modern UI.
- New header navigation with smooth scroll and mobile support.
- Interactive skill cards (click/keyboard to expand descriptions).

## Preview locally

From the project directory run:

```powershell
Set-Location 'U:\belajar_front_end\portofolio'
python -m http.server 8000
# then open http://127.0.0.1:8000
```

## Deploy to GitHub Pages (two options)

Option A – Quick (GitHub UI):

1. Push repository to GitHub.
2. In the repository settings → Pages, set Source to `main` branch and `/ (root)`.
3. Save — the site should be at `https://<your-username>.github.io/<repo-name>` within a minute.

Option B – Automated using GitHub Actions (added here):
This repo includes a GitHub Actions workflow under `.github/workflows/gh-pages.yml` that publishes the repository root to the `gh-pages` branch automatically whenever you push to `main`.

Notes:

- Make sure the repository is public or configure Pages for a private repository with proper permissions.
- The action uses the built-in `GITHUB_TOKEN` so you don't need to add secrets.
