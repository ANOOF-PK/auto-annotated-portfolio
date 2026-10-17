# INSIDE / OUTSIDE — experience specification

Working spec for Anoof P K's portfolio. It records the decisions the build is based on; the
`portfolio-art-direction` skill (`.claude/skills/`) holds the rules for extending it.

## 1. Critique before building

Risks in the brief's own direction, and how this build answers them:

| Risk | Decision |
| --- | --- |
| "Floating avatar next to a headline" | The bust **overlaps** a full-bleed masthead (magazine-cover composition). The name is HTML set beneath a transparent canvas, so type and sculpture share one plane. |
| Body-part metaphor becomes a game that hides the work | Every 3D target mirrors a real HTML control. The project index is visible next to the hand, never behind it. Work is one click from the first screen. |
| Seven scenes with seven visual languages | One studio, one character, one material system. Colour encodes *meaning*, not section: blue = interactive/selected, coral = observation, lime = unfinished/experimental. |
| Random floating objects | Every object belongs to a body part: concept objects live *in* the head, artefacts sit *on* the hand, the lens sits *at* the eye, experiments are wireframes in the open studio (unfinished sculptures). |
| Scroll hijacking / long pins | No pinning, no scroll capture. Camera targets are derived from normal document scroll; transitions occupy half a viewport of scroll around each section boundary and the camera then holds. |
| Fabricated depth to fill case studies | Twelve-part case-study model where every part is either real content or an explicit "to supply" entry. |

## 2. Character specification (procedural placeholder)

Not a likeness. An original stylised bust built from primitives, replaceable by a Blender export
with the same node names (`head`, `cranium`, `eye-l/r`, `hand-l/r`).

- **Form:** a sculptural bust on a plinth. Hands float free of the body, oversized (palm ≈ ⅔ head
  width) — the surreal device that lets them carry work without arm rigging.
- **Head:** slightly tall egg (1 : 1.1), elongated chin, sculpted wedge nose, calm closed smile.
  Cranium is a separate lid hinged at the back, cut just above the brow.
- **Hair:** ink mass with a tall forward quiff and bare sides — the silhouette signature.
- **Eyes:** bone sclera, dark iris, relaxed upper lids; they track the pointer within a small range.
- **Materials:** matte clay skin, ink knit sweater and cuffs, bone plinth. Gloss reserved for
  selected artefacts. One key light (soft shadow), one fill, hemisphere ambient.
- **Motion personality:** unhurried. Slow breathing bob, occasional blink, damped responses.
  Nothing loops fast enough to compete with reading. All of it stops under reduced motion.

## 3. Scene map and camera plan

One fixed camera rig. Each section has a keyframe (camera offset from a target, where on screen
the target sits, and scene parameters). Between sections, both blend over a 0.5-viewport scroll
window centred on the boundary, then the camera eases (exponentially damped) toward the target, so
fast scrolling always settles on the correct state.

| # | Section | Camera / focus | Scene parameters | Mobile | Reduced motion |
|---|---|---|---|---|---|
| 0 | Arrival | Low ¾ view, bust overlaps the masthead | hands relaxed, pointer tracking | bust centred above copy | static pose, no tracking |
| 1 | Mind | High, looking into the head | `headOpen` 0→1, concept objects rise | target in top 40% | lid simply open |
| 2 | Work | Front-above the raised right hand | `handRaise` 0→1, artefacts on the palm | hand top, index below | cut to final pose |
| 3 | Observations | Close on the left eye | `eyeFocus`: eye scales, coral lens | eye top | cut |
| 4 | Playground | Wide, revealing the studio | `studio`: lime wireframe experiments | wide crop | cut |
| 5 | Journey | Side profile | `profile`: head turns | — | cut |
| 6 | Contact | Frontal, calm | `rest`: hands lowered together | — | cut |

Selections (concept, project, observation) are **event-driven** and damped independently of
scroll.

## 4. Navigation model

- A compact index labelled by body part: *Hands — Work, Head — Thinking, Eyes — Observations,
  Studio — Experiments, Journey — About, Contact*. On small screens it collapses into an
  "Index" sheet (dialog with focus return and Escape).
- In the whole-figure views (Arrival, Journey, Contact) the head, hands and eyes are themselves
  links to their sections.
- Case studies are real routes (`/work/[slug]/`); back returns to `/#work`.
- A "3D on/off" switch is always available and persists per visitor.

## 5. Interaction state model

```
scene:     idle → loading → ready | failed | unsupported | off
section:   arrival | mind | work | observations | playground | journey | contact   (from scroll)
hover:     null | {kind, id}                    shared by HTML and 3D
selection: concept? project? observation?       one per kind; Escape or close clears it
motion:    full | reduced                       from OS preference
```

Rules: selection never blocks navigation; leaving a section keeps its selection; closing a preview
returns focus to the control that opened it; pointer position never goes through React state.

## 6. Content model

`src/content/` — plain typed data, no rendering:
`profile`, `projects` (organisation, timeline, role, kind, status, contribution note, summary,
twelve case-study parts each `{ status: 'documented' | 'to-supply' }`, assets), `concepts`
(depth: practice / exploring / interest), `observations` (observation, context, interpretation,
improvement, evidence level), `experiments` (question, why, explored, working, next, status),
`journey`.

Status vocabulary: `shipped`, `in-progress`, `prototype`, `concept`, `unconfirmed`. Nothing is
`shipped` without a stated source.

## 7. Technical architecture

- Next.js pages router, static export-friendly. The home page renders all content as semantic HTML;
  the WebGL stage is a client-only dynamic import that loads after first paint.
- `three` + `@react-three/fiber` only. No Drei, no GSAP: the motion system is a small damping
  layer inside the frame loop, which keeps one owner per transform.
- Canvas: fixed, transparent, `pointer-events: none`; events are sourced from the page root so
  HTML and 3D both receive pointers. Content panels mark themselves as occluding so a click on a
  panel never selects an object behind it.
- Composition across viewports uses the camera view offset: each keyframe says where on screen its
  focal point sits.
- DPR capped (1.75 desktop, 1.5 touch), one shadow-casting light, shared geometries/materials.

## 8. Risks and dependencies

- **Likeness:** needs reference photos or a commissioned model. Placeholder until then.
- **Project truth:** all case-study detail, assets, dates and confidentiality limits must come
  from Anoof. The site currently shows only facts from the brief.
- **Contact:** email and LinkedIn URL not supplied; shown as pending, not invented.
- **Device range:** SwiftShader/low-end GPUs — mitigated by DPR cap, the off switch and the
  failure fallback.
