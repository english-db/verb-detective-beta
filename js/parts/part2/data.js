/**
 * HOTSPOTS & VERB DATA
 * Irregular Verbs - Part 2
 *
 * Contains:
 * - HOTSPOTS: Clickable areas and verb locations
 * - VERB_FORMS: Base, preterite, participle for each verb
 * - QCM_OPTIONS: Multiple choice options
 * - MATCHING_OPTIONS: Same as QCM (for matching activities)
 * - ROOMS: Room metadata and verb assignments
 */

const IMAGE_WIDTH = 1380;
const IMAGE_HEIGHT = 752;

function toPercent(value, total) {
  return Number(((value / total) * 100).toFixed(4));
}

function makeHotspot(x, y, radius) {
  return {
    x: toPercent(x, IMAGE_WIDTH),
    y: toPercent(y, IMAGE_HEIGHT),
    radius: toPercent(radius, IMAGE_WIDTH)
  };
}

export const HOTSPOTS = {
  room21: {
    name: "US Segregation",
    imageFile: "assets/parts/part2/images/2-1.jpg",
    verbs: {
      fight: makeHotspot(585, 410, 80),
      lead: makeHotspot(125, 400, 80),
      hold: makeHotspot(1290, 435, 80),
      hear: makeHotspot(965, 445, 80),
      forbid: makeHotspot(880, 320, 80)
    }
  },
  room22: {
    name: "Shakespeare's Theater",
    imageFile: "assets/parts/part2/images/2-2.jpg",
    verbs: {
      kneel: makeHotspot(555, 585, 80),
      hide: makeHotspot(220, 415, 80),
      hit: makeHotspot(1225, 430, 80),
      hurt: makeHotspot(1245, 655, 80),
      lay: makeHotspot(745, 460, 80)
    }
  },
  room23: {
    name: "Irish Famine",
    imageFile: "assets/parts/part2/images/2-3.jpg",
    verbs: {
      grow: makeHotspot(375, 655, 80),
      feed: makeHotspot(525, 370, 80),
      eat: makeHotspot(745, 410, 80),
      freeze: makeHotspot(1000, 425, 80),
      fall: makeHotspot(1175, 680, 80)
    }
  },
  room24: {
    name: "Medieval Court",
    imageFile: "assets/parts/part2/images/2-4.jpg",
    verbs: {
      feel: makeHotspot(355, 375, 80),
      forgive: makeHotspot(715, 425, 80),
      keep: makeHotspot(1060, 380, 80),
      hang: makeHotspot(140, 190, 80),
      drink: makeHotspot(1240, 340, 80)
    }
  },
  room25: {
    name: "Industrial Revolution",
    imageFile: "assets/parts/part2/images/2-5.jpg",
    verbs: {
      drive: makeHotspot(810, 375, 80),
      grind: makeHotspot(385, 410, 80),
      get: makeHotspot(260, 505, 80),
      have: makeHotspot(1125, 360, 80),
      know: makeHotspot(1285, 290, 80)
    }
  },
  room26: {
    name: "Age of Exploration",
    imageFile: "assets/parts/part2/images/2-6.jpg",
    verbs: {
      find: makeHotspot(530, 535, 80),
      fly: makeHotspot(580, 235, 80),
      give: makeHotspot(950, 455, 80),
      go: makeHotspot(150, 355, 80),
      forget: makeHotspot(1240, 340, 80)
    }
  }
};

export const VERB_FORMS = {
  fight: { base: "fight", preterite: "fought", participle: "fought", fr: "se battre", type: 2 },
  lead: { base: "lead", preterite: "led", participle: "led", fr: "mener", type: 2 },
  hold: { base: "hold", preterite: "held", participle: "held", fr: "tenir", type: 2 },
  hear: { base: "hear", preterite: "heard", participle: "heard", fr: "entendre", type: 2 },
  forbid: { base: "forbid", preterite: "forbade", participle: "forbidden", fr: "interdire", type: 3 },
  kneel: { base: "kneel", preterite: "knelt", participle: "knelt", fr: "s'agenouiller", type: 2 },
  hide: { base: "hide", preterite: "hid", participle: "hidden", fr: "(se) cacher", type: 3 },
  hit: { base: "hit", preterite: "hit", participle: "hit", fr: "frapper (usuel)", type: 1 },
  hurt: { base: "hurt", preterite: "hurt", participle: "hurt", fr: "blesser", type: 1 },
  lay: { base: "lay", preterite: "laid", participle: "laid", fr: "poser", type: 2 },
  grow: { base: "grow", preterite: "grew", participle: "grown", fr: "grandir", type: 3 },
  feed: { base: "feed", preterite: "fed", participle: "fed", fr: "nourrir", type: 2 },
  eat: { base: "eat", preterite: "ate", participle: "eaten", fr: "manger", type: 3 },
  freeze: { base: "freeze", preterite: "froze", participle: "frozen", fr: "geler", type: 3 },
  fall: { base: "fall", preterite: "fell", participle: "fallen", fr: "tomber", type: 3 },
  feel: { base: "feel", preterite: "felt", participle: "felt", fr: "(res)sentir", type: 2 },
  forgive: { base: "forgive", preterite: "forgave", participle: "forgiven", fr: "pardonner", type: 3 },
  keep: { base: "keep", preterite: "kept", participle: "kept", fr: "garder", type: 2 },
  hang: { base: "hang", preterite: "hung", participle: "hung", fr: "accrocher, pendre", type: 2 },
  drink: { base: "drink", preterite: "drank", participle: "drunk", fr: "boire", type: 3 },
  drive: { base: "drive", preterite: "drove", participle: "driven", fr: "conduire", type: 3 },
  grind: { base: "grind", preterite: "ground", participle: "ground", fr: "moudre", type: 2 },
  get: { base: "get", preterite: "got", participle: "got", fr: "obtenir", type: 2 },
  have: { base: "have", preterite: "had", participle: "had", fr: "avoir", type: 2 },
  know: { base: "know", preterite: "knew", participle: "known", fr: "connaître, savoir", type: 3 },
  find: { base: "find", preterite: "found", participle: "found", fr: "trouver", type: 2 },
  fly: { base: "fly", preterite: "flew", participle: "flown", fr: "voler", type: 3 },
  give: { base: "give", preterite: "gave", participle: "given", fr: "donner", type: 3 },
  go: { base: "go", preterite: "went", participle: "gone", fr: "aller", type: 3 },
  forget: { base: "forget", preterite: "forgot", participle: "forgotten", fr: "oublier", type: 3 }
};

export const QCM_OPTIONS = {
  fight: [
    { forms: "fight / fought / fought", correct: true },
    { forms: "fight / faught / faught", correct: false },
    { forms: "fight / thought / thought", correct: false }
  ],
  lead: [
    { forms: "lead / led / led", correct: true },
    { forms: "lead / lead / lead", correct: false },
    { forms: "lead / lead / led", correct: false }
  ],
  hold: [
    { forms: "hold / held / held", correct: true },
    { forms: "hold / hold / hold", correct: false },
    { forms: "hold / held / hold", correct: false }
  ],
  hear: [
    { forms: "hear / heard / heard", correct: true },
    { forms: "hear / hear / hear", correct: false },
    { forms: "hear / heared / heared", correct: false }
  ],
  forbid: [
    { forms: "forbid / forbade / forbidden", correct: true },
    { forms: "forbid / forbad / forbid", correct: false },
    { forms: "forbid / forbad / forbidden", correct: false }
  ],
  kneel: [
    { forms: "kneel / knelt / knelt", correct: true },
    { forms: "kneel / kneel / kneel", correct: false },
    { forms: "kneel / kneeled / kneeled", correct: false }
  ],
  hide: [
    { forms: "hide / hid / hidden", correct: true },
    { forms: "hide / hid / hid", correct: false },
    { forms: "hide / hide / hidden", correct: false }
  ],
  hit: [
    { forms: "hit / hit / hit", correct: true },
    { forms: "hit / hat / hut", correct: false },
    { forms: "hit / hat / hat", correct: false }
  ],
  hurt: [
    { forms: "hurt / hurt / hurt", correct: true },
    { forms: "hurt / hart / hurt", correct: false },
    { forms: "hurt / hirt / hirt", correct: false }
  ],
  lay: [
    { forms: "lay / laid / laid", correct: true },
    { forms: "lay / lay / lain", correct: false },
    { forms: "lay / laid / lain", correct: false }
  ],
  grow: [
    { forms: "grow / grew / grown", correct: true },
    { forms: "grow / grewn / grown", correct: false },
    { forms: "grow / growed / grown", correct: false }
  ],
  feed: [
    { forms: "feed / fed / fed", correct: true },
    { forms: "feed / feed / feed", correct: false },
    { forms: "feed / fed / feed", correct: false }
  ],
  eat: [
    { forms: "eat / ate / eaten", correct: true },
    { forms: "eat / ate / ate", correct: false },
    { forms: "eat / eat / eaten", correct: false }
  ],
  freeze: [
    { forms: "freeze / froze / frozen", correct: true },
    { forms: "freeze / froze / froze", correct: false },
    { forms: "freeze / freezed / frozen", correct: false }
  ],
  fall: [
    { forms: "fall / fell / fallen", correct: true },
    { forms: "fall / fell / fell", correct: false },
    { forms: "fall / fall / fallen", correct: false }
  ],
  feel: [
    { forms: "feel / felt / felt", correct: true },
    { forms: "feel / feel / feel", correct: false },
    { forms: "feel / felt / feel", correct: false }
  ],
  forgive: [
    { forms: "forgive / forgave / forgiven", correct: true },
    { forms: "forgive / forgave / forguven", correct: false },
    { forms: "forgive / forgave / forgive", correct: false }
  ],
  keep: [
    { forms: "keep / kept / kept", correct: true },
    { forms: "keep / keep / keep", correct: false },
    { forms: "keep / keeped / keeped", correct: false }
  ],
  hang: [
    { forms: "hang / hung / hung", correct: true },
    { forms: "hang / hang / hang", correct: false },
    { forms: "hang / hang / hung", correct: false }
  ],
  drink: [
    { forms: "drink / drank / drunk", correct: true },
    { forms: "drink / drank / drank", correct: false },
    { forms: "drink / drunk / drunk", correct: false }
  ],
  drive: [
    { forms: "drive / drove / driven", correct: true },
    { forms: "drive / drave / druven", correct: false },
    { forms: "drive / drive / driven", correct: false }
  ],
  grind: [
    { forms: "grind / ground / ground", correct: true },
    { forms: "grind / grind / grind", correct: false },
    { forms: "grind / grount / grount", correct: false }
  ],
  get: [
    { forms: "get / got / got", correct: true },
    { forms: "get / get / get", correct: false },
    { forms: "get / gat / got", correct: false }
  ],
  have: [
    { forms: "have / had / had", correct: true },
    { forms: "have / hat / hat", correct: false },
    { forms: "have / had / have", correct: false }
  ],
  know: [
    { forms: "know / knew / known", correct: true },
    { forms: "know / knew / knew", correct: false },
    { forms: "know / knowed / known", correct: false }
  ],
  find: [
    { forms: "find / found / found", correct: true },
    { forms: "find / find / find", correct: false },
    { forms: "find / finded / finded", correct: false }
  ],
  fly: [
    { forms: "fly / flew / flown", correct: true },
    { forms: "fly / flew / flawn", correct: false },
    { forms: "fly / flew / flewn", correct: false }
  ],
  give: [
    { forms: "give / gave / given", correct: true },
    { forms: "give / gave / gave", correct: false },
    { forms: "give / gave / goven", correct: false }
  ],
  go: [
    { forms: "go / went / gone", correct: true },
    { forms: "go / went / went", correct: false },
    { forms: "go / gone / went", correct: false }
  ],
  forget: [
    { forms: "forget / forgot / forgotten", correct: true },
    { forms: "forget / forgot / forget", correct: false },
    { forms: "forget / forgot / forgetten", correct: false }
  ]
};

export const MATCHING_OPTIONS = QCM_OPTIONS;

export const ROOMS = {
  room21: {
    id: "room21",
    name: "US Segregation",
    imageFile: "assets/parts/part2/images/2-1.jpg",
    verbIds: ["fight", "lead", "hold", "hear", "forbid"]
  },
  room22: {
    id: "room22",
    name: "Shakespeare's Theater",
    imageFile: "assets/parts/part2/images/2-2.jpg",
    verbIds: ["kneel", "hide", "hit", "hurt", "lay"]
  },
  room23: {
    id: "room23",
    name: "Irish Famine",
    imageFile: "assets/parts/part2/images/2-3.jpg",
    verbIds: ["grow", "feed", "eat", "freeze", "fall"]
  },
  room24: {
    id: "room24",
    name: "Medieval Court",
    imageFile: "assets/parts/part2/images/2-4.jpg",
    verbIds: ["feel", "forgive", "keep", "hang", "drink"]
  },
  room25: {
    id: "room25",
    name: "Industrial Revolution",
    imageFile: "assets/parts/part2/images/2-5.jpg",
    verbIds: ["drive", "grind", "get", "have", "know"]
  },
  room26: {
    id: "room26",
    name: "Age of Exploration",
    imageFile: "assets/parts/part2/images/2-6.jpg",
    verbIds: ["find", "fly", "give", "go", "forget"]
  }
};

export function getHotspot(roomId, verbId) {
  return HOTSPOTS[roomId]?.verbs?.[verbId] || null;
}

export function getVerbForm(verbId) {
  return VERB_FORMS[verbId] || null;
}

export function getQCMOptions(verbId) {
  return QCM_OPTIONS[verbId] || [];
}

export function getRoomVerbs(roomId) {
  return ROOMS[roomId]?.verbIds || [];
}

export function getAllRooms() {
  return Object.values(ROOMS);
}

export function getRoomData(roomId) {
  return ROOMS[roomId] || null;
}

export default {
  HOTSPOTS,
  VERB_FORMS,
  QCM_OPTIONS,
  MATCHING_OPTIONS,
  ROOMS
};
