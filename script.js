document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Background Particle System (Canvas) ---
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 3 + 1;
            this.speedY = Math.random() * 0.5 + 0.2;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.color = `rgba(255, ${Math.random() * 100 + 100}, 200, ${this.opacity})`;
            this.isHeart = Math.random() > 0.8; // 20% chance to be a heart
        }

        update() {
            this.y -= this.speedY;
            if (this.y < 0) {
                this.y = height;
                this.x = Math.random() * width;
            }
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            if (this.isHeart) {
                // Draw tiny heart
                ctx.font = `${this.size * 4}px Arial`;
                ctx.fillText('❤', this.x, this.y);
            } else {
                // Draw circle
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    function initParticles() {
        for (let i = 0; i < 100; i++) {
            particles.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();


    // --- 2. 3D Tilt Effect for Cards ---
    const cards = document.querySelectorAll('.tilt-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -5; // Max 5deg rotation
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });


    // --- 3. Audio Control ---
    const bgMusic = document.getElementById('bg-music');
    const soundControl = document.getElementById('sound-control');
    const soundIcon = document.getElementById('sound-icon');
    let isPlaying = false;

    // Autoplay attempt interaction
    document.body.addEventListener('click', () => {
        if (!isPlaying) {
            bgMusic.volume = 0.4;
            bgMusic.play().then(() => {
                isPlaying = true;
                soundIcon.className = 'fas fa-volume-up';
            }).catch(e => console.log("Audio waiting for interaction"));
        }
    }, { once: true });

    soundControl.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent body click
        if (isPlaying) {
            bgMusic.pause();
            soundIcon.className = 'fas fa-volume-mute';
        } else {
            bgMusic.play();
            soundIcon.className = 'fas fa-volume-up';
        }
        isPlaying = !isPlaying;
    });


    // --- 4. Proposal Logic ---
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');
    const proposalText = document.getElementById('proposal-text');
    const yesSound = document.getElementById('yes-sound');

    yesBtn.addEventListener('click', () => {
        yesSound.play();
        
        // Change Text
        proposalText.innerHTML = "I Knew You Would Say Yes! 💍";
        proposalText.style.color = "#ffd700";
        proposalText.style.textShadow = "0 0 20px #ff4d8d";

        // Trigger Huge Confetti
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            
            // random confetti from both sides
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);

        // Alert after a slight delay
        setTimeout(() => {
             alert("My darling Wify, I promise to love you forever and make every day as magical as this moment! 💍❤️");
        }, 1500);
    });

    // The Runaway "No" Button
    noBtn.addEventListener('mouseover', () => {
        const x = Math.random() * (window.innerWidth - noBtn.offsetWidth - 50);
        const y = Math.random() * (window.innerHeight - noBtn.offsetHeight - 50);
        
        noBtn.style.position = 'fixed';
        noBtn.style.left = `${Math.max(0, x)}px`;
        noBtn.style.top = `${Math.max(0, y)}px`;
        
        // Random taunt phrases
        const phrases = ["Oops, too slow!", "Try again!", "Nope!", "Wrong button!", "Can't catch me!"];
        noBtn.querySelector('.btn-text').innerText = phrases[Math.floor(Math.random() * phrases.length)];
    });


    // --- 5. Save Note Logic ---
    const saveNoteBtn = document.getElementById('save-note');
    const loveNoteText = document.getElementById('love-note');

    // Load saved note
    const savedNote = localStorage.getItem('loveNoteToWify');
    if (savedNote) loveNoteText.value = savedNote;

    saveNoteBtn.addEventListener('click', () => {
        localStorage.setItem('loveNoteToWify', loveNoteText.value);
        
        const originalText = saveNoteBtn.innerHTML;
        saveNoteBtn.innerHTML = '<i class="fas fa-check"></i> Saved!';
        saveNoteBtn.style.background = 'linear-gradient(45deg, #2ecc71, #1abc9c)';
        
        setTimeout(() => {
            saveNoteBtn.innerHTML = originalText;
            saveNoteBtn.style.background = ''; // revert to CSS gradient
        }, 2000);
    });

    // --- 6. Click Heart Burst ---
    document.addEventListener('click', (e) => {
        // Don't trigger on buttons
        if(e.target.closest('button')) return;

        const heart = document.createElement('div');
        heart.innerHTML = '💖';
        heart.style.position = 'fixed';
        heart.style.left = (e.clientX - 10) + 'px';
        heart.style.top = (e.clientY - 10) + 'px';
        heart.style.fontSize = '20px';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '1000';
        heart.style.animation = 'floatUpFade 1s ease-out forwards';
        
        // Add style for this specific animation dynamically or rely on global CSS
        // Let's rely on JS animation for simplicity here
        document.body.appendChild(heart);
        
        const anim = heart.animate([
            { transform: 'translateY(0) scale(1)', opacity: 1 },
            { transform: 'translateY(-50px) scale(2)', opacity: 0 }
        ], {
            duration: 1000,
            easing: 'ease-out'
        });

        anim.onfinish = () => heart.remove();
    });
});