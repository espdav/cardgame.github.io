let handCards = [];
let selectedCards = new Set();

const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const optionsMenu = document.getElementById("optionsMenu");

const handArea = document.getElementById("player-hand");
const tableArea = document.getElementById("table-cards");

const swiperOverlay = document.getElementById("swiperOverlay");

// pulsanti start screen
document.getElementById("newGameBtn").addEventListener("click", startNewGame);
document.getElementById("loadGameBtn").addEventListener("click", loadGame);

// menu opzioni
document.getElementById("optionsBtn").addEventListener("click", toggleOptionsMenu);
document.getElementById("exitGameBtn").addEventListener("click", exitGame);
document.getElementById("saveGameBtn").addEventListener("click", saveGame);
document.getElementById("fullscreenBtn").addEventListener("click", toggleFullscreen);

function startNewGame() {
  startScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  initHand();
}

function loadGame() {
  alert("Funzione carica partita (placeholder)");
}

function exitGame() {
  location.reload();
}

function saveGame() {
  alert("Partita salvata (placeholder)");
}

function toggleOptionsMenu() {
  optionsMenu.classList.toggle("hidden");
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    document.getElementById("fullscreenBtn").textContent = "Esci da schermo intero";
  } else {
    document.exitFullscreen();
    document.getElementById("fullscreenBtn").textContent = "Schermo intero";
  }
}

function initHand() {
  handCards = ["c1.png","c2.png","c3.png","c4.png","c5.png","c6.png"];
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

    img.addEventListener("click", () => toggleSelection(index));
    img.addEventListener("dblclick", () => openSwiper(index));

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
