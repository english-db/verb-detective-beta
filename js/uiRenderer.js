/**
 * UI RENDERER
 * Irregular Verbs Learning Activity - Part 1
 * 
 * Responsibilities:
 * - Render menu view with 6 room cards
 * - Render room view with image and activity panel
 * - Runtime hotspot hit-detection in IMAGE coordinate space (1380×752)
 * - Render QCM, Matching, Typing activity modals
 * - Display success/error feedback with animations
 * - Animate progress bars in real-time
 * - Trigger confetti on room completion
 * - Handle modal open/close/confetti
 * 
 * KEY ARCHITECTURE:
 * - Hotspots are always in IMAGE coordinate space (1380×752, native size)
 * - Screen clicks are converted TO image space for detection
 * - Icons are positioned in SCREEN space using fixed positioning
 * - No centering offset calculations needed
 */

import { ROOMS as PART1_ROOMS } from './parts/part1/data.js';

export class UIRenderer {
  constructor(state, phaseManager, audioManager = null, partConfig = {}, partDefinition = {}) {
    this.state = state;
    this.phaseManager = phaseManager;
    this.audioManager = audioManager;
    this.partConfig = partConfig;
    this.partDefinition = partDefinition;
    this.rooms = this.partDefinition?.ROOMS || PART1_ROOMS;
    this.appContainer = document.getElementById('app');
    this.menuView = document.getElementById('menuView');
    this.roomView = document.getElementById('roomView');
    this.feedbackLayer = document.getElementById('feedbackLayer');
    this.feedbackContent = document.getElementById('feedbackContent');
    this.confettiContainer = document.getElementById('confettiContainer');
    this.instructionBanner = document.getElementById('instructionBanner');
    this.instructionText = document.getElementById('instructionText');
    this.instructionMeta = document.getElementById('instructionMeta');
    this.instructionLives = document.getElementById('instructionLives');
    this.instructionButton = document.getElementById('instructionButton');
    this.writtenOverlay = document.getElementById('writtenOverlay');
    this.stageIndicator = document.getElementById('stageIndicator');
    this.developerModeButton = document.getElementById('developerModeButton');
    this.partVictoryOverlay = document.getElementById('partVictoryOverlay');
    this.partVictoryConfettiBack = document.getElementById('partVictoryConfettiBack');
    this.partVictoryConfettiFront = document.getElementById('partVictoryConfettiFront');
    this.developerModeEnabled = false;
    this.currentView = 'menu';
    this.currentRoomId = null;
    this.currentClickHandler = null;    // For cleanup
    this.currentResizeHandler = null;   // For cleanup
    this._isPulsing = false;
    this.partVictoryDismissArmed = false;
    this.partVictoryArmTimeout = null;
    this.partVictoryCleanupTimeout = null;
    this.partVictoryClickHandler = null;
  }

  // ============================================
  // MENU VIEW
  // ============================================

  /**
   * Render main menu with 6 room cards
   * @param {Function} onRoomSelect - Callback when room is selected
   * @param {Function} onResetProgress - Callback when reset progress is clicked
   */
  renderMenuView(onRoomSelect, onResetProgress) {
    const roomGrid = document.getElementById('roomGrid');
    roomGrid.innerHTML = '';
    this.hidePartVictoryCelebration(true);

    const partTitle = document.getElementById('partTitle');
    const titleText = this.partConfig?.title || `Irregular Verbs - Part ${this.partDefinition?.id || ''}`.trim();
    if (partTitle) {
      partTitle.textContent = titleText;
    }
    document.title = titleText;

    const resetButton = document.getElementById('resetProgressButton');
    if (resetButton) {
      resetButton.onclick = () => this.showResetConfirmation(onResetProgress);
    }

    const acknowledgmentsButton = document.getElementById('acknowledgmentsButton');
    if (acknowledgmentsButton) {
      acknowledgmentsButton.onclick = () => this.showAcknowledgmentsModal();
    }

    Object.values(this.rooms).forEach(room => {
      const progress = this.phaseManager.getRoomProgress(room.id);
      const isComplete = progress >= 100;

      const card = document.createElement('div');
      card.className = `room-card${isComplete ? ' room-card--complete' : ''}`;
      card.innerHTML = `
        <img class="room-card-image" src="${room.imageFile}" alt="${room.name}">
        <div class="room-card-content">
          <h3 class="room-card-name">${room.name}</h3>
          <div class="progress-container">
            <div class="progress-bar">
              <div class="progress-fill ${this._getProgressClass(progress)}" 
                   style="width: ${progress}%"></div>
            </div>
            <span class="progress-text">${progress}%</span>
          </div>
        </div>
        ${isComplete ? `
          <div class="room-card-stamp" aria-hidden="true">
          <img src="assets/parts/part1/images/case_closed.png" alt="">
          </div>
        ` : ''}
      `;

      card.addEventListener('click', () => onRoomSelect(room.id));
      roomGrid.appendChild(card);
    });

    this.showView('menu');
  }

  // ============================================
  // ROOM VIEW
  // ============================================

  /**
   * Render room view with image, hotspots, and activity panel
   * @param {string} roomId - Room identifier
   * @param {Function} onHotspotClick - Callback for hotspot clicks
   * @param {Function} onBackClick - Callback for back button
   */
  renderRoomView(roomId, onHotspotClick, onBackClick) {
    this.currentRoomId = roomId;
    this.clearWrittenOverlay();
    const room = this.rooms[roomId];
    this._ensureVerbTypeSidebar();

    // Update room header
    document.getElementById('roomTitle').textContent = room.name;
    this.updateRoomProgress(roomId);

    // Update room image
    const imgElement = document.getElementById('roomImage');
    imgElement.src = room.imageFile;
    imgElement.alt = room.name;
    
    console.log(`UIRenderer: Loading room image from: ${room.imageFile}`);
    
    // Wait for image to load before setting up interactions
    imgElement.onload = () => {
      console.log(`UIRenderer: Image loaded. Size: ${imgElement.naturalWidth}×${imgElement.naturalHeight}, Display: ${imgElement.clientWidth}×${imgElement.clientHeight}`);
      
      // Render revealed icons
      this.renderHotspots(roomId);
      
      // Add click handler for hotspot hit-detection
      const imageContainer = document.getElementById('roomImageContainer');
      const clickHandler = (event) => {
        if (event.target?.closest('#writtenOverlay')) {
          return;
        }

        const img = document.getElementById('roomImage');
        const imgRect = img.getBoundingClientRect();
        if (!imgRect.width || !imgRect.height) {
          return;
        }
        
        const clickX = event.clientX;
        const clickY = event.clientY;
        const clickPercentX = ((clickX - imgRect.left) / imgRect.width) * 100;
        const clickPercentY = ((clickY - imgRect.top) / imgRect.height) * 100;
        
        const detectedVerb = this._detectHotspotHit(
          roomId,
          clickPercentX,
          clickPercentY,
          imgRect
        );

        if (detectedVerb) {
          onHotspotClick(detectedVerb);
        }
      };
      
      imageContainer.addEventListener('click', clickHandler);
      this.currentClickHandler = clickHandler;

      const resizeHandler = () => {
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
          this.renderHotspots(roomId);
        }, 150);
      };

      window.addEventListener('resize', resizeHandler);
      this.currentResizeHandler = resizeHandler;
    };
    
    imgElement.onerror = () => {
      console.error(`UIRenderer: Failed to load image: ${room.imageFile}`);
    };

    // Setup back button
    document.getElementById('backButton').onclick = onBackClick;

    this.updateInstructionLives();
    this.updateSidebarTabVisibility(room?.oralCheckpointComplete ? null : (room?.oralStage ?? 1));
    this.showView('room');
  }

  /**
   * Detect if a click point hits any hotspot circle
   * Uses circle-point collision detection in rendered pixel space
   * 
   * @private
   * @param {string} roomId - Room ID
   * @param {number} clickPercentX - Click X as a percentage of image width
   * @param {number} clickPercentY - Click Y as a percentage of image height
   * @param {DOMRect} imgRect - Current rendered image rectangle
   * @returns {string|null} verbId if hit, null otherwise
   */
  _detectHotspotHit(roomId, clickPercentX, clickPercentY, imgRect) {
    const room = this.rooms[roomId];
    const roomState = this.state.rooms[roomId];
    
    // Check all verbs in room for collision using the current rendered size
    for (const verbId of room.verbIds) {
      const verb = roomState.verbs[verbId];
      if (!verb) continue;
      
      const hotspot = verb.hotspot;
      if (!hotspot) continue;
      
      const hotspotX = (hotspot.x / 100) * imgRect.width;
      const hotspotY = (hotspot.y / 100) * imgRect.height;
      const hotspotRadius = (hotspot.radius / 100) * imgRect.width;
      const clickX = (clickPercentX / 100) * imgRect.width;
      const clickY = (clickPercentY / 100) * imgRect.height;

      // Circle-point collision detection in rendered pixel space
      const distX = clickX - hotspotX;
      const distY = clickY - hotspotY;
      const distance = Math.sqrt(distX * distX + distY * distY);
      
      if (distance <= hotspotRadius) {
        console.log(`Hotspot hit detected: ${verbId}, distance=${distance.toFixed(2)}, radius=${hotspotRadius.toFixed(2)}`);
        return verbId;
      }
    }
    
    return null;  // No hotspot hit
  }

  /**
   * Render revealed hotspot icons (checkmarks)
   * Icons are positioned with percentage offsets inside the image layer
   * 
   * @private
   */
  renderHotspots(roomId, stage12Successes = null) {
    const iconsLayer = document.getElementById('iconsLayer');
    const hotspotsLayer = document.getElementById('hotspotsLayer');

    const room = this.rooms[roomId];
    const roomState = this.state.rooms[roomId];
    const img = document.getElementById('roomImage');
    const container = document.getElementById('roomImageContainer');
    const imgRect = img.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    if (!imgRect.width || !imgRect.height || !containerRect.width || !containerRect.height) {
      return;
    }

    const left = imgRect.left - containerRect.left;
    const top = imgRect.top - containerRect.top;

    iconsLayer.style.left = left + 'px';
    iconsLayer.style.top = top + 'px';
    iconsLayer.style.width = imgRect.width + 'px';
    iconsLayer.style.height = imgRect.height + 'px';
    hotspotsLayer.style.left = left + 'px';
    hotspotsLayer.style.top = top + 'px';
    hotspotsLayer.style.width = imgRect.width + 'px';
    hotspotsLayer.style.height = imgRect.height + 'px';

    const visibleVerbIds = new Set();

    room.verbIds.forEach(verbId => {
      const verb = roomState.verbs[verbId];
      if (!verb.iconRevealed) return;
      visibleVerbIds.add(verbId);

      const hotspot = verb.hotspot;
      let icon = iconsLayer.querySelector(`.hotspot-icon[data-verb-id="${verbId}"]`);
      const isNewIcon = !icon;

      if (!icon) {
        icon = document.createElement('div');
        icon.className = 'hotspot-icon hotspot-icon--new';
        icon.dataset.verbId = verbId;
        iconsLayer.appendChild(icon);
      } else {
        icon.className = 'hotspot-icon';
        icon.dataset.verbId = verbId;
      }

      if (stage12Successes?.has(verbId)) {
        icon.classList.add('hotspot--gold');
      } else {
        icon.classList.remove('hotspot--gold');
      }
      icon.style.left = hotspot.x + '%';
      icon.style.top = hotspot.y + '%';
      icon.style.transform = 'translate(-50%, -50%)';
      icon.style.zIndex = '2';
      icon.textContent = '\u2713';

      if (isNewIcon) {
        requestAnimationFrame(() => {
          icon.classList.remove('hotspot-icon--new');
        });
      }
    });

    Array.from(iconsLayer.querySelectorAll('.hotspot-icon')).forEach((icon) => {
      if (!visibleVerbIds.has(icon.dataset.verbId)) {
        icon.remove();
      }
    });

    if (this._isPulsing) {
      this.startHotspotPulse();
    }
  }

  /**
   * Start pulsing all visible hotspot icons with a staggered delay.
   */
  startHotspotPulse() {
    this._isPulsing = true;
    const icons = document.querySelectorAll('#iconsLayer .hotspot-icon');
    icons.forEach((icon, index) => {
      icon.style.animationDelay = `${index * 0.22}s`;
      icon.classList.add('pulsing');
    });
  }

  /**
   * Stop pulsing all visible hotspot icons.
   */
  stopHotspotPulse() {
    this._isPulsing = false;
    const icons = document.querySelectorAll('#iconsLayer .hotspot-icon');
    icons.forEach((icon) => {
      icon.classList.remove('pulsing');
      icon.style.animationDelay = '';
    });
  }

  // ============================================
  // WRITTEN OVERLAYS
  // ============================================

  clearWrittenOverlay() {
    if (!this.writtenOverlay) return;
    this.writtenOverlay.innerHTML = '';
    this.writtenOverlay.className = 'written-overlay hidden';
  }

  focusTypingInput() {
    const input = this.writtenOverlay?.querySelector('#writtenTypingInput');
    input?.focus({ preventScroll: true });
  }

  setInstructionAudioIcon(verbId, options = {}) {
    if (!this.instructionText) return;

    this.instructionText.classList.add('instruction-text-icon');
    this.instructionText.classList.remove('instruction-chip', 'instruction-chip--teal', 'instruction-chip--pop', 'instruction-text-with-audio');
    this.instructionText.innerHTML = `
      <button type="button" class="instruction-audio-button${options.chip ? ' instruction-chip' : ''}" aria-label="Replay audio">
        <img src="assets/parts/part1/images/audio-lines.svg" alt="" aria-hidden="true">
      </button>
    `;

    const button = this.instructionText.querySelector('.instruction-audio-button');
    if (button) {
      button.onmousedown = (event) => {
        event.preventDefault();
      };
      button.onclick = async () => {
        await this.audioManager?.playVerbAudio(verbId);
        options.onReplayComplete?.();
      };
    }

    if (this.instructionButton) {
      this.instructionButton.textContent = '';
      this.instructionButton.classList.add('hidden');
      this.instructionButton.onclick = null;
      this.instructionButton.classList.remove('instruction-button--audio-left');
    }

    if (this.instructionBanner) {
      this.instructionBanner.classList.remove('instruction-banner--audio-left');
      this.instructionBanner.classList.remove('pulse');
      void this.instructionBanner.offsetWidth;
      this.instructionBanner.classList.add('pulse');
      setTimeout(() => this.instructionBanner?.classList.remove('pulse'), 700);
    }
  }

  /**
   * Show a replay button in the instruction banner without replacing the text.
   * @param {Function} onClick
   * @param {Object} options
   */
  setInstructionAudioButton(onClick, options = {}) {
    if (!this.instructionButton) return;

    this.instructionButton.replaceWith(this.instructionButton.cloneNode(true));
    this.instructionButton = document.getElementById('instructionButton');
    if (!this.instructionButton) return;

    this.instructionButton.classList.remove('hidden', 'instruction-chip', 'instruction-chip--teal', 'instruction-chip--pop', 'instruction-button--audio-left');
    this.instructionButton.classList.add('instruction-button--audio', 'instruction-button--audio-left');
    this.instructionButton.setAttribute('aria-label', 'Replay instruction audio');
    this.instructionButton.disabled = false;
    this.instructionButton.style.pointerEvents = 'auto';
    this.instructionButton.type = 'button';
      this.instructionButton.innerHTML = '<img src="assets/parts/part1/images/audio-lines.svg" alt="" aria-hidden="true">';
    this.instructionButton.onclick = async () => {
      await onClick?.();
    };

    if (this.instructionBanner && this.instructionText) {
      this.instructionBanner.insertBefore(this.instructionButton, this.instructionText);
    } else if (this.instructionMeta) {
      this.instructionMeta.appendChild(this.instructionButton);
    }

    if (this.instructionBanner) {
      this.instructionBanner.classList.add('instruction-banner--audio-left');
      this.instructionBanner.classList.remove('pulse');
      void this.instructionBanner.offsetWidth;
      this.instructionBanner.classList.add('pulse');
      setTimeout(() => this.instructionBanner?.classList.remove('pulse'), 700);
    }
  }

  showBriefOverlay(text, durationMs = 2500) {
    const overlay = this.writtenOverlay;
    if (!overlay) return;
    overlay.className = 'written-overlay written-overlay--brief';
    overlay.innerHTML = `<div class="brief-flashcard">${text}</div>`;
    overlay.classList.remove('hidden');
    setTimeout(() => {
      overlay.innerHTML = '';
      overlay.className = 'written-overlay hidden';
    }, durationMs);
  }

  showCountdownOverlay(value) {
    if (!this.feedbackLayer || !this.feedbackContent) return;

    this.feedbackContent.className = 'feedback-content';
    void this.feedbackContent.offsetWidth;
    this.feedbackContent.className = 'feedback-content feedback-success feedback-countdown';
    this.feedbackContent.textContent = String(value);
    this.feedbackLayer.classList.remove('hidden');
  }

  showStatusMessage(message, durationMs = 1100) {
    if (!this.feedbackLayer || !this.feedbackContent) return;

    this.feedbackContent.className = 'feedback-content feedback-success';
    this.feedbackContent.textContent = message;
    this.feedbackLayer.classList.remove('hidden');

    window.clearTimeout(this.statusMessageTimeout);
    this.statusMessageTimeout = window.setTimeout(() => {
      this.feedbackLayer?.classList.add('hidden');
    }, durationMs);
  }

  renderMCQOverlay(options, onSelect) {
    const overlay = this.writtenOverlay;
    if (!overlay) return;
    overlay.className = 'written-overlay written-overlay--mcq';

    overlay.innerHTML = options.map((opt, i) => `
      <button type="button" class="mcq-btn" data-index="${i}" data-correct="${opt.correct}">
        ${opt.forms}
      </button>
    `).join('');
    overlay.classList.remove('hidden');

    overlay.querySelectorAll('.mcq-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const isCorrect = btn.getAttribute('data-correct') === 'true';
        const buttons = Array.from(overlay.querySelectorAll('.mcq-btn'));

        if (isCorrect) {
          buttons.forEach((button) => {
            button.disabled = true;
          });

          btn.classList.add('is-selected');
          setTimeout(() => onSelect(true), 320);
          return;
        }

        btn.classList.add('is-selected');
        setTimeout(() => {
          btn.classList.remove('is-selected');
          buttons.forEach((button) => {
            button.disabled = false;
          });
          onSelect(false);
        }, 320);
      });
    });
  }

  renderDualAudioOverlay(verbIdCorrect, verbIdDistractor, onSelect, options = {}) {
    const overlay = this.writtenOverlay;
    if (!overlay) return;
    overlay.className = 'written-overlay written-overlay--audio-row';
    const replayOnSelect = options.replayOnSelect !== false;

    const items = [
      { verbId: verbIdCorrect, correct: true },
      { verbId: verbIdDistractor, correct: false }
    ];
    const shuffledItems = this._shuffleArray([...items]);

    overlay.innerHTML = shuffledItems.map((item, i) => `
      <button type="button" class="audio-choice-btn" data-correct="${item.correct}" data-verb="${item.verbId}">
      <img src="assets/parts/part1/images/audio-lines.svg" alt="play audio ${i + 1}">
      </button>
    `).join('');
    overlay.classList.remove('hidden');

    const buttons = Array.from(overlay.querySelectorAll('.audio-choice-btn'));
    let playbackToken = 0;
    let sequenceComplete = false;

    const clearPlayingState = () => {
      buttons.forEach((button) => button.classList.remove('is-playing'));
    };

    const playChoice = async (btn) => {
      const verbId = btn.getAttribute('data-verb');
      const token = ++playbackToken;

      clearPlayingState();
      btn.classList.add('is-playing');

      try {
        await this.audioManager?.playVerbAudio(verbId);
      } finally {
        if (token !== playbackToken) return;
        btn.classList.remove('is-playing');
      }
    };

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        if (!sequenceComplete) return;
        const isCorrect = btn.getAttribute('data-correct') === 'true';
        void (async () => {
          if (replayOnSelect) {
            await playChoice(btn);
          }
          buttons.forEach((button) => {
            button.disabled = true;
          });
          btn.classList.add('is-selected');
          setTimeout(() => onSelect(isCorrect), 320);
        })();
      });
    });

    const autoPlayOrder = [...buttons];
    buttons.forEach((btn) => btn.classList.add('disabled'));

    (async () => {
      for (const btn of autoPlayOrder) {
        await playChoice(btn);
      }
      sequenceComplete = true;
      buttons.forEach((btn) => btn.classList.remove('disabled'));
    })();
  }

  /**
   * Render the 3-card classification overlay for stage 6.
   * @param {number} correctType
   * @param {function} onSelect
   */
  renderClassificationOverlay(correctType, onSelect) {
    const overlay = this.writtenOverlay;
    if (!overlay) return;
    overlay.className = 'written-overlay written-overlay--classification';

    const types = [1, 2, 3];
    const grid = types.map((t) => `
      <button type="button" class="classification-btn" data-type="${t}">
      <img src="assets/parts/part1/images/type${t}.png" alt="Type ${t}" draggable="false">
      </button>
    `).join('');

    overlay.innerHTML = `
      <div class="classification-grid">${grid}</div>
    `;
    overlay.classList.remove('hidden');

    const allButtons = Array.from(overlay.querySelectorAll('.classification-btn'));

    allButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const clicked = btn.getAttribute('data-type');
        const isCorrect = Number(clicked) === correctType;

        if (isCorrect) {
          allButtons.forEach((b) => { b.disabled = true; });
          btn.classList.add('is-selected');
          setTimeout(() => onSelect(true), 320);
          return;
        }

        btn.classList.add('is-selected');
        setTimeout(() => {
          btn.classList.remove('is-selected');
          allButtons.forEach((b) => { b.disabled = false; });
          onSelect(false);
        }, 320);
      });
    });
  }

  /**
   * Ensure the verb type sidebar exists once in the room view.
   */
  _ensureVerbTypeSidebar() {
    if (document.getElementById('verbTypeSidebar')) return;

    const roomContainer = document.querySelector('.room-container');
    if (!roomContainer) return;

    roomContainer.insertAdjacentHTML('beforeend', `
      <button id="verbTypeSidebarTab" aria-label="Show verb types reference" aria-expanded="false">?</button>
      <div id="verbTypeSidebar" aria-hidden="true">
      <img src="assets/parts/part1/images/lateral1.png" alt="3 types of irregular verbs reference chart" draggable="false">
      </div>
      <div id="verbTypeSidebarBackdrop"></div>
    `);

    const tab = document.getElementById('verbTypeSidebarTab');
    const sidebar = document.getElementById('verbTypeSidebar');
    const backdrop = document.getElementById('verbTypeSidebarBackdrop');
    if (!tab || !sidebar || !backdrop) return;

    const sidebarImage = sidebar.querySelector('img');
    const sidebarImages = ['assets/parts/part1/images/lateral1.png', 'assets/parts/part1/images/lateral2.png'];
    let sidebarImageIndex = 0;

    const closeSidebar = () => {
      sidebar.classList.remove('is-open');
      backdrop.classList.remove('is-visible');
      tab.setAttribute('aria-expanded', 'false');
      sidebar.setAttribute('aria-hidden', 'true');
    };

    const openSidebar = () => {
      sidebarImageIndex = 0;
      if (sidebarImage) {
        sidebarImage.src = sidebarImages[sidebarImageIndex];
      }
      sidebar.classList.add('is-open');
      backdrop.classList.add('is-visible');
      tab.setAttribute('aria-expanded', 'true');
      sidebar.setAttribute('aria-hidden', 'false');
    };

    const toggleSidebarImage = () => {
      if (!sidebarImage) return;
      sidebarImageIndex = (sidebarImageIndex + 1) % sidebarImages.length;
      sidebarImage.src = sidebarImages[sidebarImageIndex];
    };

    tab.addEventListener('click', (event) => {
      event.stopPropagation();
      if (!sidebar.classList.contains('is-open')) {
        openSidebar();
      }
    });

    sidebar.addEventListener('click', (event) => {
      event.stopPropagation();
      toggleSidebarImage();
    });
    backdrop.addEventListener('click', closeSidebar);
  }

  /**
   * Toggle the sidebar tab based on the current oral stage.
   * @param {number|null} oralStage
   */
  updateSidebarTabVisibility(oralStage) {
    const tab = document.getElementById('verbTypeSidebarTab');
    if (!tab) return;

    const sidebar = document.getElementById('verbTypeSidebar');
    const backdrop = document.getElementById('verbTypeSidebarBackdrop');

    if (oralStage === 6) {
      tab.classList.remove('hidden');
      return;
    }

    tab.classList.add('hidden');
    sidebar?.classList.remove('is-open');
    backdrop?.classList.remove('is-visible');
    tab.setAttribute('aria-expanded', 'false');
    sidebar?.setAttribute('aria-hidden', 'true');
  }

  renderTypingOverlay(verb, onSubmit) {
    const overlay = this.writtenOverlay;
    if (!overlay) return;
    overlay.className = 'written-overlay written-overlay--typing';

    const words = [verb.base, verb.preterite, verb.participle];
    const formModels = words.map((word) => {
      const segments = String(word)
        .split(/\s*[,/]\s*|\s+/)
        .map((segment) => segment.trim())
        .filter(Boolean);

      return {
        segments,
        expected: segments.join('').toLowerCase()
      };
    });

    const buildSlots = (formModel, wordIndex) => {
      let letterIndex = 0;

      return formModel.segments.map((segment, segmentIndex) => {
        const slots = Array.from(segment).map(() => (
          `<span class="typing-slot" data-word-index="${wordIndex}" data-letter-index="${letterIndex++}">_</span>`
        )).join('');

        if (segmentIndex === formModel.segments.length - 1) {
          return slots;
        }

        return `${slots}<span class="typing-inline-separator" aria-hidden="true">/</span>`;
      }).join('');
    };

    overlay.innerHTML = `
      <div class="typing-slot-pill" id="typingSlotPill" aria-label="Type the three forms">
        <div class="typing-word-group" data-word-index="0">${buildSlots(formModels[0], 0)}</div>
        <span class="typing-separator" aria-hidden="true"></span>
        <div class="typing-word-group" data-word-index="1">${buildSlots(formModels[1], 1)}</div>
        <span class="typing-separator" aria-hidden="true"></span>
        <div class="typing-word-group" data-word-index="2">${buildSlots(formModels[2], 2)}</div>
      </div>
      <input type="text" class="typing-input typing-input--hidden" id="writtenTypingInput"
             autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="done">
    `;
    overlay.classList.remove('hidden');

    const slotPill = overlay.querySelector('#typingSlotPill');
    const input = overlay.querySelector('#writtenTypingInput');
    if (!slotPill || !input) return;
    this.focusTypingInput();

    const expected = formModels.map((formModel) => formModel.expected);
    const wordLengths = expected.map((word) => word.length);
    const buffers = formModels.map((formModel) => Array.from({ length: formModel.expected.length }, () => ''));
    const slotsByWord = formModels.map((_, wordIndex) => Array.from(slotPill.querySelectorAll(`.typing-word-group[data-word-index="${wordIndex}"] .typing-slot`)));
    const caret = { wordIndex: 0, letterIndex: 0 };

    const clampCaret = () => {
      if (caret.wordIndex < 0) caret.wordIndex = 0;
      if (caret.wordIndex >= words.length) caret.wordIndex = words.length - 1;
      const maxIndex = Math.max(0, wordLengths[caret.wordIndex] - 1);
      if (caret.letterIndex < 0) {
        if (caret.wordIndex > 0) {
          caret.wordIndex -= 1;
          caret.letterIndex = Math.max(0, wordLengths[caret.wordIndex] - 1);
        } else {
          caret.letterIndex = 0;
        }
      }
      if (caret.letterIndex > maxIndex) {
        caret.letterIndex = maxIndex;
      }
    };

    const focusInput = () => {
      this.focusTypingInput();
    };

    const setCaret = (wordIndex, letterIndex) => {
      caret.wordIndex = Math.max(0, Math.min(wordIndex, words.length - 1));
      caret.letterIndex = Math.max(0, Math.min(letterIndex, wordLengths[caret.wordIndex] - 1));
      render();
      focusInput();
    };

    const moveNext = () => {
      const currentWordLength = wordLengths[caret.wordIndex];
      if (caret.letterIndex < currentWordLength - 1) {
        caret.letterIndex += 1;
      } else if (caret.wordIndex < words.length - 1) {
        caret.wordIndex += 1;
        caret.letterIndex = 0;
      } else {
        caret.letterIndex = currentWordLength - 1;
      }
      render();
      focusInput();
    };

    const movePrev = () => {
      if (caret.letterIndex > 0) {
        caret.letterIndex -= 1;
      } else if (caret.wordIndex > 0) {
        caret.wordIndex -= 1;
        caret.letterIndex = Math.max(0, words[caret.wordIndex].length - 1);
      }
      render();
      focusInput();
    };

    const clearCurrent = () => {
      buffers[caret.wordIndex][caret.letterIndex] = '';
    };

    const insertChar = (char) => {
      if (!char) return;
      buffers[caret.wordIndex][caret.letterIndex] = char;
      moveNext();
    };

    const getCurrentValue = () => buffers.map((letters) => letters.join('')).join(' ');

    const render = () => {
      clampCaret();
      slotsByWord.forEach((slots, wordIndex) => {
        slots.forEach((slot, letterIndex) => {
          const letter = buffers[wordIndex][letterIndex] || '';
          const isFilled = letter.length > 0;
          const isActive = caret.wordIndex === wordIndex && caret.letterIndex === letterIndex;
          slot.textContent = isFilled ? letter : '_';
          slot.classList.toggle('is-filled', isFilled);
          slot.classList.toggle('is-empty', !isFilled);
          slot.classList.toggle('is-cursor', isActive);
        });
      });
    };

    const handle = () => {
      const parts = getCurrentValue().toLowerCase().trim().split(/\s+/).filter(Boolean);
      const isCorrect = parts.length === 3
        && parts[0] === expected[0]
        && parts[1] === expected[1]
        && parts[2] === expected[2];
      onSubmit(isCorrect);
    };

    render();

    input.addEventListener('input', () => {
      const normalized = input.value.toLowerCase().replace(/[^a-z\s-]/g, '');
      const lettersOnly = normalized.replace(/\s+/g, '');
      let index = 0;

      for (let w = 0; w < words.length; w += 1) {
        for (let l = 0; l < wordLengths[w]; l += 1) {
          buffers[w][l] = lettersOnly[index] || '';
          index += 1;
        }
      }

      let nextWord = 0;
      let nextLetter = 0;
      let found = false;
      for (let w = 0; w < words.length && !found; w += 1) {
        for (let l = 0; l < words[w].length; l += 1) {
          if (!buffers[w][l]) {
            nextWord = w;
            nextLetter = l;
            found = true;
            break;
          }
        }
      }

      if (!found) {
        nextWord = words.length - 1;
        nextLetter = Math.max(0, wordLengths[nextWord] - 1);
      }
      caret.wordIndex = nextWord;
      caret.letterIndex = nextLetter;
      render();
      input.value = lettersOnly;
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        focusInput();
        return;
      }

      if (e.key === ' ') {
        e.preventDefault();
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        handle();
        return;
      }

      if (e.key === 'Backspace') {
        e.preventDefault();
        if (buffers[caret.wordIndex][caret.letterIndex]) {
          clearCurrent();
        } else if (caret.letterIndex > 0) {
          caret.letterIndex -= 1;
          clearCurrent();
        } else if (caret.wordIndex > 0) {
          caret.wordIndex -= 1;
          caret.letterIndex = Math.max(0, wordLengths[caret.wordIndex] - 1);
          clearCurrent();
        }
        render();
        focusInput();
        input.value = getCurrentValue().replace(/\s+/g, '');
        return;
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        movePrev();
        return;
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        moveNext();
        return;
      }

      if (e.key === ' ') {
        if (caret.wordIndex < words.length - 1) {
          caret.wordIndex += 1;
          caret.letterIndex = 0;
          render();
          focusInput();
        }
        return;
      }

      if (e.key.length === 1 && /^[a-z]$/i.test(e.key)) {
        e.preventDefault();
        insertChar(e.key.toLowerCase());
        input.value = getCurrentValue().replace(/\s+/g, '');
      }
    });

    input.addEventListener('paste', (e) => {
      e.preventDefault();
    });

    slotPill.querySelectorAll('.typing-slot').forEach((slot) => {
      slot.addEventListener('click', () => {
        const wordIndex = Number(slot.dataset.wordIndex);
        const letterIndex = Number(slot.dataset.letterIndex);
        setCaret(wordIndex, letterIndex);
      });
    });
  }

  // ============================================
  // FEEDBACK & ANIMATIONS
  // ============================================

  /**
   * Show success feedback (green, ✓, ding sound)
   * @param {string} message - Optional message
   */
  async showSuccessFeedback(message = '✓') {
    await this._showFeedback(message, 'success');
    this._playFeedbackSound('ding');
  }

  /**
   * Show error feedback (red, ✗, shake, buzz sound)
   * @param {string} message - Optional message
   */
  async showErrorFeedback(message = '✗') {
    await this._showFeedback(message, 'error');
    this._playFeedbackSound('buzz');
  }

  /**
   * Show feedback in the dedicated overlay
   * @private
   */
  _showFeedback(message, type) {
    return new Promise((resolve) => {
      if (!this.feedbackLayer || !this.feedbackContent) {
        resolve();
        return;
      }

      this.feedbackContent.className = `feedback-content feedback-${type}`;
      this.feedbackContent.textContent = message;
      this.feedbackLayer.classList.remove('hidden');

      setTimeout(() => {
        this.feedbackLayer.classList.add('hidden');
        resolve();
      }, 800);
    });
  }

  /**
   * Play sound effect
   * @private
   */
  _playFeedbackSound(type) {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const now = audioContext.currentTime;

      if (type === 'ding') {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.connect(gain);
        gain.connect(audioContext.destination);

        osc.frequency.setValueAtTime(800, now);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === 'buzz') {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.connect(gain);
        gain.connect(audioContext.destination);

        osc.frequency.setValueAtTime(400, now);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

        osc.start(now);
        osc.stop(now + 0.15);
      }
    } catch (error) {
      console.warn('Could not play feedback sound:', error);
    }
  }

  /**
   * Update progress bar with animation
   * @param {string} elementId - Progress bar element ID
   * @param {number} progress - Progress percentage (0-100)
   */
  _updateProgressBar(elementId, progress) {
    const bar = document.getElementById(elementId);
    if (!bar) return;

    bar.style.width = progress + '%';
    bar.className = `progress-fill ${this._getProgressClass(progress)}`;

    // Update text
    const textElement = document.querySelector(`#${elementId}`)
      ?.closest('.progress-container')
      ?.querySelector('.progress-text');
    if (textElement) {
      textElement.textContent = progress + '%';
    }
  }

  /**
   * Get CSS class for progress bar based on percentage
   * @private
   */
  _getProgressClass(progress) {
    if (progress === 0) return '';
    if (progress >= 100) return 'complete';
    return 'active';
  }

  /**
   * Update room progress bar and percentage text.
   * @param {string} roomId - Room identifier
   */
  updateRoomProgress(roomId) {
    const progress = this.phaseManager.getRoomProgress(roomId);
    this._updateProgressBar('roomProgress', progress);
    this.updateStageIndicator(roomId);
  }

  updateStageIndicator(roomId) {
    if (!this.stageIndicator) return;

    const room = roomId ? this.state.rooms[roomId] : null;
    if (!room) {
      this.stageIndicator.textContent = 'Stage 1 / 11';
      return;
    }

    const stageValue = this.phaseManager.getGlobalStage(room);

    this.stageIndicator.textContent = `Stage ${stageValue} / 11`;
  }

  /**
   * Update the challenge lives display in the instruction banner.
   */
  updateInstructionLives() {
    if (!this.instructionLives) return;

    const room = this.currentRoomId ? this.state.rooms[this.currentRoomId] : null;
    const oralStage = room?.oralStage || 1;
    const writtenStage = room?.writtenChallenge?.stage;
    const shouldShowOral = !!room && !room.oralCheckpointComplete && oralStage >= 3 && oralStage <= 7;
    const shouldShowWritten = !!room && room.oralCheckpointComplete && !room.writtenCheckpointComplete && writtenStage >= 2 && writtenStage <= 4;

    if (!shouldShowOral && !shouldShowWritten) {
      this.instructionLives.innerHTML = '';
      this.instructionLives.classList.add('hidden');
      return;
    }

    const remaining = shouldShowOral
      ? Math.max(0, 3 - (room.challengeMisses || 0))
      : Math.max(0, 3 - (room.writtenChallenge?.misses || 0));
    this.showHearts(remaining);
  }

  /**
   * Set the instruction banner text and optional restart button.
   * @param {string} text - Instruction text
   * @param {string|null} buttonLabel - Optional action button label
   * @param {Function|null} onButtonClick - Optional action button callback
   */
  setInstruction(text, buttonLabel = null, onButtonClick = null, options = {}) {
    if (this.instructionText) {
      this.instructionText.classList.remove('instruction-text-icon');
      this.instructionText.classList.remove('instruction-chip', 'instruction-chip--teal', 'instruction-chip--pop', 'instruction-chip--shake', 'instruction-text-with-audio', 'pulse');
      this.instructionText.textContent = text || '';
      if (options.chip) {
        this.instructionText.classList.add('instruction-chip', 'instruction-chip--teal');
        if (options.pop !== false) {
          this.instructionText.classList.add('instruction-chip--pop');
          void this.instructionText.offsetWidth;
        }
        if (options.shake) {
          this.instructionText.classList.add('pulse');
        }
      }
    }

    if (!this.instructionButton) return;

    this.instructionButton.replaceWith(this.instructionButton.cloneNode(true));
    this.instructionButton = document.getElementById('instructionButton');
    this.instructionButton.classList.remove('instruction-chip', 'instruction-chip--teal', 'instruction-chip--pop', 'instruction-button--audio', 'instruction-button--audio-left');

    if (buttonLabel && onButtonClick) {
      this.instructionButton.textContent = buttonLabel;
      this.instructionButton.classList.remove('hidden');
      this.instructionButton.disabled = false;
      this.instructionButton.style.pointerEvents = 'auto';
      this.instructionButton.type = 'button';
      this.instructionButton.onclick = onButtonClick;
      if (options.buttonChip) {
        this.instructionButton.classList.add('instruction-chip', 'instruction-chip--teal', 'instruction-chip--pop');
        void this.instructionButton.offsetWidth;
      }
      if (this.instructionMeta && this.instructionButton.parentElement !== this.instructionMeta) {
        this.instructionMeta.appendChild(this.instructionButton);
      }
    } else {
      this.instructionButton.textContent = '';
      this.instructionButton.classList.add('hidden');
      this.instructionButton.disabled = true;
      this.instructionButton.onclick = null;
    }

    if (this.instructionBanner) {
      this.instructionBanner.classList.remove('instruction-banner--audio-left');
      this.instructionBanner.classList.remove('pulse');
      void this.instructionBanner.offsetWidth;
      this.instructionBanner.classList.add('pulse');
      setTimeout(() => this.instructionBanner?.classList.remove('pulse'), 700);
    }

    this.updateInstructionLives();
  }

  showHearts(remaining) {
    if (!this.instructionLives) return;

    const safeRemaining = Math.max(0, Math.min(3, remaining));
    const hearts = [];
    for (let i = 0; i < 3; i += 1) {
      const src = i < safeRemaining ? 'assets/parts/part1/images/heart_on.svg' : 'assets/parts/part1/images/heart_off.svg';
      hearts.push(`<img class="instruction-life" src="${src}" alt="life ${i + 1}">`);
    }

    this.instructionLives.innerHTML = hearts.join('');
    this.instructionLives.classList.remove('hidden');
  }

  playBuzz() {
    this._playFeedbackSound('buzz');
  }

  pulseMenuButton() {
    const btn = document.getElementById('backButton') || document.getElementById('backMenuBtn');
    if (!btn) return;

    btn.classList.add('pulse');
    btn.addEventListener('click', () => {
      btn.classList.remove('pulse');
    }, { once: true });
  }

  setBackButtonVictoryMode(enabled) {
    const btn = document.getElementById('backButton');
    if (!btn) return;

    btn.classList.toggle('btn-back--victory-chip', !!enabled);
  }

  // ============================================
  // CONFETTI ANIMATION
  // ============================================

  /**
   * Play confetti animation for room completion
   */
  playConfetti() {
    const container = this.confettiContainer;
    if (!container) return;

    container.innerHTML = `
      <div class="confetti-layer confetti-back" id="confettiBack"></div>
      <div class="confetti-layer confetti-front" id="confettiFront"></div>
    `;

    const back = container.querySelector('#confettiBack');
    const front = container.querySelector('#confettiFront');
    if (!back || !front) return;

    const CONFETTI_COLORS = [
      '#ff5fa2', '#4fd2ff', '#7dff57',
      '#ffe14a', '#ff9d2e', '#b96cff', '#68f0ff'
    ];

    const random = (min, max) => Math.random() * (max - min) + min;

    const createConfetti = (target, count, scaleMultiplier = 1) => {
      for (let i = 0; i < count; i += 1) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';

        const width = random(7, 18) * scaleMultiplier;
        const height = random(8, 24) * scaleMultiplier;
        confetti.style.width = `${width}px`;
        confetti.style.height = `${height}px`;
        confetti.style.left = `${random(0, 100)}%`;
        confetti.style.animationDuration = `${random(7.2, 8.8)}s`;
        confetti.style.animationDelay = `${random(-8, 0)}s`;
        confetti.style.transform = `rotate(${random(0, 360)}deg)`;
        confetti.style.background = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
        confetti.style.borderRadius = `${random(10, 45)}% ${random(10, 50)}% ${random(10, 50)}% ${random(10, 45)}%`;
        confetti.style.opacity = random(0.8, 1);
        confetti.style.filter = `brightness(${random(0.92, 1.12)})`;

        target.appendChild(confetti);
      }
    };

    createConfetti(back, 90, 1);
    createConfetti(front, 55, 1.7);
  }

  clearConfetti() {
    if (this.confettiContainer) {
      this.confettiContainer.innerHTML = '';
    }
  }

  showPartVictoryCelebration() {
    const overlay = this.partVictoryOverlay;
    const back = this.partVictoryConfettiBack;
    const front = this.partVictoryConfettiFront;
    if (!overlay || !back || !front) return;

    this.hidePartVictoryCelebration(true);

    overlay.classList.remove('hidden', 'part-victory-overlay--armed', 'part-victory-overlay--exiting');
    overlay.classList.add('part-victory-overlay--active');
    overlay.setAttribute('aria-hidden', 'false');

    this._renderPartVictoryConfetti(back, 90, 1, false);
    this._renderPartVictoryConfetti(front, 60, 1.7, true);

    this.partVictoryDismissArmed = false;
    this.partVictoryClickHandler = () => {
      if (!this.partVictoryDismissArmed) {
        return;
      }

      this.partVictoryDismissArmed = false;
      overlay.classList.remove('part-victory-overlay--armed');
      overlay.classList.remove('part-victory-overlay--active');
      overlay.classList.add('part-victory-overlay--exiting');
      overlay.removeEventListener('click', this.partVictoryClickHandler);

      this.partVictoryCleanupTimeout = window.setTimeout(() => {
        this.hidePartVictoryCelebration(true);
      }, 2000);
    };

    overlay.addEventListener('click', this.partVictoryClickHandler);

    this.partVictoryArmTimeout = window.setTimeout(() => {
      this.partVictoryDismissArmed = true;
      overlay.classList.add('part-victory-overlay--armed');
    }, 3000);
  }

  hidePartVictoryCelebration(immediate = false) {
    window.clearTimeout(this.partVictoryArmTimeout);
    window.clearTimeout(this.partVictoryCleanupTimeout);
    this.partVictoryArmTimeout = null;
    this.partVictoryCleanupTimeout = null;
    this.partVictoryDismissArmed = false;

    const overlay = this.partVictoryOverlay;
    if (!overlay) return;

    if (this.partVictoryClickHandler) {
      overlay.removeEventListener('click', this.partVictoryClickHandler);
      this.partVictoryClickHandler = null;
    }

    if (immediate) {
      overlay.classList.add('hidden');
      overlay.classList.remove('part-victory-overlay--active', 'part-victory-overlay--armed', 'part-victory-overlay--exiting');
      overlay.setAttribute('aria-hidden', 'true');
      if (this.partVictoryConfettiBack) {
        this.partVictoryConfettiBack.innerHTML = '';
      }
      if (this.partVictoryConfettiFront) {
        this.partVictoryConfettiFront.innerHTML = '';
      }
    }
  }

  _renderPartVictoryConfetti(target, count, scaleMultiplier = 1, useBlur = false) {
    if (!target) return;

    target.innerHTML = '';

    const CONFETTI_COLORS = [
      '#ff5fa2', '#4fd2ff', '#7dff57',
      '#ffe14a', '#ff9d2e', '#b96cff', '#68f0ff'
    ];
    const random = (min, max) => Math.random() * (max - min) + min;

    for (let i = 0; i < count; i += 1) {
      const confetti = document.createElement('div');
      confetti.className = 'part-victory-confetti-piece';

      const width = random(7, 18) * scaleMultiplier;
      const height = random(8, 24) * scaleMultiplier;
      confetti.style.width = `${width}px`;
      confetti.style.height = `${height}px`;
      confetti.style.left = `${random(0, 100)}%`;
      confetti.style.animationDuration = `${random(6.8, 8.2)}s`;
      confetti.style.animationDelay = `${random(-8, 0)}s`;
      confetti.style.transform = `rotate(${random(0, 360)}deg)`;
      confetti.style.background = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
      confetti.style.borderRadius = `${random(10, 45)}% ${random(10, 50)}% ${random(10, 50)}% ${random(10, 45)}%`;
      confetti.style.opacity = random(0.75, 1).toFixed(2);
      confetti.style.filter = useBlur
        ? `blur(${random(0.6, 1.5).toFixed(2)}px) brightness(${random(0.95, 1.14).toFixed(2)})`
        : `brightness(${random(0.92, 1.1).toFixed(2)})`;

      target.appendChild(confetti);
    }
  }

  /**
   * Get random confetti color
   * @private
   */
  _getRandomColor() {
    const colors = ['#f39c12', '#e74c3c', '#3498db', '#2ecc71', '#9b59b6', '#1abc9c', '#e67e22'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // ============================================
  // MODAL MANAGEMENT
  // ============================================

  /**
   * Show modal with custom content
   * @private
   */
  _legacyShowModal(html, onShow) {
    const legacyContent = document.getElementById('legacyModalContent');
    if (!legacyContent) return;
    legacyContent.innerHTML = `<div class="legacy-modal-content">${html}</div>`;

    const legacyOverlay = document.getElementById('legacyModalOverlay');
    legacyOverlay?.classList.remove('hidden');

    const modal = legacyContent.querySelector('.legacy-modal-content');
    if (onShow) onShow(modal);

    // Close on backdrop click
    legacyOverlay?.addEventListener('click', (e) => {
      if (e.target === legacyOverlay) {
        this._legacyHideModal();
      }
    }, { once: true });
  }

  /**
   * Hide modal
   */
  _legacyHideModal() {
    const legacyOverlay = document.getElementById('legacyModalOverlay');
    const legacyContent = document.getElementById('legacyModalContent');
    legacyOverlay?.classList.add('hidden');
    if (legacyContent) legacyContent.innerHTML = '';
  }

  /**
   * Show reset confirmation modal.
   * @param {Function} onConfirm - Callback to execute when reset is confirmed
   */
  showResetConfirmation(onConfirm) {
    const content = `
      <div class="legacy-modal-title">Attention</div>
      <div class="legacy-modal-body">
        <p style="text-align: center; font-size: 1.05rem; color: #2c3e50; margin: 0;">
          Le reset effacera la progression sur cet appareil<br />
          (la progression sur ELEA est conservée).<br />
          Reset ?
        </p>
      </div>
      <div class="legacy-modal-buttons">
        <button class="legacy-btn legacy-btn-success" id="confirmResetBtn">oui</button>
        <button class="legacy-btn legacy-btn-secondary" id="cancelResetBtn">non</button>
      </div>
    `;

    this._legacyShowModal(content, (modal) => {
      const confirmBtn = modal?.querySelector('#confirmResetBtn');
      const cancelBtn = modal?.querySelector('#cancelResetBtn');

      confirmBtn?.addEventListener('click', () => {
        this._legacyHideModal();
        onConfirm?.();
      });

      cancelBtn?.addEventListener('click', () => {
        this._legacyHideModal();
      });
    });
  }

  /**
   * Show acknowledgments modal.
   */
  showAcknowledgmentsModal() {
    const content = `
      <div class="legacy-modal-title">Acknowledgments</div>
      <div class="legacy-modal-body legacy-modal-body--stacked">
        <div class="acknowledgments-copy">
          <p>Authored by <b>David Beutier</b></p>
          <p>Coded by <b>Claude 4.6</b> and <b>Codex 5.4</b></p>
          <p>Visuals generated by <b>Gemini 3.1</b></p>
          <p>Voices generated by <b>Murf Gen2</b></p>
          <p>The author would like to thank Damien, Nathalie, C&eacute;line, Mathis for their valuable feedback.</p>
          <p class="acknowledgments-license">
            <span class="acknowledgments-license-icons" aria-label="Creative Commons license icons">
              <img src="assets/common/ui/cc.svg" alt="CC">
              <img src="assets/common/ui/by.svg" alt="BY">
              <img src="assets/common/ui/nc.svg" alt="NC">
              <img src="assets/common/ui/nd.svg" alt="ND">
            </span>
            <b>CC BY-NC-ND 4.0</b> Content on this site is licensed under a
            <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/" target="_blank" rel="noreferrer">Creative Commons Attribution 4.0 International license</a>.
            Icons by <a href="https://fontawesome.com/" target="_blank" rel="noreferrer">Font Awesome</a> and <a href="https://lucide.dev/" target="_blank" rel="noreferrer">Lucide</a>.
          </p>
        </div>
      </div>
      <div class="legacy-modal-buttons">
        <button class="legacy-btn legacy-btn-secondary" id="closeAcknowledgmentsBtn">Close</button>
      </div>
    `;

    this._legacyShowModal(content, (modal) => {
      const closeBtn = modal?.querySelector('#closeAcknowledgmentsBtn');
      closeBtn?.addEventListener('click', () => {
        this._legacyHideModal();
      });
    });
  }

  /**
   * Show room completion modal with confetti
   * @param {string} roomName - Room name
   * @param {Function} onBackClick - Callback for back button
   */
  _legacyShowRoomCompletionModal(roomName, onBackClick) {
    this.playConfetti();

    const content = `
      <div class="legacy-modal-title">Room Complete!</div>
      <div class="legacy-modal-body">
        <p style="text-align: center; font-size: 1.1rem; color: #2ecc71;">
          🎉 Congratulations! You've completed the ${roomName}! 🎉
        </p>
      </div>
      <div class="legacy-modal-buttons">
        <button class="legacy-btn legacy-btn-success" id="backMenuBtn">Back to Menu</button>
      </div>
    `;

    this._legacyShowModal(content, (modal) => {
      document.getElementById('backMenuBtn').addEventListener('click', () => {
        this._legacyHideModal();
        onBackClick();
      });
    });
  }

  // ============================================
  // VIEW MANAGEMENT
  // ============================================

  /**
   * Show/hide views
   * @private
   */
  showView(viewName) {
    this.currentView = viewName;
    this.menuView.classList.add('hidden');
    this.roomView.classList.add('hidden');
    this._syncDeveloperModeButton();

    if (viewName === 'menu') {
      this.menuView.classList.remove('hidden');
    } else if (viewName === 'room') {
      this.roomView.classList.remove('hidden');
    }

    this._syncDeveloperModeButton();
  }

  setDeveloperModeEnabled(enabled) {
    this.developerModeEnabled = !!enabled;
    this._syncDeveloperModeButton();
  }

  _syncDeveloperModeButton() {
    if (!this.developerModeButton) return;

    const shouldShow = this.developerModeEnabled && (this.currentView === 'room' || this.currentView === 'menu');
    this.developerModeButton.classList.toggle('hidden', !shouldShow);
  }

  // ============================================
  // UTILITY HELPERS
  // ============================================

  /**
   * Shuffle array (Fisher-Yates)
   * @private
   */
  _shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}

export default UIRenderer;
