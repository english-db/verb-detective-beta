/**
 * APP CONTROLLER
 * Irregular Verbs Learning Activity - Part 1
 * 
 * Main orchestration layer that:
 * - Initializes all modules (audio, phase, UI, SCORM)
 * - Manages state lifecycle (load, save, mutations)
 * - Routes between views (menu â†” room)
 * - Handles user interactions (hotspots, activities)
 * - Coordinates feedback and progress updates
 */

import { getPartDefinition } from './parts/index.js';
import { AudioManager } from './audioManager.js';
import { PhaseManager } from './phaseManager.js';
import { UIRenderer } from './uiRenderer.js';
import { SCORMWrapper } from './scormWrapper.js';

const SOURCE_IMAGE_WIDTH = 1380;
const SOURCE_IMAGE_HEIGHT = 752;
const partId = new URLSearchParams(window.location.search).get('part') || '1';
const partDefinition = getPartDefinition(partId) || getPartDefinition('1');

if (!partDefinition) {
  throw new Error(`AppController: No part definition available for part ${partId}`);
}

const { config: PART_CONFIG, ROOMS, VERB_FORMS, QCM_OPTIONS, getHotspot, getRoomVerbs } = partDefinition;
const hasPlayableData = !!(ROOMS && VERB_FORMS && QCM_OPTIONS && typeof getHotspot === 'function' && typeof getRoomVerbs === 'function');

class AppController {
  constructor() {
    this.state = null;
    this.audioManager = null;
    this.phaseManager = null;
    this.uiRenderer = null;
    this.scormWrapper = null;
    this.partDefinition = partDefinition;
    this.partConfig = PART_CONFIG;
    this.currentRoomId = null;
    this.currentVerbId = null;
    this.currentOralChallenge = null;
    this._writtenDegradedMode = false;
    this._stage12Successes = null;
    this.developerModeEnabled = false;
    this.devToggleBuffer = '';
    this.devToggleResetTimeout = null;
    this.devToggleHandler = null;
    this.storageKey = `irregularVerbs_state_part${this.partConfig?.id || partId}`;
    this.legacyStorageKey = 'irregularVerbs_state';
    this.loadedFromLegacyStorage = false;
    this.pendingPartVictory = false;
  }

  // ============================================
  // INITIALIZATION
  // ============================================

  /**
   * Initialize entire application
   * Called on page load
   */
  async onAppReady() {
    console.log('AppController: Initializing app...');

    // Load or create app state
    this.initializeState();

    // Initialize modules
    this.audioManager = new AudioManager(this.partConfig, this.partDefinition);
    this.phaseManager = new PhaseManager(this.state, this.storageKey);
    this.uiRenderer = new UIRenderer(this.state, this.phaseManager, this.audioManager, this.partConfig, this.partDefinition);
    this.uiRenderer.setDeveloperModeEnabled(this.developerModeEnabled);
    this.scormWrapper = new SCORMWrapper(this.partDefinition);
    document.title = this.partConfig?.title || `Irregular Verbs - Part ${partId}`;
    const orientationBackButton = document.getElementById('orientationBackButton');
    if (orientationBackButton) {
      orientationBackButton.onclick = () => {
        window.location.href = 'index.html#orientation';
      };
    }
    const developerModeButton = document.getElementById('developerModeButton');
    if (developerModeButton) {
      developerModeButton.onclick = () => this.handleDeveloperAction();
    }
    this._bindDeveloperToggleShortcut();

    // SCORM initialization
    this.scormWrapper.initialize();

    // Preload all audio files
    console.log('AppController: Preloading audio files...');
    await this.audioManager.preloadAudios();

    // Render menu view
    this.uiRenderer.renderMenuView(
      (roomId) => this.startRoom(roomId),
      () => this.resetProgress()
    );

    // Start intro audio only after the UI has had a chance to paint
    requestAnimationFrame(() => {
      void this.audioManager.playIntroAudio().catch((error) => {
        console.warn('AppController: Intro audio could not be played', error);
      });
    });

    console.log('AppController: Initialization complete');
  }

  _bindDeveloperToggleShortcut() {
    if (this.devToggleHandler) {
      window.removeEventListener('keydown', this.devToggleHandler);
    }

    this.devToggleHandler = (event) => {
      if (event.defaultPrevented || event.ctrlKey || event.altKey || event.metaKey) {
        return;
      }

      const target = event.target;
      const tagName = target?.tagName?.toLowerCase?.() || '';
      const isTypingTarget =
        tagName === 'input' ||
        tagName === 'textarea' ||
        tagName === 'select' ||
        target?.isContentEditable;
      if (isTypingTarget) {
        return;
      }

      if (event.key === 'Escape') {
        this._resetDeveloperToggleBuffer();
        return;
      }

      if (!/^[a-z]$/i.test(event.key)) {
        this._resetDeveloperToggleBuffer();
        return;
      }

      this.devToggleBuffer = `${this.devToggleBuffer}${event.key.toLowerCase()}`.slice(-3);
      window.clearTimeout(this.devToggleResetTimeout);
      this.devToggleResetTimeout = window.setTimeout(() => {
        this._resetDeveloperToggleBuffer();
      }, 1200);

      if (this.devToggleBuffer === 'dev') {
        this._resetDeveloperToggleBuffer();
        this._toggleDeveloperMode();
      }
    };

    window.addEventListener('keydown', this.devToggleHandler);
  }

  _resetDeveloperToggleBuffer() {
    this.devToggleBuffer = '';
    window.clearTimeout(this.devToggleResetTimeout);
    this.devToggleResetTimeout = null;
  }

  _toggleDeveloperMode() {
    this.developerModeEnabled = !this.developerModeEnabled;
    this.uiRenderer?.setDeveloperModeEnabled(this.developerModeEnabled);
    this.uiRenderer?.showStatusMessage(`Dev mode ${this.developerModeEnabled ? 'ON' : 'OFF'}`);
  }

  /**
   * Initialize app state (from LocalStorage or create new)
   */
  initializeState() {
    const savedState = this._loadState();

    if (savedState) {
      const { state, migrated } = this._normalizeSavedState(savedState);
      if (state?.rooms && Object.keys(state.rooms).length > 0) {
        this.state = state;
        if (migrated) {
          this._saveState();
        }
        console.log('AppController: Loaded state from LocalStorage');
      } else {
        this.state = this._createInitialState();
        console.warn('AppController: Saved state was invalid, recreated fresh app state');
      }
    } else {
      this.state = this._createInitialState();
      console.log('AppController: Created new app state');
    }
  }

  /**
   * Create initial app state structure
   * @private
   */
  _createInitialState() {
    const state = {
      appState: {
        currentRoom: null,
        introPlayed: true,
        scormInitialized: false
      },
      rooms: {}
    };

    // Initialize each room with 5 verbs
    Object.entries(ROOMS).forEach(([roomId, roomData]) => {
      state.rooms[roomId] = {
        id: roomId,
        name: roomData.name,
        oralCheckpointComplete: false,
        oralStage: 1,
        challengeFailed: false,
        challengeMisses: 0,
        writtenStage: null,
        writtenChallenge: null,
        writtenCheckpointComplete: false,
        verbs: {}
      };

      // Initialize each verb
      roomData.verbIds.forEach(verbId => {
        const hotspot = getHotspot(roomId, verbId);

        state.rooms[roomId].verbs[verbId] = {
          id: verbId,
          hotspot: hotspot,
          iconRevealed: false,

          // Oral phase tracking
          oral: {
            phase: 'exposure',
            successes: 0,
            exposure: { attempts: 0, correct: 0 },
            '1in1': { attempts: 0, correct: 0 },
            '2in1': { attempts: 0, correct: 0 },
            '3in1': { attempts: 0, correct: 0 },
            '5in1': { attempts: 0, correct: 0 },
            classification: { attempts: 0, correct: 0 }
          },

          // Written phase tracking
          written: {
            successes: 0,
            stage1: { attempts: 0, correct: 0 },
            stage2: { attempts: 0, correct: 0 },
            stage3: { attempts: 0, correct: 0 },
            stage4: { attempts: 0, correct: 0 }
          },

          // Error tracking
          errorCount: 0,
          writtenErrorCount: 0
        };
      });
    });

    return state;
  }

  // ============================================
  // STATE MANAGEMENT
  // ============================================

  /**
   * Load state from LocalStorage
   * @private
   * @returns {Object|null} Saved state or null
   */
  _loadState() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        this.loadedFromLegacyStorage = false;
        return JSON.parse(saved);
      }

      const legacySaved = localStorage.getItem(this.legacyStorageKey);
      if (!legacySaved) {
        this.loadedFromLegacyStorage = false;
        return null;
      }

      const parsedLegacyState = JSON.parse(legacySaved);
      if (!this._isStateCompatibleWithCurrentPart(parsedLegacyState)) {
        this.loadedFromLegacyStorage = false;
        return null;
      }

      this.loadedFromLegacyStorage = true;
      return parsedLegacyState;
    } catch (error) {
      console.error('AppController: Error loading state', error);
      return null;
    }
  }

  /**
   * Check whether a saved state matches the current part's room map.
   * @private
   * @param {Object} savedState
   * @returns {boolean}
   */
  _isStateCompatibleWithCurrentPart(savedState) {
    const savedRoomIds = Object.keys(savedState?.rooms || {}).sort();
    const currentRoomIds = Object.keys(ROOMS || {}).sort();

    if (!savedRoomIds.length || savedRoomIds.length !== currentRoomIds.length) {
      return false;
    }

    return currentRoomIds.every((roomId, index) => roomId === savedRoomIds[index]);
  }

  /**
   * Normalize older saved states to the current percentage-based hotspot format.
   * @private
   * @param {Object} savedState
   * @returns {{state: Object, migrated: boolean}}
   */
  _normalizeSavedState(savedState) {
    if (!savedState?.rooms || typeof savedState.rooms !== 'object') {
      return { state: null, migrated: false };
    }

    let migrated = false;

    Object.values(savedState.rooms).forEach(room => {
      if (typeof room.oralCheckpointComplete !== 'boolean') {
        room.oralCheckpointComplete = false;
      }
      if (typeof room.oralStage !== 'number') {
        room.oralStage = 1;
      }
      // Dev migration: reset in-progress oral rooms to stage 1.
      if (typeof room.oralStage === 'number' && room.oralStage > 0 && !room.oralCheckpointComplete) {
        room.oralStage = 1;
        room.challengeFailed = false;
        room.challengeMisses = 0;
        migrated = true;
      }
      if (typeof room.challengeFailed !== 'boolean') {
        room.challengeFailed = false;
      }
      if (typeof room.challengeMisses !== 'number') {
        room.challengeMisses = 0;
      }
      if (typeof room.writtenStage === 'undefined') {
        room.writtenStage = room.writtenCheckpointComplete
          ? 'victory'
          : (room.oralCheckpointComplete ? 1 : null);
        migrated = true;
      }
      if (typeof room.writtenStage === 'number' && room.writtenStage >= 5) {
        room.writtenStage = 1;
        migrated = true;
      }
      if (typeof room.writtenCheckpointComplete !== 'boolean') {
        room.writtenCheckpointComplete = false;
        migrated = true;
      }
      if (typeof room.writtenChallenge === 'undefined') {
        room.writtenChallenge = null;
        migrated = true;
      }

      if (!room?.verbs) return;

      Object.entries(room.verbs).forEach(([verbId, verb]) => {
        const latestHotspot = getHotspot(room.id, verbId);
        if (latestHotspot) {
          const hotspotChanged =
            !verb.hotspot ||
            verb.hotspot.x !== latestHotspot.x ||
            verb.hotspot.y !== latestHotspot.y ||
            verb.hotspot.radius !== latestHotspot.radius;

          verb.hotspot = latestHotspot;
          if (hotspotChanged) {
            migrated = true;
          }
        }

        verb.oral = verb.oral || {};
        if (typeof verb.oral.successes !== 'number') {
          verb.oral.successes = 0;
          migrated = true;
        }
        if (!verb.oral.exposure) {
          verb.oral.exposure = { attempts: 0, correct: 0 };
          migrated = true;
        }
        if (!verb.oral['1in1']) {
          verb.oral['1in1'] = { attempts: 0, correct: 0 };
          migrated = true;
        }
        if (!verb.oral['2in1']) {
          verb.oral['2in1'] = { attempts: 0, correct: 0 };
          migrated = true;
        }
        if (!verb.oral['3in1']) {
          verb.oral['3in1'] = { attempts: 0, correct: 0 };
          migrated = true;
        }
        if (!verb.oral['5in1']) {
          verb.oral['5in1'] = { attempts: 0, correct: 0 };
          migrated = true;
        }
        if (!verb.oral.classification) {
          verb.oral.classification = { attempts: 0, correct: 0 };
          migrated = true;
        }
        if (typeof verb.oral.classification.attempts !== 'number') {
          verb.oral.classification.attempts = 0;
          migrated = true;
        }
        if (typeof verb.oral.classification.correct !== 'number') {
          verb.oral.classification.correct = 0;
          migrated = true;
        }
        const hasOldSixStageFormat =
          verb.written?.stage5 !== undefined || verb.written?.stage6 !== undefined;
        if (!verb.written || typeof verb?.written?.successes !== 'number' || hasOldSixStageFormat || verb.written.stage7 || verb.written.stage8 || verb.written.stage9 || verb.written.stage10 || verb.written.stage11 || verb.written.stage12 || verb.written.phase !== undefined) {
          verb.written = {
            successes: 0,
            stage1: { attempts: 0, correct: 0 },
            stage2: { attempts: 0, correct: 0 },
            stage3: { attempts: 0, correct: 0 },
            stage4: { attempts: 0, correct: 0 }
          };
          migrated = true;
        }
        if (room.oralCheckpointComplete) {
          verb.oral.phase = 'complete';
        }

        const hotspot = verb?.hotspot;
        if (!hotspot) return;

        const looksLikePixels =
          hotspot.x > 100 ||
          hotspot.y > 100 ||
          hotspot.radius > 100;

        if (looksLikePixels) {
          migrated = true;
          verb.hotspot = {
            x: Number(((hotspot.x / SOURCE_IMAGE_WIDTH) * 100).toFixed(4)),
            y: Number(((hotspot.y / SOURCE_IMAGE_HEIGHT) * 100).toFixed(4)),
            radius: Number(((hotspot.radius / SOURCE_IMAGE_WIDTH) * 100).toFixed(4))
          };
        }
      });
    });

    return { state: savedState, migrated };
  }

  /**
   * Save state to LocalStorage
   * @private
   */
  _saveState() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.state));
      if (this.loadedFromLegacyStorage) {
        localStorage.removeItem(this.legacyStorageKey);
        this.loadedFromLegacyStorage = false;
      }
    } catch (error) {
      console.error('AppController: Error saving state', error);
    }
  }

  // ============================================
  // NAVIGATION
  // ============================================

  /**
   * Start room: load room view
   * @param {string} roomId - Room identifier
   */
  startRoom(roomId) {
    this.currentRoomId = roomId;
    this._writtenDegradedMode = false;
    console.log(`AppController: Starting room ${roomId}`);

    this.uiRenderer.renderRoomView(
      roomId,
      (verbId) => this.onHotspotClick(roomId, verbId),
      () => this.backToMenu()
    );
    this.uiRenderer.setBackButtonVictoryMode(false);

    const room = this.state.rooms[roomId];
    if (!room) {
      console.error(`AppController: Room state missing for ${roomId}`);
      this.uiRenderer.setInstruction('This room could not be loaded. Returning to menu.');
      this.backToMenu();
      return;
    }

      if (room.writtenCheckpointComplete) {
        this.currentOralChallenge = null;
        this.uiRenderer.clearWrittenOverlay();
      this.uiRenderer.setInstruction(
        'Congratulations! 🎉',
        null,
        null,
        { chip: true, pop: true }
      );
      this.uiRenderer.setBackButtonVictoryMode(true);
      this.uiRenderer.pulseMenuButton();
      this._updateRoomProgress(roomId);
      return;
    }

    if (room.oralCheckpointComplete) {
      this.currentOralChallenge = null;
      if (room.writtenChallenge?.challengeFailed) {
        this._enterWrittenDegradedMode(roomId);
        this._updateRoomProgress(roomId);
        return;
      }

      if (room.writtenStage == null) {
        room.writtenStage = 1;
        room.writtenChallenge = null;
        this._saveState();
      }

      if (!room.writtenChallenge) {
        this._beginWrittenChallenge(roomId);
      } else {
        this._beginWrittenStage(roomId);
      }
      this._updateRoomProgress(roomId);
      return;
    }

    if (room.challengeFailed) {
      this.currentOralChallenge = this._buildOralChallenge(roomId, room.oralStage || 1);
      this.currentOralChallenge.failed = true;
      this.uiRenderer.setInstruction(
        `Challenge ${room.oralStage || 1} failed`,
        `Restart Challenge ${room.oralStage || 1}`,
        () => this._restartOralChallenge(roomId, room.oralStage || 1)
      );
      this._updateRoomProgress(roomId);
      return;
    }

    this._beginOralChallenge(roomId, room.oralStage || 1);
  }

  /**
   * Return to menu from room
   */
  backToMenu() {
    console.log('AppController: Returning to menu');
    
    // Clean up click handler
    if (this.uiRenderer.currentClickHandler) {
      const imageContainer = document.getElementById('roomImageContainer');
      imageContainer.removeEventListener('click', this.uiRenderer.currentClickHandler);
      this.uiRenderer.currentClickHandler = null;
    }
    
    // Clean up resize handler
    if (this.uiRenderer.currentResizeHandler) {
      window.removeEventListener('resize', this.uiRenderer.currentResizeHandler);
      this.uiRenderer.currentResizeHandler = null;
    }

    const room = this.currentRoomId ? this.state.rooms[this.currentRoomId] : null;
    const activeChallenge = this.currentOralChallenge || room?.writtenChallenge;
    const shouldCelebratePartCompletion = this.pendingPartVictory;
    if (this.currentRoomId && room && activeChallenge && !activeChallenge.failed && !activeChallenge.challengeFailed) {
      this._restoreChallengeProgressSnapshot(this.currentRoomId);
      this._saveState();
    }
    
    this.currentRoomId = null;
    this.currentVerbId = null;
    this.currentOralChallenge = null;
    this._writtenDegradedMode = false;
    this._stage12Successes = null;
    this.uiRenderer?.setBackButtonVictoryMode(false);
    this.uiRenderer.clearConfetti();
    this.uiRenderer.hidePartVictoryCelebration(true);
    this.uiRenderer.clearWrittenOverlay();
    this.uiRenderer.setInstruction('', null);
    this.uiRenderer.renderMenuView(
      (roomId) => this.startRoom(roomId),
      () => this.resetProgress()
    );
    if (shouldCelebratePartCompletion) {
      this.pendingPartVictory = false;
      this.uiRenderer.showPartVictoryCelebration();
    }
  }

  /**
   * Reset all saved progress for testing.
   */
  resetProgress() {
    try {
      localStorage.removeItem(this.storageKey);
      if (this.loadedFromLegacyStorage) {
        localStorage.removeItem(this.legacyStorageKey);
        this.loadedFromLegacyStorage = false;
      }
    } catch (error) {
      console.error('AppController: Error clearing saved state', error);
    }

    this.state = this._createInitialState();
    this.phaseManager.state = this.state;
    this.uiRenderer.state = this.state;
    this.currentRoomId = null;
    this.currentVerbId = null;
    this.currentOralChallenge = null;
    this._writtenDegradedMode = false;
    this._stage12Successes = null;
    this.pendingPartVictory = false;
    this.uiRenderer.clearConfetti();
    this.uiRenderer.hidePartVictoryCelebration(true);
    this.uiRenderer.clearWrittenOverlay();

    if (this.uiRenderer.currentClickHandler) {
      const imageContainer = document.getElementById('roomImageContainer');
      imageContainer?.removeEventListener('click', this.uiRenderer.currentClickHandler);
      this.uiRenderer.currentClickHandler = null;
    }

    if (this.uiRenderer.currentResizeHandler) {
      window.removeEventListener('resize', this.uiRenderer.currentResizeHandler);
      this.uiRenderer.currentResizeHandler = null;
    }

    this.uiRenderer.setInstruction('', null);
    this.uiRenderer.renderMenuView(
      (roomId) => this.startRoom(roomId),
      () => this.resetProgress()
    );
  }

  // ============================================
  // HOTSPOT INTERACTION
  // ============================================

  /**
   * Handle hotspot click
   * @param {string} roomId - Room identifier
   * @param {string} verbId - Verb identifier
   */
  async onHotspotClick(roomId, verbId) {
    const room = this.state.rooms[roomId];
    if (!room) return;
    if (room?.oralStage === 6 && !room.oralCheckpointComplete) {
      return;
    }

    const verb = room.verbs[verbId];
    this.currentVerbId = verbId;

    console.log(`AppController: Hotspot clicked - ${roomId}/${verbId}`);

    // Reveal icon on first click (always, independent of phase)
    if (!verb.iconRevealed) {
      verb.iconRevealed = true;
      this._saveState();
      this.uiRenderer.renderHotspots(roomId);
    }

    // Oral challenges are automatic. If one is active, it consumes the click.
    if (!room.oralCheckpointComplete) {
      if (this.currentOralChallenge?.failed) {
        void this.audioManager.playVerbAudio(verbId);
        return;
      }

      if (!this.currentOralChallenge || this.currentOralChallenge.roomId !== roomId) {
        this._beginOralChallenge(roomId, room.oralStage || 1);
      }

      if (await this._resolveOralChallenge(roomId, verbId)) {
        return;
      }

      return;
    }

    if (room.writtenCheckpointComplete) {
      return;
    }

    if (this._writtenDegradedMode) {
      await this.audioManager.playVerbAudio(verbId);
      if (room.writtenChallenge?.stage === 4) {
        const v = VERB_FORMS[verbId];
        this.uiRenderer.showBriefOverlay(`${v.base} / ${v.preterite} / ${v.participle}`, 2500);
      }
      return;
    }

    if (!room.writtenChallenge) {
      if (room.writtenStage == null) {
        room.writtenStage = 1;
        this._saveState();
      }
      this._beginWrittenChallenge(roomId);
      return;
    }

    const stage = room.writtenChallenge.stage;
    if (stage === 1 || stage === 2) {
      await this._resolveWrittenAnswer(roomId, verbId, verbId === room.writtenChallenge.verbIds[room.writtenChallenge.currentIndex]);
    }
  }

  // ============================================
  // ORAL PHASE HANDLING
  // ============================================

  /**
   * Handle oral phase interaction
   * @private
   */
  async _handleOralPhase(roomId, verbId, oralPhase) {
    console.log(`AppController: Oral phase ${oralPhase} for ${verbId}`);
  }

  /**
   * Resolve an active oral challenge if the user has clicked an answer.
   * @private
   * @param {string} roomId - Room identifier
   * @param {string} clickedVerbId - Verb identifier that was clicked
   * @returns {Promise<boolean>} True if the click was consumed by the challenge
   */
  async _resolveOralChallenge(roomId, clickedVerbId) {
    const challenge = this.currentOralChallenge;
    const room = this.state.rooms[roomId];
    if (!challenge || challenge.roomId !== roomId) {
      return false;
    }

    if (challenge.failed) {
      return false;
    }

    const expectedVerbId = challenge.expectedVerbIds[challenge.currentIndex];
    if (!expectedVerbId) {
      this.currentOralChallenge = null;
      return false;
    }

    if (challenge.stage === 1) {
      const verb = this.state.rooms[roomId].verbs[clickedVerbId];
      if (verb && (verb.oral.successes || 0) < 1) {
        await this.uiRenderer.showSuccessFeedback('✓');
        await this.audioManager.playVerbAudio(clickedVerbId);
        this._recordOralSuccess(roomId, clickedVerbId, true);
        challenge.currentIndex += 1;
        this._saveState();
        this._updateRoomProgress(roomId);

        if (challenge.currentIndex >= challenge.expectedVerbIds.length) {
          await this._completeOralChallenge(roomId, challenge.stage);
        }
      } else {
        void this.audioManager.playVerbAudio(clickedVerbId);
      }

      return true;
    }

    if (challenge.stage === 2) {
      // Translation matching: no error tracker, no lives.
      // Wrong click -> buzz sound only, same translation stays displayed.
      // Correct click -> success feedback + verb audio plays + advance to next translation.
      if (clickedVerbId === expectedVerbId) {
        await this.uiRenderer.showSuccessFeedback('✓');
        await this.audioManager.playVerbAudio(clickedVerbId);
        this._recordOralSuccess(roomId, clickedVerbId, true);
        challenge.currentIndex += 1;
        if (challenge.currentIndex === 1) {
          this.uiRenderer.stopHotspotPulse();
        }
        this._saveState();
        this._updateRoomProgress(roomId);

        if (challenge.currentIndex >= challenge.expectedVerbIds.length) {
          await this._completeOralChallenge(roomId, challenge.stage);
        } else {
          const nextVerbId = challenge.expectedVerbIds[challenge.currentIndex];
          const nextTranslation = this._getVerbTranslation(nextVerbId);
          this.uiRenderer.setInstruction(nextTranslation, null, null, { chip: true, pop: true });
        }
      } else {
        this.uiRenderer._playFeedbackSound('buzz');
      }
      return true;
    }

    if (challenge.stage === 3) {
      if (clickedVerbId === expectedVerbId) {
        await this.uiRenderer.showSuccessFeedback('✓');
        this._recordOralSuccess(roomId, expectedVerbId, true);
        challenge.currentIndex += 1;
        this._saveState();
        this._updateRoomProgress(roomId);

        if (challenge.currentIndex >= challenge.expectedVerbIds.length) {
          await this._completeOralChallenge(roomId, challenge.stage);
        } else {
          void this._playOralQuestionAudio(roomId);
        }

        return true;
      }

      challenge.misses = (challenge.misses || 0) + 1;
      room.challengeMisses = challenge.misses;
      this.uiRenderer.updateInstructionLives();
      if (challenge.misses >= 3) {
        await this._failOralChallenge(roomId, challenge.stage);
        this._saveState();
        return true;
      }

      await this.uiRenderer.showErrorFeedback('Try again');
      void this._playOralQuestionAudio(roomId);
      this._saveState();
      return true;
    }

    if (challenge.stage === 4) {
      if (clickedVerbId === expectedVerbId) {
        await this.uiRenderer.showSuccessFeedback('✓');
        const isSeriesComplete = challenge.currentIndex + 1 >= challenge.expectedVerbIds.length;
        this._recordOralSuccess(roomId, expectedVerbId, isSeriesComplete);
        challenge.currentIndex += 1;
        this._saveState();
        this._updateRoomProgress(roomId);

        if (challenge.currentIndex >= challenge.expectedVerbIds.length) {
          challenge.seriesCount = (challenge.seriesCount || 0) + 1;
          if (challenge.seriesCount >= 5) {
            await this._completeOralChallenge(roomId, challenge.stage);
          } else {
            challenge.expectedVerbIds = this._buildStageFourSequence(roomId);
            challenge.currentIndex = 0;
            this._saveState();
            void this.audioManager.playMultiVerbSequence(challenge.expectedVerbIds);
          }
        }

        return true;
      }

      challenge.misses = (challenge.misses || 0) + 1;
      room.challengeMisses = challenge.misses;
      this.uiRenderer.updateInstructionLives();
      if (challenge.misses >= 3) {
        await this._failOralChallenge(roomId, challenge.stage);
        this._saveState();
        return true;
      }

      await this.uiRenderer.showErrorFeedback('Try again');
      challenge.currentIndex = 0;
      void this.audioManager.playMultiVerbSequence(challenge.expectedVerbIds);
      this._saveState();
      return true;
    }

    if (challenge.stage === 5) {
      if (clickedVerbId === expectedVerbId) {
        await this.uiRenderer.showSuccessFeedback('✓');
        const isSeriesComplete = challenge.currentIndex + 1 >= challenge.expectedVerbIds.length;
        this._recordOralSuccess(roomId, expectedVerbId, isSeriesComplete);
        challenge.currentIndex += 1;
        this._saveState();
        this._updateRoomProgress(roomId);

        if (challenge.currentIndex >= challenge.expectedVerbIds.length) {
          challenge.seriesCount = (challenge.seriesCount || 0) + 1;
          if (challenge.seriesCount >= 5) {
            await this._completeOralChallenge(roomId, challenge.stage);
          } else {
            challenge.expectedVerbIds = this._buildStageFiveSequence(roomId);
            challenge.currentIndex = 0;
            this._saveState();
            void this.audioManager.playMultiVerbSequence(challenge.expectedVerbIds);
          }
        }

        return true;
      }

      challenge.misses = (challenge.misses || 0) + 1;
      room.challengeMisses = challenge.misses;
      this.uiRenderer.updateInstructionLives();
      if (challenge.misses >= 3) {
        await this._failOralChallenge(roomId, challenge.stage);
        this._saveState();
        return true;
      }

      await this.uiRenderer.showErrorFeedback('Try again');
      challenge.currentIndex = 0;
      void this.audioManager.playMultiVerbSequence(challenge.expectedVerbIds);
      this._saveState();
      return true;
    }

    if (challenge.stage === 7) {
      if (clickedVerbId === expectedVerbId) {
        await this.uiRenderer.showSuccessFeedback('✓');
        this._recordOralSuccess(roomId, expectedVerbId, true);
        challenge.currentIndex += 1;
        this._saveState();
        this._updateRoomProgress(roomId);

        if (challenge.currentIndex >= challenge.expectedVerbIds.length) {
          await this._completeOralChallenge(roomId, challenge.stage);
        }

        return true;
      }

      challenge.misses = (challenge.misses || 0) + 1;
      room.challengeMisses = challenge.misses;
      this.uiRenderer.updateInstructionLives();
      if (challenge.misses >= 3) {
        await this._failOralChallenge(roomId, challenge.stage);
        this._saveState();
        return true;
      }

      await this.uiRenderer.showErrorFeedback('Try again');
      challenge.currentIndex = 0;
      void this.audioManager.playMultiVerbSequence(challenge.expectedVerbIds);
      this._saveState();
      return true;
    }

    if (clickedVerbId === expectedVerbId) {
      await this.uiRenderer.showSuccessFeedback('✓');
      this._recordOralSuccess(roomId, expectedVerbId, challenge.stage < 7);
      challenge.currentIndex += 1;
      this._saveState();
      this._updateRoomProgress(roomId);

      if (challenge.currentIndex >= challenge.expectedVerbIds.length) {
        await this._completeOralChallenge(roomId, challenge.stage);
      }

      return true;
    }

    await this._failOralChallenge(roomId, challenge.stage);
    this._saveState();
    return true;
  }

  /**
   * Begin an oral challenge stage.
   * @private
   * @param {string} roomId - Room identifier
   * @param {number} stage - Challenge stage (1-7)
   */
  async _beginOralChallenge(roomId, stage) {
    const room = this.state.rooms[roomId];
    if (!room) return;

    const challenge = this._buildOralChallenge(roomId, stage);
    room.oralStage = stage;
    room.challengeFailed = false;
    room.challengeMisses = 0;
    this.currentOralChallenge = challenge;
    this._captureChallengeProgressSnapshot(roomId, 'oral', stage);

    this.uiRenderer.setInstruction(
      challenge.instructionText,
      null,
      null,
      ([1, 2, 3, 4, 5, 7].includes(stage)) ? { chip: true, pop: true } : {}
    );
    this.uiRenderer.updateSidebarTabVisibility(stage);
    this._pulseInstruction();

    if (stage === 1) {
      this.audioManager.stopAudio();
      this.uiRenderer.setInstructionAudioButton(() => this.audioManager.playChallengeIntroAudio(), { left: true });
      await this.audioManager.playChallengeIntroAudio();
    } else if (stage === 2) {
      if (!challenge.expectedVerbIds.length) {
        await this._completeOralChallenge(roomId, stage);
        return;
      }

      const firstVerbId = challenge.expectedVerbIds[0];
      const firstTranslation = this._getVerbTranslation(firstVerbId);
      this.uiRenderer.setInstruction(firstTranslation, null, null, { chip: true, pop: true, shake: true });
      this.uiRenderer.startHotspotPulse();
    } else if (stage === 3) {
      if (!challenge.expectedVerbIds.length) {
        await this._completeOralChallenge(roomId, stage);
        return;
      }

      void this._playOralQuestionAudio(roomId);
      this.uiRenderer.setInstructionAudioButton(() => {
        void this._playOralQuestionAudio(roomId);
      });
    } else if (stage === 4) {
      if (!challenge.expectedVerbIds.length) {
        await this._completeOralChallenge(roomId, stage);
        return;
      }

      void this.audioManager.playMultiVerbSequence(challenge.expectedVerbIds);
      this.uiRenderer.setInstructionAudioButton(() => {
        void this.audioManager.playMultiVerbSequence(challenge.expectedVerbIds);
      }, { left: true });
    } else if (stage === 5) {
      if (!challenge.expectedVerbIds.length) {
        await this._completeOralChallenge(roomId, stage);
        return;
      }

      void this.audioManager.playMultiVerbSequence(challenge.expectedVerbIds);
      this.uiRenderer.setInstructionAudioButton(() => {
        void this.audioManager.playMultiVerbSequence(challenge.expectedVerbIds);
      }, { left: true });
    } else if (stage === 6) {
      if (!challenge.expectedVerbIds.length) {
        await this._completeOralChallenge(roomId, stage);
        return;
      }

      this._beginClassificationItem(roomId);
    } else if (stage === 7) {
      if (!challenge.expectedVerbIds.length) {
        await this._completeOralChallenge(roomId, stage);
        return;
      }

      this.uiRenderer.setInstructionAudioButton(() => {
        void this.audioManager.playMultiVerbSequence(challenge.expectedVerbIds);
      }, { left: true });
      await this._runStageSevenCountdown(challenge.expectedVerbIds);
    }

    this._saveState();
    this._updateRoomProgress(roomId);
  }

  async _runStageSevenCountdown(verbIds) {
    const countdownValues = [3, 2, 1, 0];

    for (const value of countdownValues) {
      this.uiRenderer.showCountdownOverlay(value);

      if (value === 0) {
        void this.audioManager.playMultiVerbSequence(verbIds);
        await this._wait(250);
        break;
      }

      await this._wait(1000);
    }

    this.uiRenderer.feedbackLayer?.classList.add('hidden');
  }

  _wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Build the expected sequence for a challenge stage.
   * @private
   * @param {string} roomId - Room identifier
   * @param {number} stage - Challenge stage
   * @returns {Object}
   */
  _buildOralChallenge(roomId, stage) {
    const baseSequence = [...getRoomVerbs(roomId)];
    let expectedVerbIds = [];
    let instructionText = '';

    switch (stage) {
      case 1:
        instructionText = 'Challenge 1: Find five irregular verbs';
        expectedVerbIds = baseSequence;
        break;
      case 2:
        instructionText = 'Challenge 2: Match the translation';
        expectedVerbIds = this._buildStageTwoTranslationSequence(roomId);
        break;
      case 3:
        instructionText = 'Challenge 3: Where is it?';
        expectedVerbIds = this._buildStageThreeSequence(roomId);
        break;
      case 4:
        instructionText = 'Challenge 4: Two-in-a-row';
        expectedVerbIds = this._buildStageFourSequence(roomId);
        break;
      case 5:
        instructionText = 'Challenge 5: Three-in-a-row';
        expectedVerbIds = this._buildStageFiveSequence(roomId);
        break;
      case 6:
        instructionText = 'Challenge 6: Classify the verb';
        expectedVerbIds = this._buildStageSixClassificationSequence(roomId);
        break;
      case 7:
      default:
        instructionText = 'Challenge 7: Five-in-a-row';
        expectedVerbIds = this._buildStageSevenSequence(roomId);
        break;
    }

    return {
      roomId,
      stage,
      expectedVerbIds,
      currentIndex: 0,
      seriesCount: 0,
      failed: false,
      instructionText
    };
  }

  /**
   * Build a randomised verb sequence for the new stage 2 (translation matching).
   * The order must differ from the stage 1 discovery order.
   * @private
   * @param {string} roomId - Room identifier
   * @returns {Array<string>}
   */
  _buildStageTwoTranslationSequence(roomId) {
    const room = this.state.rooms[roomId];
    if (!room) return [];

    const verbs = Object.values(room.verbs).map(v => v.id);
    return this._shuffleArray(verbs);
  }

  /**
   * Build the random question order for challenge 3.
   * @private
   * @param {string} roomId - Room identifier
   * @returns {Array<string>}
   */
  _buildStageThreeSequence(roomId) {
    const room = this.state.rooms[roomId];
    if (!room) return [];

    const remainingVerbs = Object.values(room.verbs)
      .filter((verb) => (verb.oral.successes || 0) < 2)
      .map((verb) => verb.id);

    return this._shuffleArray(remainingVerbs);
  }

  /**
   * Build the two-verb sequence for challenge 4.
   * @private
   * @param {string} roomId - Room identifier
   * @returns {Array<string>}
   */
  _buildStageFourSequence(roomId) {
    const room = this.state.rooms[roomId];
    if (!room) return [];

    const verbs = Object.values(room.verbs).map((verb) => verb.id);
    return this._shuffleArray(verbs).slice(0, 2);
  }

  /**
   * Build the three-verb sequence for challenge 5.
   * @private
   * @param {string} roomId - Room identifier
   * @returns {Array<string>}
   */
  _buildStageFiveSequence(roomId) {
    const room = this.state.rooms[roomId];
    if (!room) return [];

    const verbs = Object.values(room.verbs).map((verb) => verb.id);
    return this._shuffleArray(verbs).slice(0, 3);
  }

  /**
   * Build the five-verb sequence for stage 6 classification.
   * @private
   * @param {string} roomId - Room identifier
   * @returns {Array<string>}
   */
  _buildStageSixClassificationSequence(roomId) {
    const room = this.state.rooms[roomId];
    if (!room) return [];

    const verbs = Object.values(room.verbs).map((verb) => verb.id);
    return this._shuffleArray(verbs);
  }

  /**
   * Build the five-verb sequence for stage 7.
   * @private
   * @param {string} roomId - Room identifier
   * @returns {Array<string>}
   */
  _buildStageSevenSequence(roomId) {
    const room = this.state.rooms[roomId];
    if (!room) return [];

    const verbs = Object.values(room.verbs).map((verb) => verb.id);
    return this._shuffleArray(verbs).slice(0, 5);
  }

  /**
   * Backward-compatible alias for the old final oral sequence helper.
   * @private
   */
  _buildStageSixSequence(roomId) {
    return this._buildStageSevenSequence(roomId);
  }

  /**
   * Render the classification overlay for the current verb in stage 6.
   * @private
   */
  _beginClassificationItem(roomId) {
    const challenge = this.currentOralChallenge;
    if (!challenge) return;

    const verbId = challenge.expectedVerbIds[challenge.currentIndex];
    if (!verbId) {
      void this._completeOralChallenge(roomId, challenge.stage);
      return;
    }

    const room = this.state.rooms[roomId];
    this.uiRenderer.showHearts(3 - (room.challengeMisses || 0));
    this.uiRenderer.setInstructionAudioIcon(verbId, { chip: true });
    void this.audioManager.playVerbAudio(verbId);

    const verbType = VERB_FORMS[verbId]?.type;
    if (typeof verbType !== 'number') {
      console.warn(`AppController: Missing verb type for ${verbId}`);
      return;
    }
    this.uiRenderer.renderClassificationOverlay(verbType, async (isCorrect) => {
      this.uiRenderer.clearWrittenOverlay();
      await this._resolveClassificationAnswer(roomId, verbId, isCorrect);
    });
  }

  /**
   * Resolve an answer from the classification overlay.
   * @private
   */
  async _resolveClassificationAnswer(roomId, verbId, isCorrect) {
    const room = this.state.rooms[roomId];
    const challenge = this.currentOralChallenge;
    if (!room || !challenge) return;

    const tracker = room.verbs[verbId]?.oral?.classification;
    if (tracker) {
      tracker.attempts += 1;
    }

    if (isCorrect) {
      if (tracker) {
        tracker.correct += 1;
      }
      this._recordOralSuccess(roomId, verbId, true);
      await this.uiRenderer.showSuccessFeedback('✓');
      challenge.currentIndex += 1;
      this._saveState();

      if (challenge.currentIndex >= challenge.expectedVerbIds.length) {
        await this._completeOralChallenge(roomId, challenge.stage);
        return;
      }

      this._beginClassificationItem(roomId);
      return;
    }

    room.challengeMisses = (room.challengeMisses || 0) + 1;
    this.uiRenderer.showHearts(3 - room.challengeMisses);
    this.uiRenderer.playBuzz();
    this._saveState();

    if (room.challengeMisses >= 3) {
      await this._failOralChallenge(roomId, challenge.stage);
      return;
    }

    this._beginClassificationItem(roomId);
  }

  /**
   * Return the French translation for a verb.
   * @private
   * @param {string} verbId - Verb identifier
   * @returns {string}
   */
  _getVerbTranslation(verbId) {
    return VERB_FORMS[verbId]?.fr ?? verbId;
  }

  /**
   * Play the current challenge 3 audio question.
   * @private
   * @param {string} roomId - Room identifier
   */
  async _playOralQuestionAudio(roomId) {
    const challenge = this.currentOralChallenge;
    if (!challenge || challenge.roomId !== roomId || challenge.stage !== 3 || challenge.failed) {
      return;
    }

    const verbId = challenge.expectedVerbIds[challenge.currentIndex];
    if (!verbId) {
      return;
    }

    await this.audioManager.playNarratorQuestion(verbId);
  }

  /**
   * Record a successful oral identification for a verb.
   * @private
   */
  _recordOralSuccess(roomId, verbId, countTowardProgress) {
    const verb = this.state.rooms[roomId].verbs[verbId];
    if (!verb) return;

    if (countTowardProgress) {
      const stage = this.currentOralChallenge?.stage ?? 0;
      const increment = (stage === 1 || stage === 2 || stage === 7) ? 0.5 : 1;
      verb.oral.successes = (verb.oral.successes || 0) + increment;
    }
    this._saveState();
  }

  /**
   * Handle completion of an oral challenge stage.
   * @private
   */
  async _completeOralChallenge(roomId, stage) {
    if (stage < 7) {
      this.currentOralChallenge = null;
      await this._beginOralChallenge(roomId, stage + 1);
      return;
    }

    const room = this.state.rooms[roomId];
    room.oralCheckpointComplete = true;
    room.challengeFailed = false;
    room.writtenStage = 1;
    room.writtenChallenge = null;
    room.writtenCheckpointComplete = false;
    Object.values(room.verbs).forEach((verb) => {
      verb.oral.phase = 'complete';
    });

    this.currentOralChallenge = null;
    this._saveState();
    this._updateRoomProgress(roomId);
    this._beginWrittenChallenge(roomId);
  }

  /**
   * Fail the current oral challenge and show a restart button.
   * @private
   */
  async _failOralChallenge(roomId, stage) {
    const room = this.state.rooms[roomId];
    if (!room || !this.currentOralChallenge) return;

    this.currentOralChallenge.failed = true;
    room.challengeFailed = true;
    room.challengeMisses = 3;
    this._restoreChallengeProgressSnapshot(roomId);
    this._updateRoomProgress(roomId);
    const label = `Restart Challenge ${stage}`;
    this.uiRenderer.setInstruction(`Challenge ${stage} failed`, label, () => this._restartOralChallenge(roomId, stage));
    await this.uiRenderer.showErrorFeedback('Try again');
    this._pulseInstruction();
    this._saveState();
  }

  /**
   * Restart a failed oral challenge.
   * @private
   */
  async _restartOralChallenge(roomId, stage) {
    const room = this.state.rooms[roomId];
    if (!room) return;

    this._restoreChallengeProgressSnapshot(roomId);
    await this._beginOralChallenge(roomId, stage);
  }

  /**
   * Brief visual pulse for instruction changes.
   * @private
   */
  _pulseInstruction() {
    const banner = document.getElementById('instructionBanner');
    if (!banner) return;
    banner.classList.remove('pulse');
    void banner.offsetWidth;
    banner.classList.add('pulse');
    window.clearTimeout(this.instructionPulseTimeout);
    this.instructionPulseTimeout = window.setTimeout(() => banner.classList.remove('pulse'), 700);
  }

  // ============================================
  // WRITTEN PHASE HANDLING
  // ============================================

  /**
   * Begin the room-level written phase.
   */
  _beginWrittenChallenge(roomId) {
    const room = this.state.rooms[roomId];
    if (!room) return;

    const stage = room.writtenStage;
    if (stage === 'victory') {
      void this._triggerVictory(roomId);
      return;
    }

    const verbIds = this._buildWrittenSequence(roomId, stage);
    room.writtenChallenge = {
      stage,
      verbIds,
      currentIndex: 0,
      misses: 0,
      challengeFailed: false
    };

    this._writtenDegradedMode = false;
    this._captureChallengeProgressSnapshot(roomId, 'written', stage);
    this._saveState();
    this._beginWrittenStage(roomId);
    this._updateRoomProgress(roomId);
  }

  /**
   * Render the current written-stage item.
   * @private
   */
  _beginWrittenStage(roomId) {
    const room = this.state.rooms[roomId];
    const challenge = room?.writtenChallenge;
    if (!room || !challenge) return;

    if (challenge.challengeFailed) {
      this._enterWrittenDegradedMode(roomId);
      return;
    }

    const { stage, verbIds, currentIndex } = challenge;
    const verbId = verbIds[currentIndex];
    if (!verbId) {
      this._completeWrittenStage(roomId);
      return;
    }

    if (currentIndex === 0 && !challenge.challengeFailed) {
      Object.values(room.verbs).forEach((v) => {
        v.writtenErrorCount = 0;
      });
    }

    this.uiRenderer.clearWrittenOverlay();

    if (stage === 1) {
      const tr = VERB_FORMS[verbId]?.fr ?? verbId;
      this.uiRenderer.setInstruction(tr, null, null, { chip: true, pop: true, shake: true });
      this.uiRenderer.updateInstructionLives();
      return;
    }

    if (stage === 2) {
      const v = VERB_FORMS[verbId];
      this.uiRenderer.setInstruction(`${v.base} / ${v.preterite} / ${v.participle}`, null, null, { chip: true, pop: true });
      this.uiRenderer.setInstructionAudioIcon(verbId, { chip: true });
      void this.audioManager.playVerbAudio(verbId);
      this.uiRenderer.showHearts(3 - challenge.misses);
      const options = this._buildWrittenMCQOptions(verbId);
      this.uiRenderer.renderMCQOverlay(options, async (isCorrect) => {
        if (isCorrect) {
          this.uiRenderer.clearWrittenOverlay();
        }
        await this._resolveWrittenAnswer(roomId, verbId, isCorrect);
      });
      return;
    }

    if (stage === 3) {
      const tr = VERB_FORMS[verbId]?.fr ?? verbId;
      this.uiRenderer.setInstruction(tr, null, null, { chip: true, pop: true, shake: true });
      this.uiRenderer.showHearts(3 - challenge.misses);
      const options = this._buildWrittenMCQOptions(verbId);
      this.uiRenderer.renderMCQOverlay(options, async (isCorrect) => {
        this.uiRenderer.clearWrittenOverlay();
        await this._resolveWrittenAnswer(roomId, verbId, isCorrect);
      });
      return;
    }

    if (stage === 4) {
      this.uiRenderer.setInstructionAudioIcon(verbId, {
        chip: true,
        onReplayComplete: () => this.uiRenderer.focusTypingInput()
      });
      void this.audioManager.playVerbAudio(verbId);
      this.uiRenderer.showHearts(3 - challenge.misses);
      this.uiRenderer.renderTypingOverlay(VERB_FORMS[verbId], async (isCorrect) => {
        this.uiRenderer.clearWrittenOverlay();
        await this._resolveWrittenAnswer(roomId, verbId, isCorrect);
      });
    }
  }

  /**
   * Build the written stage sequence.
   * @private
   */
  _buildWrittenSequence(roomId, stage) {
    const room = this.state.rooms[roomId];
    const verbs = Object.keys(room?.verbs || {});
    const shuffled = this._shuffleArray([...verbs]);

    if (stage === 2) {
      return [...shuffled, ...this._shuffleArray([...shuffled])];
    }

    return shuffled;
  }

  /**
   * Build the MCQ choices for the written-choice stages.
   * @private
   */
  _buildWrittenMCQOptions(correctVerbId) {
    const options = [...(QCM_OPTIONS[correctVerbId] || [])];
    return this._shuffleArray(options);
  }

  /**
   * Pick a distractor verb for the final written stage.
   * @private
   */
  _pickWrittenDistractor(roomId, verbId) {
    const room = this.state.rooms[roomId];
    const others = Object.keys(room?.verbs || {}).filter((id) => id !== verbId);
    if (!others.length) return verbId;
    return others[Math.floor(Math.random() * others.length)];
  }

  /**
   * Resolve a written-stage answer.
   * @private
   */
  async _resolveWrittenAnswer(roomId, verbId, isCorrect) {
    const room = this.state.rooms[roomId];
    const challenge = room?.writtenChallenge;
    if (!room || !challenge) return;

    const { stage } = challenge;

    if (isCorrect) {
      this.phaseManager.recordWrittenAnswer(roomId, verbId, stage, true);
      await this.uiRenderer.showSuccessFeedback('✓');
      this._updateRoomProgress(roomId);

      if (stage === 4) {
        if (!this._stage12Successes) {
          this._stage12Successes = new Set();
        }
        this._stage12Successes.add(verbId);
        this.uiRenderer.renderHotspots(roomId, this._stage12Successes);
      }

      challenge.currentIndex += 1;
      this._saveState();

      if (challenge.currentIndex >= challenge.verbIds.length) {
        await this._completeWrittenStage(roomId);
        return;
      }

      this._beginWrittenStage(roomId);
      return;
    }

    if (stage === 1) {
      this.uiRenderer.playBuzz();
      return;
    }

    this.phaseManager.recordWrittenAnswer(roomId, verbId, stage, false);
    challenge.misses += 1;
    this.uiRenderer.showHearts(3 - challenge.misses);
    this.uiRenderer.playBuzz();

    if (challenge.misses >= 3 || this.state.rooms[roomId].verbs[verbId].writtenErrorCount >= 3) {
      challenge.challengeFailed = true;
      this._writtenDegradedMode = true;
      this._restoreChallengeProgressSnapshot(roomId);
      this._updateRoomProgress(roomId);
      this._saveState();
      this._enterWrittenDegradedMode(roomId);
      return;
    }

    this._saveState();

    if (stage >= 3) {
      this._beginWrittenStage(roomId);
    }
  }

  /**
   * Complete a written stage and advance to the next one.
   * @private
   */
  async _completeWrittenStage(roomId) {
    const room = this.state.rooms[roomId];
    if (!room?.writtenChallenge) return;

    const stage = room.writtenChallenge.stage;
    if (stage === 4) {
      this._stage12Successes = null;
    }

    const next = stage < 4 ? stage + 1 : 'victory';
    room.writtenStage = next;
    room.writtenChallenge = null;
    this._saveState();

    if (next === 'victory') {
      await this._triggerVictory(roomId);
      return;
    }

    this._beginWrittenChallenge(roomId);
  }

  /**
   * Enter degraded written mode after 3 misses.
   * @private
   */
  _enterWrittenDegradedMode(roomId) {
    const room = this.state.rooms[roomId];
    const challenge = room?.writtenChallenge;
    if (!room || !challenge) return;

    this._writtenDegradedMode = true;
    if (challenge.stage === 4) {
      this._stage12Successes = new Set();
      this.uiRenderer.renderHotspots(roomId, this._stage12Successes);
    }
    this.uiRenderer.clearWrittenOverlay();
    this.uiRenderer.setInstruction(
      `Restart Challenge ${challenge.stage}`,
      'Restart',
      () => this._restartWrittenStage(roomId)
    );
    this.uiRenderer.updateInstructionLives();
  }

  /**
   * Restart a failed written stage from scratch.
   * @private
   */
  _restartWrittenStage(roomId) {
    const room = this.state.rooms[roomId];
    const challenge = room?.writtenChallenge;
    if (!room || !challenge) return;

    const stage = challenge.stage;
    this._restoreChallengeProgressSnapshot(roomId);
    this._writtenDegradedMode = false;
    challenge.misses = 0;
    challenge.challengeFailed = false;
    challenge.currentIndex = 0;
    room.writtenStage = stage;
    this._stage12Successes = stage === 4 ? new Set() : null;
    this.uiRenderer.renderHotspots(roomId, this._stage12Successes);
    this.uiRenderer.clearWrittenOverlay();
    room.writtenChallenge = null;
    this._saveState();
    this._beginWrittenChallenge(roomId);
  }

  /**
   * Recalculate written progress from stage trackers.
   * @private
   */
  _recalculateWrittenSuccesses(roomId) {
    const room = this.state.rooms[roomId];
    if (!room) return;

    Object.values(room.verbs).forEach((verb) => {
      let successes = 0;
      for (let stage = 1; stage <= 4; stage += 1) {
        const tracker = verb.written?.[`stage${stage}`];
        if (!tracker) continue;
        if (stage === 1) {
          successes += Math.min(tracker.correct, 1) * 0.5;
        } else if (stage === 2) {
          // x2 sequence: each correct answer scores +1, max 2 per verb
          successes += Math.min(tracker.correct, 2) * 1;
        } else {
          successes += Math.min(tracker.correct, 1) * 1;
        }
      }
      verb.written.successes = successes;
    });
  }

  /**
   * Capture the room scoring state at the start of a fail-prone stage.
   * @private
   */
  _captureChallengeProgressSnapshot(roomId, kind, stage) {
    const room = this.state.rooms[roomId];
    if (!room) return;

    const shouldCapture =
      (kind === 'oral' && [1, 2, 3, 4, 5, 6, 7].includes(stage)) ||
      (kind === 'written' && [1, 2, 3, 4].includes(stage));
    if (!shouldCapture) {
      return;
    }

    const existing = room.challengeProgressSnapshot;
    if (existing?.kind === kind && existing?.stage === stage) {
      return;
    }

    room.challengeProgressSnapshot = {
      kind,
      stage,
      verbs: JSON.parse(JSON.stringify(room.verbs))
    };
  }

  /**
   * Restore the room scoring state to the last captured baseline.
   * @private
   */
  _restoreChallengeProgressSnapshot(roomId) {
    const room = this.state.rooms[roomId];
    const snapshot = room?.challengeProgressSnapshot;
    if (!room || !snapshot?.verbs) {
      return false;
    }

    room.verbs = JSON.parse(JSON.stringify(snapshot.verbs));
    return true;
  }

  /**
   * Trigger the final victory sequence for the room.
   * @private
   */
  async _triggerVictory(roomId) {
    const room = this.state.rooms[roomId];
    if (!room) return;

    room.writtenCheckpointComplete = true;
    room.writtenStage = 'victory';
    room.writtenChallenge = null;
    this._saveState();
    this._updateRoomProgress(roomId);

    this.uiRenderer.setInstruction(
      'Congratulations! 🎉',
      null,
      null,
      { chip: true, pop: true }
    );
    this.uiRenderer.setBackButtonVictoryMode(true);
    this.uiRenderer.playConfetti();

    const assetsRoot = this.partConfig?.assetsRoot
      || this.partDefinition?.config?.assetsRoot
      || `assets/parts/part${this.partConfig?.id || '1'}`;
    const indices = this._shuffleArray(Array.from({ length: 9 }, (_, i) => i + 1))
      .slice(0, 2);
    await this.audioManager.playAudio(`${assetsRoot}/audio/congrats/congrats${indices[0]}.mp3`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await this.audioManager.playAudio(`${assetsRoot}/audio/congrats/congrats${indices[1]}.mp3`);

    this.uiRenderer.pulseMenuButton();
    this._checkRoomCompletion(roomId);
  }

  /**
   * Developer shortcut: complete the current stage and move to the next one.
   * Temporary testing aid.
   */
  async developerAdvanceStage() {
    const roomId = this.currentRoomId;
    if (!roomId) return;

    await this._developerCompleteCurrentStage(roomId);
  }

  async handleDeveloperAction() {
    if (this.uiRenderer?.currentView === 'menu') {
      this._developerCompleteMenuRooms();
      return;
    }

    await this.developerAdvanceStage();
  }

  _developerCompleteMenuRooms() {
    const roomIds = Object.keys(ROOMS).slice(0, 5);
    let updatedCount = 0;

    roomIds.forEach((roomId) => {
      const room = this.state.rooms[roomId];
      if (!room) {
        return;
      }

      room.oralCheckpointComplete = true;
      room.oralStage = 6;
      room.challengeFailed = false;
      room.challengeMisses = 0;
      room.writtenCheckpointComplete = true;
      room.writtenStage = 5;
      room.writtenChallenge = null;

      Object.values(room.verbs).forEach((verb) => {
        verb.iconRevealed = true;
        verb.oral.phase = 'complete';
        verb.oral.successes = Math.max(verb.oral.successes || 0, 6);
        verb.written.successes = Math.max(verb.written.successes || 0, 5);
      });

      updatedCount += 1;
      this.scormWrapper?.sendRoomCompletion(roomId, 100, 100);
    });

    this.pendingPartVictory = false;
    this._saveState();
    this.uiRenderer.renderMenuView(
      (nextRoomId) => this.startRoom(nextRoomId),
      () => this.resetProgress()
    );
    this.uiRenderer.showStatusMessage(`${updatedCount} rooms complétées`);
  }

  /**
   * Temporary developer helper: complete only the current stage.
   * This is intentionally isolated so it can be removed cleanly later.
   * @private
   */
  async _developerCompleteCurrentStage(roomId) {
    const room = this.state.rooms[roomId];
    if (!room) {
      return;
    }

    if (!room.oralCheckpointComplete) {
      if (!this.currentOralChallenge || this.currentOralChallenge.roomId !== roomId) {
        await this._beginOralChallenge(roomId, room.oralStage || 1);
      }

      const initialStage = this.currentOralChallenge?.stage;
      if (!initialStage) return;

      while (
        this.currentOralChallenge &&
        this.currentOralChallenge.roomId === roomId &&
        this.currentOralChallenge.stage === initialStage
      ) {
        const challenge = this.currentOralChallenge;
        const nextVerbId = challenge.expectedVerbIds[challenge.currentIndex];
        if (!nextVerbId) break;

        if (challenge.stage === 6) {
          await this._resolveClassificationAnswer(roomId, nextVerbId, true);
        } else {
          await this._resolveOralChallenge(roomId, nextVerbId);
        }
      }

      return;
    }

    if (room.writtenCheckpointComplete) {
      return;
    }

    if (!room.writtenChallenge || room.writtenChallenge.challengeFailed) {
      this._beginWrittenChallenge(roomId);
    }

    const initialStage = room.writtenChallenge?.stage;
    if (!initialStage) return;

    while (room.writtenChallenge && room.writtenChallenge.stage === initialStage) {
      const challenge = room.writtenChallenge;
      const nextVerbId = challenge.verbIds[challenge.currentIndex];
      if (!nextVerbId) break;

      await this._resolveWrittenAnswer(roomId, nextVerbId, true);
    }
  }

  // ============================================
  // PROGRESS TRACKING
  // ============================================

  /**
   * Update room progress bar
   * @private
   */
  _updateRoomProgress(roomId) {
    this.uiRenderer.updateRoomProgress(roomId);
  }

  /**
   * Check if room is 100% complete
   * @private
   */
  _checkRoomCompletion(roomId) {
    const completion = this.phaseManager.checkRoomCompletion(roomId);

    if (completion.isComplete) {
      console.log(`AppController: Room ${roomId} is 100% complete`);

      // Send to SCORM
      this.scormWrapper.sendRoomCompletion(roomId, 100, 100);

      // Update menu progress bar (will show 100% next time)
      // Check if project is complete
      const projectCompletion = this.phaseManager.checkProjectCompletion();
      if (projectCompletion.isComplete) {
        console.log('AppController: All rooms complete! Project finished!');
        this.pendingPartVictory = true;
        this.scormWrapper.sendFinalCompletion(Object.keys(ROOMS).length * 100);
      }

      this._saveState();
    }
  }

  // ============================================
  // UTILITY HELPERS
  // ============================================

  /**
   * Select N random verbs from a room
   * @private
   */
  _selectRandomVerbs(roomId, count) {
    const verbIds = getRoomVerbs(roomId);
    const shuffled = this._shuffleArray([...verbIds]);
    return shuffled.slice(0, count);
  }

  /**
   * Shuffle an array in place using Fisher-Yates.
   * @private
   */
  _shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  /**
   * Clean up on app exit
   */
  cleanup() {
    if (this.devToggleHandler) {
      window.removeEventListener('keydown', this.devToggleHandler);
      this.devToggleHandler = null;
    }
    this._resetDeveloperToggleBuffer();
    this.scormWrapper.finish();
    console.log('AppController: App cleanup complete');
  }
}

// ============================================
// INITIALIZATION ON PAGE LOAD
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
  console.log('AppController: DOM loaded, starting app...');
  if (!hasPlayableData) {
    document.body.innerHTML = `
      <div style="min-height:100vh;display:grid;place-items:center;background:#0e0d12;color:#f3efdf;font-family:Arial,sans-serif;padding:24px;text-align:center;">
        <div>
          <h1 style="margin:0 0 12px;font-size:clamp(32px,5vw,54px);">Partie ${partId}</h1>
          <p style="margin:0;font-size:18px;line-height:1.5;max-width:42rem;">Cette partie est encore en préparation. La structure est prête, mais les données de jeu ne sont pas encore branchées.</p>
        </div>
      </div>
    `;
    return;
  }
  const app = new AppController();
  await app.onAppReady();

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    app.cleanup();
  });

  // Global reference for debugging
  window.appController = app;
});

export default AppController;
