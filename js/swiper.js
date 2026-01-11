let currentIndex = 0;

function initSwiper() {

  const track = document.getElementById("swiperTrack");

  // prendo le carte dalla mano
  const handCards = [...document.querySelectorAll("#hand .card")];

  // pulisco
  track.innerHTML = "";

  handCards.forEach((card, index) => {
    const clone = card.cloneNode(true);
    clone.classList.add("swiper-card");

    if (index === 0) clone.classList.add("center");

    clone.addEventListener("click", () => {
      currentIndex = index;
      updateSwiper();
    });

    track.appendChild(clone);
  });

  document.getElementById("swiperPrev").onclick = () => {
    currentIndex = Math.max(0, currentIndex - 1);
    updateSwiper();
  };

  document.getElementById("swiperNext").onclick = () => {
    currentIndex = Math.min(handCards.length - 1, currentIndex + 1);
    updateSwiper();
  };

  updateSwiper();
}

function updateSwiper() {
  const cards = [...document.querySelectorAll(".swiper-card")];

  cards.forEach((card, index) => {
    card.classList.remove("center");
    if (index === currentIndex) {
      card.classList.add("center");
    }
  });
}
