
/* =========================
   MULTI STEP FORM
========================= */

const step1 = document.getElementById("step-1");
const step2 = document.getElementById("step-2");

/* NEXT STEP */
function nextStep() {

  const firstName = document.querySelector(
    'input[name="first_name"]'
  ).value.trim();

  const lastName = document.querySelector(
    'input[name="last_name"]'
  ).value.trim();

  const email = document.querySelector(
    'input[name="email"]'
  ).value.trim();

  const phone = document.querySelector(
    'input[name="phone"]'
  ).value.trim();

  // validation
  if (!firstName || !lastName || !email || !phone) {

    alert("Please complete all required fields.");

    return;

  }

  // switch steps
  step1.classList.remove("active");

  step2.classList.add("active");

  // smooth scroll
  step2.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });

}
window.nextStep = nextStep;

/* =========================
   FORM SUBMISSION
========================= */

const form = document.getElementById("eventForm");

const submitButton = form.querySelector(
  'button[type="submit"]'
);

form.addEventListener("submit", async function (e) {

  e.preventDefault();

  // Ensure Step 2 is active
  if (!step2.classList.contains("active")) {

    nextStep();

    return;

  }

  // prevent double submit
  submitButton.disabled = true;

  submitButton.innerHTML = "Submitting...";

  try {

    const formData = new FormData(form);

    const response = await fetch("submit.php", {
      method: "POST",
      body: formData
    });

    const result = await response.json();

    if (result.status === "success") {

      submitButton.innerHTML =
        "Registration Submitted ✓";

      submitButton.style.background =
        "#2ecc71";

      setTimeout(() => {

        form.reset();

        submitButton.disabled = false;

        submitButton.innerHTML =
          "Complete Registration";

        submitButton.style.background = "";

        step2.classList.remove("active");

        step1.classList.add("active");

      }, 3000);

    } else {

      submitButton.disabled = false;

      submitButton.innerHTML =
        "Complete Registration";

      alert(
        result.message ||
        "Submission failed."
      );

    }

  } catch (error) {

    console.error(error);

    submitButton.disabled = false;

    submitButton.innerHTML =
      "Complete Registration";

    alert(
      "Something went wrong. Please try again."
    );

  }

});

