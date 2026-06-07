/**
 * AUDIO MANAGER
 * Irregular Verbs Learning Activity - Part 1
 * 
 * Responsibilities:
 * - Play single verb audio
 * - Play narrator questions + verb audio
 * - Play multi-verb sequences (2/3/5-in-a-row)
 * - Preload all audio files on app init
 * - Handle audio errors gracefully
 * - Random narrator selection
 */

export class AudioManager {
  constructor(partConfig = {}, partDefinition = {}) {
    this.partConfig = partConfig || {};
    this.partDefinition = partDefinition || {};
    this.audioPlayer = document.getElementById('audioPlayer');
    this.currentAudio = null;
    this.isPlaying = false;
    this.audioCache = {}; // Cache for preloaded audios
    this.narratorCount = this.partConfig?.audio?.narratorCount || 5; // where1.mp3 to where5.mp3
  }

  // ============================================
  // INITIALIZATION & PRELOADING
  // ============================================

  /**
   * Preload all audio files on app initialization
   * @returns {Promise} Resolves when all audios are preloaded
   */
  async preloadAudios() {
    console.log('AudioManager: Starting audio preload...');
    
    const audioUrls = [];
    
    // Verb audios (30 verbs)
    Object.keys(this.partDefinition.VERB_FORMS || {}).forEach(verbId => {
      const filename = this._getVerbAudioFilename(verbId);
      audioUrls.push(filename);
    });

    // Narrator audios (5 files)
    for (let i = 1; i <= this.narratorCount; i++) {
      audioUrls.push(`${this._getAssetsRoot()}/audio/narrators/where${i}.mp3`);
    }

    // Intro audios (2 files)
    (this.partConfig?.audio?.introSequence || []).forEach(url => audioUrls.push(url));
    audioUrls.push(this.partConfig?.audio?.challengeIntro || `${this._getAssetsRoot()}/audio/intro/challenge.mp3`);

    // Preload each audio
    const preloadPromises = audioUrls.map(url => this._preloadAudio(url));
    
    try {
      await Promise.all(preloadPromises);
      console.log(`AudioManager: Preloaded ${audioUrls.length} audio files successfully`);
    } catch (error) {
      console.error('AudioManager: Error preloading audios', error);
    }
  }

  /**
   * Preload a single audio file
   * @private
   * @param {string} url - Audio file URL
   * @returns {Promise}
   */
  _preloadAudio(url) {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.preload = 'auto';
      
      audio.addEventListener('canplaythrough', () => {
        this.audioCache[url] = audio;
        resolve();
      }, { once: true });

      audio.addEventListener('error', (err) => {
        console.warn(`AudioManager: Failed to preload ${url}`, err);
        resolve(); // Don't fail entire preload on single file error
      }, { once: true });

      audio.src = url;
    });
  }

  // ============================================
  // SINGLE VERB AUDIO
  // ============================================

  /**
   * Play audio for a single verb (base / preterite / participle)
   * @param {string} verbId - Verb identifier
   * @returns {Promise} Resolves when audio finishes playing
   */
  async playVerbAudio(verbId) {
    const verb = this.partDefinition.VERB_FORMS?.[verbId];
    if (!verb) {
      console.warn(`AudioManager: Verb not found: ${verbId}`);
      return;
    }

    const filename = this._getVerbAudioFilename(verbId);
    await this._playAudio(filename);
  }

  /**
   * Play a raw audio file URL.
   * @param {string} url - Audio file URL relative to the app root
   * @returns {Promise} Resolves when audio finishes playing
   */
  async playAudio(url) {
    await this._playAudio(url);
  }

  // ============================================
  // NARRATOR QUESTIONS
  // ============================================

  /**
   * Get a random narrator audio filename
   * @private
   * @returns {string} Narrator audio URL
   */
  _getRandomNarrator() {
    const randomIndex = Math.floor(Math.random() * this.narratorCount) + 1;
    return `${this._getAssetsRoot()}/audio/narrators/where${randomIndex}.mp3`;
  }

  /**
   * Play narrator question + verb audio
   * Creates full question: "Where is [break broke broken]?"
   * @param {string} verbId - Verb identifier
   * @returns {Promise} Resolves when both audios finish
   */
  async playNarratorQuestion(verbId) {
    const narratorAudio = this._getRandomNarrator();
    const verbAudio = this._getVerbAudioFilename(verbId);

    if (!verbAudio) {
      console.warn(`AudioManager: Verb not found: ${verbId}`);
      return;
    }

    // Play narrator first, then verb audio
    await this._playAudio(narratorAudio);
    await this._playAudio(verbAudio);
  }

  /**
   * Get verb audio filename
   * @private
   * @param {string} verbId - Verb identifier
   * @returns {string} Audio filename
   */
  _getVerbAudioFilename(verbId) {
    const verb = this.partDefinition.VERB_FORMS?.[verbId];
    if (!verb) return null;
    if (verb.audioFile) {
      return verb.audioFile;
    }
    return `${this._getAssetsRoot()}/audio/verbs/${this._slugifyAudioPart(verb.base)}_${this._slugifyAudioPart(verb.preterite)}_${this._slugifyAudioPart(verb.participle)}.mp3`;
  }

  /**
   * Normalize a verb form so it matches the audio filename convention.
   * Keeps display text intact while mapping punctuation like "was, were" to "was-were".
   * @param {string} value - Verb form text
   * @returns {string} Normalized audio slug
   */
  _slugifyAudioPart(value) {
    return String(value)
      .trim()
      .replace(/[,\s/]+/g, '-')
      .replace(/-+/g, '-');
  }

  // ============================================
  // MULTI-VERB SEQUENCES
  // ============================================

  /**
   * Play a sequence of verb audios (for N-in-a-row challenges)
   * Used for: 2-in-a-row, 3-in-a-row, 5-in-a-row
   * @param {Array<string>} verbIds - Array of verb identifiers
   * @returns {Promise} Resolves when all audios finish
   */
  async playMultiVerbSequence(verbIds) {
    if (!Array.isArray(verbIds) || verbIds.length === 0) {
      console.warn('AudioManager: Invalid verbIds array');
      return;
    }

    // Play each verb audio in sequence
    for (const verbId of verbIds) {
      const audioUrl = this._getVerbAudioFilename(verbId);
      if (audioUrl) {
        await this._playAudio(audioUrl);
      }
    }
  }

  // ============================================
  // INTRO AUDIO
  // ============================================

  /**
   * Play intro sequence at app startup
   * let_s_learn.mp3 + part(n).mp3
   * @returns {Promise} Resolves when both audios finish
   */
  async playIntroAudio() {
    const introSequence = this.partConfig?.audio?.introSequence || [
      `${this._getAssetsRoot()}/audio/intro/let_s_learn.mp3`,
      `${this._getAssetsRoot()}/audio/intro/part${this.partConfig?.id || '1'}.mp3`
    ];
    for (const url of introSequence) {
      await this._playAudio(url);
    }
  }

  /**
   * Play the challenge introduction audio for room entry.
   * @returns {Promise} Resolves when audio finishes
   */
  async playChallengeIntroAudio() {
    await this._playAudio(this.partConfig?.audio?.challengeIntro || `${this._getAssetsRoot()}/audio/intro/challenge.mp3`);
  }

  // ============================================
  // PLAYBACK CONTROL
  // ============================================

  /**
   * Play audio file (internal method)
   * @private
   * @param {string} url - Audio file URL
   * @returns {Promise} Resolves when audio finishes or is stopped
   */
  _playAudio(url) {
    return new Promise((resolve) => {
      // Check if audio is cached
      const cachedAudio = this.audioCache[url];
      if (cachedAudio) {
        this.audioPlayer.src = cachedAudio.src;
      } else {
        this.audioPlayer.src = url;
      }

      this.audioPlayer.currentTime = 0;
      this.isPlaying = true;

      const onEnded = () => {
        this.isPlaying = false;
        this.audioPlayer.removeEventListener('ended', onEnded);
        this.audioPlayer.removeEventListener('error', onError);
        resolve();
      };

      const onError = (err) => {
        console.error(`AudioManager: Error playing ${url}`, err);
        this.isPlaying = false;
        this.audioPlayer.removeEventListener('ended', onEnded);
        this.audioPlayer.removeEventListener('error', onError);
        resolve(); // Resolve anyway to continue flow
      };

      this.audioPlayer.addEventListener('ended', onEnded, { once: true });
      this.audioPlayer.addEventListener('error', onError, { once: true });

      this.audioPlayer.play().catch((error) => {
        console.error(`AudioManager: Failed to play ${url}`, error);
        this.isPlaying = false;
        this.audioPlayer.removeEventListener('ended', onEnded);
        this.audioPlayer.removeEventListener('error', onError);
        resolve(); // Resolve anyway
      });
    });
  }

  _getAssetsRoot() {
    return this.partConfig?.assetsRoot
      || this.partDefinition?.config?.assetsRoot
      || `assets/parts/part${this.partConfig?.id || '1'}`;
  }

  /**
   * Stop currently playing audio
   */
  stopAudio() {
    if (this.audioPlayer) {
      this.audioPlayer.pause();
      this.audioPlayer.currentTime = 0;
      this.isPlaying = false;
    }
  }

  /**
   * Check if audio is currently playing
   * @returns {boolean} True if audio is playing
   */
  isAudioPlaying() {
    return this.isPlaying;
  }

  // ============================================
  // UTILITY
  // ============================================

  /**
   * Replay the last audio that was played
   * @returns {Promise}
   */
  async replayAudio() {
    if (this.audioPlayer && this.audioPlayer.src) {
      return this._playAudio(this.audioPlayer.src);
    }
  }

  /**
   * Get volume level (0-1)
   * @returns {number}
   */
  getVolume() {
    return this.audioPlayer ? this.audioPlayer.volume : 1;
  }

  /**
   * Set volume level
   * @param {number} level - Volume 0-1
   */
  setVolume(level) {
    if (this.audioPlayer) {
      this.audioPlayer.volume = Math.max(0, Math.min(1, level));
    }
  }
}

export default AudioManager;
