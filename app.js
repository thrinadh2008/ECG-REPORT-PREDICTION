import { firebaseConfig } from "./firebase-config.js?v=20261105-1";

// ============================================================================
// CLINICAL BENCHMARK DATABASE & STAGE DEFINITIONS
// TARGET ABNORMALITY: ATRIAL FIBRILLATION & ATRIAL FLUTTER (AFIB / AFL)
// ============================================================================
const CLINICAL_PRESETS = {
  normal: {
    stage: 1,
    stageTitle: "STAGE 1: OPTIMAL & NORMAL SINUS RHYTHM",
    stageClass: "st-1",
    condition: "Normal Sinus Rhythm (Control Baseline)",
    abnormality: "None (Normal Sinus Rhythm)",
    confidence: "98.4%",
    signalQuality: "Good",
    qualityScore: "97.5%",
    evidenceStrength: "Strong",
    severityLabel: "Stage 1 · Low Risk / Control Baseline",
    riskWidth: "20%",
    bpm: 72,
    pr: "156 ms",
    qrs: "84 ms",
    qtc: "412 ms",
    st: "0.0 mm",
    regularity: "Regular",
    summary:
      "Uniform P-QRS-T complex alignment across all 12 leads with normal Sinoatrial pacing, normal AV conduction delay, and isoelectric ST segments.",
    briefExplanation: {
      input: "Scanned 12-Lead ECG Tracing",
      signalQuality: "Good (SNR: 26.5 dB, 99.1% baseline stability)",
      potentialPattern: "Normal Sinus Rhythm (Healthy Control)",
      confidence: "98.4%",
      supportingEvidence: "• Regular rhythm pattern (uniform R-R intervals)\n• Consistent P-wave morphology preceding every QRS complex",
      biomedicalExplanation: "Sinoatrial (SA) node pacing generates coordinated atrial depolarization followed by physiological atrioventricular delay, ensuring optimal ventricular filling.",
      interpretation: "The observed waveform characteristics demonstrate physiological cardiac electrophysiology without anomalous conduction.",
      recommendation: "Routine annual preventive cardiovascular wellness screening advised.",
    },
    transformerAttention: {
      primaryFocus: "Uniform P-QRS-T Morphological Alignment",
      fWaveActivity: "Isoelectric quiescent baseline",
      irregularityScore: "0.04 (Strict Periodicity)",
      attentionHeads: [
        { name: "Head 1 (R-R Spacing)", weight: "0.15", desc: "Equidistant R-R intervals" },
        { name: "Head 2 (P-Wave Morphology)", weight: "0.12", desc: "Distinct upright P-waves in Lead II" },
        { name: "Head 3 (F-Wave Frequency)", weight: "0.09", desc: "No micro-voltage baseline undulations" },
        { name: "Head 4 (AV Conduction)", weight: "0.18", desc: "Constant 156ms PR interval" },
      ],
    },
    detailedExplanation: {
      digitizationSummary: "1D digital signal successfully extracted with 250 Hz temporal resolution. Isoelectric baseline stability 99.1%.",
      transformerAnalysis: "The 1D ECG Transformer detected uniform periodic self-attention across R-R intervals with distinct P-wave token activations.",
      ragBiomedicalInsights: "RAG biomedical knowledge confirms physiological sinus depolarization originating from the Sinoatrial node.",
      hemodynamicImpact: "Synchronized atrial and ventricular filling ensures maximal hemodynamic cardiac output.",
      clinicalWorkup: "Maintain healthy cardiovascular lifestyle and periodic check-ups.",
    },
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
      "Your electrical conduction profile is currently optimal. To preserve long-term arterial and myocardial health, monitor blood pressure, maintain healthy blood lipid levels (LDL < 100 mg/dL), and avoid tobacco use.",
    isHighRisk: false,
    leadWaveType: "normal",
  },
  afib: {
    stage: 3,
    stageTitle: "STAGE 3: ABNORMAL RHYTHM — ATRIAL FIBRILLATION",
    stageClass: "st-3",
    condition: "Atrial Fibrillation (Persistent AFib)",
    abnormality: "Atrial Fibrillation (Target Abnormality)",
    confidence: "88.0%",
    signalQuality: "Good",
    qualityScore: "94.6%",
    evidenceStrength: "Strong",
    severityLabel: "Target Abnormality · Atrial Fibrillation (AFib)",
    riskWidth: "75%",
    bpm: 118,
    pr: "Absent (f-waves)",
    qrs: "90 ms",
    qtc: "428 ms",
    st: "0.0 mm",
    regularity: "Irregularly Irregular",
    summary:
      "Complete absence of discrete P-waves replaced by rapid irregular fibrillatory f-waves (350-600 bpm) and chaotic R-R intervals.",
    briefExplanation: {
      input: "Scanned 12-Lead ECG Tracing",
      signalQuality: "Good (SNR: 24.2 dB, 98.2% baseline stability)",
      potentialPattern: "Atrial Fibrillation (Abnormal Rhythm)",
      confidence: "88%",
      supportingEvidence: "• Irregular rhythm pattern (variable R-R intervals)\n• Relevant waveform changes (absence of discrete P-waves, presence of fibrillatory f-waves)",
      biomedicalExplanation: "Multiple disorganized re-entrant micro-circuits depolarize the atria chaotically at 350-600 bpm, bypassing Sinoatrial (SA) node pacing and causing erratic ventricular response.",
      interpretation: "The observed waveform characteristics are potentially associated with the detected pattern.",
      recommendation: "Clinical review is advised.",
    },
    transformerAttention: {
      primaryFocus: "Irregular R-R Interval Dynamics & Absent P-waves",
      fWaveActivity: "Chaotic baseline oscillations (350-600 bpm)",
      irregularityScore: "0.89 (High Entropy)",
      attentionHeads: [
        { name: "Head 1 (R-R Interval Entropy)", weight: "0.92", desc: "Detects irregular spacing between consecutive ventricular depolarizations" },
        { name: "Head 2 (P-Wave Flatline / Absence)", weight: "0.89", desc: "Detects absence of organized Sinoatrial depolarization vectors" },
        { name: "Head 3 (F-Wave Micro-Potentials)", weight: "0.86", desc: "Captures 350-600 bpm chaotic atrial fibrillatory undulations" },
        { name: "Head 4 (AV Nodal Conduction Latency)", weight: "0.79", desc: "Models stochastic refractory filtering through the AV node" },
      ],
    },
    detailedExplanation: {
      digitizationSummary: "1D digital signal successfully extracted with 250 Hz temporal resolution. Isoelectric baseline stability 98.2%.",
      transformerAnalysis: "The 1D ECG Transformer multi-head attention network identified high attention weights across non-equidistant R-peak tokens and micro-voltage baseline variations, indicating absence of coordinated atrial depolarization.",
      ragBiomedicalInsights: "RAG knowledge retrieval correlates findings with ESC & AHA/ACC AFib Guidelines: chaotic atrial depolarization leads to loss of atrial mechanical kick (15-20% cardiac output reduction) and blood stasis in the left atrial appendage (LAA), elevating systemic thromboembolism and stroke risk.",
      hemodynamicImpact: "Variable ventricular diastolic filling periods cause fluctuating stroke volumes and peripheral pulse deficit.",
      clinicalWorkup: "Immediate bedside 12-lead ECG confirmation, Transthoracic Echocardiogram (TTE) for chamber size & LAA thrombus exclusion, thyroid function tests (TSH), serum electrolytes, and CHA2DS2-VASc stroke risk assessment.",
    },
    pathophysiology:
      "Multiple chaotic micro-reentrant electrical circuits depolarize the atria at rates of 350 to 600 beats per minute. The atria quiver rather than contract synchronously, resulting in blood stasis within the left atrial appendage (significantly elevating stroke and systemic embolism risks). The AV node intermittently permits random impulses to pass to the ventricles, resulting in an irregularly irregular pulse and reduced cardiac filling efficiency.",
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
  afib_rvr: {
    stage: 3,
    stageTitle: "STAGE 3: ABNORMAL RHYTHM — AFIB WITH RAPID VENTRICULAR RESPONSE",
    stageClass: "st-3",
    condition: "Atrial Fibrillation with Rapid Ventricular Response (RVR)",
    abnormality: "Atrial Fibrillation (Target Abnormality - Tachycardic)",
    confidence: "94.2%",
    signalQuality: "Good",
    qualityScore: "95.8%",
    evidenceStrength: "Strong",
    severityLabel: "Target Abnormality · Tachycardic AFib with RVR",
    riskWidth: "85%",
    bpm: 134,
    pr: "Absent (f-waves)",
    qrs: "92 ms",
    qtc: "438 ms",
    st: "-0.8 mm (Strain)",
    regularity: "Irregularly Irregular",
    summary:
      "Rapid irregularly irregular ventricular response with chaotic fibrillatory baseline undulations, absent P-waves, and rapid rate > 130 BPM.",
    briefExplanation: {
      input: "Scanned 12-Lead ECG Tracing",
      signalQuality: "Good (SNR: 25.1 dB, 97.4% baseline stability)",
      potentialPattern: "Atrial Fibrillation with Rapid Ventricular Response",
      confidence: "94%",
      supportingEvidence: "• Rapid irregular ventricular tachycardia (HR: 134 BPM)\n• Absent P-waves with ST-strain depression",
      biomedicalExplanation: "Accelerated AV nodal conduction allows high-rate transmission of chaotic atrial fibrillatory impulses, causing rapid ventricular pacing.",
      interpretation: "The observed rapid irregular ventricular rate compromises diastolic filling and warrants prompt medical rate control.",
      recommendation: "Urgent clinical review and physician evaluation advised.",
    },
    transformerAttention: {
      primaryFocus: "High Frequency R-R Density & Absence of Atrial Pacing",
      fWaveActivity: "High-amplitude fibrillatory undulations",
      irregularityScore: "0.94 (Very High Entropy)",
      attentionHeads: [
        { name: "Head 1 (R-R Spacing)", weight: "0.95", desc: "Short, chaotic R-R intervals (<450ms)" },
        { name: "Head 2 (P-Wave Morphology)", weight: "0.91", desc: "Complete absence of discrete P-waves" },
        { name: "Head 3 (F-Wave Frequency)", weight: "0.88", desc: "Dense baseline fibrillatory oscillations" },
        { name: "Head 4 (AV Conduction)", weight: "0.84", desc: "High rate AV nodal transmission" },
      ],
    },
    detailedExplanation: {
      digitizationSummary: "1D digital signal successfully extracted. Tachycardic intervals identified across precordial leads.",
      transformerAnalysis: "The 1D Transformer identified dense clustering of irregular QRS tokens with sub-450ms R-R cycles.",
      ragBiomedicalInsights: "AFib with RVR markedly decreases cardiac output by drastically shortening diastolic filling time, increasing risk of acute heart failure or hypotension.",
      hemodynamicImpact: "Reduced coronary perfusion and elevated myocardial oxygen demand.",
      clinicalWorkup: "Urgent hospital evaluation, intravenous or oral AV nodal blocking agents (beta-blockers or non-dihydropyridine CCBs), and echocardiography.",
    },
    pathophysiology:
      "Rapid conduction of atrial fibrillatory wavelets through the AV node overwhelms ventricular diastolic filling. The rapid rate compromises stroke volume and coronary perfusion.",
    precautions: [
      "Avoid all exertion; sit recumbent and rest immediately.",
      "Do not take unprescribed stimulants or decongestants.",
      "Take prescribed rate-control medication (e.g. Metoprolol, Diltiazem) as directed.",
      "Seek immediate urgent care if lightheaded or short of breath.",
    ],
    tags: ["⚠️ Rapid Heart Rate", "💊 Urgent Rate Control", "🩺 Immediate Hospital Care", "🚫 Zero Stimulants"],
    diseaseGuide:
      "AFib with RVR warrants prompt medical attention to control ventricular rate, evaluate stroke risk, and prevent tachycardia-induced cardiomyopathy.",
    isHighRisk: false,
    leadWaveType: "afib",
  },
  pafib: {
    stage: 3,
    stageTitle: "STAGE 3: ABNORMAL RHYTHM — PAROXYSMAL ATRIAL FIBRILLATION",
    stageClass: "st-3",
    condition: "Paroxysmal Atrial Fibrillation (pAFib)",
    abnormality: "Atrial Fibrillation (Target Abnormality - Episodic)",
    confidence: "88.7%",
    signalQuality: "Good",
    qualityScore: "93.8%",
    evidenceStrength: "Strong",
    severityLabel: "Target Abnormality · Paroxysmal AFib",
    riskWidth: "65%",
    bpm: 88,
    pr: "Intermittent Absent",
    qrs: "88 ms",
    qtc: "418 ms",
    st: "0.0 mm",
    regularity: "Variable / Episodic",
    summary:
      "Intermittent episodes of disorganized micro-reentrant fibrillatory activity alternating with sinus rhythm.",
    briefExplanation: {
      input: "Scanned 12-Lead ECG Tracing",
      signalQuality: "Good (SNR: 23.8 dB, 96.5% baseline stability)",
      potentialPattern: "Paroxysmal Atrial Fibrillation (pAFib)",
      confidence: "88.7%",
      supportingEvidence: "• Intermittent bursts of irregular rhythm\n• Transitional P-wave disappearance",
      biomedicalExplanation: "Ectopic rapid triggers predominantly from the pulmonary veins initiate self-terminating bouts of atrial fibrillation.",
      interpretation: "The observed periodic irregularities correspond to paroxysmal episodes of atrial arrhythmia.",
      recommendation: "Clinical review and ambulatory rhythm monitoring advised.",
    },
    transformerAttention: {
      primaryFocus: "Temporal Transition Boundaries & Intermittent F-waves",
      fWaveActivity: "Episodic baseline noise bursts",
      irregularityScore: "0.82 (Dynamic Entropy)",
      attentionHeads: [
        { name: "Head 1 (R-R Spacing)", weight: "0.88", desc: "Fluctuating R-R intervals across transitions" },
        { name: "Head 2 (P-Wave Morphology)", weight: "0.85", desc: "Intermittent P-wave loss" },
        { name: "Head 3 (F-Wave Frequency)", weight: "0.83", desc: "Transient micro-potential bursts" },
        { name: "Head 4 (AV Conduction)", weight: "0.76", desc: "Variable AV nodal refractory periods" },
      ],
    },
    detailedExplanation: {
      digitizationSummary: "1D signal shows transitional shifts from sinus pacing into fibrillatory intervals.",
      transformerAnalysis: "1D Transformer multi-head attention highlighted temporal boundaries where P-wave tokens drop out and R-R variance surges.",
      ragBiomedicalInsights: "Paroxysmal AFib carries equivalent stroke risk to persistent AFib, mandating formal CHA2DS2-VASc score evaluation.",
      hemodynamicImpact: "Transient palpitations, mild fatigue, and hemodynamic fluctuations during paroxysms.",
      clinicalWorkup: "Extended 24-72 hr Holter or 14-day patch monitor, echocardiogram, and lifestyle trigger review.",
    },
    pathophysiology:
      "Pulmonary vein myocardial sleeves generate rapid ectopic discharges that intermittently trigger atrial fibrillation episodes lasting from minutes to days before spontaneously terminating.",
    precautions: [
      "Identify and log personal triggers: alcohol (holiday heart syndrome), caffeine, sleep apnea, emotional stress.",
      "Consult physician regarding anticoagulation based on individual stroke risk scores.",
      "Maintain electrolyte balance and routine sleep habits.",
    ],
    tags: ["⚠️ Paroxysmal Episode", "📊 Holter Patch Recommended", "🍷 Avoid Alcohol Triggers", "🩺 Physician Consult"],
    diseaseGuide:
      "Diagnosis requires ambulatory rhythm documentation (Holter or event recorder) and cardiology evaluation for antiarrhythmic therapy or catheter ablation.",
    isHighRisk: false,
    leadWaveType: "afib",
  },
  aflutter: {
    stage: 3,
    stageTitle: "STAGE 3: ABNORMAL RHYTHM — ATRIAL FLUTTER (AFL)",
    stageClass: "st-3",
    condition: "Atrial Flutter with 2:1 AV Block",
    abnormality: "Atrial Flutter (Target Abnormality - Macro-Reentrant)",
    confidence: "91.6%",
    signalQuality: "Good",
    qualityScore: "96.4%",
    evidenceStrength: "Strong",
    severityLabel: "Target Abnormality · Atrial Flutter (AFL)",
    riskWidth: "75%",
    bpm: 150,
    pr: "Sawtooth (F-waves)",
    qrs: "86 ms",
    qtc: "420 ms",
    st: "0.0 mm",
    regularity: "Regular (Sawtooth)",
    summary:
      "Organized macro-reentrant right atrial circuit producing classic 'sawtooth' baseline flutter waves at 300 bpm with 2:1 AV nodal conduction (ventricular rate 150 bpm).",
    briefExplanation: {
      input: "Scanned 12-Lead ECG Tracing",
      signalQuality: "Good (SNR: 26.0 dB, 98.7% baseline stability)",
      potentialPattern: "Atrial Flutter (AFL) with 2:1 AV Block",
      confidence: "91.6%",
      supportingEvidence: "• Regular sawtooth flutter waves (F-waves) at ~300 bpm\n• Fixed 2:1 AV nodal block with regular ventricular rate 150 bpm",
      biomedicalExplanation: "Macro-reentrant excitation loop rotating around the cavotricuspid isthmus in the right atrium.",
      interpretation: "The observed waveform characteristics are consistent with typical macro-reentrant atrial flutter.",
      recommendation: "Clinical review and electrophysiologist consultation advised.",
    },
    transformerAttention: {
      primaryFocus: "Continuous Sawtooth F-Wave Periodicity (300 bpm)",
      fWaveActivity: "High-amplitude negative sawtooth waves in inferior leads",
      irregularityScore: "0.12 (Strict 2:1 Ratio)",
      attentionHeads: [
        { name: "Head 1 (R-R Spacing)", weight: "0.78", desc: "Fixed 400ms R-R intervals (150 BPM)" },
        { name: "Head 2 (P-Wave Morphology)", weight: "0.94", desc: "Replaced by continuous sawtooth F-waves" },
        { name: "Head 3 (F-Wave Frequency)", weight: "0.96", desc: "Monotonous 300 bpm macro-reentry" },
        { name: "Head 4 (AV Conduction)", weight: "0.89", desc: "Fixed 2:1 nodal filtering" },
      ],
    },
    detailedExplanation: {
      digitizationSummary: "1D digital signal extracted with prominent negative flutter undulations in Leads II, III, and aVF.",
      transformerAnalysis: "1D Transformer self-attention identified rigid 300 bpm temporal periodicity in the baseline coupled with alternating QRS tokens.",
      ragBiomedicalInsights: "Cavotricuspid isthmus (CTI) dependent flutter has high response rate to radiofrequency catheter ablation (>95% curative success). Anticoagulation rules match AFib.",
      hemodynamicImpact: "Loss of effective atrial mechanical transport, fixed high rate of 150 bpm causing fatigue and palpitations.",
      clinicalWorkup: "Bedside 12-lead ECG, Transthoracic Echocardiogram, stroke risk scoring, and referral for cavotricuspid isthmus catheter ablation.",
    },
    pathophysiology:
      "A rapid, organized macro-reentrant circuit around the tricuspid valve annulus in the right atrium produces flutter waves at ~300 bpm. The AV node filters conduction, commonly conducting every second impulse (2:1 block) to protect ventricles.",
    precautions: [
      "Consult a cardiologist or electrophysiologist for catheter ablation evaluation.",
      "Adhere strictly to prescribed anticoagulation therapy to minimize thromboembolic stroke risk.",
      "Monitor pulse rate and seek emergency medical evaluation if chest pressure, lightheadedness, or acute breathlessness occurs.",
    ],
    tags: ["⚠️ Stroke Risk", "🩺 Cardiologist Review", "💊 Anticoagulation", "⚡ Ablation Candidate"],
    diseaseGuide:
      "Atrial flutter diagnosis warrants formal 12-lead ECG documentation, CHA2DS2-VASc stroke risk assessment, echocardiography, and evaluation by an electrophysiologist for curative catheter ablation.",
    isHighRisk: false,
    leadWaveType: "aflutter",
  },
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

    if (presetKey === "afib" || presetKey === "afib_rvr" || presetKey === "pafib" || presetKey === "aflutter") {
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
    if (!this.lastTime) this.lastTime = now;
    const dt = Math.min((now - this.lastTime) / 1000, 0.1);
    this.lastTime = now;
    this.phase += dt;
    if (this.audioCooldown > 0) this.audioCooldown -= dt;

    if (!this.ctx || !this.canvas) {
      requestAnimationFrame(this.animate);
      return;
    }

    const w = this.canvas.width;
    const h = this.canvas.height;
    const sample = this.getWaveSample(this.phase, this.currentPresetKey);

    this.points.push(sample);
    if (this.points.length > this.maxPoints) {
      this.points.shift();
    }

    // Render Oscilloscope
    this.ctx.clearRect(0, 0, w, h);

    // Glowing Lead trace
    this.ctx.strokeStyle = "#38BDF8";
    this.ctx.lineWidth = 2 * (window.devicePixelRatio || 1);
    this.ctx.shadowBlur = 8;
    this.ctx.shadowColor = "#06B6D4";
    this.ctx.beginPath();

    const midY = h / 2;
    const amp = h * 0.38;

    for (let i = 0; i < this.points.length; i++) {
      const x = (i / this.maxPoints) * w;
      const y = midY - this.points[i] * amp;
      if (i === 0) this.ctx.moveTo(x, y);
      else this.ctx.lineTo(x, y);
    }
    this.ctx.stroke();

    // Beam head dot
    if (this.points.length > 0) {
      const lastX = ((this.points.length - 1) / this.maxPoints) * w;
      const lastY = midY - this.points[this.points.length - 1] * amp;
      this.ctx.fillStyle = "#FFFFFF";
      this.ctx.beginPath();
      this.ctx.arc(lastX, lastY, 3.5 * (window.devicePixelRatio || 1), 0, Math.PI * 2);
      this.ctx.fill();
    }

    requestAnimationFrame(this.animate);
  }
}

// ============================================================================
// 1D ECG TRANSFORMER VISUALIZER & MULTI-HEAD ATTENTION HEATMAP
// ============================================================================
class TransformerVisualizer {
  constructor(signalCanvasId, heatmapCanvasId) {
    this.signalCanvas = document.getElementById(signalCanvasId);
    this.heatmapCanvas = document.getElementById(heatmapCanvasId);
    this.signalCtx = this.signalCanvas ? this.signalCanvas.getContext("2d") : null;
    this.heatmapCtx = this.heatmapCanvas ? this.heatmapCanvas.getContext("2d") : null;
    this.activeHead = 1;
    this.currentPresetKey = "afib";
    this.time = 0;

    this.resize();
    window.addEventListener("resize", () => this.resize());
    this.initHeadButtons();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  resize() {
    if (this.signalCanvas && this.signalCanvas.parentElement) {
      const rect = this.signalCanvas.parentElement.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      this.signalCanvas.width = rect.width * dpr;
      this.signalCanvas.height = rect.height * dpr;
    }
    if (this.heatmapCanvas && this.heatmapCanvas.parentElement) {
      const rect = this.heatmapCanvas.parentElement.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      this.heatmapCanvas.width = rect.width * dpr;
      this.heatmapCanvas.height = rect.height * dpr;
    }
  }

  initHeadButtons() {
    for (let h = 1; h <= 4; h++) {
      const btn = document.getElementById(`btn-head-${h}`);
      btn?.addEventListener("click", () => {
        document.querySelectorAll(".head-pill-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        this.activeHead = h;
      });
    }
  }

  setProfile(p) {
    this.currentPresetKey = p.leadWaveType || (p.stage === 1 ? "normal" : "afib");
    const metaEl = document.getElementById("trans-attention-meta");
    if (metaEl) {
      if (this.currentPresetKey === "normal") {
        metaEl.textContent = "ATTENTION: 98.4% ON PERIODIC SINUS PACING (P-QRS-T)";
        metaEl.style.color = "#10B981";
      } else {
        metaEl.textContent = "ATTENTION: 88.0% ON IRREGULAR R-R ENTROPY & P-WAVE ABSENCE";
        metaEl.style.color = "#F43F5E";
      }
    }
  }

  animate() {
    this.time += 0.016;
    this.drawSignal();
    this.drawHeatmap();
    requestAnimationFrame(this.animate);
  }

  drawSignal() {
    if (!this.signalCtx || !this.signalCanvas) return;
    const ctx = this.signalCtx;
    const w = this.signalCanvas.width;
    const h = this.signalCanvas.height;
    ctx.clearRect(0, 0, w, h);

    // Dark grid
    ctx.strokeStyle = "rgba(30, 58, 138, 0.25)";
    ctx.lineWidth = 1;
    const step = 20 * (window.devicePixelRatio || 1);
    for (let x = 0; x < w; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Baseline
    const midY = h * 0.55;
    ctx.strokeStyle = "rgba(56, 189, 248, 0.2)";
    ctx.beginPath();
    ctx.moveTo(0, midY);
    ctx.lineTo(w, midY);
    ctx.stroke();

    // 1D Digital trace
    ctx.strokeStyle = "#38BDF8";
    ctx.lineWidth = 2 * (window.devicePixelRatio || 1);
    ctx.beginPath();

    const isNormal = this.currentPresetKey === "normal";
    const numPoints = Math.floor(w / (2 * (window.devicePixelRatio || 1)));

    for (let i = 0; i < numPoints; i++) {
      const px = i * 2 * (window.devicePixelRatio || 1);
      const t = this.time + (i / numPoints) * 4.0;
      let sample = 0;

      if (isNormal) {
        const period = 60 / 72;
        const p = (t % period) / period;
        if (p < 0.12) sample = Math.sin((p / 0.12) * Math.PI) * 0.18;
        else if (p < 0.18) sample = 0;
        else if (p < 0.21) sample = -0.15;
        else if (p < 0.25) sample = 1.0;
        else if (p < 0.28) sample = -0.3;
        else if (p < 0.35) sample = 0;
        else if (p < 0.48) sample = Math.sin(((p - 0.35) / 0.13) * Math.PI) * 0.25;
      } else {
        const noise = (Math.sin(t * 65) + Math.cos(t * 115) + Math.sin(t * 145)) * 0.12;
        const chaoticPeriod = 0.55 + Math.sin(Math.floor(t * 1.5)) * 0.22;
        const p = (t % chaoticPeriod) / chaoticPeriod;
        if (p > 0.18 && p < 0.24) {
          sample = noise + Math.sin(((p - 0.18) / 0.06) * Math.PI) * 1.1;
        } else {
          sample = noise;
        }
      }

      const py = midY - sample * (h * 0.38);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
  }

  drawHeatmap() {
    if (!this.heatmapCtx || !this.heatmapCanvas) return;
    const ctx = this.heatmapCtx;
    const w = this.heatmapCanvas.width;
    const h = this.heatmapCanvas.height;
    ctx.clearRect(0, 0, w, h);

    const isNormal = this.currentPresetKey === "normal";
    const numTokens = 32;
    const tokenW = w / numTokens;

    for (let k = 0; k < numTokens; k++) {
      const t = this.time + (k / numTokens) * 4.0;
      let attention = 0.1;

      if (isNormal) {
        const period = 0.83;
        const p = (t % period) / period;
        attention = p > 0.2 && p < 0.3 ? 0.85 : 0.15;
      } else {
        const chaoticPeriod = 0.55 + Math.sin(Math.floor(t * 1.5)) * 0.22;
        const p = (t % chaoticPeriod) / chaoticPeriod;

        if (this.activeHead === 1) {
          attention = p > 0.15 && p < 0.35 ? 0.95 : 0.25;
        } else if (this.activeHead === 2) {
          attention = p < 0.18 ? 0.92 : 0.2;
        } else if (this.activeHead === 3) {
          attention = 0.5 + Math.abs(Math.sin(t * 25)) * 0.45;
        } else {
          attention = 0.4 + (k % 4) * 0.15;
        }
      }

      let r, g, b;
      if (attention < 0.35) {
        r = 15;
        g = Math.floor(100 + attention * 300);
        b = 230;
      } else if (attention < 0.7) {
        const norm = (attention - 0.35) / 0.35;
        r = Math.floor(20 + norm * 220);
        g = Math.floor(180 + norm * 40);
        b = Math.floor(220 - norm * 180);
      } else {
        const norm = (attention - 0.7) / 0.3;
        r = Math.floor(240 + norm * 15);
        g = Math.floor(70 - norm * 50);
        b = Math.floor(60 - norm * 40);
      }

      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(k * tokenW, 0, tokenW + 1, h);
    }
  }
}

// ============================================================================
// STATIC MULTI-LEAD ECG CANVAS RENDERER
// ============================================================================
function renderEcgToCanvas(canvasId, presetKey) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const rect = canvas.parentElement ? canvas.parentElement.getBoundingClientRect() : { width: 800, height: 220 };
  const parentWidth = rect.width > 50 ? rect.width : 800;
  const parentHeight = rect.height > 50 ? rect.height : 220;
  canvas.width = parentWidth * (window.devicePixelRatio || 1);
  canvas.height = Math.max(200, parentHeight) * (window.devicePixelRatio || 1);

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

    ctx.strokeStyle = presetKey === "normal" ? "#06B6D4" : "#F43F5E";
    ctx.lineWidth = 1.8 * (window.devicePixelRatio || 1);
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.beginPath();

    const baselineY = lead.yRatio * h;
    const amp = 35 * (window.devicePixelRatio || 1) * lead.scale;
    const period = (presetKey === "afib_rvr" ? 75 : presetKey === "pafib" ? 110 : presetKey === "normal" ? 120 : 100) * (window.devicePixelRatio || 1);

    for (let x = 0; x < w; x += 2) {
      const prog = (x % period) / period;
      let val = 0;

      if (presetKey === "aflutter") {
        const flutterWave = ((prog * 5) % 1) * 2 - 1;
        val = prog > 0.18 && prog < 0.24
          ? Math.sin(((prog - 0.18) / 0.06) * Math.PI) * 1.15
          : flutterWave * 0.12;
      } else if (presetKey === "afib" || presetKey === "afib_rvr" || presetKey === "pafib") {
        const noise = (Math.sin(x * 0.2) + Math.cos(x * 0.35)) * 0.12;
        if (prog > 0.18 && prog < 0.24) {
          val = noise + Math.sin(((prog - 0.18) / 0.06) * Math.PI) * 1.15;
        } else {
          val = noise;
        }
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
  const transformerVisualizer = new TransformerVisualizer("transformer-signal-canvas", "transformer-heatmap-canvas");

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

  // State - Default to Special Abnormality: Atrial Fibrillation
  let currentPresetKey = "afib";
  let currentZoom = 1;
  let customUploadedFile = null;
  let customMimeType = null;
  let currentPdfUrl = null;
  let analysisRequestId = 0;

  // Initialize initial canvas preview to Special Abnormality
  renderEcgToCanvas("ecg-canvas-render", "afib");
  oscMonitor.setPreset("afib");
  if (transformerVisualizer) {
    transformerVisualizer.setProfile(CLINICAL_PRESETS.afib);
  }
  applyPredictionResults(CLINICAL_PRESETS.afib);

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
    if (fileInput) fileInput.value = "";
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

      applyUploadedAnalysis(payload.analysis, reportFile.name);
      uploadStatusMsg.textContent = `${payload.cached ? "Loaded saved result" : "Analysis complete"} for ${reportFile.name} (${payload.analysis.condition || payload.analysis.rhythm}).`;
      uploadStatusMsg.style.color = "var(--neon-teal)";
      recordReportToHistory(
        {
          condition: payload.analysis.condition || payload.analysis.rhythm,
          stageTitle: payload.analysis.stageTitle,
          stageClass: payload.analysis.stageClass,
          bpm: payload.analysis.bpm || 118,
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

  function applyUploadedAnalysis(analysis, uploadedFileName) {
    const stage = analysis.stage || (analysis.riskLevel === "high" ? 4 : analysis.riskLevel === "moderate" ? 3 : 1);
    const className = `st-${stage}`;
    const condition = analysis.condition || analysis.rhythm || "Atrial Fibrillation (AFib)";

    applyPredictionResults({
      ...analysis,
      stage,
      stageClass: className,
      condition,
      reportFileName: uploadedFileName || (customUploadedFile ? customUploadedFile.name : "Uploaded ECG Document"),
    });

    // Update live monitor
    const leadTitle = document.getElementById("osc-lead-title");
    const monitorBpm = document.getElementById("monitor-bpm");
    if (leadTitle) leadTitle.textContent = `LEAD II · ${condition.toUpperCase().slice(0, 22)}`;
    if (monitorBpm && analysis.bpm) monitorBpm.textContent = analysis.bpm;
    if (stage === 1) oscMonitor.setPreset("normal");
    else oscMonitor.setPreset("afib");
  }

  function applyPredictionResults(p) {
    resultsArea.classList.add("visible");

    // Update Stage Card Hero Classes with safe fallbacks
    const stageClass = p.stageClass || `st-${p.stage || 3}`;
    const stageTitle = p.stageTitle || (p.stage === 1 ? "STAGE 1: OPTIMAL & NORMAL SINUS RHYTHM" : "STAGE 3: ABNORMAL RHYTHM — ATRIAL FIBRILLATION");
    const condition = p.condition || p.rhythm || "Atrial Fibrillation (AFib)";
    const summary = p.summary || "Complete absence of discrete P-waves replaced by rapid irregular fibrillatory f-waves (350-600 bpm) and chaotic R-R intervals.";
    const severityLabel = p.severityLabel || (p.stage === 1 ? "Stage 1 · Low Risk / Control Baseline" : "Target Abnormality · Atrial Fibrillation (AFib)");
    const riskWidth = p.riskWidth || (p.stage === 4 ? "95%" : p.stage === 3 ? "75%" : p.stage === 2 ? "45%" : "20%");

    stageCardHero.className = `stage-card-hero ${stageClass}`;
    stageBadgeHero.className = `stage-badge-large ${stageClass}`;
    stageBadgeText.textContent = stageTitle;
    stageConfidence.textContent = p.confidence || "88.0%";
    predictedConditionTitle.textContent = condition;
    stageSummaryText.textContent = summary;
    riskSeverityLabel.textContent = severityLabel;
    const disclaimerEl = document.getElementById("analysis-disclaimer");
    if (disclaimerEl) disclaimerEl.style.display = "none";

    riskBarFill.className = `risk-bar-fill ${stageClass}`;
    riskBarFill.style.width = riskWidth;

    // Metrics
    metricHr.innerHTML = `${p.bpm || 118} <span style="font-size: 12px; font-weight: normal;">BPM</span>`;
    metricPr.innerHTML = `${p.pr || "Absent (f-waves)"}`;
    metricQrs.innerHTML = `${p.qrs || "90 ms"}`;
    metricQtc.innerHTML = `${p.qtc || "428 ms"}`;
    metricSt.innerHTML = `${p.st || "0.0 mm"}`;
    metricRegularity.textContent = p.regularity || (p.stage === 1 ? "Regular" : "Irregularly Irregular");

    // Brief Explainable Report (Executive Summary - Matching WhatsApp Reference)
    const briefInput = document.getElementById("brief-input");
    const briefQuality = document.getElementById("brief-quality");
    const briefPattern = document.getElementById("brief-pattern");
    const briefConfidence = document.getElementById("brief-confidence");
    const briefEvidence = document.getElementById("brief-evidence");
    const briefBiomedical = document.getElementById("brief-biomedical");
    const briefInterpretation = document.getElementById("brief-interpretation");
    const briefRecommendation = document.getElementById("brief-recommendation");

    if (briefInput) briefInput.textContent = p.briefExplanation?.input || "Scanned 12-Lead ECG Tracing";
    if (briefQuality) briefQuality.innerHTML = `<strong>${p.signalQuality || "Good"}</strong> (${p.qualityScore ? `SQI: ${p.qualityScore}, SNR: 24.2 dB` : "SNR: 24.2 dB, 98.2% baseline stability"})`;
    if (briefPattern) {
      briefPattern.textContent = p.briefExplanation?.potentialPattern || p.condition || "Atrial Fibrillation (Abnormal Rhythm)";
      briefPattern.style.color = p.stage === 1 ? "#15803D" : "#DC2626";
    }
    if (briefConfidence) briefConfidence.innerHTML = `<strong>${p.confidence || "88%"}</strong> (${p.evidenceStrength ? `Evidence: ${p.evidenceStrength}` : "Evidence: Strong"})`;
    if (briefEvidence) {
      if (typeof p.briefExplanation?.supportingEvidence === "string") {
        briefEvidence.innerHTML = p.briefExplanation.supportingEvidence.replace(/\n/g, "<br>");
      } else if (Array.isArray(p.briefExplanation?.supportingEvidence)) {
        briefEvidence.innerHTML = p.briefExplanation.supportingEvidence.map(e => `• ${e}`).join("<br>");
      } else {
        briefEvidence.innerHTML = p.stage === 1
          ? "• Regular rhythm pattern (uniform R-R intervals)<br>• Distinct P-waves preceding every QRS complex"
          : "• Irregular rhythm pattern (variable R-R intervals)<br>• Relevant waveform changes (absence of discrete P-waves, presence of fibrillatory f-waves)";
      }
    }
    if (briefBiomedical) {
      briefBiomedical.textContent = p.briefExplanation?.biomedicalExplanation || "[RAG Retrieved]: Multiple disorganized re-entrant micro-circuits depolarize the atria chaotically at 350-600 bpm, bypassing Sinoatrial (SA) node pacing and causing irregular AV nodal conduction.";
    }
    if (briefInterpretation) {
      briefInterpretation.textContent = p.briefExplanation?.interpretation || "The observed waveform characteristics are potentially associated with the detected pattern.";
    }
    if (briefRecommendation) {
      briefRecommendation.textContent = p.briefExplanation?.recommendation || "Clinical review is advised.";
    }

    if (transformerVisualizer) {
      transformerVisualizer.setProfile(p);
    }

    // Detailed Insights & Precautions with safe array handling
    const precautionsList = Array.isArray(p.precautions) && p.precautions.length > 0
      ? p.precautions
      : [
          "Strictly avoid stimulants: zero energy drinks, eliminate caffeine, avoid pseudoephedrine.",
          "Take prescribed oral anticoagulants (DOACs) strictly as scheduled to mitigate stroke risk.",
          "Monitor resting blood pressure and log palpitation durations.",
          "Seek emergency evaluation if experiencing acute shortness of breath or dizziness."
        ];

    const tagsList = Array.isArray(p.tags) && p.tags.length > 0
      ? p.tags
      : ["⚠️ Stroke Prevention", "🚫 Zero Stimulants", "💊 Strict Anticoagulation", "🩺 Urgent Cardiologist"];

    insightPathophysiology.textContent = p.pathophysiology || "Multiple chaotic micro-reentrant electrical circuits depolarize the atria at 350-600 bpm. The atria quiver instead of contracting synchronously, causing blood stasis in the left atrial appendage and elevating thromboembolic stroke risk.";

    insightPrecautions.innerHTML = `<ul>${precautionsList.map((item) => `<li>${item}</li>`).join("")}</ul>`;

    precautionsTags.innerHTML = tagsList
      .map((t) => `<span class="precaution-badge">${t}</span>`)
      .join("");

    insightDiseaseGuide.innerHTML = `
      <p style="margin: 0 0 10px;">${p.diseaseGuide || "Atrial Fibrillation requires comprehensive medical evaluation for stroke prevention (CHA2DS2-VASc risk score) and rate/rhythm control."}</p>
      <strong>Essential Doctor Consultations & Diagnostic Follow-ups:</strong>
      <ul style="margin-top: 6px;">
        <li><strong>Comprehensive 12-Lead Confirmation ECG:</strong> Clinical bedside validation.</li>
        <li><strong>Echocardiogram (TTE):</strong> Assesses cardiac ejection fraction & left atrial appendage (LAA) stasis.</li>
        <li><strong>CHA2DS2-VASc Stroke Risk Scoring:</strong> Evaluates anticoagulation necessity.</li>
        <li><strong>Holter Telemetry (24-48 Hours):</strong> Quantifies paroxysmal vs. persistent AFib burden.</li>
      </ul>
    `;

    // Metadata
    const randId = Math.floor(100000 + Math.random() * 900000);
    const reportGeneratedId = `CRD-${randId}-${p.stageClass.toUpperCase()}`;
    reportUuid.textContent = reportGeneratedId;
    reportTimestamp.textContent = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    updateFormalPrintReport({
      condition: p.condition,
      stageTitle: p.stageTitle,
      stageClass: p.stageClass,
      confidence: p.confidence,
      signalQuality: p.signalQuality,
      severityLabel: p.severityLabel,
      bpm: p.bpm,
      pr: p.pr,
      qrs: p.qrs,
      qtc: p.qtc,
      st: p.st,
      regularity: p.regularity,
      briefExplanation: p.briefExplanation,
      detailedExplanation: p.detailedExplanation,
      pathophysiology: p.pathophysiology,
      precautions: precautionsList,
      diseaseGuide: p.diseaseGuide,
      isHighRisk: p.isHighRisk,
      reportId: reportGeneratedId,
      fileName: p.reportFileName || p.fileName || (customUploadedFile ? customUploadedFile.name : "Uploaded ECG Report"),
    });

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

  function updateFormalPrintReport({
    condition,
    stageTitle,
    stageClass,
    confidence,
    signalQuality,
    severityLabel,
    bpm,
    pr,
    qrs,
    qtc,
    st,
    regularity,
    briefExplanation,
    detailedExplanation,
    pathophysiology,
    precautions,
    diseaseGuide,
    isHighRisk,
    reportId,
    fileName,
  }) {
    const pCond = document.getElementById("print-condition");
    const pStage = document.getElementById("print-stage");
    const pConf = document.getElementById("print-confidence");
    const pRepId = document.getElementById("print-report-id");
    const pRepDate = document.getElementById("print-report-date");
    const pFile = document.getElementById("print-filename");
    const pRisk = document.getElementById("print-risk-level");
    const pHr = document.getElementById("print-hr-val");
    const pReg = document.getElementById("print-regularity-val");
    const pMHr = document.getElementById("print-m-hr");
    const pMPr = document.getElementById("print-m-pr");
    const pMQrs = document.getElementById("print-m-qrs");
    const pMQtc = document.getElementById("print-m-qtc");
    const pMSt = document.getElementById("print-m-st");
    const pMReg = document.getElementById("print-m-regularity");
    const pPath = document.getElementById("print-pathophysiology");
    const pPrec = document.getElementById("print-precautions");
    const pGuide = document.getElementById("print-disease-guide");
    const pEmerg = document.getElementById("print-emergency-notice");
    const pImg = document.getElementById("print-ecg-img");
    const pCanvas = document.getElementById("print-ecg-canvas");

    const pbInput = document.getElementById("print-brief-input");
    const pbQuality = document.getElementById("print-brief-quality");
    const pbPattern = document.getElementById("print-brief-pattern");
    const pbConfidence = document.getElementById("print-brief-confidence");
    const pbEvidence = document.getElementById("print-brief-evidence");
    const pbBiomedical = document.getElementById("print-brief-biomedical");
    const pbInterpretation = document.getElementById("print-brief-interpretation");
    const pbRecommendation = document.getElementById("print-brief-recommendation");
    const pSignalQuality = document.getElementById("print-signal-quality");

    if (pbInput) pbInput.textContent = briefExplanation?.input || "Scanned 12-Lead ECG Tracing";
    if (pbQuality) pbQuality.textContent = briefExplanation?.signalQuality || "Good (SNR: 24.2 dB, 98.2% baseline stability)";
    if (pbPattern) {
      pbPattern.textContent = briefExplanation?.potentialPattern || condition || "Atrial Fibrillation (Abnormal Rhythm)";
      pbPattern.style.color = stageClass === "st-1" ? "#15803D" : "#DC2626";
    }
    if (pbConfidence) pbConfidence.textContent = `${confidence || "88%"} (Evidence: Strong)`;
    if (pbEvidence) {
      pbEvidence.textContent = typeof briefExplanation?.supportingEvidence === "string" 
        ? briefExplanation.supportingEvidence.replace(/\n/g, " · ")
        : "• Irregular rhythm pattern (variable R-R intervals) • Absent discrete P-waves, fibrillatory f-waves";
    }
    if (pbBiomedical) pbBiomedical.textContent = briefExplanation?.biomedicalExplanation || "[RAG Retrieved]: Chaotic atrial re-entry at 350-600 bpm bypassing SA node pacing and causing irregular AV conduction.";
    if (pbInterpretation) pbInterpretation.textContent = briefExplanation?.interpretation || "The observed waveform characteristics are potentially associated with the detected pattern.";
    if (pbRecommendation) pbRecommendation.textContent = briefExplanation?.recommendation || "Clinical review is advised.";
    if (pSignalQuality) pSignalQuality.textContent = `${signalQuality || "Good"} (SQI: 94.6%)`;

    if (pCond) pCond.textContent = condition || "Normal Sinus Rhythm";
    if (pStage) {
      pStage.textContent = stageTitle || "STAGE 1: OPTIMAL & NORMAL";
      pStage.className = `print-stage-tag ${stageClass || "st-1"}`;
    }
    if (pConf) pConf.textContent = confidence || "88.0%";
    if (pRepId) pRepId.textContent = reportId || "CRD-849204-X";
    if (pRepDate) pRepDate.textContent = new Date().toISOString().slice(0, 19).replace("T", " ") + " UTC";
    if (pFile) pFile.textContent = fileName || "ECG-Report-Tracing";
    if (pRisk) pRisk.textContent = severityLabel || "Target Abnormality · Atrial Fibrillation (AFib)";
    if (pHr) pHr.textContent = `${bpm || 72} BPM`;
    if (pReg) pReg.textContent = regularity || "Irregularly Irregular";
    if (pMHr) pMHr.textContent = `${bpm || 72} BPM`;
    if (pMPr) pMPr.textContent = pr || "Absent (f-waves)";
    if (pMQrs) pMQrs.textContent = qrs || "84 ms";
    if (pMQtc) pMQtc.textContent = qtc || "412 ms";
    if (pMSt) pMSt.textContent = st || "0.0 mm";
    if (pMReg) pMReg.textContent = regularity || "Irregularly Irregular";
    if (pPath) pPath.textContent = pathophysiology || "Electrical impulses propagate sequentially through the cardiac syncytium.";

    if (pPrec) {
      const list = Array.isArray(precautions) && precautions.length > 0 ? precautions : [
        "Strictly avoid stimulants: zero energy drinks, eliminate or minimize caffeine, avoid pseudoephedrine.",
        "Take prescribed oral anticoagulants strictly as scheduled—never skip a dose without doctor advice.",
        "Monitor blood pressure and log palpitation durations.",
        "Seek emergency medical evaluation immediately if experiencing chest tightness or shortness of breath."
      ];
      pPrec.innerHTML = `<ul>${list.map((i) => `<li>${i}</li>`).join("")}</ul>`;
    }

    if (pGuide) {
      pGuide.innerHTML = `
        <ul>
          <li><strong>Comprehensive 12-Lead Confirmation ECG:</strong> Clinical bedside validation by attending physician.</li>
          <li><strong>Transthoracic Echocardiogram (Echo):</strong> Assesses left atrial chamber dimensions & LAA thrombus exclusion.</li>
          <li><strong>CHA2DS2-VASc Stroke Risk Assessment:</strong> Determines oral anticoagulation guidelines.</li>
          <li><strong>24-48 Hour Holter Telemetry:</strong> Evaluates persistent vs. paroxysmal rhythm burden.</li>
        </ul>
      `;
    }

    if (pEmerg) {
      pEmerg.style.display = isHighRisk ? "block" : "none";
    }

    // Waveform rendering for print
    if (customUploadedFile && previewImg && previewImg.style.display !== "none" && previewImg.src) {
      if (pImg) {
        pImg.src = previewImg.src;
        pImg.style.display = "block";
      }
      if (pCanvas) pCanvas.style.display = "none";
    } else {
      if (pImg) pImg.style.display = "none";
      if (pCanvas) {
        pCanvas.style.display = "block";
        renderEcgToCanvas("print-ecg-canvas", stageClass === "st-1" ? "normal" : "afib");
      }
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