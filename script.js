// Global variables
let noClickCount = 0;
let selectedRating = 0;

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

// Landing page functions
function goToReasons() {
    showScreen('reason-1');
}

function goToLoveToo() {
    showScreen('love-too-confirm');
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
    formData.append('subject', '💕 Response to Your Confession Website');
    
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
        content: `🚨 **SHE RESPONDED!** 🚨\n\n⭐ **Rating:** ${selectedRating}/10\n💬 **Message:** ${message || 'No message'}\n⏰ **Time:** ${new Date().toLocaleString()}`
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

// Add some extra animations and effects
document.addEventListener('DOMContentLoaded', function() {
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
    heart.innerHTML = '💕';
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
console.log('💕 Made with love for someone special 💕');
console.log('🌟 Good luck with your confession! 🌟');
