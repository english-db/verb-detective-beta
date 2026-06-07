# VerbDetective Content Source

Use this file as the human-friendly source of truth for parts 2, 3, and 4.

Goal:
- avoid JavaScript syntax mistakes
- keep all content in one place
- make it easy to generate `config.js`, `data.js`, and `index.js` later

## How to fill this file

- Use one section per part.
- Use one row per verb.
- Hotspot coordinates are in raw pixels.
- Image size is the native artwork size, usually `1380 x 752`.
- If you do not want a custom audio filename, leave that cell empty and use the default naming rule.

### Default audio naming rule

If `Audio file override` is empty, the verb audio file is assumed to be:

`assets/parts/partX/audio/verbs/base_preterite_participle.mp3`

Example:

`break / broke / broken` becomes:

`assets/parts/part2/audio/verbs/break_broke_broken.mp3`

---

## Part 2

### Part info

| Field | Value |
| --- | --- |
| Part ID | `2` |
| Title | `Irregular Verbs - Part 2` |
| Assets root | `assets/parts/part2` |
| Intro audio 1 | `assets/parts/part2/audio/intro/let_s_learn.mp3` |
| Intro audio 2 | `assets/parts/part2/audio/intro/part2.mp3` |
| Challenge intro | `assets/parts/part2/audio/intro/challenge.mp3` |
| Narrator count | `5` |

### Rooms and verbs

| Room ID | Room name | Room image file | Verb IDs in this room |
| --- | --- | --- | --- |
| `room1` | `Room 1` | `assets/parts/part2/images/room1.jpg` | `verb1` |

### Verb data

| Verb ID | Room ID | Base | Preterite | Participle | French meaning | Type | Hotspot X | Hotspot Y | Radius | MCQ option 1 | MCQ option 2 | MCQ option 3 | Audio file override |
| --- | --- | --- | --- | --- | --- | --- | ---: | ---: | ---: | --- | --- | --- | --- |
| `verb1` | `room1` |  |  |  |  | `1` | `0` | `0` | `50` | `base / preterite / participle` | `wrong / wrong / wrong` | `wrong / wrong / wrong` |  |

---

## Part 3

### Part info

| Field | Value |
| --- | --- |
| Part ID | `3` |
| Title | `Irregular Verbs - Part 3` |
| Assets root | `assets/parts/part3` |
| Intro audio 1 | `assets/parts/part3/audio/intro/let_s_learn.mp3` |
| Intro audio 2 | `assets/parts/part3/audio/intro/part3.mp3` |
| Challenge intro | `assets/parts/part3/audio/intro/challenge.mp3` |
| Narrator count | `5` |

### Rooms and verbs

| Room ID | Room name | Room image file | Verb IDs in this room |
| --- | --- | --- | --- |
| `room1` | `Room 1` | `assets/parts/part3/images/room1.jpg` | `verb1` |

### Verb data

| Verb ID | Room ID | Base | Preterite | Participle | French meaning | Type | Hotspot X | Hotspot Y | Radius | MCQ option 1 | MCQ option 2 | MCQ option 3 | Audio file override |
| --- | --- | --- | --- | --- | --- | --- | ---: | ---: | ---: | --- | --- | --- | --- |
| `verb1` | `room1` |  |  |  |  | `1` | `0` | `0` | `50` | `base / preterite / participle` | `wrong / wrong / wrong` | `wrong / wrong / wrong` |  |

---

## Part 4

### Part info

| Field | Value |
| --- | --- |
| Part ID | `4` |
| Title | `Irregular Verbs - Part 4` |
| Assets root | `assets/parts/part4` |
| Intro audio 1 | `assets/parts/part4/audio/intro/let_s_learn.mp3` |
| Intro audio 2 | `assets/parts/part4/audio/intro/part4.mp3` |
| Challenge intro | `assets/parts/part4/audio/intro/challenge.mp3` |
| Narrator count | `5` |

### Rooms and verbs

| Room ID | Room name | Room image file | Verb IDs in this room |
| --- | --- | --- | --- |
| `room1` | `Room 1` | `assets/parts/part4/images/room1.jpg` | `verb1` |

### Verb data

| Verb ID | Room ID | Base | Preterite | Participle | French meaning | Type | Hotspot X | Hotspot Y | Radius | MCQ option 1 | MCQ option 2 | MCQ option 3 | Audio file override |
| --- | --- | --- | --- | --- | --- | --- | ---: | ---: | ---: | --- | --- | --- | --- |
| `verb1` | `room1` |  |  |  |  | `1` | `0` | `0` | `50` | `base / preterite / participle` | `wrong / wrong / wrong` | `wrong / wrong / wrong` |  |

---

## Notes for generation

- `config.js` comes from the part info table.
- `data.js` comes from the rooms and verb tables.
- `index.js` is a small export wrapper and can be generated automatically.
- If you add more rooms, just add more rows in the rooms table.
- If one room has multiple verbs, list them in the room row and add one verb row per verb.
- If a verb uses a custom audio file, put the full relative path in `Audio file override`.
- For hotspot coordinates, use the coordinates of the center point in the original image.
- Keep the `Type` value aligned with the existing game logic.

