//starter JavaScript for disabling form submissions if there are invalid fields
//from client side

(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();

// ======section-4==============================================================================
// Get the audio element for Section 4
const section4 = document.querySelector("#section-4");
const sound = document.getElementById("section-sound");

// Intersection Observer options
const options = {
  root: null, // Use viewport as the root
  rootMargin: "0px",
  threshold: 0.5, // Trigger when 50% of section 4 is visible
};

// Callback for intersection changes
const handleIntersection = (entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // Play sound when section 4 is in view
      sound.play();
      // console.log("playing");
    } else {
      // Pause and reset sound when section 4 is out of view
      sound.pause();
      // console.log("pause");
      sound.currentTime = 0;
    }
  });
};

// Create an Intersection Observer instance
const observer = new IntersectionObserver(handleIntersection, options);

// Observe Section 4
observer.observe(section4);

// Smooth scrolling for carousel buttons (optional)
document.querySelectorAll(".carousel-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const targetSlide = btn.getAttribute("data-bs-slide-to");
    document
      .querySelector(
        `#carouselExampleCaptions .carousel-item:nth-child(${
          parseInt(targetSlide) + 1
        })`
      )
      .scrollIntoView({
        behavior: "smooth",
      });
  });
});
