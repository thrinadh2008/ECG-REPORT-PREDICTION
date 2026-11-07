import os
import math
import wave
import struct
import subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFont
import imageio_ffmpeg

# Paths & Setup
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
OUTPUT_MP4 = os.path.join(BASE_DIR, "cardioai_instagram_post.mp4")
TEMP_WAV = os.path.join(BASE_DIR, "temp_heartbeat.wav")
ECG_STRIP_PATH = os.path.join(BASE_DIR, "extracted_page_1.png")

# Video Constants
WIDTH = 1080
HEIGHT = 1920
FPS = 30
DURATION_SEC = 18.0
TOTAL_FRAMES = int(FPS * DURATION_SEC) # 540 frames

# Fonts
def get_font(name, size):
    font_path = os.path.join(r"C:\Windows\Fonts", name)
    if os.path.exists(font_path):
        return ImageFont.truetype(font_path, size)
    return ImageFont.load_default()

FONT_TITLE_XL = get_font("segoeuib.ttf", 64)
FONT_TITLE_LG = get_font("segoeuib.ttf", 46)
FONT_TITLE_MD = get_font("segoeuib.ttf", 36)
FONT_BOLD_SM = get_font("segoeuib.ttf", 26)
FONT_REG_MD = get_font("segoeui.ttf", 30)
FONT_REG_SM = get_font("segoeui.ttf", 24)
FONT_MONO_LG = get_font("consola.ttf", 38)
FONT_MONO_MD = get_font("consola.ttf", 28)
FONT_MONO_SM = get_font("consola.ttf", 22)

# Load ECG Strip Image if available
ecg_strip_img = None
if os.path.exists(ECG_STRIP_PATH):
    try:
        raw_ecg = Image.open(ECG_STRIP_PATH).convert("RGBA")
        # Invert or enhance for dark medical HUD look
        ecg_w, ecg_h = raw_ecg.size
        # Crop center portion
        crop_box = (int(ecg_w * 0.05), int(ecg_h * 0.1), int(ecg_w * 0.95), int(ecg_h * 0.9))
        cropped = raw_ecg.crop(crop_box)
        # Resize to fit in card
        target_w = 920
        target_h = int(cropped.size[1] * (target_w / cropped.size[0]))
        ecg_strip_img = cropped.resize((target_w, target_h), Image.Resampling.LANCZOS)
    except Exception as e:
        print(f"Warning: could not load ecg strip image: {e}")

# Audio Generator: Generates synchronized heartbeat telemetry + ambient sci-fi hum + laser sweeps
def generate_audio(wav_path, duration=18.0, sample_rate=44100):
    total_samples = int(duration * sample_rate)
    audio_data = np.zeros(total_samples, dtype=np.float32)

    # 1. Background soft ambient drone (55 Hz + 110 Hz)
    t = np.linspace(0, duration, total_samples, endpoint=False)
    drone = 0.05 * np.sin(2 * np.pi * 55 * t) + 0.03 * np.sin(2 * np.pi * 110 * t)
    audio_data += drone

    # 2. Cardiac Telemetry Beep (every 0.8s = 75 BPM)
    beat_interval = 0.8
    num_beats = int(duration / beat_interval)
    
    for i in range(num_beats):
        beat_start_time = i * beat_interval
        start_idx = int(beat_start_time * sample_rate)
        
        # Dual-frequency medical monitor beep (880 Hz & 1760 Hz harmonic, duration 0.08s)
        beep_len = int(0.08 * sample_rate)
        if start_idx + beep_len < total_samples:
            bt = np.linspace(0, 0.08, beep_len, endpoint=False)
            envelope = np.exp(-bt * 35) # exponential decay
            beep = 0.28 * (np.sin(2 * np.pi * 880 * bt) + 0.5 * np.sin(2 * np.pi * 1760 * bt)) * envelope
            audio_data[start_idx:start_idx + beep_len] += beep
            
        # Thump (lub-dub heart sound)
        thump_len = int(0.12 * sample_rate)
        if start_idx + thump_len < total_samples:
            tt = np.linspace(0, 0.12, thump_len, endpoint=False)
            t_env = np.sin(np.pi * tt / 0.12) ** 2
            thump = 0.35 * np.sin(2 * np.pi * 55 * tt) * t_env
            audio_data[start_idx:start_idx + thump_len] += thump

    # 3. Whoosh sweeps at scene boundaries (3.5s, 7.5s, 11.5s, 15.0s)
    transitions = [3.5, 7.5, 11.5, 15.0]
    for tr in transitions:
        tr_idx = int(tr * sample_rate)
        sw_len = int(0.4 * sample_rate)
        if tr_idx + sw_len < total_samples:
            st = np.linspace(0, 0.4, sw_len, endpoint=False)
            freq = np.linspace(200, 1200, sw_len)
            phase = 2 * np.pi * np.cumsum(freq) / sample_rate
            sw_env = np.sin(np.pi * st / 0.4)
            whoosh = 0.18 * np.sin(phase) * sw_env
            audio_data[tr_idx:tr_idx + sw_len] += whoosh

    # Normalize to prevent clipping
    max_amp = np.max(np.abs(audio_data))
    if max_amp > 0:
        audio_data = audio_data / max_amp * 0.88

    # Convert to 16-bit PCM WAV
    int_audio = (audio_data * 32767).astype(np.int16)
    with wave.open(wav_path, "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sample_rate)
        wf.writeframes(int_audio.tobytes())
    print(f"Generated audio: {wav_path}")

# Helper: Draw rounded rectangle with border & optional glow
def draw_card(draw, bbox, fill=(15, 23, 42), outline=(37, 99, 235), radius=28, border_w=2):
    x0, y0, x1, y1 = bbox
    # Draw background
    draw.rounded_rectangle([x0, y0, x1, y1], radius=radius, fill=fill, outline=outline, width=border_w)

# Helper: Draw Medical Background Grid
def draw_medical_grid(draw, w, h, step=40, major_step=200):
    # Minor lines
    for x in range(0, w, step):
        col = (18, 30, 55) if x % major_step != 0 else (28, 55, 95)
        w_line = 1 if x % major_step != 0 else 2
        draw.line([(x, 0), (x, h)], fill=col, width=w_line)
    for y in range(0, h, step):
        col = (18, 30, 55) if y % major_step != 0 else (28, 55, 95)
        w_line = 1 if y % major_step != 0 else 2
        draw.line([(0, y), (w, y)], fill=col, width=w_line)

# Helper: Lead II ECG wave calculation
def get_ecg_point(phase, amp=1.0):
    # phase in [0, 1)
    p = phase % 1.0
    val = 0.0
    if 0.15 <= p < 0.25: # P wave
        val = 0.18 * math.sin((p - 0.15) / 0.10 * math.pi)
    elif 0.35 <= p < 0.38: # Q dip
        val = -0.22 * math.sin((p - 0.35) / 0.03 * math.pi)
    elif 0.38 <= p < 0.44: # R spike
        val = 1.0 * math.sin((p - 0.38) / 0.06 * math.pi)
    elif 0.44 <= p < 0.48: # S dip
        val = -0.35 * math.sin((p - 0.44) / 0.04 * math.pi)
    elif 0.55 <= p < 0.75: # T wave
        val = 0.32 * math.sin((p - 0.55) / 0.20 * math.pi)
    return val * amp

# Main Frame Generator
def render_frame(frame_idx):
    t = frame_idx / FPS # seconds
    img = Image.new("RGB", (WIDTH, HEIGHT), (8, 14, 28))
    draw = ImageDraw.Draw(img)

    # 1. Subtle medical telemetry background grid
    draw_medical_grid(draw, WIDTH, HEIGHT, step=40, major_step=200)

    # 2. Instagram Header Bar (Top Bar)
    draw_card(draw, (40, 40, WIDTH - 40, 150), fill=(12, 20, 38), outline=(30, 58, 138), radius=22, border_w=2)
    # Profile avatar circle
    draw.ellipse([65, 60, 125, 120], fill=(37, 99, 235), outline=(6, 182, 212), width=3)
    draw.text((82, 72), "🫀", fill=(255, 255, 255), font=FONT_TITLE_MD)
    
    # Handle & Verification Badge
    draw.text((145, 65), "cardioai.studio", fill=(255, 255, 255), font=FONT_BOLD_SM)
    # Verified badge (blue check)
    draw.text((320, 68), "✔", fill=(6, 182, 212), font=FONT_BOLD_SM)
    draw.text((145, 100), "CardioAI • Clinical Diagnostic Studio • Open-Source", fill=(148, 163, 184), font=FONT_MONO_SM)

    # Live pulse indicator on top right
    pulse_dot_color = (16, 185, 129) if (int(t * 4) % 2 == 0) else (6, 182, 212)
    draw.ellipse([WIDTH - 210, 85, WIDTH - 192, 103], fill=pulse_dot_color)
    draw.text((WIDTH - 180, 80), "LIVE AI", fill=(16, 185, 129), font=FONT_BOLD_SM)

    # 3. Determine Active Scene
    # Scene 1: 0.0s - 3.5s (Frames 0 - 105) -> The Hook
    # Scene 2: 3.5s - 7.5s (Frames 106 - 225) -> Instant ECG Ingestion & AI Scanning
    # Scene 3: 7.5s - 11.5s (Frames 226 - 345) -> 4-Stage Risk Stratification & Benchmarks
    # Scene 4: 11.5s - 15.0s (Frames 346 - 450) -> Hospital-Grade Clinical Summary Report
    # Scene 5: 15.0s - 18.0s (Frames 451 - 540) -> Outro & Instagram CTA

    if t < 3.5:
        # ==========================================
        # SCENE 1: THE VIRAL HOOK (0.0s - 3.5s)
        # ==========================================
        progress = t / 3.5
        
        # Flashing Alert Tag
        draw_card(draw, (80, 200, WIDTH - 80, 270), fill=(45, 15, 25), outline=(239, 68, 68), radius=20, border_w=2)
        draw.text((110, 218), "🚨 HEALTH-TECH INNOVATION 2026", fill=(248, 113, 113), font=FONT_BOLD_SM)
        
        # Giant Headline
        draw.text((80, 310), "CAN AN AI SYSTEM", fill=(255, 255, 255), font=FONT_TITLE_XL)
        draw.text((80, 395), "CATCH A HEART ATTACK", fill=(6, 182, 212), font=FONT_TITLE_XL)
        draw.text((80, 480), "IN 3 SECONDS? 🫀⚡", fill=(248, 113, 113), font=FONT_TITLE_XL)
        
        # Dynamic Oscilloscope Telemetry Monitor Box
        draw_card(draw, (80, 580, WIDTH - 80, 1180), fill=(10, 18, 35), outline=(37, 99, 235), radius=32, border_w=3)
        draw.text((120, 615), "REALTIME LEAD II TELEMETRY OSCILLOSCOPE", fill=(148, 163, 184), font=FONT_MONO_SM)
        draw.text((WIDTH - 300, 615), "GAIN: 10mm/mV", fill=(6, 182, 212), font=FONT_MONO_SM)

        # Draw Live Animated Oscilloscope Waveform inside the box
        center_y = 880
        wave_w = WIDTH - 240
        start_x = 120
        wave_pts = []
        lead_phase = (t * 1.25) # 75 BPM rhythm
        
        for px in range(0, wave_w, 4):
            x = start_x + px
            p = (lead_phase + px / wave_w * 2.5) % 1.0
            val = get_ecg_point(p, amp=160)
            wave_pts.append((x, center_y - val))

        # Draw glowing wave
        if len(wave_pts) > 1:
            # Glow layer (wider, transparent cyan)
            draw.line(wave_pts, fill=(6, 182, 212), width=5)
            # Core bright white-cyan line
            draw.line(wave_pts, fill=(230, 255, 255), width=2)

        # Glowing moving tracer head
        tracer_x = start_x + int((t * 280) % wave_w)
        tracer_p = (lead_phase + (tracer_x - start_x) / wave_w * 2.5) % 1.0
        tracer_y = center_y - get_ecg_point(tracer_p, amp=160)
        draw.ellipse([tracer_x - 14, tracer_y - 14, tracer_x + 14, tracer_y + 14], fill=(6, 182, 212))
        draw.ellipse([tracer_x - 7, tracer_y - 7, tracer_x + 7, tracer_y + 7], fill=(255, 255, 255))

        # Metric Badges inside the Scope
        metrics_y = 1040
        draw_card(draw, (110, metrics_y, 350, metrics_y + 100), fill=(15, 28, 55), outline=(30, 58, 138), radius=16, border_w=1)
        draw.text((130, metrics_y + 15), "HEART RATE", fill=(148, 163, 184), font=FONT_MONO_SM)
        draw.text((130, metrics_y + 45), "78 BPM", fill=(16, 185, 129), font=FONT_TITLE_MD)

        draw_card(draw, (380, metrics_y, 640, metrics_y + 100), fill=(15, 28, 55), outline=(30, 58, 138), radius=16, border_w=1)
        draw.text((400, metrics_y + 15), "RHYTHM", fill=(148, 163, 184), font=FONT_MONO_SM)
        draw.text((400, metrics_y + 45), "SINUS", fill=(6, 182, 212), font=FONT_TITLE_MD)

        draw_card(draw, (670, metrics_y, 970, metrics_y + 100), fill=(15, 28, 55), outline=(30, 58, 138), radius=16, border_w=1)
        draw.text((690, metrics_y + 15), "QTc INTERVAL", fill=(148, 163, 184), font=FONT_MONO_SM)
        draw.text((690, metrics_y + 45), "412 ms", fill=(255, 255, 255), font=FONT_TITLE_MD)

        # Bottom Teaser Card
        draw_card(draw, (80, 1230, WIDTH - 80, 1480), fill=(15, 23, 42), outline=(37, 99, 235), radius=28, border_w=2)
        draw.text((120, 1260), "Introducing CardioAI Studio", fill=(6, 182, 212), font=FONT_TITLE_MD)
        draw.text((120, 1320), "Automated 12-lead ECG analysis powered by", fill=(226, 232, 240), font=FONT_REG_MD)
        draw.text((120, 1370), "Deep-Vision Models & Clinical Rule Engines.", fill=(148, 163, 184), font=FONT_REG_MD)

        # Action Tag
        draw_card(draw, (80, 1540, WIDTH - 80, 1660), fill=(37, 99, 235), outline=(6, 182, 212), radius=24, border_w=2)
        draw.text((220, 1575), "SWIPE TO SEE SYSTEM WORKFLOW ➔", fill=(255, 255, 255), font=FONT_TITLE_MD)

    elif t < 7.5:
        # ==========================================
        # SCENE 2: INSTANT ECG INGESTION & AI SCAN (3.5s - 7.5s)
        # ==========================================
        scene_t = t - 3.5
        
        # Step Indicator
        draw_card(draw, (80, 200, WIDTH - 80, 270), fill=(15, 35, 60), outline=(6, 182, 212), radius=20, border_w=2)
        draw.text((110, 218), "STEP 1: MULTI-FORMAT ECG INGESTION", fill=(6, 182, 212), font=FONT_BOLD_SM)

        # Headline
        draw.text((80, 300), "DROP ANY 12-LEAD ECG", fill=(255, 255, 255), font=FONT_TITLE_XL)
        draw.text((80, 380), "PDF, Phone Photo, Scan, or Printout", fill=(148, 163, 184), font=FONT_REG_MD)

        # ECG Ingestion & Scanning Display Card
        card_bbox = (80, 450, WIDTH - 80, 1320)
        draw_card(draw, card_bbox, fill=(10, 18, 35), outline=(37, 99, 235), radius=32, border_w=3)
        draw.text((120, 480), "INPUT: sample_report.pdf (12-Lead Standard ECG)", fill=(6, 182, 212), font=FONT_MONO_SM)

        # Render actual ECG Strip inside card
        if ecg_strip_img:
            strip_x = 100
            strip_y = 530
            img.paste(ecg_strip_img.convert("RGB"), (strip_x, strip_y))
            
            # Cyan Laser Scanning Bar moving vertically across the ECG strip
            scan_cycle = (scene_t * 0.75) % 1.0 # 0 to 1
            laser_y = int(strip_y + scan_cycle * (ecg_strip_img.size[1]))
            # Laser glow
            draw.rectangle([strip_x, laser_y - 8, strip_x + ecg_strip_img.size[0], laser_y + 8], fill=(6, 182, 212))
            draw.line([(strip_x, laser_y), (strip_x + ecg_strip_img.size[0], laser_y)], fill=(255, 255, 255), width=3)
            
            # Target Reticles
            reticle_x = strip_x + int(ecg_strip_img.size[0] * 0.4)
            draw.rectangle([reticle_x - 60, laser_y - 40, reticle_x + 60, laser_y + 40], outline=(239, 68, 68), width=2)
            draw.text((reticle_x + 70, laser_y - 20), "DETECTING LEAD V2...", fill=(239, 68, 68), font=FONT_MONO_SM)

        # Realtime Inspection Tool Badges
        draw.text((120, 1080), "CLINICAL VISION PREPROCESSING:", fill=(148, 163, 184), font=FONT_BOLD_SM)
        tools = ["✓ Millimeter Grid Overlay", "✓ High-Contrast Inversion", "✓ 4x Precision Zoom", "✓ Noise Filter"]
        for idx, tool in enumerate(tools):
            tx = 120 + (idx % 2) * 440
            ty = 1140 + (idx // 2) * 60
            draw.text((tx, ty), tool, fill=(16, 185, 129), font=FONT_REG_MD)

        # Bottom Callout Card
        draw_card(draw, (80, 1380, WIDTH - 80, 1660), fill=(15, 23, 42), outline=(6, 182, 212), radius=28, border_w=2)
        draw.text((120, 1415), "Instant Digital Extraction", fill=(255, 255, 255), font=FONT_TITLE_MD)
        draw.text((120, 1475), "Extracts voltage offsets, PR intervals, QRS width,", fill=(226, 232, 240), font=FONT_REG_MD)
        draw.text((120, 1525), "and ST-segment elevation across all 12 leads in < 1s.", fill=(148, 163, 184), font=FONT_REG_MD)
        draw.text((120, 1590), "⚡ Latency: 0.84 seconds | Confidence: 98.4%", fill=(6, 182, 212), font=FONT_MONO_MD)

    elif t < 11.5:
        # ==========================================
        # SCENE 3: 4-STAGE RISK STRATIFICATION & BENCHMARKS (7.5s - 11.5s)
        # ==========================================
        scene_t = t - 7.5

        # Step Indicator
        draw_card(draw, (80, 200, WIDTH - 80, 270), fill=(15, 35, 60), outline=(245, 158, 11), radius=20, border_w=2)
        draw.text((110, 218), "STEP 2: 4-STAGE CLINICAL TRIAGE & BENCHMARKS", fill=(245, 158, 11), font=FONT_BOLD_SM)

        # Headline
        draw.text((80, 300), "AUTOMATED RISK STRATIFICATION", fill=(255, 255, 255), font=FONT_TITLE_LG)
        draw.text((80, 365), "From Optimal Sinus Rhythm to Critical STEMI", fill=(148, 163, 184), font=FONT_REG_MD)

        # 4 Stage Cards
        stages = [
            ("STAGE 1: OPTIMAL", "Normal Sinus Rhythm (60-100 BPM)", (16, 185, 129), (12, 35, 25)),
            ("STAGE 2: MONITOR", "Sinus Bradycardia (<60 BPM)", (6, 182, 212), (12, 30, 45)),
            ("STAGE 3: URGENT", "Atrial Fibrillation (Irregular RR)", (245, 158, 11), (45, 32, 10)),
            ("STAGE 4: CRITICAL", "Acute Anterior-Inferior STEMI 🚨", (239, 68, 68), (55, 15, 20)),
        ]

        card_start_y = 440
        card_h = 135
        for i, (stg_name, stg_desc, col, bg_col) in enumerate(stages):
            cy = card_start_y + i * (card_h + 20)
            is_active = (i == 3) # highlight ST-elevation STEMI
            border_col = col if is_active else (30, 58, 138)
            border_w = 3 if is_active else 1
            draw_card(draw, (80, cy, WIDTH - 80, cy + card_h), fill=bg_col, outline=border_col, radius=24, border_w=border_w)
            
            # Badge icon
            draw.text((120, cy + 25), stg_name, fill=col, font=FONT_BOLD_SM)
            draw.text((120, cy + 70), stg_desc, fill=(241, 245, 249), font=FONT_REG_MD)
            
            # Status tag
            status_text = "EMERGENCY 🚨" if i == 3 else "BENCHMARK"
            draw.text((WIDTH - 280, cy + 45), status_text, fill=col, font=FONT_MONO_SM)

        # Clinical Measurements HUD Card
        hud_y = 1100
        draw_card(draw, (80, hud_y, WIDTH - 80, hud_y + 400), fill=(10, 18, 35), outline=(37, 99, 235), radius=32, border_w=2)
        draw.text((120, hud_y + 35), "AI BIOMARKER EXTRACTION HUD", fill=(6, 182, 212), font=FONT_BOLD_SM)
        
        # Grid of metrics
        metrics = [
            ("HEART RATE", "74 BPM", (16, 185, 129)),
            ("PR INTERVAL", "162 ms", (255, 255, 255)),
            ("QRS DURATION", "88 ms", (255, 255, 255)),
            ("QTc INTERVAL", "418 ms", (255, 255, 255)),
            ("ST DEVIATION", "+2.4 mm (Critical)", (239, 68, 68)),
            ("CONFIDENCE", "98.7% OpenRouter", (6, 182, 212)),
        ]
        for idx, (label, val, val_col) in enumerate(metrics):
            mx = 120 + (idx % 2) * 440
            my = hud_y + 90 + (idx // 2) * 90
            draw.text((mx, my), label, fill=(148, 163, 184), font=FONT_MONO_SM)
            draw.text((mx, my + 30), val, fill=val_col, font=FONT_BOLD_SM)

        # Action tag
        draw_card(draw, (80, 1540, WIDTH - 80, 1660), fill=(220, 38, 38), outline=(248, 113, 113), radius=24, border_w=2)
        draw.text((190, 1575), "🚨 AUTOMATED EMERGENCY AMBULANCE DISPATCH", fill=(255, 255, 255), font=FONT_BOLD_SM)

    elif t < 15.0:
        # ==========================================
        # SCENE 4: HOSPITAL-GRADE CLINICAL SUMMARY REPORT (11.5s - 15.0s)
        # ==========================================
        scene_t = t - 11.5

        # Step Indicator
        draw_card(draw, (80, 200, WIDTH - 80, 270), fill=(15, 35, 60), outline=(16, 185, 129), radius=20, border_w=2)
        draw.text((110, 218), "STEP 3: HOSPITAL-GRADE SUMMARY REPORT", fill=(16, 185, 129), font=FONT_BOLD_SM)

        # Headline
        draw.text((80, 300), "INSTANT CLINICAL DOCUMENT", fill=(255, 255, 255), font=FONT_TITLE_LG)
        draw.text((80, 365), "Matches Official Cardiologist Consultation Templates", fill=(148, 163, 184), font=FONT_REG_MD)

        # Clinical Report Mockup Sheet
        rep_bbox = (80, 440, WIDTH - 80, 1380)
        draw_card(draw, rep_bbox, fill=(255, 255, 255), outline=(6, 182, 212), radius=28, border_w=4)
        
        # Report Header inside paper
        draw.rectangle([80, 440, WIDTH - 80, 560], fill=(15, 23, 42))
        draw.text((120, 465), "CARDIOAI CLINICAL SUMMARY REPORT", fill=(255, 255, 255), font=FONT_BOLD_SM)
        draw.text((120, 505), "CASE ID: CAI-2026-8841 | DATE: 2026-11-05 | LEAD II + V1-V6", fill=(6, 182, 212), font=FONT_MONO_SM)

        # Report Sections (Inside White Sheet)
        sec_y = 600
        draw.text((120, sec_y), "1. PRIMARY DIAGNOSIS", fill=(15, 23, 42), font=FONT_BOLD_SM)
        draw.text((120, sec_y + 40), "Acute ST-Elevation Myocardial Infarction (Anterior Leads)", fill=(220, 38, 38), font=FONT_REG_MD)

        draw.text((120, sec_y + 110), "2. WAVEFORM MEASUREMENTS", fill=(15, 23, 42), font=FONT_BOLD_SM)
        draw.text((120, sec_y + 150), "• Heart Rate: 74 BPM (Normocardic)", fill=(51, 65, 85), font=FONT_REG_MD)
        draw.text((120, sec_y + 190), "• PR Interval: 162 ms | QRS: 88 ms | QTc: 418 ms", fill=(51, 65, 85), font=FONT_REG_MD)
        draw.text((120, sec_y + 230), "• ST Deviation: +2.4 mm (Significant Elevation in V2-V4)", fill=(220, 38, 38), font=FONT_REG_MD)

        draw.text((120, sec_y + 300), "3. PATHOPHYSIOLOGICAL FINDINGS", fill=(15, 23, 42), font=FONT_BOLD_SM)
        draw.text((120, sec_y + 340), "Transmural ischemia of anterior myocardium. Coronary artery", fill=(51, 65, 85), font=FONT_REG_MD)
        draw.text((120, sec_y + 380), "occlusion indicated. Immediate clinical intervention required.", fill=(51, 65, 85), font=FONT_REG_MD)

        draw.text((120, sec_y + 450), "4. ESSENTIAL HEALTH PRECAUTIONS & DIET", fill=(15, 23, 42), font=FONT_BOLD_SM)
        draw.text((120, sec_y + 490), "• Emergency Medical Services (EMS) activation immediately", fill=(51, 65, 85), font=FONT_REG_MD)
        draw.text((120, sec_y + 530), "• Avoid exertion; maintain upright seated posture", fill=(51, 65, 85), font=FONT_REG_MD)

        # Digital Verification Stamp
        stamp_box = (WIDTH - 420, 1180, WIDTH - 120, 1340)
        draw.rectangle(stamp_box, fill=(240, 253, 250), outline=(13, 148, 136), width=2)
        draw.text((WIDTH - 400, 1200), "VERIFIED CLINICAL AI", fill=(13, 148, 136), font=FONT_MONO_SM)
        draw.text((WIDTH - 400, 1240), "Dr. CardioAI Engine v2.4", fill=(15, 23, 42), font=FONT_BOLD_SM)
        draw.text((WIDTH - 400, 1285), "Status: Clinician Approved", fill=(13, 148, 136), font=FONT_MONO_SM)

        # Action Buttons below the sheet
        draw_card(draw, (80, 1430, 520, 1550), fill=(37, 99, 235), outline=(6, 182, 212), radius=22, border_w=2)
        draw.text((130, 1465), "🖨️ PRINT SUMMARY", fill=(255, 255, 255), font=FONT_BOLD_SM)

        draw_card(draw, (560, 1430, WIDTH - 80, 1550), fill=(16, 185, 129), outline=(52, 211, 153), radius=22, border_w=2)
        draw.text((610, 1465), "📄 DOWNLOAD PDF", fill=(255, 255, 255), font=FONT_BOLD_SM)

        # Footer badge
        draw.text((180, 1600), "Matches standard hospital EHR report formatting 100%", fill=(148, 163, 184), font=FONT_REG_MD)

    else:
        # ==========================================
        # SCENE 5: OUTRO & CALL TO ACTION (15.0s - 18.0s)
        # ==========================================
        scene_t = t - 15.0
        
        # Giant Logo & Outro
        draw_card(draw, (80, 240, WIDTH - 80, 580), fill=(12, 22, 45), outline=(37, 99, 235), radius=36, border_w=3)
        draw.text((160, 280), "CARDIOAI STUDIO", fill=(6, 182, 212), font=FONT_TITLE_XL)
        draw.text((160, 370), "Next-Generation ECG Diagnostic Intelligence", fill=(255, 255, 255), font=FONT_TITLE_MD)
        draw.text((160, 440), "Real-time AI Vision • 12-Lead Multi-Stage Analysis", fill=(148, 163, 184), font=FONT_REG_MD)
        draw.text((160, 490), "Deployed live on Railway Cloud • 100% Open Source", fill=(16, 185, 129), font=FONT_REG_MD)

        # Live Web URL Card
        draw_card(draw, (80, 640, WIDTH - 80, 800), fill=(15, 23, 42), outline=(6, 182, 212), radius=26, border_w=2)
        draw.text((120, 675), "🌐 TEST LIVE APPLICATION AT:", fill=(148, 163, 184), font=FONT_MONO_SM)
        draw.text((120, 720), "ecg-report-prediction-production.up.railway.app", fill=(6, 182, 212), font=FONT_BOLD_SM)

        # Engagement Cards (Instagram Style)
        draw_card(draw, (80, 860, WIDTH - 80, 1420), fill=(10, 18, 35), outline=(37, 99, 235), radius=32, border_w=2)
        draw.text((120, 910), "SUPPORT THE PROJECT 🚀", fill=(255, 255, 255), font=FONT_TITLE_LG)
        
        cta_items = [
            ("❤️ DOUBLE TAP", "If you want AI to save lives in hospitals!"),
            ("💬 COMMENT 'CODE'", "To get the complete GitHub repository link!"),
            ("🔖 SAVE THIS POST", "Reference this architecture for your next project!"),
            ("👥 SHARE WITH PEERS", "Pass this to cardiology & AI developers!"),
        ]
        for idx, (cta_title, cta_sub) in enumerate(cta_items):
            cy = 1000 + idx * 95
            draw.text((120, cy), cta_title, fill=(6, 182, 212), font=FONT_BOLD_SM)
            draw.text((120, cy + 38), cta_sub, fill=(226, 232, 240), font=FONT_REG_MD)

        # Bottom Follow Tag
        draw_card(draw, (80, 1480, WIDTH - 80, 1640), fill=(37, 99, 235), outline=(6, 182, 212), radius=26, border_w=2)
        draw.text((210, 1530), "FOLLOW @CARDIOAI.STUDIO 🫀", fill=(255, 255, 255), font=FONT_TITLE_MD)

    # 4. Global Instagram Bottom Bar Overlay (for authentic post look)
    draw.rectangle([0, HEIGHT - 120, WIDTH, HEIGHT], fill=(6, 11, 22))
    draw.line([(0, HEIGHT - 120), (WIDTH, HEIGHT - 120)], fill=(30, 58, 138), width=1)
    
    # Instagram Engagement icons at the bottom
    draw.text((80, HEIGHT - 90), "❤️ 12.8K", fill=(248, 113, 113), font=FONT_BOLD_SM)
    draw.text((290, HEIGHT - 90), "💬 842", fill=(255, 255, 255), font=FONT_BOLD_SM)
    draw.text((470, HEIGHT - 90), "🚀 1.9K", fill=(255, 255, 255), font=FONT_BOLD_SM)
    draw.text((WIDTH - 240, HEIGHT - 90), "🔖 SAVE", fill=(6, 182, 212), font=FONT_BOLD_SM)

    # Convert to RGB numpy array
    return np.array(img, dtype=np.uint8)

def main():
    print("=" * 60)
    print("CARDIOAI INSTAGRAM REEL / VIDEO GENERATOR")
    print("=" * 60)
    print(f"Target Output: {OUTPUT_MP4}")
    print(f"Resolution: {WIDTH}x{HEIGHT} (9:16 Vertical Reel Format)")
    print(f"Framerate: {FPS} FPS | Duration: {DURATION_SEC}s | Total Frames: {TOTAL_FRAMES}")

    # Step 1: Generate Synchronized Audio
    print("\n[1/3] Generating cardiac telemetry audio track...")
    generate_audio(TEMP_WAV, duration=DURATION_SEC)

    # Step 2: Initialize FFMPEG Pipeline
    print("\n[2/3] Launching FFMPEG encoding pipeline...")
    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
    
    cmd = [
        ffmpeg_exe,
        "-y",
        "-f", "rawvideo",
        "-vcodec", "rawvideo",
        "-s", f"{WIDTH}x{HEIGHT}",
        "-pix_fmt", "rgb24",
        "-r", str(FPS),
        "-i", "-",                     # video from stdin
        "-i", TEMP_WAV,                # audio track
        "-c:v", "libx264",
        "-preset", "fast",
        "-crf", "19",
        "-pix_fmt", "yuv420p",
        "-c:a", "aac",
        "-b:a", "192k",
        "-shortest",
        OUTPUT_MP4
    ]

    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stderr=subprocess.DEVNULL)

    # Step 3: Render Frames & Stream
    print("\n[3/3] Rendering frames and streaming into FFMPEG...")
    for f in range(TOTAL_FRAMES):
        frame_rgb = render_frame(f)
        proc.stdin.write(frame_rgb.tobytes())
        if (f + 1) % 60 == 0 or f == TOTAL_FRAMES - 1:
            pct = ((f + 1) / TOTAL_FRAMES) * 100
            print(f"  Frame {f + 1}/{TOTAL_FRAMES} rendered ({pct:.1f}%)")

    proc.stdin.close()
    proc.wait()

    if proc.returncode == 0:
        file_size_mb = os.path.getsize(OUTPUT_MP4) / (1024 * 1024)
        print(f"\nSUCCESS! Video generated successfully at:")
        print(f"-> {OUTPUT_MP4} ({file_size_mb:.2f} MB)")
    else:
        print(f"\nERROR: FFMPEG failed with code {proc.returncode}")

    # Clean up temp wav
    if os.path.exists(TEMP_WAV):
        try:
            os.remove(TEMP_WAV)
        except:
            pass

if __name__ == "__main__":
    main()

