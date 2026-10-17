# INSIDE / OUTSIDE — portfolio of Anoof P K

An experimental portfolio where a sculpted 3D character is the interface: the **head** opens onto
how I think, the **hands** hold the work, the **eyes** lead to what I notice, and the surrounding
**studio** holds experiments. Every interaction in the scene has a plain HTML equivalent, so the
portfolio works by keyboard, with reduced motion, with 3D switched off, and without WebGL.

- Experience specification (scene map, camera plan, state model): [`docs/inside-outside.md`](docs/inside-outside.md)
- Art-direction rules for future work: [`.claude/skills/portfolio-art-direction/SKILL.md`](.claude/skills/portfolio-art-direction/SKILL.md)

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start
```

## Checks

```bash
npm run typecheck
npm run lint
npm run build
npm start &                       # the tests run against a live server
npm run test:e2e                  # keyboard, focus, Escape, mobile index, 3D off, no-WebGL, routes
npm run inspect -- http://localhost:3000 shots desktop   # screenshots of every section
```

The browser scripts use `playwright-core` with an existing Chromium. Set `CHROME_PATH` to your
Chrome/Chromium binary if it is not at the default Playwright cache path in the scripts.

## Where things live

| Path | What |
| --- | --- |
| `src/content/` | All portfolio content as typed data: projects, concepts, observations, experiments, journey. Gaps are explicit `to-supply` entries. |
| `src/components/` | Semantic HTML: header/index, the seven sections, case-study page styles, static fallback drawings. |
| `src/experience/store.ts` | Shared state between HTML and 3D (section, hover, selections, scene status, reduced motion). |
| `src/scene/` | The WebGL layer: `choreography.ts` (camera plan), `Director` (scroll → camera), `Figure`, `Hands`, `Artefacts`, `MindObjects`, `Studio`. |
| `src/css/main.css` | Design tokens and base styles. |

## Adding a project

Add an entry to `src/content/projects.ts`. Give it a `tier` (`selected` sits on the palm,
`supporting` on a fingertip), an `artefact` shape, a truthful `status`, and fill case-study parts
only with documented material and a `source`. Put images in `public/work/<slug>/` and list them in
`assets`. Leave anything unconfirmed as `to-supply` — the case-study page lists it as a gap rather
than inventing it.

## Replacing the character

The bust is procedural (primitives in `src/scene/Figure.tsx` and `Hands.tsx`) and is not a likeness.
A modelled character can replace it by keeping the same node roles — `head`, `cranium` (the lid that
opens), `eyes`, `hand-r` (carries artefacts) and `hand-l` — so the choreography and interactions
continue to work.
