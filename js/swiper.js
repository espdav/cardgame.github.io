let currentIndex = 0;

const swiperOverlay = document.getElementById("swiperOverlay");
const swiperTrack = document.getElementById("swiperTrack");
const closeSwiperBtn = document.getElementById("closeSwiper");

document.getElementById("prevCard").addEventListener("click", () => move(-1));
document.getElementById("nextCard").addEventListener("click", () => move(1));
closeSwiperBtn.addEventListener("click", closeSwiper);

function openSwiper(index) {
  currentIndex = index;
  renderSwiper();
  swiperOverlay.classList.remove("hidden");
}

function closeSwiper() {
  swiperOverlay.classList.add("hidden");
}

function move(dir) {
  currentIndex = (currentIndex + dir + handCards.length) % handCards.length;
  renderSwiper();
}

function renderSwiper() {
  swiperTrack.innerHTML = "";

  handCards.forEach((src, i) => {
    const img = document.createElement("img");
    img.src = src;
    img.classList.add("card");
    if (i === currentIndex) img.style.transform = "scale(1.2)";
    img.addEventListener("click", () => toggleSelection(i));
    swiperTrack.appendChild(img);
  });
}
