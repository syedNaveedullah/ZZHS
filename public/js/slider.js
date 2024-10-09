// bootstrap carousel Initialization for main three images
const myCarouselElement = document.querySelector("#carouselExampleCaptions");

// Initialize the carousel with your desired settings
const carousel = new bootstrap.Carousel(myCarouselElement, {
  interval: 2000, // Slide every 1 second (1000 milliseconds)
  touch: true, // Enable touch gestures for mobile devices
  ride: "carousel",
});
//=================================================
// preventing automatic scroll when clicking on sliding images
document.querySelectorAll(".button").forEach((button) => {
  button.addEventListener("click", function (event) {
    event.preventDefault();
  });
});

// =======stoping
// Get all the image elements
const imgContainers = document.querySelectorAll(".slide_div img");
const sliderContainer = document.querySelector(".imgContainer");

// Click event on images to enlarge
imgContainers.forEach((img) => {
  img.addEventListener("click", (event) => {
    console.log("Image clicked: ", event.target); // Add this to check
    // Stop the slider by adding the 'stopped' class
    sliderContainer.classList.add("stopped");

    // Remove the 'enlarged' class from all images
    imgContainers.forEach((image) => image.classList.remove("enlarged"));

    // Add 'enlarged' class to the clicked image
    event.target.classList.add("enlarged");

    // Optional: Prevent slider from moving, center the clicked image
    sliderContainer.style.justifyContent = "center";
  });
});

// Mouseleave event on slider to resume animation
sliderContainer.addEventListener("mouseleave", () => {
  // Remove the 'stopped' class to resume sliding
  sliderContainer.classList.remove("stopped");

  // Remove 'enlarged' class from all images
  imgContainers.forEach((image) => image.classList.remove("enlarged"));

  // Reset slider alignment
  sliderContainer.style.justifyContent = "flex-start";
});
