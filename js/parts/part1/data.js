/**
 * HOTSPOTS & VERB DATA
 * Irregular Verbs Learning Activity - Part 1
 * 
 * Contains:
 * - HOTSPOTS: Clickable areas and verb locations (30 verbs × 6 rooms)
 * - VERB_FORMS: Base, preterite, participle for each verb
 * - QCM_OPTIONS: Multiple choice options (3 per verb)
 * - MATCHING_OPTIONS: Same as QCM (for matching activities)
 * - ROOMS: Room metadata and verb assignments
 */

// ============================================
// HOTSPOT COORDINATES (stored as percentages)
// Source artwork size: 1380×752
// ============================================

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
  kitchen: {
    name: "Kitchen",
    imageFile: "assets/parts/part1/images/kitchen.jpg",
    verbs: {
      break: makeHotspot(375, 461, 50),
      beat: makeHotspot(675, 510, 50),
      bite: makeHotspot(920, 535, 50),
      burn: makeHotspot(990, 300, 50),
      cut: makeHotspot(1150, 560, 50)
    }
  },
  livingroom: {
    name: "Living Room",
    imageFile: "assets/parts/part1/images/living.jpg",
    verbs: {
      blow: makeHotspot(420, 430, 50),
      come: makeHotspot(1200, 290, 50),
      catch: makeHotspot(1100, 575, 50),
      choose: makeHotspot(875, 305, 50),
      cost: makeHotspot(825, 600, 50)
    }
  },
  bedroom: {
    name: "Bedroom",
    imageFile: "assets/parts/part1/images/bedroom.jpg",
    verbs: {
      dream: makeHotspot(250, 160, 50),
      awake: makeHotspot(565, 340, 50),
      be: makeHotspot(875, 500, 50),
      breed: makeHotspot(200, 620, 50),
      bend: makeHotspot(1240, 425, 50)
    }
  },
  office: {
    name: "Office",
    imageFile: "assets/parts/part1/images/office.jpg",
    verbs: {
      draw: makeHotspot(340, 575, 50),
      build: makeHotspot(665, 290, 50),
      begin: makeHotspot(585, 620, 50),
      bring: makeHotspot(975, 315, 50),
      deal: makeHotspot(1260, 590, 50)
    }
  },
  garage: {
    name: "Garage/Workshop",
    imageFile: "assets/parts/part1/images/garden.jpg",
    verbs: {
      dig: makeHotspot(215, 645, 50),
      do: makeHotspot(1010, 320, 50),
      cast: makeHotspot(1000, 465, 50),
      burst: makeHotspot(525, 250, 50),
      buy: makeHotspot(1210, 535, 50)
    }
  },
  attic: {
    name: "Attic",
    imageFile: "assets/parts/part1/images/attic.jpg",
    verbs: {
      arise: makeHotspot(290, 410, 50),
      become: makeHotspot(505, 260, 50),
      bet: makeHotspot(790, 460, 50),
      creep: makeHotspot(1150, 360, 50),
      bleed: makeHotspot(1260, 620, 50)
    }
  }
};

// ============================================
// VERB FORMS (Base / Preterite / Participle)
// ============================================

export const VERB_FORMS = {
  arise: { base: "arise", preterite: "arose", participle: "arisen", fr: "apparaître", type: 3 },
  awake: { base: "awake", preterite: "awoke", participle: "awoken", fr: "se réveiller", type: 3 },
  be: { base: "be", preterite: "was, were", participle: "been", fr: "être", type: 3 },
  beat: { base: "beat", preterite: "beat", participle: "beaten", fr: "battre", type: 2 },
  become: { base: "become", preterite: "became", participle: "become", fr: "devenir", type: 2 },
  begin: { base: "begin", preterite: "began", participle: "begun", fr: "commencer", type: 3 },
  bend: { base: "bend", preterite: "bent", participle: "bent", fr: "courber", type: 2 },
  bet: { base: "bet", preterite: "bet", participle: "bet", fr: "parier", type: 1 },
  bite: { base: "bite", preterite: "bit", participle: "bitten", fr: "mordre", type: 3 },
  bleed: { base: "bleed", preterite: "bled", participle: "bled", fr: "saigner", type: 2 },
  blow: { base: "blow", preterite: "blew", participle: "blown", fr: "souffler", type: 3 },
  break: { base: "break", preterite: "broke", participle: "broken", fr: "casser", type: 3 },
  breed: { base: "breed", preterite: "bred", participle: "bred", fr: "élever, se reproduire", type: 2 },
  bring: { base: "bring", preterite: "brought", participle: "brought", fr: "apporter", type: 2 },
  build: { base: "build", preterite: "built", participle: "built", fr: "construire", type: 2 },
  burn: { base: "burn", preterite: "burnt", participle: "burnt", fr: "brûler", type: 2 },
  burst: { base: "burst", preterite: "burst", participle: "burst", fr: "éclater", type: 1 },
  buy: { base: "buy", preterite: "bought", participle: "bought", fr: "acheter", type: 2 },
  cast: { base: "cast", preterite: "cast", participle: "cast", fr: "lancer (pêche, magie)", type: 1 },
  catch: { base: "catch", preterite: "caught", participle: "caught", fr: "attraper", type: 2 },
  choose: { base: "choose", preterite: "chose", participle: "chosen", fr: "choisir", type: 3 },
  come: { base: "come", preterite: "came", participle: "come", fr: "venir", type: 2 },
  cost: { base: "cost", preterite: "cost", participle: "cost", fr: "coûter", type: 1 },
  creep: { base: "creep", preterite: "crept", participle: "crept", fr: "ramper", type: 2 },
  cut: { base: "cut", preterite: "cut", participle: "cut", fr: "couper", type: 1 },
  deal: { base: "deal", preterite: "dealt", participle: "dealt", fr: "distribuer", type: 2 },
  dig: { base: "dig", preterite: "dug", participle: "dug", fr: "creuser", type: 2 },
  do: { base: "do", preterite: "did", participle: "done", fr: "faire", type: 3 },
  draw: { base: "draw", preterite: "drew", participle: "drawn", fr: "dessiner", type: 3 },
  dream: { base: "dream", preterite: "dreamt", participle: "dreamt", fr: "rêver", type: 2 }
};

// ============================================
// QCM OPTIONS (3 choices per verb)
// ============================================

export const QCM_OPTIONS = {
  arise: [
    { forms: "arise / arose / arisen", correct: true },
    { forms: "arise / arisened / arose", correct: false },
    { forms: "arise / arose / arisened", correct: false }
  ],
  awake: [
    { forms: "awake / awoke / awoken", correct: true },
    { forms: "awake / awoken / awoke", correct: false },
    { forms: "awake / awokened / awoken", correct: false }
  ],
  be: [
    { forms: "be / was, were / been", correct: true },
    { forms: "be / was/were / beren", correct: false },
    { forms: "be / was/weren / beened", correct: false }
  ],
  beat: [
    { forms: "beat / beat / beaten", correct: true },
    { forms: "beat / beaten / beat", correct: false },
    { forms: "beat / beaten / beatened", correct: false }
  ],
  become: [
    { forms: "become / became / become", correct: true },
    { forms: "become / become / became", correct: false },
    { forms: "become / become / become", correct: false }
  ],
  begin: [
    { forms: "begin / began / begun", correct: true },
    { forms: "begin / begun / began", correct: false },
    { forms: "begin / begen / begown", correct: false }
  ],
  bend: [
    { forms: "bend / bent / bent", correct: true },
    { forms: "bend / bented / bented", correct: false },
    { forms: "bend / bent / benten", correct: false }
  ],
  bet: [
    { forms: "bet / bet / bet", correct: true },
    { forms: "bet / beted / beted", correct: false },
    { forms: "bet / beten / beten", correct: false }
  ],
  bite: [
    { forms: "bite / bit / bitten", correct: true },
    { forms: "bite / bit / bit", correct: false },
    { forms: "bite / bit / bittened", correct: false }
  ],
  bleed: [
    { forms: "bleed / bled / bled", correct: true },
    { forms: "bleed / bleed / bleed", correct: false },
    { forms: "bleed / bleded / bleden", correct: false }
  ],
  blow: [
    { forms: "blow / blew / blown", correct: true },
    { forms: "blow / blow / blown", correct: false },
    { forms: "blow / blowed / blown", correct: false }
  ],
  break: [
    { forms: "break / broke / broken", correct: true },
    { forms: "break / broke / broke", correct: false },
    { forms: "break / break / broken", correct: false }
  ],
  breed: [
    { forms: "breed / bred / bred", correct: true },
    { forms: "breed / breed / breed", correct: false },
    { forms: "breed / bred / breden", correct: false }
  ],
  bring: [
    { forms: "bring / brought / brought", correct: true },
    { forms: "bring / brang / brought", correct: false },
    { forms: "bring / brang / brung", correct: false }
  ],
  build: [
    { forms: "build / built / built", correct: true },
    { forms: "build / build / build", correct: false },
    { forms: "build / build / built", correct: false }
  ],
  burn: [
    { forms: "burn / burnt / burnt", correct: true },
    { forms: "burn / burnted / burnted", correct: false },
    { forms: "burn / burnten / burnted", correct: false }
  ],
  burst: [
    { forms: "burst / burst / burst", correct: true },
    { forms: "burst / brought / brought", correct: false },
    { forms: "burst / burse / bursen", correct: false }
  ],
  buy: [
    { forms: "buy / bought / bought", correct: true },
    { forms: "buy / buyed / bought", correct: false },
    { forms: "buy / buyed / buyen", correct: false }
  ],
  cast: [
    { forms: "cast / cast / cast", correct: true },
    { forms: "cast / cast / caught", correct: false },
    { forms: "cast / caught / caught", correct: false }
  ],
  catch: [
    { forms: "catch / caught / caught", correct: true },
    { forms: "catch / catch / caught", correct: false },
    { forms: "catch / catch / catch", correct: false }
  ],
  choose: [
    { forms: "choose / chose / chosen", correct: true },
    { forms: "choose / chosen / chose", correct: false },
    { forms: "choose / choseen / chosen", correct: false }
  ],
  come: [
    { forms: "come / came / come", correct: true },
    { forms: "come / come / came", correct: false },
    { forms: "come / came / came", correct: false }
  ],
  cost: [
    { forms: "cost / cost / cost", correct: true },
    { forms: "cost / cast / cast", correct: false },
    { forms: "cost / cast / cost", correct: false }
  ],
  creep: [
    { forms: "creep / crept / crept", correct: true },
    { forms: "creep / krept / krept", correct: false },
    { forms: "creep / kept / kept", correct: false }
  ],
  cut: [
    { forms: "cut / cut / cut", correct: true },
    { forms: "cut / cat / cut", correct: false },
    { forms: "cut / cat / cot", correct: false }
  ],
  deal: [
    { forms: "deal / dealt / dealt", correct: true },
    { forms: "deal / deald / deald", correct: false },
    { forms: "deal / dealet / dealet", correct: false }
  ],
  dig: [
    { forms: "dig / dug / dug", correct: true },
    { forms: "dig / dag / dag", correct: false },
    { forms: "dig / dog / dog", correct: false }
  ],
  do: [
    { forms: "do / did / done", correct: true },
    { forms: "do / done / did", correct: false },
    { forms: "do / did / down", correct: false }
  ],
  draw: [
    { forms: "draw / drew / drawn", correct: true },
    { forms: "draw / draw / draw", correct: false },
    { forms: "draw / drew / drown", correct: false }
  ],
  dream: [
    { forms: "dream / dreamt / dreamt", correct: true },
    { forms: "dream / dreamd / dreamd", correct: false },
    { forms: "dream / dreamt / dreamd", correct: false }
  ]
};

// ============================================
// MATCHING OPTIONS (same as QCM)
// ============================================

export const MATCHING_OPTIONS = QCM_OPTIONS;

// ============================================
// ROOMS CONFIGURATION
// ============================================

export const ROOMS = {
  kitchen: {
    id: "kitchen",
    name: "Kitchen",
    imageFile: "assets/parts/part1/images/kitchen.jpg",
    verbIds: ["break", "beat", "bite", "burn", "cut"]
  },
  livingroom: {
    id: "livingroom",
    name: "Living Room",
    imageFile: "assets/parts/part1/images/living.jpg",
    verbIds: ["blow", "come", "catch", "choose", "cost"]
  },
  bedroom: {
    id: "bedroom",
    name: "Bedroom",
    imageFile: "assets/parts/part1/images/bedroom.jpg",
    verbIds: ["dream", "awake", "be", "breed", "bend"]
  },
  office: {
    id: "office",
    name: "Office",
    imageFile: "assets/parts/part1/images/office.jpg",
    verbIds: ["draw", "build", "begin", "bring", "deal"]
  },
  garage: {
    id: "garage",
    name: "Garage/Workshop",
    imageFile: "assets/parts/part1/images/garden.jpg",
    verbIds: ["dig", "do", "cast", "burst", "buy"]
  },
  attic: {
    id: "attic",
    name: "Attic",
    imageFile: "assets/parts/part1/images/attic.jpg",
    verbIds: ["arise", "become", "bet", "creep", "bleed"]
  }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get hotspot data for a specific verb in a room
 * @param {string} roomId - Room identifier
 * @param {string} verbId - Verb identifier
 * @returns {Object} Hotspot coordinates {x, y, radius}
 */
export function getHotspot(roomId, verbId) {
  const room = HOTSPOTS[roomId];
  if (!room || !room.verbs[verbId]) {
    console.warn(`Hotspot not found: ${roomId}/${verbId}`);
    return null;
  }
  return room.verbs[verbId];
}

/**
 * Get verb form data
 * @param {string} verbId - Verb identifier
 * @returns {Object} {base, preterite, participle}
 */
export function getVerbForm(verbId) {
  return VERB_FORMS[verbId] || null;
}

/**
 * Get QCM options for a verb
 * @param {string} verbId - Verb identifier
 * @returns {Array} Array of 3 option objects
 */
export function getQCMOptions(verbId) {
  return QCM_OPTIONS[verbId] || [];
}

/**
 * Get all verbs for a room
 * @param {string} roomId - Room identifier
 * @returns {Array} Array of verb IDs
 */
export function getRoomVerbs(roomId) {
  const room = ROOMS[roomId];
  return room ? room.verbIds : [];
}

/**
 * Get all rooms (for menu)
 * @returns {Array} Array of room objects
 */
export function getAllRooms() {
  return Object.values(ROOMS);
}

/**
 * Get room metadata
 * @param {string} roomId - Room identifier
 * @returns {Object} Room object
 */
export function getRoomData(roomId) {
  return ROOMS[roomId] || null;
}

export default { HOTSPOTS, VERB_FORMS, QCM_OPTIONS, MATCHING_OPTIONS, ROOMS };
