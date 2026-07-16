/* ==========================================================================
   WORKSQUARE SOLUTIONS - PERFORMANCE TELEMETRY CONTROLLER
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    
    // ----------------------------------------------------------------------
    // 1. SCROLL-LINKED PRECISION "ALIGNMENT" LASER LINE
    // ----------------------------------------------------------------------
    const laserLine = document.querySelector('.precision-laser-line');
    
    const updatePrecisionLaser = () => {
        if (!laserLine) return;
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight <= 0) return;
        
        const scrolled = (window.scrollY / totalHeight) * 100;
        laserLine.style.height = `${scrolled}%`;
    };

    window.addEventListener('scroll', () => {
        requestAnimationFrame(updatePrecisionLaser);
    });
    updatePrecisionLaser();


    // ----------------------------------------------------------------------
    // 2. CORE SMOOTH GLIDE SCROLL REVEALS
    // ----------------------------------------------------------------------
    const scrollRevealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: "0px 0px -50px 0px"
    });

    document.querySelectorAll('.reveal-section, .reveal-on-scroll, .reveal-left, .reveal-element').forEach(element => {
        scrollRevealObserver.observe(element);
    });


    // ----------------------------------------------------------------------
    // 3. TELEMETRY HUD SEQUENCER
    // ----------------------------------------------------------------------
    const hudRows = document.querySelectorAll('.hud-row');
    const triggerHUDAnimations = () => {
        hudRows.forEach((row) => {
            const delay = row.getAttribute('data-delay') * 350;
            setTimeout(() => {
                row.classList.add('active');
            }, delay);
        });
    };
    setTimeout(triggerHUDAnimations, 600);


    // ----------------------------------------------------------------------
    // 4. BEFORE-AFTER IMAGE SLIDER MECHANIC
    // ----------------------------------------------------------------------
    const sliderContainer = document.querySelector('.before-after-slider');
    if (sliderContainer) {
        const sliderControl = sliderContainer.querySelector('.slider-control');
        const afterImageContainer = sliderContainer.querySelector('.after');
        const sliderLine = sliderContainer.querySelector('.slider-line');

        sliderControl.addEventListener('input', (e) => {
            const sliderValue = e.target.value;
            afterImageContainer.style.width = `${sliderValue}%`;
            sliderLine.style.left = `${sliderValue}%`;
        });
    }


    // ----------------------------------------------------------------------
    // 5. NUMERIC TELEMETRY SMOOTH DE-ACCELERATING COUNT-UP
    // ----------------------------------------------------------------------
    const runCounterAnimation = (element) => {
        const target = +element.getAttribute("data-target");
        if (isNaN(target)) return;
        const duration = 2000;
        const startTime = performance.now();

        const updateNumber = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const easeProgress = progress * (2 - progress); // fluid deceleration curve
            
            element.innerText = Math.floor(easeProgress * target);

            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            } else {
                element.innerText = target;
            }
        };
        requestAnimationFrame(updateNumber);
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!entry.target.classList.contains('counted')) {
                    entry.target.classList.add('counted');
                    runCounterAnimation(entry.target);
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.counter').forEach(counter => counterObserver.observe(counter));


    // ----------------------------------------------------------------------
    // 6. MODAL OVERLAY TRIGGER HANDLERS
    // ----------------------------------------------------------------------
    const modal = document.getElementById("appointmentModal");
    const openBtns = document.querySelectorAll(".openModalBtn");
    const closeBtn = document.querySelector(".close-modal");

    if (modal && openBtns.length > 0 && closeBtn) {
        openBtns.forEach(btn => btn.onclick = (e) => {
            e.preventDefault();
            modal.classList.add("active");
        });
        closeBtn.onclick = () => modal.classList.remove("active");
        window.onclick = (e) => { if (e.target === modal) modal.classList.remove("active"); }
    }


    // ----------------------------------------------------------------------
    // 7. FORM SUBMISSIONS (FORMSPREE & REVIEW FEEDBACK)
    // ----------------------------------------------------------------------
    const appForm = document.getElementById("appointmentForm");
    const appSuccess = document.getElementById("successMessage");

    if (appForm && appSuccess) {
        appForm.onsubmit = async (e) => {
            e.preventDefault();
            const submitBtn = appForm.querySelector(".submit-booking");
            const originalText = submitBtn.innerText;
            submitBtn.innerText = "Transmitting Telemetry Window...";

            try {
                const response = await fetch(appForm.action, {
                    method: 'POST',
                    body: new FormData(appForm),
                    headers: { 'Accept': 'application/json' }
                });
                
                if (response.ok) {
                    appForm.style.display = "none";
                    appSuccess.style.display = "block";
                    setTimeout(() => {
                        modal.classList.remove("active");
                        setTimeout(() => {
                            appForm.style.display = "block";
                            appSuccess.style.display = "none";
                            submitBtn.innerText = originalText;
                            appForm.reset();
                        }, 400);
                    }, 2500);
                } else {
                    alert("Allocation error. Please verify fields.");
                    submitBtn.innerText = originalText;
                }
            } catch (error) {
                alert("Network connection routing dropped.");
                submitBtn.innerText = originalText;
            }
        };
    }

    // Interactive Review Driver Feedback Handler
    const feedbackForm = document.getElementById("feedbackForm");
    const feedbackSuccess = document.getElementById("feedbackSuccess");

    if (feedbackForm && feedbackSuccess) {
        feedbackForm.onsubmit = async (e) => {
            e.preventDefault();
            const submitBtn = feedbackForm.querySelector("button[type='submit']");
            const originalText = submitBtn.innerText;
            submitBtn.innerText = "Indexing Log Data to Email...";

            try {
                // Submit telemetry data smoothly
                const response = await fetch(feedbackForm.action || '', {
                    method: 'POST',
                    body: new FormData(feedbackForm),
                    headers: { 'Accept': 'application/json' }
                });
                
                if (response.ok) {
                    feedbackForm.style.display = "none";
                    feedbackSuccess.style.display = "block";
                } else {
                    // Fail gracefully for demonstration if Formspree action pathing isn't configured
                    if (!feedbackForm.action || feedbackForm.action === window.location.href) {
                        feedbackForm.style.display = "none";
                        feedbackSuccess.style.display = "block";
                    } else {
                        alert("Could not process review log trace.");
                        submitBtn.innerText = originalText;
                    }
                }
            } catch (error) {
                feedbackForm.style.display = "none";
                feedbackSuccess.style.display = "block";
            }
        };
    }



    // ----------------------------------------------------------------------
    // 8. ACCORDION MATRIX LOGIC
    // ----------------------------------------------------------------------
    const accordionTriggers = document.querySelectorAll('.accordion-trigger');
    
    accordionTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const parentItem = this.parentElement;
            const panel = this.nextElementSibling;
            
            // Optional: Close all other open accordions for a cleaner UX
            document.querySelectorAll('.accordion-item.active').forEach(item => {
                if (item !== parentItem) {
                    item.classList.remove('active');
                    item.querySelector('.accordion-panel').style.maxHeight = null;
                }
            });

            // Toggle active state on the clicked item
            parentItem.classList.toggle('active');
            
            // Expand or collapse panel based on active state
            if (parentItem.classList.contains('active')) {
                panel.style.maxHeight = panel.scrollHeight + "px";
            } else {
                panel.style.maxHeight = null;
            }
        });
    });
});

