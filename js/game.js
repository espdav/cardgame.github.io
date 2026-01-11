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
 PRELOAD IMAGES
***************/
function preloadImages() {
  cardImages.forEach(c => {
    new Image().src = c.front;
    new Image().src = c.back;
  });
}
preloadImages();

/***************
 GAME STATE
***************/
let deck = [];
let hand = [];
let table = [];
let selectedHand = [];
let selectedTable = [];
let selectedDeck = [];

/***************
 FULLSCREEN
***************/
function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
    document.getElementById("fullscreenBtn").innerText = "Esci Full Screen";
  } else {
    document.exitFullscreen();
    document.getElementById("fullscreenBtn").innerText = "Full Screen";
  }
}

/***************
 ZOOM
***************/
function openZoom(src) {
  document.getElementById("zoomImg").src = src;
  document.getElementById("zoomOverlay").style.display = "flex";
}
function closeZoom() {
  document.getElementById("zoomOverlay").style.display = "none";
}

/***************
 UTILITIES
***************/
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function toggleSelect(card, list) {
  const i = list.indexOf(card);
  if (i === -1) list.push(card);
  else list.splice(i, 1);
}

function updateDeckSize() {
  document.getElementById("deckSize").innerText = deck.length;
}

/***************
 GENERIC APP POPUP
***************/
function showPopup(message, buttons) {
  const popup = document.getElementById('appPopup');
  const msg = document.getElementById('popupMessage');
  const btnContainer = document.getElementById('popupButtons');

  msg.innerHTML = message;
  btnContainer.innerHTML = '';

  buttons.forEach(b => {
    const btn = document.createElement('button');
    btn.innerText = b.label;
    btn.onclick = () => { popup.style.display='none'; b.action(); };
    btnContainer.appendChild(btn);
  });

  popup.style.display = 'flex';
}

/***************
 START / LOAD
***************/
function startNewGame() {
  deck = cardImages.map(c => ({ front: c.front, back: c.back }));
  hand = [];
  table = [];
  selectedHand = [];
  selectedTable = [];
  selectedDeck = [];
  shuffle(deck);
  render();

  document.getElementById('startScreen').style.display='none';
  document.getElementById('loadScreen').style.display='none';
  document.getElementById('gameScreen').style.display='block';
}

function loadGame() {
  const savedGames = JSON.parse(localStorage.getItem('savedGames') || '{}');
  const listDiv = document.getElementById('savedGamesList');
  listDiv.innerHTML = '';

  const keys = Object.keys(savedGames);
  if (keys.length === 0) {
    showPopup('Nessuna partita salvata.', [{ label:'OK', action:()=>{} }]);
    return;
  }

  keys.sort((a,b)=>b-a);

  keys.forEach(id => {
    const game = savedGames[id];

    const row = document.createElement('div');
    row.style.display='flex';
    row.style.alignItems='center';
    row.style.marginBottom='6px';
    row.style.gap='6px';

    const loadBtn = document.createElement('button');
    loadBtn.innerText = game.title || new Date(game.timestamp).toLocaleString();
    loadBtn.onclick = () => {
      deck = game.deck.map(c => ({ front: c.front, back: c.back }));
      hand = game.hand.map(c => ({ front: c.front, back: c.back }));
      table = game.table.map(c => ({ front: c.front, back: c.back }));
      selectedHand = game.selectedHand || [];
      selectedTable = game.selectedTable || [];
      selectedDeck = [];
      render();

      document.getElementById('loadScreen').style.display='none';
      document.getElementById('gameScreen').style.display='block';
    };

    const deleteBtn = document.createElement('button');
    deleteBtn.innerText = 'Elimina';
    deleteBtn.style.backgroundColor = '#c00';
    deleteBtn.style.color = 'white';
    deleteBtn.onclick = () => deleteSavedGame(id);

    row.appendChild(loadBtn);
    row.appendChild(deleteBtn);
    listDiv.appendChild(row);
  });

  document.getElementById('startScreen').style.display='none';
  document.getElementById('gameScreen').style.display='none';
  document.getElementById('loadScreen').style.display='block';
}

/***************
 SAVE GAME
***************/
function saveGame() {
  const savedGames = JSON.parse(localStorage.getItem('savedGames') || '{}');
  const id = Date.now();
  const timestamp = new Date();
  const title = `Salvataggio manuale - ${timestamp.toLocaleString()}`;

  savedGames[id] = {
    title,
    deck: deck.map(c => ({ front: c.front, back: c.back })),
    hand: hand.map(c => ({ front: c.front, back: c.back })),
    table: table.map(c => ({ front: c.front, back: c.back })),
    selectedHand,
    selectedTable,
    timestamp: timestamp.toISOString()
  };

  localStorage.setItem('savedGames', JSON.stringify(savedGames));

  showPopup('Partita salvata con successo!', [{ label:'OK', action:()=>{} }]);
}

function saveGamePopup() {
  showPopup('Vuoi salvare la partita corrente?', [
    { label:'💾 Salva', action: saveGame },
    { label:'❌ Annulla', action:()=>{} }
  ]);
}

/***************
 DELETE SAVED GAME
***************/
function deleteSavedGame(id) {
  showPopup('Sei sicuro di voler eliminare questo salvataggio?', [
    { label:'✅ Sì', action:()=>{
        const savedGames = JSON.parse(localStorage.getItem('savedGames') || '{}');
        delete savedGames[id];
        localStorage.setItem('savedGames', JSON.stringify(savedGames));
        loadGame();
      } 
    },
    { label:'❌ Annulla', action:()=>{} }
  ]);
}

/***************
 EXIT GAME
***************/
function exitGame() {
  showPopup('Vuoi salvare la partita prima di uscire?', [
    { label:'💾 Salva e Esci', action:()=>{
        saveGame();
        document.getElementById('gameScreen').style.display='none';
        document.getElementById('startScreen').style.display='block';
      } 
    },
    { label:'🚪 Esci senza salvare', action:()=>{
        document.getElementById('gameScreen').style.display='none';
        document.getElementById('startScreen').style.display='block';
      } 
    },
    { label:'❌ Annulla', action:()=>{} }
  ]);
}

/***************
 GAME ACTIONS
***************/
function shuffleDeck() { shuffle(deck); render(); }
function drawCard() { if(deck.length){ hand.push(deck.shift()); render(); } }
function putSelectedBottom() { selectedHand.forEach(c=>{ const i=hand.indexOf(c); if(i!==-1){ hand.splice(i,1); deck.push(c); }}); selectedHand=[]; render(); }
function placeSelectedOnTable() { selectedHand.forEach(c=>{ if(table.length<5){ const i=hand.indexOf(c); if(i!==-1){ hand.splice(i,1); table.push(c); }}}); selectedHand=[]; render(); }
function returnSelectedFromTable() { selectedTable.forEach(c=>{ const i=table.indexOf(c); if(i!==-1){ table.splice(i,1); hand.push(c); }}); selectedTable=[]; render(); }
function toggleDeckView() { const v=document.getElementById('deckView'); v.style.display=(v.style.display==="none"?"block":"none"); render(); }
function moveDeckSelectedToHand() { selectedDeck.forEach(c=>{ const i=deck.indexOf(c); if(i!==-1){ deck.splice(i,1); hand.push(c); }}); selectedDeck=[]; render(); }

/***************
 DOUBLE-TAP / CLICK HANDLER
***************/
let lastTapTime = 0;
let lastTappedCard = null;

function handleCardClick(card, selectedList, isHand=false) {
  const now = Date.now();

  if (lastTappedCard === card && now - lastTapTime < 300) {
    // Doppio click → zoom
    openZoom(card.front);
  } else {
    // Click singolo → selezione
    toggleSelect(card, selectedList);
    render();
  }

  lastTapTime = now;
  lastTappedCard = card;
}

/***************
 RENDER HELPERS
***************/
function makeCardElement(card, selectedList, isHand=false, index=0) {
  const div = document.createElement("div");
  div.className = "card" + (selectedList.includes(card) ? " selected" : "");

  const img = document.createElement("img");
  img.src = card.front;

  if (isHand) {
    div.style.width = "110px";
    div.style.height = "157px";
    div.style.position = "relative";
    div.style.marginLeft = index === 0 ? "0px" : "-30px";
    div.style.zIndex = index;
  }

  div.appendChild(img);

  div.addEventListener("click", () => {
    handleCardClick(card, selectedList, isHand);
  });

  return div;
}

/***************
 RENDER ALL AREAS
***************/
function render() {
  updateDeckSize();

  // Tavolo
  const t = document.getElementById("table");
  t.innerHTML = "";
  table.forEach((c) => t.appendChild(makeCardElement(c, selectedTable)));

  // Mano (fissa in basso, sovrapposta)
  const h = document.getElementById("hand");
  h.innerHTML = "";
  hand.forEach((c, i) => h.appendChild(makeCardElement(c, selectedHand, true, i)));

  // Mazzo visibile
  const d = document.getElementById("deckCards");
  d.innerHTML = "";
  deck.forEach((c) => d.appendChild(makeCardElement(c, selectedDeck)));
}

/***************
 INIT
***************/
document.getElementById('gameScreen').style.display='none';
document.getElementById('loadScreen').style.display='none';
document.getElementById('appPopup').style.display='none';
document.getElementById('zoomOverlay').style.display='none';
