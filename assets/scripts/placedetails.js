document.addEventListener("DOMContentLoaded", () => {

    const slider = document.getElementById("slider");
    const leftArrow = document.getElementById("leftArrow");
    const rightArrow = document.getElementById("rightArrow");
    const dotsContainer = document.getElementById("dotsContainer");

    const slides = slider.querySelectorAll("img");
    let currentIndex = 0;

    // Create dots dynamically
    slides.forEach((_, index) => {
    const dot = document.createElement("span");
    dot.classList.add("dot");
    if (index === 0) dot.classList.add("active-dot");
    dot.addEventListener("click", () => showSlide(index));
    dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll(".dot");

    function showSlide(index) {
    currentIndex = index;
    slider.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach(dot => dot.classList.remove("active-dot"));
    dots[index].classList.add("active-dot");
    }

    leftArrow.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(currentIndex);
    });

    rightArrow.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
    });

    // Auto-slide


    /* -------- Modal Logic -------- */
    const modal = document.getElementById("imageModal");
    const closeModal = document.getElementById("closeModal");
    const modalContent = document.getElementById("modalContent");
    const modalDots = document.getElementById("modalDots");
    const modalPrev = document.getElementById("modalPrev");
    const modalNext = document.getElementById("modalNext");

    let modalIndex = 0;
    let modalSlides = [];

    // Setup modal slides & dots dynamically
    slides.forEach((img, index) => {
    // Create modal slide
    const slideDiv = document.createElement("div");
    slideDiv.classList.add("modal-slide");
    slideDiv.innerHTML = `<img src="${img.src}" alt="${img.alt}">`;
    modalContent.appendChild(slideDiv);

    // Create modal dot
    const dot = document.createElement("span");
    dot.classList.add("modal-dot");
    if (index === 0) dot.classList.add("active");
    dot.addEventListener("click", () => showModalSlide(index));
    modalDots.appendChild(dot);

    // Open modal on image click
    img.addEventListener("click", () => {
    modal.style.display = "flex";
    showModalSlide(index);
    });
    });

    modalSlides = document.querySelectorAll(".modal-slide");
    const modalDotEls = document.querySelectorAll(".modal-dot");

    function showModalSlide(index) {
    modalIndex = index;
    modalSlides.forEach(slide => (slide.style.display = "none"));
    modalDotEls.forEach(dot => dot.classList.remove("active"));
    modalSlides[index].style.display = "block";
    modalDotEls[index].classList.add("active");
    }

    modalPrev.addEventListener("click", () => {
    modalIndex = (modalIndex - 1 + modalSlides.length) % modalSlides.length;
    showModalSlide(modalIndex);
    });

    modalNext.addEventListener("click", () => {
    modalIndex = (modalIndex + 1) % modalSlides.length;
    showModalSlide(modalIndex);
    });

    closeModal.addEventListener("click", () => {
    modal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
    if (e.target === modal) {
    modal.style.display = "none";
    }
    });

// map
    // ---- Directions Button Logic ----
  const directionButtons = document.querySelectorAll(".place-details-button.direction");

  directionButtons.forEach(button => {
    button.addEventListener("click", () => {
      const lat = button.dataset.lat;
      const lon = button.dataset.lon;

      if (!lat || !lon) {
        alert("Coordinates not available for this place.");
        return;
      }

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLat = position.coords.latitude;
            const userLon = position.coords.longitude;

            const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLon}&destination=${lat},${lon}`;
            window.open(mapsUrl, "_blank");
          },
          (error) => {
            alert("Unable to access your location. Opening destination only.");
            const mapsUrl = `https://www.google.com/maps?q=${lat},${lon}`;
            window.open(mapsUrl, "_blank");
          }
        );
      } else {
        alert("Geolocation not supported. Opening destination only.");
        const mapsUrl = `https://www.google.com/maps?q=${lat},${lon}`;
        window.open(mapsUrl, "_blank");
      }
    });
  });
});