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
| `room21` | `US Segregation` | `assets/parts/part2/images/2-1.jpg` | `fight` |
| `room21` | `US Segregation` | `assets/parts/part2/images/2-1.jpg` | `lead` |
| `room21` | `US Segregation` | `assets/parts/part2/images/2-1.jpg` | `hold` |
| `room21` | `US Segregation` | `assets/parts/part2/images/2-1.jpg` | `hear` |
| `room21` | `US Segregation` | `assets/parts/part2/images/2-1.jpg` | `forbid` |
| `room22` | `Shakespeare's Theater` | `assets/parts/part2/images/2-2.jpg` | `kneel` |
| `room22` | `Shakespeare's Theater` | `assets/parts/part2/images/2-2.jpg` | `hide` |
| `room22` | `Shakespeare's Theater` | `assets/parts/part2/images/2-2.jpg` | `hit` |
| `room22` | `Shakespeare's Theater` | `assets/parts/part2/images/2-2.jpg` | `hurt` |
| `room22` | `Shakespeare's Theater` | `assets/parts/part2/images/2-2.jpg` | `lay` |
| `room23` | `Irish Famine` | `assets/parts/part2/images/2-3.jpg` | `grow` |
| `room23` | `Irish Famine` | `assets/parts/part2/images/2-3.jpg` | `feed` |
| `room23` | `Irish Famine` | `assets/parts/part2/images/2-3.jpg` | `eat` |
| `room23` | `Irish Famine` | `assets/parts/part2/images/2-3.jpg` | `freeze` |
| `room23` | `Irish Famine` | `assets/parts/part2/images/2-3.jpg` | `fall` |
| `room24` | `Medieval Court` | `assets/parts/part2/images/2-4.jpg` | `feel` |
| `room24` | `Medieval Court` | `assets/parts/part2/images/2-4.jpg` | `forgive` |
| `room24` | `Medieval Court` | `assets/parts/part2/images/2-4.jpg` | `keep` |
| `room24` | `Medieval Court` | `assets/parts/part2/images/2-4.jpg` | `hang` |
| `room24` | `Medieval Court` | `assets/parts/part2/images/2-4.jpg` | `drink` |
| `room25` | `Industrial Revolution` | `assets/parts/part2/images/2-5.jpg` | `drive` |
| `room25` | `Industrial Revolution` | `assets/parts/part2/images/2-5.jpg` | `grind` |
| `room25` | `Industrial Revolution` | `assets/parts/part2/images/2-5.jpg` | `get` |
| `room25` | `Industrial Revolution` | `assets/parts/part2/images/2-5.jpg` | `have` |
| `room25` | `Industrial Revolution` | `assets/parts/part2/images/2-5.jpg` | `know` |
| `room26` | `Age of Exploration` | `assets/parts/part2/images/2-6.jpg` | `find` |
| `room26` | `Age of Exploration` | `assets/parts/part2/images/2-6.jpg` | `fly` |
| `room26` | `Age of Exploration` | `assets/parts/part2/images/2-6.jpg` | `give` |
| `room26` | `Age of Exploration` | `assets/parts/part2/images/2-6.jpg` | `go` |
| `room26` | `Age of Exploration` | `assets/parts/part2/images/2-6.jpg` | `forget` |

### Verb data

| Verb ID | Room ID | Base | Preterite | Participle | French meaning | Type | Hotspot X | Hotspot Y | Radius | MCQ option 1 | MCQ option 2 | MCQ option 3 | Audio file override |
| --- | --- | --- | --- | --- | --- | --- | ---: | ---: | ---: | --- | --- | --- | --- |
| `fight` | `room21` | `fight` | `fought` | `fought` | `se battre` | `2` | `585` | `410` | `50` | `fight / fought / fought` | `fight / faught / faught` | `fight / thought / thought` |  |
| `lead` | `room21` | `lead` | `led` | `led` | `mener` | `2` | `125` | `400` | `50` | `lead / led / led` | `lead / lead / lead` | `lead / lead / led` |  |
| `hold` | `room21` | `hold` | `held` | `held` | `tenir` | `2` | `1290` | `435` | `50` | `hold / held / held` | `hold / hold / hold` | `hold / held / hold` |  |
| `hear` | `room21` | `hear` | `heard` | `heard` | `entendre` | `2` | `965` | `445` | `50` | `hear / heard / heard` | `hear / hear / hear` | `hear / heared / heared` |  |
| `forbid` | `room21` | `forbid` | `forbade` | `forbidden` | `interdire` | `3` | `880` | `320` | `50` | `forbid / forbade / forbidden` | `forbid / forbad / forbid` | `forbid / forbad / forbidden` |  |
| `kneel` | `room22` | `kneel` | `knelt` | `knelt` | `s'agenouiller` | `2` | `555` | `585` | `50` | `kneel / knelt / knelt` | `kneel / kneel / kneel` | `kneel / kneeled / kneeled` |  |
| `hide` | `room22` | `hide` | `hid` | `hidden` | `(se) cacher` | `3` | `220` | `415` | `50` | `hide / hid / hidden` | `hide / hid / hid` | `hide / hide / hidden` |  |
| `hit` | `room22` | `hit` | `hit` | `hit` | `frapper (usuel)` | `1` | `1225` | `430` | `50` | `hit / hit / hit` | `hit / hat / hut` | `hit / hat / hat` |  |
| `hurt` | `room22` | `hurt` | `hurt` | `hurt` | `blesser` | `1` | `1245` | `655` | `50` | `hurt / hurt / hurt` | `hurt / hart / hurt` | `hurt / hirt / hirt` |  |
| `lay` | `room22` | `lay` | `laid` | `laid` | `poser` | `2` | `745` | `460` | `50` | `lay / laid / laid` | `lay / lay / lain` | `lay / laid / lain` |  |
| `grow` | `room23` | `grow` | `grew` | `grown` | `grandir` | `3` | `375` | `655` | `50` | `grow / grew / grown` | `grow / grewn / grown` | `grow / growed / grown` |  |
| `feed` | `room23` | `feed` | `fed` | `fed` | `nourrir` | `2` | `525` | `370` | `50` | `feed / fed / fed` | `feed / feed / feed` | `feed / fed / feed` |  |
| `eat` | `room23` | `eat` | `ate` | `eaten` | `manger` | `3` | `745` | `410` | `50` | `eat / ate / eaten` | `eat / ate / ate` | `eat / eat / eaten` |  |
| `freeze` | `room23` | `freeze` | `froze` | `frozen` | `geler` | `3` | `1000` | `425` | `50` | `freeze / froze / frozen` | `freeze / froze / froze` | `freeze / freezed / frozen` |  |
| `fall` | `room23` | `fall` | `fell` | `fallen` | `tomber` | `3` | `1175` | `680` | `50` | `fall / fell / fallen` | `fall / fell / fell` | `fall / fall / fallen` |  |
| `feel` | `room24` | `feel` | `felt` | `felt` | `(res)sentir` | `2` | `355` | `375` | `50` | `feel / felt / felt` | `feel / feel / feel` | `feel / felt / feel` |  |
| `forgive` | `room24` | `forgive` | `forgave` | `forgiven` | `pardonner` | `3` | `715` | `425` | `50` | `forgive / forgave / forgiven` | `forgive / forgave / forguven` | `forgive / forgave / forgive` |  |
| `keep` | `room24` | `keep` | `kept` | `kept` | `garder` | `2` | `1060` | `380` | `50` | `keep / kept / kept` | `keep / keep / keep` | `keep / keeped / keeped` |  |
| `hang` | `room24` | `hang` | `hung` | `hung` | `accrocher, pendre` | `2` | `140` | `190` | `50` | `hang / hung / hung` | `hang / hang / hang` | `hang / hang / hung` |  |
| `drink` | `room24` | `drink` | `drank` | `drunk` | `boire` | `3` | `1240` | `340` | `50` | `drink / drank / drunk` | `drink / drank / drank` | `drink / drunk / drunk` |  |
| `drive` | `room25` | `drive` | `drove` | `driven` | `conduire` | `3` | `810` | `375` | `50` | `drive / drove / driven` | `drive / drave / druven` | `drive / drive / driven` |  |
| `grind` | `room25` | `grind` | `ground` | `ground` | `moudre` | `2` | `385` | `410` | `50` | `grind / ground / ground` | `grind / grind / grind` | `grind / grount / grount` |  |
| `get` | `room25` | `get` | `got` | `got` | `obtenir` | `2` | `260` | `505` | `50` | `get / got / got` | `get / get / get` | `get / gat / got` |  |
| `have` | `room25` | `have` | `had` | `had` | `avoir` | `2` | `1125` | `360` | `50` | `have / had / had` | `have / hat / hat` | `have / had / have` |  |
| `know` | `room25` | `know` | `knew` | `known` | `connaître, savoir` | `3` | `1285` | `290` | `50` | `know / knew / known` | `know / knew / knew` | `know / knowed / known` |  |
| `find` | `room26` | `find` | `found` | `found` | `trouver` | `2` | `530` | `535` | `50` | `find / found / found` | `find / find / find` | `find / finded / finded` |  |
| `fly` | `room26` | `fly` | `flew` | `flown` | `voler` | `3` | `580` | `235` | `50` | `fly / flew / flown` | `fly / flew / flawn` | `fly / flew / flewn` |  |
| `give` | `room26` | `give` | `gave` | `given` | `donner` | `3` | `950` | `455` | `50` | `give / gave / given` | `give / gave / gave` | `give / gave / goven` |  |
| `go` | `room26` | `go` | `went` | `gone` | `aller` | `3` | `150` | `355` | `50` | `go / went / gone` | `go / went / went` | `go / gone / went` |  |
| `forget` | `room26` | `forget` | `forgot` | `forgotten` | `oublier` | `3` | `1240` | `340` | `50` | `forget / forgot / forgotten` | `forget / forgot / forget` | `forget / forgot / forgetten` |  |

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
| `room31` | `Sunrise` | `assets/parts/part3/images/3-1.jpg` | `rise` |
| `room31` | `Sunrise` | `assets/parts/part3/images/3-1.jpg` | `shine` |
| `room31` | `Sunrise` | `assets/parts/part3/images/3-1.jpg` | `light` |
| `room31` | `Sunrise` | `assets/parts/part3/images/3-1.jpg` | `sit` |
| `room31` | `Sunrise` | `assets/parts/part3/images/3-1.jpg` | `see` |
| `room32` | `Forest` | `assets/parts/part3/images/3-2.jpg` | `run` |
| `room32` | `Forest` | `assets/parts/part3/images/3-2.jpg` | `ride` |
| `room32` | `Forest` | `assets/parts/part3/images/3-2.jpg` | `shake` |
| `room32` | `Forest` | `assets/parts/part3/images/3-2.jpg` | `shoot` |
| `room32` | `Forest` | `assets/parts/part3/images/3-2.jpg` | `seek` |
| `room33` | `Campfire` | `assets/parts/part3/images/3-3.jpg` | `make` |
| `room33` | `Campfire` | `assets/parts/part3/images/3-3.jpg` | `meet` |
| `room33` | `Campfire` | `assets/parts/part3/images/3-3.jpg` | `say` |
| `room33` | `Campfire` | `assets/parts/part3/images/3-3.jpg` | `pay` |
| `room33` | `Campfire` | `assets/parts/part3/images/3-3.jpg` | `sing` |
| `room34` | `Storm` | `assets/parts/part3/images/3-4.jpg` | `set` |
| `room34` | `Storm` | `assets/parts/part3/images/3-4.jpg` | `shut` |
| `room34` | `Storm` | `assets/parts/part3/images/3-4.jpg` | `let` |
| `room34` | `Storm` | `assets/parts/part3/images/3-4.jpg` | `ring` |
| `room34` | `Storm` | `assets/parts/part3/images/3-4.jpg` | `mean` |
| `room35` | `Archaeology` | `assets/parts/part3/images/3-5.jpg` | `learn` |
| `room35` | `Archaeology` | `assets/parts/part3/images/3-5.jpg` | `leave` |
| `room35` | `Archaeology` | `assets/parts/part3/images/3-5.jpg` | `lie` |
| `room35` | `Archaeology` | `assets/parts/part3/images/3-5.jpg` | `read` |
| `room35` | `Archaeology` | `assets/parts/part3/images/3-5.jpg` | `show` |
| `room36` | `Trade` | `assets/parts/part3/images/3-6.jpg` | `lend` |
| `room36` | `Trade` | `assets/parts/part3/images/3-6.jpg` | `lose` |
| `room36` | `Trade` | `assets/parts/part3/images/3-6.jpg` | `put` |
| `room36` | `Trade` | `assets/parts/part3/images/3-6.jpg` | `sell` |
| `room36` | `Trade` | `assets/parts/part3/images/3-6.jpg` | `send` |

### Verb data

| Verb ID | Room ID | Base | Preterite | Participle | French meaning | Type | Hotspot X | Hotspot Y | Radius | MCQ option 1 | MCQ option 2 | MCQ option 3 | Audio file override |
| --- | --- | --- | --- | --- | --- | --- | ---: | ---: | ---: | --- | --- | --- | --- |
| `rise` | `room31` | `rise` | `rose` | `risen` | `s'élever, monter` | `3` | `680` | `140` | `50` | `rise / rose / risen` | `rise / rose / rose` | `rise / rise / risen` |  |
| `shine` | `room31` | `shine` | `shone` | `shone` | `briller` | `2` | `675` | `240` | `50` | `shine / shone / shone` | `shine / shine / shine` | `shine / shined / shined` |  |
| `light` | `room31` | `light` | `lit` | `lit` | `allumer` | `2` | `340` | `595` | `50` | `light / lit / lit` | `light / light / light` | `light / lit / light` |  |
| `sit` | `room31` | `sit` | `sat` | `sat` | `s'asseoir` | `2` | `880` | `510` | `50` | `sit / sat / sat` | `sit / sit / sit` | `sit / sat / sut` |  |
| `see` | `room31` | `see` | `saw` | `seen` | `voir` | `3` | `1175` | `260` | `50` | `see / saw / seen` | `see / saw / saw` | `see / see / seen` |  |
| `run` | `room32` | `run` | `ran` | `run` | `courir` | `2` | `615` | `315` | `50` | `run / ran / run` | `run / ran / rin` | `run / run / run` |  |
| `ride` | `room32` | `ride` | `rode` | `ridden` | `chevaucher` | `3` | `815` | `330` | `50` | `ride / rode / ridden` | `ride / rode / rode` | `ride / ride / ridden` |  |
| `shake` | `room32` | `shake` | `shook` | `shaken` | `secouer` | `3` | `210` | `250` | `50` | `shake / shook / shaken` | `shake / shook / shook` | `shake / shaked / shaken` |  |
| `shoot` | `room32` | `shoot` | `shot` | `shot` | `tirer (arme)` | `2` | `1225` | `260` | `50` | `shoot / shot / shot` | `shut / shot / shot` | `shoot / shat / shot` |  |
| `seek` | `room32` | `seek` | `sought` | `sought` | `chercher` | `2` | `1240` | `520` | `50` | `seek / sought / sought` | `seek / fought / fought` | `seek / sougth / sougth` |  |
| `make` | `room33` | `make` | `made` | `made` | `fabriquer` | `2` | `665` | `425` | `50` | `make / made / made` | `make / make / make` | `make / maked / maked` |  |
| `meet` | `room33` | `meet` | `met` | `met` | `rencontrer` | `2` | `325` | `250` | `50` | `meet / met / met` | `meet / meet / meet` | `meet / met / meet` |  |
| `say` | `room33` | `say` | `said` | `said` | `dire (qqch)` | `2` | `940` | `170` | `50` | `say / said / said` | `say / say / say` | `say / sayed / sayed` |  |
| `pay` | `room33` | `pay` | `paid` | `paid` | `payer` | `2` | `1020` | `315` | `50` | `pay / paid / paid` | `pay / pay / pay` | `pay / payed / payed` |  |
| `sing` | `room33` | `sing` | `sang` | `sung` | `chanter` | `3` | `1270` | `385` | `50` | `sing / sang / sung` | `sing / sing / sung` | `sing / sung / sing` |  |
| `set` | `room34` | `set` | `set` | `set` | `placer` | `1` | `545` | `560` | `50` | `set / set / set` | `set / selt / selt` | `set / sat / sat` |  |
| `shut` | `room34` | `shut` | `shut` | `shut` | `fermer` | `1` | `1010` | `440` | `50` | `shut / shut / shut` | `shut / shat / shot` | `shut / shot / shot` |  |
| `let` | `room34` | `let` | `let` | `let` | `laisser, louer` | `1` | `215` | `415` | `50` | `let / let / let` | `let / lit / lit` | `let / lat / lit` |  |
| `ring` | `room34` | `ring` | `rang` | `rung` | `sonner` | `3` | `1225` | `290` | `50` | `ring / rang / rung` | `ring / rung / rung` | `ring / rung / rang` |  |
| `mean` | `room34` | `mean` | `meant` | `meant` | `signifier` | `2` | `500` | `355` | `50` | `mean / meant / meant` | `mean / met / met` | `mean / melt / melt` |  |
| `learn` | `room35` | `learn` | `learnt` | `learnt` | `apprendre` | `2` | `550` | `375` | `50` | `learn / learnt / learnt` | `learn / learn / learn` | `learn / learnt / learn` |  |
| `leave` | `room35` | `leave` | `left` | `left` | `partir, quitter` | `2` | `1265` | `125` | `50` | `leave / left / left` | `leave / leave / leave` | `leave / leaved / leaved` |  |
| `lie` | `room35` | `lie` | `lay` | `lain` | `être étendu` | `3` | `260` | `325` | `50` | `lie / lay / lain` | `lie / lay / laid` | `lie / laid / lain` |  |
| `read` | `room35` | `read` | `read` | `read` | `lire` | `1` | `1005` | `335` | `50` | `read / read / read` | `read / red / read` | `read / red / red` |  |
| `show` | `room35` | `show` | `showed` | `shown` | `montrer` | `3` | `175` | `100` | `50` | `show / showed / shown` | `show / showed / showed` | `show / showed / shawn` |  |
| `lend` | `room36` | `lend` | `lent` | `lent` | `prêter` | `2` | `425` | `345` | `50` | `lend / lent / lent` | `lend / lend / lend` | `lend / lend / lent` |  |
| `lose` | `room36` | `lose` | `lost` | `lost` | `perdre` | `2` | `825` | `660` | `50` | `lose / lost / lost` | `lose / lose / lose` | `lose / lost / lose` |  |
| `put` | `room36` | `put` | `put` | `put` | `mettre` | `1` | `1180` | `260` | `50` | `put / put / put` | `put / pat / put` | `put / pat / pat` |  |
| `sell` | `room36` | `sell` | `sold` | `sold` | `vendre` | `2` | `1110` | `485` | `50` | `sell / sold / sold` | `sell / seld / seld` | `sell / selled / selled` |  |
| `send` | `room36` | `send` | `sent` | `sent` | `envoyer` | `2` | `690` | `265` | `50` | `send / sent / sent` | `send / send / send` | `send / send / sent` |  |

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
| `room41` | `Alien Classroom` | `assets/parts/part4/images/4-1.jpg` | `understand` |
| `room41` | `Alien Classroom` | `assets/parts/part4/images/4-1.jpg` | `think` |
| `room41` | `Alien Classroom` | `assets/parts/part4/images/4-1.jpg` | `teach` |
| `room41` | `Alien Classroom` | `assets/parts/part4/images/4-1.jpg` | `write` |
| `room41` | `Alien Classroom` | `assets/parts/part4/images/4-1.jpg` | `spell` |
| `room42` | `Kung Fu Training` | `assets/parts/part4/images/4-2.jpg` | `swim` |
| `room42` | `Kung Fu Training` | `assets/parts/part4/images/4-2.jpg` | `win` |
| `room42` | `Kung Fu Training` | `assets/parts/part4/images/4-2.jpg` | `strike` |
| `room42` | `Kung Fu Training` | `assets/parts/part4/images/4-2.jpg` | `stand` |
| `room42` | `Kung Fu Training` | `assets/parts/part4/images/4-2.jpg` | `take` |
| `room43` | `Kitchen Nightmares` | `assets/parts/part4/images/4-3.jpg` | `smell` |
| `room43` | `Kitchen Nightmares` | `assets/parts/part4/images/4-3.jpg` | `spill` |
| `room43` | `Kitchen Nightmares` | `assets/parts/part4/images/4-3.jpg` | `spoil` |
| `room43` | `Kitchen Nightmares` | `assets/parts/part4/images/4-3.jpg` | `sweep` |
| `room43` | `Kitchen Nightmares` | `assets/parts/part4/images/4-3.jpg` | `wear` |
| `room44` | `Mission Impossible` | `assets/parts/part4/images/4-4.jpg` | `stick` |
| `room44` | `Mission Impossible` | `assets/parts/part4/images/4-4.jpg` | `spread` |
| `room44` | `Mission Impossible` | `assets/parts/part4/images/4-4.jpg` | `tear` |
| `room44` | `Mission Impossible` | `assets/parts/part4/images/4-4.jpg` | `throw` |
| `room44` | `Mission Impossible` | `assets/parts/part4/images/4-4.jpg` | `upset` |
| `room45` | `Casino` | `assets/parts/part4/images/4-5.jpg` | `spend` |
| `room45` | `Casino` | `assets/parts/part4/images/4-5.jpg` | `withdraw` |
| `room45` | `Casino` | `assets/parts/part4/images/4-5.jpg` | `tell` |
| `room45` | `Casino` | `assets/parts/part4/images/4-5.jpg` | `speak` |
| `room45` | `Casino` | `assets/parts/part4/images/4-5.jpg` | `swear` |
| `room46` | `Scream` | `assets/parts/part4/images/4-6.jpg` | `sleep` |
| `room46` | `Scream` | `assets/parts/part4/images/4-6.jpg` | `wake` |
| `room46` | `Scream` | `assets/parts/part4/images/4-6.jpg` | `stink` |
| `room46` | `Scream` | `assets/parts/part4/images/4-6.jpg` | `sting` |
| `room46` | `Scream` | `assets/parts/part4/images/4-6.jpg` | `steal` |

### Verb data

| Verb ID | Room ID | Base | Preterite | Participle | French meaning | Type | Hotspot X | Hotspot Y | Radius | MCQ option 1 | MCQ option 2 | MCQ option 3 | Audio file override |
| --- | --- | --- | --- | --- | --- | --- | ---: | ---: | ---: | --- | --- | --- | --- |
| `understand` | `room41` | `understand` | `understood` | `understood` | `comprendre` | `2` | `605` | `295` | `50` | `understand / understood / understood` | `understand / understand / understand` | `understand / understand / understood` |  |
| `think` | `room41` | `think` | `thought` | `thought` | `penser` | `2` | `290` | `340` | `50` | `think / thought / thought` | `think / fought / fought` | `think / thaught / thaught` |  |
| `teach` | `room41` | `teach` | `taught` | `taught` | `enseigner` | `2` | `910` | `260` | `50` | `teach / taught / taught` | `teach / thaught / thaught` | `teach / tought / tought` |  |
| `write` | `room41` | `write` | `wrote` | `written` | `écrire` | `3` | `1110` | `570` | `50` | `write / wrote / written` | `write / rote / ritten` | `write / wraught / written` |  |
| `spell` | `room41` | `spell` | `spelt` | `spelt` | `épeler` | `2` | `190` | `225` | `50` | `spell / spelt / spelt` | `spell / spell / spell` | `spell / spellt / spell` |  |
| `swim` | `room42` | `swim` | `swam` | `swum` | `nager` | `3` | `250` | `270` | `50` | `swim / swam / swum` | `swim / swum / swam` | `swim / swum / swum` |  |
| `win` | `room42` | `win` | `won` | `won` | `gagner` | `2` | `700` | `190` | `50` | `win / won / won` | `win / wan / wun` | `win / wone / wone` |  |
| `strike` | `room42` | `strike` | `struck` | `struck` | `frapper (formel)` | `2` | `1270` | `155` | `50` | `strike / struck / struck` | `strike / strack / struck` | `strike / strack / strack` |  |
| `stand` | `room42` | `stand` | `stood` | `stood` | `se tenir debout` | `2` | `230` | `510` | `50` | `stand / stood / stood` | `stand / stand / stand` | `stand / stand / stood` |  |
| `take` | `room42` | `take` | `took` | `taken` | `prendre` | `3` | `1230` | `590` | `50` | `take / took / taken` | `take / took / took` | `take / taked / taken` |  |
| `smell` | `room43` | `smell` | `smelt` | `smelt` | `sentir (odorat)` | `2` | `160` | `300` | `50` | `smell / smelt / smelt` | `smell / smell / smell` | `smell / smeld / smeld` |  |
| `spill` | `room43` | `spill` | `spilt` | `spilt` | `renverser` | `2` | `550` | `590` | `50` | `spill / spilt / spilt` | `spill / spill / spill` | `spill / spild / spild` |  |
| `spoil` | `room43` | `spoil` | `spoilt` | `spoilt` | `gâcher` | `2` | `1340` | `405` | `50` | `spoil / spoilt / spoilt` | `spoil / spoiled / spoilt` | `spoil / spoild / spoild` |  |
| `sweep` | `room43` | `sweep` | `swept` | `swept` | `balayer` | `2` | `680` | `270` | `50` | `sweep / swept / swept` | `sweep / sweep / sweep` | `sweep / swept / sweep` |  |
| `wear` | `room43` | `wear` | `wore` | `worn` | `porter (vêtements)` | `3` | `875` | `210` | `50` | `wear / wore / worn` | `wear / wore / warn` | `wear / wore / wore` |  |
| `stick` | `room44` | `stick` | `stuck` | `stuck` | `coller` | `2` | `550` | `450` | `50` | `stick / stuck / stuck` | `stick / stack / stuck` | `stick / stack / stack` |  |
| `spread` | `room44` | `spread` | `spread` | `spread` | `étaler` | `1` | `800` | `465` | `50` | `spread / spread / spread` | `spread / spreat / spreat` | `spread / spred / spred` |  |
| `tear` | `room44` | `tear` | `tore` | `torn` | `déchirer` | `3` | `1240` | `360` | `50` | `tear / tore / torn` | `tear / tore / tore` | `tear / tore / tarn` |  |
| `throw` | `room44` | `throw` | `threw` | `thrown` | `jeter` | `3` | `945` | `110` | `50` | `throw / threw / thrown` | `throw / threw / thrawn` | `throw / threw / threw` |  |
| `upset` | `room44` | `upset` | `upset` | `upset` | `bouleverser` | `1` | `385` | `280` | `50` | `upset / upset / upset` | `upset / upsat / upsat` | `upset / upsot / upsot` |  |
| `spend` | `room45` | `spend` | `spent` | `spent` | `dépenser (argent), passer (temps)` | `2` | `435` | `620` | `50` | `spend / spent / spent` | `spend / spend / spend` | `spend / spent / spend` |  |
| `withdraw` | `room45` | `withdraw` | `withdrew` | `withdrawn` | `retirer` | `3` | `175` | `285` | `50` | `withdraw / withdrew / withdrawn` | `withdraw / withdraw / withdraw` | `withdraw / withdrew / withdrown` |  |
| `tell` | `room45` | `tell` | `told` | `told` | `dire (qqch à qqn)` | `2` | `630` | `460` | `50` | `tell / told / told` | `tell / tell / tell` | `tell / teld / teld` |  |
| `speak` | `room45` | `speak` | `spoke` | `spoken` | `parler` | `3` | `935` | `325` | `50` | `speak / spoke / spoken` | `speak / spack / spuck` | `speak / spock / spocken` |  |
| `swear` | `room45` | `swear` | `swore` | `sworn` | `jurer` | `3` | `1275` | `375` | `50` | `swear / swore / sworn` | `swear / sword / sword` | `swear / sword / sworn` |  |
| `sleep` | `room46` | `sleep` | `slept` | `slept` | `dormir` | `2` | `1170` | `405` | `50` | `sleep / slept / slept` | `sleep / slep / slep` | `sleep / slepd / slepd` |  |
| `wake` | `room46` | `wake` | `woke` | `woken` | `réveiller` | `3` | `505` | `390` | `50` | `wake / woke / woken` | `wake / woke / woke` | `wake / wake / woken` |  |
| `stink` | `room46` | `stink` | `stank` | `stunk` | `puer` | `3` | `735` | `550` | `50` | `stink / stank / stunk` | `stink / stank / stank` | `stink / stunk / stunk` |  |
| `sting` | `room46` | `sting` | `stung` | `stung` | `piquer` | `2` | `310` | `345` | `50` | `sting / stung / stung` | `sting / stang / stung` | `sting / stang / stang` |  |
| `steal` | `room46` | `steal` | `stole` | `stolen` | `voler, dérober` | `3` | `190` | `410` | `50` | `steal / stole / stolen` | `steal / stole / stole` | `steal / steal / stolen` |  |

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

