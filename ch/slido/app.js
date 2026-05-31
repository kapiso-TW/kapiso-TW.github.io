/* ==========================================
   LIVE WORD CLOUD - APPLICATION SCRIPT
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // --- State & Config Variables ---
    let appState = {
        role: null,        // 'presenter' | 'audience' | null
        roomCode: '',
        words: {},         // { 'word': count }
        recentFeed: [],    // Array of strings (recent words)
        mySubmissions: [], // Array of strings (audience's submitted words)
        isPaused: false,
        theme: 'sunset',
        maxWords: 80,
        limitPerUser: 5,
        gravity: 0.03,
        repulsion: 1.2
    };

    // PeerJS Network connection variables
    let peer = null;
    let connections = []; // For presenter: list of active audience data connections
    let activeConnection = null; // For audience: active connection to presenter

    // Physics Engine State
    let physicsWords = []; // Array of word physical objects
    let physicsLoopId = null;
    let isDragging = false;
    let dragStart = { x: 0, y: 0 };
    let cloudOffset = { x: 0, y: 0 };

    // Autopilot (Simulation) state
    let autopilotInterval = null;
    const simVocabulary = [
        "Innovation", "Agile", "Synergy", "Scalable", "Design", "Aesthetics", 
        "Dynamic", "Cloud", "Interactive", "Slido", "Realtime", "Glassmorphism", 
        "Premium", "WebRTC", "Connection", "Engaging", "Audience", "Analytics", 
        "Feedback", "Visual", "Impact", "Growth", "Responsive", "Modern", "Creative",
        "Teamwork", "Future", "Velocity", "Design", "Aesthetics", "Dynamic"
    ];

    // --- DOM Elements ---
    const views = {
        landing: document.getElementById('landing-view'),
        presenter: document.getElementById('presenter-view'),
        audience: document.getElementById('audience-view')
    };

    // Landing View elements
    const btnCreateSession = document.getElementById('btn-create-session');
    const btnJoinSession = document.getElementById('btn-join-session');
    const joinCodeInput = document.getElementById('join-code-input');
    const landingError = document.getElementById('landing-error');

    // Presenter View elements
    const displayRoomCode = document.getElementById('display-room-code');
    const displayRoomCodeModal = document.getElementById('display-room-code-modal');
    const connectionsCount = document.querySelector('#connections-count span');
    const submissionsCount = document.querySelector('#submissions-count span');
    const btnTogglePause = document.getElementById('btn-toggle-pause');
    const pauseIcon = document.getElementById('pause-icon');
    const btnOpenSidebar = document.getElementById('btn-open-sidebar');
    const btnCloseSidebar = document.getElementById('btn-close-sidebar');
    const presenterSidebar = document.getElementById('presenter-sidebar');
    const cloudContainer = document.getElementById('cloud-container');
    const cloudCanvasTarget = document.getElementById('cloud-canvas-target');
    const tickerFeed = document.getElementById('ticker-feed');
    
    // Presenter Sidebar Setting elements
    const inputMaxWords = document.getElementById('input-max-words');
    const inputLimitPerUser = document.getElementById('input-limit-per-user');
    const rangeGravity = document.getElementById('range-gravity');
    const rangeRepulsion = document.getElementById('range-repulsion');
    const btnClearCloud = document.getElementById('btn-clear-cloud');
    const btnExportPng = document.getElementById('btn-export-png');
    const simInput = document.getElementById('sim-input');
    const btnSimSubmit = document.getElementById('btn-sim-submit');
    const btnSimAutopilot = document.getElementById('btn-sim-autopilot');
    const themeOptions = document.querySelectorAll('.theme-option');

    // Modal elements
    const btnToggleQrModal = document.getElementById('btn-toggle-qr-modal');
    const qrModal = document.getElementById('qr-modal');
    const btnCloseQrModal = document.getElementById('btn-close-qr-modal');
    const modalUrlInput = document.getElementById('modal-url-input');
    const btnCopyUrl = document.getElementById('btn-copy-url');

    // Audience View elements
    const audienceRoomCode = document.getElementById('audience-room-code');
    const audienceStatus = document.getElementById('audience-status');
    const wordInput = document.getElementById('word-input');
    const charCounter = document.getElementById('char-counter');
    const btnSubmitWord = document.getElementById('btn-submit-word');
    const submissionFeedback = document.getElementById('submission-feedback');
    const wordsRemainingText = document.getElementById('words-remaining-text');
    const limitBarFill = document.getElementById('limit-bar-fill');
    const myWordsList = document.getElementById('my-words-list');
    const btnLeaveAudience = document.getElementById('btn-leave-audience');
    const btnLeavePresenter = document.getElementById('btn-leave-presenter');

    // --- VIEW ROUTER ---
    function navigateTo(viewName) {
        Object.keys(views).forEach(name => {
            if (name === viewName) {
                views[name].classList.add('active');
            } else {
                views[name].classList.remove('active');
            }
        });
        
        // Handle side effects of navigating
        if (viewName === 'presenter') {
            appState.role = 'presenter';
            document.body.setAttribute('data-theme-active', appState.theme);
            startPhysics();
        } else if (viewName === 'audience') {
            appState.role = 'audience';
            document.body.setAttribute('data-theme-active', 'sunset'); // Audience always has a matching dark theme
            stopPhysics();
        } else {
            appState.role = null;
            stopPhysics();
            stopAutopilot();
            disconnectAll();
        }
    }

    // Check URL parameters for direct routing (e.g. scanning QR code)
    const urlParams = new URLSearchParams(window.location.search);
    const roomParam = urlParams.get('room');
    if (roomParam && roomParam.length === 6) {
        appState.roomCode = roomParam.toUpperCase();
        navigateTo('audience');
        joinSessionAsAudience(appState.roomCode);
    } else {
        navigateTo('landing');
    }

    // --- GENERATE ROOM CODES ---
    function generateRoomCode() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoid confusing chars (0, O, I, L)
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }

    // --- PEER-TO-PEER SYNCING (PeerJS) ---
    const PEER_PREFIX = 'livecloud-room-';

    function initPresenterSession() {
        appState.roomCode = generateRoomCode();
        let peerId = PEER_PREFIX + appState.roomCode;
        
        displayRoomCode.innerText = 'Creating room...';
        
        peer = new Peer(peerId, {
            debug: 1
        });

        peer.on('open', (id) => {
            console.log('Presenter peer opened with ID:', id);
            displayRoomCode.innerText = appState.roomCode;
            displayRoomCodeModal.innerText = appState.roomCode;
            
            // Build URL & QR Code
            const joinUrl = `${window.location.origin}${window.location.pathname}?room=${appState.roomCode}`;
            modalUrlInput.value = joinUrl;
            
            const qrContainer = document.getElementById('qr-code-container');
            qrContainer.innerHTML = '';
            new QRCode(qrContainer, {
                text: joinUrl,
                width: 180,
                height: 180,
                colorDark: "#0c0d14",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.M
            });

            // Load existing saved cloud data if available
            loadSavedData();
        });

        peer.on('connection', (conn) => {
            console.log('Audience member connected:', conn.peer);
            connections.push(conn);
            updateConnectionsUI();

            // Send current state (settings like word limit, session state) to the newly connected audience member
            conn.on('open', () => {
                conn.send({
                    type: 'init',
                    isPaused: appState.isPaused,
                    limitPerUser: appState.limitPerUser
                });
            });

            conn.on('data', (data) => {
                if (data.type === 'submit' && !appState.isPaused) {
                    addWord(data.word);
                    // Broadcast updated counts to all connections so they sync if necessary
                    broadcastToAudience({
                        type: 'word-ack',
                        word: data.word,
                        success: true
                    });
                }
            });

            conn.on('close', () => {
                connections = connections.filter(c => c.peer !== conn.peer);
                updateConnectionsUI();
            });

            conn.on('error', (err) => {
                console.error('Connection error:', err);
                connections = connections.filter(c => c.peer !== conn.peer);
                updateConnectionsUI();
            });
        });

        peer.on('error', (err) => {
            console.error('PeerJS presenter error:', err);
            if (err.type === 'unavailable-id') {
                // If collision happens, retry with a new code
                console.log('Room ID collison, retrying...');
                initPresenterSession();
            } else {
                displayRoomCode.innerText = 'Conn Error';
                alert('Connection service issue. You can still test in Offline Autopilot mode!');
            }
        });
    }

    function joinSessionAsAudience(roomCode) {
        audienceRoomCode.innerText = roomCode;
        updateAudienceStatus('connecting', 'Connecting...');
        
        let presenterPeerId = PEER_PREFIX + roomCode;
        
        // Generate random client ID to avoid conflicts
        peer = new Peer(null, {
            debug: 1
        });

        peer.on('open', (id) => {
            console.log('Audience peer opened with ID:', id);
            
            // Connect to Presenter
            activeConnection = peer.connect(presenterPeerId, {
                reliable: true
            });

            setupAudienceConnectionListeners(activeConnection);
        });

        peer.on('error', (err) => {
            console.error('Audience Peer open error:', err);
            updateAudienceStatus('disconnected', 'Service Offline');
        });
    }

    function setupAudienceConnectionListeners(conn) {
        conn.on('open', () => {
            console.log('Connected to Presenter Room:', appState.roomCode);
            updateAudienceStatus('connected', 'Connected');
            enableSubmissionForm(true);
            
            // Load my saved words for this room from local storage
            loadMySavedWords();
        });

        conn.on('data', (data) => {
            if (data.type === 'init') {
                appState.isPaused = data.isPaused;
                appState.limitPerUser = data.limitPerUser;
                updateAudienceSubmissionUI();
            } else if (data.type === 'state-change') {
                if (data.isPaused !== undefined) {
                    appState.isPaused = data.isPaused;
                    showFeedback(appState.isPaused ? 'Host paused submissions.' : 'Submissions resumed.', appState.isPaused ? 'error' : 'success');
                }
                if (data.limitPerUser !== undefined) {
                    appState.limitPerUser = data.limitPerUser;
                }
                updateAudienceSubmissionUI();
            } else if (data.type === 'word-ack') {
                // Submit acknowledgement
                console.log('Word successfully pushed to cloud:', data.word);
            }
        });

        conn.on('close', () => {
            console.log('Disconnected from host.');
            updateAudienceStatus('disconnected', 'Disconnected');
            enableSubmissionForm(false);
        });

        conn.on('error', (err) => {
            console.error('Connection error:', err);
            updateAudienceStatus('disconnected', 'Failed to Connect');
            enableSubmissionForm(false);
        });
    }

    function updateConnectionsUI() {
        connectionsCount.innerText = connections.length;
    }

    function updateAudienceStatus(state, label) {
        const dot = audienceStatus.querySelector('.status-dot');
        const text = audienceStatus.querySelector('.status-text');
        
        dot.className = 'status-dot';
        text.innerText = label;

        if (state === 'connected') {
            dot.classList.add('green');
        } else if (state === 'connecting') {
            dot.classList.add('yellow');
        } else {
            dot.classList.add('red');
        }
    }

    function broadcastToAudience(payload) {
        connections.forEach(conn => {
            if (conn.open) {
                conn.send(payload);
            }
        });
    }

    function disconnectAll() {
        if (activeConnection) {
            activeConnection.close();
            activeConnection = null;
        }
        connections.forEach(conn => conn.close());
        connections = [];
        if (peer) {
            peer.destroy();
            peer = null;
        }
        updateConnectionsUI();
    }

    // --- WORD MANAGEMENT & LOCAL STORAGE ---
    function addWord(word) {
        if (!word || word.trim() === '') return;
        
        // Clean word: trim, remove double spaces, and set capitalization
        const cleanWord = word.trim().replace(/\s+/g, ' ');
        if (cleanWord.length > 25) return;

        // Add to presenter state
        if (appState.words[cleanWord]) {
            appState.words[cleanWord]++;
        } else {
            appState.words[cleanWord] = 1;
        }

        // Add to recent feed
        appState.recentFeed.unshift(cleanWord);
        if (appState.recentFeed.length > 8) {
            appState.recentFeed.pop();
        }

        // Update UI
        updatePresenterStats();
        updateTicker();
        syncWordCloud();
        
        // Save to localStorage
        savePresenterData();
    }

    function updatePresenterStats() {
        let total = 0;
        Object.values(appState.words).forEach(v => total += v);
        submissionsCount.innerText = total;
    }

    function updateTicker() {
        if (appState.recentFeed.length === 0) {
            tickerFeed.innerHTML = '<span class="ticker-placeholder">Waiting for submissions...</span>';
            return;
        }

        tickerFeed.innerHTML = '';
        appState.recentFeed.forEach(word => {
            const item = document.createElement('span');
            item.className = 'ticker-item';
            item.innerText = word;
            tickerFeed.appendChild(item);
        });
    }

    function savePresenterData() {
        if (appState.roomCode) {
            localStorage.setItem(`livecloud_words_${appState.roomCode}`, JSON.stringify(appState.words));
            localStorage.setItem(`livecloud_feed_${appState.roomCode}`, JSON.stringify(appState.recentFeed));
        }
    }

    function loadSavedData() {
        if (appState.roomCode) {
            const savedWords = localStorage.getItem(`livecloud_words_${appState.roomCode}`);
            const savedFeed = localStorage.getItem(`livecloud_feed_${appState.roomCode}`);
            
            if (savedWords) {
                appState.words = JSON.parse(savedWords);
            } else {
                appState.words = {};
            }

            if (savedFeed) {
                appState.recentFeed = JSON.parse(savedFeed);
            } else {
                appState.recentFeed = [];
            }

            updatePresenterStats();
            updateTicker();
            syncWordCloud();
        }
    }

    // --- PHYSICS-BASED WORD CLOUD ENGINE ---
    // A 2D circular force layout model with bounding box repulsion
    
    function startPhysics() {
        if (physicsLoopId) return;
        
        function updatePhysics() {
            // Use getBoundingClientRect for pixel-perfect layout dimensions
            const { width: containerWidth, height: containerHeight } = getCloudDimensions();

            const centerX = containerWidth / 2 + cloudOffset.x;
            const centerY = containerHeight / 2 + cloudOffset.y;
            const time = Date.now();
            
            // 0. Ensure dimensions are measured (safeguard against initial 0-size overlay issues)
            physicsWords.forEach(word => {
                if (word.width <= 0 || word.height <= 0) {
                    word.width = word.element.offsetWidth || (word.text.length * parseFloat(word.element.style.fontSize) * 0.6);
                    word.height = word.element.offsetHeight || (parseFloat(word.element.style.fontSize) * 1.3);
                }
            });

            // 1. Center gravity pull, floating drift & boundaries
            physicsWords.forEach(word => {
                const dx = centerX - word.x;
                const dy = centerY - word.y;
                const dist = Math.hypot(dx, dy);
                
                // Pull force proportional to distance (clamped to prevent crushing)
                if (dist > 1) {
                    const pullX = (dx / dist) * Math.min(dist * appState.gravity, 2.5);
                    const pullY = (dy / dist) * Math.min(dist * appState.gravity, 2.5);
                    word.vx += pullX;
                    word.vy += pullY;
                }

                // Gentle floating wave drift (unique to each word via string hash)
                let phase = word.phaseOffset;
                if (phase === undefined) {
                    phase = 0;
                    for (let i = 0; i < word.text.length; i++) {
                        phase += word.text.charCodeAt(i);
                    }
                    word.phaseOffset = phase;
                }
                const floatSpeed = 0.0015;
                const floatScale = 0.12;
                word.vx += Math.sin(time * floatSpeed + phase) * floatScale;
                word.vy += Math.cos(time * floatSpeed * 0.85 + phase) * floatScale;

                // Drag inertia decay
                word.vx *= 0.85;
                word.vy *= 0.85;
            });

            // 2. Pairwise bounding box collision repulsion
            const padding = 15;
            for (let i = 0; i < physicsWords.length; i++) {
                const wordA = physicsWords[i];
                for (let j = i + 1; j < physicsWords.length; j++) {
                    const wordB = physicsWords[j];

                    // Elliptical bounding collision approximation
                    const rx = (wordA.width + wordB.width) / 2 + padding;
                    const ry = (wordA.height + wordB.height) / 2 + padding;
                    const dx = wordB.x - wordA.x;
                    const dy = wordB.y - wordA.y;

                    // Standard circle packing overlap scale
                    // Using normalized distances based on rectangular bounds
                    const nx = dx / rx;
                    const ny = dy / ry;
                    const distNormalized = Math.hypot(nx, ny);

                    if (distNormalized < 1 && distNormalized > 0.01) {
                        const overlap = 1 - distNormalized;
                        
                        // Push vector directions (increased coefficient for stronger repulsion)
                        const pushX = (nx / distNormalized) * overlap * rx * appState.repulsion * 0.45;
                        const pushY = (ny / distNormalized) * overlap * ry * appState.repulsion * 0.45;

                        wordA.vx -= pushX;
                        wordA.vy -= pushY;
                        wordB.vx += pushX;
                        wordB.vy += pushY;
                    }
                }
            }

            // 3. Apply position updates & render
            physicsWords.forEach(word => {
                word.x += word.vx;
                word.y += word.vy;

                // Border limits
                const borderX = containerWidth - word.width/2 - 20;
                const borderY = containerHeight - word.height/2 - 20;
                
                if (word.x < word.width/2 + 20) { word.x = word.width/2 + 20; word.vx = 0; }
                if (word.x > borderX) { word.x = borderX; word.vx = 0; }
                if (word.y < word.height/2 + 20) { word.y = word.height/2 + 20; word.vy = 0; }
                if (word.y > borderY) { word.y = borderY; word.vy = 0; }

                // DOM positioning (offset by half-width/height to center the element)
                word.element.style.transform = `translate(${word.x - word.width/2}px, ${word.y - word.height/2}px)`;
            });

            physicsLoopId = requestAnimationFrame(updatePhysics);
        }

        physicsLoopId = requestAnimationFrame(updatePhysics);
    }

    function stopPhysics() {
        if (physicsLoopId) {
            cancelAnimationFrame(physicsLoopId);
            physicsLoopId = null;
        }
    }

    let canvasContext = null;
    function measureTextSize(text, fontSize) {
        if (!canvasContext) {
            const canvas = document.createElement('canvas');
            canvasContext = canvas.getContext('2d');
        }
        canvasContext.font = `bold ${fontSize}px 'Outfit', 'Inter', sans-serif`;
        const metrics = canvasContext.measureText(text);
        return {
            width: metrics.width + 24, // add horizontal padding
            height: fontSize * 1.25 + 8 // estimate height
        };
    }

    function getCloudDimensions() {
        // Use getBoundingClientRect for pixel-perfect dimensions
        // This is immune to flex layout timing and transition issues
        const rect = cloudCanvasTarget.getBoundingClientRect();
        const w = rect.width  || cloudContainer.offsetWidth  || window.innerWidth;
        const h = rect.height || cloudContainer.offsetHeight || (window.innerHeight - 120);
        return { width: w, height: h };
    }

    function syncWordCloud() {
        const { width: containerWidth, height: containerHeight } = getCloudDimensions();
        const centerX = containerWidth / 2;
        const centerY = containerHeight / 2;

        // Convert word counts into sorted list
        const wordList = Object.entries(appState.words)
            .map(([text, count]) => ({ text, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, appState.maxWords); // Cap at max words

        if (wordList.length === 0) {
            cloudCanvasTarget.innerHTML = '<span class="ticker-placeholder" style="font-size: 1.25rem;">Word cloud will appear here</span>';
            physicsWords = [];
            return;
        }

        // Remove placeholder if it was there
        if (cloudCanvasTarget.querySelector('.ticker-placeholder')) {
            cloudCanvasTarget.innerHTML = '';
        }

        const counts = wordList.map(w => w.count);
        const maxCount = Math.max(...counts);
        const minCount = Math.min(...counts);

        // Find existing elements, create new ones, remove obsolete ones
        const currentPhysicsWords = [];

        wordList.forEach((wordData) => {
            let existing = physicsWords.find(pw => pw.text === wordData.text);
            
            // Calculate size rank (1 to 5)
            // If all counts are equal, everyone gets rank 3
            let rank = 3;
            if (maxCount !== minCount) {
                const normalized = (wordData.count - minCount) / (maxCount - minCount);
                rank = 5 - Math.round(normalized * 4); // Maps 1.0 -> 1, 0.0 -> 5
            } else {
                rank = wordData.count > 1 ? 2 : 4;
            }

            // Font sizing curves (logarithmic or linear depending on counts)
            let fontSize = 16;
            if (maxCount > 1) {
                const t = (wordData.count - 1) / (maxCount - 1);
                fontSize = 16 + Math.pow(t, 0.7) * 64; // Scale 16px to 80px
            }

            if (existing) {
                // Update size and rank
                existing.element.setAttribute('data-rank', rank);
                
                // If font size changes, update font size and measured bounds
                if (parseFloat(existing.element.style.fontSize) !== fontSize) {
                    existing.element.style.fontSize = fontSize + 'px';
                    const measured = measureTextSize(wordData.text, fontSize);
                    existing.width = measured.width;
                    existing.height = measured.height;
                    
                    // Trigger scale-pop animation on count increase
                    existing.element.style.animation = 'none';
                    existing.element.offsetHeight; // trigger reflow
                    existing.element.style.animation = 'tagPop 0.3s cubic-bezier(0.2, 0.8, 0.2, 1.3)';
                }
                
                currentPhysicsWords.push(existing);
            } else {
                // Create new DOM element
                const el = document.createElement('div');
                el.className = 'cloud-word';
                el.innerText = wordData.text;
                el.setAttribute('data-rank', rank);
                el.style.fontSize = fontSize + 'px';
                
                // Set click action to bump count (fun feature)
                el.addEventListener('click', () => {
                    addWord(wordData.text);
                });

                cloudCanvasTarget.appendChild(el);

                // Spawn near center with small random offset
                const initialOffset = 40;
                const measured = measureTextSize(wordData.text, fontSize);
                const spawnX = centerX + (Math.random() - 0.5) * initialOffset;
                const spawnY = centerY + (Math.random() - 0.5) * initialOffset;

                const newPhysWord = {
                    text: wordData.text,
                    x: spawnX,
                    y: spawnY,
                    vx: (Math.random() - 0.5) * 5,
                    vy: (Math.random() - 0.5) * 5,
                    width: measured.width,
                    height: measured.height,
                    element: el
                };

                // Immediately set transform so word appears at center from frame 0
                // (before physics loop fires its first rAF)
                el.style.transform = `translate(${spawnX - measured.width / 2}px, ${spawnY - measured.height / 2}px)`;
                
                currentPhysicsWords.push(newPhysWord);
            }
        });

        // Remove elements that are no longer in active list
        physicsWords.forEach(pw => {
            if (!currentPhysicsWords.find(cpw => cpw.text === pw.text)) {
                pw.element.remove();
            }
        });

        physicsWords = currentPhysicsWords;
    }

    // Drag-to-pan cloud offset
    let startDragOffset = { x: 0, y: 0 };
    cloudContainer.addEventListener('mousedown', (e) => {
        isDragging = true;
        dragStart.x = e.clientX;
        dragStart.y = e.clientY;
        startDragOffset.x = cloudOffset.x;
        startDragOffset.y = cloudOffset.y;
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - dragStart.x;
        const dy = e.clientY - dragStart.y;
        cloudOffset.x = startDragOffset.x + dx;
        cloudOffset.y = startDragOffset.y + dy;
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Touch support for cloud drag
    cloudContainer.addEventListener('touchstart', (e) => {
        if (e.touches.length !== 1) return;
        isDragging = true;
        dragStart.x = e.touches[0].clientX;
        dragStart.y = e.touches[0].clientY;
        startDragOffset.x = cloudOffset.x;
        startDragOffset.y = cloudOffset.y;
    });

    window.addEventListener('touchmove', (e) => {
        if (!isDragging || e.touches.length !== 1) return;
        const dx = e.touches[0].clientX - dragStart.x;
        const dy = e.touches[0].clientY - dragStart.y;
        cloudOffset.x = startDragOffset.x + dx;
        cloudOffset.y = startDragOffset.y + dy;
    });

    window.addEventListener('touchend', () => {
        isDragging = false;
    });

    // Adjust cloud target dimensions on resize
    window.addEventListener('resize', () => {
        if (appState.role === 'presenter') {
            syncWordCloud();
        }
    });

    // --- LANDING CONTROLS ---
    btnCreateSession.addEventListener('click', () => {
        navigateTo('presenter');
        initPresenterSession();
    });

    btnJoinSession.addEventListener('click', () => {
        const code = joinCodeInput.value.trim().toUpperCase();
        if (code.length !== 6) {
            showLandingError('Code must be exactly 6 characters.');
            return;
        }

        landingError.style.display = 'none';
        appState.roomCode = code;
        
        // Push room param to address bar for easy sharing
        const newUrl = `${window.location.origin}${window.location.pathname}?room=${code}`;
        window.history.pushState({ path: newUrl }, '', newUrl);
        
        navigateTo('audience');
        joinSessionAsAudience(code);
    });

    joinCodeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            btnJoinSession.click();
        }
    });

    function showLandingError(msg) {
        landingError.innerText = msg;
        landingError.style.display = 'block';
    }

    // --- PRESENTER SIDEBAR SETTINGS & BUTTONS ---
    btnOpenSidebar.addEventListener('click', () => {
        presenterSidebar.classList.add('open');
    });

    btnCloseSidebar.addEventListener('click', () => {
        presenterSidebar.classList.remove('open');
    });

    inputMaxWords.addEventListener('change', () => {
        let val = parseInt(inputMaxWords.value);
        if (val < 10) val = 10;
        if (val > 200) val = 200;
        inputMaxWords.value = val;
        appState.maxWords = val;
        syncWordCloud();
    });

    inputLimitPerUser.addEventListener('change', () => {
        let val = parseInt(inputLimitPerUser.value);
        if (val < 1) val = 1;
        if (val > 20) val = 20;
        inputLimitPerUser.value = val;
        appState.limitPerUser = val;
        
        // Broadcast new user limit to clients
        broadcastToAudience({
            type: 'state-change',
            limitPerUser: val
        });
    });

    rangeGravity.addEventListener('input', () => {
        appState.gravity = parseFloat(rangeGravity.value);
    });

    rangeRepulsion.addEventListener('input', () => {
        appState.repulsion = parseFloat(rangeRepulsion.value);
    });

    // Theme selector click
    themeOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            themeOptions.forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
            
            const selectedTheme = opt.getAttribute('data-theme');
            appState.theme = selectedTheme;
            document.body.setAttribute('data-theme-active', selectedTheme);
        });
    });

    // Pause/Resume toggles
    btnTogglePause.addEventListener('click', () => {
        appState.isPaused = !appState.isPaused;
        
        if (appState.isPaused) {
            btnTogglePause.classList.add('danger-btn');
            pauseIcon.setAttribute('data-lucide', 'play');
            btnTogglePause.setAttribute('data-tooltip', 'Resume Submissions');
        } else {
            btnTogglePause.classList.remove('danger-btn');
            pauseIcon.setAttribute('data-lucide', 'pause');
            btnTogglePause.setAttribute('data-tooltip', 'Pause Submissions');
        }
        lucide.createIcons();

        // Broadcast state change to clients
        broadcastToAudience({
            type: 'state-change',
            isPaused: appState.isPaused
        });
    });

    btnClearCloud.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear the entire word cloud? This cannot be undone.')) {
            appState.words = {};
            appState.recentFeed = [];
            
            updatePresenterStats();
            updateTicker();
            syncWordCloud();
            savePresenterData();
        }
    });

    // Capture Cloud PNG
    btnExportPng.addEventListener('click', () => {
        btnExportPng.disabled = true;
        btnExportPng.innerHTML = '<i data-lucide="loader" class="animate-spin"></i> Capturing...';
        lucide.createIcons();

        // Temp hide settings icon, borders, etc to take clean image if necessary
        // In our case, target is cloud-canvas-target which only has the words
        html2canvas(cloudCanvasTarget, {
            backgroundColor: null,
            scale: 2, // Double quality
            useCORS: true,
            logging: false
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = `livecloud-${appState.roomCode}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();

            btnExportPng.disabled = false;
            btnExportPng.innerHTML = '<i data-lucide="download"></i> Download Cloud Image';
            lucide.createIcons();
        }).catch(err => {
            console.error(err);
            alert('Screenshot failed. Try again.');
            btnExportPng.disabled = false;
            btnExportPng.innerHTML = '<i data-lucide="download"></i> Download Cloud Image';
            lucide.createIcons();
        });
    });

    // Simulation / Local submissions
    btnSimSubmit.addEventListener('click', () => {
        const val = simInput.value.trim();
        if (val) {
            addWord(val);
            simInput.value = '';
        }
    });

    simInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            btnSimSubmit.click();
        }
    });

    btnSimAutopilot.addEventListener('click', () => {
        if (autopilotInterval) {
            stopAutopilot();
        } else {
            startAutopilot();
        }
    });

    function startAutopilot() {
        btnSimAutopilot.innerHTML = '<i data-lucide="square"></i> Stop Autopilot';
        btnSimAutopilot.classList.add('danger-btn');
        lucide.createIcons();

        autopilotInterval = setInterval(() => {
            const randomWord = simVocabulary[Math.floor(Math.random() * simVocabulary.length)];
            addWord(randomWord);
        }, 1200);
    }

    function stopAutopilot() {
        if (autopilotInterval) {
            clearInterval(autopilotInterval);
            autopilotInterval = null;
        }
        btnSimAutopilot.innerHTML = '<i data-lucide="play"></i> Start Autopilot Test';
        btnSimAutopilot.classList.remove('danger-btn');
        lucide.createIcons();
    }

    // Leave presenter view
    btnLeavePresenter.addEventListener('click', () => {
        if (confirm('Leave session? Your word cloud state will be saved locally.')) {
            // Clean URL query
            window.history.pushState({}, '', window.location.pathname);
            navigateTo('landing');
        }
    });

    // --- QR CODE MODAL ---
    btnToggleQrModal.addEventListener('click', () => {
        qrModal.classList.add('active');
    });

    btnCloseQrModal.addEventListener('click', () => {
        qrModal.classList.remove('active');
    });

    // Close modal on background click
    qrModal.addEventListener('click', (e) => {
        if (e.target === qrModal) {
            qrModal.classList.remove('active');
        }
    });

    btnCopyUrl.addEventListener('click', () => {
        modalUrlInput.select();
        document.execCommand('copy');
        
        btnCopyUrl.innerHTML = '<i data-lucide="check"></i>';
        lucide.createIcons();
        setTimeout(() => {
            btnCopyUrl.innerHTML = '<i data-lucide="copy"></i>';
            lucide.createIcons();
        }, 1500);
    });

    // --- AUDIENCE CONTROLS & SUBMISSION ---
    wordInput.addEventListener('input', () => {
        const val = wordInput.value;
        charCounter.innerText = `${val.length}/25`;
        
        // Validation check
        const isClean = val.trim().length > 0;
        const reachedLimit = appState.mySubmissions.length >= appState.limitPerUser;
        
        btnSubmitWord.disabled = !isClean || reachedLimit || appState.isPaused;
    });

    btnSubmitWord.addEventListener('click', () => {
        const word = wordInput.value.trim();
        if (!word) return;

        if (appState.mySubmissions.length >= appState.limitPerUser) {
            showFeedback('Submission limit reached.', 'error');
            return;
        }

        if (appState.isPaused) {
            showFeedback('Host has paused submissions.', 'error');
            return;
        }

        // Send to presenter via WebRTC
        if (activeConnection && activeConnection.open) {
            activeConnection.send({
                type: 'submit',
                word: word
            });
            
            // Record locally
            appState.mySubmissions.push(word);
            saveMyWords();
            updateAudienceSubmissionUI();
            addWordToLocalHistory(word);
            
            wordInput.value = '';
            charCounter.innerText = '0/25';
            btnSubmitWord.disabled = true;

            showFeedback('Word sent to cloud!', 'success');
        } else {
            showFeedback('Not connected to host. Reconnecting...', 'error');
        }
    });

    wordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !btnSubmitWord.disabled) {
            btnSubmitWord.click();
        }
    });

    function updateAudienceSubmissionUI() {
        const myCount = appState.mySubmissions.length;
        wordsRemainingText.innerText = `Submissions: ${myCount} / ${appState.limitPerUser}`;
        
        // Update limits bar fill
        const pct = Math.min((myCount / appState.limitPerUser) * 100, 100);
        limitBarFill.style.width = `${pct}%`;

        // Check if form should be blocked
        const val = wordInput.value;
        const reachedLimit = myCount >= appState.limitPerUser;
        
        wordInput.disabled = reachedLimit || appState.isPaused;
        btnSubmitWord.disabled = !val.trim().length || reachedLimit || appState.isPaused;
    }

    function showFeedback(msg, type) {
        submissionFeedback.innerText = msg;
        submissionFeedback.className = `feedback-message ${type}`;
        submissionFeedback.style.display = 'block';

        setTimeout(() => {
            submissionFeedback.style.display = 'none';
        }, 3000);
    }

    function addWordToLocalHistory(word) {
        // Remove empty state placeholder
        const placeholder = myWordsList.querySelector('.empty-list-placeholder');
        if (placeholder) {
            placeholder.remove();
        }

        const tag = document.createElement('li');
        tag.className = 'my-word-tag';
        tag.innerText = word;
        myWordsList.appendChild(tag);
    }

    function saveMyWords() {
        localStorage.setItem(`livecloud_my_words_${appState.roomCode}`, JSON.stringify(appState.mySubmissions));
    }

    function loadMySavedWords() {
        const saved = localStorage.getItem(`livecloud_my_words_${appState.roomCode}`);
        myWordsList.innerHTML = '';
        
        if (saved) {
            appState.mySubmissions = JSON.parse(saved);
            appState.mySubmissions.forEach(w => addWordToLocalHistory(w));
        } else {
            appState.mySubmissions = [];
            myWordsList.innerHTML = '<li class="empty-list-placeholder">No words submitted yet.</li>';
        }
        
        updateAudienceSubmissionUI();
    }

    function enableSubmissionForm(enabled) {
        wordInput.disabled = !enabled;
        if (!enabled) {
            btnSubmitWord.disabled = true;
        }
    }

    btnLeaveAudience.addEventListener('click', () => {
        if (confirm('Leave room?')) {
            window.history.pushState({}, '', window.location.pathname);
            navigateTo('landing');
        }
    });

});
