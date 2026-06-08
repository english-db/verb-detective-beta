# VerbDetective

Static web app for the `Verb Detective` project.

## Project Structure

- `index.html`: title screen and orientation screen
- `part.html`: loads a selected part with `?part=1..4`
- `js/`: shared app engine
- `js/parts/`: per-part configs and data
- `assets/`: shared and per-part images, audio, and fonts

## Run Locally

This project should be served over HTTP because it uses ES modules.

```bash
node serve.mjs
```

Then open:

```text
http://localhost:8000/
```

## Live Beta

GitHub Pages deployment is live at:

```text
https://english-db.github.io/verb-detective-beta/
```

Notes:
- `.nojekyll` is required at project root so GitHub Pages does not ignore underscore-prefixed folders such as `js/parts/_template/`.
- `.gitattributes` is present to keep text-file line endings predictable across Windows and GitHub.

## Update Workflow

From the `VerbDetective` folder:

```bash
git add .
git commit -m "Describe your change"
git push
```

GitHub Pages redeploys automatically from `main`.

If the live site looks unchanged after a push:
- hard refresh with `Ctrl+F5` or `Ctrl+Shift+R`
- or test in a private/incognito window

## Audio Note

Parts 2, 3, and 4 currently reuse shared intro audio from part 1 for:
- `assets/parts/part1/audio/intro/let_s_learn.mp3`
- `assets/parts/part1/audio/intro/challenge.mp3`

That is intentional because those shared intro files do not currently exist inside the part 2, 3, or 4 intro folders.
