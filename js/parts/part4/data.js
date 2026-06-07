/**
 * HOTSPOTS & VERB DATA
 * Irregular Verbs - Part 4
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
  room41: {
    name: "Alien Classroom",
    imageFile: "assets/parts/part4/images/4-1.jpg",
    verbs: {
      understand: makeHotspot(605, 295, 50),
      think: makeHotspot(290, 340, 50),
      teach: makeHotspot(910, 260, 50),
      write: makeHotspot(1110, 570, 50),
      spell: makeHotspot(190, 225, 50)
    }
  },
  room42: {
    name: "Kung Fu Training",
    imageFile: "assets/parts/part4/images/4-2.jpg",
    verbs: {
      swim: makeHotspot(250, 270, 50),
      win: makeHotspot(700, 190, 50),
      strike: makeHotspot(1270, 155, 50),
      stand: makeHotspot(230, 510, 50),
      take: makeHotspot(1230, 590, 50)
    }
  },
  room43: {
    name: "Kitchen Nightmares",
    imageFile: "assets/parts/part4/images/4-3.jpg",
    verbs: {
      smell: makeHotspot(160, 300, 50),
      spill: makeHotspot(550, 590, 50),
      spoil: makeHotspot(1340, 405, 50),
      sweep: makeHotspot(680, 270, 50),
      wear: makeHotspot(875, 210, 50)
    }
  },
  room44: {
    name: "Mission Impossible",
    imageFile: "assets/parts/part4/images/4-4.jpg",
    verbs: {
      stick: makeHotspot(550, 450, 50),
      spread: makeHotspot(800, 465, 50),
      tear: makeHotspot(1240, 360, 50),
      throw: makeHotspot(945, 110, 50),
      upset: makeHotspot(385, 280, 50)
    }
  },
  room45: {
    name: "Casino",
    imageFile: "assets/parts/part4/images/4-5.jpg",
    verbs: {
      spend: makeHotspot(435, 620, 50),
      withdraw: makeHotspot(175, 285, 50),
      tell: makeHotspot(910, 345, 50),
      speak: makeHotspot(635, 390, 50),
      swear: makeHotspot(1275, 375, 50)
    }
  },
  room46: {
    name: "Scream",
    imageFile: "assets/parts/part4/images/4-6.jpg",
    verbs: {
      sleep: makeHotspot(1170, 405, 50),
      wake: makeHotspot(505, 390, 50),
      stink: makeHotspot(735, 550, 50),
      sting: makeHotspot(310, 345, 50),
      steal: makeHotspot(190, 410, 50)
    }
  }
};

export const VERB_FORMS = {
  understand: { base: "understand", preterite: "understood", participle: "understood", fr: "comprendre", type: 2 },
  think: { base: "think", preterite: "thought", participle: "thought", fr: "penser", type: 2 },
  teach: { base: "teach", preterite: "taught", participle: "taught", fr: "enseigner", type: 2 },
  write: { base: "write", preterite: "wrote", participle: "written", fr: "écrire", type: 3 },
  spell: { base: "spell", preterite: "spelt", participle: "spelt", fr: "épeler", type: 2 },
  swim: { base: "swim", preterite: "swam", participle: "swum", fr: "nager", type: 3 },
  win: { base: "win", preterite: "won", participle: "won", fr: "gagner", type: 2 },
  strike: { base: "strike", preterite: "struck", participle: "struck", fr: "frapper (formel)", type: 2 },
  stand: { base: "stand", preterite: "stood", participle: "stood", fr: "se tenir debout", type: 2 },
  take: { base: "take", preterite: "took", participle: "taken", fr: "prendre", type: 3 },
  smell: { base: "smell", preterite: "smelt", participle: "smelt", fr: "sentir (odorat)", type: 2 },
  spill: { base: "spill", preterite: "spilt", participle: "spilt", fr: "renverser", type: 2 },
  spoil: { base: "spoil", preterite: "spoilt", participle: "spoilt", fr: "gâcher", type: 2 },
  sweep: { base: "sweep", preterite: "swept", participle: "swept", fr: "balayer", type: 2 },
  wear: { base: "wear", preterite: "wore", participle: "worn", fr: "porter (vêtements)", type: 3 },
  stick: { base: "stick", preterite: "stuck", participle: "stuck", fr: "coller", type: 2 },
  spread: { base: "spread", preterite: "spread", participle: "spread", fr: "étaler", type: 1 },
  tear: { base: "tear", preterite: "tore", participle: "torn", fr: "déchirer", type: 3 },
  throw: { base: "throw", preterite: "threw", participle: "thrown", fr: "jeter", type: 3 },
  upset: { base: "upset", preterite: "upset", participle: "upset", fr: "bouleverser", type: 1 },
  spend: { base: "spend", preterite: "spent", participle: "spent", fr: "dépenser (argent), passer (temps)", type: 2 },
  withdraw: { base: "withdraw", preterite: "withdrew", participle: "withdrawn", fr: "retirer", type: 3 },
  tell: { base: "tell", preterite: "told", participle: "told", fr: "dire (qqch à qqn)", type: 2 },
  speak: { base: "speak", preterite: "spoke", participle: "spoken", fr: "parler", type: 3 },
  swear: { base: "swear", preterite: "swore", participle: "sworn", fr: "jurer", type: 3 },
  sleep: { base: "sleep", preterite: "slept", participle: "slept", fr: "dormir", type: 2 },
  wake: { base: "wake", preterite: "woke", participle: "woken", fr: "réveiller", type: 3 },
  stink: { base: "stink", preterite: "stank", participle: "stunk", fr: "puer", type: 3 },
  sting: { base: "sting", preterite: "stung", participle: "stung", fr: "piquer", type: 2 },
  steal: { base: "steal", preterite: "stole", participle: "stolen", fr: "voler, dérober", type: 3 }
};

export const QCM_OPTIONS = {
  understand: [
    { forms: "understand / understood / understood", correct: true },
    { forms: "understand / understand / understand", correct: false },
    { forms: "understand / understand / understood", correct: false }
  ],
  think: [
    { forms: "think / thought / thought", correct: true },
    { forms: "think / fought / fought", correct: false },
    { forms: "think / thaught / thaught", correct: false }
  ],
  teach: [
    { forms: "teach / taught / taught", correct: true },
    { forms: "teach / thaught / thaught", correct: false },
    { forms: "teach / tought / tought", correct: false }
  ],
  write: [
    { forms: "write / wrote / written", correct: true },
    { forms: "write / rote / ritten", correct: false },
    { forms: "write / wraught / written", correct: false }
  ],
  spell: [
    { forms: "spell / spelt / spelt", correct: true },
    { forms: "spell / spell / spell", correct: false },
    { forms: "spell / spellt / spell", correct: false }
  ],
  swim: [
    { forms: "swim / swam / swum", correct: true },
    { forms: "swim / swum / swam", correct: false },
    { forms: "swim / swum / swum", correct: false }
  ],
  win: [
    { forms: "win / won / won", correct: true },
    { forms: "win / wan / wun", correct: false },
    { forms: "win / wone / wone", correct: false }
  ],
  strike: [
    { forms: "strike / struck / struck", correct: true },
    { forms: "strike / strack / struck", correct: false },
    { forms: "strike / strack / strack", correct: false }
  ],
  stand: [
    { forms: "stand / stood / stood", correct: true },
    { forms: "stand / stand / stand", correct: false },
    { forms: "stand / stand / stood", correct: false }
  ],
  take: [
    { forms: "take / took / taken", correct: true },
    { forms: "take / took / took", correct: false },
    { forms: "take / taked / taken", correct: false }
  ],
  smell: [
    { forms: "smell / smelt / smelt", correct: true },
    { forms: "smell / smell / smell", correct: false },
    { forms: "smell / smeld / smeld", correct: false }
  ],
  spill: [
    { forms: "spill / spilt / spilt", correct: true },
    { forms: "spill / spill / spill", correct: false },
    { forms: "spill / spild / spild", correct: false }
  ],
  spoil: [
    { forms: "spoil / spoilt / spoilt", correct: true },
    { forms: "spoil / spoiled / spoilt", correct: false },
    { forms: "spoil / spoild / spoild", correct: false }
  ],
  sweep: [
    { forms: "sweep / swept / swept", correct: true },
    { forms: "sweep / sweep / sweep", correct: false },
    { forms: "sweep / swept / sweep", correct: false }
  ],
  wear: [
    { forms: "wear / wore / worn", correct: true },
    { forms: "wear / wore / warn", correct: false },
    { forms: "wear / wore / wore", correct: false }
  ],
  stick: [
    { forms: "stick / stuck / stuck", correct: true },
    { forms: "stick / stack / stuck", correct: false },
    { forms: "stick / stack / stack", correct: false }
  ],
  spread: [
    { forms: "spread / spread / spread", correct: true },
    { forms: "spread / spreat / spreat", correct: false },
    { forms: "spread / spred / spred", correct: false }
  ],
  tear: [
    { forms: "tear / tore / torn", correct: true },
    { forms: "tear / tore / tore", correct: false },
    { forms: "tear / tore / tarn", correct: false }
  ],
  throw: [
    { forms: "throw / threw / thrown", correct: true },
    { forms: "throw / threw / thrawn", correct: false },
    { forms: "throw / threw / threw", correct: false }
  ],
  upset: [
    { forms: "upset / upset / upset", correct: true },
    { forms: "upset / upsat / upsat", correct: false },
    { forms: "upset / upsot / upsot", correct: false }
  ],
  spend: [
    { forms: "spend / spent / spent", correct: true },
    { forms: "spend / spend / spend", correct: false },
    { forms: "spend / spent / spend", correct: false }
  ],
  withdraw: [
    { forms: "withdraw / withdrew / withdrawn", correct: true },
    { forms: "withdraw / withdraw / withdraw", correct: false },
    { forms: "withdraw / withdrew / withdrown", correct: false }
  ],
  tell: [
    { forms: "tell / told / told", correct: true },
    { forms: "tell / tell / tell", correct: false },
    { forms: "tell / teld / teld", correct: false }
  ],
  speak: [
    { forms: "speak / spoke / spoken", correct: true },
    { forms: "speak / spack / spuck", correct: false },
    { forms: "speak / spock / spocken", correct: false }
  ],
  swear: [
    { forms: "swear / swore / sworn", correct: true },
    { forms: "swear / sword / sword", correct: false },
    { forms: "swear / sword / sworn", correct: false }
  ],
  sleep: [
    { forms: "sleep / slept / slept", correct: true },
    { forms: "sleep / slep / slep", correct: false },
    { forms: "sleep / slepd / slepd", correct: false }
  ],
  wake: [
    { forms: "wake / woke / woken", correct: true },
    { forms: "wake / woke / woke", correct: false },
    { forms: "wake / wake / woken", correct: false }
  ],
  stink: [
    { forms: "stink / stank / stunk", correct: true },
    { forms: "stink / stank / stank", correct: false },
    { forms: "stink / stunk / stunk", correct: false }
  ],
  sting: [
    { forms: "sting / stung / stung", correct: true },
    { forms: "sting / stang / stung", correct: false },
    { forms: "sting / stang / stang", correct: false }
  ],
  steal: [
    { forms: "steal / stole / stolen", correct: true },
    { forms: "steal / stole / stole", correct: false },
    { forms: "steal / steal / stolen", correct: false }
  ]
};

export const MATCHING_OPTIONS = QCM_OPTIONS;

export const ROOMS = {
  room41: {
    id: "room41",
    name: "Alien Classroom",
    imageFile: "assets/parts/part4/images/4-1.jpg",
    verbIds: ["understand", "think", "teach", "write", "spell"]
  },
  room42: {
    id: "room42",
    name: "Kung Fu Training",
    imageFile: "assets/parts/part4/images/4-2.jpg",
    verbIds: ["swim", "win", "strike", "stand", "take"]
  },
  room43: {
    id: "room43",
    name: "Kitchen Nightmares",
    imageFile: "assets/parts/part4/images/4-3.jpg",
    verbIds: ["smell", "spill", "spoil", "sweep", "wear"]
  },
  room44: {
    id: "room44",
    name: "Mission Impossible",
    imageFile: "assets/parts/part4/images/4-4.jpg",
    verbIds: ["stick", "spread", "tear", "throw", "upset"]
  },
  room45: {
    id: "room45",
    name: "Casino",
    imageFile: "assets/parts/part4/images/4-5.jpg",
    verbIds: ["spend", "withdraw", "tell", "speak", "swear"]
  },
  room46: {
    id: "room46",
    name: "Scream",
    imageFile: "assets/parts/part4/images/4-6.jpg",
    verbIds: ["sleep", "wake", "stink", "sting", "steal"]
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
