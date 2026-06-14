/* =========================
   DOM READY WRAPPER (IMPORTANT)
========================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     ELEMENTS
  ========================= */

  const form = document.getElementById("eventForm");
  const step1 = document.getElementById("step-1");
  const step2 = document.getElementById("step-2");

  const submitButton = form?.querySelector('button[type="submit"]');
  const tabButtons = document.querySelectorAll(".tab-btn");
  const eventContents = document.querySelectorAll(".event-content");

  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const mobileNavOverlay = document.getElementById("mobileNavOverlay");
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");

  const ZAPIER_WEBHOOK =
    "https://hooks.zapier.com/hooks/catch/23918850/4b3mg3w/";

  if (!form) {
    console.error("Form not found");
    return;
  }

  /* =========================
     EVENT TABS
  ========================= */

  function activateEventTab(tabName) {
    tabButtons.forEach((button) => {
      const isActive = button.dataset.tab === tabName;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-selected", String(isActive));
    });

    eventContents.forEach((content) => {
      content.classList.toggle("active", content.id === tabName);
    });
  }

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const tabName = button.dataset.tab;
      if (!tabName) return;
      activateEventTab(tabName);
    });
  });

  /* =========================
     MOBILE MENU TOGGLE
  ========================= */

  if (mobileMenuBtn && mobileNavOverlay) {
    mobileMenuBtn.addEventListener("click", () => {
      const isOpen = mobileMenuBtn.classList.toggle("active");
      mobileNavOverlay.classList.toggle("is-open", isOpen);
      document.body.classList.toggle("no-scroll", isOpen);
      mobileMenuBtn.setAttribute("aria-expanded", String(isOpen));
    });

    // Close menu when a link is clicked
    mobileNavLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenuBtn.classList.remove("active");
        mobileNavOverlay.classList.remove("is-open");
        document.body.classList.remove("no-scroll");
        mobileMenuBtn.setAttribute("aria-expanded", "false");
      });
    });

    // Close menu on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && mobileMenuBtn.classList.contains("active")) {
        mobileMenuBtn.classList.remove("active");
        mobileNavOverlay.classList.remove("is-open");
        document.body.classList.remove("no-scroll");
        mobileMenuBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* =========================
     HERO SLIDER
  ========================= */

  let currentSlide = 0;
  const heroSlides = document.querySelectorAll(".hero-slide");

  function showSlide(n) {
    if (heroSlides.length === 0) return;
    
    heroSlides.forEach((slide) => slide.classList.remove("active"));
    
    if (n >= heroSlides.length) {
      currentSlide = 0;
    } else if (n < 0) {
      currentSlide = heroSlides.length - 1;
    } else {
      currentSlide = n;
    }
    
    heroSlides[currentSlide].classList.add("active");
  }

  window.nextSlide = () => {
    showSlide(currentSlide + 1);
  };

  window.prevSlide = () => {
    showSlide(currentSlide - 1);
  };

  /* =========================
     NAVIGATION SCROLL EFFECT
  ========================= */

  const nav = document.querySelector("nav");
  let lastScrollTop = 0;

  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    
    if (scrollTop > 50) {
      nav?.classList.add("nav-scrolled");
    } else {
      nav?.classList.remove("nav-scrolled");
    }
    
    lastScrollTop = scrollTop;
  }, { passive: true });

  /* =========================
     MULTI STEP FORM
  ========================= */

  function nextStep() {
    const firstName = document.querySelector('input[name="first_name"]')?.value.trim();
    const lastName = document.querySelector('input[name="last_name"]')?.value.trim();
    const email = document.querySelector('input[name="email"]')?.value.trim();
    const phone = document.querySelector('input[name="phone"]')?.value.trim();

    // Validation
    if (!firstName || !lastName || !email) {
      showNotification("Please complete all required fields (First Name, Last Name, Email).", "error");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showNotification("Please enter a valid email address.", "error");
      return;
    }

    // Phone is optional, but if filled, validate format
    if (phone && !/^[\d\s\-\+\(\)]+$/.test(phone)) {
      showNotification("Please enter a valid phone number.", "error");
      return;
    }

    step1.classList.remove("active");
    step2.classList.add("active");

    // Set focus to first element in step 2 (accessibility)
    setTimeout(() => {
      document.querySelector('#step-2 input')?.focus();
    }, 100);

    step2.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  window.nextStep = nextStep;

  /* =========================
     COUNTDOWN TIMER
  ========================= */

  function initCountdown() {
    // Event date: Saturday, 26 September 2026 at 18:00 (6 PM) SAST
    const targetDate = new Date("2026-09-26T18:00:00+02:00").getTime();

    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) {
      console.warn("Countdown elements not found");
      return;
    }

    function pad(n) {
      return String(n).padStart(2, "0");
    }

    function tick() {
      const now = Date.now();
      let diff = targetDate - now;

      if (diff <= 0) {
        // Event has started
        daysEl.textContent = "00";
        hoursEl.textContent = "00";
        minutesEl.textContent = "00";
        secondsEl.textContent = "00";
        return;
      }

      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      daysEl.textContent = pad(days);
      hoursEl.textContent = pad(hours);
      minutesEl.textContent = pad(minutes);
      secondsEl.textContent = pad(seconds);
    }

    // Initial call
    tick();
    
    // Update every second
    setInterval(tick, 1000);
  }

  initCountdown();

  /* =========================
     SCROLL TO TOP BUTTON
  ========================= */

  const scrollBtn = document.getElementById("scrollToTop");
  const mobileCta = document.querySelector(".mobile-cta-bar");

  function handleScroll() {
    const pastHero = window.scrollY > window.innerHeight * 0.5;

    if (scrollBtn) {
      scrollBtn.classList.toggle("is-visible", pastHero);
    }

    if (mobileCta) {
      mobileCta.classList.toggle("is-visible", pastHero);
    }

    document.body.classList.toggle("cta-visible", pastHero && !!mobileCta);
  }

  window.addEventListener("scroll", handleScroll, { passive: true });

  if (scrollBtn) {
    scrollBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* =========================
     INFO PACK FORM SUBMISSION
  ========================= */

  const infoPackForm = document.querySelector(".info-pack-form");

  if (infoPackForm) {
    infoPackForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const submitBtn = infoPackForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

      try {
        const formData = new FormData(infoPackForm);
        const params = new URLSearchParams();

        for (const [key, value] of formData.entries()) {
          params.append(key, value);
        }

        const url = ZAPIER_WEBHOOK + "?" + params.toString();

        await fetch(url, {
          method: "GET",
          mode: "no-cors"
        });

        submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Sent! Check your email.';
        submitBtn.style.background = "#10b981";

        showNotification("Information pack sent successfully! Check your email.", "success");

        infoPackForm.reset();

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
          submitBtn.style.background = "";
        }, 3000);

      } catch (err) {
        console.error("Info pack form error:", err);
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        showNotification("Something went wrong. Please try again.", "error");
      }
    });
  }

  /* =========================
     MAIN REGISTRATION FORM SUBMISSION
  ========================= */

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Ensure step 2 is active
    if (!step2.classList.contains("active")) {
      nextStep();
      return;
    }

    // Honeypot validation
    const honeypot = document.querySelector('input[name="website"]')?.value;
    if (honeypot) {
      console.warn("Honeypot field filled - possible spam");
      return;
    }

    // Validate attendee type is selected
    const attendeeType = document.querySelector('input[name="type"]:checked');
    if (!attendeeType) {
      showNotification("Please select an attendee type.", "error");
      return;
    }

    // Validate country is selected
    const country = document.querySelector('select[name="country"]')?.value;
    if (!country) {
      showNotification("Please select a country.", "error");
      return;
    }

    // Validate consent checkbox
    const consent = document.querySelector('input[name="consent"]');
    if (!consent?.checked) {
      showNotification("Please agree to receive event communications.", "error");
      return;
    }

    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';

    try {
      const formData = new FormData(form);
      const params = new URLSearchParams();

      for (const [key, value] of formData.entries()) {
        // Skip honeypot field
        if (key === "website") continue;
        params.append(key, value);
      }

      const url = ZAPIER_WEBHOOK + "?" + params.toString();

      await fetch(url, {
        method: "GET",
        mode: "no-cors"
      });

      submitButton.innerHTML = '<i class="fa-solid fa-check"></i> Registration Submitted ✓';
      submitButton.style.background = "#10b981";

      showNotification("Registration submitted successfully! We'll be in touch soon.", "success");

      form.reset();

      setTimeout(() => {
        submitButton.disabled = false;
        submitButton.innerHTML = "Complete Registration";
        submitButton.style.background = "";

        step2.classList.remove("active");
        step1.classList.add("active");
        step1.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 2500);

    } catch (err) {
      console.error("Form submission error:", err);

      submitButton.disabled = false;
      submitButton.innerHTML = "Complete Registration";

      showNotification("Something went wrong. Please try again.", "error");
    }
  });

  /* =========================
     SMOOTH SCROLL LINKS
  ========================= */

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#") return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        
        // Get nav height to offset scroll
        const navHeight = document.querySelector("nav")?.offsetHeight || 0;
        const targetPosition = target.offsetTop - navHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth"
        });
      }
    });
  });

  /* =========================
     NOTIFICATION SYSTEM
  ========================= */

  function showNotification(message, type = "info") {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll(".notification");
    existingNotifications.forEach((notif) => {
      notif.remove();
    });

    // Create notification element
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    
    let icon = "fa-info-circle";
    if (type === "success") icon = "fa-check-circle";
    if (type === "error") icon = "fa-exclamation-circle";

    notification.innerHTML = `
      <div class="notification-content">
        <i class="fa-solid ${icon}"></i>
        <span class="notification-message">${message}</span>
        <button class="notification-close" aria-label="Close notification">
          <i class="fa-solid fa-times"></i>
        </button>
      </div>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Show notification with animation
    setTimeout(() => {
      notification.classList.add("show");
    }, 10);

    // Close button functionality
    const closeBtn = notification.querySelector(".notification-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        notification.classList.remove("show");
        setTimeout(() => {
          notification.remove();
        }, 300);
      });
    }

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.classList.remove("show");
        setTimeout(() => {
          if (notification.parentNode) {
            notification.remove();
          }
        }, 300);
      }
    }, 5000);
  }

  // Add notification styles dynamically if not in CSS
  if (!document.getElementById("notification-styles")) {
    const notificationStyles = document.createElement("style");
    notificationStyles.id = "notification-styles";
    notificationStyles.textContent = `
      .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 400px;
      }

      .notification.show {
        transform: translateX(0);
      }

      .notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        background: linear-gradient(135deg, #d4af37, #b8962e);
        color: #111;
        font-weight: 500;
      }

      .notification-info .notification-content {
        background: linear-gradient(135deg, #3b82f6, #1e40af);
        color: white;
      }

      .notification-success .notification-content {
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
      }

      .notification-error .notification-content {
        background: linear-gradient(135deg, #ef4444, #dc2626);
        color: white;
      }

      .notification-message {
        flex: 1;
        font-size: 0.95rem;
      }

      .notification-close {
        background: none;
        border: none;
        color: inherit;
        font-size: 16px;
        cursor: pointer;
        opacity: 0.7;
        transition: opacity 0.2s ease;
        padding: 0;
        display: flex;
        align-items: center;
      }

      .notification-close:hover {
        opacity: 1;
      }

      .notification i {
        font-size: 1.1rem;
      }

      @media (max-width: 768px) {
        .notification {
          top: 10px;
          right: 10px;
          left: 10px;
          transform: translateY(-100px);
          max-width: none;
        }

        .notification.show {
          transform: translateY(0);
        }

        .notification-content {
          padding: 14px 16px;
          font-size: 0.9rem;
        }

        .notification i {
          font-size: 1rem;
        }
      }
    `;
    document.head.appendChild(notificationStyles);
  }

  /* =========================
     PAGE INITIALIZATION
  ========================= */

  console.log("✓ Africa Choice Awards 2026 - Scripts Initialized");
  console.log("✓ Mobile menu, forms, countdown, and interactions ready");

});
