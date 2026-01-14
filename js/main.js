document.addEventListener('DOMContentLoaded', () => {
    // Hamburger Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = hamburger.querySelector('ion-icon');
            if (navLinks.classList.contains('active')) {
                icon.setAttribute('name', 'close-outline');
            } else {
                icon.setAttribute('name', 'menu-outline');
            }
        });
    }

    // Contact Form Submission
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('form-message');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Get data
            const formData = {
                name: document.getElementById('name').value,
                businessName: document.getElementById('businessName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value
            };

            // Show loading state
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = 'Sending...';
            btn.disabled = true;

            try {
                const response = await fetch('http://localhost:3000/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (response.ok) {
                    formMessage.innerHTML = `<span class="success">${result.message}</span>`;
                    contactForm.reset();
                } else {
                    formMessage.innerHTML = `<span class="error">${result.message || 'Something went wrong.'}</span>`;
                }
            } catch (error) {
                console.error('Error:', error);
                formMessage.innerHTML = `<span class="error">Failed to send message. Server might be down.</span>`;
            } finally {
                btn.innerText = originalText;
                btn.disabled = false;
            }
        });
    }

    // Dynamic Copyright Year
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Scroll Video Logic
    const videoSection = document.querySelector('.scroll-video-container');
    const video = document.getElementById('scrollVideo');

    if (videoSection && video) {
        console.log("Video section found");

        // Ensure metadata is loaded to get duration
        video.addEventListener('loadedmetadata', () => {
            console.log("Video duration:", video.duration);
        });

        window.addEventListener('scroll', () => {
            const sectionRect = videoSection.getBoundingClientRect();
            const sectionTop = sectionRect.top;
            const sectionHeight = sectionRect.height;
            const windowHeight = window.innerHeight;

            // Calculate how far into the section we are
            // sectionTop is negative as we scroll down past the top
            // Start scrubbing when section comes into view, or better, when it hits top

            // Simplified logic: 
            // We want the interaction to happen while the user scrolls through the 'height: 300vh' container.
            // The video is sticky for 300vh.

            // Calculate progress: 0 when section top is at window bottom, 1 when section bottom is at window top?
            // No, sticky behavior means it stays fixed. 
            // Let's measure progress relative to the scrollable distance.

            // Distance scrolled from the top of the section relative to the viewport
            const distanceFromTop = -sectionTop;
            const scrollableDistance = sectionHeight - windowHeight;

            if (scrollableDistance > 0) {
                let progress = distanceFromTop / scrollableDistance;

                // Clamp progress between 0 and 1
                if (progress < 0) progress = 0;
                if (progress > 1) progress = 1;

                if (video.duration) {
                    video.currentTime = video.duration * progress;
                }
            }
        });
    }
});
