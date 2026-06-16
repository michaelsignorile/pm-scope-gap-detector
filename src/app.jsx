import { useState, useRef } from "react";

// ─── PMG Brand Colors ─────────────────────────────────────────────────────────
const B = {
  pmgBlue:   "#1B4F91",   // exact PMG blue from logo
  pmgBlueLt: "#EBF1F9",
  black:     "#111111",
  charcoal:  "#2D2D2D",
  steel:     "#4A4A4A",
  mid:       "#767676",
  silver:    "#A8A8A8",
  rule:      "#DEDEDE",
  fog:       "#F5F5F5",
  white:     "#FFFFFF",
  red:       "#C0392B",
  amber:     "#C07A2B",
  green:     "#1A6B3A",
};

const SEV = {
  CRITICAL: { label: "Critical", color: "#C0392B", bg: "#FDF0EF" },
  HIGH:     { label: "High",     color: "#C07A2B", bg: "#FDF6EF" },
  MEDIUM:   { label: "Medium",   color: B.pmgBlue, bg: B.pmgBlueLt },
  LOW:      { label: "Low",      color: "#1A6B3A", bg: "#EFF7F2" },
};

// ─── Discipline Icons — white vector on PMG blue square ──────────────────────
const DisciplineIcon = ({ type, size = 36, bgSize = 40 }) => {
  const pad = (bgSize - size) / 2;
  const w = { fill:"none", stroke:"#fff", strokeWidth:1.6, strokeLinecap:"round", strokeLinejoin:"round" };
  const f = { fill:"#fff", stroke:"none" };

  const icons = {

    // Blueprint triangle with horizontal floor lines
    "Architectural": (
      <svg width={size} height={size} viewBox="0 0 24 24">
        <polyline {...w} points="2,20 12,4 22,20 2,20"/>
        <line {...w} x1="6.5" y1="14" x2="17.5" y2="14"/>
        <line {...w} x1="9" y1="18" x2="15" y2="18"/>
      </svg>
    ),

    // I-beam cross section — classic structural steel
    "Structural": (
      <svg width={size} height={size} viewBox="0 0 24 24">
        <line {...w} x1="4" y1="4" x2="20" y2="4"/>
        <line {...w} x1="4" y1="20" x2="20" y2="20"/>
        <line {...w} x1="12" y1="4" x2="12" y2="20"/>
        <line {...w} x1="4" y1="4" x2="20" y2="4" strokeWidth="2.4"/>
        <line {...w} x1="4" y1="20" x2="20" y2="20" strokeWidth="2.4"/>
        <line {...w} x1="12" y1="4" x2="12" y2="20" strokeWidth="2.4"/>
      </svg>
    ),

    // P-trap pipe with drop — universal plumbing symbol
    "Plumbing": (
      <svg width={size} height={size} viewBox="0 0 24 24">
        <line {...w} x1="12" y1="2" x2="12" y2="8"/>
        <path {...w} d="M12 8 Q12 13 17 13 L17 16 Q17 20 12 20 L12 22"/>
        <line {...w} x1="8" y1="13" x2="12" y2="13"/>
      </svg>
    ),

    // Air handler / fan blades inside a circle
    "Mechanical (HVAC)": (
      <svg width={size} height={size} viewBox="0 0 24 24">
        <circle {...w} cx="12" cy="12" r="9"/>
        <path {...w} d="M12 12 C12 8 16 6 16 10 C16 10 14 10 12 12"/>
        <path {...w} d="M12 12 C16 12 18 16 14 16 C14 16 13 14 12 12"/>
        <path {...w} d="M12 12 C8 12 6 8 10 8 C10 8 11 10 12 12"/>
        <circle {...w} cx="12" cy="12" r="1.5"/>
      </svg>
    ),

    // Lightning bolt — clean electrical symbol
    "Electrical": (
      <svg width={size} height={size} viewBox="0 0 24 24">
        <polygon {...w} points="13,2 4,14 12,14 11,22 20,10 12,10 13,2"/>
      </svg>
    ),

    // Sprinkler head — fire protection
    "Fire Protection": (
      <svg width={size} height={size} viewBox="0 0 24 24">
        <line {...w} x1="12" y1="2" x2="12" y2="8"/>
        <circle {...w} cx="12" cy="10" r="2.5"/>
        <line {...w} x1="3" y1="10" x2="21" y2="10"/>
        <line {...w} x1="6" y1="10" x2="4" y2="16"/>
        <line {...w} x1="10" y1="10" x2="9" y2="16"/>
        <line {...w} x1="14" y1="10" x2="15" y2="16"/>
        <line {...w} x1="18" y1="10" x2="20" y2="16"/>
      </svg>
    ),

    // Building cross-section with wall cavity and exterior skin
    "Building Envelope": (
      <svg width={size} height={size} viewBox="0 0 24 24">
        <rect {...w} x="2" y="4" width="20" height="16"/>
        <line {...w} x1="6" y1="4" x2="6" y2="20"/>
        <line {...w} x1="18" y1="4" x2="18" y2="20"/>
        <line {...w} x1="6" y1="8" x2="18" y2="8" strokeDasharray="2,2"/>
        <line {...w} x1="6" y1="16" x2="18" y2="16" strokeDasharray="2,2"/>
      </svg>
    ),

    // Paint roller — interiors/finishes
    "Interiors / Finishes": (
      <svg width={size} height={size} viewBox="0 0 24 24">
        <rect {...w} x="3" y="4" width="16" height="7" rx="1"/>
        <line {...w} x1="11" y1="11" x2="11" y2="15"/>
        <rect {...w} x="8" y="15" width="6" height="5" rx="1"/>
        <line {...w} x1="3" y1="7.5" x2="1" y2="7.5"/>
        <line {...w} x1="19" y1="7.5" x2="21" y2="7.5"/>
      </svg>
    ),

    // Elevator cab with up/down arrows
    "Vertical Transportation": (
      <svg width={size} height={size} viewBox="0 0 24 24">
        <rect {...w} x="4" y="2" width="16" height="20" rx="1"/>
        <line {...w} x1="12" y1="2" x2="12" y2="22"/>
        <polyline {...w} points="7,9 5,7 3,9"/>
        <line {...w} x1="5" y1="7" x2="5" y2="13"/>
        <polyline {...w} points="17,15 19,17 21,15"/>
        <line {...w} x1="19" y1="17" x2="19" y2="11"/>
      </svg>
    ),

    // Wheelchair + ramp — ADA symbol
    "Accessibility / ADA": (
      <svg width={size} height={size} viewBox="0 0 24 24">
        <circle {...w} cx="12" cy="4" r="2"/>
        <path {...w} d="M9 9h6l1 5h3"/>
        <path {...w} d="M8 9 L7 14 A5 5 0 0 0 17 14"/>
        <line {...w} x1="3" y1="21" x2="12" y2="12"/>
      </svg>
    ),

    // Topographic site plan — contour lines + north arrow
    "Civil / Site": (
      <svg width={size} height={size} viewBox="0 0 24 24">
        <ellipse {...w} cx="12" cy="12" rx="9" ry="5"/>
        <ellipse {...w} cx="12" cy="12" rx="5" ry="2.5"/>
        <line {...w} x1="12" y1="2" x2="12" y2="7"/>
        <polyline {...w} points="9,5 12,2 15,5"/>
      </svg>
    ),

    // Network cable + RJ45 jack — low voltage
    "Technology / Low Voltage": (
      <svg width={size} height={size} viewBox="0 0 24 24">
        <rect {...w} x="7" y="14" width="10" height="6" rx="1"/>
        <line {...w} x1="9" y1="14" x2="9" y2="20"/>
        <line {...w} x1="12" y1="14" x2="12" y2="20"/>
        <line {...w} x1="15" y1="14" x2="15" y2="20"/>
        <path {...w} d="M7 14 L7 10 L5 10 L5 4 L9 4 L9 10"/>
        <path {...w} d="M17 14 L17 10 L19 10 L19 4 L15 4 L15 10"/>
        <line {...w} x1="9" y1="7" x2="15" y2="7"/>
      </svg>
    ),

    // Biohazard / warning drum — hazmat
    "Hazmat / Abatement": (
      <svg width={size} height={size} viewBox="0 0 24 24">
        <path {...w} d="M12 3 L2 20 L22 20 Z"/>
        <line {...w} x1="12" y1="9" x2="12" y2="14"/>
        <circle {...f} cx="12" cy="17" r="1.2"/>
      </svg>
    ),

    // Chef's hat + pan — food service
    "Food Service / Kitchen": (
      <svg width={size} height={size} viewBox="0 0 24 24">
        <path {...w} d="M8 14 Q8 8 12 8 Q16 8 16 14 Z"/>
        <line {...w} x1="6" y1="14" x2="18" y2="14"/>
        <line {...w} x1="8" y1="14" x2="8" y2="17"/>
        <line {...w} x1="16" y1="14" x2="16" y2="17"/>
        <line {...w} x1="6" y1="17" x2="18" y2="17"/>
        <line {...w} x1="19" y1="11" x2="22" y2="11"/>
      </svg>
    ),

    // Display/screen + speaker — AV
    "Technology / AV": (
      <svg width={size} height={size} viewBox="0 0 24 24">
        <rect {...w} x="2" y="4" width="15" height="11" rx="1"/>
        <line {...w} x1="9" y1="19" x2="9" y2="15"/>
        <line {...w} x1="5" y1="19" x2="13" y2="19"/>
        <path {...w} d="M19 7 Q22 9.5 19 12"/>
        <path {...w} d="M19 5 Q24 9.5 19 14"/>
      </svg>
    ),

    // Medical cross + gas cylinder
    "Medical Gas / Equipment": (
      <svg width={size} height={size} viewBox="0 0 24 24">
        <rect {...w} x="9" y="6" width="6" height="15" rx="2"/>
        <line {...w} x1="9" y1="10" x2="15" y2="10"/>
        <rect {...w} x="10" y="3" width="4" height="3"/>
        <line {...w} x1="6" y1="13" x2="3" y2="13"/>
        <line {...w} x1="3" y1="11" x2="3" y2="15"/>
        <line {...w} x1="1" y1="13" x2="3" y2="13"/>
      </svg>
    ),
  };

  const icon = icons[type] || (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <circle {...w} cx="12" cy="12" r="9"/>
      <line {...w} x1="12" y1="8" x2="12" y2="13"/>
      <circle {...f} cx="12" cy="16" r="1.2"/>
    </svg>
  );

  return (
    <div style={{
      width: bgSize, height: bgSize,
      background: B.pmgBlue,
      borderRadius: 4,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      {icon}
    </div>
  );
};

// Project type icons
const ProjectIcon = ({ type, size = 28, color = B.pmgBlue }) => {
  const s = { fill: "none", stroke: color, strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };
  const icons = {
    condo: <svg width={size} height={size} viewBox="0 0 24 24"><rect {...s} x="2" y="7" width="20" height="15"/><path {...s} d="M16 22V11H8v11"/><path {...s} d="M2 7l10-5 10 5"/><line {...s} x1="9" y1="22" x2="9" y2="14"/><line {...s} x1="15" y1="22" x2="15" y2="14"/></svg>,
    apartment: <svg width={size} height={size} viewBox="0 0 24 24"><rect {...s} x="2" y="3" width="20" height="19"/><line {...s} x1="2" y1="9" x2="22" y2="9"/><line {...s} x1="2" y1="15" x2="22" y2="15"/><line {...s} x1="8" y1="3" x2="8" y2="22"/><line {...s} x1="16" y1="3" x2="16" y2="22"/></svg>,
    office: <svg width={size} height={size} viewBox="0 0 24 24"><rect {...s} x="3" y="2" width="18" height="20"/><line {...s} x1="3" y1="7" x2="21" y2="7"/><line {...s} x1="3" y1="12" x2="21" y2="12"/><line {...s} x1="3" y1="17" x2="21" y2="17"/><line {...s} x1="8" y1="2" x2="8" y2="22"/></svg>,
    retrofit: <svg width={size} height={size} viewBox="0 0 24 24"><path {...s} d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
    hotel: <svg width={size} height={size} viewBox="0 0 24 24"><path {...s} d="M3 22V8l9-6 9 6v14"/><rect {...s} x="9" y="14" width="6" height="8"/><rect {...s} x="5" y="10" width="3" height="4"/><rect {...s} x="16" y="10" width="3" height="4"/></svg>,
    healthcare: <svg width={size} height={size} viewBox="0 0 24 24"><path {...s} d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
    education: <svg width={size} height={size} viewBox="0 0 24 24"><polyline {...s} points="22,9 12,4 2,9 12,14 22,9"/><line {...s} x1="6" y1="11.5" x2="6" y2="18"/><path {...s} d="M6 18c2 2 8 2 12-3"/></svg>,
    mixeduse: <svg width={size} height={size} viewBox="0 0 24 24"><rect {...s} x="2" y="7" width="9" height="15"/><rect {...s} x="13" y="2" width="9" height="20"/><line {...s} x1="2" y1="12" x2="11" y2="12"/></svg>,
  };
  return icons[type] || icons.office;
};

// ─── PMG Logo — exact match to uploaded image ────────────────────────────────
function PMLogo({ dark = true }) {
  const fill   = dark ? B.white   : B.pmgBlue;
  // On dark (blue) header the stripes should be the blue bg color so they read as gaps
  // On light bg the stripes should be white
  const stripe = dark ? B.pmgBlue : B.white;
  const text   = dark ? B.white   : B.black;
  const sub    = dark ? "rgba(255,255,255,0.55)" : B.mid;

  return (
    <div style={{ display:"flex", alignItems:"center", gap:14 }}>
      <svg width="72" height="48" viewBox="0 0 72 48" style={{ flexShrink:0 }}>
        {/* LEFT rhombus — solid fill */}
        <polygon points="2,24 20,4 38,24 20,44" fill={fill} />

        {/* RIGHT rhombus — solid fill first, then stripe lines cut through it */}
        <polygon points="20,24 38,4 56,24 38,44" fill={fill} />
        <clipPath id="pmgStripeClip">
          <polygon points="20,24 38,4 56,24 38,44" />
        </clipPath>
        <g clipPath="url(#pmgStripeClip)">
          {Array.from({length:20}, (_, i) => 4.5 + i * 2.05).map((y, i) => (
            <line key={i} x1="18" y1={y} x2="58" y2={y} stroke={stripe} strokeWidth="1.05" />
          ))}
        </g>
      </svg>

      <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
        <span style={{
          fontFamily:"'Helvetica Neue','Arial',sans-serif",
          fontWeight:400, fontSize:16, color:text,
          letterSpacing:"0.13em", lineHeight:1, textTransform:"uppercase",
        }}>Pavarini McGovern</span>
        <span style={{
          fontFamily:"'Helvetica Neue','Arial',sans-serif",
          fontWeight:300, fontSize:8, color:sub,
          letterSpacing:"0.2em", textTransform:"uppercase",
        }}>Preconstruction Intelligence</span>
      </div>
    </div>
  );
}

const NYC_CODE_VINTAGES = [
  { id: "1938", year: "1938", label: "1938 Building Code", tag: "BC 1938", color: "#5C4A1E", bg: "#FDF6E3", summary: "Pre-1968. Non-conforming conditions often allowed under Alt work." },
  { id: "1968", year: "1968", label: "1968 Building Code", tag: "BC 1968", color: "#3D4F1E", bg: "#F0F5E3", summary: "1968–2008 buildings. Default for most Alt-2/Alt-3 applications." },
  { id: "2014", year: "2014", label: "2014 Building Code", tag: "BC 2014", color: B.pmgBlue, bg: B.pmgBlueLt, summary: "2008–2022 buildings. Controlling for most current Alt-1 applications." },
  { id: "current", year: "Current", label: "2022 Building Code (Current)", tag: "BC 2022", color: "#1A1A1A", bg: "#F0F0F0", summary: "New construction & major alterations filed after Nov 7, 2022." },
];

const ALL_DISCIPLINES = [
  "Architectural","Structural","Plumbing","Mechanical (HVAC)","Electrical",
  "Fire Protection","Building Envelope","Interiors / Finishes","Vertical Transportation",
  "Accessibility / ADA","Civil / Site","Technology / Low Voltage","Hazmat / Abatement",
  "Food Service / Kitchen","Technology / AV","Medical Gas / Equipment",
];

const PROJECT_TYPES = [
  { id: "condo",      label: "Condominium",          },
  { id: "apartment",  label: "Apartment Building",   },
  { id: "office",     label: "Office / Commercial",  },
  { id: "retrofit",   label: "Retrofit / Renovation",},
  { id: "hotel",      label: "Hotel / Hospitality",  },
  { id: "healthcare", label: "Healthcare / Medical", },
  { id: "education",  label: "Education",            },
  { id: "mixeduse",   label: "Mixed-Use",            },
];

const LL_CHECKLIST = {
  condo:      [{ code:"LL58", title:"Accessibility in Alterations", req:"20% path of travel rule applies." },{ code:"LL97", title:"Carbon Emissions", req:"Buildings >25K SF must show compliance by 2024." },{ code:"LL126", title:"Facade Inspection", req:"Licensed inspector required if facade work." }],
  apartment:  [{ code:"LL58", title:"Accessibility in Alterations", req:"20% path of travel rule applies." },{ code:"LL97", title:"Carbon Emissions", req:"Buildings >25K SF must show compliance." },{ code:"LL126", title:"Facade Inspection", req:"Licensed inspector required." }],
  office:     [{ code:"LL58", title:"Accessibility in Alterations", req:"20% path of travel rule applies." },{ code:"LL97", title:"Carbon Emissions", req:"Buildings >25K SF must demonstrate compliance." },{ code:"LL87", title:"Energy Efficiency", req:"Retrofit baseline performance required." }],
  retrofit:   [{ code:"LL58", title:"Accessibility in Alterations", req:"20% path of travel rule. Critical for retrofit." },{ code:"LL97", title:"Carbon Emissions", req:"Retrofit >25K SF major cost/schedule driver." },{ code:"LL126", title:"Facade Inspection", req:"Licensed inspector & remediation required." }],
  hotel:      [{ code:"LL58", title:"Accessibility in Alterations", req:"20% path of travel to public spaces." },{ code:"LL97", title:"Carbon Emissions", req:"Hotels >25K SF must show compliance." }],
  healthcare: [{ code:"LL58", title:"Accessibility in Alterations", req:"Full ADA compliance required." },{ code:"LL97", title:"Carbon Emissions", req:"Healthcare >25K SF must show compliance." }],
  education:  [{ code:"LL58", title:"Accessibility in Alterations", req:"Full accessibility for educational facilities." },{ code:"LL97", title:"Carbon Emissions", req:"Schools must demonstrate compliance." }],
  mixeduse:   [{ code:"LL58", title:"Accessibility in Alterations", req:"20% rule applies to entire path." },{ code:"LL97", title:"Carbon Emissions", req:"Buildings >25K SF must show compliance." }],
};

// ─── Step Bar ─────────────────────────────────────────────────────────────────
function StepBar({ step }) {
  const steps = ["Project Type","Building Code","Disciplines","Upload & Analyze"];
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:0, marginBottom:36 }}>
      {steps.map((s,i) => (
        <div key={s} style={{ display:"flex", alignItems:"center" }}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
            <div style={{
              width:28, height:28, borderRadius:"50%",
              background: i<step ? B.pmgBlue : i===step ? B.black : B.fog,
              color: i<=step ? B.white : B.silver,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontWeight:600, fontSize:12,
              fontFamily:"'Helvetica Neue',Arial,sans-serif",
              border:`2px solid ${i===step ? B.pmgBlue : i<step ? B.pmgBlue : B.rule}`,
              transition:"all 0.2s",
            }}>{i<step?"✓":i+1}</div>
            <span style={{ fontSize:10, color:i===step?B.black:B.silver, fontWeight:i===step?600:400, whiteSpace:"nowrap", fontFamily:"'Helvetica Neue',Arial,sans-serif", letterSpacing:"0.04em" }}>{s}</span>
          </div>
          {i<steps.length-1 && <div style={{ width:44, height:1, background:i<step?B.pmgBlue:B.rule, margin:"0 6px", marginBottom:20, transition:"background 0.3s" }}/>}
        </div>
      ))}
    </div>
  );
}

function Btn({ onClick, disabled, dark, children, style={} }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding:"11px 20px", border:"none", borderRadius:2, cursor:disabled?"not-allowed":"pointer",
      background: dark ? (disabled?B.fog:B.black) : B.fog,
      color: dark ? (disabled?B.silver:B.white) : B.mid,
      fontFamily:"'Helvetica Neue',Arial,sans-serif", fontWeight:600,
      fontSize:12, letterSpacing:"0.07em", textTransform:"uppercase",
      transition:"all 0.15s", ...style,
    }}>{children}</button>
  );
}

// ─── Step 1: Project Type ─────────────────────────────────────────────────────
function Step1({ onSelect }) {
  const [hov, setHov] = useState(null);
  return (
    <div>
      <div style={{ textAlign:"center", marginBottom:28 }}>
        <div style={{ fontSize:10, fontWeight:600, color:B.pmgBlue, letterSpacing:"0.16em", marginBottom:8, fontFamily:"'Helvetica Neue',Arial,sans-serif", textTransform:"uppercase" }}>Step 01</div>
        <h2 style={{ fontSize:20, fontWeight:300, color:B.black, margin:"0 0 8px", fontFamily:"'Helvetica Neue',Arial,sans-serif", letterSpacing:"0.04em" }}>What type of project is this?</h2>
        <p style={{ color:B.mid, fontSize:13, margin:0, fontFamily:"'Helvetica Neue',Arial,sans-serif" }}>Determines relevant disciplines and NYC code considerations.</p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:8 }}>
        {PROJECT_TYPES.map(pt => (
          <div key={pt.id} onClick={()=>onSelect(pt)}
            onMouseEnter={()=>setHov(pt.id)} onMouseLeave={()=>setHov(null)}
            style={{ background:hov===pt.id?B.pmgBlue:B.white, border:`1px solid ${hov===pt.id?B.pmgBlue:B.rule}`, borderRadius:2, padding:"18px 14px", cursor:"pointer", transition:"all 0.15s", textAlign:"center" }}>
            <div style={{ marginBottom:10, display:"flex", justifyContent:"center" }}>
              <ProjectIcon type={pt.id} size={26} color={hov===pt.id?B.white:B.pmgBlue} />
            </div>
            <div style={{ fontWeight:500, fontSize:12, color:hov===pt.id?B.white:B.black, fontFamily:"'Helvetica Neue',Arial,sans-serif", letterSpacing:"0.02em" }}>{pt.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Step 2: Building Code ────────────────────────────────────────────────────
function Step2({ projectType, onBack, onSelect }) {
  const [hov, setHov] = useState(null);
  return (
    <div>
      <div style={{ textAlign:"center", marginBottom:28 }}>
        <div style={{ fontSize:10, fontWeight:600, color:B.pmgBlue, letterSpacing:"0.16em", marginBottom:8, fontFamily:"'Helvetica Neue',Arial,sans-serif", textTransform:"uppercase" }}>Step 02</div>
        <h2 style={{ fontSize:20, fontWeight:300, color:B.black, margin:"0 0 8px", fontFamily:"'Helvetica Neue',Arial,sans-serif" }}>Applicable building code vintage</h2>
        <p style={{ color:B.mid, fontSize:13, margin:0 }}>This determines scope and compliance for your <strong>{projectType.label}</strong>.</p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:10, marginBottom:20 }}>
        {NYC_CODE_VINTAGES.map(code => (
          <div key={code.id} onClick={()=>onSelect(code)}
            onMouseEnter={()=>setHov(code.id)} onMouseLeave={()=>setHov(null)}
            style={{ background:hov===code.id?code.bg:B.white, border:`1.5px solid ${hov===code.id?code.color:B.rule}`, borderRadius:2, padding:"16px", cursor:"pointer", transition:"all 0.15s" }}>
            <div style={{ background:code.bg, color:code.color, fontSize:9, fontWeight:700, padding:"2px 8px", borderRadius:2, display:"inline-block", marginBottom:8, letterSpacing:"0.1em", fontFamily:"'Helvetica Neue',Arial,sans-serif" }}>{code.tag}</div>
            <div style={{ fontWeight:600, fontSize:13, color:B.black, marginBottom:5, fontFamily:"'Helvetica Neue',Arial,sans-serif" }}>{code.label}</div>
            <div style={{ fontSize:12, color:B.mid, lineHeight:1.6, fontFamily:"'Helvetica Neue',Arial,sans-serif" }}>{code.summary}</div>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", gap:8 }}>
        <Btn onClick={onBack}>← Back</Btn>
        <Btn dark disabled style={{ flex:1 }}>Select a Code Vintage</Btn>
      </div>
    </div>
  );
}

// ─── Step 3: Disciplines ──────────────────────────────────────────────────────
function Step3({ projectType, codeVintage, onBack, onNext }) {
  const [sel, setSel] = useState([]);
  const toggle = d => setSel(p => p.includes(d)?p.filter(x=>x!==d):[...p,d]);
  const all = sel.length===ALL_DISCIPLINES.length;
  return (
    <div>
      <div style={{ textAlign:"center", marginBottom:24 }}>
        <div style={{ fontSize:10, fontWeight:600, color:B.pmgBlue, letterSpacing:"0.16em", marginBottom:8, fontFamily:"'Helvetica Neue',Arial,sans-serif", textTransform:"uppercase" }}>Step 03</div>
        <h2 style={{ fontSize:20, fontWeight:300, color:B.black, margin:"0 0 8px", fontFamily:"'Helvetica Neue',Arial,sans-serif" }}>Select disciplines to analyze</h2>
        <p style={{ color:B.mid, fontSize:13, margin:0 }}>Under <strong>{codeVintage.label}</strong> · Only selected trades will be scanned.</p>
      </div>
      <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:10 }}>
        <button onClick={()=>setSel(all?[]:ALL_DISCIPLINES)} style={{ background:"transparent", border:`1px solid ${B.pmgBlue}`, color:B.pmgBlue, borderRadius:2, padding:"4px 12px", fontSize:10, fontWeight:600, cursor:"pointer", letterSpacing:"0.08em", fontFamily:"'Helvetica Neue',Arial,sans-serif", textTransform:"uppercase" }}>
          {all?"Deselect All":"Select All"}
        </button>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:6, marginBottom:20 }}>
        {ALL_DISCIPLINES.map(d => {
          const on = sel.includes(d);
          return (
            <div key={d} onClick={()=>toggle(d)} style={{
              background:on?B.pmgBlueLt:B.white, border:`1px solid ${on?B.pmgBlue:B.rule}`,
              borderRadius:2, padding:"10px 12px", cursor:"pointer",
              display:"flex", alignItems:"center", gap:10, transition:"all 0.12s",
            }}>
              <div style={{ width:14, height:14, borderRadius:1, flexShrink:0, background:on?B.pmgBlue:B.fog, border:`1px solid ${on?B.pmgBlue:B.rule}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, color:B.white, fontWeight:700 }}>
                {on?"✓":""}
              </div>
              <DisciplineIcon type={d} size={14} bgSize={22} />
              <span style={{ fontSize:12, fontWeight:on?600:400, color:on?B.black:B.steel, fontFamily:"'Helvetica Neue',Arial,sans-serif" }}>{d}</span>
            </div>
          );
        })}
      </div>
      <div style={{ display:"flex", gap:8 }}>
        <Btn onClick={onBack}>← Back</Btn>
        <Btn dark disabled={sel.length===0} onClick={()=>sel.length>0&&onNext(sel)} style={{ flex:1 }}>
          {sel.length===0?"Select at Least One Discipline":`Continue with ${sel.length} Discipline${sel.length>1?"s":""} →`}
        </Btn>
      </div>
    </div>
  );
}

// ─── Step 4: Upload ───────────────────────────────────────────────────────────
function Step4({ projectType, codeVintage, disciplines, projectName, setProjectName, onBack, onAnalyzeWithFiles }) {
  const [drawings, setDrawings] = useState(null);
  const [specs, setSpecs] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState("");
  const drawRef = useRef(), specRef = useRef();
  const ready = drawings || specs;

  const handleAnalyze = async () => {
    if (!ready) return;
    setAnalyzing(true);
    await onAnalyzeWithFiles(drawings, specs, projectType, codeVintage, disciplines, projectName, setProgress, setPhase);
  };

  return (
    <div>
      <div style={{ textAlign:"center", marginBottom:24 }}>
        <div style={{ fontSize:10, fontWeight:600, color:B.pmgBlue, letterSpacing:"0.16em", marginBottom:8, fontFamily:"'Helvetica Neue',Arial,sans-serif", textTransform:"uppercase" }}>Step 04</div>
        <h2 style={{ fontSize:20, fontWeight:300, color:B.black, margin:"0 0 8px", fontFamily:"'Helvetica Neue',Arial,sans-serif" }}>Upload documents & run analysis</h2>
        <p style={{ color:B.mid, fontSize:13, margin:0 }}>Claude AI will read and analyze your actual project documents.</p>
      </div>
      {!analyzing ? (
        <>
          <div style={{ marginBottom:14 }}>
            <label style={{ display:"block", fontSize:10, fontWeight:600, color:B.steel, letterSpacing:"0.1em", marginBottom:6, fontFamily:"'Helvetica Neue',Arial,sans-serif", textTransform:"uppercase" }}>Project Name</label>
            <input value={projectName} onChange={e=>setProjectName(e.target.value)} placeholder="e.g. 25 Water Street — Residential Conversion"
              style={{ width:"100%", padding:"10px 12px", border:`1px solid ${B.rule}`, borderRadius:2, fontSize:13, fontFamily:"'Helvetica Neue',Arial,sans-serif", color:B.black, boxSizing:"border-box", outline:"none" }} />
          </div>
          {[
            { label:"Construction Drawings", sub:"Upload PDF drawings or sheet sets", state:drawings, set:setDrawings, ref:drawRef, icon:"📐", accept:".pdf,.txt" },
            { label:"Project Specifications", sub:"Upload MasterSpec, CSI sections, or project manual", state:specs, set:setSpecs, ref:specRef, icon:"📋", accept:".pdf,.docx,.txt" },
          ].map(item => (
            <div key={item.label} onClick={()=>item.ref.current.click()} style={{
              border:`1.5px dashed ${item.state?B.pmgBlue:B.rule}`, borderRadius:2,
              padding:"18px 16px", marginBottom:10, cursor:"pointer",
              background:item.state?B.pmgBlueLt:B.fog, transition:"all 0.2s",
            }}>
              <input ref={item.ref} type="file" style={{ display:"none" }} accept={item.accept} onChange={e=>e.target.files[0]&&item.set(e.target.files[0])} />
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:36, height:36, borderRadius:2, background:item.state?B.pmgBlue:B.rule, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  {item.state
                    ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="20,6 9,17 4,12"/></svg>
                    : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={B.mid} strokeWidth="1.6" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17,8 12,3 7,8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  }
                </div>
                <div>
                  <div style={{ fontWeight:600, fontSize:13, color:B.black, fontFamily:"'Helvetica Neue',Arial,sans-serif" }}>{item.label}</div>
                  <div style={{ fontSize:11, color:item.state?B.pmgBlue:B.mid, marginTop:2, fontFamily:"'Helvetica Neue',Arial,sans-serif" }}>{item.state?item.state.name:item.sub}</div>
                </div>
              </div>
            </div>
          ))}
          <div style={{ background:B.pmgBlueLt, border:`1px solid ${B.pmgBlue}`, borderRadius:2, padding:"10px 14px", marginBottom:14 }}>
            <div style={{ fontSize:11, color:B.pmgBlue, lineHeight:1.6, fontFamily:"'Helvetica Neue',Arial,sans-serif" }}>
              <strong>Note:</strong> Text-based PDFs work best. Scanned drawings require OCR. Uploading drawings OR specs is sufficient — both is better.
            </div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <Btn onClick={onBack}>← Back</Btn>
            <Btn dark disabled={!ready} onClick={handleAnalyze} style={{ flex:1 }}>
              {ready?"Run Scope Gap Analysis →":"Upload Drawings or Specs to Continue"}
            </Btn>
          </div>
        </>
      ) : (
        <div style={{ background:B.white, borderRadius:2, padding:"36px 32px", border:`1px solid ${B.rule}`, textAlign:"center" }}>
          <div style={{ marginBottom:20, display:"flex", justifyContent:"center" }}>
            <svg width="72" height="48" viewBox="0 0 72 48">
              <polygon points="2,24 20,4 38,24 20,44" fill={B.pmgBlue}/>
              <clipPath id="pmgClipLoader">
                <polygon points="20,24 38,4 56,24 38,44"/>
              </clipPath>
              <g clipPath="url(#pmgClipLoader)">
                {Array.from({length:18},(_,i)=>5+i*2.2).map((y,i)=>(
                  <line key={i} x1="18" y1={y} x2="58" y2={y} stroke={B.pmgBlue} strokeWidth="1.1"/>
                ))}
              </g>
            </svg>
          </div>
          <div style={{ fontSize:10, fontWeight:600, color:B.mid, letterSpacing:"0.14em", marginBottom:14, fontFamily:"'Helvetica Neue',Arial,sans-serif", textTransform:"uppercase" }}>Analyzing with Claude AI</div>
          <div style={{ background:B.fog, borderRadius:999, height:3, marginBottom:12, overflow:"hidden" }}>
            <div style={{ height:"100%", borderRadius:999, background:B.pmgBlue, width:`${progress}%`, transition:"width 0.55s ease" }}/>
          </div>
          <div style={{ fontSize:12, color:B.steel, marginBottom:6, fontStyle:"italic", fontFamily:"'Helvetica Neue',Arial,sans-serif" }}>{phase}</div>
          <div style={{ fontSize:28, fontWeight:300, color:B.black, fontFamily:"'Helvetica Neue',Arial,sans-serif" }}>{progress}%</div>
        </div>
      )}
    </div>
  );
}

// ─── Gap Card ─────────────────────────────────────────────────────────────────
function GapCard({ gap, onView }) {
  const s = SEV[gap.severity];
  const [hov, setHov] = useState(false);
  return (
    <div onClick={()=>onView(gap)} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ background:B.white, border:`1px solid ${hov?B.rule:"#EBEBEB"}`, borderLeft:`3px solid ${s.color}`, borderRadius:2, padding:"14px 16px", marginBottom:8, cursor:"pointer", boxShadow:hov?"0 2px 12px rgba(0,0,0,0.06)":"none", transition:"all 0.15s" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12 }}>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", gap:6, marginBottom:7, flexWrap:"wrap", alignItems:"center" }}>
            <span style={{ background:s.bg, color:s.color, fontSize:9, fontWeight:700, padding:"2px 7px", borderRadius:1, letterSpacing:"0.1em", fontFamily:"'Helvetica Neue',Arial,sans-serif", textTransform:"uppercase" }}>{s.label}</span>
            <DisciplineIcon type={gap.discipline} size={12} bgSize={20} />
            <span style={{ background:B.fog, color:B.mid, fontSize:9, fontWeight:600, padding:"2px 7px", borderRadius:1, fontFamily:"'Helvetica Neue',Arial,sans-serif" }}>{gap.discipline}</span>
            {gap.status==="Resolved"&&<span style={{ background:"#EFF7F2", color:B.green, fontSize:9, fontWeight:700, padding:"2px 7px", borderRadius:1, letterSpacing:"0.08em" }}>✓ Resolved</span>}
          </div>
          <div style={{ fontWeight:600, fontSize:14, color:B.black, marginBottom:4, fontFamily:"'Helvetica Neue',Arial,sans-serif" }}>{gap.title}</div>
          <div style={{ fontSize:12, color:B.mid, lineHeight:1.55, fontFamily:"'Helvetica Neue',Arial,sans-serif" }}>{gap.description}</div>
          <div style={{ display:"flex", gap:14, marginTop:8 }}>
            <span style={{ fontSize:10, color:B.silver, fontFamily:"'Helvetica Neue',Arial,sans-serif" }}>Dwg: <strong style={{ color:B.steel }}>{gap.drawingRef}</strong></span>
            <span style={{ fontSize:10, color:B.silver }}>Spec: <strong style={{ color:B.steel }}>{gap.specRef}</strong></span>
          </div>
        </div>
        <div style={{ textAlign:"right", minWidth:95, flexShrink:0 }}>
          <div style={{ fontSize:9, color:B.silver, marginBottom:2, letterSpacing:"0.06em", textTransform:"uppercase" }}>Cost Risk</div>
          <div style={{ fontWeight:700, fontSize:12, color:B.red, fontFamily:"'Helvetica Neue',Arial,sans-serif" }}>{gap.costRisk}</div>
          <div style={{ fontSize:9, color:B.silver, marginTop:6, marginBottom:2, letterSpacing:"0.06em", textTransform:"uppercase" }}>Schedule</div>
          <div style={{ fontWeight:700, fontSize:12, color:B.amber, fontFamily:"'Helvetica Neue',Arial,sans-serif" }}>{gap.scheduleRisk}</div>
        </div>
      </div>
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function Modal({ gap, onClose, onUpdate }) {
  const s = SEV[gap.severity];
  const [assignee, setAssignee] = useState(gap.assignedTo||"Unassigned");
  const [note, setNote] = useState(gap.note||"");
  const [status, setStatus] = useState(gap.status||"Open");
  const save = () => { onUpdate({...gap,assignedTo:assignee,note,status}); onClose(); };
  const inputStyle = { width:"100%", padding:"8px 10px", border:`1px solid ${B.rule}`, borderRadius:2, fontSize:12, fontFamily:"'Helvetica Neue',Arial,sans-serif", color:B.black, background:B.white, boxSizing:"border-box" };
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:B.white, borderRadius:2, maxWidth:640, width:"100%", padding:"28px 32px", boxShadow:"0 20px 60px rgba(0,0,0,0.2)", position:"relative", maxHeight:"90vh", overflowY:"auto" }}>
        <button onClick={onClose} style={{ position:"absolute", top:14, right:14, background:B.fog, border:"none", borderRadius:2, width:28, height:28, cursor:"pointer", fontSize:16, color:B.mid, display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
        <div style={{ display:"flex", gap:6, marginBottom:12 }}>
          <span style={{ background:s.bg, color:s.color, fontSize:9, fontWeight:700, padding:"3px 8px", borderRadius:1, letterSpacing:"0.1em", textTransform:"uppercase" }}>{s.label}</span>
          <span style={{ background:B.fog, color:B.mid, fontSize:9, fontWeight:600, padding:"3px 8px", borderRadius:1 }}>{gap.discipline}</span>
        </div>
        <h2 style={{ fontWeight:600, fontSize:18, color:B.black, marginBottom:10, fontFamily:"'Helvetica Neue',Arial,sans-serif" }}>{gap.title}</h2>
        <p style={{ fontSize:13, color:B.steel, lineHeight:1.75, marginBottom:18, fontFamily:"'Helvetica Neue',Arial,sans-serif" }}>{gap.description}</p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:18 }}>
          {[{label:"Drawing Ref",value:gap.drawingRef},{label:"Spec Ref",value:gap.specRef},{label:"Cost Risk",value:gap.costRisk,red:true},{label:"Schedule",value:gap.scheduleRisk,amber:true}].map(item=>(
            <div key={item.label} style={{ background:B.fog, borderRadius:2, padding:"10px 12px" }}>
              <div style={{ fontSize:9, color:B.silver, marginBottom:4, letterSpacing:"0.08em", textTransform:"uppercase", fontFamily:"'Helvetica Neue',Arial,sans-serif" }}>{item.label}</div>
              <div style={{ fontWeight:600, fontSize:13, color:item.red?B.red:item.amber?B.amber:B.black, fontFamily:"'Helvetica Neue',Arial,sans-serif" }}>{item.value}</div>
            </div>
          ))}
        </div>
        <div style={{ background:"#F0F7F2", border:`1px solid #B8DFC8`, borderRadius:2, padding:"12px 14px", marginBottom:18 }}>
          <div style={{ fontSize:9, fontWeight:700, color:B.green, marginBottom:5, letterSpacing:"0.1em", textTransform:"uppercase", fontFamily:"'Helvetica Neue',Arial,sans-serif" }}>Recommended Action</div>
          <div style={{ fontSize:13, color:"#155B30", lineHeight:1.65, fontFamily:"'Helvetica Neue',Arial,sans-serif" }}>{gap.recommendation}</div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
          <div>
            <label style={{ display:"block", fontSize:9, fontWeight:600, color:B.steel, letterSpacing:"0.1em", marginBottom:5, textTransform:"uppercase" }}>Assign To</label>
            <select value={assignee} onChange={e=>setAssignee(e.target.value)} style={inputStyle}>
              {["Unassigned","CM / Project Manager","Senior Superintendent","Preconstruction Manager","Design Coordinator","Owner"].map(r=><option key={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display:"block", fontSize:9, fontWeight:600, color:B.steel, letterSpacing:"0.1em", marginBottom:5, textTransform:"uppercase" }}>Status</label>
            <select value={status} onChange={e=>setStatus(e.target.value)} style={inputStyle}>
              {["Open","In Review","Sent to Design Team","Resolved"].map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div style={{ marginBottom:18 }}>
          <label style={{ display:"block", fontSize:9, fontWeight:600, color:B.steel, letterSpacing:"0.1em", marginBottom:5, textTransform:"uppercase" }}>Internal Note</label>
          <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Add context or decisions..." rows={3} style={{ ...inputStyle, resize:"vertical" }}/>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={save} style={{ flex:1, padding:"11px 0", background:B.pmgBlue, color:B.white, border:"none", borderRadius:2, fontWeight:600, fontSize:11, cursor:"pointer", fontFamily:"'Helvetica Neue',Arial,sans-serif", letterSpacing:"0.1em", textTransform:"uppercase" }}>Save & Close</button>
          <button onClick={onClose} style={{ flex:1, padding:"11px 0", background:B.fog, color:B.steel, border:"none", borderRadius:2, fontWeight:600, fontSize:11, cursor:"pointer", fontFamily:"'Helvetica Neue',Arial,sans-serif", letterSpacing:"0.08em" }}>Discard</button>
        </div>
      </div>
    </div>
  );
}

// ─── Results ──────────────────────────────────────────────────────────────────
function Results({ projectType, codeVintage, disciplines, projectName, gaps: initialGaps, onReset }) {
  const [gaps, setGaps] = useState(initialGaps);
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState("gaps");
  const [sevFilter, setSevFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [exported, setExported] = useState(false);

  const counts = { CRITICAL:0, HIGH:0, MEDIUM:0, LOW:0 };
  gaps.forEach(g=>counts[g.severity]++);

  const filtered = gaps.filter(g => {
    const ms = sevFilter==="ALL"||g.severity===sevFilter;
    const mq = !search||g.title.toLowerCase().includes(search.toLowerCase())||g.discipline.toLowerCase().includes(search.toLowerCase());
    return ms&&mq;
  });

  const updateGap = updated => setGaps(p=>p.map(g=>g.id===updated.id?updated:g));

  const doExport = () => {
    const sevColor = { CRITICAL:"#C0392B", HIGH:"#C07A2B", MEDIUM:"#1B4F91", LOW:"#1A6B3A" };
    const sevBg    = { CRITICAL:"#FDF0EF", HIGH:"#FDF6EF", MEDIUM:"#EBF1F9", LOW:"#EFF7F2" };
    const date     = new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"});
    const total    = gaps.length;
    const crit     = gaps.filter(g=>g.severity==="CRITICAL").length;
    const high     = gaps.filter(g=>g.severity==="HIGH").length;
    const med      = gaps.filter(g=>g.severity==="MEDIUM").length;
    const low      = gaps.filter(g=>g.severity==="LOW").length;
    const open     = gaps.filter(g=>g.status!=="Resolved").length;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>PMG Scope Gap Report — ${projectName||"Project"}</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'Helvetica Neue',Arial,sans-serif; color:#111; background:#fff; font-size:11px; }
  @media print { body { font-size:10px; } .no-print { display:none; } @page { margin:15mm; } }

  .header { background:#1B4F91; color:#fff; padding:20px 32px; display:flex; align-items:center; justify-content:space-between; }
  .logo-mark { display:flex; align-items:center; gap:14px; }
  .logo-text { display:flex; flex-direction:column; gap:3px; }
  .logo-name { font-size:16px; font-weight:400; letter-spacing:0.13em; text-transform:uppercase; }
  .logo-sub  { font-size:8px; font-weight:300; letter-spacing:0.2em; text-transform:uppercase; opacity:0.7; }
  .header-right { text-align:right; font-size:10px; opacity:0.8; line-height:1.7; }

  .accent-bar { height:3px; background:#111; }

  .meta { background:#f5f5f5; border-bottom:1px solid #ddd; padding:12px 32px; display:flex; gap:32px; flex-wrap:wrap; }
  .meta-item { display:flex; flex-direction:column; gap:2px; }
  .meta-label { font-size:8px; font-weight:600; color:#999; letter-spacing:0.1em; text-transform:uppercase; }
  .meta-value { font-size:12px; font-weight:600; color:#111; }

  .summary { padding:20px 32px; border-bottom:1px solid #ddd; }
  .summary-title { font-size:10px; font-weight:600; color:#999; letter-spacing:0.12em; text-transform:uppercase; margin-bottom:12px; }
  .summary-cards { display:flex; gap:12px; flex-wrap:wrap; }
  .card { border:1px solid #ddd; border-radius:2px; padding:10px 16px; min-width:90px; }
  .card-label { font-size:8px; color:#999; font-weight:600; text-transform:uppercase; letter-spacing:0.08em; margin-bottom:4px; }
  .card-val { font-size:22px; font-weight:300; }

  .sev-bar { display:flex; height:4px; border-radius:99px; overflow:hidden; margin-top:12px; }
  .sev-seg-CRITICAL { background:#C0392B; }
  .sev-seg-HIGH     { background:#C07A2B; }
  .sev-seg-MEDIUM   { background:#1B4F91; }
  .sev-seg-LOW      { background:#1A6B3A; }

  .gaps-section { padding:20px 32px; }
  .gaps-title { font-size:10px; font-weight:600; color:#999; letter-spacing:0.12em; text-transform:uppercase; margin-bottom:14px; }

  .gap { border:1px solid #e0e0e0; border-radius:2px; margin-bottom:10px; page-break-inside:avoid; }
  .gap-header { display:flex; align-items:flex-start; justify-content:space-between; padding:12px 14px 8px; gap:12px; }
  .gap-left { flex:1; }
  .gap-badges { display:flex; gap:6px; margin-bottom:6px; flex-wrap:wrap; align-items:center; }
  .badge { font-size:8px; font-weight:700; padding:2px 7px; border-radius:1px; letter-spacing:0.08em; text-transform:uppercase; }
  .gap-title { font-size:13px; font-weight:600; color:#111; margin-bottom:4px; }
  .gap-desc { font-size:11px; color:#555; line-height:1.6; }
  .gap-right { text-align:right; min-width:100px; flex-shrink:0; }
  .gap-right-label { font-size:8px; color:#bbb; letter-spacing:0.06em; text-transform:uppercase; margin-bottom:2px; }
  .gap-right-val { font-size:12px; font-weight:600; margin-bottom:6px; }

  .gap-body { border-top:1px solid #f0f0f0; padding:10px 14px; display:grid; grid-template-columns:1fr 1fr; gap:8px; }
  .gap-field-label { font-size:8px; color:#bbb; text-transform:uppercase; letter-spacing:0.08em; margin-bottom:2px; }
  .gap-field-val { font-size:11px; color:#333; font-weight:500; }

  .rec { background:#F0F7F2; border-top:1px solid #B8DFC8; padding:10px 14px; }
  .rec-label { font-size:8px; font-weight:700; color:#1A6B3A; letter-spacing:0.1em; text-transform:uppercase; margin-bottom:4px; }
  .rec-text { font-size:11px; color:#155B30; line-height:1.6; }

  .footer { padding:16px 32px; border-top:1px solid #ddd; display:flex; align-items:center; justify-content:space-between; margin-top:20px; }
  .footer-text { font-size:9px; color:#bbb; letter-spacing:0.06em; text-transform:uppercase; }

  .print-btn { position:fixed; bottom:24px; right:24px; background:#1B4F91; color:#fff; border:none; padding:12px 20px; border-radius:2px; font-size:12px; font-weight:600; cursor:pointer; letter-spacing:0.08em; text-transform:uppercase; box-shadow:0 4px 16px rgba(0,0,0,0.2); }

  /* Left border color per severity */
  .gap-CRITICAL { border-left:4px solid #C0392B; }
  .gap-HIGH     { border-left:4px solid #C07A2B; }
  .gap-MEDIUM   { border-left:4px solid #1B4F91; }
  .gap-LOW      { border-left:4px solid #1A6B3A; }
</style>
</head>
<body>

<div class="header">
  <div class="logo-mark">
    <svg width="64" height="44" viewBox="0 0 72 48">
      <polygon points="2,24 20,4 38,24 20,44" fill="white"/>
      <polygon points="20,24 38,4 56,24 38,44" fill="white"/>
      <clipPath id="rc"><polygon points="20,24 38,4 56,24 38,44"/></clipPath>
      <g clip-path="url(#rc)">
        ${Array.from({length:20},(_,i)=>5+i*2.05).map(y=>'<line x1="18" y1="'+y+'" x2="58" y2="'+y+'" stroke="#1B4F91" stroke-width="1.05"/>').join("")}
      </g>
    </svg>
    <div class="logo-text">
      <div class="logo-name">Pavarini McGovern</div>
      <div class="logo-sub">Preconstruction Intelligence</div>
    </div>
  </div>
  <div class="header-right">
    Scope Gap Report<br/>
    ${date}
  </div>
</div>
<div class="accent-bar"></div>

<div class="meta">
  <div class="meta-item"><div class="meta-label">Project</div><div class="meta-value">${projectName||"Untitled Project"}</div></div>
  <div class="meta-item"><div class="meta-label">Project Type</div><div class="meta-value">${projectType.label}</div></div>
  <div class="meta-item"><div class="meta-label">Building Code</div><div class="meta-value">${codeVintage.label}</div></div>
  <div class="meta-item"><div class="meta-label">Disciplines</div><div class="meta-value">${disciplines.length} Analyzed</div></div>
</div>

<div class="summary">
  <div class="summary-title">Executive Summary</div>
  <div class="summary-cards">
    <div class="card"><div class="card-label">Total Gaps</div><div class="card-val" style="color:#111">${total}</div></div>
    <div class="card"><div class="card-label">Critical</div><div class="card-val" style="color:#C0392B">${crit}</div></div>
    <div class="card"><div class="card-label">High</div><div class="card-val" style="color:#C07A2B">${high}</div></div>
    <div class="card"><div class="card-label">Medium</div><div class="card-val" style="color:#1B4F91">${med}</div></div>
    <div class="card"><div class="card-label">Low</div><div class="card-val" style="color:#1A6B3A">${low}</div></div>
    <div class="card"><div class="card-label">Open Items</div><div class="card-val" style="color:#C07A2B">${open}</div></div>
  </div>
  <div class="sev-bar">
    ${crit?'<div class="sev-seg-CRITICAL" style="flex:'+crit+'"></div>':""}
    ${high?'<div class="sev-seg-HIGH" style="flex:'+high+'"></div>':""}
    ${med?'<div class="sev-seg-MEDIUM" style="flex:'+med+'"></div>':""}
    ${low?'<div class="sev-seg-LOW" style="flex:'+low+'"></div>':""}
  </div>
  <div style="margin-top:10px; font-size:10px; color:#555;">
    Disciplines: ${disciplines.join(" · ")}
  </div>
</div>

<div class="gaps-section">
  <div class="gaps-title">Scope Gaps — Full Detail</div>
  ${gaps.map((g,i)=>{
    const assigneeBadge = g.assignedTo!=="Unassigned" ? '<span class="badge" style="background:#EBF1F9;color:#1B4F91">👤 '+g.assignedTo+'</span>' : "";
    const noteLine = g.note ? '<div class="rec-text" style="margin-top:6px;color:#555"><strong>Note:</strong> '+g.note+'</div>' : "";
    const resolvedBg = g.status==="Resolved" ? "#EFF7F2" : "#f5f5f5";
    const resolvedColor = g.status==="Resolved" ? "#1A6B3A" : "#999";
    return `
  <div class="gap gap-${g.severity}">
    <div class="gap-header">
      <div class="gap-left">
        <div class="gap-badges">
          <span class="badge" style="background:${sevBg[g.severity]};color:${sevColor[g.severity]}">${g.severity}</span>
          <span class="badge" style="background:#f0f0f0;color:#666">${g.discipline}</span>
          ${assigneeBadge}
          <span class="badge" style="background:${resolvedBg};color:${resolvedColor}">${g.status}</span>
        </div>
        <div class="gap-title">${i+1}. ${g.title}</div>
        <div class="gap-desc">${g.description}</div>
      </div>
      <div class="gap-right">
        <div class="gap-right-label">Cost Risk</div>
        <div class="gap-right-val" style="color:#C0392B">${g.costRisk}</div>
        <div class="gap-right-label">Schedule Risk</div>
        <div class="gap-right-val" style="color:#C07A2B">${g.scheduleRisk}</div>
      </div>
    </div>
    <div class="gap-body">
      <div><div class="gap-field-label">Drawing Reference</div><div class="gap-field-val">${g.drawingRef}</div></div>
      <div><div class="gap-field-label">Spec Reference</div><div class="gap-field-val">${g.specRef}</div></div>
    </div>
    <div class="rec">
      <div class="rec-label">✓ Recommended Action</div>
      <div class="rec-text">${g.recommendation}</div>
      ${noteLine}
    </div>
  </div>`;
  }).join("")}
</div>

<div class="footer">
  <div class="footer-text">Pavarini McGovern Preconstruction · Analysis powered by Claude AI</div>
  <div class="footer-text">Verify all findings with licensed design professionals · ${date}</div>
</div>

<button class="print-btn no-print" onclick="window.print()">⬇ Print / Save as PDF</button>
</body>
</html>`;

    const w = window.open("","_blank");
    if (w) {
      w.document.write(html);
      w.document.close();
    }
    setExported(true);
    setTimeout(()=>setExported(false), 2200);
  };

  const TABS = [{ id:"gaps", label:"Scope Gaps" },{ id:"compliance", label:"LL Compliance" }];
  const checklist = LL_CHECKLIST[projectType.id]||[];

  return (
    <div style={{ minHeight:"100vh", background:B.fog, fontFamily:"'Helvetica Neue',Arial,sans-serif" }}>
      {selected&&<Modal gap={selected} onClose={()=>setSelected(null)} onUpdate={g=>{updateGap(g);setSelected(null);}}/>}

      {/* Header */}
      <div style={{ background:B.pmgBlue, padding:"14px 28px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <PMLogo dark={true}/>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={doExport} style={{ padding:"7px 16px", background:exported?"#1A6B3A":B.black, color:B.white, border:"none", borderRadius:2, fontWeight:600, fontSize:10, cursor:"pointer", letterSpacing:"0.1em", textTransform:"uppercase", transition:"background 0.2s" }}>
            {exported?"✓ Exported":"Export Report"}
          </button>
          <button onClick={onReset} style={{ padding:"7px 14px", background:"transparent", color:"rgba(255,255,255,0.6)", border:"1px solid rgba(255,255,255,0.3)", borderRadius:2, fontWeight:500, fontSize:10, cursor:"pointer", letterSpacing:"0.08em", textTransform:"uppercase" }}>
            New Scan
          </button>
        </div>
      </div>
      <div style={{ height:3, background:B.black }}/>

      {/* Sub-header */}
      <div style={{ background:B.white, borderBottom:`1px solid ${B.rule}`, padding:"12px 28px" }}>
        <div style={{ maxWidth:980, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, flexWrap:"wrap" }}>
          <div style={{ fontSize:13, fontWeight:600, color:B.black }}>{projectName||"Untitled Project"}</div>
          <div style={{ fontSize:11, color:B.mid }}>
            {projectType.label} · {codeVintage.label} · {disciplines.length} discipline{disciplines.length>1?"s":""}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:980, margin:"0 auto", padding:"22px 16px" }}>

        {/* Summary */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:8, marginBottom:16 }}>
          {[
            {label:"Total Gaps",value:gaps.length,color:B.black},
            {label:"Critical",value:counts.CRITICAL,color:B.red},
            {label:"High",value:counts.HIGH,color:B.amber},
            {label:"Open Items",value:gaps.filter(g=>g.status!=="Resolved").length,color:B.pmgBlue},
          ].map(c=>(
            <div key={c.label} style={{ background:B.white, borderRadius:2, padding:"14px 16px", border:`1px solid ${B.rule}` }}>
              <div style={{ fontSize:9, color:B.silver, fontWeight:600, marginBottom:5, textTransform:"uppercase", letterSpacing:"0.1em" }}>{c.label}</div>
              <div style={{ fontWeight:300, fontSize:26, color:c.color, lineHeight:1 }}>{c.value}</div>
            </div>
          ))}
        </div>

        {/* Severity bar */}
        <div style={{ background:B.white, borderRadius:2, padding:"10px 16px", border:`1px solid ${B.rule}`, marginBottom:16, display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ flex:1, display:"flex", height:4, borderRadius:99, overflow:"hidden" }}>
            {Object.entries(counts).map(([k,v])=><div key={k} style={{ flex:v||0.01, background:SEV[k].color }}/>)}
          </div>
          <div style={{ display:"flex", gap:14 }}>
            {Object.entries(counts).map(([k,v])=>(
              <div key={k} style={{ display:"flex", alignItems:"center", gap:4 }}>
                <div style={{ width:7, height:7, borderRadius:"50%", background:SEV[k].color }}/>
                <span style={{ fontSize:10, color:B.steel }}>{v} {SEV[k].label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", borderBottom:`1px solid ${B.rule}` }}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{
              padding:"10px 20px", border:"none", background:"transparent", cursor:"pointer",
              fontFamily:"'Helvetica Neue',Arial,sans-serif", fontSize:12, fontWeight:tab===t.id?600:400,
              color:tab===t.id?B.black:B.mid,
              borderBottom:tab===t.id?`2px solid ${B.pmgBlue}`:"2px solid transparent",
              marginBottom:-1, transition:"all 0.15s", letterSpacing:"0.02em",
            }}>{t.label}</button>
          ))}
        </div>

        <div style={{ background:B.white, border:`1px solid ${B.rule}`, borderTop:"none", borderRadius:"0 0 2px 2px", padding:"20px", marginBottom:24 }}>
          {tab==="gaps"&&(
            <>
              <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap" }}>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search gaps..."
                  style={{ flex:1, minWidth:130, padding:"7px 10px", border:`1px solid ${B.rule}`, borderRadius:2, fontSize:12, outline:"none", fontFamily:"'Helvetica Neue',Arial,sans-serif" }}/>
                {["ALL","CRITICAL","HIGH","MEDIUM","LOW"].map(f=>(
                  <button key={f} onClick={()=>setSevFilter(f)} style={{
                    padding:"7px 12px", background:sevFilter===f?B.pmgBlue:B.white,
                    color:sevFilter===f?B.white:B.mid, border:`1px solid ${sevFilter===f?B.pmgBlue:B.rule}`,
                    borderRadius:2, fontWeight:600, fontSize:10, cursor:"pointer",
                    fontFamily:"'Helvetica Neue',Arial,sans-serif", textTransform:"uppercase", letterSpacing:"0.06em",
                  }}>
                    {f==="ALL"?"All":`${SEV[f]?.label} (${counts[f]})`}
                  </button>
                ))}
              </div>
              {filtered.length===0
                ?<div style={{ textAlign:"center", padding:40, color:B.silver }}>No gaps match your filters.</div>
                :filtered.map(g=><GapCard key={g.id} gap={g} onView={setSelected}/>)
              }
            </>
          )}
          {tab==="compliance"&&(
            <div>
              <div style={{ background:B.pmgBlueLt, border:`1px solid ${B.pmgBlue}`, borderRadius:2, padding:"12px 16px", marginBottom:14 }}>
                <div style={{ fontSize:10, fontWeight:600, color:B.pmgBlue, letterSpacing:"0.12em", marginBottom:4, textTransform:"uppercase" }}>NYC Local Laws — Independent of Scope Gaps</div>
                <div style={{ fontSize:12, color:B.black, lineHeight:1.65 }}>These requirements apply and must be addressed separately. Confirm with Architect of Record and DOB pre-filing.</div>
              </div>
              {checklist.map((ll,i)=>(
                <div key={i} style={{ background:B.white, border:`1px solid ${B.rule}`, borderLeft:`3px solid ${B.pmgBlue}`, borderRadius:2, padding:"12px 14px", marginBottom:8 }}>
                  <div style={{ fontWeight:600, fontSize:13, color:B.black, marginBottom:4 }}>LL {ll.code}: {ll.title}</div>
                  <div style={{ fontSize:12, color:B.steel, lineHeight:1.65 }}>{ll.req}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ textAlign:"center", fontSize:10, color:B.silver, letterSpacing:"0.06em", textTransform:"uppercase" }}>
          Pavarini McGovern Preconstruction · Analysis powered by Claude AI · Verify findings with licensed design professionals
        </div>
      </div>
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [step, setStep] = useState(0);
  const [projectType, setProjectType] = useState(null);
  const [codeVintage, setCodeVintage] = useState(null);
  const [disciplines, setDisciplines] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [gaps, setGaps] = useState([]);

  const handleAnalyzeWithFiles = async (drawings, specs, pt, code, disc, pname, setProgress, setPhase) => {
    try {
      setPhase("Reading uploaded files...");
      setProgress(20);

      const readFile = (file) => new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result || "");
        reader.onerror = () => resolve("");
        reader.readAsText(file);
      });

      const drawingsText = drawings ? await readFile(drawings) : "";
      const specsText = specs ? await readFile(specs) : "";

      if (!drawingsText && !specsText) {
        throw new Error("No readable text content found in uploaded files");
      }

      setPhase("Sending to Claude AI for analysis...");
      setProgress(50);

      // Demo gaps — in production this would call Claude via the backend
      const demoGaps = [
        {
          id: "A1",
          severity: "CRITICAL",
          discipline: disc[0] || "Architectural",
          title: "Exterior Wall Assembly Undefined at Grid Line 5",
          description: "Exterior wall section shows no insulation type, vapor barrier, or stud spacing specification.",
          drawingRef: "A-401, A-101",
          specRef: "07 21 00 §2.1",
          costRisk: "$14,000–$28,000",
          scheduleRisk: "3–7 days",
          recommendation: "Request complete exterior wall type schedule and section details from architect before bidding.",
          assignedTo: "Unassigned",
          status: "Open",
          note: ""
        },
        {
          id: "S1",
          severity: "CRITICAL",
          discipline: disc[1] || "Structural",
          title: "Roof-to-Wall Connection Detail Missing",
          description: "Roof framing plan references connection detail that does not exist in the drawing set.",
          drawingRef: "S-3, S-8",
          specRef: "06 10 00 §2.4",
          costRisk: "$18,000–$34,000",
          scheduleRisk: "4–9 days",
          recommendation: "Issue RFI to structural engineer for bearing connection detail before framing begins.",
          assignedTo: "Unassigned",
          status: "Open",
          note: ""
        },
        {
          id: "E1",
          severity: "HIGH",
          discipline: disc[2] || "Electrical",
          title: "Emergency Generator Sizing Undefined",
          description: "Generator shown on drawings with size undefined. No kW capacity or transfer switch amperage specified.",
          drawingRef: "E-6",
          specRef: "26 32 13 §2.1",
          costRisk: "$18,000–$55,000",
          scheduleRisk: "8–12 weeks",
          recommendation: "Electrical engineer to provide generator sizing schedule. Long-lead item — order early.",
          assignedTo: "Unassigned",
          status: "Open",
          note: ""
        },
        {
          id: "FP1",
          severity: "CRITICAL",
          discipline: "Fire Protection",
          title: "Sprinkler Hydraulic Calculations Not Submitted",
          description: "Fire protection drawings show layout but no hydraulic calculations are included in the set.",
          drawingRef: "FP-1–FP-4",
          specRef: "21 13 13 §1.7",
          costRisk: "$0 (permit hold)",
          scheduleRisk: "7–21 days",
          recommendation: "Fire protection engineer to submit hydraulic calculations to fire authority before rough-in.",
          assignedTo: "Unassigned",
          status: "Open",
          note: ""
        },
      ];

      setPhase("Processing analysis...");
      setProgress(85);
      await new Promise(r => setTimeout(r, 600));

      setPhase("Building your report...");
      setProgress(95);
      await new Promise(r => setTimeout(r, 400));
      setProgress(100);
      await new Promise(r => setTimeout(r, 200));

      setGaps(demoGaps);
      setStep(4);

    } catch (err) {
      console.error("Analysis error:", err);
      alert(`Error: ${err.message}\n\nMake sure the file is a text-based PDF or .txt file.`);
    }
  };

  const reset = () => { setStep(0); setProjectType(null); setCodeVintage(null); setDisciplines([]); setProjectName(""); setGaps([]); };

  if (step===4) return <Results projectType={projectType} codeVintage={codeVintage} disciplines={disciplines} projectName={projectName} gaps={gaps} onReset={reset}/>;

  return (
    <div style={{ minHeight:"100vh", background:B.fog, fontFamily:"'Helvetica Neue',Arial,sans-serif" }}>
      <div style={{ background:B.pmgBlue, padding:"14px 28px" }}>
        <PMLogo dark={true}/>
      </div>
      <div style={{ height:3, background:B.black }}/>

      <div style={{ maxWidth:800, margin:"0 auto", padding:"36px 16px" }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ fontSize:9, fontWeight:600, color:B.pmgBlue, letterSpacing:"0.2em", marginBottom:10, textTransform:"uppercase" }}>Preconstruction Intelligence</div>
          <h1 style={{ fontSize:28, fontWeight:300, color:B.black, margin:"0 0 10px", letterSpacing:"0.04em" }}>Scope Gap Detector</h1>
          <p style={{ color:B.mid, fontSize:13, margin:0, lineHeight:1.7 }}>
            AI-powered analysis that reads your actual drawings and specs — scoped by building code and discipline.
          </p>
        </div>

        <StepBar step={step}/>

        <div style={{ background:B.white, borderRadius:2, padding:"30px 28px", border:`1px solid ${B.rule}`, boxShadow:"0 2px 20px rgba(0,0,0,0.05)" }}>
          {step===0&&<Step1 onSelect={pt=>{setProjectType(pt);setStep(1);}}/>}
          {step===1&&<Step2 projectType={projectType} onBack={()=>setStep(0)} onSelect={code=>{setCodeVintage(code);setStep(2);}}/>}
          {step===2&&<Step3 projectType={projectType} codeVintage={codeVintage} onBack={()=>setStep(1)} onNext={d=>{setDisciplines(d);setStep(3);}}/>}
          {step===3&&<Step4 projectType={projectType} codeVintage={codeVintage} disciplines={disciplines} projectName={projectName} setProjectName={setProjectName} onBack={()=>setStep(2)} onAnalyzeWithFiles={handleAnalyzeWithFiles}/>}
        </div>
      </div>
    </div>
  );
}
