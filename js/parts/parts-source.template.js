/**
 * Verb Detective content source template
 *
 * Edit this file first when preparing parts 2, 3, and 4.
 * It is intentionally human-friendly:
 * - hotspot coordinates are raw pixels, not percentages
 * - room image paths are written directly
 * - MCQ options live next to the verb they belong to
 * - verb audio keeps the default naming rule, unless you override it
 *
 * Default audio naming rule:
 *   `${assetsRoot}/audio/verbs/${base}_${preterite}_${participle}.mp3`
 *
 * Expected generation target:
 * - config.js
 * - data.js
 * - index.js
 * for each part folder under `js/parts/part2`, `part3`, and `part4`
 */

export const PART_SOURCES = {
  part2: {
    config: {
      id: '2',
      title: 'Irregular Verbs - Part 2',
      images: {
        titleBackground: 'assets/common/images/vd_fond.jpg',
        titleLogo: 'assets/common/images/title.png',
        menuBackground: 'assets/common/images/menu_part.jpg',
        menuBooks: {
          part1: 'assets/common/images/part1.png',
          part2: 'assets/common/images/part2.png',
          part3: 'assets/common/images/part3.png',
          part4: 'assets/common/images/part4.png'
        }
      },
      audio: {
        narratorCount: 5,
        introSequence: [
          'assets/parts/part2/audio/intro/let_s_learn.mp3',
          'assets/parts/part2/audio/intro/part2.mp3'
        ],
        challengeIntro: 'assets/parts/part2/audio/intro/challenge.mp3'
      },
      assetsRoot: 'assets/parts/part2'
    },
    imageSize: {
      width: 1380,
      height: 752
    },
    rooms: [
      {
        id: 'room1',
        name: 'Room 1',
        imageFile: 'assets/parts/part2/images/room1.jpg',
        verbs: [
          {
            id: 'verb1',
            forms: {
              base: '',
              preterite: '',
              participle: '',
              fr: '',
              type: 1
            },
            hotspot: {
              x: 0,
              y: 0,
              radius: 50
            },
            qcmOptions: [
              { forms: 'base / preterite / participle', correct: true },
              { forms: 'wrong / wrong / wrong', correct: false },
              { forms: 'wrong / wrong / wrong', correct: false }
            ]
          }
        ]
      }
    ]
  },

  part3: {
    config: {
      id: '3',
      title: 'Irregular Verbs - Part 3',
      images: {
        titleBackground: 'assets/common/images/vd_fond.jpg',
        titleLogo: 'assets/common/images/title.png',
        menuBackground: 'assets/common/images/menu_part.jpg',
        menuBooks: {
          part1: 'assets/common/images/part1.png',
          part2: 'assets/common/images/part2.png',
          part3: 'assets/common/images/part3.png',
          part4: 'assets/common/images/part4.png'
        }
      },
      audio: {
        narratorCount: 5,
        introSequence: [
          'assets/parts/part3/audio/intro/let_s_learn.mp3',
          'assets/parts/part3/audio/intro/part3.mp3'
        ],
        challengeIntro: 'assets/parts/part3/audio/intro/challenge.mp3'
      },
      assetsRoot: 'assets/parts/part3'
    },
    imageSize: {
      width: 1380,
      height: 752
    },
    rooms: [
      {
        id: 'room1',
        name: 'Room 1',
        imageFile: 'assets/parts/part3/images/room1.jpg',
        verbs: [
          {
            id: 'verb1',
            forms: {
              base: '',
              preterite: '',
              participle: '',
              fr: '',
              type: 1
            },
            hotspot: {
              x: 0,
              y: 0,
              radius: 50
            },
            qcmOptions: [
              { forms: 'base / preterite / participle', correct: true },
              { forms: 'wrong / wrong / wrong', correct: false },
              { forms: 'wrong / wrong / wrong', correct: false }
            ]
          }
        ]
      }
    ]
  },

  part4: {
    config: {
      id: '4',
      title: 'Irregular Verbs - Part 4',
      images: {
        titleBackground: 'assets/common/images/vd_fond.jpg',
        titleLogo: 'assets/common/images/title.png',
        menuBackground: 'assets/common/images/menu_part.jpg',
        menuBooks: {
          part1: 'assets/common/images/part1.png',
          part2: 'assets/common/images/part2.png',
          part3: 'assets/common/images/part3.png',
          part4: 'assets/common/images/part4.png'
        }
      },
      audio: {
        narratorCount: 5,
        introSequence: [
          'assets/parts/part4/audio/intro/let_s_learn.mp3',
          'assets/parts/part4/audio/intro/part4.mp3'
        ],
        challengeIntro: 'assets/parts/part4/audio/intro/challenge.mp3'
      },
      assetsRoot: 'assets/parts/part4'
    },
    imageSize: {
      width: 1380,
      height: 752
    },
    rooms: [
      {
        id: 'room1',
        name: 'Room 1',
        imageFile: 'assets/parts/part4/images/room1.jpg',
        verbs: [
          {
            id: 'verb1',
            forms: {
              base: '',
              preterite: '',
              participle: '',
              fr: '',
              type: 1
            },
            hotspot: {
              x: 0,
              y: 0,
              radius: 50
            },
            qcmOptions: [
              { forms: 'base / preterite / participle', correct: true },
              { forms: 'wrong / wrong / wrong', correct: false },
              { forms: 'wrong / wrong / wrong', correct: false }
            ]
          }
        ]
      }
    ]
  }
};

/**
 * Suggested verb object shape
 *
 * {
 *   id: 'break',
 *   forms: {
 *     base: 'break',
 *     preterite: 'broke',
 *     participle: 'broken',
 *     fr: 'casser',
 *     type: 3
 *   },
 *   hotspot: { x: 375, y: 461, radius: 50 },
 *   qcmOptions: [
 *     { forms: 'break / broke / broken', correct: true },
 *     { forms: 'break / broke / broke', correct: false },
 *     { forms: 'break / break / broken', correct: false }
 *   ],
 *   audioFile: 'assets/parts/part2/audio/verbs/break_broke_broken.mp3' // optional override
 * }
 */

/**
 * Suggested room object shape
 *
 * {
 *   id: 'kitchen',
 *   name: 'Kitchen',
 *   imageFile: 'assets/parts/part2/images/kitchen.jpg',
 *   verbs: [ /* verb objects *\/ ]
 * }
 */

