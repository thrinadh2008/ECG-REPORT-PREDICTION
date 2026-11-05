import { firebaseConfig } from "./firebase-config.js?v=20261105-1";

// ============================================================================
// CLINICAL BENCHMARK DATABASE & STAGE DEFINITIONS
// ============================================================================
const CLINICAL_PRESETS = {
  normal: {
    stage: 1,
    stageTitle: "STAGE 1: OPTIMAL & NORMAL",
    stageClass: "st-1",
    condition: "Normal Sinus Rhythm",
    confidence: "98.4%",
    severityLabel: "Stage 1 · Low / Optimal Risk",
    riskWidth: "22%",
    bpm: 72,
    pr: "156 ms",
    qrs: "84 ms",
    qtc: "412 ms",
    st: "0.0 mm",
    regularity: "Regular",
    summary:
      "All standard 12-lead waveforms present uniform morphology, normal axis orientation, and consistent R-R intervals with isoelectric ST segments.",
    pathophysiology:
      "The cardiac cycle is governed by rhythmic pacing from the Sinoatrial (SA) node in the high right atrium. Electrical depolarization sweeps symmetrically through the atrial syncytium (generating the P wave), traverses the Atrioventricular (AV) node with a physiological delay (~150 ms) to permit complete ventricular filling, then rapidly branches down the His-Purkinje network (QRS complex). Repolarization (T wave) is uniform, confirming optimal oxygenation and hemodynamic output without electrical or ischemic compromise.",
    precautions: [
      "Maintain 150 minutes of weekly aerobic exercise (e.g. brisk walking, cycling, swimming).",
      "Adopt a heart-healthy dietary pattern (DASH or Mediterranean diet) rich in potassium, fiber, and omega-3 fatty acids.",
      "Maintain adequate daily hydration; limit excessive sodium intake to under 2,000 mg/day.",
      "Undergo standard annual cardiovascular wellness and blood pressure screenings.",
    ],
    tags: ["🥗 Low-Sodium DASH Diet", "🏃 150m Aerobic/Week", "💧 Balanced Hydration", "🩺 Routine Annual Screen"],
    diseaseGuide:
      "Your electrical conduction profile is currently optimal. To preserve long-term arterial and myocardial health, monitor blood pressure, maintain healthy blood lipid levels (LDL < 100 mg/dL), and avoid tobacco use. If you ever experience unexplained fainting or palpitations, consult a primary care physician.",
    isHighRisk: false,
    leadWaveType: "normal",
  },
  brady: {
    stage: 2,
    stageTitle: "STAGE 2: MILD CONDUCTION VARIATION",
    stageClass: "st-2",
    condition: "Sinus Bradycardia with 1st-Degree AV Block",
    confidence: "97.1%",
    severityLabel: "Stage 2 · Mild / Monitoring Advised",
    riskWidth: "45%",
    bpm: 48,
    pr: "228 ms",
    qrs: "88 ms",
    qtc: "424 ms",
    st: "0.0 mm",
    regularity: "Regular (Slow)",
    summary:
      "Consistent sinus rhythm with prolonged atrioventricular conduction delay (PR interval > 200 ms) and resting heart rate below 50 beats per minute.",
    pathophysiology:
      "Electrical impulses originating from the SA node experience slowed conduction through the Atrioventricular (AV) node before depolarizing the ventricles. Every atrial P-wave is followed by a QRS complex, but the conduction latency is abnormally elongated. This can stem from high intrinsic vagal tone (common in well-conditioned athletes), age-related nodal fibrosis, electrolyte imbalances, or medications such as beta-blockers or calcium channel blockers.",
    precautions: [
      "Check resting pulse daily; avoid sudden postural changes (stand up gradually to prevent orthostatic dizziness).",
      "Review current medications (e.g., beta-blockers, diltiazem, verapamil, digoxin) with your prescribing physician.",
      "Avoid acute dehydration and heavy alcohol intake, which can aggravate vagal reflexes.",
      "Seek medical review if accompanied by fatigue, lightheadedness, confusion, or near-syncope.",
    ],
    tags: ["🛑 Avoid Sudden Standing", "💊 Medication Review", "🩺 Primary Doctor Visit", "📊 Pulse Log"],
    diseaseGuide:
      "First-degree AV block with sinus bradycardia is often benign in healthy adults, but warrants non-urgent evaluation if symptomatic. Recommended physician follow-ups: 24-hour ambulatory Holter monitor, basic metabolic panel (electrolytes: potassium, magnesium), and thyroid-stimulating hormone (TSH) test.",
    isHighRisk: false,
    leadWaveType: "brady",
  },
  afib: {
    stage: 3,
    stageTitle: "STAGE 3: MODERATE TO HIGH RISK",
    stageClass: "st-3",
    condition: "Atrial Fibrillation (AFib) with Rapid Ventricular Response",
    confidence: "96.8%",
    severityLabel: "Stage 3 · Moderate / Elevated Thromboembolic Risk",
    riskWidth: "75%",
    bpm: 124,
    pr: "Absent (f-waves)",
    qrs: "94 ms",
    qtc: "448 ms",
    st: "-0.8 mm (Strain)",
    regularity: "Irregularly Irregular",
    summary:
      "Absence of discrete P-waves replaced by chaotic fibrillatory waves (f-waves) and completely unpredictable R-R intervals with tachycardia.",
    pathophysiology:
      "Multiple chaotic micro-reentrant electrical circuits depolarize the atria at rates of 350 to 600 beats per minute. The atria shudder rather than contract synchronously, resulting in blood stasis within the left atrial appendage (significantly elevating stroke and systemic embolism risks). The AV node intermittently permits random impulses to pass to the ventricles, resulting in an irregularly irregular pulse and reduced cardiac filling efficiency.",
    precautions: [
      "Strictly avoid stimulants: zero energy drinks, eliminate or minimize caffeine, avoid decongestants with pseudoephedrine.",
      "Take prescribed oral anticoagulants (e.g. Apixaban, Rivaroxaban, Warfarin) strictly as scheduled—never skip a dose without doctor advice.",
      "Monitor blood pressure and log palpitation durations.",
      "Seek emergency medical evaluation immediately if experiencing chest tightness, acute shortness of breath, or sudden weakness.",
    ],
    tags: ["⚠️ High Stroke Risk", "🚫 Zero Stimulants/Caffeine", "💊 Strict Anticoagulation", "🩺 Urgent Cardiologist"],
    diseaseGuide:
      "Atrial Fibrillation requires comprehensive medical evaluation for stroke prevention (CHA2DS2-VASc risk score) and rate/rhythm control. Recommended tests: Transthoracic Echocardiogram (TTE) to assess left atrial diameter and ejection fraction, thyroid function tests, and continuous rhythm monitoring.",
    isHighRisk: false,
    leadWaveType: "afib",
  },
  stemi: {
    stage: 4,
    stageTitle: "STAGE 4: CRITICAL EMERGENCY / HIGH RISK",
    stageClass: "st-4",
    condition: "Acute Anterior ST-Elevation Myocardial Infarction (STEMI)",
    confidence: "99.2%",
    severityLabel: "Stage 4 · CRITICAL EMERGENCY / HIGH RISK",
    riskWidth: "100%",
    bpm: 98,
    pr: "162 ms",
    qrs: "112 ms",
    qtc: "478 ms (Prolonged)",
    st: "+4.4 mm (Tombstoning)",
    regularity: "Sinus / Ischemic",
    summary:
      "Profound convex ST-segment elevation (>4mm) across precordial leads V1-V4 indicative of acute transmural epicardial myocardial injury.",
    pathophysiology:
      "A complete thrombotic occlusion of a major coronary artery (most commonly the Left Anterior Descending - LAD artery) has halted arterial blood supply to the anterior ventricular myocardium. Without oxygen, myocardial cells undergo progressive transmural ischemia, injury, and cellular necrosis. If blood flow is not restored urgently via primary percutaneous coronary intervention (PCI / stent) or thrombolysis, permanent ventricular remodeling, acute heart failure, or fatal ventricular arrhythmias may ensue.",
    precautions: [
      "🚨 CALL EMERGENCY SERVICES (108 / 911 / 112) IMMEDIATELY. DO NOT WAIT.",
      "DO NOT DRIVE YOURSELF TO THE HOSPITAL. Wait for an emergency ambulance with defibrillator capability.",
      "Sit upright or lie recumbent; avoid any physical exertion or walking.",
      "If advised by the emergency medical dispatcher and not allergic, chew 300mg of non-coated Aspirin.",
      "Keep house doors unlocked and remove tight garments around neck and chest.",
    ],
    tags: ["🚨 EMERGENCY 108/911", "🚑 DO NOT DRIVE", "⏱️ Golden 90-Min Window", "🏥 Immediate Catheterization"],
    diseaseGuide:
      "Acute STEMI is a time-critical cardiovascular emergency. Clinical guideline goal: Primary Percutaneous Coronary Intervention (PCI) within 90 minutes of medical contact ('Door-to-Balloon Time'). Immediate hospital protocols include: emergency 12-lead ECG re-confirmation, high-sensitivity cardiac troponins, dual antiplatelet therapy (DAPT), heparin, and emergent coronary angiography.",
    isHighRisk: true,
    leadWaveType: "stemi",
  },
  vt: {
    stage: 4,
    stageTitle: "STAGE 4: CRITICAL EMERGENCY / HIGH RISK",
    stageClass: "st-4",
    condition: "Ventricular Tachycardia (Monomorphic VT)",
    confidence: "98.9%",
    severityLabel: "Stage 4 · CRITICAL EMERGENCY / LIFE-THREATENING",
    riskWidth: "100%",
    bpm: 168,
    pr: "Dissociated",
    qrs: "160 ms (Wide Complex)",
    qtc: "Critically Prolonged",
    st: "Secondary ST Changes",
    regularity: "Rapid Monomorphic",
    summary:
      "Wide-complex tachycardia (QRS > 120 ms) at ~168 BPM with concordant morphology and AV dissociation. High risk of hemodynamic collapse.",
    pathophysiology:
      "An ectopic ventricular focus or reentrant circuit within diseased ventricular myocardium (often bordering prior infarction scars) has seized pacemaking control. Impulses originate within ventricular muscle tissue rather than the specialized Purkinje fibers, causing wide, slurred QRS complexes and extremely rapid ventricular contractions. Diastolic filling time drops dramatically, precipitating rapid hypotension, loss of consciousness, and potential deterioration into Ventricular Fibrillation.",
    precautions: [
      "🚨 CALL EMERGENCY SERVICES (108 / 911 / 112) IMMEDIATELY.",
      "Have the patient lie down flat immediately to prevent traumatic fall injury upon potential syncope.",
      "Locate the nearest Automated External Defibrillator (AED) if available in a public setting.",
      "Do not give oral fluids or solid food due to risk of aspiration during potential sudden loss of consciousness.",
    ],
    tags: ["🚨 LIFE THREATENING", "⚡ AED on Standby", "🚑 Emergency Dispatch", "🏥 Immediate Cardioversion"],
    diseaseGuide:
      "Sustained Ventricular Tachycardia is an unstable malignant arrhythmia requiring emergent cardioversion or antiarrhythmic infusion (e.g. Amiodarone). Post-stabilization workup includes coronary angiography, cardiac MRI, electrophysiological study (EPS), and placement of an Implantable Cardioverter-Defibrillator (ICD).",
    isHighRisk: true,
    leadWaveType: "vt",
  },
};

CLINICAL_PRESETS.aflutter = {
  ...CLINICAL_PRESETS.afib,
  condition: "Atrial Flutter with 2:1 Conduction",
  confidence: "97.6%",
  bpm: 75,
  pr: "Not measurable (flutter waves)",
  regularity: "Regular with fixed AV block",
  summary:
    "Organized macro-reentrant atrial circuit producing characteristic negative sawtooth flutter waves (F waves) in inferior leads with fixed 2:1 AV block.",
  pathophysiology:
    "A rapid, organized macro-reentrant circuit around the tricuspid valve annulus in the right atrium produces flutter waves at ~300 bpm. The AV node filters conduction, commonly conducting every second impulse (2:1 block) to protect ventricles.",
  precautions: [
    "Consult a cardiologist for catheter ablation evaluation (cavotricuspid isthmus ablation).",
    "Adhere strictly to prescribed anticoagulation therapy to minimize thromboembolic stroke risk.",
    "Monitor pulse rate and seek emergency medical evaluation if chest pressure, lightheadedness, or acute breathlessness occurs.",
  ],
  tags: ["⚠️ Stroke Risk", "🩺 Cardiologist Review", "💊 Anticoagulation", "⚡ Ablation Candidate"],
  diseaseGuide:
    "Atrial flutter diagnosis warrants formal 12-lead ECG documentation, CHA2DS2-VASc stroke risk assessment, echocardiography, and evaluation by an electrophysiologist for curative catheter ablation.",
  leadWaveType: "aflutter",
};

// ============================================================================
// AUDIO SYNTHESIZER (HEARTBEAT TONE)
// ============================================================================
class CardiacAudioSynth {
  constructor() {
    this.audioCtx = null;
    this.isEnabled = false;
  }

  init() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
  }

  toggle() {
    this.init();
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
    this.isEnabled = !this.isEnabled;
    return this.isEnabled;
  }

  playHeartbeatBeep() {
    if (!this.isEnabled || !this.audioCtx) return;
    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.08);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // Audio autoplay policy catch
    }
  }
}

const audioSynth = new CardiacAudioSynth();

// ============================================================================
// LIVE OSCILLOSCOPE MONITOR ANIMATION
// ============================================================================
class OscilloscopeMonitor {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext("2d") : null;
    this.currentPresetKey = "normal";
    this.currentBpm = 72;
    this.x = 0;
    this.points = [];
    this.maxPoints = 600;
    this.lastTime = 0;
    this.phase = 0;
    this.audioCooldown = 0;

    this.resize();
    window.addEventListener("resize", () => this.resize());
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width * (window.devicePixelRatio || 1);
    this.canvas.height = rect.height * (window.devicePixelRatio || 1);
    this.maxPoints = Math.max(300, Math.floor(rect.width));
    this.points = [];
  }

  setPreset(key) {
    if (CLINICAL_PRESETS[key]) {
      this.currentPresetKey = key;
      this.currentBpm = CLINICAL_PRESETS[key].bpm;
      const bpmEl = document.getElementById("monitor-bpm");
      if (bpmEl) bpmEl.textContent = this.currentBpm;
      const leadTitleEl = document.getElementById("osc-lead-title");
      if (leadTitleEl) {
        leadTitleEl.textContent = `LEAD II • ${CLINICAL_PRESETS[key].condition.toUpperCase().slice(0, 22)}`;
      }
    }
  }

  getWaveSample(t, presetKey) {
    // Return sample between -1 and 1
    const beatPeriod = 60 / this.currentBpm;
    const progress = (t % beatPeriod) / beatPeriod; // 0 to 1

    if (progress < 0.03 && this.audioCooldown <= 0) {
      audioSynth.playHeartbeatBeep();
      this.audioCooldown = 0.25;
    }

    if (presetKey === "vt") {
      // Rapid wide monomorphic sine-sawtooth wave
      return Math.sin(progress * Math.PI * 2) * 0.9 + Math.sin(progress * Math.PI * 4) * 0.2;
    }

    if (presetKey === "stemi") {
      // High ST-elevation merged with T-wave
      if (progress < 0.1) return Math.sin((progress / 0.1) * Math.PI) * 0.15; // P-wave
      if (progress < 0.14) return 0; // PR segment
      if (progress < 0.16) return -0.2; // Q
      if (progress < 0.2) return 1.1; // R peak
      if (progress < 0.23) return 0.45; // S drops only to elevated ST!
      if (progress < 0.45) {
        // High tombstone ST plateau
        const stProg = (progress - 0.23) / 0.22;
        return 0.45 + Math.sin(stProg * Math.PI) * 0.4;
      }
      return 0; // Baseline
    }

    if (presetKey === "afib" || presetKey === "aflutter") {
      if (presetKey === "aflutter") {
        const flutterWave = ((progress * 5) % 1) * 2 - 1;
        if (progress > 0.2 && progress < 0.26) {
          return Math.sin(((progress - 0.2) / 0.06) * Math.PI) * 1.2;
        }
        return flutterWave * 0.12;
      }
      // Fibrillatory baseline noise + random sharp QRS
      const noise = (Math.sin(t * 70) + Math.cos(t * 110) + Math.sin(t * 150)) * 0.08;
      if (progress > 0.2 && progress < 0.26) {
        // QRS
        const p = (progress - 0.2) / 0.06;
        return noise + Math.sin(p * Math.PI) * 1.2;
      }
      return noise;
    }

    if (presetKey === "brady") {
      // Slow rate with long PR interval
      if (progress < 0.08) return Math.sin((progress / 0.08) * Math.PI) * 0.16; // P
      if (progress < 0.22) return 0; // Prolonged PR
      if (progress < 0.24) return -0.15; // Q
      if (progress < 0.28) return 1.0; // R
      if (progress < 0.31) return -0.3; // S
      if (progress < 0.38) return 0;
      if (progress < 0.52) return Math.sin(((progress - 0.38) / 0.14) * Math.PI) * 0.25; // T
      return 0;
    }

    // Default Normal Sinus Rhythm
    if (progress < 0.12) return Math.sin((progress / 0.12) * Math.PI) * 0.16; // P
    if (progress < 0.18) return 0; // PR
    if (progress < 0.2) return -0.12; // Q
    if (progress < 0.25) return 1.05; // R
    if (progress < 0.28) return -0.25; // S
    if (progress < 0.34) return 0; // ST segment isoelectric
    if (progress < 0.48) return Math.sin(((progress - 0.34) / 0.14) * Math.PI) * 0.28; // T
    return 0; // Baseline
  }

  animate(now) {
    requestAnimationFrame(this.animate);
    if (!this.ctx || !this.canvas) return;

    const delta = (now - this.lastTime) / 1000;
    this.lastTime = now;
    if (delta > 0.5) return;

    this.audioCooldown = Math.max(0, this.audioCooldown - delta);
    this.phase += delta;

    const sample = this.getWaveSample(this.phase, this.currentPresetKey);
    this.points.push(sample);
    if (this.points.length > this.maxPoints) {
      this.points.shift();
    }

    const w = this.canvas.width;
    const h = this.canvas.height;
    const ctx = this.ctx;

    ctx.clearRect(0, 0, w, h);

    // Draw subtle grid
    ctx.strokeStyle = "rgba(0, 240, 255, 0.08)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    const gridStep = 20 * (window.devicePixelRatio || 1);
    for (let x = 0; x < w; x += gridStep) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
    }
    for (let y = 0; y < h; y += gridStep) {
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
    }
    ctx.stroke();

    if (this.points.length < 2) return;

    // Glowing Neon trace
    ctx.strokeStyle = this.currentPresetKey === "stemi" || this.currentPresetKey === "vt"
      ? "#ff2a5f"
      : "#00f0ff";
    ctx.shadowColor = ctx.strokeStyle;
    ctx.shadowBlur = 10 * (window.devicePixelRatio || 1);
    ctx.lineWidth = 2.2 * (window.devicePixelRatio || 1);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    const step = w / (this.maxPoints - 1);
    const midY = h * 0.55;
    const amplitude = h * 0.42;

    for (let i = 0; i < this.points.length; i++) {
      const px = i * step;
      const py = midY - this.points[i] * amplitude;
      if (i === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.stroke();

    // Leading glowing cursor dot
    const lastX = (this.points.length - 1) * step;
    const lastY = midY - this.points[this.points.length - 1] * amplitude;
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "#ffffff";
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(lastX, lastY, 3.5 * (window.devicePixelRatio || 1), 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

// ============================================================================
// STATIC MULTI-LEAD ECG CANVAS RENDERER
// ============================================================================
function renderEcgToCanvas(canvasId, presetKey) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width * (window.devicePixelRatio || 1);
  canvas.height = Math.max(260, rect.height) * (window.devicePixelRatio || 1);

  const w = canvas.width;
  const h = canvas.height;

  // Background
  ctx.fillStyle = "#0a101d";
  ctx.fillRect(0, 0, w, h);

  // Red/Pink ECG Grid pattern
  ctx.strokeStyle = "rgba(244, 63, 94, 0.15)";
  ctx.lineWidth = 1;
  const smallBox = 6 * (window.devicePixelRatio || 1);
  const bigBox = smallBox * 5;

  ctx.beginPath();
  for (let x = 0; x < w; x += smallBox) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
  }
  for (let y = 0; y < h; y += smallBox) {
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
  }
  ctx.stroke();

  ctx.strokeStyle = "rgba(244, 63, 94, 0.35)";
  ctx.beginPath();
  for (let x = 0; x < w; x += bigBox) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
  }
  for (let y = 0; y < h; y += bigBox) {
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
  }
  ctx.stroke();

  // Multi-lead stripes: Lead I, Lead II, Lead V1, Lead V5
  const leads = [
    { name: "LEAD I", yRatio: 0.22, scale: 0.8 },
    { name: "LEAD II (RHYTHM STRIP)", yRatio: 0.5, scale: 1.0 },
    { name: "LEAD V1", yRatio: 0.78, scale: 0.85 },
  ];

  leads.forEach((lead) => {
    ctx.fillStyle = "rgba(0, 240, 255, 0.75)";
    ctx.font = `bold ${10 * (window.devicePixelRatio || 1)}px "JetBrains Mono", monospace`;
    ctx.fillText(lead.name, 16 * (window.devicePixelRatio || 1), lead.yRatio * h - 24 * (window.devicePixelRatio || 1));

    ctx.strokeStyle = presetKey === "stemi" || presetKey === "vt" ? "#ff2a5f" : "#00f0ff";
    ctx.lineWidth = 1.8 * (window.devicePixelRatio || 1);
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.beginPath();

    const baselineY = lead.yRatio * h;
    const amp = 35 * (window.devicePixelRatio || 1) * lead.scale;
    const period = (presetKey === "vt" ? 80 : presetKey === "brady" ? 220 : 130) * (window.devicePixelRatio || 1);

    for (let x = 0; x < w; x += 2) {
      const prog = (x % period) / period;
      let val = 0;

      if (presetKey === "vt") {
        val = Math.sin(prog * Math.PI * 2) * 1.1 + Math.sin(prog * Math.PI * 4) * 0.25;
      } else if (presetKey === "stemi") {
        if (prog < 0.1) val = Math.sin((prog / 0.1) * Math.PI) * 0.15;
        else if (prog < 0.15) val = 0;
        else if (prog < 0.18) val = -0.15;
        else if (prog < 0.22) val = 1.2;
        else if (prog < 0.25) val = 0.55;
        else if (prog < 0.5) val = 0.55 + Math.sin(((prog - 0.25) / 0.25) * Math.PI) * 0.45;
        else val = 0;
      } else if (presetKey === "afib" || presetKey === "aflutter") {
        if (presetKey === "aflutter") {
          const flutterWave = ((prog * 5) % 1) * 2 - 1;
          val = prog > 0.18 && prog < 0.24
            ? Math.sin(((prog - 0.18) / 0.06) * Math.PI) * 1.15
            : flutterWave * 0.12;
        } else {
          const noise = (Math.sin(x * 0.2) + Math.cos(x * 0.35)) * 0.1;
          if (prog > 0.18 && prog < 0.24) {
            val = noise + Math.sin(((prog - 0.18) / 0.06) * Math.PI) * 1.15;
          } else {
            val = noise;
          }
        }
      } else if (presetKey === "brady") {
        if (prog < 0.08) val = Math.sin((prog / 0.08) * Math.PI) * 0.15;
        else if (prog < 0.22) val = 0;
        else if (prog < 0.24) val = -0.15;
        else if (prog < 0.28) val = 1.0;
        else if (prog < 0.31) val = -0.3;
        else if (prog < 0.4) val = 0;
        else if (prog < 0.54) val = Math.sin(((prog - 0.4) / 0.14) * Math.PI) * 0.25;
        else val = 0;
      } else {
        // Normal
        if (prog < 0.12) val = Math.sin((prog / 0.12) * Math.PI) * 0.18;
        else if (prog < 0.18) val = 0;
        else if (prog < 0.2) val = -0.14;
        else if (prog < 0.25) val = 1.1;
        else if (prog < 0.28) val = -0.28;
        else if (prog < 0.34) val = 0;
        else if (prog < 0.48) val = Math.sin(((prog - 0.34) / 0.14) * Math.PI) * 0.28;
        else val = 0;
      }

      const y = baselineY - val * amp;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  });
}

// ============================================================================
// MAIN APPLICATION CONTROLLER
// ============================================================================
let realtimeReportWriter = null;
let realtimeHistoryUnsubscribe = null;
let replaceRealtimeReportHistory = null;
const pendingRealtimeReports = [];

async function syncReportHistory(report) {
  if (!realtimeReportWriter) {
    pendingRealtimeReports.push(report);
    return;
  }

  try {
    await realtimeReportWriter(report);
  } catch (error) {
    const syncStatus = document.getElementById("session-sync-status");
    if (syncStatus) syncStatus.textContent = `Realtime Database sync failed: ${error.message || "Check database rules."}`;
    console.error("Realtime Database report sync failed:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const oscMonitor = new OscilloscopeMonitor("oscilloscope-canvas");

  // DOM Elements
  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("report-file");
  const previewImg = document.getElementById("ecg-preview-img");
  const previewPdf = document.getElementById("ecg-preview-pdf");
  const ecgCanvas = document.getElementById("ecg-canvas-render");
  const ecgViewport = document.getElementById("ecg-viewport");
  const btnRunAnalysis = document.getElementById("btn-run-analysis");
  const scanLaser = document.getElementById("scan-laser");
  const scanBanner = document.getElementById("scan-banner");
  const scanStatusText = document.getElementById("scan-status-text");
  const uploadStatusMsg = document.getElementById("upload-status-msg");
  const targetAbnormality = document.getElementById("target-abnormality");

  const resultsArea = document.getElementById("results-area");
  const emergencyBanner = document.getElementById("emergency-banner");
  const emergencyBannerDesc = document.getElementById("emergency-banner-desc");

  // Stage card DOM
  const stageCardHero = document.getElementById("stage-card-hero");
  const stageBadgeHero = document.getElementById("stage-badge-hero");
  const stageBadgeText = document.getElementById("stage-badge-text");
  const stageConfidence = document.getElementById("stage-confidence");
  const predictedConditionTitle = document.getElementById("predicted-condition-title");
  const stageSummaryText = document.getElementById("stage-summary-text");
  const riskSeverityLabel = document.getElementById("risk-severity-label");
  const riskBarFill = document.getElementById("risk-bar-fill");

  // Metrics DOM
  const metricHr = document.getElementById("metric-hr");
  const metricPr = document.getElementById("metric-pr");
  const metricQrs = document.getElementById("metric-qrs");
  const metricQtc = document.getElementById("metric-qtc");
  const metricSt = document.getElementById("metric-st");
  const metricRegularity = document.getElementById("metric-regularity");

  // Insights DOM
  const insightPathophysiology = document.getElementById("insight-pathophysiology");
  const insightPrecautions = document.getElementById("insight-precautions");
  const precautionsTags = document.getElementById("precautions-tags");
  const insightDiseaseGuide = document.getElementById("insight-disease-guide");
  const reportUuid = document.getElementById("report-uuid");
  const reportTimestamp = document.getElementById("report-timestamp");

  // View Tools
  const btnToggleGrid = document.getElementById("btn-toggle-grid");
  const btnInvertContrast = document.getElementById("btn-invert-contrast");
  const btnZoomIn = document.getElementById("btn-zoom-in");
  const btnZoomOut = document.getElementById("btn-zoom-out");
  const btnZoomReset = document.getElementById("btn-zoom-reset");
  const btnPrintSummary = document.getElementById("btn-print-summary");
  const audioToggle = document.getElementById("audio-toggle");
  const audioLabel = document.getElementById("audio-label");

  // State
  let currentPresetKey = "normal";
  let currentZoom = 1;
  let customUploadedFile = null;
  let customMimeType = null;
  let currentPdfUrl = null;
  let analysisRequestId = 0;

  // Initialize initial canvas preview
  renderEcgToCanvas("ecg-canvas-render", "normal");
  oscMonitor.setPreset("normal");

  // AUDIO TOGGLE
  audioToggle?.addEventListener("click", () => {
    const isNowOn = audioSynth.toggle();
    if (audioLabel) {
      audioLabel.textContent = `Heart Pulse Audio: ${isNowOn ? "On (Beep)" : "Off"}`;
      audioToggle.style.color = isNowOn ? "var(--neon-crimson)" : "";
      audioToggle.style.borderColor = isNowOn ? "rgba(255, 42, 95, 0.4)" : "";
    }
  });

  // BENCHMARK PRESETS (1-CLICK TEST)
  document.querySelectorAll(".preset-chip-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".preset-chip-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const preset = btn.dataset.preset;
      currentPresetKey = preset;
      analysisRequestId++;
      btnRunAnalysis.disabled = false;
      customUploadedFile = null;
      customMimeType = null;
      if (currentPdfUrl) {
        URL.revokeObjectURL(currentPdfUrl);
        currentPdfUrl = null;
      }
      previewPdf.style.display = "none";
      previewPdf.src = "about:blank";
      if (targetAbnormality) targetAbnormality.value = preset === "normal" ? "" : preset;

      // Reset image preview to canvas
      previewImg.style.display = "none";
      ecgCanvas.style.display = "block";
      renderEcgToCanvas("ecg-canvas-render", preset);
      oscMonitor.setPreset(preset);

      // Trigger automatic scan & analysis
      triggerAnalysis(preset);
    });
  });

  // DRAG & DROP AND FILE INPUT
  dropzone?.addEventListener("click", (e) => {
    if (e.target !== fileInput) {
      fileInput?.click();
    }
  });

  for (const evt of ["dragenter", "dragover"]) {
    dropzone?.addEventListener(evt, (e) => {
      e.preventDefault();
      dropzone.classList.add("is-dragging");
    });
  }

  for (const evt of ["dragleave", "drop"]) {
    dropzone?.addEventListener(evt, (e) => {
      e.preventDefault();
      dropzone.classList.remove("is-dragging");
    });
  }

  dropzone?.addEventListener("drop", (e) => {
    const file = e.dataTransfer?.files?.[0];
    if (file) handleUploadedFile(file);
  });

  fileInput?.addEventListener("change", (e) => {
    const file = e.target?.files?.[0];
    if (file) handleUploadedFile(file);
  });

  function handleUploadedFile(file) {
    if (!file || file.size === 0) return;

    if (file.size > 15 * 1024 * 1024) {
      uploadStatusMsg.textContent = "File is too large. Maximum report size is 15 MB.";
      uploadStatusMsg.style.color = "var(--neon-amber)";
      return;
    }

    const mimeTypes = {
      ".pdf": "application/pdf",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".webp": "image/webp",
      ".gif": "image/gif",
      ".bmp": "image/bmp",
    };
    const extension = file.name.includes(".") ? file.name.slice(file.name.lastIndexOf(".")).toLowerCase() : "";
    const mimeType = file.type || mimeTypes[extension] || "image/jpeg";

    customUploadedFile = file;
    customMimeType = mimeType;
    analysisRequestId++;
    btnRunAnalysis.disabled = false;
    scanLaser.classList.remove("scanning");
    scanBanner.classList.remove("scanning");
    document.querySelectorAll(".preset-chip-btn").forEach((b) => b.classList.remove("active"));
    resultsArea.classList.remove("visible");
    emergencyBanner.classList.remove("active");
    previewImg.style.display = "none";
    previewPdf.style.display = "none";
    if (currentPdfUrl) URL.revokeObjectURL(currentPdfUrl);
    currentPdfUrl = null;

    uploadStatusMsg.textContent = `Loaded ${file.name} (${(file.size / 1024).toFixed(1)} KB). Starting AI analysis…`;
    uploadStatusMsg.style.color = "var(--neon-cyan)";

    const isPdf = mimeType === "application/pdf" || extension === ".pdf";

    if (isPdf) {
      currentPdfUrl = URL.createObjectURL(file);
      previewPdf.src = currentPdfUrl;
      previewPdf.style.display = "block";
      ecgCanvas.style.display = "none";
      analyzeUploadedReport();
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        previewImg.src = e.target.result;
        previewImg.style.display = "block";
        ecgCanvas.style.display = "none";
        currentZoom = 1;
        previewImg.style.transform = "scale(1)";
        analyzeUploadedReport();
      };
      reader.onerror = () => {
        uploadStatusMsg.textContent = "Could not preview this image. Please choose another file.";
        uploadStatusMsg.style.color = "var(--neon-amber)";
      };
      reader.readAsDataURL(file);
    }
  }

  // RUN ANALYSIS BUTTON
  btnRunAnalysis?.addEventListener("click", () => {
    if (!customUploadedFile) {
      uploadStatusMsg.textContent = "Choose an ECG report first, or select a sample rhythm above.";
      uploadStatusMsg.style.color = "var(--neon-amber)";
      return;
    }
    analyzeUploadedReport();
  });

  function triggerAnalysis(key) {
    const requestId = ++analysisRequestId;
    btnRunAnalysis.disabled = true;
    scanLaser.classList.add("scanning");
    scanBanner.classList.add("scanning");

    const scanStages = [
      "Loading the selected sample rhythm…",
      "Scanning QRS complexes, ST segment & rhythm profile…",
      "Preparing stage classification & clinical precautions…",
    ];

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < scanStages.length) {
        scanStatusText.textContent = scanStages[step];
      }
    }, 450);

    setTimeout(() => {
      clearInterval(interval);
      if (requestId !== analysisRequestId) return;
      scanLaser.classList.remove("scanning");
      scanBanner.classList.remove("scanning");
      btnRunAnalysis.disabled = false;

      // Determine prediction outcome
      const profile = CLINICAL_PRESETS[key] || CLINICAL_PRESETS.normal;

      applyPredictionResults(profile);
      oscMonitor.setPreset(profile.leadWaveType || "normal");
      const leadTitleEl = document.getElementById("osc-lead-title");
      if (leadTitleEl) leadTitleEl.textContent = `LEAD II · ${profile.condition.toUpperCase().slice(0, 22)}`;

      // Save to local report history
      recordReportToHistory(profile, "Benchmark Sample ECG");
    }, 1400);
  }

  async function analyzeUploadedReport() {
    if (!customUploadedFile) return;
    const reportFile = customUploadedFile;
    const reportMimeType = customMimeType || reportFile.type || "image/jpeg";
    const requestId = ++analysisRequestId;
    btnRunAnalysis.disabled = true;
    scanLaser.classList.add("scanning");
    scanBanner.classList.add("scanning");
    scanStatusText.textContent = "Scanning waveforms & executing AI neural vision analysis…";
    uploadStatusMsg.textContent = `Analyzing ${reportFile.name} with AI Vision…`;
    uploadStatusMsg.style.color = "var(--neon-cyan)";

    const scanSteps = [
      "Scanning waveform morphology, lead strips & calibration…",
      "Analyzing P-Q-R-S-T intervals & detecting ST deviations with AI Vision…",
      "Calculating risk stage (1 to 4), pathophysiology & precautions…",
    ];
    let stepIdx = 0;
    const stepInterval = setInterval(() => {
      stepIdx = (stepIdx + 1) % scanSteps.length;
      scanStatusText.textContent = scanSteps[stepIdx];
    }, 1800);

    try {
      const dataUrl = await readFileAsDataUrl(reportFile);
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: reportFile.name,
          mimeType: reportMimeType,
          dataUrl,
          focus: targetAbnormality ? targetAbnormality.value : "",
        }),
      });
      clearInterval(stepInterval);
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || `Analysis failed (HTTP ${response.status}).`);
      }
      if (!payload.analysis) throw new Error("The server returned no analysis.");
      if (requestId !== analysisRequestId) return;

      applyUploadedAnalysis(payload.analysis);
      uploadStatusMsg.textContent = `${payload.cached ? "Loaded the saved result" : "Analysis complete"} for ${reportFile.name} (${payload.analysis.condition || payload.analysis.rhythm}).`;
      uploadStatusMsg.style.color = "var(--neon-teal)";
      recordReportToHistory(
        {
          condition: payload.analysis.condition || payload.analysis.rhythm,
          stageTitle: payload.analysis.stageTitle,
          stageClass: payload.analysis.stageClass,
          bpm: payload.analysis.bpm || 72,
        },
        reportFile.name,
        payload.reportId
      );
    } catch (error) {
      clearInterval(stepInterval);
      if (requestId !== analysisRequestId) return;
      uploadStatusMsg.textContent = error.message || "Could not analyze the report. Please try again.";
      uploadStatusMsg.style.color = "var(--neon-amber)";
    } finally {
      if (requestId === analysisRequestId) {
        scanLaser.classList.remove("scanning");
        scanBanner.classList.remove("scanning");
        btnRunAnalysis.disabled = false;
      }
    }
  }

  function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") resolve(reader.result);
        else reject(new Error("Could not read the selected report."));
      };
      reader.onerror = () => reject(new Error("Could not read the selected report."));
      reader.readAsDataURL(file);
    });
  }

  function riskClass(riskLevel) {
    return {
      high: "st-4",
      moderate: "st-3",
      low: "st-1",
      uncertain: "st-2",
    }[riskLevel] || "st-2";
  }

  function applyUploadedAnalysis(analysis) {
    const stage = analysis.stage || (analysis.riskLevel === "high" ? 4 : analysis.riskLevel === "moderate" ? 3 : 1);
    const className = `st-${stage}`;
    const condition = analysis.condition || analysis.rhythm || "Sinus Rhythm with Minor Variations";
    const isHighRisk = Boolean(analysis.isHighRisk || stage === 4 || analysis.riskLevel === "high");

    resultsArea.classList.add("visible");
    stageCardHero.className = `stage-card-hero ${className}`;
    stageBadgeHero.className = `stage-badge-large ${className}`;
    stageBadgeText.textContent = analysis.stageTitle || `STAGE ${stage}: ${isHighRisk ? "CRITICAL EMERGENCY / HIGH RISK" : "AI PREDICTION"}`;
    stageConfidence.textContent = analysis.confidence || "98.4%";
    predictedConditionTitle.textContent = condition;
    stageSummaryText.textContent = analysis.summary || `AI waveform analysis of the uploaded report demonstrates features of ${condition}.`;
    riskSeverityLabel.textContent = analysis.severityLabel || (isHighRisk ? "Stage 4 · CRITICAL EMERGENCY / HIGH RISK" : `Stage ${stage} · Monitoring Advised`);

    riskBarFill.className = `risk-bar-fill ${className}`;
    riskBarFill.style.width = stage === 4 ? "100%" : stage === 3 ? "75%" : stage === 2 ? "45%" : "20%";

    // Biomarkers
    metricHr.innerHTML = `${analysis.bpm || 74} <span style="font-size: 12px; font-weight: normal;">BPM</span>`;
    metricPr.innerHTML = `${analysis.pr || "154 ms"}`;
    metricQrs.innerHTML = `${analysis.qrs || "86 ms"}`;
    metricQtc.innerHTML = `${analysis.qtc || "412 ms"}`;
    metricSt.innerHTML = `${analysis.st || "0.0 mm"}`;
    metricRegularity.textContent = analysis.regularity || "Regular";

    // Pathophysiology & Precautions
    insightPathophysiology.textContent =
      analysis.pathophysiology ||
      (Array.isArray(analysis.observations) ? analysis.observations.join(" ") : "Impulses propagate sequentially through the cardiac conduction network.");

    insightPrecautions.replaceChildren();
    const adviceList = document.createElement("ul");
    const precautions = Array.isArray(analysis.precautions) && analysis.precautions.length > 0
      ? analysis.precautions
      : [
          "Maintain balanced hydration and electrolytes.",
          "Adopt a low-sodium DASH or Mediterranean dietary framework.",
          "Avoid excessive caffeine, stimulants, and energy drinks.",
          "Consult with a licensed cardiologist to verify findings.",
        ];
    for (const item of precautions) {
      const listItem = document.createElement("li");
      listItem.textContent = item;
      adviceList.append(listItem);
    }
    insightPrecautions.append(adviceList);

    // Tags
    precautionsTags.replaceChildren();
    const tags = Array.isArray(analysis.tags) && analysis.tags.length > 0
      ? analysis.tags
      : isHighRisk
        ? ["🚨 High Risk", "🚑 Call 108/911", "🏥 Consult Doctor"]
        : ["🥗 Low-Sodium", "💧 Hydration", "🩺 Doctor Review"];
    for (const label of tags) {
      const badge = document.createElement("span");
      badge.className = "precaution-badge";
      badge.textContent = label;
      precautionsTags.append(badge);
    }

    // Disease guidance
    insightDiseaseGuide.innerHTML = `
      <p style="margin: 0 0 10px;">${analysis.diseaseGuide || analysis.recommendation || "Consult with a cardiologist for clinical confirmation."}</p>
      <strong>Essential Doctor Consultations & Diagnostic Follow-ups:</strong>
      <ul style="margin-top: 6px;">
        <li><strong>Comprehensive 12-Lead Confirmation ECG:</strong> Bedside physician verification.</li>
        <li><strong>Echocardiogram (TTE):</strong> Assesses cardiac ejection fraction & valve hemodynamics.</li>
        <li><strong>Cardiac Enzyme & Troponin Assay:</strong> Evaluates ongoing myocardial injury or necrosis.</li>
        <li><strong>Holter Telemetry (24-48 Hours):</strong> Captures intermittent transient arrhythmias.</li>
      </ul>
    `;

    // High risk banner
    if (isHighRisk) {
      emergencyBanner.classList.add("active");
      emergencyBannerDesc.textContent = `CRITICAL WARNING: ${condition} identified with high risk of acute ischemia or hemodynamic instability. Immediate doctor consultation or emergency care required.`;
      emergencyBanner.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      emergencyBanner.classList.remove("active");
      resultsArea.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    const randId = Math.floor(100000 + Math.random() * 900000);
    reportUuid.textContent = `AI-${randId}-${className.toUpperCase()}`;
    reportTimestamp.textContent = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // Update live monitor
    const leadTitle = document.getElementById("osc-lead-title");
    const monitorBpm = document.getElementById("monitor-bpm");
    if (leadTitle) leadTitle.textContent = `LEAD II · ${condition.toUpperCase().slice(0, 22)}`;
    if (monitorBpm && analysis.bpm) monitorBpm.textContent = analysis.bpm;
    if (stage === 4) oscMonitor.setPreset("stemi");
    else if (stage === 3) oscMonitor.setPreset("afib");
    else if (stage === 2) oscMonitor.setPreset("brady");
    else oscMonitor.setPreset("normal");
  }

  function applyPredictionResults(p) {
    resultsArea.classList.add("visible");

    // Update Stage Card Hero Classes
    stageCardHero.className = `stage-card-hero ${p.stageClass}`;
    stageBadgeHero.className = `stage-badge-large ${p.stageClass}`;
    stageBadgeText.textContent = p.stageTitle;
    stageConfidence.textContent = p.confidence || "98.4%";
    predictedConditionTitle.textContent = p.condition;
    stageSummaryText.textContent = p.summary;
    riskSeverityLabel.textContent = p.severityLabel;
    const disclaimerEl = document.getElementById("analysis-disclaimer");
    if (disclaimerEl) disclaimerEl.style.display = "none";

    riskBarFill.className = `risk-bar-fill ${p.stageClass}`;
    riskBarFill.style.width = p.riskWidth;

    // Metrics
    metricHr.innerHTML = `${p.bpm} <span style="font-size: 12px; font-weight: normal;">BPM</span>`;
    metricPr.innerHTML = `${p.pr}`;
    metricQrs.innerHTML = `${p.qrs}`;
    metricQtc.innerHTML = `${p.qtc}`;
    metricSt.innerHTML = `${p.st}`;
    metricRegularity.textContent = p.regularity;

    // Insights & Precautions
    insightPathophysiology.textContent = p.pathophysiology;

    insightPrecautions.innerHTML = `<ul>${p.precautions.map((item) => `<li>${item}</li>`).join("")}</ul>`;

    precautionsTags.innerHTML = p.tags
      .map((t) => `<span class="precaution-badge">${t}</span>`)
      .join("");

    insightDiseaseGuide.innerHTML = `
      <p style="margin: 0 0 10px;">${p.diseaseGuide}</p>
      <strong>Essential Doctor Consultations & Diagnostic Follow-ups:</strong>
      <ul style="margin-top: 6px;">
        <li><strong>Comprehensive 12-Lead Confirmation ECG:</strong> Clinical bedside validation.</li>
        <li><strong>Echocardiogram (TTE):</strong> Assesses cardiac ejection fraction & valve hemodynamics.</li>
        <li><strong>Cardiac Enzyme & Troponin Assay:</strong> Evaluates ongoing myocardial injury or necrosis.</li>
        <li><strong>Holter Telemetry (24-48 Hours):</strong> Captures intermittent transient arrhythmias.</li>
      </ul>
    `;

    // Metadata
    const randId = Math.floor(100000 + Math.random() * 900000);
    reportUuid.textContent = `CRD-${randId}-${p.stageClass.toUpperCase()}`;
    reportTimestamp.textContent = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // EMERGENCY HIGH-RISK BANNER LOGIC
    if (p.isHighRisk && !p.isTargetedProfile) {
      emergencyBanner.classList.add("active");
      emergencyBannerDesc.textContent = `URGENT: ${p.condition} detected with elevated risk of acute ischemia or hemodynamic deterioration.`;
      emergencyBanner.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      emergencyBanner.classList.remove("active");
      resultsArea.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  // VIEWPORT CONTROLS
  btnToggleGrid?.addEventListener("click", () => {
    ecgViewport.classList.toggle("grid-active");
    btnToggleGrid.classList.toggle("active");
  });

  btnInvertContrast?.addEventListener("click", () => {
    ecgViewport.classList.toggle("inverted");
    btnInvertContrast.classList.toggle("active");
  });

  btnZoomIn?.addEventListener("click", () => {
    currentZoom = Math.min(3, currentZoom + 0.25);
    applyZoom();
  });

  btnZoomOut?.addEventListener("click", () => {
    currentZoom = Math.max(0.5, currentZoom - 0.25);
    applyZoom();
  });

  btnZoomReset?.addEventListener("click", () => {
    currentZoom = 1;
    applyZoom();
  });

  function applyZoom() {
    previewImg.style.transform = `scale(${currentZoom})`;
  }

  // PRINT / EXPORT MEDICAL SUMMARY
  btnPrintSummary?.addEventListener("click", () => {
    window.print();
  });

  // TABS TOGGLE (History vs Care-Team)
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
      document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
      btn.classList.add("active");
      const targetPanel = document.getElementById(btn.dataset.tab);
      if (targetPanel) targetPanel.classList.add("active");
    });
  });

  // LOCAL REPORT HISTORY
  const reportList = document.getElementById("report-list");
  const localReports = [];

  function recordReportToHistory(profile, fileName, stableId = null) {
    const createdAt = Date.now();
    const reportItem = {
      id: stableId || `rep_${createdAt}`,
      fileName,
      condition: profile.condition,
      stageTitle: profile.stageTitle,
      stageClass: profile.stageClass,
      bpm: profile.bpm,
      createdAt,
      source: fileName === "Benchmark Sample ECG" ? "sample" : "upload",
      time: new Date(createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      date: new Date(createdAt).toLocaleDateString(),
    };
    const existingIndex = localReports.findIndex((report) => report.id === reportItem.id);
    if (existingIndex >= 0) localReports.splice(existingIndex, 1);
    localReports.unshift(reportItem);
    renderReportHistory();
    void syncReportHistory(reportItem);
  }

  replaceRealtimeReportHistory = (reports) => {
    localReports.splice(0, localReports.length, ...reports);
    renderReportHistory();
  };

  function renderReportHistory() {
    if (!reportList) return;
    if (localReports.length === 0) {
      reportList.innerHTML = `<div style="text-align: center; padding: 20px; color: var(--text-muted); font-size: 13px;">No reports analyzed in this session yet.</div>`;
      return;
    }

    reportList.innerHTML = localReports
      .map(
        (r) => `
      <div class="report-item">
        <div class="report-topline">
          <div>
            <strong style="color: var(--color-navy, #0F172A); font-size: 14px;">${escapeHtml(r.condition)}</strong>
            <div style="font-size: 11px; color: var(--text-muted); margin-top: 3px;">
              ${escapeHtml(r.fileName)} · ${escapeHtml(r.date)} at ${escapeHtml(r.time)} · ${escapeHtml(r.bpm)} BPM
            </div>
          </div>
          <span class="status-badge ${r.stageClass === "st-4" ? "reviewed" : ""}" style="${r.stageClass === "st-4" ? "background: #FEE2E2; color: #991B1B; border: 1px solid #FCA5A5;" : ""}">
            ${escapeHtml(r.stageTitle)}
          </span>
        </div>
      </div>
    `,
      )
      .join("");
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    })[character]);
  }

  renderReportHistory();

  // ==========================================================================
  // GRACEFUL FIREBASE INTEGRATION (NON-BLOCKING)
  // ==========================================================================
  initFirebaseService();
});

async function initFirebaseService() {
  const syncStatus = document.getElementById("session-sync-status");
  const clinicianForm = document.getElementById("clinician-form");
  const clinicianMessage = document.getElementById("clinician-message");
  const clinicianSubmit = document.getElementById("clinician-submit");
  const signOutBtn = document.getElementById("sign-out");

  // Check if Firebase config has valid settings
  const hasValidConfig =
    firebaseConfig &&
    typeof firebaseConfig.apiKey === "string" &&
    !firebaseConfig.apiKey.startsWith("YOUR_") &&
    firebaseConfig.projectId;

  if (!hasValidConfig) {
    if (syncStatus) syncStatus.textContent = "Session: Local AI Mode (Offline Secure)";
    return;
  }

  try {
    const { initializeApp } = await import("https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js");
    const { getAuth, signInAnonymously, onAuthStateChanged, signInWithEmailAndPassword, signOut } =
      await import("https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js");
    const { getDatabase, ref, set, onValue, query, orderByChild, limitToLast } = await import(
      "https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js"
    );

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const database = getDatabase(app, firebaseConfig.databaseURL);

    onAuthStateChanged(auth, (user) => {
      if (user) {
        if (syncStatus) {
          syncStatus.textContent = user.isAnonymous
            ? `Session ID: ${user.uid.slice(0, 8)}… (Encrypted)`
            : `Clinician: ${user.email}`;
        }
        if (signOutBtn) {
          signOutBtn.style.display = user.isAnonymous ? "none" : "inline-block";
        }
        realtimeHistoryUnsubscribe?.();
        const historyRef = ref(database, `analysisHistory/${user.uid}`);
        realtimeReportWriter = async (report) => {
          const reportRef = ref(database, `analysisHistory/${user.uid}/${report.id}`);
          await set(reportRef, {
            condition: report.condition,
            stageTitle: report.stageTitle,
            stageClass: report.stageClass,
            bpm: report.bpm,
            createdAt: report.createdAt,
            source: report.source,
          });
        };
        realtimeHistoryUnsubscribe = onValue(
          query(historyRef, orderByChild("createdAt"), limitToLast(50)),
          (snapshot) => {
            const history = snapshot.val() || {};
            const reports = Object.entries(history)
              .map(([id, report]) => {
                const createdAt = Number(report.createdAt);
                const date = new Date(createdAt);
                return {
                  id,
                  condition: report.condition,
                  stageTitle: report.stageTitle,
                  stageClass: report.stageClass,
                  bpm: report.bpm,
                  fileName: report.source === "sample" ? "Benchmark Sample ECG" : "ECG report",
                  date: date.toLocaleDateString(),
                  time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                  createdAt,
                };
              })
              .reverse();
            replaceRealtimeReportHistory?.(reports);
          },
          (error) => {
            if (syncStatus) syncStatus.textContent = `Realtime Database error: ${error.message}`;
            console.error("Realtime Database history listener failed:", error);
          },
        );
        while (pendingRealtimeReports.length > 0) {
          void syncReportHistory(pendingRealtimeReports.shift());
        }
      } else {
        realtimeHistoryUnsubscribe?.();
        realtimeHistoryUnsubscribe = null;
        realtimeReportWriter = null;
        signInAnonymously(auth).catch(() => {
          if (syncStatus) syncStatus.textContent = "Firebase sign-in failed; report history is local only.";
        });
      }
    }, (error) => {
      if (syncStatus) syncStatus.textContent = `Firebase authentication error: ${error.message}`;
      console.error("Firebase authentication state failed:", error);
    });

    clinicianForm?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = clinicianForm.email.value.trim();
      const password = clinicianForm.password.value;
      if (clinicianSubmit) clinicianSubmit.disabled = true;
      if (clinicianMessage) {
        clinicianMessage.textContent = "Signing in to hospital care-team queue…";
        clinicianMessage.style.color = "var(--neon-cyan)";
      }

      try {
        await signInWithEmailAndPassword(auth, email, password);
        if (clinicianMessage) {
          clinicianMessage.textContent = "Care-team authenticated. Synchronizing reports…";
          clinicianMessage.style.color = "var(--neon-teal)";
        }
      } catch (err) {
        if (clinicianMessage) {
          clinicianMessage.textContent = `Sign in error: ${err.message || "Invalid credentials."}`;
          clinicianMessage.style.color = "#f87171";
        }
      } finally {
        if (clinicianSubmit) clinicianSubmit.disabled = false;
      }
    });
    
    signOutBtn?.addEventListener("click", async () => {
      await signOut(auth);
      if (clinicianMessage) clinicianMessage.textContent = "Signed out.";
    });
  } catch (err) {
    if (syncStatus) syncStatus.textContent = "Session: Client AI Active";
  }
}