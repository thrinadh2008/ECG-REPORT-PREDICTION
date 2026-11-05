# CardioAI ECG Analysis Dashboard

CardioAI is an AI-assisted ECG screening dashboard served by the existing Node.js application. It accepts PDF, JPG, JPEG, PNG, and WEBP reports, sends uploads to the configured OpenRouter model, and shows only fields returned by the analysis service. It is not a medical device or diagnostic service.

## Run locally

```powershell
$secureKey = Read-Host "OpenRouter API key" -AsSecureString
$env:OPENROUTER_API_KEY = [System.Net.NetworkCredential]::new("", $secureKey).Password
# Optional: choose a specific image-capable model.
# $env:OPENROUTER_MODEL = "provider/model-id"
npm start
```

Open <http://localhost:3000>. Railway supplies `PORT` at runtime. The server requires `OPENROUTER_API_KEY`; it does not return a sample or filename-based result when the key or model response is unavailable. Successful results may be cached in memory (up to 50 reports) until the server restarts.

Uploaded ECG reports are sent to OpenRouter for processing. Use only de-identified material that you are authorized to share. Do not rely on AI-generated findings to diagnose or treat a medical condition; have the original ECG reviewed by a qualified clinician.

## Reports and authentication

Firebase anonymous authentication scopes report-history summaries to the current user. The database stores a report identifier, screening summary, risk label, heart-rate value when available, timestamp, and upload source; it does not store the original file or full model result. Historical records therefore may not include a filename, source ECG, measurements, or a full downloadable report. A PDF generated from an older history entry identifies that limitation.

Clinicians sign in with Firebase email/password authentication. The patient report queue is shown only when the signed-in Firebase account has the `clinician` custom claim and the Firebase Database and Storage rules authorize access. Review notes are written to the existing `reports` records. Configure clinician accounts with the existing script:

```powershell
npm run grant:clinician -- <clinician-uid>
```

## Deployment

Deploy the existing repository as a Railway Node.js service. Railway uses `npm start` and its provided `PORT`. Set `OPENROUTER_API_KEY` in Railway's Variables settings; optionally set `OPENROUTER_MODEL`. Never put keys in source code or commit them. A credential previously embedded in a source revision should be revoked and replaced.

Firebase Hosting is configured for static files and does not provide the Node `/api/analyze` endpoint. Use the Railway deployment for upload analysis. Firebase security rules remain in `database.rules.json` and `storage.rules`.

## Project files

- `index.html` — responsive dashboard and print-to-PDF clinical report.
- `app.js` — upload, preview, report rendering, history, Firebase authentication, and clinician review UI.
- `server.js` — existing `/api/analyze` and `/api/analyze-ecg` endpoints and OpenRouter proxy.
- `firebase-config.js` — public Firebase web-app configuration.
- `database.rules.json`, `storage.rules` — per-user history and clinician report access policies.
