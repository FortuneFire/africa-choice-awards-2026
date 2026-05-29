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

  const submitButton = form.querySelector('button[type="submit"]');

  const ZAPIER_WEBHOOK =
    "https://hooks.zapier.com/hooks/catch/23918850/4b3mg3w/";

  if (!form) {
    console.error("Form not found");
    return;
  }

  /* =========================
     MULTI STEP FORM
  ========================= */

  function nextStep() {

    const firstName = document.querySelector('input[name="first_name"]').value.trim();
    const lastName  = document.querySelector('input[name="last_name"]').value.trim();
    const email     = document.querySelector('input[name="email"]').value.trim();
    const phone     = document.querySelector('input[name="phone"]').value.trim();

    if (!firstName || !lastName || !email || !phone) {
      alert("Please complete all required fields.");
      return;
    }

    step1.classList.remove("active");
    step2.classList.add("active");

    step2.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  window.nextStep = nextStep;

  /* =========================
     FORM SUBMISSION (ZAPIER)
  ========================= */

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // ensure step 2 is active
    if (!step2.classList.contains("active")) {
      nextStep();
      return;
    }

    submitButton.disabled = true;
    submitButton.innerHTML = "Submitting...";

    try {

      const formData = new FormData(form);

      const params = new URLSearchParams();

      for (const [key, value] of formData.entries()) {
        params.append(key, value);
      }

      const url = ZAPIER_WEBHOOK + "?" + params.toString();

      // IMPORTANT: Zapier + browser safe mode
      await fetch(url, {
        method: "GET",
        mode: "no-cors"
      });

      submitButton.innerHTML = "Registration Submitted ✓";
      submitButton.style.background = "#2ecc71";

      form.reset();

      setTimeout(() => {

        submitButton.disabled = false;
        submitButton.innerHTML = "Complete Registration";
        submitButton.style.background = "";

        step2.classList.remove("active");
        step1.classList.add("active");

      }, 2500);

    } catch (err) {

      console.error(err);

      submitButton.disabled = false;
      submitButton.innerHTML = "Complete Registration";

      alert("Something went wrong. Try again.");

    }

  });

});