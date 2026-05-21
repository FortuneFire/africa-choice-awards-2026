// HERO SLIDER

let currentSlide = 0;
const slides = document.querySelectorAll(".hero-slide");
let autoSlideInterval;

function showSlide(index){
  slides.forEach((slide, i) => {
    slide.classList.remove("active");
    if(i === index){
      slide.classList.add("active");
    }
  });
}

function nextSlide(){
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

function prevSlide(){
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(currentSlide);
}

function startAutoSlide(){
  autoSlideInterval = setInterval(nextSlide, 5000);
}

function stopAutoSlide(){
  clearInterval(autoSlideInterval);
}

// Start auto-slide on page load
startAutoSlide();

// Pause auto-slide on hover
const heroSlider = document.querySelector(".hero-slider");
if(heroSlider){
  heroSlider.addEventListener("mouseenter", stopAutoSlide);
  heroSlider.addEventListener("mouseleave", startAutoSlide);
}

// EVENT TABS

const tabButtons = document.querySelectorAll(".tab-btn");
const eventContents = document.querySelectorAll(".event-content");

tabButtons.forEach(button => {

  button.addEventListener("click", () => {

    const tab = button.getAttribute("data-tab");

    tabButtons.forEach(btn => {
      btn.classList.remove("active");
    });

    eventContents.forEach(content => {
      content.classList.remove("active");
    });

    button.classList.add("active");

    document.getElementById(tab).classList.add("active");

  });

});

// COUNTDOWN

const countdownDate = new Date("May 29, 2026 18:00:00").getTime();

const timer = setInterval(() => {

  const now = new Date().getTime();

  const distance = countdownDate - now;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));

  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) /
    (1000 * 60 * 60)
  );

  const minutes = Math.floor(
    (distance % (1000 * 60 * 60)) /
    (1000 * 60)
  );

  const seconds = Math.floor(
    (distance % (1000 * 60)) / 1000
  );

  document.getElementById("days").innerHTML =
  days < 10 ? "0" + days : days;

  document.getElementById("hours").innerHTML =
  hours < 10 ? "0" + hours : hours;

  document.getElementById("minutes").innerHTML =
  minutes < 10 ? "0" + minutes : minutes;

  document.getElementById("seconds").innerHTML =
  seconds < 10 ? "0" + seconds : seconds;

  if(distance < 0){

    clearInterval(timer);

  }

}, 1000);

// FORM SUBMIT

const form = document.getElementById("eventForm");
const step1 = document.getElementById("step-1");
const step2 = document.getElementById("step-2");
const button = document.querySelector(".submit-btn");

const nav = document.querySelector("nav");
const heroSection = document.querySelector(".hero");

function updateNavScrollState() {
  if (!nav || !heroSection) return;
  const threshold = heroSection.offsetHeight - nav.offsetHeight;
  nav.classList.toggle("nav-scrolled", window.scrollY > threshold);
}

window.addEventListener("scroll", updateNavScrollState);
window.addEventListener("load", updateNavScrollState);
window.addEventListener("resize", updateNavScrollState);

/* ========================================
   MOBILE NAV TOGGLE - PREMIUM REDESIGN
   ======================================== */
const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
const mobileNavOverlay = document.getElementById("mobileNavOverlay");
const mobileNavLinks = document.querySelectorAll(".mobile-nav-link, .mobile-nav-cta-btn");

function openMobileNav() {
  if (!mobileNavOverlay) return;

  // Show the overlay
  mobileNavOverlay.classList.add("is-open");
  mobileNavOverlay.setAttribute("aria-hidden", "false");
  
  // Animate hamburger to X
  if (mobileMenuBtn) {
    mobileMenuBtn.classList.add("active");
    mobileMenuBtn.setAttribute("aria-expanded", "true");
  }
  
  // Prevent body scroll
  document.body.classList.add("no-scroll");
}

function closeMobileNav() {
  if (!mobileNavOverlay) return;

  // Hide the overlay
  mobileNavOverlay.classList.remove("is-open");
  mobileNavOverlay.setAttribute("aria-hidden", "true");
  
  // Animate X back to hamburger
  if (mobileMenuBtn) {
    mobileMenuBtn.classList.remove("active");
    mobileMenuBtn.setAttribute("aria-expanded", "false");
  }
  
  // Restore body scroll
  document.body.classList.remove("no-scroll");
}

function toggleMobileNav() {
  if (!mobileNavOverlay) return;
  const isOpen = mobileNavOverlay.classList.contains("is-open");
  isOpen ? closeMobileNav() : openMobileNav();
}

// Menu button click
if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener("click", toggleMobileNav);
}

// Click on overlay background to close (but not on content)
if (mobileNavOverlay) {
  mobileNavOverlay.addEventListener("click", (e) => {
    // Only close if clicking directly on the overlay, not on content inside
    if (e.target === mobileNavOverlay || e.target.classList.contains('mobile-nav-container')) {
      closeMobileNav();
    }
  });
}

// Close when clicking nav links
mobileNavLinks.forEach((link) => {
  link.addEventListener("click", closeMobileNav);
});

// Close on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMobileNav();
});

// Close on resize to desktop
window.addEventListener("resize", () => {
  if (window.innerWidth > 992) closeMobileNav();
});

/* NEXT STEP */
function nextStep() {
  step1.classList.remove("active");
  step2.classList.add("active");

  const eventForm = document.getElementById("eventForm");
  if (eventForm) {
    eventForm.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

/* =========================
   FORM SUBMIT
========================= */

form.addEventListener("submit", function (e) {
  e.preventDefault();

  // safety: ensure Step 2 is active before final submit
  if (!step2.classList.contains("active")) {
    nextStep();
    return;
  }

  // lock button (prevents double submit)
  button.disabled = true;

  button.innerHTML = "Submitting...";

  // simulate success state (replace with real API later)
  setTimeout(() => {
    button.innerHTML = "Registration Submitted ✓";
    button.style.background = "#2ecc71";
  }, 600);
});
