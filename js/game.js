/***************
  IMMAGINI CARTE
***************/
const cardImages = [
  { front: "cards/foraterra.png", back: "cards/back.png" },
  { front: "cards/codafrusta.png", back: "cards/back.png" },
  { front: "cards/longipede.png", back: "cards/back.png" },
  { front: "cards/manticerio.png", back: "cards/back.png" },
  { front: "cards/rovistatore.png", back: "cards/back.png" },
  { front: "cards/spazzino.png", back: "cards/back.png" },
  { front: "cards/vedetta_occhio_rosso.png", back: "cards/back.png" },
  { front: "cards/squarciavento_alfa.png", back: "cards/back.png" },
];

/***************
  PRELOAD
***************/
function preloadImages() {
  cardImages.forEach(c => {
    new Image().src = c.front;
    new Image().src = c.back;
  });
}
preloadImages();

/***************
  STATO DI GIOCO
***************/
let deck = [];
let hand = [];
let table = [];

let selectedHand = [];
let selectedTable = [];
let selectedDeck = [];

/***************
  AVVIO SCHERMATE
***************/
const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");

/***************
  NUOVA PARTITA
***************/
document.getElementById("startGameBtn").addEventListener("click", () => {
  startNewGame();
});

function startNewGame() {
  deck = cardImages.map(c => ({ ...c }));
  hand = [];
  table = [];

  selectedHand = [];
  selectedTable = [];
  selectedDeck = [];

  shuffle(deck);
  drawInitialHand();

  startScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");

  render();
}

/***************
  PESCA INIZIALE
***************/
function drawInitialHand() {
  for (let i = 0; i < 5 && deck.length; i++) {
    hand.push(deck.shift());
  }
}

/***************
  SHUFFLE
***************/
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

/***************
  SELEZIONE
***************/
function toggleSelection(card, list) {
  const idx = list.indexOf(card);
  if (idx === -1) list.push(card);
  else list.splice(idx, 1);
}

/***************
  RENDER HAND
***************/
function renderHand() {
  const cont = document.getElementById("player-hand");
  cont.innerHTML = "";

  hand.forEach((card, index) => {
    const div = document.createElement("div");
    div.className = "hand-card";

    if (selectedHand.includes(card)) div.classList.add("selected");

    const img = document.createElement("img");
    img.src = card.front;
    div.appendChild(img);

    // tap singolo = selezione
    div.addEventListener("click", () => {
      toggleSelection(card, selectedHand);
      render();
    });

    // doppio tap = apri swiper
    div.addEventListener("dblclick", () => {
      openSwiperFromHand(index);
    });

    cont.appendChild(div);
  });
}

/***************
  RENDER TAVOLO
***************/
function renderTable() {
  const cont = document.getElementById("table-cards");
  cont.innerHTML = "";

  table.forEach(card => {
    const div = document.createElement("div");
    div.className = "table-card";

    const img = document.createElement("img");
    img.src = card.front;

    div.appendChild(img);
    cont.appendChild(div);
  });
}

/***************
  RENDER COMPLETO
***************/
function render() {
  renderHand();
  renderTable();
}
