// Global variables
let noClickCount = 0;
let selectedRating = 0;

// Music Player Variables
let currentSongIndex = 0;
let isPlaying = false;
let isShuffled = false;
let playlistStartTime = null;
let tasteMessageShown = false;
let audio = null;

// Playlist with your favorite artists (in your preferred order)
const playlist = [
    {
        name: "Baarishein",
        artist: "Anuv Jain",
        url: "./music/Baarishein.m4a",
        message: "Like gentle rain, may your birthday feel fresh and cozy 🌧️",
        emoji: "🌧️"
    },
    {
        name: "Jo Tum Mere Ho",
        artist: "Anuv Jain",
        url: "./music/Jo-Tum-Mere-Ho.m4a",
        message: "A comfort track for your special day 💕",
        emoji: "💕"
    },
    {
        name: "Faasle",
        artist: "Anuv Jain",
        url: "./music/Faasle.m4a",
        message: "No distance can stop good wishes from reaching you today 💫",
        emoji: "💞"
    },
    {
        name: "Na Pata Mujhe",
        artist: "Anuv Jain",
        url: "./music/Na-Pata-Mujhe.m4a",
        message: "Some days are just felt — may this one feel beautiful 🌈",
        emoji: "🌈"
    },
    {
        name: "Husn",
        artist: "Anuv Jain",
        url: "./music/Husn.m4a",
        message: "Here’s a song to add a smile to your day 💖",
        emoji: "💖"
    },
    {
        name: "Haseen",
        artist: "Anuv Jain",
        url: "./music/Haseen.m4a",
        message: "Birthday glow looks great on you 🌹",
        emoji: "🌹"
    },
    {
        name: "Aaoge Tum Kabhi",
        artist: "The Local Train",
        url: "./music/Aaoge-Tum-Kabhi.m4a",
        message: "Hope today brings the people and moments you love 🌟",
        emoji: "🌟"
    },
    {
        name: "Sahiba",
        artist: "Anuv Jain",
        url: "./music/Sahiba.m4a",
        message: "Royal birthday vibes only 👑",
        emoji: "👑"
    },
    {
        name: "Finding Her",
        artist: "Anuv Jain",
        url: "./music/Finding-Her.m4a",
        message: "May this year help you find more of what makes you happy 🔍",
        emoji: "🔍"
    },
    {
        name: "Samjho Na",
        artist: "Anuv Jain",
        url: "./music/Samjho%20Na.m4a",
        message: "Hope this one makes you hum along today 🎶",
        emoji: "🎶"
    },
    {
        name: "Pal Pal",
        artist: "Anuv Jain",
        url: "./music/Pal-Pal.m4a",
        message: "Enjoy every moment of your birthday ⏳",
        emoji: "⏳"
    }
];

// Utility functions
function hideAllScreens() {
    const screens = document.querySelectorAll('.container');
    screens.forEach(screen => {
        screen.style.display = 'none';
    });
}

function showScreen(screenId) {
    hideAllScreens();
    const screen = document.getElementById(screenId);
    if (screen) {
        screen.style.display = 'flex';
        screen.style.opacity = '0';
        setTimeout(() => {
            screen.style.opacity = '1';
        }, 50);
    }
}

// Music Player Functions
function initMusicPlayer() {
    audio = document.getElementById('audio-player');
    populatePlaylist();
    setupAudioListeners();
    // showMusicPlayerMessage(); // Disabled
}

function showMusicPlayerMessage() {
    // Message disabled - no longer showing curated message
    return;
}

function populatePlaylist() {
    const songList = document.getElementById('song-list');
    songList.innerHTML = '';
    
    playlist.forEach((song, index) => {
        const songItem = document.createElement('div');
        songItem.className = `song-item ${index === currentSongIndex ? 'active' : ''}`;
        songItem.innerHTML = `
            <span class="song-item-name">${song.name}</span>
            <span class="song-item-artist">${song.artist}</span>
        `;
        songItem.onclick = () => playSong(index);
        songList.appendChild(songItem);
    });
}

function setupAudioListeners() {
    // Remove any existing listeners to prevent duplicates
    audio.removeEventListener('timeupdate', updateProgress);
    audio.removeEventListener('ended', nextSong);
    
    // Add fresh listeners
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', () => {
        document.getElementById('duration').textContent = formatTime(audio.duration);
    });
    audio.addEventListener('ended', nextSong);
    
    // Buffer optimization listeners
    audio.addEventListener('canplay', () => {
        // Audio is ready to play without buffering
        hideLoadingState();
    });
    
    audio.addEventListener('waiting', () => {
        // Audio is buffering
        showLoadingState();
    });
    
    audio.addEventListener('canplaythrough', () => {
        // Enough data loaded to play through without interruption
        hideLoadingState();
    });
    
    audio.addEventListener('error', (e) => {
        console.log('Audio error:', e);
        hideLoadingState();
        // Reset button state on error
        document.getElementById('play-pause').textContent = '▶';
        isPlaying = false;
    });
}

function togglePlayer() {
    const player = document.getElementById('music-player');
    const toggle = document.querySelector('.player-toggle');
    player.classList.toggle('minimized');
    toggle.textContent = player.classList.contains('minimized') ? '+' : '−';
}

function togglePlay() {
    const playBtn = document.getElementById('play-pause');
    const visualizer = document.getElementById('audio-visualizer');
    
    console.log('togglePlay called');
    console.log('isPlaying:', isPlaying);
    console.log('audio.src:', audio.src);
    console.log('audio.readyState:', audio.readyState);
    console.log('audio.paused:', audio.paused);
    
    if (isPlaying && !audio.paused) {
        audio.pause();
        playBtn.textContent = '▶';
        isPlaying = false;
        if (visualizer) visualizer.classList.remove('playing');
        console.log('Paused audio');
    } else {
        // If no song loaded, load first song
        if (!audio.src || audio.src === window.location.href) {
            console.log('No audio source, loading first song');
            loadSong(0);
            // Wait a bit then try to play
            setTimeout(() => togglePlay(), 1000);
            return;
        }
        
        console.log('Attempting to play audio...');
        
        // Force reload if needed
        if (audio.readyState === 0) {
            console.log('Audio not loaded, reloading...');
            audio.load();
        }
        
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                playBtn.textContent = '⏸';
                isPlaying = true;
                if (visualizer) visualizer.classList.add('playing');
                console.log('Successfully started playing audio');
                
                // Disabled automatic taste message
                // if (!tasteMessageShown && !playlistStartTime) {
                //     playlistStartTime = Date.now();
                //     setTimeout(showTasteMessage, 4000);
                // }
            }).catch(e => {
                console.error('Play failed:', e.name, ':', e.message);
                console.error('Audio currentSrc:', audio.currentSrc);
                console.error('Audio networkState:', audio.networkState);
                playBtn.textContent = '▶';
                isPlaying = false;
            });
        }
    }
}

function loadSong(index) {
    if (index >= 0 && index < playlist.length) {
        currentSongIndex = index;
        const song = playlist[index];
        
        console.log('Loading song:', song.name, 'URL:', song.url);
        
        // Update UI immediately
        document.getElementById('current-song-name').textContent = song.name;
        document.getElementById('current-artist-name').textContent = song.artist;
        document.getElementById('album-art').textContent = song.emoji;
        
        // Update playlist display
        populatePlaylist();
        
        // Load audio
        try {
            audio.src = song.url;
            audio.load();
            console.log('Audio source set to:', audio.src);
        } catch (e) {
            console.error('Error setting audio source:', e);
        }
        
        // Show song message
        setTimeout(() => {
            showSongMessage(song.message);
        }, 500);
        
        // Reset play button to play state
        document.getElementById('play-pause').textContent = '▶';
        isPlaying = false;
        
        hideLoadingState();
    }
}

function playSong(index) {
    loadSong(index);
    // Don't auto-play - let user click play button
}

function previousSong() {
    let newIndex = currentSongIndex - 1;
    if (newIndex < 0) newIndex = playlist.length - 1;
    playSong(newIndex);
}

function nextSong() {
    let newIndex;
    if (isShuffled) {
        newIndex = Math.floor(Math.random() * playlist.length);
    } else {
        newIndex = (currentSongIndex + 1) % playlist.length;
    }
    playSong(newIndex);
}

function toggleShuffle() {
    isShuffled = !isShuffled;
    const shuffleBtn = document.getElementById('shuffle-btn');
    shuffleBtn.classList.toggle('active', isShuffled);
}

function setVolume(value) {
    if (audio) {
        audio.volume = value / 100;
    }
}

function setProgress(event) {
    const progressBar = event.currentTarget;
    const clickX = event.offsetX;
    const width = progressBar.offsetWidth;
    const duration = audio.duration;
    
    if (duration) {
        const newTime = (clickX / width) * duration;
        audio.currentTime = newTime;
    }
}

function updateProgress() {
    if (audio.duration) {
        const progress = (audio.currentTime / audio.duration) * 100;
        document.getElementById('progress').style.width = progress + '%';
        document.getElementById('current-time').textContent = formatTime(audio.currentTime);
    }
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

function showSongMessage(message) {
    const messageContainer = document.getElementById('song-message-container');
    const messageText = document.getElementById('song-message-text');
    
    // Add shimmer animation
    messageContainer.classList.add('animate');
    
    // Update message with fade effect
    messageText.style.opacity = '0';
    setTimeout(() => {
        messageText.textContent = message;
        messageText.style.opacity = '1';
    }, 150);
    
    // Remove shimmer after animation
    setTimeout(() => {
        messageContainer.classList.remove('animate');
    }, 800);
}

function closeSongMessage() {
    const popup = document.getElementById('song-message-popup');
    popup.classList.remove('show');
}

function showTasteMessage() {
    if (!tasteMessageShown) {
        const tasteMsg = document.getElementById('taste-message');
        tasteMsg.classList.add('show');
        tasteMessageShown = true;
        
        // Auto close after 8 seconds
        setTimeout(() => {
            tasteMsg.classList.remove('show');
        }, 8000);
    }
}

function closeTasteMessage() {
    const tasteMsg = document.getElementById('taste-message');
    tasteMsg.classList.remove('show');
}

// Audio optimization functions
function showLoadingState() {
    const albumArt = document.getElementById('album-art');
    albumArt.style.opacity = '0.6';
    albumArt.style.transform = 'scale(0.95)';
}

function hideLoadingState() {
    const albumArt = document.getElementById('album-art');
    albumArt.style.opacity = '1';
    albumArt.style.transform = 'scale(1)';
}

function preloadNextSong() {
    const nextIndex = (currentSongIndex + 1) % playlist.length;
    if (nextIndex !== currentSongIndex && playlist[nextIndex]) {
        // Create a temporary audio element to preload
        const preloadAudio = new Audio();
        preloadAudio.preload = 'auto';
        preloadAudio.src = playlist[nextIndex].url;
        preloadAudio.load();
        
        // Clean up after preloading
        setTimeout(() => {
            preloadAudio.src = '';
        }, 30000);
    }
}

// Landing page functions
function goToReasons() {
    // Keep user on landing page and open the music player
    showScreen('landing-page');
    const player = document.getElementById('music-player');
    if (player && player.classList.contains('minimized')) {
        player.classList.remove('minimized');
        const toggle = document.querySelector('.player-toggle');
        if (toggle) toggle.textContent = '−';
    }

    // Start music playback since this is a user interaction!
    setTimeout(() => {
        if (playlist.length > 0 && audio) {
            console.log('Starting music from button click - bypassing autoplay restrictions');
            // Load first song if not already loaded
            if (!audio.src || currentSongIndex < 0) {
                loadSong(0);
            }
            // Wait a moment for song to load, then play
            setTimeout(() => {
                const playBtn = document.getElementById('play-pause');
                const visualizer = document.getElementById('audio-visualizer');
                audio.play().then(() => {
                    playBtn.textContent = '⏸';
                    isPlaying = true;
                    if (visualizer) visualizer.classList.add('playing');
                }).catch(e => {
                    console.log('Music start failed:', e);
                    // Player remains available
                });
            }, 800);
        }
    }, 200);
}

function goToLoveToo() {
    showScreen('reason-1');
    setTimeout(() => {
        if (playlist.length > 0 && audio) {
            // Load first song if not already loaded
            if (!audio.src || currentSongIndex < 0) {
                loadSong(0);
            }
            // Wait a moment for song to load, then play
            setTimeout(() => {
                const playBtn = document.getElementById('play-pause');
                const visualizer = document.getElementById('audio-visualizer');
                audio.play().then(() => {
                    playBtn.textContent = '⏸';
                    isPlaying = true;
                    if (visualizer) visualizer.classList.add('playing');
                }).catch(() => {
                    // Ignore if it fails; player remains available
                });
            }, 800);
        }
    }, 200);
}

function goBackToLanding() {
    showScreen('landing-page');
}

// Reasons navigation
function showReason(reasonNumber) {
    showScreen(`reason-${reasonNumber}`);
}

function showNextChoice() {
    showScreen('next-choice');
}

// Love too path functions
function showMeetingQuestion() {
    showScreen('meeting-question');
}

function showThankYou() {
    showScreen('thank-you');
}

function showNoMeetResponse() {
    showScreen('no-meet-response');
}

// Choice functions
function showAcceptConfirm() {
    showScreen('accept-confirm');
}

function showReasonsNot(reasonNumber) {
    showScreen(`reason-not-${reasonNumber}`);
}

function showFinalChoice() {
    showScreen('final-choice');
}

// Moving "No" button functionality
function moveNoButton() {
    const button = document.getElementById('moving-no');
    const container = button.parentElement;
    
    noClickCount++;
    
    if (noClickCount < 3) {
        // Move to random position
        const containerRect = container.getBoundingClientRect();
        const buttonRect = button.getBoundingClientRect();
        
        const maxX = containerRect.width - buttonRect.width - 40;
        const maxY = containerRect.height - buttonRect.height - 40;
        
        const randomX = Math.random() * maxX;
        const randomY = Math.random() * maxY;
        
        button.style.position = 'absolute';
        button.style.left = randomX + 'px';
        button.style.top = randomY + 'px';
        
        // Add a little shake animation
        button.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            button.style.animation = '';
        }, 500);
        
        // Change button text based on click count
        if (noClickCount === 1) {
            button.textContent = 'No way! 😅';
        } else if (noClickCount === 2) {
            button.textContent = 'Still no! 😏';
        }
    } else {
        // After 3rd click, go to confession
        showConfession();
    }
}

// Add shake animation
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// Confession and rating functions
function showConfession() {
    showScreen('confession');
    setupStarRating();
}

function setupStarRating() {
    const stars = document.querySelectorAll('.star');
    const ratingDisplay = document.getElementById('rating-display');
    
    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            selectedRating = index + 1;
            
            // Update star display
            stars.forEach((s, i) => {
                if (i < selectedRating) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
            
            // Update rating display
            ratingDisplay.textContent = `You rated: ${selectedRating}/10 stars`;
            
            // Add some encouraging text based on rating
            if (selectedRating >= 8) {
                ratingDisplay.textContent += ' 😍 (That\'s amazing!)';
            } else if (selectedRating >= 6) {
                ratingDisplay.textContent += ' 😊 (That\'s pretty good!)';
            } else if (selectedRating >= 4) {
                ratingDisplay.textContent += ' 😐 (I can work with that)';
            } else {
                ratingDisplay.textContent += ' 😅 (Ouch, but thanks for honesty!)';
            }
        });
        
        // Hover effect
        star.addEventListener('mouseenter', () => {
            stars.forEach((s, i) => {
                if (i <= index) {
                    s.style.filter = 'grayscale(0)';
                    s.style.transform = 'scale(1.1)';
                } else {
                    s.style.filter = 'grayscale(1)';
                    s.style.transform = 'scale(1)';
                }
            });
        });
        
        star.addEventListener('mouseleave', () => {
            stars.forEach((s, i) => {
                if (i < selectedRating) {
                    s.style.filter = 'grayscale(0)';
                    s.style.transform = 'scale(1.2)';
                } else {
                    s.style.filter = 'grayscale(1)';
                    s.style.transform = 'scale(1)';
                }
            });
        });
    });
}

// EmailJS Configuration
const EMAILJS_CONFIG = {
    publicKey: 'PLJCCwZ48ygxvcgu',
    serviceId: 'YOUR_SERVICE_ID_HERE', // You need to create a service in EmailJS dashboard
    templateId: 'YOUR_TEMPLATE_ID_HERE', // You need to create a template in EmailJS dashboard
    userEmail: 'sarthaksaraswatmlg@gmail.com'
};

function submitFeedback() {
    const message = document.getElementById('message').value;
    const ratingDisplay = document.getElementById('rating-display');
    
    // Simple validation
    if (selectedRating === 0) {
        alert('Please give me a rating first! ⭐');
        return;
    }
    
    // Show loading state
    const submitBtn = document.querySelector('.btn-submit');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending... 💕';
    submitBtn.disabled = true;
    
    // Prepare form data for automatic email
    const formData = new FormData();
    formData.append('rating', selectedRating + '/10 stars');
    formData.append('message', message || 'No message provided');
    formData.append('timestamp', new Date().toLocaleString());
    formData.append('subject', '🎂 Response to Your Birthday Surprise');
    
    // Store feedback
    const feedback = {
        rating: selectedRating,
        message: message || 'No message provided',
        timestamp: new Date().toLocaleString()
    };
    localStorage.setItem('crushWebsiteFeedback', JSON.stringify(feedback));
    
    // Send Discord webhook notification
    const webhookUrl = 'https://discord.com/api/webhooks/1412328812091408427/sw3Dqfk42EfJ7pCSvJFl7kFX8GFiuqrWBieK7VsXvE4r79tcuVJIM_RLD2nVRn-3cZZt';
    
    const discordMessage = {
        content: `🎉 **Birthday card response!** 🎉\n\n⭐ **Rating:** ${selectedRating}/10\n💬 **Message:** ${message || 'No message'}\n⏰ **Time:** ${new Date().toLocaleString()}`
    };
    
    fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(discordMessage)
    })
    .then(() => console.log('✅ Discord notification sent!'))
    .catch(() => console.log('Discord failed - response saved locally'));
    
    // Show final screen
    setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        showScreen('final-thanks');
    }, 1000);
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize music player
    initMusicPlayer();
    
    // Initialize star rating (commented out - not needed)
    // initStarRating();
    
    // Show music player after a short delay
    setTimeout(() => {
        const musicPlayer = document.getElementById('music-player');
        musicPlayer.style.opacity = '1';
        musicPlayer.style.transform = 'translateY(0)';
    }, 1000);
    
    // Load first song after page loads
    setTimeout(() => {
        if (playlist.length > 0 && audio) {
            console.log('Loading first song on page load');
            loadSong(0);
        }
    }, 2000);
    // Add click effect to all buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add floating hearts occasionally
    setInterval(createFloatingHeart, 10000);
});

function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.innerHTML = '🎈';
    heart.style.position = 'fixed';
    heart.style.left = Math.random() * window.innerWidth + 'px';
    heart.style.top = window.innerHeight + 'px';
    heart.style.fontSize = '2rem';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '1000';
    heart.style.animation = 'floatUp 6s ease-out forwards';
    
    document.body.appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 6000);
}

// Add floating animation
const floatingStyle = document.createElement('style');
floatingStyle.textContent = `
    @keyframes floatUp {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: rippleEffect 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes rippleEffect {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(floatingStyle);

// Easter egg: Konami code for extra hearts
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.code);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
        // Heart explosion!
        for (let i = 0; i < 20; i++) {
            setTimeout(() => createFloatingHeart(), i * 100);
        }
        konamiCode = [];
    }
});

// Prevent right-click context menu for a cleaner experience
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

// Add sweet console message
console.log('🎂 Made with care for a birthday surprise 🎂');
console.log('🌟 Happy Birthday! Enjoy the surprise. 🌟');
