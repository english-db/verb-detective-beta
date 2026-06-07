/**
 * SCORM WRAPPER
 * Irregular Verbs Learning Activity - Part 1
 * 
 * Responsibilities:
 * - SCORM 1.2 API initialization/finalization
 * - Per-room completion tracking
 * - LMS data synchronization (cmi.core.score, completion status)
 * - Error handling for SCORM failures
 * - Cross-device recovery (read stored completion)
 */

export class SCORMWrapper {
  constructor(partDefinition = {}) {
    this.partDefinition = partDefinition || {};
    this.scormInitialized = false;
    this.api = this._findSCORM();
    this.roomCompletionStatus = {};
  }

  // ============================================
  // INITIALIZATION
  // ============================================

  /**
   * Initialize SCORM connection
   * Called on app startup
   * @returns {boolean} True if initialization successful
   */
  initialize() {
    if (!this.api) {
      console.warn('SCORMWrapper: SCORM API not found. Continuing without LMS integration.');
      return false;
    }

    try {
      const result = this.api.LMSInitialize('');
      
      if (result === 'true') {
        this.scormInitialized = true;
        console.log('SCORMWrapper: SCORM initialized successfully');
        return true;
      } else {
        console.warn('SCORMWrapper: LMSInitialize failed');
        return false;
      }
    } catch (error) {
      console.error('SCORMWrapper: Error during initialization', error);
      return false;
    }
  }

  // ============================================
  // ROOM COMPLETION
  // ============================================

  /**
   * Send room completion data to SCORM
   * Called when room reaches 100% completion
   * @param {string} roomId - Room identifier
   * @param {number} progress - Progress percentage (0-100)
   * @param {number} score - Room score (0-100)
   * @returns {boolean} True if successful
   */
  sendRoomCompletion(roomId, progress, score) {
    if (!this.scormInitialized || !this.api) {
      console.warn(`SCORMWrapper: Not initialized, cannot send room completion for ${roomId}`);
      return false;
    }

    try {
      // Store room completion status
      this.roomCompletionStatus[roomId] = {
        timestamp: new Date().toISOString(),
        progress: progress,
        score: score
      };

      // Send as interaction to SCORM
      const interactionId = this._getRoomInteractionId(roomId);
      
      this.api.LMSSetValue('cmi.interactions.' + interactionId + '.id', roomId);
      this.api.LMSSetValue('cmi.interactions.' + interactionId + '.type', 'choice');
      this.api.LMSSetValue('cmi.interactions.' + interactionId + '.result', 'completed');
      this.api.LMSSetValue('cmi.interactions.' + interactionId + '.score.raw', score);
      this.api.LMSSetValue('cmi.interactions.' + interactionId + '.score.max', 100);
      this.api.LMSSetValue('cmi.interactions.' + interactionId + '.timestamp', 
                          new Date().toISOString());

      console.log(`SCORMWrapper: Room completion sent for ${roomId} (score: ${score})`);
      return true;
    } catch (error) {
      console.error(`SCORMWrapper: Error sending room completion for ${roomId}`, error);
      return false;
    }
  }

  /**
   * Send final completion when all rooms are 100%
   * @param {number} totalScore - Total project score (0-600)
   * @returns {boolean} True if successful
   */
  sendFinalCompletion(totalScore) {
    if (!this.scormInitialized || !this.api) {
      console.warn('SCORMWrapper: Not initialized, cannot send final completion');
      return false;
    }

    try {
      const rawScore = Math.round((totalScore / 600) * 100); // Convert to percentage

      this.api.LMSSetValue('cmi.core.score.raw', rawScore);
      this.api.LMSSetValue('cmi.core.score.max', 100);
      this.api.LMSSetValue('cmi.core.score.min', 0);
      this.api.LMSSetValue('cmi.core.lesson_status', 'completed');

      console.log(`SCORMWrapper: Final completion sent (score: ${rawScore}%)`);
      return true;
    } catch (error) {
      console.error('SCORMWrapper: Error sending final completion', error);
      return false;
    }
  }

  // ============================================
  // COMPLETION RECOVERY
  // ============================================

  /**
   * Get stored completion status for a room from LMS
   * Used if user changes device/session
   * @param {string} roomId - Room identifier
   * @returns {Object} Completion data or null
   */
  getStoredCompletion(roomId) {
    if (!this.scormInitialized || !this.api) {
      return null;
    }

    try {
      const interactionId = this._getRoomInteractionId(roomId);
      const result = this.api.LMSGetValue('cmi.interactions.' + interactionId + '.result');
      
      if (result === 'completed') {
        const score = this.api.LMSGetValue('cmi.interactions.' + interactionId + '.score.raw');
        return {
          roomId,
          completed: true,
          score: parseInt(score) || 0
        };
      }

      return null;
    } catch (error) {
      console.error(`SCORMWrapper: Error retrieving completion for ${roomId}`, error);
      return null;
    }
  }

  /**
   * Get overall completion status from LMS
   * @returns {Object} Overall completion data or null
   */
  getOverallCompletion() {
    if (!this.scormInitialized || !this.api) {
      return null;
    }

    try {
      const status = this.api.LMSGetValue('cmi.core.lesson_status');
      const score = this.api.LMSGetValue('cmi.core.score.raw');

      if (status === 'completed') {
        return {
          completed: true,
          score: parseInt(score) || 0
        };
      }

      return null;
    } catch (error) {
      console.error('SCORMWrapper: Error retrieving overall completion', error);
      return null;
    }
  }

  // ============================================
  // FINALIZATION
  // ============================================

  /**
   * Finalize SCORM session (must be called on app exit)
   * @returns {boolean} True if successful
   */
  finish() {
    if (!this.scormInitialized || !this.api) {
      return false;
    }

    try {
      const result = this.api.LMSFinish('');
      
      if (result === 'true') {
        this.scormInitialized = false;
        console.log('SCORMWrapper: SCORM session finalized');
        return true;
      } else {
        console.warn('SCORMWrapper: LMSFinish failed');
        return false;
      }
    } catch (error) {
      console.error('SCORMWrapper: Error during finalization', error);
      return false;
    }
  }

  // ============================================
  // INTERNAL HELPERS
  // ============================================

  /**
   * Find SCORM API in window
   * @private
   */
  _findSCORM() {
    let api = null;

    // Check common API variable names
    if (window.API) {
      api = window.API;
    } else if (window.API_1484_11) {
      api = window.API_1484_11;
    } else if (window.parent && window.parent.API) {
      api = window.parent.API;
    } else if (window.parent && window.parent.API_1484_11) {
      api = window.parent.API_1484_11;
    }

    return api;
  }

  /**
   * Get interaction ID for a room (index-based)
   * @private
   */
  _getRoomInteractionId(roomId) {
    const roomOrder = Object.keys(this.partDefinition.ROOMS || {});
    const index = roomOrder.indexOf(roomId);
    return Math.max(0, index); // Use 0-based index
  }

  // ============================================
  // DEBUGGING / TESTING
  // ============================================

  /**
   * Get SCORM API status (for debugging)
   * @returns {Object} Status info
   */
  getStatus() {
    return {
      apiAvailable: !!this.api,
      scormInitialized: this.scormInitialized,
      roomCompletionStatus: this.roomCompletionStatus
    };
  }

  /**
   * Manually set SCORM API (for testing)
   * @param {Object} api - Mock SCORM API
   */
  setAPI(api) {
    this.api = api;
  }
}

export default SCORMWrapper;
