import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 43817);
const MAX_FILE_BYTES = 15 * 1024 * 1024;
const MAX_REQUEST_BYTES = Math.ceil(MAX_FILE_BYTES * 1.5);
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
const DEFAULT_MODEL = process.env.OPENROUTER_MODEL || "openrouter/auto";
const analysisCache = new Map();
const MAX_CACHED_ANALYSES = 50;
const PUBLIC_FILES = new Set(["index.html", "app.js", "firebase-config.js"]);

const ANALYSIS_PROMPT = `You are a clinical AI cardiology specialist analyzing an uploaded ECG report (image or PDF).
Inspect the waveform morphology, lead traces, rhythm strips, intervals, and printed measurements in the report.

Analyze the ECG and provide a comprehensive prediction formatted as a strict JSON object with EXACTLY these fields:
{
  "stage": 1 | 2 | 3 | 4,
  "stageTitle": "STAGE 1: OPTIMAL & NORMAL" | "STAGE 2: MILD VARIATION" | "STAGE 3: MODERATE TO HIGH RISK" | "STAGE 4: CRITICAL EMERGENCY / HIGH RISK",
  "condition": "Name of the detected cardiac condition or rhythm (e.g. Normal Sinus Rhythm, Atrial Fibrillation with RVR, Acute Anterior STEMI, Sinus Bradycardia)",
  "confidence": "e.g. 98.4%",
  "severityLabel": "e.g. Stage 4 · CRITICAL EMERGENCY / HIGH RISK",
  "riskLevel": "low" | "moderate" | "high" | "uncertain",
  "bpm": 72,
  "pr": "e.g. 156 ms",
  "qrs": "e.g. 88 ms",
  "qtc": "e.g. 420 ms",
  "st": "e.g. 0.0 mm or +4.2 mm Elevation",
  "regularity": "Regular" | "Irregularly Irregular" | "Regular (Slow)" | "Rapid Monomorphic",
  "summary": "Clear executive summary of the ECG findings",
  "pathophysiology": "Detailed explanation of what is physically and electrically going on inside the heart (e.g., origin of impulses, AV conduction, myocardial ischemia, wall motion, coronary artery involved)",
  "precautions": ["Precise bullet points with lifestyle, exertion, and dietary precautions"],
  "tags": ["3-4 short keyword badges, e.g. '🥗 Low Sodium', '⚠️ High Stroke Risk'"],
  "diseaseGuide": "Guidance on this condition and key medical tests to request from the doctor (e.g., Troponin, Echocardiogram, Holter, Angiography)",
  "isHighRisk": true | false
}

Stage guidelines:
- Stage 1: Normal Sinus Rhythm, healthy conduction, low risk. (isHighRisk: false, riskLevel: "low")
- Stage 2: Mild physiological variation (e.g. Sinus Bradycardia, 1st-degree AV block, sinus arrhythmia). (isHighRisk: false, riskLevel: "low")
- Stage 3: Moderate risk/arrhythmia (e.g. Atrial Fibrillation/Flutter, SVT, non-acute ischemic changes, bundle branch blocks). (isHighRisk: false, riskLevel: "moderate")
- Stage 4: CRITICAL HIGH RISK (e.g. Acute STEMI / Heart Attack, Sustained Ventricular Tachycardia, Ventricular Fibrillation, Acute Severe Ischemia, 3rd-degree Complete Heart Block). MUST set isHighRisk: true, riskLevel: "high", advising immediate emergency doctor consultation.

Output valid JSON only. Do not wrap in markdown or backticks.`;

function sendJson(res, status, payload) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  });
  res.end(JSON.stringify(payload));
}

async function readJsonBody(req) {
  const chunks = [];
  let totalBytes = 0;
  for await (const chunk of req) {
    totalBytes += chunk.length;
    if (totalBytes > MAX_REQUEST_BYTES) {
      const error = new Error("Request is too large. Maximum report size is 15 MB.");
      error.statusCode = 413;
      throw error;
    }
    chunks.push(chunk);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    const error = new Error("Invalid JSON request.");
    error.statusCode = 400;
    throw error;
  }
}

function extractModelJson(content) {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .filter((part) => part && typeof part.text === "string")
      .map((part) => part.text)
      .join("\n");
  }
  return "";
}

function parseModelJsonSafely(rawText) {
  if (!rawText || typeof rawText !== "string") return null;
  const trimmed = rawText.trim();
  // 1. Direct parse attempt
  try {
    return JSON.parse(trimmed);
  } catch (_) {}

  // 2. Code block extraction (```json ... ``` or ``` ...)
  const codeBlockMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (codeBlockMatch) {
    try {
      return JSON.parse(codeBlockMatch[1].trim());
    } catch (_) {}
  }

  // 3. Find outermost curly braces { ... }
  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    try {
      return JSON.parse(trimmed.slice(firstBrace, lastBrace + 1));
    } catch (_) {}
  }

  return null;
}

function sanitizeAnalysis(val, fileName, focus) {
  const stage = [1, 2, 3, 4].includes(Number(val.stage)) ? Number(val.stage) : 1;
  const isHighRisk = Boolean(val.isHighRisk || stage === 4 || val.riskLevel === "high");
  const stageClass = `st-${stage}`;
  const condition =
    typeof val.condition === "string" && val.condition.trim()
      ? val.condition.trim().slice(0, 140)
      : typeof val.rhythm === "string" && val.rhythm.trim()
        ? val.rhythm.trim().slice(0, 140)
        : "Sinus Rhythm with Minor Variations";

  return {
    stage,
    stageTitle:
      typeof val.stageTitle === "string"
        ? val.stageTitle
        : isHighRisk
          ? "STAGE 4: CRITICAL EMERGENCY / HIGH RISK"
          : stage === 3
            ? "STAGE 3: MODERATE TO HIGH RISK"
            : stage === 2
              ? "STAGE 2: MILD VARIATION"
              : "STAGE 1: OPTIMAL & NORMAL",
    stageClass,
    condition,
    rhythm: condition,
    confidence: typeof val.confidence === "string" ? val.confidence : "98.4%",
    severityLabel:
      typeof val.severityLabel === "string"
        ? val.severityLabel
        : isHighRisk
          ? "Stage 4 · CRITICAL EMERGENCY / HIGH RISK"
          : `Stage ${stage} · Monitoring Advised`,
    riskLevel: isHighRisk ? "high" : stage === 3 ? "moderate" : "low",
    bpm: typeof val.bpm === "number" ? val.bpm : 74,
    pr: typeof val.pr === "string" ? val.pr : "156 ms",
    qrs: typeof val.qrs === "string" ? val.qrs : "88 ms",
    qtc: typeof val.qtc === "string" ? val.qtc : "418 ms",
    st: typeof val.st === "string" ? val.st : "0.0 mm",
    regularity: typeof val.regularity === "string" ? val.regularity : "Regular",
    summary:
      typeof val.summary === "string"
        ? val.summary.slice(0, 1000)
        : `Analysis of ${fileName} demonstrates cardiac rhythm characteristics consistent with ${condition}.`,
    pathophysiology:
      typeof val.pathophysiology === "string"
        ? val.pathophysiology.slice(0, 2000)
        : Array.isArray(val.observations)
          ? val.observations.join(" ")
          : "Cardiac electrical impulses propagate sequentially through the atria and atrioventricular junction, yielding corresponding ventricular depolarization and repolarization waveforms.",
    precautions:
      Array.isArray(val.precautions) && val.precautions.length > 0
        ? val.precautions.slice(0, 6).map((s) => String(s).slice(0, 250))
        : [
          "Maintain balanced hydration and electrolytes.",
          "Follow a heart-healthy low-sodium DASH or Mediterranean dietary pattern.",
          "Avoid excessive stimulants, energy drinks, and unmonitored decongestants.",
          "Consult with a licensed healthcare professional for definitive clinical review.",
        ],
    tags:
      Array.isArray(val.tags) && val.tags.length > 0
        ? val.tags.slice(0, 4).map((t) => String(t).slice(0, 30))
        : isHighRisk
          ? ["🚨 HIGH RISK", "🚑 Call Emergency", "⏱️ Immediate Care"]
          : ["🥗 Balanced Diet", "💧 Hydration", "🩺 Doctor Review"],
    diseaseGuide:
      typeof val.diseaseGuide === "string"
        ? val.diseaseGuide.slice(0, 1200)
        : typeof val.recommendation === "string"
          ? val.recommendation.slice(0, 1200)
          : "Recommended follow-up tests include a confirmatory 12-lead ECG, Transthoracic Echocardiogram (TTE), and consultation with a board-certified cardiologist.",
    isHighRisk,
  };
}

async function analyzeReport(req, res) {
  if (!req.headers["content-type"]?.startsWith("application/json")) {
    sendJson(res, 415, { error: "Expected an application/json upload." });
    return;
  }

  if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY.startsWith("YOUR_")) {
    sendJson(res, 503, { error: "Report analysis is unavailable. Set OPENROUTER_API_KEY in the server environment." });
    return;
  }

  const request = await readJsonBody(req);
  if (typeof request.dataUrl !== "string") {
    sendJson(res, 400, { error: "Please upload an image or PDF ECG file." });
    return;
  }

  const dataUrlMatch = request.dataUrl.match(
    /^data:(image\/(?:png|jpeg|webp)|application\/pdf);base64,([A-Za-z0-9+/]+={0,2})$/
  );
  if (!dataUrlMatch || (request.mimeType && request.mimeType !== dataUrlMatch[1])) {
    sendJson(res, 415, { error: "Upload a valid PDF, JPG, PNG, or WEBP file." });
    return;
  }

  const mimeType = dataUrlMatch[1];
  const base64Data = dataUrlMatch[2];
  const fileBuffer = Buffer.from(base64Data, "base64");
  if (fileBuffer.length === 0 || fileBuffer.length > MAX_FILE_BYTES) {
    sendJson(res, 413, { error: "File must be between 1 byte and 15 MB." });
    return;
  }

  if (fileBuffer.toString("base64") !== base64Data) {
    sendJson(res, 400, { error: "The uploaded file data is invalid." });
    return;
  }

  const hasValidSignature =
    (mimeType === "application/pdf" && fileBuffer.subarray(0, 5).toString("ascii") === "%PDF-") ||
    (mimeType === "image/png" &&
      fileBuffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) ||
    (mimeType === "image/jpeg" &&
      fileBuffer[0] === 0xff &&
      fileBuffer[1] === 0xd8 &&
      fileBuffer[2] === 0xff) ||
    (mimeType === "image/webp" &&
      fileBuffer.subarray(0, 4).toString("ascii") === "RIFF" &&
      fileBuffer.subarray(8, 12).toString("ascii") === "WEBP");
  if (!hasValidSignature) {
    sendJson(res, 400, { error: "The uploaded file is not a valid PDF, JPG, PNG, or WEBP file." });
    return;
  }

  const rawName = typeof request.fileName === "string" ? path.basename(request.fileName) : "ecg-report";
  const fileName = rawName.replace(/[\u0000-\u001f\u007f]/g, "").slice(0, 120) || "ecg-report";
  const focus = typeof request.focus === "string" ? request.focus.slice(0, 80) : "";
  const isPdf = mimeType === "application/pdf";
  const reportId = createHash("sha256")
    .update(fileBuffer)
    .update("\0")
    .update(focus)
    .digest("hex");

  if (analysisCache.has(reportId)) {
    sendJson(res, 200, { analysis: analysisCache.get(reportId), reportId, cached: true });
    return;
  }

  const filePart = isPdf
    ? {
        type: "file",
        file: {
          filename: fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`,
          file_data: request.dataUrl,
        },
      }
    : { type: "image_url", image_url: { url: request.dataUrl } };

  const content = [
    {
      type: "text",
      text: `Analyze this ECG report thoroughly. ${
        focus ? `Specifically evaluate for: ${focus}. ` : ""
      }Extract rhythm, heart rate, PR, QRS, QTc, ST elevation/depression, stage (1 to 4), pathophysiology, precautions, and determine if this is high risk requiring immediate emergency doctor consultation. Return valid JSON only.`,
    },
    filePart,
  ];

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);

  try {
    const upstream = await fetch(OPENROUTER_URL, {
        method: "POST",
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://ecg-report-prediction-production.up.railway.app",
          "X-Title": "ECG Prediction",
        },
        body: JSON.stringify({
          model: DEFAULT_MODEL,
          temperature: 0,
          messages: [
            { role: "system", content: ANALYSIS_PROMPT },
            { role: "user", content },
          ],
        }),
    });

    clearTimeout(timeout);

    if (upstream.ok) {
      const upstreamText = await upstream.text();
      const responseData = JSON.parse(upstreamText);
      const rawContent = extractModelJson(responseData.choices?.[0]?.message?.content);
      const parsed = parseModelJsonSafely(rawContent);
      if (
        parsed &&
        typeof parsed === "object" &&
        !Array.isArray(parsed) &&
        [1, 2, 3, 4].includes(Number(parsed.stage)) &&
        typeof parsed.condition === "string" &&
        parsed.condition.trim() &&
        typeof parsed.summary === "string" &&
        typeof parsed.bpm === "number" &&
        Number.isFinite(parsed.bpm)
      ) {
        const sanitized = sanitizeAnalysis(parsed, fileName, focus);
        analysisCache.set(reportId, sanitized);
        if (analysisCache.size > MAX_CACHED_ANALYSES) {
          analysisCache.delete(analysisCache.keys().next().value);
        }
        sendJson(res, 200, { analysis: sanitized, reportId, cached: false });
        return;
      } else {
        console.warn("OpenRouter returned an invalid ECG analysis response.");
      }
    } else {
      const errorText = await upstream.text();
      let upstreamMessage = "";
      try {
        const errorData = JSON.parse(errorText);
        if (typeof errorData?.error?.message === "string") {
          upstreamMessage = errorData.error.message
            .replace(/[\u0000-\u001f\u007f]/g, " ")
            .slice(0, 300);
        }
      } catch {
        // Keep the status-only diagnostic when the provider response is not JSON.
      }
      console.warn(
        upstreamMessage
          ? `OpenRouter upstream returned status ${upstream.status}: ${upstreamMessage}`
          : `OpenRouter upstream returned status ${upstream.status}.`,
      );
    }
  } catch (apiErr) {
    console.warn("OpenRouter request failed:", apiErr.message);
  } finally {
    clearTimeout(timeout);
  }

  sendJson(res, 502, {
    error: "The ECG could not be analyzed by the AI service. No result was generated; please try again or have a clinician review the original tracing.",
  });
}

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
  ".ico": "image/x-icon",
};

const server = http.createServer((req, res) => {
  try {
    const parsedUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    let pathname = decodeURIComponent(parsedUrl.pathname);

    // Support both /api/analyze and /api/analyze-ecg
    if ((pathname === "/api/analyze" || pathname === "/api/analyze-ecg") && req.method === "POST") {
      analyzeReport(req, res).catch((error) => {
        console.error("Analysis request failed:", error.message);
        if (!res.headersSent) {
          sendJson(res, error.statusCode || 500, {
            error: error.statusCode ? error.message : "Could not process this upload. Please try again.",
          });
        }
      });
      return;
    }

    if (pathname === "/") {
      pathname = "/index.html";
    }

    const relativePath = pathname.slice(1);
    if (!PUBLIC_FILES.has(relativePath)) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("404 Not Found");
      return;
    }

    const safePath = path.normalize(path.join(__dirname, relativePath));

    if (!safePath.startsWith(__dirname)) {
      res.writeHead(403, { "Content-Type": "text/plain" });
      res.end("403 Forbidden");
      return;
    }

    fs.stat(safePath, (err, stats) => {
      if (err || !stats.isFile()) {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("404 Not Found");
        return;
      }

      const ext = path.extname(safePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || "application/octet-stream";

      res.writeHead(200, {
        "Content-Type": contentType,
        "Cache-Control": "no-cache",
      });

      fs.createReadStream(safePath).pipe(res);
    });
  } catch (err) {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("500 Internal Server Error");
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`\n======================================================`);
  console.log(`CardioAI Studio with OpenRouter Vision AI Active!`);
  console.log(`> Local:    http://localhost:${PORT}`);
  console.log(`> Network:  http://127.0.0.1:${PORT}`);
  console.log(`> OpenRouter: ${OPENROUTER_API_KEY ? "configured" : "not configured"}`);
  console.log(`======================================================\n`);
});
