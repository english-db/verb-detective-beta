/**
 * HOTSPOTS & VERB DATA
 * Irregular Verbs - Part 3
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
  room31: {
    name: "Sunrise",
    imageFile: "assets/parts/part3/images/3-1.jpg",
    verbs: {
      rise: makeHotspot(680, 140, 50),
      shine: makeHotspot(675, 240, 50),
      light: makeHotspot(340, 595, 50),
      sit: makeHotspot(880, 510, 50),
      see: makeHotspot(1175, 260, 50)
    }
  },
  room32: {
    name: "Forest",
    imageFile: "assets/parts/part3/images/3-2.jpg",
    verbs: {
      run: makeHotspot(615, 315, 50),
      ride: makeHotspot(815, 330, 50),
      shake: makeHotspot(210, 250, 50),
      shoot: makeHotspot(1225, 260, 50),
      seek: makeHotspot(1240, 520, 50)
    }
  },
  room33: {
    name: "Campfire",
    imageFile: "assets/parts/part3/images/3-3.jpg",
    verbs: {
      make: makeHotspot(665, 425, 50),
      meet: makeHotspot(325, 250, 50),
      say: makeHotspot(940, 170, 50),
      pay: makeHotspot(1020, 315, 50),
      sing: makeHotspot(1270, 385, 50)
    }
  },
  room34: {
    name: "Storm",
    imageFile: "assets/parts/part3/images/3-4.jpg",
    verbs: {
      set: makeHotspot(545, 560, 50),
      shut: makeHotspot(1010, 440, 50),
      let: makeHotspot(215, 415, 50),
      ring: makeHotspot(1225, 290, 50),
      mean: makeHotspot(500, 355, 50)
    }
  },
  room35: {
    name: "Archaeology",
    imageFile: "assets/parts/part3/images/3-5.jpg",
    verbs: {
      learn: makeHotspot(550, 375, 50),
      leave: makeHotspot(1265, 125, 50),
      lie: makeHotspot(260, 325, 50),
      read: makeHotspot(1005, 335, 50),
      show: makeHotspot(1115, 510, 50)
    }
  },
  room36: {
    name: "Trade",
    imageFile: "assets/parts/part3/images/3-6.jpg",
    verbs: {
      lend: makeHotspot(425, 345, 50),
      lose: makeHotspot(825, 660, 50),
      put: makeHotspot(1180, 260, 50),
      sell: makeHotspot(1110, 485, 50),
      send: makeHotspot(690, 265, 50)
    }
  }
};

export const VERB_FORMS = {
  rise: { base: "rise", preterite: "rose", participle: "risen", fr: "s'élever, monter", type: 3 },
  shine: { base: "shine", preterite: "shone", participle: "shone", fr: "briller", type: 2 },
  light: { base: "light", preterite: "lit", participle: "lit", fr: "allumer", type: 2 },
  sit: { base: "sit", preterite: "sat", participle: "sat", fr: "s'asseoir", type: 2 },
  see: { base: "see", preterite: "saw", participle: "seen", fr: "voir", type: 3 },
  run: { base: "run", preterite: "ran", participle: "run", fr: "courir", type: 2 },
  ride: { base: "ride", preterite: "rode", participle: "ridden", fr: "chevaucher", type: 3 },
  shake: { base: "shake", preterite: "shook", participle: "shaken", fr: "secouer", type: 3 },
  shoot: { base: "shoot", preterite: "shot", participle: "shot", fr: "tirer (arme)", type: 2 },
  seek: { base: "seek", preterite: "sought", participle: "sought", fr: "chercher", type: 2 },
  make: { base: "make", preterite: "made", participle: "made", fr: "fabriquer", type: 2 },
  meet: { base: "meet", preterite: "met", participle: "met", fr: "rencontrer", type: 2 },
  say: { base: "say", preterite: "said", participle: "said", fr: "dire (qqch)", type: 2 },
  pay: { base: "pay", preterite: "paid", participle: "paid", fr: "payer", type: 2 },
  sing: { base: "sing", preterite: "sang", participle: "sung", fr: "chanter", type: 3 },
  set: { base: "set", preterite: "set", participle: "set", fr: "placer", type: 1 },
  shut: { base: "shut", preterite: "shut", participle: "shut", fr: "fermer", type: 1 },
  let: { base: "let", preterite: "let", participle: "let", fr: "laisser, louer", type: 1 },
  ring: { base: "ring", preterite: "rang", participle: "rung", fr: "sonner", type: 3 },
  mean: { base: "mean", preterite: "meant", participle: "meant", fr: "signifier", type: 2 },
  learn: { base: "learn", preterite: "learnt", participle: "learnt", fr: "apprendre", type: 2 },
  leave: { base: "leave", preterite: "left", participle: "left", fr: "partir, quitter", type: 2 },
  lie: { base: "lie", preterite: "lay", participle: "lain", fr: "être étendu", type: 3 },
  read: { base: "read", preterite: "read", participle: "read", fr: "lire", type: 1 },
  show: { base: "show", preterite: "showed", participle: "shown", fr: "montrer", type: 3 },
  lend: { base: "lend", preterite: "lent", participle: "lent", fr: "prêter", type: 2 },
  lose: { base: "lose", preterite: "lost", participle: "lost", fr: "perdre", type: 2 },
  put: { base: "put", preterite: "put", participle: "put", fr: "mettre", type: 1 },
  sell: { base: "sell", preterite: "sold", participle: "sold", fr: "vendre", type: 2 },
  send: { base: "send", preterite: "sent", participle: "sent", fr: "envoyer", type: 2 }
};

export const QCM_OPTIONS = {
  rise: [
    { forms: "rise / rose / risen", correct: true },
    { forms: "rise / rose / rose", correct: false },
    { forms: "rise / rise / risen", correct: false }
  ],
  shine: [
    { forms: "shine / shone / shone", correct: true },
    { forms: "shine / shine / shine", correct: false },
    { forms: "shine / shined / shined", correct: false }
  ],
  light: [
    { forms: "light / lit / lit", correct: true },
    { forms: "light / light / light", correct: false },
    { forms: "light / lit / light", correct: false }
  ],
  sit: [
    { forms: "sit / sat / sat", correct: true },
    { forms: "sit / sit / sit", correct: false },
    { forms: "sit / sat / sut", correct: false }
  ],
  see: [
    { forms: "see / saw / seen", correct: true },
    { forms: "see / saw / saw", correct: false },
    { forms: "see / see / seen", correct: false }
  ],
  run: [
    { forms: "run / ran / run", correct: true },
    { forms: "run / ran / rin", correct: false },
    { forms: "run / run / run", correct: false }
  ],
  ride: [
    { forms: "ride / rode / ridden", correct: true },
    { forms: "ride / rode / rode", correct: false },
    { forms: "ride / ride / ridden", correct: false }
  ],
  shake: [
    { forms: "shake / shook / shaken", correct: true },
    { forms: "shake / shook / shook", correct: false },
    { forms: "shake / shaked / shaken", correct: false }
  ],
  shoot: [
    { forms: "shoot / shot / shot", correct: true },
    { forms: "shut / shot / shot", correct: false },
    { forms: "shoot / shat / shot", correct: false }
  ],
  seek: [
    { forms: "seek / sought / sought", correct: true },
    { forms: "seek / fought / fought", correct: false },
    { forms: "seek / sougth / sougth", correct: false }
  ],
  make: [
    { forms: "make / made / made", correct: true },
    { forms: "make / make / make", correct: false },
    { forms: "make / maked / maked", correct: false }
  ],
  meet: [
    { forms: "meet / met / met", correct: true },
    { forms: "meet / meet / meet", correct: false },
    { forms: "meet / met / meet", correct: false }
  ],
  say: [
    { forms: "say / said / said", correct: true },
    { forms: "say / say / say", correct: false },
    { forms: "say / sayed / sayed", correct: false }
  ],
  pay: [
    { forms: "pay / paid / paid", correct: true },
    { forms: "pay / pay / pay", correct: false },
    { forms: "pay / payed / payed", correct: false }
  ],
  sing: [
    { forms: "sing / sang / sung", correct: true },
    { forms: "sing / sing / sung", correct: false },
    { forms: "sing / sung / sing", correct: false }
  ],
  set: [
    { forms: "set / set / set", correct: true },
    { forms: "set / selt / selt", correct: false },
    { forms: "set / sat / sat", correct: false }
  ],
  shut: [
    { forms: "shut / shut / shut", correct: true },
    { forms: "shut / shat / shot", correct: false },
    { forms: "shut / shot / shot", correct: false }
  ],
  let: [
    { forms: "let / let / let", correct: true },
    { forms: "let / lit / lit", correct: false },
    { forms: "let / lat / lit", correct: false }
  ],
  ring: [
    { forms: "ring / rang / rung", correct: true },
    { forms: "ring / rung / rung", correct: false },
    { forms: "ring / rung / rang", correct: false }
  ],
  mean: [
    { forms: "mean / meant / meant", correct: true },
    { forms: "mean / met / met", correct: false },
    { forms: "mean / melt / melt", correct: false }
  ],
  learn: [
    { forms: "learn / learnt / learnt", correct: true },
    { forms: "learn / learn / learn", correct: false },
    { forms: "learn / learnt / learn", correct: false }
  ],
  leave: [
    { forms: "leave / left / left", correct: true },
    { forms: "leave / leave / leave", correct: false },
    { forms: "leave / leaved / leaved", correct: false }
  ],
  lie: [
    { forms: "lie / lay / lain", correct: true },
    { forms: "lie / lay / laid", correct: false },
    { forms: "lie / laid / lain", correct: false }
  ],
  read: [
    { forms: "read / read / read", correct: true },
    { forms: "read / red / read", correct: false },
    { forms: "read / red / red", correct: false }
  ],
  show: [
    { forms: "show / showed / shown", correct: true },
    { forms: "show / showed / showed", correct: false },
    { forms: "show / showed / shawn", correct: false }
  ],
  lend: [
    { forms: "lend / lent / lent", correct: true },
    { forms: "lend / lend / lend", correct: false },
    { forms: "lend / lend / lent", correct: false }
  ],
  lose: [
    { forms: "lose / lost / lost", correct: true },
    { forms: "lose / lose / lose", correct: false },
    { forms: "lose / lost / lose", correct: false }
  ],
  put: [
    { forms: "put / put / put", correct: true },
    { forms: "put / pat / put", correct: false },
    { forms: "put / pat / pat", correct: false }
  ],
  sell: [
    { forms: "sell / sold / sold", correct: true },
    { forms: "sell / seld / seld", correct: false },
    { forms: "sell / selled / selled", correct: false }
  ],
  send: [
    { forms: "send / sent / sent", correct: true },
    { forms: "send / send / send", correct: false },
    { forms: "send / send / sent", correct: false }
  ]
};

export const MATCHING_OPTIONS = QCM_OPTIONS;

export const ROOMS = {
  room31: {
    id: "room31",
    name: "Sunrise",
    imageFile: "assets/parts/part3/images/3-1.jpg",
    verbIds: ["rise", "shine", "light", "sit", "see"]
  },
  room32: {
    id: "room32",
    name: "Forest",
    imageFile: "assets/parts/part3/images/3-2.jpg",
    verbIds: ["run", "ride", "shake", "shoot", "seek"]
  },
  room33: {
    id: "room33",
    name: "Campfire",
    imageFile: "assets/parts/part3/images/3-3.jpg",
    verbIds: ["make", "meet", "say", "pay", "sing"]
  },
  room34: {
    id: "room34",
    name: "Storm",
    imageFile: "assets/parts/part3/images/3-4.jpg",
    verbIds: ["set", "shut", "let", "ring", "mean"]
  },
  room35: {
    id: "room35",
    name: "Archaeology",
    imageFile: "assets/parts/part3/images/3-5.jpg",
    verbIds: ["learn", "leave", "lie", "read", "show"]
  },
  room36: {
    id: "room36",
    name: "Trade",
    imageFile: "assets/parts/part3/images/3-6.jpg",
    verbIds: ["lend", "lose", "put", "sell", "send"]
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
