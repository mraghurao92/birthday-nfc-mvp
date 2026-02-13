# NFC Birthday MVP (GitHub Pages)

A premium static birthday experience you can host on **GitHub Pages** and open via **NFC tap**.

## What you get
- Elegant, premium UI (no frameworks)
- Full-screen viewer for the signed birthday card photo (already included)
- Tiny guestbook (stores messages in the browser via LocalStorage — MVP-friendly)
- Optional ambient audio toggle (drop `assets/ambient.mp3`)

## 1) Run locally
If you have Python:

```bash
cd birthday-nfc-mvp
python -m http.server 8080
```

Open: http://localhost:8080

## 2) Deploy to GitHub Pages
1. Create a new GitHub repo (public), e.g. `birthday-nfc-mvp`
2. Put these files in the repo root:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `assets/` folder

### Enable Pages
- Repo → **Settings** → **Pages**
- Source: **Deploy from a branch**
- Branch: `main` / Folder: `/root`

Your URL:
`https://<your-username>.github.io/birthday-nfc-mvp/`

## 3) Program the NFC card
Use an app like **NFC Tools** and write a **URL** record:

`https://<your-username>.github.io/birthday-nfc-mvp/`

Tip: print the same URL as a QR code on the card as fallback.

## Customize quickly
- Edit the name in `index.html` (search for `Nikki`)
- Add photos into `assets/` and update the gallery `data-img` paths

## MVP vs Production
This is intentionally static for speed. For production:
- store messages in a DB
- add auth + moderation
- add template system
- add AI copy/style assistant
