# HANDOFF - VerbDetective

## Current State

The project is now split into:
- `index.html`: title screen + orientation screen
- `part.html`: part-level app shell
- `js/app-shell.js`: title -> orientation -> part navigation
- `js/app.js`: part engine bootstrap
- `js/parts/`: per-part definitions
- `assets/`: shared and per-part media

The current flow works:
1. Title screen
2. Orientation screen
3. Part page for the selected part
4. Room view inside the part

The back button on the part page now returns directly to the orientation screen via `index.html#orientation`.

Recent status update:
- Parts 2, 3, and 4 are generated from `js/parts/parts-source10.md`.
- The menu and room cards display correctly across all parts.
- Parts 1, 2, 3, and 4 now all enter rooms correctly and stage 1 starts again.
- The root cause was shared `localStorage` state across all parts; state is now isolated per part with a compatibility check for old saves.
- Stage 1 now shows its banner text correctly and plays `challenge.mp3` on room entry.
- Oral banner chip styling is now consistent for stages 1, 2, 3, 4, 5, and 7.
- Written MCQ boxes for stages 9 and 10 now use `Shantell Sans`.
- The orientation page no longer has the debug tuning button/panel; the current tuned layout is hard-coded.
- The room-page developer shortcut button is now hidden by default and can be toggled silently by typing `dev` on the part app page.

## Important Implementation Notes

- The project must be served over HTTP for ES modules to load correctly.
- `serve.mjs` is the local static server. Run:
  - `node serve.mjs`
  - then open `http://localhost:8000/`
- The title/orientation page is controlled by inline JS in `index.html`.
- `js/app-shell.js` must use the real DOM IDs from `index.html`:
  - `screen-title`
  - `screen-menu`
  - `start-btn`
  - `books-wrap`

## Part Architecture

The engine is designed to be data-driven by part:
- `js/parts/part1/`
  - `config.js`
  - `data.js`
  - `index.js`
- `js/parts/part2/`
  - `config.js`
  - `data.js`
  - `index.js`
- `js/parts/part3/`
  - `config.js`
  - `data.js`
  - `index.js`
- `js/parts/part4/`
  - `config.js`
  - `data.js`
  - `index.js`

Each part definition should export:
- `config`
- `HOTSPOTS`
- `VERB_FORMS`
- `QCM_OPTIONS`
- `MATCHING_OPTIONS`
- `ROOMS`
- `getHotspot(roomId, verbId)`
- `getRoomVerbs(roomId)`

## Known Good Behavior

- Part 1 displays its title and rooms correctly.
- The intro audio now starts after the UI is painted.
- The orientation back button uses the library icon artwork and is placed on the part page menu screen, not inside the room view.
- The back button now returns to `index.html#orientation`.
- Parts 2, 3, and 4 load their room cards correctly from generated data.
- Parts 2, 3, and 4 each expose 6 rooms and 30 verbs.
- Parts 2, 3, and 4 now start room activities normally.
- Stage 1 banner text appears on room entry and `challenge.mp3` plays after stopping any still-playing intro audio.
- The blue developer button only appears in room view when dev mode has been toggled on.
- Typing `dev` or `DEV` on the part page toggles dev mode and briefly shows `Dev mode ON` or `Dev mode OFF`.
- The orientation menu uses hard-coded layout values:
  - `height: 41vh`
  - `spacing: 9.6vh`
  - `vertical: 52.5%`
  - `horizontal: 51.5%`

## Files to Be Careful With

- `VerbDetective/index.html`
  - contains the title/orientation screen, hard-coded part-book layout, and inline navigation logic
- `VerbDetective/js/app-shell.js`
  - handles title screen to orientation screen switching
- `VerbDetective/js/app.js`
  - bootstraps the selected part, binds the orientation back button, owns per-part saved state, and handles the hidden `dev` keyboard toggle
- `VerbDetective/js/uiRenderer.js`
  - renders menu rooms and room view, and now controls developer-button visibility based on current view + dev mode
- `VerbDetective/js/parts/index.js`
  - route map for part definitions

## Next Recommended Step

Decide whether the hidden dev-mode toggle should stay session-only or persist across reloads for testers.

Useful checks for the next agent:
- If beta testers need the dev shortcut across refreshes, add a persisted flag separate from learner progress.
- If the hidden toggle should be more discreet, consider using a longer sequence or a timed multi-key pattern.
- Browser-check the current beta flow end-to-end after serving with `serve.mjs`, especially room entry, stage 1 audio, and the `dev` toggle.

## Last Verified

- `node --check` passes on the changed JS files (`app.js`, `phaseManager.js`, `uiRenderer.js`).
- The page navigation works in browser when served through `serve.mjs`.
- Room cards display correctly across parts 1-4.
- Stage 1 room entry behavior is fixed.
- Orientation debug controls have been removed.
