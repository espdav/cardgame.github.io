/***************
 CARD IMAGES
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
 GAME STATE
***************/
let deck = [];
let hand = [];
let table = [];

// drag state
let draggedCard = null;

/***************
 START GAME
***************/
function startNewGame() {
  deck = cardImages.map(c => ({ ...c }));
  hand = [];
  table = [];

  shuffle(deck);
  drawInitial(5);

  document.getElementById("startScreen").style.display = "none";
  document.getElementById("loadScreen").style.display = "none";
  document.getElementById("gameScreen").style.display = "block";

  render();
}

function goBackToStart() {
  document.getElementById("loadScreen").style.display = "none";
  document.getElementById("startScreen").style.display = "block";
}

/***************
 SHUFFLE & DRAW
***************/
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
}

function drawInitial(n) {
  for (let i = 0; i < n; i++) drawCard();
}

function drawCard() {
  if (!deck.length) return;
  hand.push(deck.shift());
  render();
}

/***************
 RENDER
***************/
function render() {
  renderHand();
  renderTable();
  document.getElementById("deckSize").innerText = deck.length;
}

function renderHand() {
  const c = document.getElementById("hand");
  c.innerHTML = "";

  hand.forEach(card => {
    const div = document.createElement("div");
    div.className = "card";

    const img = document.createElement("img");
    img.src = card.front;

    div.appendChild(img);

    // click = select / raise
    div.onclick = () => {
      if (div.classList.contains("raised")) {
        div.classList.remove("raised");
      } else if (div.classList.contains("selected")) {
        div.classList.add("raised");
      } else {
        document.querySelectorAll("#hand .card").forEach(c => {
          c.classList.remove("selected");
          c.classList.remove("raised");
        });
        div.classList.add("selected");
      }
    };

    // double click = open swiper
    div.ondblclick = () => openSwiper(card);

    c.appendChild(div);
  });
}

function renderTable() {
  const t = document.getElementById("table");
  t.innerHTML = "";

  table.forEach(card => {
    const div = document.createElement("div");
    div.className = "card";
    div.style.left = card.x + "px";
    div.style.top = card.y + "px";

    const img = document.createElement("img");
    img.src = card.front;

    div.appendChild(img);
    t.appendChild(div);
  });
}

/***************
 DRAG & DROP
***************/
document.addEventListener("mousedown", e => {
  const card = e.target.closest("#hand .card.raised");
  if (!card) return;

  draggedCard = card.cloneNode(true);
  draggedCard.style.position = "absolute";
  draggedCard.style.pointerEvents = "none";
  draggedCard.style.zIndex = 9999;

  document.body.appendChild(draggedCard);
  moveDragged(e.pageX, e.pageY);
});

document.addEventListener("mousemove", e => {
  if (!draggedCard) return;
  moveDragged(e.pageX, e.pageY);
});

document.addEventListener("mouseup", e => {
  if (!draggedCard) return;

  const tableRect = document.getElementById("table").getBoundingClientRect();

  if (
    e.clientX > tableRect.left &&
    e.clientX < tableRect.right &&
    e.clientY > tableRect.top &&
    e.clientY < tableRect.bottom
  ) {
    placeCardOnTable(e.pageX - tableRect.left, e.pageY - tableRect.top);
  }

  draggedCard.remove();
  draggedCard = null;
});

function moveDragged(x, y) {
  draggedCard.style.left = x - 60 + "px";
  draggedCard.style.top = y - 80 + "px";
}

function placeCardOnTable(x, y) {
  const lastSelectedIndex = hand.findIndex(() => true);
  const card = hand.splice(lastSelectedIndex, 1)[0];

  table.push({ ...card, x, y });
  render();
}

/***************
 SWIPER OVERLAY
***************/
let currentIndex = 0;

function openSwiper(card) {
  const o = document.getElementById("handOverlay");
  o.hidden = false;

  currentIndex = hand.indexOf(card);
  renderSwiper();
}

function closeSwiper() {
  document.getElementById("handOverlay").hidden = true;
}

document.getElementById("closeOverlayBtn").onclick = closeSwiper;

function renderSwiper() {
  const track = document.getElementById("swiperTrack");
  track.innerHTML = "";

  hand.forEach((card, i) => {
    const div = document.createElement("div");
    div.className = "swiper-card";

    if (i === currentIndex) div.classList.add("center");

    const img = document.createElement("img");
    img.src = card.front;

    div.appendChild(img);

    div.onclick = () => {
      document.querySelectorAll("#hand .card").forEach(c => c.classList.remove("selected"));
      document.querySelectorAll("#hand .card")[i].classList.add("selected");
      currentIndex = i;
      renderSwiper();
    };

    track.appendChild(div);
  });
}

document.getElementById("swiperPrev").onclick = () => {
  currentIndex = Math.max(0, currentIndex - 1);
  renderSwiper();
};

document.getElementById("swiperNext").onclick = () => {
  currentIndex = Math.min(hand.length - 1, currentIndex + 1);
  renderSwiper();
};

/***************
 MENU OPZIONI
***************/
document.getElementById("optionsBtn").onclick = () => {
  const m = document.getElementById("optionsMenu");
  m.hidden = !m.hidden;
};

/***************
 FULLSCREEN
***************/
document.getElementById("fullscreenBtn").onclick = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    fullscreenBtn.textContent = "Esci full screen";
  } else {
    document.exitFullscreen();
    fullscreenBtn.textContent = "Full screen";
  }
};

/***************
 SALVATAGGI
***************/
function saveGame() {
  const savedGames = JSON.parse(localStorage.getItem("savedGames") || "{}");
  const id = Date.now();

  savedGames[id] = {
    deck,
    hand,
    table,
    timestamp: new Date().toISOString(),
    title: "Salvataggio manuale – " + new Date().toLocaleString()
  };

  localStorage.setItem("savedGames", JSON.stringify(savedGames));
  alert("Partita salvata");
}

document.getElementById("saveBtn").onclick = saveGame;

/***************
 USCITA PARTITA
***************/
function exitGame() {
  document.getElementById("exitPopup").hidden = false;
}

document.getElementById("exitBtn").onclick = exitGame;

function closeExitPopup() {
  document.getElementById("exitPopup").hidden = true;
}

function exitWithoutSaving() {
  closeExitPopup();
  document.getElementById("gameScreen").style.display = "none";
  document.getElementById("startScreen").style.display = "block";
}

function saveAndExit() {
  saveGame();
  exitWithoutSaving();
}
