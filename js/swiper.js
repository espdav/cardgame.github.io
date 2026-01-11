/***************
  ELEMENTI SWIPER
***************/
const swiperOverlay = document.getElementById("swiperOverlay");
const swiperTrack = document.getElementById("swiperTrack");

const closeSwiperBtn = document.getElementById("closeSwiper");
const prevBtn = document.getElementById("prevCard");
const nextBtn = document.getElementById("nextCard");

let swiperIndex = 0;

/***************
  APRI DA MANO
***************/
function openSwiperFromHand(index) {
  swiperIndex = index;
  renderSwiper();
  swiperOverlay.classList.add("visible");
  swiperOverlay.setAttribute("aria-hidden", "false");
}

/***************
  CHIUDI
***************/
function closeSwiper() {
  swiperOverlay.classList.remove("visible");
  swiperOverlay.setAttribute("aria-hidden", "true");
}

closeSwiperBtn.addEventListener("click", closeSwiper);

/***************
  NAVIGAZIONE
***************/
prevBtn.addEventListener("click", () => {
  swiperIndex = (swiperIndex - 1 + hand.length) % hand.length;
  renderSwiper();
});

nextBtn.addEventListener("click", () => {
  swiperIndex = (swiperIndex + 1) % hand.length;
  renderSwiper();
});

/***************
  RENDER SWIPER
***************/
function renderSwiper() {
  swiperTrack.innerHTML = "";

  hand.forEach((card, i) => {
    const div = document.createElement("div");
    div.className = "swiper-card";

    if (i === swiperIndex) div.classList.add("active");

    const img = document.createElement("img");
    img.src = card.front;

    div.appendChild(img);

    // selezione dentro overlay
    div.addEventListener("click", () => {
      toggleSelection(card, selectedHand);
      render(); // aggiorna mano sotto
      renderSwiper(); // aggiorna bordo selezione
    });

    // swipe tap su laterale = vai in quella direzione
    div.addEventListener("dblclick", () => {
      closeSwiper();
    });

    swiperTrack.appendChild(div);
  });
}
