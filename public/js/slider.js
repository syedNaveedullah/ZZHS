// bootstrap carousel Initialization for main three images
  const myCarouselElement = document.querySelector('#carouselExampleCaptions');
  
  // Initialize the carousel with your desired settings
  const carousel = new bootstrap.Carousel(myCarouselElement, {
    interval: 1000, // Slide every 1 second (1000 milliseconds)
    touch: true,    // Enable touch gestures for mobile devices
    ride: 'carousel'
  });
//=================================================