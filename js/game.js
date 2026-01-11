let handCards = [];
let selectedCards = new Set();

const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");

const handArea = document.getElementById("player-hand");
const tableArea = document.getElementById("table-cards");

const swiperOverlay = document.getElementById("swiperOverlay");

document.getElementById("startGameBtn").addEventListener("click", startGame);

function startGame() {
  startScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  initHand();
}

function initHand() {
  handCards = ["c1.png", "c2.png", "c3.png", "c4.png", "c5.png", "c6.png"];
  renderHand();
}

function renderHand() {
  handArea.innerHTML = "";

  handCards.forEach((src, index) => {
    const img = document.createElement("img");
    img.src = src;
    img.classList.add("card");
    img.dataset.index = index;

    if (selectedCards.has(index)) img.classList.add("selected");

    // click -> selezione
    img.addEventListener("click", () => toggleSelection(index));

    // doppio click -> apri swiper
    img.addEventListener("dblclick", () => openSwiper(index));

    // drag to table
    img.setAttribute("draggable", true);
    img.addEventListener("dragstart", dragStart);

    handArea.appendChild(img);
  });
}

function toggleSelection(i) {
  if (selectedCards.has(i)) selectedCards.delete(i);
  else selectedCards.add(i);
  renderHand();
}

function dragStart(e) {
  e.dataTransfer.setData("cardIndex", e.target.dataset.index);
}

tableArea.addEventListener("dragover", e => e.preventDefault());

tableArea.addEventListener("drop", e => {
  const index = e.dataTransfer.getData("cardIndex");
  addCardToTable(index);
});

function addCardToTable(index) {
  const img = document.createElement("img");
  img.src = handCards[index];
  img.classList.add("card");
  tableArea.appendChild(img);
}
