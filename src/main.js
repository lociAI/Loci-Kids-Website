/* ==========================================
   Loci Kids Main Interactivity Script
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Background Bubbles
  initBackgroundBubbles();

  // Mobile Menu Navigation
  initMobileMenu();

  // Scroll Header Effect
  initScrollHeader();

  // Mascot Interactivity & Sound Effects
  initMascots();

  // Age Selector Toggle
  initAgeToggle();

  // Interactive Games (Arcade)
  initBalloonGame();
  initMarketGame();
  initPhonicsGame();

  // Parental controls simulator
  initParentalSimulator();

  // Legal Modals
  initModals();
});

/* ==========================================
   Web Audio API Sound Synthesizer
   (High-fidelity 8-bit synth sound effects)
   ========================================== */
const AudioSynth = (() => {
  let audioCtx = null;

  function getAudioContext() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // Play a simple pop bubble sound (Penny)
  function playPop() {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.12);
    } catch (e) {
      console.warn('Audio synthesis block/error:', e);
    }
  }

  // Play a sweet cash register coin chime (Daisy / Market)
  function playCoin() {
    try {
      const ctx = getAudioContext();
      // Coin sounds are often two sine waves at high frequencies played sequentially
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      const gain2 = ctx.createGain();

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc1.type = 'sine';
      osc2.type = 'sine';

      // High pitch metal rings
      osc1.frequency.setValueAtTime(880, ctx.currentTime);
      osc1.frequency.setValueAtTime(987, ctx.currentTime + 0.08);
      osc2.frequency.setValueAtTime(1500, ctx.currentTime + 0.08);

      gain1.gain.setValueAtTime(0.15, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

      gain2.gain.setValueAtTime(0.0, ctx.currentTime);
      gain2.gain.setValueAtTime(0.15, ctx.currentTime + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

      osc1.start(ctx.currentTime);
      osc2.start(ctx.currentTime + 0.08);

      osc1.stop(ctx.currentTime + 0.4);
      osc2.stop(ctx.currentTime + 0.4);
    } catch (e) {
      console.warn(e);
    }
  }

  // Play a magical spell sound sweep (Azula / Phonics)
  function playMagicSweep() {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      
      // Multi-frequency magic chime
      for (let i = 0; i < 5; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'triangle';
        const startFreq = 400 + i * 150;
        const delay = i * 0.06;
        
        osc.frequency.setValueAtTime(startFreq, now + delay);
        osc.frequency.exponentialRampToValueAtTime(startFreq * 2, now + delay + 0.3);
        
        gain.gain.setValueAtTime(0.0, now);
        gain.gain.setValueAtTime(0.1, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.3);
        
        osc.start(now + delay);
        osc.stop(now + delay + 0.35);
      }
    } catch (e) {
      console.warn(e);
    }
  }

  // Play a bright fanfare victory sound (Leo / Game Complete)
  function playVictoryFanfare() {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
      const durations = [0.12, 0.12, 0.12, 0.4];
      const startTimes = [0, 0.12, 0.24, 0.36];

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, now + startTimes[idx]);
        
        gain.gain.setValueAtTime(0.0, now);
        gain.gain.setValueAtTime(0.12, now + startTimes[idx]);
        gain.gain.exponentialRampToValueAtTime(0.001, now + startTimes[idx] + durations[idx]);

        osc.start(now + startTimes[idx]);
        osc.stop(now + startTimes[idx] + durations[idx]);
      });
    } catch (e) {
      console.warn(e);
    }
  }

  // Play a soft boing/error sound (Wrong color / invalid click)
  function playBoing() {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.28);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.28);
    } catch (e) {
      console.warn(e);
    }
  }

  return {
    playPop,
    playCoin,
    playMagicSweep,
    playVictoryFanfare,
    playBoing
  };
})();

/* ==========================================
   Background & UI Navigation
   ========================================== */
function initBackgroundBubbles() {
  const container = document.getElementById('bubbleBg');
  if (!container) return;

  const bubbleCount = 12;
  for (let i = 0; i < bubbleCount; i++) {
    const bubble = document.createElement('div');
    bubble.className = 'bg-bubble';
    
    // Random sizes, start positions, and anim delays
    const size = Math.random() * 80 + 30;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${Math.random() * 95}%`;
    bubble.style.animationDelay = `${Math.random() * 15}s`;
    bubble.style.animationDuration = `${Math.random() * 10 + 15}s`;

    container.appendChild(bubble);
  }
}

function initMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  
  if (!menuToggle || !navMenu) return;

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close menu when clicking link
  const links = navMenu.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });
}

function initScrollHeader() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/* ==========================================
   Mascot Character Prompts
   ========================================== */
function initMascots() {
  const cards = document.querySelectorAll('.mascot-card');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      // Remove talking class from others
      cards.forEach(c => c.classList.remove('talking'));
      
      const mascot = card.getAttribute('data-mascot');
      
      // Play appropriate sound effect
      if (mascot === 'leo') AudioSynth.playVictoryFanfare();
      if (mascot === 'azula') AudioSynth.playMagicSweep();
      if (mascot === 'daisy') AudioSynth.playCoin();
      if (mascot === 'penny') AudioSynth.playPop();

      // Show talking bubble
      card.classList.add('talking');

      // Auto clear speech bubble after 3 seconds
      setTimeout(() => {
        card.classList.remove('talking');
      }, 3000);
    });
  });
}

/* ==========================================
   Age Selection Content Manager
   ========================================== */
const ageModeData = {
  toddler: {
    title: '🐣 Focus: Sensory & Play Exploration',
    description: 'Designed for ages 1-3. Features oversized tapping areas, minimal text, instant positive reinforcement, and single-action gestures to support developing motor skills and early concepts.',
    bullets: [
      '<strong>Color Recognition:</strong> Tap, pop, and classify vivid colors.',
      '<strong>Motor Skills:</strong> Drag-and-drop geometric blocks in shape sorting.',
      '<strong>Animal Sounds:</strong> Learn animals through interactive matching.',
      '<strong>Safe Environment:</strong> Built-in locks prevent settings changes.'
    ],
    image: '/assets/toddler-screenshot.jpeg'
  },
  preschool: {
    title: '🎓 Focus: Early Academic Foundations',
    description: 'Designed for ages 4-5. Introduces letters, phonics sliders, simple math, coin valuation, and multi-step cognitive memory matching games to prepare children for classroom success.',
    bullets: [
      '<strong>Counting & Cash:</strong> Learn values (1¢, 5¢, 10¢, 25¢) in the Market.',
      '<strong>Phonics Power:</strong> Slide letter tracks to form words.',
      '<strong>Memory Matching:</strong> Challenge concentration with card grids.',
      '<strong>Logical Deduction:</strong> Solve patterns and shape completion.'
    ],
    image: '/assets/feature_graphic_16_9.png'
  }
};

function initAgeToggle() {
  const btnToddler = document.getElementById('btnToddler');
  const btnPreschool = document.getElementById('btnPreschool');
  const modeContent = document.getElementById('modeContent');

  if (!btnToddler || !btnPreschool || !modeContent) return;

  function renderAgeMode(mode) {
    const data = ageModeData[mode];
    
    // Construct HTML template safely
    const bulletsHtml = data.bullets.map(b => `<li>${b}</li>`).join('');
    
    modeContent.innerHTML = `
      <div class="mode-content active" id="${mode}-mode">
        <div class="mode-info">
          <h3>${data.title}</h3>
          <p>${data.description}</p>
          <ul class="mode-bullets">
            ${bulletsHtml}
          </ul>
        </div>
        <div class="mode-preview-img">
          <img src="${data.image}" alt="${mode} Mode Screenshot" />
        </div>
      </div>
    `;
  }

  // Render initial Toddler state
  renderAgeMode('toddler');

  btnToddler.addEventListener('click', () => {
    btnToddler.classList.add('active');
    btnPreschool.classList.remove('active');
    renderAgeMode('toddler');
    AudioSynth.playPop();
  });

  btnPreschool.addEventListener('click', () => {
    btnPreschool.classList.add('active');
    btnToddler.classList.remove('active');
    renderAgeMode('preschool');
    AudioSynth.playPop();
  });
}

/* ==========================================
   Games Showcase Navigation & Logic
   ========================================== */
function initBalloonGame() {
  const btnStart = document.getElementById('btnStartBalloon');
  const btnPlay = document.getElementById('btnPlayBalloon');
  const overlay = document.getElementById('balloonOverlay');
  const canvasArea = document.getElementById('balloonCanvasArea');
  const scoreDisplay = document.getElementById('balloon-score');
  const targetDisplay = document.getElementById('balloon-target');

  if (!canvasArea) return;

  let score = 0;
  let targetColor = 'RED'; // Can toggled between RED, BLUE, YELLOW, GREEN
  const colors = ['RED', 'BLUE', 'YELLOW', 'GREEN'];
  let gameInterval = null;
  let isPlaying = false;
  let activeBalloons = [];

  function setRandomTarget() {
    targetColor = colors[Math.floor(Math.random() * colors.length)];
    targetDisplay.textContent = targetColor;
    // Set matching text color
    targetDisplay.className = 'hud-highlight font-kids font-bold ';
    if (targetColor === 'RED') targetDisplay.classList.add('text-red');
    else if (targetColor === 'BLUE') targetDisplay.classList.add('text-blue');
    else if (targetColor === 'YELLOW') targetDisplay.classList.add('text-yellow');
    else if (targetColor === 'GREEN') targetDisplay.classList.add('text-green');
  }

  function start() {
    isPlaying = true;
    score = 0;
    scoreDisplay.textContent = score;
    overlay.style.display = 'none';
    setRandomTarget();
    
    // Clear any active entities
    activeBalloons.forEach(b => b.remove());
    activeBalloons = [];

    btnStart.textContent = 'Stop Game';

    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(spawnBalloon, 1000);
  }

  function stop() {
    isPlaying = false;
    btnStart.textContent = 'Start Game';
    clearInterval(gameInterval);
    overlay.style.display = 'flex';
    // Clear entities
    activeBalloons.forEach(b => b.remove());
    activeBalloons = [];
  }

  function spawnBalloon() {
    if (!isPlaying) return;

    const balloon = document.createElement('div');
    const color = colors[Math.floor(Math.random() * colors.length)];
    balloon.className = `balloon-entity balloon-${color.toLowerCase()}`;
    
    // Label letter inside balloon
    const label = document.createElement('span');
    label.className = 'balloon-text';
    label.textContent = color[0]; // R, B, Y, G
    balloon.appendChild(label);

    const string = document.createElement('div');
    string.className = 'balloon-string';
    balloon.appendChild(string);

    // Initial position
    const size = 60;
    const parentWidth = canvasArea.offsetWidth;
    const startX = Math.random() * (parentWidth - size - 20) + 10;
    balloon.style.left = `${startX}px`;
    balloon.style.bottom = `-100px`;

    canvasArea.appendChild(balloon);
    activeBalloons.push(balloon);

    // Animate Float Up
    const speed = Math.random() * 1.5 + 1.5;
    let bottomPos = -100;

    function animateFloat() {
      if (!isPlaying || !balloon.parentNode) return;
      bottomPos += speed;
      balloon.style.bottom = `${bottomPos}px`;

      if (bottomPos > canvasArea.offsetHeight + 100) {
        // Remove off-screen
        balloon.remove();
        activeBalloons = activeBalloons.filter(b => b !== balloon);
      } else {
        requestAnimationFrame(animateFloat);
      }
    }

    requestAnimationFrame(animateFloat);

    // Click handler
    balloon.addEventListener('click', (e) => {
      e.stopPropagation();
      popBalloon(balloon, color, e.clientX, e.clientY);
    });
  }

  function popBalloon(balloon, color, clickX, clickY) {
    if (!isPlaying) return;

    // Check hit target color
    if (color === targetColor) {
      AudioSynth.playPop();
      score += 1;
      scoreDisplay.textContent = score;
      
      // Trigger particles
      createPopParticles(balloon, color);
      
      // Float score tag
      createScoreText(clickX, clickY, '+1');

      // Remove balloon
      balloon.remove();
      activeBalloons = activeBalloons.filter(b => b !== balloon);

      // Check success milestone (e.g. 8 points)
      if (score >= 8) {
        victoryCelebration();
      } else {
        // Toggle new target every 2 successful hits to keep it exciting
        if (score % 2 === 0) {
          setRandomTarget();
        }
      }
    } else {
      AudioSynth.playBoing();
      createScoreText(clickX, clickY, 'Ouch!');
    }
  }

  function createPopParticles(balloon, color) {
    const rect = balloon.getBoundingClientRect();
    const parentRect = canvasArea.getBoundingClientRect();
    const x = rect.left - parentRect.left + rect.width / 2;
    const y = rect.top - parentRect.top + rect.height / 2;

    const count = 12;
    const colorsMap = {
      'RED': 'hsl(0, 80%, 55%)',
      'BLUE': 'hsl(200, 85%, 50%)',
      'YELLOW': 'hsl(45, 100%, 50%)',
      'GREEN': 'hsl(120, 70%, 45%)'
    };

    for (let i = 0; i < count; i++) {
      const part = document.createElement('div');
      part.className = 'particle';
      part.style.backgroundColor = colorsMap[color];
      part.style.left = `${x}px`;
      part.style.top = `${y}px`;

      // random directions
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.4;
      const velocity = Math.random() * 60 + 30;
      const dx = Math.cos(angle) * velocity;
      const dy = Math.sin(angle) * velocity;

      part.style.setProperty('--dx', `${dx}px`);
      part.style.setProperty('--dy', `${dy}px`);

      canvasArea.appendChild(part);

      setTimeout(() => {
        part.remove();
      }, 500);
    }
  }

  function createScoreText(x, y, text) {
    const indicator = document.createElement('div');
    indicator.className = 'pop-score-indicator font-kids';
    indicator.textContent = text;
    
    const parentRect = canvasArea.getBoundingClientRect();
    const left = x - parentRect.left - 15;
    const top = y - parentRect.top - 15;

    indicator.style.left = `${left}px`;
    indicator.style.top = `${top}px`;

    canvasArea.appendChild(indicator);

    setTimeout(() => {
      indicator.remove();
    }, 700);
  }

  function victoryCelebration() {
    isPlaying = false;
    clearInterval(gameInterval);
    AudioSynth.playVictoryFanfare();
    
    overlay.innerHTML = `
      <div class="overlay-content">
        <span class="overlay-emoji">🏆</span>
        <h3>Penny is Proud! 🐾</h3>
        <p>You popped all 8 color balloons and earned a Gold Star! You are awesome!</p>
        <button id="btnPlayAgain" class="btn-primary">Play Again</button>
      </div>
    `;
    overlay.style.display = 'flex';

    document.getElementById('btnPlayAgain').addEventListener('click', () => {
      // Re-setup standard layout
      overlay.innerHTML = `
        <div class="overlay-content">
          <span class="overlay-emoji">🎈</span>
          <h3>Balloon Pop Adventure!</h3>
          <p>Penny the Puppy wants you to pop all the <strong class="color-red">RED</strong> balloons. Ready?</p>
          <button id="btnPlayBalloon" class="btn-primary">Let's Play!</button>
        </div>
      `;
      document.getElementById('btnPlayBalloon').addEventListener('click', start);
      start();
    });

    btnStart.textContent = 'Start Game';
  }

  // Hook elements
  btnPlay.addEventListener('click', start);
  btnStart.addEventListener('click', () => {
    if (isPlaying) stop();
    else start();
  });
}

function initMarketGame() {
  const dragCoins = document.querySelectorAll('.coin-draggable');
  const slot = document.getElementById('piggyBankSlot');
  const bankTotal = document.getElementById('bank-total');
  const btnReset = document.getElementById('btnResetMarket');
  const marketStatus = document.getElementById('marketStatus');
  const activeToy = document.getElementById('activeToy');

  if (!slot) return;

  let totalValue = 0;
  const targetToyValue = 18; // Teddy Bear (18 cents)
  let draggedCoinValue = 0;

  // Setup drag event listeners
  dragCoins.forEach(coin => {
    coin.addEventListener('dragstart', (e) => {
      draggedCoinValue = parseInt(coin.getAttribute('data-value'));
      e.dataTransfer.setData('text/plain', draggedCoinValue);
      coin.style.transform = 'scale(0.95)';
    });

    coin.style.cursor = 'grab';

    coin.addEventListener('dragend', () => {
      coin.style.transform = 'translateY(0)';
    });
  });

  slot.addEventListener('dragover', (e) => {
    e.preventDefault();
    slot.classList.add('dragover');
  });

  slot.addEventListener('dragleave', () => {
    slot.classList.remove('dragover');
  });

  slot.addEventListener('drop', (e) => {
    e.preventDefault();
    slot.classList.remove('dragover');
    
    const value = parseInt(e.dataTransfer.getData('text/plain')) || draggedCoinValue;
    if (value) {
      addCoin(value);
    }
  });

  // Let parents/kids tap/click directly on coins on mobile screens (since HTML5 drag/drop can be tricky on mobile!)
  dragCoins.forEach(coin => {
    coin.addEventListener('click', () => {
      const value = parseInt(coin.getAttribute('data-value'));
      addCoin(value);
      
      // Quick click animation bounce
      coin.style.transform = 'scale(1.15) translateY(-5px)';
      setTimeout(() => {
        coin.style.transform = 'none';
      }, 150);
    });
  });

  function addCoin(value) {
    totalValue += value;
    bankTotal.textContent = `${totalValue}¢`;
    AudioSynth.playCoin();

    // Trigger visual pop animation on Piggy Icon
    slot.classList.add('coin-dropped');
    setTimeout(() => {
      slot.classList.remove('coin-dropped');
    }, 200);

    checkProgress();
  }

  function checkProgress() {
    if (totalValue >= targetToyValue) {
      AudioSynth.playVictoryFanfare();
      marketStatus.textContent = '🎉 Yay! You bought the Teddy Bear! Daisy is happy! 🧸';
      marketStatus.style.color = 'var(--brand-success)';
      activeToy.style.filter = 'drop-shadow(0 0 15px rgba(255, 215, 0, 0.8))';
      
      // Success delay reset
      setTimeout(() => {
        reset();
      }, 3500);
    } else {
      const remaining = targetToyValue - totalValue;
      marketStatus.textContent = `Daisy says: Drop ${remaining}¢ more in the Piggy Bank!`;
      marketStatus.style.color = 'var(--brand-primary)';
    }
  }

  function reset() {
    totalValue = 0;
    bankTotal.textContent = '0¢';
    marketStatus.textContent = 'Feed Daisy\'s Piggy Bank to buy the Teddy Bear!';
    marketStatus.style.color = 'var(--brand-primary)';
    activeToy.style.filter = 'none';
  }

  btnReset.addEventListener('click', () => {
    reset();
    AudioSynth.playBoing();
  });
}

function initPhonicsGame() {
  const slider1 = document.getElementById('slider1');
  const slider2 = document.getElementById('slider2');
  const slider3 = document.getElementById('slider3');
  
  const val1 = document.getElementById('val1');
  const val2 = document.getElementById('val2');
  const val3 = document.getElementById('val3');

  const currentDisplay = document.getElementById('word-current');
  const targetDisplay = document.getElementById('word-target');
  const phonicsFeedback = document.getElementById('phonicsFeedback');
  const btnReset = document.getElementById('btnResetPhonics');
  const phonicsEmoji = document.getElementById('phonicsEmoji');

  if (!slider1) return;

  const wordTargets = [
    { word: 'CAT', letters: ['C,B,M,P,D', 'A,E,O,I,U', 'T,G,N,P,D'], emoji: '🐱' },
    { word: 'DOG', letters: ['D,B,M,P,C', 'O,A,E,I,U', 'G,T,N,P,D'], emoji: '🐶' },
    { word: 'BAT', letters: ['B,C,M,P,D', 'A,E,O,I,U', 'T,G,N,P,D'], emoji: '🦇' }
  ];

  let currentTargetIndex = 0;
  let wordFinished = false;

  function loadWordTarget(idx) {
    wordFinished = false;
    const targetObj = wordTargets[idx];
    targetDisplay.textContent = targetObj.word;
    phonicsEmoji.textContent = '❓';
    phonicsFeedback.textContent = 'Slide the sliders to align spelling and make magic!';
    phonicsFeedback.style.color = 'var(--text-muted)';
    
    // Update input sliders configurations
    slider1.setAttribute('data-letters', targetObj.letters[0]);
    slider2.setAttribute('data-letters', targetObj.letters[1]);
    slider3.setAttribute('data-letters', targetObj.letters[2]);
    
    slider1.value = 0;
    slider2.value = 0;
    slider3.value = 0;

    updateSliderLabel(slider1, val1);
    updateSliderLabel(slider2, val2);
    updateSliderLabel(slider3, val3);

    checkSpelling();
  }

  function updateSliderLabel(slider, label) {
    const lettersArr = slider.getAttribute('data-letters').split(',');
    const idx = parseInt(slider.value);
    label.textContent = lettersArr[idx];
  }

  function handleSliderInput(slider, label) {
    updateSliderLabel(slider, label);
    AudioSynth.playPop();
    checkSpelling();
  }

  function checkSpelling() {
    if (wordFinished) return;

    const lettersArr1 = slider1.getAttribute('data-letters').split(',');
    const lettersArr2 = slider2.getAttribute('data-letters').split(',');
    const lettersArr3 = slider3.getAttribute('data-letters').split(',');

    const spelled = lettersArr1[slider1.value] + lettersArr2[slider2.value] + lettersArr3[slider3.value];
    currentDisplay.textContent = `${lettersArr1[slider1.value]} ${lettersArr2[slider2.value]} ${lettersArr3[slider3.value]}`;

    const targetObj = wordTargets[currentTargetIndex];

    if (spelled === targetObj.word) {
      wordFinished = true;
      AudioSynth.playMagicSweep();
      phonicsFeedback.textContent = `✨ Word Magic! Spelled ${targetObj.word}! ✨`;
      phonicsFeedback.style.color = 'var(--brand-success)';
      phonicsEmoji.textContent = targetObj.word === 'CAT' ? '🐱' : targetObj.word === 'DOG' ? '🐶' : '🦇';

      // Load next target word after 3 seconds
      setTimeout(() => {
        currentTargetIndex = (currentTargetIndex + 1) % wordTargets.length;
        loadWordTarget(currentTargetIndex);
      }, 3000);
    }
  }

  // Listeners
  slider1.addEventListener('input', () => handleSliderInput(slider1, val1));
  slider2.addEventListener('input', () => handleSliderInput(slider2, val2));
  slider3.addEventListener('input', () => handleSliderInput(slider3, val3));

  btnReset.addEventListener('click', () => {
    loadWordTarget(currentTargetIndex);
    AudioSynth.playBoing();
  });

  // Load initial CAT
  loadWordTarget(0);

  // Add Arcade game selector tab controller
  const arcadeTabs = document.querySelectorAll('.arcade-tab-btn');
  const gameContainers = document.querySelectorAll('.game-container');

  arcadeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Clear active classes
      arcadeTabs.forEach(t => t.classList.remove('active'));
      gameContainers.forEach(gc => gc.classList.remove('active'));

      // Make selected active
      tab.classList.add('active');
      const gameId = tab.getAttribute('data-game');
      document.getElementById(`game-${gameId}`).classList.add('active');
      AudioSynth.playPop();
    });
  });
}

/* ==========================================
   Parental Controls Limit Simulator
   ========================================== */
function initParentalSimulator() {
  const slider = document.getElementById('dashTimeSlider');
  const limitDisplay = document.getElementById('limitDisplay');
  const lockScreen = document.getElementById('simAppLockScreen');
  const gateInput = document.getElementById('gateInput');
  const btnSubmit = document.getElementById('btnGateSubmit');

  if (!slider) return;

  slider.addEventListener('input', () => {
    const val = parseInt(slider.value);
    
    if (val === 0) {
      limitDisplay.textContent = 'Disabled (Lock!)';
      lockScreen.classList.add('locked');
      AudioSynth.playBoing();
    } else {
      limitDisplay.textContent = `${val} Minutes`;
      lockScreen.classList.remove('locked');
    }
  });

  btnSubmit.addEventListener('click', verifyGate);
  gateInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') verifyGate();
  });

  function verifyGate() {
    const ans = parseInt(gateInput.value);
    if (ans === 16) { // 9 + 7 = 16
      AudioSynth.playVictoryFanfare();
      lockScreen.classList.remove('locked');
      slider.value = 20; // reset
      limitDisplay.textContent = '20 Minutes';
      gateInput.value = '';
    } else {
      AudioSynth.playBoing();
      gateInput.value = '';
      gateInput.placeholder = 'Wrong!';
      setTimeout(() => {
        gateInput.placeholder = '?';
      }, 1000);
    }
  }
}

/* ==========================================
   Privacy, Terms & Legal Modals Manager
   ========================================== */
const policyTexts = {
  privacy: `
    <h1>Privacy Policy for Loci Kids</h1>
    <p><strong>Effective Date:</strong> June 1, 2026</p>
    
    <h2>Introduction</h2>
    <p>LociaX Software is committed to preserving the privacy of our website visitors and application users, specifically small kids. We comply fully with the Children's Online Privacy Protection Act (COPPA).</p>

    <h2>Children's Privacy Protection</h2>
    <ul>
      <li><strong>100% Ad-Free:</strong> No third-party advertisements or SDK tracking code is integrated.</li>
      <li><strong>Zero Personal Data Collection:</strong> We do not ask children to submit names, email addresses, phone numbers, or geological details.</li>
      <li><strong>No External Links:</strong> All support triggers or purchase pathways are secured behind parental math verification gates.</li>
    </ul>

    <h2>Information We Collect</h2>
    <p>We collect basic non-identifying diagnostics usage telemetry (app load cycles, game crashes) which are aggregate in nature to help patch software bugs.</p>

    <h2>Contact Information</h2>
    <p>Email: <a href="mailto:info@lociaxsoftware.com">info@lociaxsoftware.com</a></p>
  `,
  terms: `
    <h1>Terms and Conditions</h1>
    <p><strong>Effective Date:</strong> June 1, 2026</p>

    <h2>Agreement of Use</h2>
    <p>By downloading Loci Kids or browsing this landing page, you agree to these service terms. LociaX Software grants you a limited personal license to run Loci Kids on your compatible device for non-commercial education.</p>

    <h2>In-App Content ownership</h2>
    <p>All graphical characters (Leo, Azula, Daisy, Penny), code, audio sound bytes, layouts, and educational design methodologies are the absolute intellectual property of LociaX Software.</p>

    <h2>Warranties & Limitation of liability</h2>
    <p>Our games are delivered "as-is." While designed under strict child-health pedagogical standards, we make no representations regarding device compatibility or learning guarantees.</p>

    <h2>Governing Jurisdiction</h2>
    <p>These terms shall be governed under the laws of the jurisdiction of the corporate headquarters of LociaX Software.</p>
  `,
  accessibility: `
    <h1>Accessibility Statement</h1>
    <p>LociaX Software is dedicated to ensuring Loci Kids is accessible to everyone, including kids with diverse motor, sensory, or developmental capabilities.</p>

    <h2>Designed Inclusions</h2>
    <ul>
      <li><strong>High Contrast Visuals:</strong> All levels are designed with crisp borders and colors for kids with partial visual limitations.</li>
      <li><strong>Oversized Targets:</strong> All buttons and balloon components have expanded touch targets to decrease motor coordination frustration.</li>
      <li><strong>Full Speech Voiceovers:</strong>mascot bubbles and text directions are read aloud within the app to support pre-literate children.</li>
    </ul>

    <h2>Continuous Reviews</h2>
    <p>We regularly audit our layout structures. If you experience obstacles navigating this site or using the app, reach out to us at <a href="mailto:info@lociaxsoftware.com">info@lociaxsoftware.com</a>.</p>
  `
};

function initModals() {
  const overlay = document.getElementById('modalOverlay');
  const body = document.getElementById('modalBody');
  const closeBtn = document.getElementById('modalClose');

  const btnPrivacy = document.getElementById('btnShowPrivacy');
  const btnTerms = document.getElementById('btnShowTerms');
  const btnAccess = document.getElementById('btnShowAccess');

  if (!overlay || !body) return;

  function openModal(type) {
    body.innerHTML = policyTexts[type];
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // block scrolling
  }

  function closeModal() {
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto'; // restore scroll
  }

  btnPrivacy.addEventListener('click', () => openModal('privacy'));
  btnTerms.addEventListener('click', () => openModal('terms'));
  btnAccess.addEventListener('click', () => openModal('accessibility'));

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  // Handle escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeModal();
    }
  });
}
