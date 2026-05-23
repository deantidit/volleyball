import { useState, useRef } from "react";

// ─── YouTube helpers ──────────────────────────────────────────────────────────
function getVideoId(url) {
  if (!url) return null;
  const m1 = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (m1) return m1[1];
  const m2 = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (m2) return m2[1];
  return null;
}

function getThumbnail(url) {
  const id = getVideoId(url);
  if (id) return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  return null;
}

function openVideo(url) {
  if (!url) return;
  const id = getVideoId(url);
  // Try to open in YouTube app first, fall back to browser
  if (id) {
    window.open(`https://www.youtube.com/watch?v=${id}`, "_blank");
  } else {
    window.open(url, "_blank");
  }
}

function getSearchQuery(url) {
  if (!url) return null;
  const m = url.match(/search_query=([^&]+)/);
  return m ? decodeURIComponent(m[1].replace(/\+/g, " ")) : null;
}

// ─── DATA ─────────────────────────────────────────────────────────────────────
const INITIAL_DAYS = [
  {
    id: 0,
    label: "DAY 1",
    title: "STRENGTH + ATHLETIC POWER",
    color: "#f87171",
    goals: ["база силы для прыжка", "athletic strength", "rotational power", "здоровье плеч", "tendon capacity"],
    duration: "до 90 мин",
    rule: "quality · explosive intent · control",
    stopIf: ["отказ в подходе", "grind reps", "теряется техника", "ego lifting"],
    sections: [
      {
        id: "d1b0", label: "BLOCK 0 — KNEE + ANKLE PREP", color: "#4ade80",
        exercises: [
          { id: "d1e0", name: "Spanish Squat Hold", sets: 2, reps: "30–45 сек", weight: "", videoUrl: "https://www.youtube.com/results?search_query=spanish+squat+hold", notes: ["корпус вертикально", "колени вперёд", "tension moderate", "НЕ до тряски"] },
          { id: "d1e1", name: "Tibialis Raise", sets: 2, reps: "15–20", weight: "", videoUrl: "https://www.youtube.com/results?search_query=tibialis+raise", notes: ["медленно", "full ROM", "пауза сверху"] },
        ],
      },
      {
        id: "d1b1", label: "BLOCK 1 — DYNAMIC WARM-UP", color: "#4ade80",
        exercises: [
          { id: "d1e2", name: "Bike / Light Jog", sets: 1, reps: "5 мин", weight: "", videoUrl: null, notes: ["разогреть суставы", "пульс ~120-130"] },
          { id: "d1e3", name: "Mobility (ankles · hips · T-spine)", sets: 1, reps: "2–3 мин", weight: "", videoUrl: null, notes: ["ankles", "hips", "T-spine"] },
          { id: "d1e4", name: "Shoulder Prep Series", sets: 2, reps: "20–30 сек/круг", weight: "", videoUrl: null, notes: ["shoulder mobility", "scap activation", "скорость руки", "prep for overhead work"] },
        ],
      },
      {
        id: "d1b2", label: "BLOCK 2 — MAIN STRENGTH", color: "#f87171",
        exercises: [
          { id: "d1e5", name: "Trap Bar Deadlift", sets: 4, reps: "5", weight: "RPE 7–8", rest: "2–3 мин", videoUrl: "https://www.youtube.com/results?search_query=trap+bar+deadlift", notes: ["мощно вверх", "контроль вниз", "neutral spine", "НЕ grind reps"] },
        ],
      },
      {
        id: "d1b3", label: "BLOCK 3 — POWER SQUAT", color: "#fb923c",
        exercises: [
          { id: "d1e6", name: "Box Squat", sets: 4, reps: "5", weight: "", rest: "2 мин", videoUrl: "https://www.youtube.com/results?search_query=box+squat+athlete", notes: ["explosive вверх", "controlled вниз", "moderate depth", "колени стабильны"] },
        ],
      },
      {
        id: "d1b4", label: "BLOCK 4 — HIP + FOREARM STABILITY", color: "#c084fc", superset: true, rest: "90 сек",
        exercises: [
          { id: "d1e7", name: "Hip Abduction Machine", sets: 2, reps: "12–15", weight: "", videoUrl: "https://www.youtube.com/results?search_query=hip+abduction+machine", notes: ["controlled", "пауза в конце", "НЕ раскачиваться"] },
          { id: "d1e8", name: "Wrist Extension", sets: 2, reps: "15–20", weight: "", videoUrl: "https://www.youtube.com/results?search_query=wrist+extension+exercise", notes: ["медленно", "без читинга", "контроль вниз"] },
        ],
      },
      {
        id: "d1b5", label: "BLOCK 5 — HIP + FOREARM SUPPORT", color: "#c084fc", superset: true, rest: "90 сек",
        exercises: [
          { id: "d1e9", name: "Hip Adduction Machine", sets: 2, reps: "12–15", weight: "", videoUrl: "https://www.youtube.com/results?search_query=hip+adduction+machine", notes: ["smooth", "controlled", "moderate weight"] },
          { id: "d1e10", name: "Pronation / Supination", sets: 2, reps: "12–15", weight: "", videoUrl: "https://www.youtube.com/results?search_query=pronation+supination+exercise", notes: ["контроль", "full ROM", "без инерции"] },
        ],
      },
      {
        id: "d1b6", label: "BLOCK 6 — UNILATERAL STABILITY", color: "#38bdf8",
        exercises: [
          { id: "d1e11", name: "Bulgarian Split Squat", sets: 3, reps: "6/сторону", weight: "", rest: "90 сек", videoUrl: "https://www.youtube.com/results?search_query=bulgarian+split+squat+athlete", notes: ["moderate ROM", "контроль таза", "колено стабильно", "НЕ deep painful flexion"] },
        ],
      },
      {
        id: "d1b7", label: "BLOCK 7 — ATHLETIC UPPER", color: "#f472b6", superset: true, rest: "90 сек",
        exercises: [
          { id: "d1e12", name: "Landmine Press", sets: 3, reps: "6", weight: "", videoUrl: "https://www.youtube.com/results?search_query=landmine+press+exercise", notes: ["через корпус", "explosive intent", "rib cage stable"] },
          { id: "d1e13", name: "Pull-Ups", sets: 3, reps: "5–8", weight: "", videoUrl: "https://www.youtube.com/results?search_query=athletic+pull+ups", notes: ["scap control", "full control", "НЕ читинг"] },
        ],
      },
      {
        id: "d1b8", label: "BLOCK 8 — UPPER STRENGTH", color: "#f472b6",
        exercises: [
          { id: "d1e14", name: "Incline Dumbbell Press", sets: 3, reps: "6–8", weight: "", rest: "90 сек", videoUrl: "https://www.youtube.com/results?search_query=incline+dumbbell+press", notes: ["controlled", "shoulder friendly", "НЕ до отказа"] },
        ],
      },
      {
        id: "d1b9", label: "BLOCK 9 — ROTATIONAL POWER", color: "#F5C842",
        exercises: [
          { id: "d1e15", name: "Med Ball Rotational Throw", sets: 3, reps: "5/сторону", weight: "3–5 кг", rest: "", videoUrl: "https://www.youtube.com/results?search_query=med+ball+rotational+throw", notes: ["explosively", "через корпус", "НЕ руками", "speed > force"] },
        ],
      },
      {
        id: "d1b10", label: "BLOCK 10 — LOWER LEG / TENDON", color: "#4ade80",
        exercises: [
          { id: "d1e16", name: "Standing Barbell Calf Raise", sets: 3, reps: "10–12", weight: "", rest: "60–90 сек", videoUrl: "https://www.youtube.com/results?search_query=standing+barbell+calf+raise", notes: ["full stretch", "пауза внизу", "мощно вверх", "контроль вниз"] },
        ],
      },
      {
        id: "d1b11", label: "OPTIONAL — NECK ISOMETRICS", color: "#555",
        exercises: [
          { id: "d1e17", name: "Neck Isometrics", sets: 1, reps: "20–30 сек/направление", weight: "", videoUrl: "https://www.youtube.com/results?search_query=neck+isometric+exercise", notes: ["Front / Side / Back", "posture", "shoulder support", "neck stability"] },
        ],
      },
    ],
  },
  {
    id: 1,
    label: "DAY 2",
    title: "EXPLOSIVENESS + JUMP",
    color: "#F5C842",
    goals: ["рост прыжка", "reactive strength", "explosiveness", "перенос в волейбол", "профилактика травм"],
    duration: "55–70 мин",
    rule: "качество > количество",
    stopIf: ["прыжок падает", "контакт тяжёлый", "нет пружины", "движения замедлились"],
    sections: [
      {
        id: "warmup", label: "РАЗМИНКА / АКТИВАЦИЯ", color: "#4ade80",
        exercises: [
          { id: "e0", name: "Spanish Squat Hold", sets: 2, reps: "30–45 сек", weight: "", videoUrl: null, notes: ["держать контроль", "активировать квадрицепс"] },
          { id: "e1", name: "A-Skips", sets: 2, reps: "15–20 м", weight: "", videoUrl: "https://www.youtube.com/results?search_query=a+skip+drill+running", notes: ["высокий таз", "ритм", "активная стопа", "упругий контакт"] },
          { id: "e2", name: "Bounds", sets: 2, reps: "20 м", weight: "", videoUrl: "https://www.youtube.com/results?search_query=bounding+plyometric+exercise", notes: ["НЕ на максимум", "длинное мощное отталкивание", "подготовить elastic system"] },
        ],
      },
      {
        id: "b1", label: "BLOCK 1 — MAX REACTIVE", color: "#f87171",
        exercises: [
          { id: "e3", name: "Depth Jump", sets: 3, reps: "3/сторону", weight: "", rest: "90–120 сек", videoUrl: "https://www.youtube.com/watch?v=egnoXByP6ck", notes: ["минимальный контакт с землей", "«пол горячий»", "не проваливаться вниз", "высота: 20–30 см"] },
          { id: "e4", name: "Single Leg Depth Drop Lateral", sets: 3, reps: "3/сторону", weight: "", rest: "60–90 сек", videoUrl: "https://www.youtube.com/results?search_query=single+leg+depth+drop+lateral", notes: ["колено стабильно", "тихое приземление", "контроль > высота", "высота: 10–20 см"] },
        ],
      },
      {
        id: "b2", label: "BLOCK 2 — GAME TRANSFER", color: "#fb923c", superset: true, rest: "90–120 сек",
        exercises: [
          { id: "e5", name: "DB Push Press", sets: 3, reps: "5", weight: "7 кг", rest: "", videoUrl: "https://www.youtube.com/results?search_query=db+push+press+exercise", notes: ["взрыв через ноги", "НЕ strict press", "быстрый lockout"] },
          { id: "e6", name: "Approach Jump", sets: 4, reps: "3/сторону", weight: "", rest: "", videoUrl: "https://www.youtube.com/results?search_query=volleyball+approach+jump+technique", notes: ["каждый прыжок как игровой", "максимальная высота", "полный фокус"] },
        ],
      },
      {
        id: "b3", label: "BLOCK 3 — ATHLETIC POWER", color: "#c084fc", superset: true, rest: "90 сек",
        exercises: [
          { id: "e7", name: "Single Arm Landmine Split Jerk", sets: 4, reps: "4/руку", weight: "5 кг + гриф", rest: "", videoUrl: "https://www.youtube.com/watch?v=iQQZMeDpLb0", notes: ["движение «вылетает»", "НЕ жать", "мощность через ноги + таз"] },
          { id: "e8", name: "Lateral Reactive Hop", sets: 3, reps: "5/нога", weight: "", rest: "", videoUrl: "https://www.youtube.com/results?search_query=lateral+reactive+hop+plyometric", notes: ["быстрый отскок", "минимальный контакт", "стабильное колено"] },
        ],
      },
      {
        id: "b4", label: "BLOCK 4 — MAX POWER OUTPUT", color: "#38bdf8", superset: true, rest: "90 сек",
        exercises: [
          { id: "e9", name: "Trap Bar Jump", sets: 4, reps: "4", weight: "8 кг/руку", rest: "", videoUrl: "https://www.youtube.com/results?search_query=trap+bar+jump+athlete", notes: ["скорость > вес", "максимальный взрыв", "если замедляется → вес слишком большой"] },
          { id: "e10", name: "Copenhagen Plank", sets: 3, reps: "20–30 сек", weight: "", rest: "", videoUrl: "https://www.youtube.com/results?search_query=copenhagen+plank+exercise", notes: ["чувствовать внутреннюю часть бедра", "таз ровный", "не проваливаться", "НЕ до отказа"] },
        ],
      },
      {
        id: "b5", label: "BLOCK 5 — HIP POWER + SOLEUS", color: "#f472b6", superset: true, rest: "90 сек",
        sequence: "Hip Thrust → 15–20 сек → Seated Calf Raise → отдых",
        exercises: [
          { id: "e11", name: "Explosive Hip Thrust Machine", sets: 3, reps: "5", weight: "20 кг", rest: "", videoUrl: "https://www.youtube.com/watch?v=T-SoPcyfdxg", notes: ["explosive вверх", "вниз 2–3 сек контроль", "мощный hip snap", "НЕ до отказа"] },
          { id: "e12", name: "Seated Calf Raise", sets: 3, reps: "8", weight: "20 кг", rest: "", videoUrl: "https://www.youtube.com/results?search_query=seated+calf+raise+proper+form", notes: ["2 сек вниз", "пауза внизу", "мощно вверх", "цель: soleus + ахилл"] },
        ],
      },
    ],
  },
  {
    id: 2,
    label: "DAY 3",
    title: "RESTORE + ATHLETIC RECOVERY",
    color: "#4ade80",
    goals: ["восстановление", "longevity", "здоровье плеч/коленей", "tissue quality", "movement quality"],
    duration: "40–55 мин",
    rule: "после тренировки должно стать ЛУЧШЕ",
    stopIf: ["стало тяжелее", "появилась боль", "CNS fatigue", "сильная крепатура"],
    sections: [
      {
        id: "d3b0", label: "BLOCK 0 — GENERAL FLOW", color: "#4ade80",
        exercises: [
          { id: "d3e0", name: "Bike / Incline Walk", sets: 1, reps: "5–8 мин easy", weight: "", videoUrl: null, notes: ["кровоток", "лёгкая активация", "пульс ~110–120"] },
        ],
      },
      {
        id: "d3b1", label: "BLOCK 1 — SHOULDER + T-SPINE FLOW", color: "#38bdf8",
        exercises: [
          { id: "d3e1", name: "Shoulder Prep Series", sets: 3, reps: "20–30 сек/круг", weight: "", videoUrl: null, notes: ["shoulder mobility", "scap movement", "скорость руки", "разгрузка плеч"] },
          { id: "d3e2", name: "Scap Push-Ups", sets: 2, reps: "12–15", weight: "", videoUrl: "https://www.youtube.com/results?search_query=scap+push+up", notes: ["локти почти прямые", "движение лопатками", "full protraction/retraction", "controlled"] },
        ],
      },
      {
        id: "d3b2", label: "BLOCK 2 — LOWER LEG RESTORATION", color: "#4ade80", superset: true, rest: "45–60 сек",
        exercises: [
          { id: "d3e3", name: "Tibialis Raise", sets: 2, reps: "15–20", weight: "", videoUrl: "https://www.youtube.com/results?search_query=tibialis+raise", notes: ["медленно", "пауза сверху", "full ROM"] },
          { id: "d3e4", name: "Seated Calf Raise LIGHT", sets: 2, reps: "15", weight: "лёгкий", videoUrl: "https://www.youtube.com/results?search_query=seated+calf+raise+proper+form", notes: ["медленно вниз", "пауза внизу", "controlled tempo"] },
        ],
      },
      {
        id: "d3b3", label: "BLOCK 3 — HIP / KNEE RESTORE", color: "#4ade80", superset: true, rest: "45–60 сек",
        exercises: [
          { id: "d3e5", name: "Hip Abduction Machine LIGHT", sets: 2, reps: "15", weight: "лёгкий", videoUrl: "https://www.youtube.com/results?search_query=hip+abduction+machine", notes: ["controlled", "moderate/light weight", "no swinging"] },
          { id: "d3e6", name: "Hip Adduction Machine LIGHT", sets: 2, reps: "15", weight: "лёгкий", videoUrl: "https://www.youtube.com/results?search_query=hip+adduction+machine", notes: ["controlled", "moderate/light weight", "no swinging"] },
        ],
      },
      {
        id: "d3b4", label: "BLOCK 4 — SHOULDER HEALTH", color: "#38bdf8", superset: true, rest: "45–60 сек",
        exercises: [
          { id: "d3e7", name: "Band External Rotation", sets: 2, reps: "15", weight: "", videoUrl: "https://www.youtube.com/results?search_query=band+external+rotation", notes: ["rotator cuff", "shoulder health", "overhead stability"] },
          { id: "d3e8", name: "Face Pull", sets: 2, reps: "12–15", weight: "", videoUrl: "https://www.youtube.com/results?search_query=face+pull", notes: ["rear delt", "posture", "scap stability"] },
        ],
      },
      {
        id: "d3b5", label: "BLOCK 5 — CORE / RECOVERY CONTROL", color: "#c084fc",
        exercises: [
          { id: "d3e9", name: "Dead Bug", sets: 2, reps: "10", weight: "", videoUrl: "https://www.youtube.com/results?search_query=dead+bug+exercise", notes: ["trunk control", "anti-extension", "core stability"] },
        ],
      },
      {
        id: "d3b6", label: "OPTIONAL — ДОБАВКИ", color: "#555",
        exercises: [
          { id: "d3e10", name: "Glute Bridge Hold", sets: 2, reps: "30–45 сек", weight: "", videoUrl: "https://www.youtube.com/results?search_query=glute+bridge+hold", notes: ["hip extension", "разгрузка поясницы", "восстановление таза"] },
          { id: "d3e11", name: "Neck Isometrics", sets: 1, reps: "20–30 сек/направление", weight: "", videoUrl: "https://www.youtube.com/results?search_query=neck+isometric+exercise", notes: ["Front / Side / Back", "posture", "neck stability", "shoulder support"] },
        ],
      },
    ],
  },
  { id: 4, label: "DAY 4", title: "COMING SOON", color: "#333", empty: true },
];

// deep clone helper
const clone = v => JSON.parse(JSON.stringify(v));

// ─── Video Modal ──────────────────────────────────────────────────────────────
function VideoModal({ exercise, onClose }) {
  const thumb = getThumbnail(exercise.videoUrl);
  const searchQ = getSearchQuery(exercise.videoUrl);
  const hasDirectVideo = !!getVideoId(exercise.videoUrl);

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(0,0,0,0.96)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: 16,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: "100%", maxWidth: 480,
        background: "#111", border: "1px solid #222",
        borderRadius: 16, overflow: "hidden",
        animation: "modalPop .2s cubic-bezier(.34,1.56,.64,1)",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid #1e1e1e" }}>
          <div style={{ fontSize: 13, color: "#f0ede8", fontWeight: 500, lineHeight: 1.3, flex: 1, paddingRight: 10 }}>{exercise.name}</div>
          <button onClick={onClose} style={{ background: "transparent", border: "1px solid #2a2a2a", color: "#555", width: 30, height: 30, borderRadius: 7, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>

        {/* Thumbnail + play button */}
        <div
          onClick={() => openVideo(exercise.videoUrl)}
          style={{
            position: "relative", cursor: "pointer",
            background: "#0a0a0a",
            aspectRatio: "16/9",
            display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {thumb ? (
            <img src={thumb} alt={exercise.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", background: "#0d0d0d", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8 }}>
              <div style={{ fontSize: 28 }}>🎬</div>
              {searchQ && <div style={{ fontSize: 11, color: "#444", textAlign: "center", padding: "0 16px" }}>«{searchQ}»</div>}
            </div>
          )}
          {/* Play overlay */}
          <div style={{
            position: "absolute", inset: 0,
            background: "rgba(0,0,0,0.35)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: "50%",
              background: "rgba(255,255,255,0.95)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
            }}>
              <span style={{ fontSize: 20, marginLeft: 4, color: "#111" }}>▶</span>
            </div>
          </div>
          {/* Label */}
          <div style={{
            position: "absolute", bottom: 10, left: 0, right: 0,
            textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.7)",
            fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em",
          }}>
            {hasDirectVideo ? "Нажми чтобы открыть в YouTube" : "Открыть поиск YouTube"}
          </div>
        </div>

        {/* Notes */}
        {exercise.notes?.length > 0 && (
          <div style={{ padding: "12px 16px", borderTop: "1px solid #1a1a1a" }}>
            <div style={{ fontSize: 9, color: "#444", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 7 }}>Ключевые моменты</div>
            {exercise.notes.map((n, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 4 }}>
                <span style={{ color: "#F5C842", fontSize: 9, marginTop: 2, flexShrink: 0 }}>▸</span>
                <span style={{ fontSize: 11, color: "#888", lineHeight: 1.4 }}>{n}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Image Viewer Modal ───────────────────────────────────────────────────────
function ImageModal({ src, onClose }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.97)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <img src={src} alt="" style={{ maxWidth: "100%", maxHeight: "90vh", borderRadius: 10, objectFit: "contain" }} onClick={e => e.stopPropagation()} />
      <button onClick={onClose} style={{ position: "absolute", top: 20, right: 20, background: "#111", border: "1px solid #333", color: "#aaa", width: 36, height: 36, borderRadius: 8, cursor: "pointer", fontSize: 18 }}>×</button>
    </div>
  );
}

// ─── Exercise Card ────────────────────────────────────────────────────────────
function ExerciseCard({ ex, blockColor, index, superset, onChange }) {
  const [done, setDone] = useState(false);
  const [editing, setEditing] = useState(false);
  const [imgViewer, setImgViewer] = useState(null);
  const [notesOpen, setNotesOpen] = useState(true);
  const [editingNotes, setEditingNotes] = useState(false);
  const [draft, setDraft] = useState({ sets: ex.sets, reps: ex.reps, weight: ex.weight, videoUrl: ex.videoUrl || "", userComment: ex.userComment || "", images: ex.images || [], notes: ex.notes ? [...ex.notes] : [] });
  const fileRef = useRef();

  const save = () => { onChange({ ...ex, ...draft, videoUrl: draft.videoUrl.trim() || null }); setEditing(false); setEditingNotes(false); };
  const cancel = () => { setDraft({ sets: ex.sets, reps: ex.reps, weight: ex.weight, videoUrl: ex.videoUrl || "", userComment: ex.userComment || "", images: ex.images || [], notes: ex.notes ? [...ex.notes] : [] }); setEditing(false); setEditingNotes(false); };

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => {
        setDraft(d => ({ ...d, images: [...d.images, ev.target.result] }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (i) => setDraft(d => ({ ...d, images: d.images.filter((_, j) => j !== i) }));

  const hasVideo = !!ex.videoUrl;
  const hasComment = ex.userComment && ex.userComment.trim();
  const hasImages = ex.images && ex.images.length > 0;

  return (
    <>
      <div style={{
        background: done ? "#0d0d0d" : "#111",
        border: `1px solid ${done ? "#161616" : "#1e1e1e"}`,
        borderLeft: `3px solid ${done ? "#222" : blockColor}`,
        borderRadius: 10, padding: "12px 14px",
        opacity: done ? 0.45 : 1,
        transition: "all 0.2s",
        animation: `cardIn .3s ease ${index * 0.04}s both`,
      }}>

        {/* ── Top row ── */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          {/* checkbox */}
          <button onClick={() => setDone(!done)} style={{
            width: 20, height: 20, borderRadius: 5, flexShrink: 0, marginTop: 2,
            border: `1.5px solid ${done ? blockColor : "#2e2e2e"}`,
            background: done ? blockColor : "transparent", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.15s",
          }}>
            {done && <span style={{ fontSize: 11, color: "#000", lineHeight: 1 }}>✓</span>}
          </button>

          <div style={{ flex: 1, minWidth: 0 }}>
            {superset && (
              <span style={{ fontSize: 8, letterSpacing: "0.1em", color: blockColor, border: `1px solid ${blockColor}30`, background: `${blockColor}10`, padding: "1px 6px", borderRadius: 100, marginBottom: 4, display: "inline-block" }}>SUPERSET</span>
            )}
            <div style={{ fontSize: 13, color: done ? "#333" : "#f0ede8", fontWeight: 500, lineHeight: 1.3, textDecoration: done ? "line-through" : "none" }}>
              {ex.name}
            </div>

            {/* sets/reps/weight display */}
            <div style={{ display: "flex", gap: 8, marginTop: 5, flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ fontSize: 13, color: blockColor, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.06em" }}>
                {ex.sets} × {ex.reps}
              </span>
              {ex.weight && (
                <span style={{ fontSize: 10, color: "#555" }}>· {ex.weight}</span>
              )}
              {ex.rest && (
                <span style={{ fontSize: 10, color: "#444" }}>⏱ {ex.rest}</span>
              )}
            </div>
          </div>

          {/* action buttons */}
          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
            {hasVideo && (
              <a
                href={ex.videoUrl}
                target="_blank"
                rel="noreferrer"
                onClick={e => e.stopPropagation()}
                style={{
                  width: 32, height: 32, borderRadius: 7,
                  border: `1px solid ${blockColor}35`,
                  background: `${blockColor}10`,
                  color: blockColor,
                  fontSize: 14,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  textDecoration: "none", flexShrink: 0,
                }}
              >▶</a>
            )}
            <button onClick={() => { setEditing(!editing); if (editing) cancel(); }} style={{ width: 32, height: 32, borderRadius: 7, border: "1px solid #222", background: editing ? "#1e1e1e" : "transparent", color: "#555", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}
              onMouseEnter={e => { if (!editing) e.currentTarget.style.borderColor = "#444"; }}
              onMouseLeave={e => { if (!editing) e.currentTarget.style.borderColor = "#222"; }}
            >✎</button>
          </div>
        </div>

        {/* ── Edit panel ── */}
        {editing && (
          <div style={{ marginTop: 12, padding: "12px 14px", background: "#0d0d0f", border: "1px solid #1a1a1e", borderRadius: 8, animation: "fadeSlide .15s ease" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 10 }}>
              {[
                { label: "ПОДХОДЫ", field: "sets", type: "number" },
                { label: "ПОВТОРЕНИЯ", field: "reps", type: "text" },
                { label: "ВЕС", field: "weight", type: "text" },
              ].map(f => (
                <label key={f.field} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <span style={{ fontSize: 8, color: "#444", letterSpacing: "0.1em" }}>{f.label}</span>
                  <input
                    type={f.type}
                    value={draft[f.field]}
                    onChange={e => setDraft(d => ({ ...d, [f.field]: e.target.value }))}
                    style={{ background: "#111", border: "1px solid #2a2a2a", color: "#f0ede8", padding: "6px 8px", borderRadius: 6, fontFamily: "'DM Mono', monospace", fontSize: 12, width: "100%", outline: "none" }}
                    onFocus={e => e.target.style.borderColor = blockColor}
                    onBlur={e => e.target.style.borderColor = "#2a2a2a"}
                  />
                </label>
              ))}
            </div>

            {/* YouTube URL */}
            <label style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 10 }}>
              <span style={{ fontSize: 8, color: "#444", letterSpacing: "0.1em" }}>ССЫЛКА YOUTUBE</span>
              <input
                type="text"
                value={draft.videoUrl}
                onChange={e => setDraft(d => ({ ...d, videoUrl: e.target.value }))}
                placeholder="https://youtube.com/watch?v=..."
                style={{ background: "#111", border: "1px solid #2a2a2a", color: "#f0ede8", padding: "6px 8px", borderRadius: 6, fontFamily: "'DM Mono', monospace", fontSize: 11, width: "100%", outline: "none" }}
                onFocus={e => e.target.style.borderColor = blockColor}
                onBlur={e => e.target.style.borderColor = "#2a2a2a"}
              />
            </label>

            {/* Comment */}
            <label style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 10 }}>
              <span style={{ fontSize: 8, color: "#444", letterSpacing: "0.1em" }}>КОММЕНТАРИЙ</span>
              <textarea
                value={draft.userComment}
                onChange={e => setDraft(d => ({ ...d, userComment: e.target.value }))}
                placeholder="Заметки о подходе, ощущения, корректировки..."
                rows={2}
                style={{ background: "#111", border: "1px solid #2a2a2a", color: "#f0ede8", padding: "7px 10px", borderRadius: 6, fontFamily: "'DM Mono', monospace", fontSize: 11, resize: "vertical", outline: "none", lineHeight: 1.5 }}
                onFocus={e => e.target.style.borderColor = blockColor}
                onBlur={e => e.target.style.borderColor = "#2a2a2a"}
              />
            </label>

            {/* Photo upload */}
            <div style={{ marginBottom: 10 }}>
              <span style={{ fontSize: 8, color: "#444", letterSpacing: "0.1em", display: "block", marginBottom: 6 }}>ФОТО / СКРИНШОТЫ</span>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "flex-start" }}>
                {draft.images.map((img, i) => (
                  <div key={i} style={{ position: "relative" }}>
                    <img src={img} alt="" onClick={() => setImgViewer(img)} style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 6, border: "1px solid #2a2a2a", cursor: "pointer" }} />
                    <button onClick={() => removeImage(i)} style={{ position: "absolute", top: -4, right: -4, width: 16, height: 16, borderRadius: "50%", background: "#e85d4a", border: "none", color: "#fff", fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>×</button>
                  </div>
                ))}
                <button onClick={() => fileRef.current?.click()} style={{ width: 60, height: 60, borderRadius: 6, border: `1px dashed ${blockColor}50`, background: `${blockColor}08`, color: blockColor, cursor: "pointer", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleImages} style={{ display: "none" }} />
              </div>
            </div>

            {/* Save/Cancel */}
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={save} style={{ flex: 1, padding: "8px", borderRadius: 7, border: "none", background: blockColor, color: "#000", cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 500, letterSpacing: "0.06em" }}>Сохранить</button>
              <button onClick={cancel} style={{ padding: "8px 14px", borderRadius: 7, border: "1px solid #222", background: "transparent", color: "#555", cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: 11 }}>Отмена</button>
            </div>
          </div>
        )}

        {/* ── Saved comment & images (shown when not editing) ── */}
        {!editing && (hasComment || hasImages) && (
          <div style={{ marginTop: 10, padding: "10px 12px", background: "#0d0d0f", border: "1px solid #1a1a1a", borderRadius: 8 }}>
            {hasComment && (
              <div style={{ fontSize: 11, color: "#666", lineHeight: 1.5, marginBottom: hasImages ? 8 : 0 }}>
                💬 {ex.userComment}
              </div>
            )}
            {hasImages && (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {ex.images.map((img, i) => (
                  <img key={i} src={img} alt="" onClick={() => setImgViewer(img)}
                    style={{ width: 52, height: 52, objectFit: "cover", borderRadius: 6, border: "1px solid #222", cursor: "pointer" }} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Notes ── */}
        {(ex.notes?.length > 0 || editingNotes) && (
          <div style={{ marginTop: 10, borderTop: "1px solid #1a1a1a", paddingTop: 10 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 7 }}>
              <button onClick={() => setNotesOpen(!notesOpen)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#444", fontSize: 9, fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 4, padding: 0 }}>
                <span style={{ display: "inline-block", transition: "transform 0.15s", transform: notesOpen ? "rotate(90deg)" : "none" }}>▸</span>
                ЗАМЕТКИ
              </button>
              <button
                onClick={() => { setEditingNotes(!editingNotes); if (!editingNotes) setNotesOpen(true); }}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: editingNotes ? blockColor : "#333", fontSize: 10, fontFamily: "'DM Mono', monospace", padding: 0, letterSpacing: "0.06em" }}
              >{editingNotes ? "готово" : "✎ изменить"}</button>
            </div>

            {notesOpen && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {draft.notes.map((n, i) => (
                  <div key={i} style={{ display: "flex", gap: 7, alignItems: "flex-start" }}>
                    <span style={{ color: blockColor, fontSize: 9, marginTop: editingNotes ? 10 : 3, flexShrink: 0 }}>▸</span>
                    {editingNotes ? (
                      <div style={{ display: "flex", gap: 5, flex: 1 }}>
                        <input
                          value={n}
                          onChange={e => setDraft(d => { const notes = [...d.notes]; notes[i] = e.target.value; return { ...d, notes }; })}
                          style={{ flex: 1, background: "#0d0d0f", border: `1px solid ${blockColor}40`, color: "#f0ede8", padding: "5px 8px", borderRadius: 6, fontFamily: "'DM Mono', monospace", fontSize: 11, outline: "none" }}
                          onFocus={e => e.target.style.borderColor = blockColor}
                          onBlur={e => e.target.style.borderColor = `${blockColor}40`}
                        />
                        <button
                          onClick={() => setDraft(d => ({ ...d, notes: d.notes.filter((_, j) => j !== i) }))}
                          style={{ background: "transparent", border: "none", color: "#444", cursor: "pointer", fontSize: 14, padding: "0 4px", flexShrink: 0 }}
                          onMouseEnter={e => e.currentTarget.style.color = "#e85d4a"}
                          onMouseLeave={e => e.currentTarget.style.color = "#444"}
                        >×</button>
                      </div>
                    ) : (
                      <span style={{ fontSize: 11, color: "#666", lineHeight: 1.4 }}>{n}</span>
                    )}
                  </div>
                ))}

                {/* Add new note */}
                {editingNotes && (
                  <button
                    onClick={() => setDraft(d => ({ ...d, notes: [...d.notes, ""] }))}
                    style={{ background: "transparent", border: `1px dashed ${blockColor}40`, color: blockColor, borderRadius: 6, padding: "5px 10px", cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: 10, marginTop: 2, textAlign: "left", letterSpacing: "0.06em" }}
                  >+ добавить заметку</button>
                )}

                {/* Save button when editing notes */}
                {editingNotes && (
                  <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                    <button onClick={save} style={{ flex: 1, padding: "7px", borderRadius: 6, border: "none", background: blockColor, color: "#000", cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 500 }}>Сохранить</button>
                    <button onClick={cancel} style={{ padding: "7px 12px", borderRadius: 6, border: "1px solid #222", background: "transparent", color: "#555", cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: 10 }}>Отмена</button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Add notes button if no notes yet */}
        {ex.notes?.length === 0 && !editingNotes && (
          <button onClick={() => { setEditingNotes(true); setNotesOpen(true); setDraft(d => ({ ...d, notes: [""] })); }}
            style={{ marginTop: 8, background: "transparent", border: "none", color: "#2a2a2a", cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: 10, padding: 0, letterSpacing: "0.06em" }}>
            + добавить заметки
          </button>
        )}
      </div>

      {imgViewer && <ImageModal src={imgViewer} onClose={() => setImgViewer(null)} />}
    </>
  );
}

// ─── Add Exercise Modal ───────────────────────────────────────────────────────
function AddExerciseModal({ sectionColor, onAdd, onClose }) {
  const [name, setName] = useState("");
  const [sets, setSets] = useState("3");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const submit = () => {
    if (!name.trim()) return;
    onAdd({
      id: `custom-${Date.now()}`,
      name: name.trim(),
      sets: sets || "3",
      reps: reps || "",
      weight: weight || "",
      videoUrl: videoUrl.trim() || null,
      notes: [],
    });
    onClose();
  };

  const inputStyle = {
    background: "#111", border: "1px solid #2a2a2a", color: "#f0ede8",
    padding: "8px 10px", borderRadius: 7, fontFamily: "'DM Mono', monospace",
    fontSize: 12, width: "100%", outline: "none",
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.95)", display: "flex", alignItems: "flex-end", justifyContent: "center", padding: "0 0 0 0" }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: "100%", maxWidth: 520, background: "#111",
        border: "1px solid #222", borderRadius: "16px 16px 0 0",
        padding: "20px 18px 32px",
        animation: "slideUp .25s cubic-bezier(.34,1.56,.64,1)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <span style={{ fontSize: 13, color: "#f0ede8", fontWeight: 500, letterSpacing: "0.04em" }}>Новое упражнение</span>
          <button onClick={onClose} style={{ background: "transparent", border: "1px solid #222", color: "#555", width: 28, height: 28, borderRadius: 6, cursor: "pointer", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div>
            <div style={{ fontSize: 8, color: "#444", letterSpacing: "0.1em", marginBottom: 4 }}>НАЗВАНИЕ *</div>
            <input autoFocus value={name} onChange={e => setName(e.target.value)} placeholder="Например: Box Jump" style={inputStyle}
              onFocus={e => e.target.style.borderColor = sectionColor}
              onBlur={e => e.target.style.borderColor = "#2a2a2a"}
              onKeyDown={e => e.key === "Enter" && submit()}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {[
              { label: "ПОДХОДЫ", val: sets, set: setSets, ph: "3" },
              { label: "ПОВТОРЕНИЯ", val: reps, set: setReps, ph: "5" },
              { label: "ВЕС", val: weight, set: setWeight, ph: "20 кг" },
            ].map(f => (
              <div key={f.label}>
                <div style={{ fontSize: 8, color: "#444", letterSpacing: "0.1em", marginBottom: 4 }}>{f.label}</div>
                <input value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = sectionColor}
                  onBlur={e => e.target.style.borderColor = "#2a2a2a"}
                />
              </div>
            ))}
          </div>

          <div>
            <div style={{ fontSize: 8, color: "#444", letterSpacing: "0.1em", marginBottom: 4 }}>ССЫЛКА НА ВИДЕО (YouTube)</div>
            <input value={videoUrl} onChange={e => setVideoUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." style={inputStyle}
              onFocus={e => e.target.style.borderColor = sectionColor}
              onBlur={e => e.target.style.borderColor = "#2a2a2a"}
            />
          </div>

          <button onClick={submit} disabled={!name.trim()} style={{
            marginTop: 4, padding: "10px", borderRadius: 8, border: "none",
            background: name.trim() ? sectionColor : "#1a1a1a",
            color: name.trim() ? "#000" : "#333",
            cursor: name.trim() ? "pointer" : "default",
            fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 500,
            letterSpacing: "0.06em", transition: "all 0.15s",
          }}>Добавить упражнение</button>
        </div>
      </div>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
function Section({ section, onExChange, onExReorder, onExDelete, onAddExercise, isFirst, isLast, onMoveUp, onMoveDown }) {
  const [collapsed, setCollapsed] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const dragIdx = useRef(null);
  const dragOverIdx = useRef(null);

  const handleDragStart = (i) => { dragIdx.current = i; };
  const handleDragOver = (e, i) => { e.preventDefault(); dragOverIdx.current = i; };
  const handleDrop = () => {
    if (dragIdx.current === null || dragOverIdx.current === null) return;
    if (dragIdx.current === dragOverIdx.current) return;
    const items = [...section.exercises];
    const [moved] = items.splice(dragIdx.current, 1);
    items.splice(dragOverIdx.current, 0, moved);
    onExReorder(section.id, items);
    dragIdx.current = null;
    dragOverIdx.current = null;
  };

  return (
    <div style={{ marginBottom: 18 }}>
      {/* Section header */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: collapsed ? 0 : 10 }}>

        {/* Block up/down arrows */}
        <div style={{ display: "flex", flexDirection: "column", gap: 1, flexShrink: 0 }}>
          <button onClick={onMoveUp} disabled={isFirst}
            style={{ background: "transparent", border: "none", cursor: isFirst ? "default" : "pointer", color: isFirst ? "#1e1e1e" : "#333", fontSize: 8, padding: "1px 2px", lineHeight: 1, transition: "color 0.15s" }}
            onMouseEnter={e => { if (!isFirst) e.currentTarget.style.color = "#aaa"; }}
            onMouseLeave={e => { e.currentTarget.style.color = isFirst ? "#1e1e1e" : "#333"; }}>▲</button>
          <button onClick={onMoveDown} disabled={isLast}
            style={{ background: "transparent", border: "none", cursor: isLast ? "default" : "pointer", color: isLast ? "#1e1e1e" : "#333", fontSize: 8, padding: "1px 2px", lineHeight: 1, transition: "color 0.15s" }}
            onMouseEnter={e => { if (!isLast) e.currentTarget.style.color = "#aaa"; }}
            onMouseLeave={e => { e.currentTarget.style.color = isLast ? "#1e1e1e" : "#333"; }}>▼</button>
        </div>

        <button onClick={() => setCollapsed(!collapsed)} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: 7, flex: 1, minWidth: 0 }}>
          <div style={{ height: 1, width: 12, background: section.color, flexShrink: 0 }} />
          <span style={{ fontSize: 9, letterSpacing: "0.14em", color: section.color, fontFamily: "'DM Mono', monospace", textTransform: "uppercase", whiteSpace: "nowrap" }}>{section.label}</span>
          {section.superset && <span style={{ fontSize: 8, color: section.color, border: `1px solid ${section.color}30`, padding: "1px 6px", borderRadius: 100, background: `${section.color}10`, flexShrink: 0 }}>SUPERSET</span>}
          {section.rest && <span style={{ fontSize: 8, color: "#444", whiteSpace: "nowrap", marginLeft: 4 }}>⏱ {section.rest}</span>}
        </button>

        {/* Exercise reorder toggle */}
        <button onClick={() => setReordering(!reordering)}
          style={{ background: "transparent", border: "none", cursor: "pointer", color: reordering ? section.color : "#2a2a2a", fontSize: 13, padding: "2px 4px", flexShrink: 0, transition: "color 0.15s" }}
          title="Перестановка упражнений">⇅</button>
        <span style={{ fontSize: 9, color: "#2a2a2a" }}>{collapsed ? "▾" : "▴"}</span>
      </div>

      {section.sequence && !collapsed && (
        <div style={{ fontSize: 10, color: "#555", background: "#111", border: "1px solid #1a1a1a", borderRadius: 6, padding: "6px 12px", marginBottom: 8, fontFamily: "'DM Mono', monospace" }}>
          🔁 {section.sequence}
        </div>
      )}

      {!collapsed && (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {section.exercises.map((ex, i) => (
              <div
                key={ex.id}
                draggable={reordering}
                onDragStart={() => handleDragStart(i)}
                onDragOver={e => handleDragOver(e, i)}
                onDrop={handleDrop}
                style={{ display: "flex", gap: 6, alignItems: "flex-start" }}
              >
                {/* Drag handle + move buttons */}
                {reordering && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 3, paddingTop: 12, flexShrink: 0 }}>
                    <button
                      onClick={() => i > 0 && onExReorder(section.id, (() => { const a = [...section.exercises]; [a[i-1], a[i]] = [a[i], a[i-1]]; return a; })())}
                      style={{ background: "transparent", border: "1px solid #222", color: i > 0 ? "#555" : "#1a1a1a", width: 22, height: 22, borderRadius: 4, cursor: i > 0 ? "pointer" : "default", fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center" }}
                    >↑</button>
                    <button
                      onClick={() => i < section.exercises.length - 1 && onExReorder(section.id, (() => { const a = [...section.exercises]; [a[i], a[i+1]] = [a[i+1], a[i]]; return a; })())}
                      style={{ background: "transparent", border: "1px solid #222", color: i < section.exercises.length - 1 ? "#555" : "#1a1a1a", width: 22, height: 22, borderRadius: 4, cursor: i < section.exercises.length - 1 ? "pointer" : "default", fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center" }}
                    >↓</button>
                    <button
                      onClick={() => onExDelete(section.id, ex.id)}
                      style={{ background: "transparent", border: "1px solid #2a1a1a", color: "#5a2e2e", width: 22, height: 22, borderRadius: 4, cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2 }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "#e85d4a"; e.currentTarget.style.color = "#e85d4a"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "#2a1a1a"; e.currentTarget.style.color = "#5a2e2e"; }}
                    >×</button>
                  </div>
                )}
                <div style={{ flex: 1, cursor: reordering ? "grab" : "default" }}>
                  <ExerciseCard
                    ex={ex} blockColor={section.color}
                    index={i} superset={section.superset}
                    onChange={(updated) => onExChange(section.id, updated)}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Add exercise button */}
          <button
            onClick={() => setShowAdd(true)}
            style={{
              marginTop: 8, width: "100%", padding: "8px",
              background: "transparent", border: `1px dashed ${section.color}30`,
              color: section.color, borderRadius: 8, cursor: "pointer",
              fontFamily: "'DM Mono', monospace", fontSize: 10,
              letterSpacing: "0.08em", transition: "all 0.15s",
              opacity: 0.6,
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.borderColor = `${section.color}70`; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = "0.6"; e.currentTarget.style.borderColor = `${section.color}30`; }}
          >+ добавить упражнение</button>
        </>
      )}

      {showAdd && (
        <AddExerciseModal
          sectionColor={section.color}
          onAdd={(ex) => onAddExercise(section.id, ex)}
          onClose={() => setShowAdd(false)}
        />
      )}
    </div>
  );
}

// ─── Day View ─────────────────────────────────────────────────────────────────
function DayView({ day, onDayChange }) {
  const totalEx = day.sections?.reduce((s, sec) => s + sec.exercises.length, 0) || 0;

  const handleExChange = (sectionId, updatedEx) => {
    const newDay = clone(day);
    const sec = newDay.sections.find(s => s.id === sectionId);
    if (sec) sec.exercises = sec.exercises.map(e => e.id === updatedEx.id ? updatedEx : e);
    onDayChange(newDay);
  };

  const handleExReorder = (sectionId, newExercises) => {
    const newDay = clone(day);
    const sec = newDay.sections.find(s => s.id === sectionId);
    if (sec) sec.exercises = newExercises;
    onDayChange(newDay);
  };

  const handleExDelete = (sectionId, exId) => {
    const newDay = clone(day);
    const sec = newDay.sections.find(s => s.id === sectionId);
    if (sec) sec.exercises = sec.exercises.filter(e => e.id !== exId);
    onDayChange(newDay);
  };

  const handleSectionMove = (si, dir) => {
    const newDay = clone(day);
    const secs = newDay.sections;
    const target = si + dir;
    if (target < 0 || target >= secs.length) return;
    [secs[si], secs[target]] = [secs[target], secs[si]];
    onDayChange(newDay);
  };

  const handleAddExercise = (sectionId, newEx) => {
    const newDay = clone(day);
    const sec = newDay.sections.find(s => s.id === sectionId);
    if (sec) sec.exercises = [...sec.exercises, newEx];
    onDayChange(newDay);
  };

  return (
    <div style={{ animation: "fadeSlide .25s ease" }}>
      {/* Hero */}
      <div style={{ padding: "18px 18px 14px", borderBottom: "1px solid #141414", background: `linear-gradient(135deg, ${day.color}08 0%, transparent 55%)` }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(34px,9vw,52px)", color: day.color, lineHeight: 1, letterSpacing: "0.04em" }}>{day.label}</span>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(16px,4.5vw,26px)", color: "#f0ede8", lineHeight: 1, letterSpacing: "0.04em" }}>{day.title}</span>
        </div>
        <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 10, flexWrap: "wrap" }}>
          <span style={{ fontSize: 10, color: "#555", fontFamily: "'DM Mono', monospace" }}>⏱ {day.duration}</span>
          <span style={{ fontSize: 10, color: day.color, fontFamily: "'DM Mono', monospace" }}>· {day.rule}</span>
          <span style={{ fontSize: 10, color: "#333", marginLeft: "auto" }}>{totalEx} упр.</span>
        </div>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          {day.goals?.map((g, i) => (
            <span key={i} style={{ fontSize: 9, color: "#666", border: "1px solid #1e1e1e", background: "#111", padding: "3px 9px", borderRadius: 100, fontFamily: "'DM Mono', monospace" }}>🎯 {g}</span>
          ))}
        </div>
      </div>

      {/* Stop banner */}
      <div style={{ margin: "12px 18px 0", background: "#150e0e", border: "1px solid #2d1515", borderRadius: 8, padding: "9px 13px" }}>
        <div style={{ fontSize: 9, color: "#e85d4a", letterSpacing: "0.1em", marginBottom: 4 }}>⛔ СТОП ЕСЛИ</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "3px 12px" }}>
          {(day.stopIf || []).map((w, i) => (
            <span key={i} style={{ fontSize: 9, color: "#5a2e2e", fontFamily: "'DM Mono', monospace" }}>· {w}</span>
          ))}
        </div>
      </div>

      {/* Sections */}
      <div style={{ padding: "14px 18px 80px" }}>
        {day.sections?.map((section, si) => (
          <Section
            key={section.id}
            section={section}
            onExChange={handleExChange}
            onExReorder={handleExReorder}
            onExDelete={handleExDelete}
            onAddExercise={handleAddExercise}
            isFirst={si === 0}
            isLast={si === day.sections.length - 1}
            onMoveUp={() => handleSectionMove(si, -1)}
            onMoveDown={() => handleSectionMove(si, 1)}
          />
        ))}
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function WorkoutApp() {
  const [days, setDays] = useState(clone(INITIAL_DAYS));
  const [activeDay, setActiveDay] = useState(0);
  const day = days[activeDay];

  const handleDayChange = (updatedDay) => {
    setDays(prev => prev.map((d, i) => i === activeDay ? updatedDay : d));
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0c", color: "#f0ede8", fontFamily: "'DM Mono','Courier New',monospace", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Bebas+Neue&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: #1e1e1e; border-radius: 2px; }
        @keyframes fadeSlide { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes cardIn { from{opacity:0;transform:translateX(-6px)} to{opacity:1;transform:translateX(0)} }
        @keyframes modalPop { from{opacity:0;transform:scale(0.93) translateY(10px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* Tab bar */}
      <div style={{ borderBottom: "1px solid #141414", display: "flex", overflowX: "auto", scrollbarWidth: "none" }}>
        {days.map((d, i) => (
          <button key={d.id} onClick={() => !d.empty && setActiveDay(i)} style={{
            background: "transparent", border: "none",
            borderBottom: `2px solid ${activeDay === i ? d.color : "transparent"}`,
            color: activeDay === i ? d.color : d.empty ? "#1e1e1e" : "#444",
            padding: "13px 20px 11px",
            cursor: d.empty ? "default" : "pointer",
            fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.1em",
            whiteSpace: "nowrap", transition: "color 0.15s",
          }}>
            {d.label}
            {d.empty && <span style={{ fontSize: 7, display: "block", marginTop: 1, color: "#1e1e1e" }}>SOON</span>}
          </button>
        ))}
      </div>

      {day.empty ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", color: "#1e1e1e", fontFamily: "'Bebas Neue',sans-serif", fontSize: 32, letterSpacing: "0.1em" }}>СКОРО</div>
      ) : (
        <DayView key={day.id} day={day} onDayChange={handleDayChange} />
      )}
    </div>
  );
}
