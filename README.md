# CardioAI — ECG Rhythm Learning Studio

Static demo deployment: <https://cardio-ebcfc.web.app>

A browser-based ECG learning demo with illustrative sample rhythms and an optional OpenRouter model-assisted review of uploaded ECG images/PDFs. Model output is not clinically validated, may be wrong, and must not be used to diagnose or treat a medical condition.

---

## Key Features

### 1. Professional & Vibrant UI Design
- **Cardiology Telemetry Aesthetic**: Deep clinical blue/dark surfaces with vibrant neon accents: Radiant Cardiac Crimson (`#ff2a5f`), Electric Cyan (`#00f0ff`), Vivid Emerald (`#10b981`), Amber Warning (`#f59e0b`), and Neon Violet (`#8b5cf6`).
- **Live Animated Oscilloscope**: Real-time canvas waveform monitor with dynamic Lead II rhythm simulation, real-time BPM counter, and optional acoustic heartbeat synth audio (Web Audio API).
- **Interactive ECG Paper Grid Viewport**: Standard calibrated pink/red 1mm/5mm ECG grid overlay toggle, high-contrast inversion for darkroom electrophysiology review, and zoom controls.
- **Animated Laser Scanning Visualizer**: Visual scanning line sweeps across the ECG, calculating fiducial points (P-waves, QRS complexes, ST segments) in real time.

### 2. Illustrative Sample Rhythms
- Five preloaded examples demonstrate normal rhythm, bradycardia, AFib, STEMI, and ventricular tachycardia.
- Their displayed stages and measurements are fixed educational sample data, not predictions from an uploaded report.

### 3. Rhythm Learning Notes
- Sample profiles include educational descriptions of pacemaking, conduction, and rhythm patterns. Uploaded-image observations are model-generated and require clinician confirmation.

### 4. Emergency Information
- Emergency instructions are part of illustrative high-risk sample screens only. The model-generated upload estimate does not establish an emergency or trigger a diagnosis. Seek emergency care for severe or sudden symptoms regardless of the website's output.

### 5. Clinician Review
- The upload report displays visible observations when supplied by the model and recommends qualified clinical review. It does not measure ECG intervals reliably or prescribe treatment.

### 6. Sample Rhythm Profiles and Upload Review
- For instant testing without uploading files, users can click any of the 5 pre-loaded sample cases:
  1. **Normal Sinus Rhythm** (Stage 1 · 72 BPM)
  2. **Sinus Bradycardia** (Stage 2 · 48 BPM)
  3. **Atrial Fibrillation** (Stage 3 · 124 BPM)
  4. **Acute Anterior STEMI** (Stage 4 · 98 BPM · Critical Alert)
  5. **Ventricular Tachycardia** (Stage 4 · 168 BPM · Emergency Alert)
- For an uploaded PDF/JPG/PNG/WEBP, the local Node server sends that report to OpenRouter and displays its image-specific, non-diagnostic estimate. An optional rhythm selector asks the model to check for that pattern; it does not force the finding.
- Reports are transmitted to OpenRouter and should be de-identified. Model/API usage and PDF processing may incur charges. Never treat a low estimate as ruling out a heart problem.

### 7. Export & Sharing
- **Print / PDF Summary**: Prints the current sample or AI-generated educational report for discussion with a clinician.
- **Cardiologist Consultation Link**: Quick search to connect with local cardiology specialists.

---

## Architecture & Deployment

The frontend uses vanilla HTML, CSS, and JavaScript. The Node server keeps the OpenRouter API key out of browser code and proxies one report-analysis endpoint.

### Run locally

```powershell
$secureKey = Read-Host "New OpenRouter API key" -AsSecureString
$env:OPENROUTER_API_KEY = [System.Net.NetworkCredential]::new("", $secureKey).Password
# Optional: set a specific OpenRouter model instead of the default automatic router.
# $env:OPENROUTER_MODEL = "provider/vision-model-id"
npm start
```

Open <http://localhost:43817>. By default, the server uses OpenRouter's `openrouter/free` model; you can set `OPENROUTER_MODEL` to a specific image-capable model ID. The API key applies only to the current PowerShell window; restart the server after setting it. The server binds to `0.0.0.0` and uses port `43817` by default; set `PORT` to override it. The API key is never sent to the browser or written to project files. The hosted static demo does not include this local Node API.

Firebase Authentication uses anonymous sessions for local report history. Analysis summaries (condition, stage, BPM, timestamp, and sample/upload source) sync in real time under `analysisHistory/{uid}`; original ECG files and their filenames are not stored in Realtime Database. Per-user read/write rules are in `database.rules.json`. Deploy those rules with `firebase.cmd deploy --only database --project cardio-ebcfc`.

The local server caches up to 50 successful analysis summaries in memory by uploaded file contents and selected focus. Re-scanning the same report with the same focus reuses that result and the same report-history entry; the cache clears when the server restarts. A failed model request shows an error instead of a filename-based sample result.

**Privacy and medical limitation:** analysis uploads the selected report to OpenRouter. Use only de-identified test reports. The model is not clinically validated for ECG diagnosis or risk stratification; always have a qualified clinician review the original tracing.

### Deploy to Firebase Hosting

To deploy updates to Firebase Hosting:

```powershell
firebase.cmd deploy --only hosting --project cardio-ebcfc
```

### Deploy to Railway

Create a Railway project from the GitHub repository and deploy its root directory. Railway detects the Node.js app and starts it with `npm start`; it supplies the `PORT` environment variable. In the Railway service's Variables settings, set `OPENROUTER_API_KEY` to a newly generated OpenRouter key. Never commit API keys or send them in chat. If a key was previously committed or shared, revoke it before deploying.

### Files
- [index.html](file:///c:/Users/balab/Desktop/computer%20vision/index.html): Studio markup, responsive CSS, telemetry monitor, upload dropzone, emergency banners, and stage result cards.
- [app.js](file:///c:/Users/balab/Desktop/computer%20vision/app.js): Core controller, Web Audio synth, oscilloscope animation, preset data, laser scanner, risk engine, Firebase Authentication, and Realtime Database history sync.
- [firebase-config.js](file:///c:/Users/balab/Desktop/computer%20vision/firebase-config.js): Public Firebase project web configuration.
- [firebase.json](file:///c:/Users/balab/Desktop/computer%20vision/firebase.json): Hosting configuration and cache rules.
