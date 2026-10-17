---
name: portfolio-art-direction
description: Art-direction guardrails and review procedure for the INSIDE / OUTSIDE portfolio. Use before designing, building, restyling or reviewing anything visual or interactive on the site — the 3D character interface, sections, project pages, motion, typography, colour, layout or project copy. Reviews existing components and design tokens first, critiques the proposal, then extends the established direction instead of reinventing it.
---

# Portfolio art direction — INSIDE / OUTSIDE

This skill keeps every change to the portfolio consistent with its established art direction. It is a decision and review procedure, not a project brief. It deliberately avoids naming files, libraries or token values: those change. Find out what is true **now** from the codebase every time.

## Non-negotiables

1. **The 3D character is the primary interface.** Navigation and discovery happen through the character. Never demote it to a hero decoration, replace it with a conventional nav-first layout, or add a parallel interface that makes it redundant. Conventional UI exists only as an accessible alternative or a supporting layer.
2. **Body parts map to content, and the map is stable.** Head, hands and eyes each lead to a specific kind of content. Read the current mapping from the code before touching it. Do not reassign, merge or add mappings without stating the conceptual reason (how it fits the INSIDE / OUTSIDE idea) and getting explicit approval.
3. **The character's design is fixed.** Proportions, silhouette, material language, lighting mood and idle personality are established. Extend them; do not restyle, re-model or "modernise" them as a side effect of other work.
4. **Use the existing tokens for typography and colour.** Use the project's type families, scale, weights and colour tokens. Do not introduce raw hex values, new fonts or one-off sizes. If a genuinely new token is needed, propose it as a token, with its rationale, rather than inlining a value.
5. **Product first.** Every interaction must help someone understand the work or reach it faster. Spectacle that delays or obscures content is a regression.
6. **Motion has a purpose.** Each animation must communicate state, causality, spatial relationship or focus. Every animation respects `prefers-reduced-motion` with an equivalent, non-animated path, never a broken or empty one.
7. **There is always an accessible alternative.** Everything reachable through the character must also be reachable by keyboard and screen reader, and on low-power or no-WebGL devices, with equivalent content and sensible focus order, labels and contrast.
8. **Content is evidence-based.** Project claims must be backed by artefacts: shipped links, metrics with their source, screenshots, code, or a clear description of the user's own role. Label every project unambiguously as **shipped** (in production with real users) or an **experiment** (prototype, concept, study). Never blur the two, never invent numbers, and never upgrade an experiment's status through wording.

## Procedure — follow in order whenever the skill is invoked

### 1. Review what exists (mandatory, before proposing anything)

Discover the current state; do not assume it from memory or from this file.

- **Character and scene**: locate the 3D character, its scene setup, materials, lighting, camera and interaction or hit-target logic. Search for the scene or canvas entry point, model or asset loading, and handlers tied to head, hands and eyes.
- **Part → content mapping**: identify exactly where each body part routes to and how that content is presented (overlay, panel, route, camera move).
- **Design tokens**: find where colour, typography, spacing, radius and motion values are defined (theme or config files, CSS custom properties, style data) and how components consume them.
- **Neighbouring components**: read the components the request touches and their closest siblings, to reuse patterns rather than create parallel ones.
- **Accessible fallback**: find the non-3D or reduced-motion path and check that the change will be reflected there too.
- **Content source**: find where project content lives and how shipped and experimental status is represented.

Summarise what you found in a few bullets: the relevant files, the current mapping, the relevant tokens and any existing conventions. If something this skill expects is missing (for example the character or the fallback is not in the codebase yet), say so explicitly and ask how to proceed rather than inventing a substitute.

### 2. Critique before implementation (mandatory)

Write a short, honest critique of the request **and** of your own first idea before writing code. Check for each of the following and name any you find:

- **Generic layout**: card grids, centred hero and three-feature rows, template section stacks, or anything that would look at home on any portfolio. Ask what makes it specific to INSIDE / OUTSIDE.
- **Unnecessary decoration**: gradients, glows, particles, noise, blobs, ornamental 3D, extra icons or badges that carry no meaning. Every visual element must earn its place.
- **Weak interactions**: hover-only affordances, unclear hit targets on the character, interactions with no feedback, motion that delays content, scroll-jacking, hidden navigation with no fallback, or clicks whose result cannot be predicted.
- **Drift**: off-token colour or type, character restyling, mapping changes, or a new pattern where one already exists.
- **Accessibility gaps**: missing keyboard or screen-reader path, focus traps, contrast, missing reduced-motion variant.
- **Evidence gaps**: unsupported claims, missing artefacts, or an ambiguous shipped/experiment status.

Then state the revised direction. If the critique finds no problems, say so in one line and do not invent issues.

### 3. Propose — extend, don't reinvent

- Frame the proposal as an extension of the existing system: which tokens, components, materials and motion patterns it reuses.
- Keep scope to what was asked. No opportunistic redesigns of unrelated areas.
- Call out explicitly anything that would change a non-negotiable, give the reason, and wait for approval before doing it.
- For motion, state its purpose, its trigger, a rough duration and easing grounded in existing motion values, and its reduced-motion equivalent.
- For content, state the evidence behind each claim and the project's status.

### 4. Implement and verify

- Build with existing tokens and components; add new tokens to the token source, never inline.
- Verify the result in the running site when possible: the character interaction itself, keyboard-only navigation, reduced-motion, a narrow viewport, and the non-3D fallback.
- Re-run the step 2 checklist against what you built, not what you planned.

### 5. Report

Briefly: what changed, which tokens and components were reused or added, how accessibility and reduced-motion were handled, any content whose evidence or status still needs the user's input, and any non-negotiable that was deliberately touched (with approval).

## Review mode

When asked only to review (a PR, a page, a component), run steps 1 and 2 against the existing work and report findings, ranked most severe first, grouped as: interface integrity (character and mapping) → accessibility → evidence and status → token drift → generic layout and decoration → motion quality. Do not rewrite the work unless asked.
