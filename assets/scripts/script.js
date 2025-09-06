const sidebarbutton=document.getElementById("sidebar");
const navigation=document.querySelector(".navigation");

sidebarbutton.addEventListener("click",function(){
  navigation.classList.toggle("show");

  const expanded=sidebarbutton.getAttribute("aria-expanded")==="true";
sidebarbutton.setAttribute("aria-expanded",!expanded);

});
// savebutton
  const save=document.querySelectorAll(".save-button svg");
       save.forEach((save)=>{
         save.addEventListener("click",function(e){
           e.preventDefault(); 
        save.classList.toggle("fill-red");
       })
       });

// attractions carousel
// Select the carousel track (the long row of cards)
const track = document.querySelector(".carousel-attractions-attractions-track");

// Select all cards (each attraction card inside the track)
const cards = document.querySelectorAll(".carousel-attractions-card");

// activeIndex keeps track of which card should be highlighted / centered
let activeIndex = 1; // start from the 2nd card (you can set to 0 if you want first card)

// Function to update the carousel position and active card
function updateCarousel() {
  // Get the currently active card
  const activeCard = cards[activeIndex];

  // Bounding rectangles (positions & sizes of elements on screen)
  const trackRect = track.getBoundingClientRect();
  const parentRect = track.parentElement.getBoundingClientRect();
  const activeRect = activeCard.getBoundingClientRect();

  /*
    Calculate how much we need to shift (translateX) the track so that
    the active card’s CENTER is aligned with the parent container’s CENTER.

    Formula:
    offset = (containerCenter) - (activeCardCenterInsideTrack)
  */
  const offset =
    parentRect.width / 2 -
    (activeRect.left - trackRect.left + activeRect.width / 2);

  // Apply the translation to shift the track
  track.style.transform = `translateX(${offset}px)`;

  // Loop through all cards and add/remove the .active class
  cards.forEach((card, index) => {
    card.classList.toggle("active", index === activeIndex);
  });

  // Optional: hide/show arrows depending on position
  document.querySelector(".leftArrow").style.display =
    activeIndex === 0 ? "none" : "block";
  document.querySelector(".rightArrow").style.display =
    activeIndex === cards.length - 1 ? "none" : "block";
}

// Right arrow → move forward
document.querySelector(".rightArrow").addEventListener("click", () => {
  if (activeIndex < cards.length - 1) {
    activeIndex++;
    updateCarousel();
  }
});

// Left arrow → move backward
document.querySelector(".leftArrow").addEventListener("click", () => {
  if (activeIndex > 0) {
    activeIndex--;
    updateCarousel();
  }
});

// Recalculate positions when window resizes
window.addEventListener("resize", updateCarousel);

// Initial load setup
updateCarousel();
 

    // placedetails modal script
  document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("galleryModal");
  const galleryContainer = document.getElementById("galleryContainer");
  const closeBtn = modal.querySelector(".close");
  
  console.log("found grid:", grid, "moreBtn:", moreBtn);

  // Attach event listener to all "more" buttons
  document.querySelectorAll(".images-grid").forEach(grid => {
    const images = JSON.parse(grid.dataset.images || "[]");
    const moreBtn = grid.querySelector(".more-btn");

    if (moreBtn) {
      moreBtn.addEventListener("click", () => {
        // just open modal, don’t reset gallery
        modal.setAttribute("aria-hidden", "false");
        modal.style.display = "block";
      });
    }

    // If you want to preload images once into modal
    if (images.length > 0 && galleryContainer.children.length === 0) {
      images.forEach(img => {
        const imageEl = document.createElement("img");
        imageEl.src = img;
        galleryContainer.appendChild(imageEl);
      });
    }
  });

  // Close gallery
  closeBtn.addEventListener("click", closeGallery);
  function closeGallery() {
    modal.setAttribute("aria-hidden", "true");
    modal.style.display = "none";
  }
});