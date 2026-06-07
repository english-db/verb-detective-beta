/**
 * Part data template
 *
 * Fill this file for each new part:
 * - ROOMS: room list and verb assignment per room
 * - VERB_FORMS: dictionary of verb forms and metadata
 * - QCM_OPTIONS: multiple choice options per verb
 * - MATCHING_OPTIONS: optional alias if matching uses a separate source
 * - HOTSPOTS: image-relative hotspot coordinates per room
 *
 * The app expects the following named exports:
 * - HOTSPOTS
 * - VERB_FORMS
 * - QCM_OPTIONS
 * - MATCHING_OPTIONS
 * - ROOMS
 * - getHotspot(roomId, verbId)
 * - getRoomVerbs(roomId)
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
  room1: {
    name: 'Room 1',
    imageFile: 'assets/parts/partX/images/room1.jpg',
    verbs: {
      verbA: makeHotspot(100, 120, 50),
      verbB: makeHotspot(300, 280, 50),
      verbC: makeHotspot(500, 420, 50),
      verbD: makeHotspot(700, 560, 50),
      verbE: makeHotspot(900, 640, 50)
    }
  }
};

export const VERB_FORMS = {
  verbA: { base: 'verbA', preterite: 'verbAed', participle: 'verbAed', fr: 'French meaning', type: 1 },
  verbB: { base: 'verbB', preterite: 'verbBrew', participle: 'verbBrawn', fr: 'French meaning', type: 2 },
  verbC: { base: 'verbC', preterite: 'verbC', participle: 'verbC', fr: 'French meaning', type: 3 }
};

export const QCM_OPTIONS = {
  verbA: [
    { forms: 'verbA / verbAed / verbAed', correct: true },
    { forms: 'verbA / verbA / verbAed', correct: false },
    { forms: 'verbA / verbAed / verbA', correct: false }
  ]
};

export const MATCHING_OPTIONS = QCM_OPTIONS;

export const ROOMS = {
  room1: {
    name: 'Room 1',
    imageFile: HOTSPOTS.room1.imageFile,
    verbIds: Object.keys(HOTSPOTS.room1.verbs)
  }
};

export function getHotspot(roomId, verbId) {
  return HOTSPOTS[roomId]?.verbs?.[verbId] || null;
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

