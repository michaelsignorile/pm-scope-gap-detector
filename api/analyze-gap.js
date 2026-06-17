import Anthropic from "@anthropic-ai/sdk";
import { fromBuffer } from "pdf2pic";
import { promises as fs } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { randomUUID } from "crypto";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ─── NYC Building Code Requirements by Vintage ────────────────────────────────
const NYC_CODE_REQUIREMENTS = {
  "1938 Building Code": `
NYC 1938 BUILDING CODE — CHECK EVERY ITEM BELOW:
STRUCTURAL:
- Art. 8 §C26-230: Structural steel fireproofing — encasement method only, spray-on not recognized. Flag any spray fireproofing shown.
- Art. 6 §C26-188: Floor load requirements — flag if live loads not shown on structural drawings
- Flag any structural work on existing members assumed adequate without investigation note

EGRESS & LIFE SAFETY:
- Art. 5 §C26-147: Exit width minimum 28 inches — flag any exits shown narrower
- Stair construction: flag if non-fireproof stairs shown in fireproof building
- Flag any change in occupancy load without egress recalculation
- Flag any corridor dead ends exceeding 20 feet

FIRE PROTECTION:
- Occupancy separations per 1938 use classifications — flag if not shown
- Flag any fire door openings without listed assemblies noted
- Flag sprinkler work without reference to applicable standard

PLUMBING:
- Trap requirements: flag if trap shown without vent or with shared vent not permitted
- Fixture counts: flag if not provided for occupancy type

ALT WORK TRIGGERS — FLAG IF SCOPE:
- Changes building use or occupancy classification
- Increases occupant load by any amount
- Affects any means of egress component
- Touches any life-safety system (sprinkler, fire alarm, standpipe)
- Any note deferring code compliance to future filing or others`,

  "1968 Building Code": `
NYC 1968 BUILDING CODE — CHECK EVERY ITEM BELOW:
FIRE RESISTANCE:
- §27-232: Fire-resistance ratings by construction class — flag if hourly ratings not shown on drawings
- §27-333 to §27-341: Rated wall and floor assemblies — flag if UL assembly number not specified
- §27-343: Opening protectives in rated assemblies — flag if fire doors/dampers not shown
- §27-348: Firestopping at penetrations — flag if not detailed

EGRESS:
- §27-357: Stair width — 44 inches min for occupant load >50, 36 inches min otherwise. Flag violations.
- §27-371: Corridor width — minimum 44 inches in most occupancies. Flag violations.
- §27-363: Travel distance — maximum varies by occupancy. Flag if not calculated.
- §27-375: Dead-end corridors — maximum 20 feet. Flag violations.
- §27-358: Stair enclosure — flag if not enclosed in rated construction

SPRINKLER & STANDPIPE:
- §27-954: Sprinkler — flag if building height or occupancy requires but not shown
- §27-940: Standpipe — flag if required but not shown or not extended for new work
- §27-955: Sprinkler head coverage — flag if spacing not per code

MECHANICAL:
- §27-777: Ventilation rates — flag if not shown for occupied spaces
- §27-826: Combustion air — flag if not shown for fuel-burning equipment
- §27-831: Flue and vent requirements — flag if not detailed

PLUMBING:
- §27-762: Fixture counts — flag if not provided and verified against occupant load
- §27-801: Trap requirements — flag if improperly vented
- §27-820: Hot water requirements — flag if not specified

ELECTRICAL:
- §27-860: Service entrance requirements — flag if not shown or undersized for scope
- §27-871: Emergency lighting — flag if required but not shown
- §27-872: Exit signs — flag if not shown

ALT WORK:
- Non-structural Alt-2: flag any scope that triggers full code compliance
- Flag any work that changes occupancy, increases load, or touches life safety`,

  "2014 Building Code": `
NYC 2014 BUILDING CODE — CHECK EVERY ITEM BELOW:
MEANS OF EGRESS:
- BC §1006: Number of exits — verify exit count against occupant load table. Flag violations.
- BC §1016: Travel distance — flag if exceeds maximum for occupancy type
- BC §1018: Corridor fire rating — flag if 1-hour rating not shown where required
- BC §1020: Exit enclosures — flag if not rated or not pressurized where required
- BC §1007: Accessible means of egress — areas of refuge required in high-rise. Flag if missing.
- BC §1007.6: Two-way communication at areas of refuge — flag if not shown on drawings
- BC §1025: Assembly occupancy egress — flag if aisles, vomitories not designed

ACCESSIBILITY:
- BC §3411: Accessibility in existing buildings — 20% of construction cost must go to path of travel. Flag if not addressed.
- BC §1104: Accessible routes — flag any break in continuity
- BC §1109: Accessible spaces — flag if accessible toilet rooms not shown or undersized
- BC §1109.12: Accessible controls and reach ranges — flag if outlets/controls not at accessible height
- LL58/2015: Path of travel upgrades — flag if scope triggers but not addressed

FIRE PROTECTION:
- BC §903: Automatic sprinkler — flag if scope or occupancy triggers requirement but not shown
- BC §904: Alternative fire suppression — flag if shown without full design
- BC §907: Fire alarm — flag if devices not coordinated with reflected ceiling plan
- BC §909: Smoke control — flag if required for atrium or high-rise but not shown
- BC §915: Carbon monoxide detection — flag if required but not shown

STRUCTURAL:
- BC §1604: Load combinations — flag if structural notes don't reference design loads
- BC §1613: Seismic design — flag if seismic design category not referenced
- BC §1603: Construction documents — flag if loads not shown on structural drawings
- BC §3401: Existing structures — flag if assumed adequate without investigation

ENERGY & ENVIRONMENT:
- NYC Energy Conservation Code: flag envelope work without U-value compliance shown
- NYC ECC: flag mechanical work without energy compliance path
- NYC ECC: flag lighting work without power density compliance shown
- LL88/2018: Lighting upgrades and sub-metering — flag if electrical scope missing
- LL87/2009: Energy audit — flag if mechanical scope doesn't reference audit

LOCAL LAWS:
- LL97/2019: Carbon emissions — flag if building >25K SF without emissions compliance plan
- LL58/2015: Accessibility — 20% rule for path of travel, flag if not addressed
- LL126/2021: FISP Cycle 9 — flag any facade work without licensed inspector noted
- LL196/2017: Site safety training — flag if safety manager plan not noted for major work`,

  "2022 Building Code (Current)": `
NYC 2022 BUILDING CODE — CHECK EVERY ITEM BELOW:
MEANS OF EGRESS:
- BC 2022 §1006: Number of exits — verify against occupant load. Flag violations.
- BC 2022 §1017: Travel distance — flag if exceeds maximum
- BC 2022 §1020: Corridors — flag if fire rating not shown where required
- BC 2022 §1023: Exit enclosures — flag if not rated or pressurized where required
- BC 2022 §1007: Accessible means of egress — areas of refuge, two-way comm required in high-rise
- BC 2022 §1010: Doors — flag if door hardware not accessible type or door swing violates egress

ACCESSIBILITY:
- BC 2022 §1104: Accessible routes — flag any break in route continuity
- BC 2022 §1109: Accessible spaces — flag if accessible toilet rooms missing or undersized
- BC 2022 §3411: Existing buildings — 20% path of travel rule, flag if not addressed
- LL58/2015: Path of travel upgrades — flag if scope triggers but not addressed

FIRE PROTECTION:
- BC 2022 §903: Sprinkler — flag if required but not shown or not extended to new areas
- BC 2022 §907: Fire alarm — flag if devices not shown or not coordinated with RCP
- BC 2022 §909: Smoke control — flag if required but not designed
- BC 2022 §915: CO detection — flag if required but not shown
- BC 2022 §916: Emergency responder communication — flag if not addressed in high-rise

STRUCTURAL:
- BC 2022 §1603: Design loads — flag if not shown on structural drawings
- BC 2022 §1604: Load combinations — flag if not referenced
- BC 2022 §1613: Seismic — flag if seismic design category not referenced
- BC 2022 §3401: Existing structures — flag if existing capacity assumed without investigation

CERTIFICATE OF OCCUPANCY:
- BC 2022 §110: CO required for change of use — flag any change of use without CO path noted
- Flag any change in occupancy classification without DOB pre-filing consultation noted

ENERGY & SUSTAINABILITY:
- NYC Energy Conservation Code 2022: flag envelope, mechanical, lighting without compliance
- LL97/2019: Carbon emissions cap — buildings >25K SF must show compliance path. Flag if missing.
- LL88/2018: Sub-metering and lighting — flag if electrical scope doesn't address
- LL87/2009: Energy audit — flag if mechanical scope missing
- LL33/2018: Energy grades — flag if building >25K SF without grade posting noted

LOCAL LAWS — CHECK EVERY ONE:
- LL58/2015: Accessibility — 20% path of travel. Flag if not addressed for any alteration.
- LL97/2019: Carbon emissions — buildings >25K SF. Flag if no compliance plan shown.
- LL126/2021: FISP Cycle 9 — flag any facade work without licensed inspector noted
- LL88/2018: Lighting and sub-metering — flag if electrical scope missing compliance
- LL87/2009: Energy audits — flag if mechanical scope not referencing audit
- LL196/2017: Site safety — flag if no safety manager plan noted for major work
- LL11/1998: Facade inspection — flag exterior work without FISP compliance noted
- LL26/2004: Sprinkler in high-rise residential — flag if not addressed
- LL141/2013: Construction site safety — flag if site safety plan not noted`,
};

// ─── PDF to Images ────────────────────────────────────────────────────────────
async function pdfToImages(buffer) {
  const tempDir = join(tmpdir(), randomUUID());
  await fs.mkdir(tempDir, { recursive: true });
  try {
    const converter = fromBuffer(buffer, {
      density: 150,
      saveFilename: "page",
      savePath: tempDir,
      format: "jpeg",
      width: 1700,
      height: 2200,
    });
    const info = await converter.bulk(-1, { responseType: "base64" });
    return info.slice(0, 10).map(p => p.base64);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
}

// ─── Build Claude Content Blocks ──────────────────────────────────────────────
function buildContentBlocks(images, text, label) {
  const blocks = [];
  if (label) blocks.push({ type: "text", text: `\n══════════════════════════════\n${label}\n══════════════════════════════` });
  for (let i = 0; i < images.length; i++) {
    blocks.push({ type: "text", text: `Page ${i + 1} of ${images.length}:` });
    blocks.push({ type: "image", source: { type: "base64", media_type: "image/jpeg", data: images[i] } });
  }
  if (text && text.trim()) blocks.push({ type: "text", text: text.substring(0, 10000) });
  return blocks;
}

// ─── Main Handler ─────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      drawingsBase64, specsBase64,
      drawingsName, specsName,
      projectType, codeVintage, disciplines,
      projectName,
    } = req.body;

    if (!drawingsBase64 && !specsBase64) {
      return res.status(400).json({ error: "No files provided" });
    }

    // ── Process Drawings ──
    let drawingImages = [], drawingsText = "";
    if (drawingsBase64) {
      const buffer = Buffer.from(drawingsBase64, "base64");
      if ((drawingsName || "").toLowerCase().endsWith(".pdf")) {
        try {
          drawingImages = await pdfToImages(buffer);
        } catch (e) {
          console.warn("PDF conversion failed for drawings, falling back to text:", e.message);
          drawingsText = buffer.toString("utf-8");
        }
      } else {
        drawingsText = buffer.toString("utf-8");
      }
    }

    // ── Process Specs ──
    let specImages = [], specsText = "";
    if (specsBase64) {
      const buffer = Buffer.from(specsBase64, "base64");
      if ((specsName || "").toLowerCase().endsWith(".pdf")) {
        try {
          specImages = await pdfToImages(buffer);
        } catch (e) {
          console.warn("PDF conversion failed for specs, falling back to text:", e.message);
          specsText = buffer.toString("utf-8");
        }
      } else {
        specsText = buffer.toString("utf-8");
      }
    }

    const codeRequirements = NYC_CODE_REQUIREMENTS[codeVintage] || NYC_CODE_REQUIREMENTS["2022 Building Code (Current)"];

    // ── System Prompt ─────────────────────────────────────────────────────────
    const systemPrompt = `You are the most experienced NYC preconstruction manager in the industry. You have 35 years of experience on high-rise residential, commercial, healthcare, education, hotel, and mixed-use projects across New York City. You have personally resolved thousands of scope gaps and change orders. You know every trick contractors use to exploit vague documents, and every mistake designers make that costs owners money.

Your job tonight is to perform the most thorough, exhaustive, and specific scope gap analysis possible on the documents provided. Every gap you miss will become a change order, a claim, or a schedule delay. Every gap you catch saves real money.

══════════════════════════════════════════════════════
PROJECT INFORMATION
══════════════════════════════════════════════════════
Project Name: ${projectName || "Not Provided"}
Project Type: ${projectType}
Applicable Building Code: ${codeVintage}
Disciplines Selected for Analysis: ${disciplines.join(", ")}

══════════════════════════════════════════════════════
NYC BUILDING CODE — ACTIVE COMPLIANCE CHECKS
══════════════════════════════════════════════════════
${codeRequirements}

══════════════════════════════════════════════════════
COMPLETE SCOPE GAP ANALYSIS FRAMEWORK
Check EVERY category below against the provided documents.
══════════════════════════════════════════════════════

CATEGORY 1 — DRAWING vs SPECIFICATION CONFLICTS
□ Details referenced on drawings that do not exist in the drawing set
□ Sheet index lists sheets that are not included in the uploaded set
□ Spec sections referenced on drawings that are not included in the spec
□ Materials specified differently between drawings and specs
□ Dimensions or quantities that conflict between documents
□ Product model numbers in specs that contradict drawing notes
□ Finish schedules that conflict with room finish plans
□ Door/window schedules that conflict with plan locations
□ Structural member sizes that conflict between plan and schedule
□ Revision clouds or delta markers with no revision description provided
□ "Typical" details applied to conditions where they clearly don't apply
□ "Similar" callouts without a clear base detail to reference

CATEGORY 2 — MISSING INFORMATION & INCOMPLETE DOCUMENTS
□ Details, sections, or elevations called out but not provided
□ Schedules referenced but missing: door, window, finish, hardware, equipment, room data
□ Room finish schedule missing rooms shown on floor plan
□ Equipment schedule missing model numbers, capacities, or utility requirements
□ Keynote legend missing for keynotes shown on drawings
□ General notes referenced but not provided
□ Soils report or geotechnical report referenced but not included
□ Hazmat survey referenced but not included where demolition is shown
□ Survey or as-built drawings referenced but not included
□ Shop drawing or submittal requirements in spec but no submittal schedule
□ Testing and inspection plan referenced but not defined
□ Phasing plan referenced in specs but not shown on drawings
□ Demolition plan missing where new work requires demo
□ Existing conditions plan missing where work affects existing

CATEGORY 3 — ⚠️ DEFERRED RESPONSIBILITY — FLAG EVERY SINGLE INSTANCE
These are the most dangerous words in construction documents. Every one becomes a dispute.
Flag verbatim quotes of any of the following found in the documents:

VAGUE ASSIGNMENT:
□ "By GC" / "By general contractor" / "By contractor"
□ "By others" / "NIC" (not in contract) / "Not shown" / "N.I.C."
□ "By owner" / "Owner furnished" / "Owner supplied"
□ "By tenant" / "By separate contractor"
□ "CM to confirm" / "GC to confirm" / "Owner to confirm" / "Architect to confirm"
□ "Coordinate with ___" without a specific resolution shown
□ "Verify with ___" / "Confirm with ___" / "See ___" without specific reference
□ "Design-build" scope without performance specifications defined
□ "Allowance" items without defined scope, quantity, or unit price

VAGUE SCOPE:
□ "Misc" / "Miscellaneous" / "Misc. work" / "Misc. items" / "Misc. labor"
□ "As required" / "As needed" / "As necessary" / "As directed" / "As approved"
□ "To be determined" / "TBD" / "To be confirmed" / "TBC" / "To be selected" / "TBS"
□ "In kind" without a defined base condition
□ "Match existing" without documentation of what existing is
□ "Patch and repair" without defined scope or limits
□ "Clean and prepare" without specification
□ "Incidental work" / "Incidental to" without definition
□ "All work necessary" without scope limits
□ "Complete and operable" without defined scope
□ "Remove and replace" without specifying what replacement is
□ "Provide blocking as required" without locations defined

LONG-LEAD WITHOUT PROCUREMENT NOTE:
□ Items marked "by others" or "NIC" that are long-lead — procurement risk not assigned

CATEGORY 4 — MEP COORDINATION CONFLICTS
□ Ductwork routing conflicts with structural framing depth shown on structural drawings
□ Plumbing chases conflicting with electrical panels or structural shear walls
□ Mechanical equipment shown without adequate maintenance clearance (typically 36 inches min)
□ Fire dampers missing at duct penetrations through rated walls or floors
□ Smoke dampers missing at duct penetrations through smoke barriers
□ Pipe sleeves through rated assemblies without firestopping detail
□ Electrical conduit routing conflicts with structural members
□ Ceiling heights insufficient to accommodate structure + MEP + ceiling finish
□ Mechanical rooms with no access door or undersized access door
□ Roof penetrations shown without flashing details
□ Slab penetrations shown without structural coordination note or header
□ Electrical panels shown without dedicated working clearance (30 in. wide, 36 in. deep min)
□ Generator shown without fuel line routing, exhaust routing, or transfer switch location
□ Boiler or water heater shown without flue, combustion air, or gas line routing
□ Cooling tower shown without structural support design or vibration isolation detail
□ BAS/controls system shown on mechanical drawings but not on electrical drawings
□ Plumbing fixtures shown without floor drain below or within required distance
□ Grease interceptor required but not shown where commercial kitchen is present
□ Medical gas shown without zone valve locations or alarm panel location

CATEGORY 5 — STRUCTURAL GAPS
□ Load path not continuous from roof to foundation — flag any gap
□ Column or bearing wall above not supported by element below at same location
□ Slab opening shown without header beam, trimmer, or reinforcing detail
□ Cantilever shown without back-span or counterweight verified
□ Transfer beam shown without adequate bearing length or bearing plate detail
□ New load applied to existing structure without investigation or reinforcing shown
□ Expansion joints not coordinated between architectural, structural, and MEP drawings
□ Lateral system not identified (shear walls, moment frames, braced frames)
□ Anchor bolts or base plates not shown for equipment on structure
□ Roof equipment loads not shown on structural drawings
□ Connection details missing at: beam-to-column, beam-to-beam, roof-to-wall, slab edge
□ Existing slab or structure assumed adequate for new loads without load calculation
□ Adjacent excavation or underpinning scope not defined where applicable
□ Shoring plan required but not included for staged demolition or construction
□ Vibration-sensitive occupancy (lab, hospital, residential over retail) without vibration analysis noted

CATEGORY 6 — BUILDING ENVELOPE & WATERPROOFING
□ Air barrier continuity broken at: floor lines, structural penetrations, window frames, roof edges
□ Continuous air barrier layer not identified in wall section
□ Vapor barrier location not specified or conflicts with climate zone requirements
□ Flashing details missing at: parapet, roof edge, window head, window sill, door threshold
□ Through-wall flashing not shown at masonry veneer
□ Window-to-wall rough opening interface detail missing
□ Below-grade waterproofing not shown at: elevator pit, planter boxes, retaining walls, below-grade slabs
□ Waterproofing membrane continuity not detailed at transitions (wall to slab, slab to footing)
□ Roof drain sized but overflow drain not shown or sized
□ Expansion joint covers not specified at building movement joints
□ Thermal bridging at structural connections (shelf angles, balcony slabs) not addressed
□ Curtainwall or window wall anchor details not coordinated with structural
□ Green roof or plaza deck assembly not fully detailed with drainage and waterproofing
□ Skylight or roof opening without curb height, flashing, or fall protection detail

CATEGORY 7 — LIFE SAFETY & EGRESS
□ Exit signs not shown on architectural or electrical drawings
□ Emergency lighting fixtures not shown or quantities not sufficient
□ Emergency lighting not shown on electrical panel schedule
□ Fire alarm pull stations not shown at all exit doors
□ Smoke detectors not coordinated with HVAC diffuser locations
□ Sprinkler heads not shown on reflected ceiling plan
□ Sprinkler heads in conflict with light fixtures or diffusers on RCP
□ Dead-end corridor shown exceeding 20 feet without exception basis noted
□ Exit stair pressurization required but not shown (high-rise)
□ Corridor smoke control required but not addressed
□ Exit discharge not shown going directly to public way
□ Occupant load calculation not provided on drawings
□ Assembly area or refuge area not shown where required
□ Knox box location not shown at building entry
□ Standpipe hose outlet locations not shown or not per code spacing
□ Fire department connection location not shown or conflicts with access

CATEGORY 8 — ACCESSIBILITY / ADA
□ Accessible route from public way to building entry not shown or has level change
□ Accessible parking count not verified against total count (1:25 ratio minimum)
□ Accessible parking space dimensions not shown (96 inches + 60-inch aisle)
□ Accessible toilet room turning radius not shown (60-inch min)
□ Grab bar locations and heights not shown
□ Accessible lavatory with knee clearance not shown
□ Accessible door hardware (lever, not knob) not specified
□ Door opening force not noted (5 lbs max for interior, 8.5 lbs for exterior)
□ Threshold height not specified at accessible entries (1/2 inch max, 1/4 inch preferred)
□ Accessible route broken by construction phasing without temporary accessible route shown
□ Signage locations not shown for accessible rooms, exits, and amenities
□ Elevator cab dimensions not verified: 80 inches deep x 68 inches wide minimum for front entry
□ Accessible controls in elevator not at accessible height (15–48 inches AFF)
□ Ramp slope not verified (1:12 maximum, 1:20 preferred) with handrails shown

CATEGORY 9 — VERTICAL TRANSPORTATION
□ Elevator pit depth conflicts with structural slab elevation shown on structural drawings
□ Elevator overhead clearance not coordinated with structural framing above
□ Machine room or MRL (machine room-less) space not shown on drawings
□ Elevator electrical requirements (kVA, circuit size) not on electrical drawings
□ Elevator recall panel location not shown on electrical or architectural drawings
□ Elevator fire service Phase I and Phase II not addressed in spec
□ Elevator sump pump in pit not shown where required
□ Seismic switch for elevator not shown where required
□ Platform lift shown without pit detail, overhead clearance, or electrical
□ Escalator structural support loads not on structural drawings
□ Dumbwaiter or service elevator not coordinated with kitchen or MEP layout

CATEGORY 10 — LONG-LEAD PROCUREMENT FLAGS
Flag any of the following shown on drawings without a procurement schedule or note:
□ Electrical switchgear and distribution (16–26 weeks minimum)
□ Emergency generators (12–20 weeks minimum)
□ Elevators and escalators (20–52 weeks minimum — ORDER IMMEDIATELY)
□ Custom curtainwall or window wall systems (24–52 weeks minimum)
□ Cooling towers (12–20 weeks minimum)
□ Custom air handling units (12–20 weeks minimum)
□ Medical gas systems and equipment (8–16 weeks minimum)
□ Specialty or custom doors and frames (8–16 weeks minimum)
□ Structural steel (8–16 weeks minimum in current market)
□ Custom or imported tile and stone (12–24 weeks minimum)
□ Specialty lighting fixtures (8–16 weeks minimum)
□ Hydraulic or pneumatic systems (8–16 weeks minimum)
□ Fire suppression systems with specialty agents (12–20 weeks)
□ Kitchen equipment for commercial kitchens (12–20 weeks)
□ MRI or CT shielding for healthcare (16–24 weeks minimum)
□ Custom millwork or casework (8–16 weeks minimum)
These items kill schedules when not identified in precon.

CATEGORY 11 — PERMIT & DOB RISKS
□ Work shown that requires DOB permit with no filing strategy noted
□ Landmark building or historic district — flag if LPC notes absent
□ Special flood hazard area — flag if flood zone compliance not addressed
□ Asbestos or lead survey not referenced where demolition is shown on drawings
□ Boiler or pressure vessel work without DOB inspection note
□ Sprinkler or standpipe work without FDNY filing referenced
□ Elevator work without DOB Elevator Division filing noted
□ Facade work without FISP/LL126 compliance plan noted
□ Sidewalk bridge or scaffolding required but not shown on site plan
□ Street opening permit required for utility work but not noted
□ Crane or hoisting plan required but not noted
□ Noise variance required for after-hours work but not addressed
□ Restricted hours for work in occupied building not noted
□ Mechanical permit required for new HVAC but not referenced

CATEGORY 12 — EXISTING CONDITIONS RISKS
□ Existing structure shown as adequate for new loads without investigation or testing note
□ Existing MEP systems shown to remain without condition assessment note
□ Existing drawings used as base without field verification note
□ Demolition scope that exposes conditions requiring asbestos, lead, or PCB survey
□ Existing slab capacity assumed adequate without structural review note
□ Existing waterproofing assumed intact without investigation
□ Utility locations shown as "existing" without confirmation of current as-built
□ Core drilling or penetrations through existing slabs without pre-investigation note
□ Existing roof shown to remain without condition survey note
□ Existing windows shown to remain without air/water infiltration test note
□ Existing electrical panels shown to remain without load study note

CATEGORY 13 — COST & SCOPE AMBIGUITY
□ Allowance items without defined scope, quantity, or unit rate
□ Alternate items without clear inclusion or exclusion status in base bid
□ Value engineering items shown on drawings without formal VE log
□ Phased work without clear scope-per-phase definition
□ Items in spec but not on drawings (or on drawings but not in spec)
□ Mock-up requirements in spec without location, size, or approval criteria
□ Testing and inspection requirements without party responsible defined
□ Temporary facilities scope not defined: hoisting, fencing, protection, trailers
□ Roof or floor protection during construction not specified
□ Final cleaning scope not assigned to specific trade
□ Contractor general conditions items not defined in scope
□ Insurance or bonding requirements not clearly assigned
□ Commissioning scope not defined or assigned to party
□ Training requirements for owner's staff not specified

CATEGORY 14 — SUSTAINABILITY & ENERGY COMPLIANCE
□ LEED or WELL certification targeted but compliance path not documented
□ Energy model assumptions not reflected in mechanical or envelope design
□ Commissioning scope not defined, not assigned, or not in spec
□ Sub-metering requirements not shown on electrical drawings
□ Renewable energy systems shown without utility interconnect details
□ EV charging infrastructure required but not shown
□ Cool roof requirements not addressed for applicable occupancy
□ Stormwater management plan not referenced where site work is shown
□ Low-flow fixture requirements not specified in plumbing spec
□ Indoor air quality requirements not addressed in mechanical spec

CATEGORY 15 — CONSTRUCTION PHASING & LOGISTICS
□ Phasing shown on drawings but sequence not coordinated with MEP or structural
□ Temporary partitions or hoarding required but not shown
□ Loading dock or material staging area not identified
□ Crane or hoist location not coordinated with structural or site plan
□ Temporary utilities (power, water, heat) not assigned to a party
□ Occupied building work without noise, dust, or vibration control plan noted
□ After-hours work required but not addressed in contract documents
□ Roof access for staging not shown
□ Existing tenant protection not addressed where work is adjacent to occupied space
□ Fire watch requirements not noted for hot work in occupied building

══════════════════════════════════════════════════════
OUTPUT FORMAT — STRICT JSON ONLY
══════════════════════════════════════════════════════
Return ONLY a valid JSON array. Zero text before or after.
Each gap object must have exactly these fields with no omissions:

{
  "id": "Discipline prefix + sequential number e.g. A-001, S-002, M-003, E-004, FP-005",
  "severity": "CRITICAL or HIGH or MEDIUM or LOW",
  "discipline": "Exact discipline name from the list provided",
  "title": "Concise, specific title — max 10 words",
  "description": "Thorough description citing specific sheet numbers, grid lines, spec sections, room numbers, note text, or equipment tags visible in the documents. For deferred responsibility items, quote the exact language found in the document.",
  "drawingRef": "Specific sheet reference e.g. A-401, S-3, M-2 or N/A if spec-only",
  "specRef": "Specific spec section e.g. 07 21 00 §2.1 or N/A if drawing-only",
  "costRisk": "$X,000–$Y,000 or $0 (permit hold) or Unknown — survey required",
  "scheduleRisk": "X–Y days or X–Y weeks",
  "recommendation": "Specific action required. Name the party responsible. Include a recommended deadline relative to project milestones."
}

SEVERITY GUIDE:
- CRITICAL: Blocks permit, stops work, causes major rework, or creates legal/safety risk. Cost >$25K or >1 week delay.
- HIGH: Significant cost or schedule impact. $10K–$25K or 3–7 days delay.
- MEDIUM: Manageable but must be resolved before construction. $2K–$10K or 1–3 days.
- LOW: Minor coordination item. <$2K or <1 day. Still must be resolved.

Be exhaustive. A single missed scope gap on a NYC project can cost hundreds of thousands of dollars and months of schedule. Every "misc" note, every "by others", every missing detail is real money.`;

    // ── Build Content Blocks ──────────────────────────────────────────────────
    const contentBlocks = [{ type: "text", text: systemPrompt }];

    if (drawingImages.length > 0 || drawingsText) {
      contentBlocks.push(...buildContentBlocks(drawingImages, drawingsText, "CONSTRUCTION DRAWINGS"));
    }
    if (specImages.length > 0 || specsText) {
      contentBlocks.push(...buildContentBlocks(specImages, specsText, "PROJECT SPECIFICATIONS"));
    }

    contentBlocks.push({
      type: "text",
      text: `You have now reviewed all provided documents for ${projectName || "this project"}.

Work through every category in the framework above systematically. Reference specific content from the documents for every gap you identify. Be exhaustive — miss nothing.

Return the complete JSON array now. No preamble, no explanation, no text after. JSON only.`,
    });

    // ── Call Claude ───────────────────────────────────────────────────────────
    const message = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 8192,
      messages: [{ role: "user", content: contentBlocks }],
    });

    const responseText = message.content[0]?.text || "[]";

    // ── Parse Response ────────────────────────────────────────────────────────
    let gaps = [];
    try {
      gaps = JSON.parse(responseText);
    } catch {
      const match = responseText.match(/\[[\s\S]*\]/);
      if (match) {
        try {
          gaps = JSON.parse(match[0]);
        } catch {
          console.error("Could not parse Claude response:", responseText.substring(0, 500));
          return res.status(500).json({ error: "Could not parse analysis response. Try again." });
        }
      } else {
        return res.status(500).json({ error: "Unexpected response format from AI. Try again." });
      }
    }

    // ── Enrich Gaps ───────────────────────────────────────────────────────────
    const enriched = gaps.map((g, i) => ({
      ...g,
      id: g.id || `GAP-${String(i + 1).padStart(3, "0")}`,
      assignedTo: "Unassigned",
      status: "Open",
      note: "",
    }));

    return res.status(200).json({
      gaps: enriched,
      success: true,
      meta: {
        totalGaps: enriched.length,
        critical: enriched.filter(g => g.severity === "CRITICAL").length,
        high: enriched.filter(g => g.severity === "HIGH").length,
        medium: enriched.filter(g => g.severity === "MEDIUM").length,
        low: enriched.filter(g => g.severity === "LOW").length,
        projectName: projectName || "Untitled",
        codeVintage,
        projectType,
        disciplines,
      },
    });

  } catch (error) {
    console.error("Analysis error:", error);
    return res.status(500).json({ error: error.message || "Analysis failed. Please try again." });
  }
}
