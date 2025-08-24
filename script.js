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
const track = document.querySelector(
      ".carousel-attractions-attractions-track"
    );
    const cards = document.querySelectorAll(".carousel-attractions-card");
    // activeIndex means: which card should be in the middle right now.
    let activeIndex = 1; // start with second card

    function updateCarousel() {
      //         cards[0].offsetWidth → actual width of a card.

      // + 32 → we added the gap/margin between cards manually.
      const cardWidth = cards[0].offsetWidth + 32; // card width + margin
      const offset =
        -(activeIndex * cardWidth) +
        (track.parentElement.offsetWidth - cardWidth) / 2;

      track.style.transform = `translateX(${offset}px)`;
      // Adds the .active style (bigger, brighter) to the current card, removes it from others.
      cards.forEach((card, index) => {
        card.classList.toggle("active", index === activeIndex);
      });
    }
    //  Increases activeIndex by 1.
    // % cards.length makes it wrap back to the first card if we reach the end.
    // Calls updateCarousel() to slide to the new active card.
    document.querySelector("#rightArrow").addEventListener("click", () => {
      activeIndex = (activeIndex + 1) % cards.length;
      updateCarousel();
    });

    //     Decreases activeIndex by 1.
    // + cards.length ensures we don’t get a negative number.
    // % cards.length keeps it inside range.
    // Again calls updateCarousel() to move.
    document.querySelector("#leftArrow").addEventListener("click", () => {
      activeIndex = (activeIndex - 1 + cards.length) % cards.length;
      updateCarousel();
    });

    // Initial setup
    window.addEventListener("resize", updateCarousel);
    updateCarousel();