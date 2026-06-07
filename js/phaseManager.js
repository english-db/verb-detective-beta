/**
 * PHASE MANAGER
 * Irregular Verbs Learning Activity - Part 1
 * 
 * Manages:
 * - Oral phase progression per verb (exposure → 1in1 → 2in1 → 3in1 → complete)
 * - Room-level 5-in-a-row checkpoint before written phase
 * - Written phase progression (room-level stages 1-4 + victory)
 * - 3-strike error system (3 errors = forced return to hotspots)
 * - Room completion detection
 * - State mutations and phase transitions
 */

export class PhaseManager {
  constructor(appState, storageKey = 'irregularVerbs_state') {
    this.state = appState;
    this.storageKey = storageKey;
  }

  // ============================================
  // PHASE RETRIEVAL
  // ============================================

  /**
   * Get current phase info for a verb in a room
   * @param {string} roomId - Room identifier
   * @param {string} verbId - Verb identifier
   * @returns {Object} { phase, oralPhase, writtenPhase, canStartWritten, isComplete }
   */
  getCurrentPhase(roomId, verbId) {
    const verb = this._getVerb(roomId, verbId);
    if (!verb) return null;
    const room = this.state.rooms[roomId];

    return {
      oralPhase: room?.oralCheckpointComplete ? 'complete' : `challenge-${room?.oralStage || 1}`,
      writtenPhase: room?.writtenCheckpointComplete
        ? 'victory'
        : (room?.oralCheckpointComplete ? `stage-${room?.writtenStage || 1}` : 'locked'),
      canStartWritten: !!room?.oralCheckpointComplete,
      isOralComplete: !!room?.oralCheckpointComplete,
      isWrittenComplete: !!room?.writtenCheckpointComplete,
      isVerbComplete: !!room?.writtenCheckpointComplete,
      errorCount: verb.errorCount || 0,
      oralSuccesses: verb.oral.successes || 0,
      roomCheckpointComplete: !!room?.oralCheckpointComplete
    };
  }

  /**
   * Get next phase for a verb (what comes after current phase)
   * @param {string} roomId - Room identifier
   * @param {string} verbId - Verb identifier
   * @returns {string} Next phase name
   */
  getNextPhase(roomId, verbId) {
    const verb = this._getVerb(roomId, verbId);
    if (!verb) return null;
    const room = this.state.rooms[roomId];

    // Oral phase progression
    if (verb.oral.phase !== 'complete') {
      switch (verb.oral.phase) {
        case 'exposure':
          return '1in1';
        case '1in1':
          return '2in1';
        case '2in1':
          return '3in1';
        case '3in1':
          return 'oral-complete';
        default:
          return 'exposure';
      }
    }

    // Written phase progression
    if (room?.oralCheckpointComplete && !room?.writtenCheckpointComplete) {
      return `written-stage-${room?.writtenStage || 1}`;
    }

    return 'complete';
  }

  /**
   * Check if written phase is unlocked for a verb
   * (Only after the room-level 5-in-a-row is complete)
   * @param {string} roomId - Room identifier
   * @param {string} verbId - Verb identifier
   * @returns {boolean} True if 5-in-a-row completed
   */
  canUnlockWritten(roomId, verbId) {
    const verb = this._getVerb(roomId, verbId);
    if (!verb) return false;
    const room = this.state.rooms[roomId];
    return !!room?.oralCheckpointComplete && !room?.writtenCheckpointComplete;
  }

  /**
   * Check if every verb in a room has reached 5 oral successes.
   * @param {string} roomId - Room identifier
   * @returns {boolean}
   */
  canStartRoomFiveInARow(roomId) {
    const room = this.state.rooms[roomId];
    if (!room) return false;

    return Object.values(room.verbs).every(verb => (verb.oral.successes || 0) >= 5);
  }

  /**
   * Get the global stage number for display purposes.
   * @param {Object} roomState
   * @returns {number}
   */
  getGlobalStage(roomState) {
    if (!roomState?.oralCheckpointComplete) {
      return roomState?.oralStage || 1;
    }

    if (roomState.writtenCheckpointComplete) {
      return 11;
    }

    return 7 + (roomState?.writtenStage || 1);
  }

  /**
   * Get the room progress percentage.
   * Oral phase contributes 55% total, written phase contributes the remaining 45%.
   * @param {string} roomId - Room identifier
   * @returns {number}
   */
  getRoomProgress(roomId) {
    const room = this.state.rooms[roomId];
    if (!room) return 0;

    const oralSuccesses = Object.values(room.verbs).reduce((sum, verb) => sum + (verb.oral.successes || 0), 0);
    const oralProgress = Math.min(oralSuccesses * 2, 55);

    if (!room.oralCheckpointComplete) {
      return oralProgress;
    }

    const writtenSuccesses = Object.values(room.verbs).reduce((sum, verb) => sum + (verb.written.successes || 0), 0);
    const writtenProgress = Math.min(writtenSuccesses * 2, 45);
    return Math.min(100, oralProgress + writtenProgress);
  }

  // ============================================
  // RECORD ANSWERS
  // ============================================

  /**
   * Record an oral phase answer
   * @param {string} roomId - Room identifier
   * @param {string} verbId - Verb identifier
   * @param {boolean} isCorrect - Was answer correct?
   * @returns {Object} { isCorrect, errorCount, phaseComplete, nextPhase }
   */
  recordOralAnswer(roomId, verbId, isCorrect) {
    const verb = this._getVerb(roomId, verbId);
    if (!verb) return null;
    const room = this.state.rooms[roomId];

    const phase = verb.oral.phase;
    let phaseTracker = verb.oral[phase];

    if (!phaseTracker) {
      console.warn(`PhaseManager: Invalid oral phase: ${phase}`);
      return null;
    }

    // Initialize error count if needed
    if (!verb.errorCount) {
      verb.errorCount = 0;
    }

    if (isCorrect) {
      phaseTracker.correct += 1;
      const oralStage = room?.oralStage || 1;
      const increment = (oralStage === 1 || oralStage === 2 || oralStage === 7) ? 0.5 : 1;
      verb.oral.successes = (verb.oral.successes || 0) + increment;
      verb.errorCount = 0; // Reset error count on correct answer
    } else {
      verb.errorCount += 1;
    }

    // Check if phase threshold met
    const thresholdNeeded = this._getPhaseThreshold(phase);
    const phaseComplete = phaseTracker.correct >= thresholdNeeded;

    // Check 3-strike limit
    const strikeOut = verb.errorCount >= 3;
    const nextPhase = phaseComplete ? this.getNextPhase(roomId, verbId) : null;

    // Advance phase if threshold met
    if (phaseComplete) {
      this._advanceOralPhase(verb);
    }

    // Save state
    this._saveState();

    return {
      isCorrect,
      errorCount: verb.errorCount,
      strikeOut,
      phaseComplete,
      nextPhase,
      currentPhaseProgress: `${phaseTracker.correct}/${thresholdNeeded}`
    };
  }

  /**
   * Record a written stage answer.
   * @param {string} roomId - Room identifier
   * @param {string} verbId - Verb identifier
   * @param {number|string} stage - Written stage (1-4, or victory)
   * @param {boolean} isCorrect - Was answer correct?
   * @returns {Object|null}
   */
  recordWrittenAnswer(roomId, verbId, stage, isCorrect) {
    const verb = this._getVerb(roomId, verbId);
    if (!verb) return null;

    const room = this.state.rooms[roomId];
    if (!room?.oralCheckpointComplete) {
      console.warn(`PhaseManager: Written phase not unlocked for ${verbId}`);
      return null;
    }

    const stageKey = `stage${stage}`;
    const phaseTracker = verb.written?.[stageKey];
    if (!phaseTracker) {
      console.warn(`PhaseManager: Invalid written stage: ${stage}`);
      return null;
    }

    if (typeof verb.writtenErrorCount !== 'number') {
      verb.writtenErrorCount = 0;
    }
    if (typeof phaseTracker.attempts !== 'number') {
      phaseTracker.attempts = 0;
    }
    if (typeof phaseTracker.correct !== 'number') {
      phaseTracker.correct = 0;
    }

    phaseTracker.attempts += 1;

    if (isCorrect) {
      phaseTracker.correct += 1;
      const thresholdNeeded = this._getWrittenStageThreshold(stage);
      const phaseComplete = phaseTracker.correct >= thresholdNeeded;

      if (phaseComplete) {
        const increment = stage === 1 ? 0.5 : 1;
        verb.written.successes = (verb.written.successes || 0) + increment;
      }

      verb.writtenErrorCount = 0;
    } else {
      verb.writtenErrorCount += 1;
    }

    const strikeOut = verb.writtenErrorCount >= 3;
    const thresholdNeeded = this._getWrittenStageThreshold(stage);
    const phaseComplete = phaseTracker.correct >= thresholdNeeded;
    this._saveState();

    return {
      isCorrect,
      errorCount: verb.writtenErrorCount,
      strikeOut,
      phaseComplete,
      currentPhaseProgress: `${phaseTracker.correct}/${thresholdNeeded}`
    };
  }

  // ============================================
  // PHASE ADVANCEMENT
  // ============================================

  /**
   * Advance to next oral phase
   * @private
   */
  _advanceOralPhase(verb) {
    switch (verb.oral.phase) {
      case 'exposure':
        verb.oral.phase = '1in1';
        break;
      case '1in1':
        verb.oral.phase = '2in1';
        break;
      case '2in1':
        verb.oral.phase = '3in1';
        break;
      case '3in1':
        verb.oral.phase = 'complete';
        break;
    }
  }

  // ============================================
  // THRESHOLD & REQUIREMENTS
  // ============================================

  /**
   * Get how many correct answers needed to complete a phase
   * @private
   * @param {string} phase - Phase name
   * @returns {number} Threshold (1, 2, or 5)
   */
  _getPhaseThreshold(phase) {
    switch (phase) {
      case 'exposure':
        return 1;
      case '1in1':
        return 1;
      case '2in1':
        return 1;
      case '3in1':
        return 1;
      default:
        return Infinity;
    }
  }

  /**
   * Get how many correct answers are needed to complete a written stage.
   * @private
   * @param {number} stage
   * @returns {number}
   */
  _getWrittenStageThreshold(stage) {
    switch (stage) {
      case 1:
      case 2:
        return 1;
      case 3:
      case 4:
        return 1;
      default:
        return Infinity;
    }
  }

  // ============================================
  // ROOM & PROJECT COMPLETION
  // ============================================

  /**
   * Check if a room is 100% complete (all 5 verbs done)
   * @param {string} roomId - Room identifier
   * @returns {Object} { isComplete, progress, completedVerbs, totalVerbs }
   */
  checkRoomCompletion(roomId) {
    const room = this.state.rooms[roomId];
    if (!room) return null;

    const verbs = Object.values(room.verbs);
    const isComplete = !!room.oralCheckpointComplete && !!room.writtenCheckpointComplete;
    const progress = isComplete ? 100 : this.getRoomProgress(roomId);

    return {
      isComplete,
      progress,
      completedVerbs: isComplete ? verbs.length : 0,
      totalVerbs: verbs.length
    };
  }

  /**
   * Check if entire project is complete (all 6 rooms at 100%)
   * @returns {Object} { isComplete, totalProgress, completedRooms, totalRooms }
   */
  checkProjectCompletion() {
    const rooms = Object.values(this.state.rooms);
    const completedRooms = rooms.filter(room => {
      const completion = this.checkRoomCompletion(room.id || Object.keys(this.state.rooms)[rooms.indexOf(room)]);
      return completion && completion.isComplete;
    }).length;

    const totalProgress = Math.round((completedRooms / rooms.length) * 100);
    const isComplete = completedRooms === rooms.length;

    return {
      isComplete,
      totalProgress,
      completedRooms,
      totalRooms: rooms.length
    };
  }

  // ============================================
  // UTILITY HELPERS
  // ============================================

  /**
   * Get verb object from state
   * @private
   */
  _getVerb(roomId, verbId) {
    if (!this.state.rooms[roomId]) return null;
    return this.state.rooms[roomId].verbs[verbId] || null;
  }

  /**
   * Check whether all oral verbs in a room have been mastered.
   * @param {string} roomId - Room identifier
   * @returns {boolean}
   */
  checkRoomOralCompletion(roomId) {
    const room = this.state.rooms[roomId];
    if (!room) return false;
    return !!room.oralCheckpointComplete;
  }

  /**
   * Save state to LocalStorage
   * @private
   */
  _saveState() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    } catch (error) {
      console.error('PhaseManager: Error saving state', error);
    }
  }

  /**
   * Reset a verb to initial state (for debugging/testing)
   * @param {string} roomId - Room identifier
   * @param {string} verbId - Verb identifier
   */
  resetVerb(roomId, verbId) {
    const verb = this._getVerb(roomId, verbId);
    if (!verb) return;

    verb.oral = {
      phase: 'exposure',
      successes: 0,
      exposure: { attempts: 0, correct: 0 },
      '1in1': { attempts: 0, correct: 0 },
      '2in1': { attempts: 0, correct: 0 },
      '3in1': { attempts: 0, correct: 0 },
      '5in1': { attempts: 0, correct: 0 },
      classification: { attempts: 0, correct: 0 }
    };

    verb.written = {
      successes: 0,
      stage1: { attempts: 0, correct: 0 },
      stage2: { attempts: 0, correct: 0 },
      stage3: { attempts: 0, correct: 0 },
      stage4: { attempts: 0, correct: 0 }
    };

    verb.errorCount = 0;
    verb.writtenErrorCount = 0;

    this._saveState();
  }

  /**
   * Reset entire room (for debugging/testing)
   * @param {string} roomId - Room identifier
   */
  resetRoom(roomId) {
    const room = this.state.rooms[roomId];
    if (!room) return;

    Object.keys(room.verbs).forEach(verbId => {
      this.resetVerb(roomId, verbId);
    });
  }

  /**
   * Get detailed stats for a verb (for debugging)
   * @param {string} roomId - Room identifier
   * @param {string} verbId - Verb identifier
   * @returns {Object} Detailed stats
   */
  getVerbStats(roomId, verbId) {
    const verb = this._getVerb(roomId, verbId);
    if (!verb) return null;

    return {
      verbId,
      roomId,
      oralPhase: verb.oral.phase,
      writtenSuccesses: verb.written.successes || 0,
      oralStats: {
        exposure: verb.oral.exposure,
        '1in1': verb.oral['1in1'],
        '2in1': verb.oral['2in1'],
        '3in1': verb.oral['3in1'],
        '5in1': verb.oral['5in1'],
        classification: verb.oral.classification
      },
      writtenStats: {
        stage1: verb.written.stage1,
        stage2: verb.written.stage2,
        stage3: verb.written.stage3,
        stage4: verb.written.stage4
      },
      oralErrorCount: verb.errorCount || 0,
      writtenErrorCount: verb.writtenErrorCount || 0,
      isComplete: verb.oral.phase === 'complete' && (verb.written.successes || 0) >= 5
    };
  }
}

export default PhaseManager;
