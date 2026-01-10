/***************
 CARD IMAGES
***************/
const cardImages = [
  {front:"cards/foraterra.png", back:"cards/back.png"},
  {front:"cards/codafrusta.png", back:"cards/back.png"},
  {front:"cards/longipede.png", back:"cards/back.png"},
  {front:"cards/manticerio.png", back:"cards/back.png"},
  {front:"cards/rovistatore.png", back:"cards/back.png"},
  {front:"cards/spazzino.png", back:"cards/back.png"},
  {front:"cards/vedetta_occhio_rosso.png", back:"cards/back.png"},
  {front:"cards/squarciavento_alfa.png", back:"cards/back.png"},
];

/***************
 PRELOAD IMAGES
***************/
function preloadImages(){
  cardImages.forEach(c=>{
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
 DOUBLE-TAP
***************/
let lastTap = 0;
function cardTapped(card,imgSrc){
  const now = Date.now();
  if(now - lastTap < 300) openZoom(imgSrc);
  lastTap = now;
}

/***************
 FULLSCREEN
***************/
function toggleFullScreen(){
  if(!document.fullscreenElement){
    document.documentElement.requestFullscreen().catch(()=>{});
    document.getElementById("fullscreenBtn").innerText="Esci Full Screen";
  } else {
    document.exitFullscreen();
    document.getElementById("fullscreenBtn").innerText="Full Screen";
  }
}

/***************
 ZOOM
***************/
function openZoom(src){
  document.getElementById("zoomImg").src = src;
  document.getElementById("zoomOverlay").style.display = "flex";
}
function closeZoom(){
  document.getElementById("zoomOverlay").style.display = "none";
}

/***************
 UTILITIES
***************/
function shuffle(array){
  for(let i=array.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [array[i],array[j]]=[array[j],array[i]];
  }
}
function toggleSelect(card,list){
  const i=list.indexOf(card);
  if(i===-1) list.push(card);
  else list.splice(i,1);
}
function updateDeckSize(){
  document.getElementById("deckSize").innerText = deck.length;
}

/***************
 START / LOAD
***************/
function startNewGame(){
  deck = [...cardImages];
  hand = [];
  table = [];
  selectedHand = [];
  selectedTable = [];
  selectedDeck = [];
  shuffle(deck);
  render();

  document.getElementById('startScreen').style.display = 'none';
  document.getElementById('gameScreen').style.display = 'block';
}

/***************
 SAVE GAME
***************/
function saveGame(){
  let savedGames = JSON.parse(localStorage.getItem('savedGames')||'{}');
  const id = Date.now();
  const timestamp = new Date();
  const title = `Salvataggio manuale - ${timestamp.toLocaleString()}`;

  // salviamo solo gli indici delle carte
  const savedDeck = deck.map(c => cardImages.indexOf(c));
  const savedHand = hand.map(c => cardImages.indexOf(c));
  const savedTable = table.map(c => cardImages.indexOf(c));
  const savedSelectedHand = selectedHand.map(c => cardImages.indexOf(c));
  const savedSelectedTable = selectedTable.map(c => cardImages.indexOf(c));

  savedGames[id] = {
    title,
    deck: savedDeck,
    hand: savedHand,
    table: savedTable,
    selectedHand: savedSelectedHand,
    selectedTable: savedSelectedTable,
    timestamp: timestamp.toISOString()
  };

  localStorage.setItem('savedGames', JSON.stringify(savedGames));
  alert('Partita salvata con successo!');
}

/***************
 LOAD GAME LIST
***************/
function loadGame(){
  const savedGames = JSON.parse(localStorage.getItem('savedGames')||'{}');
  const listDiv = document.getElementById('savedGamesList');
  listDiv.innerHTML = '';

  const keys = Object.keys(savedGames);
  if(keys.length === 0){
    alert('Nessuna partita salvata.');
    return;
  }

  keys.sort((a,b)=>b-a); // mostra prima i più recenti

  keys.forEach(id=>{
    const game = savedGames[id];

    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.alignItems = 'center';
    row.style.marginBottom = '6px';
    row.style.gap = '6px';

    const loadBtn = document.createElement('button');
    loadBtn.innerText = game.title;
    loadBtn.onclick = ()=>{
      // ricostruisci gli oggetti dalle posizioni
      deck = game.deck.map(i => cardImages[i]);
      hand = game.hand.map(i => cardImages[i]);
      table = game.table.map(i => cardImages[i]);
      selectedHand = game.selectedHand.map(i => cardImages[i]);
      selectedTable = game.selectedTable.map(i => cardImages[i]);
      selectedDeck = [];
      render();

      document.getElementById('loadScreen').style.display='none';
      document.getElementById('gameScreen').style.display='block';
    };

    const deleteBtn = document.createElement('button');
    deleteBtn.innerText = 'Elimina';
    deleteBtn.style.backgroundColor = '#c00';
    deleteBtn.style.color = 'white';
    deleteBtn.onclick = ()=>{
      if(confirm('Sei sicuro di voler eliminare questo salvataggio?')){
        delete savedGames[id];
        localStorage.setItem('savedGames', JSON.stringify(savedGames));
        loadGame(); // aggiorna la lista
      }
    };

    row.appendChild(loadBtn);
    row.appendChild(deleteBtn);
    listDiv.appendChild(row);
  });

  document.getElementById('startScreen').style.display='none';
  document.getElementById('loadScreen').style.display='block';
}

function backToStart(){
  document.getElementById('loadScreen').style.display='none';
  document.getElementById('startScreen').style.display='block';
}

/***************
 GAME ACTIONS
***************/
function shuffleDeck(){
  shuffle(deck);
  render();
}

function drawCard(){
  if(!deck.length) return;
  hand.push(deck.shift());
  render();
}

function putSelectedBottom(){
  selectedHand.forEach(c=>{
    const i = hand.indexOf(c);
    if(i!==-1){ hand.splice(i,1); deck.push(c); }
  });
  selectedHand = [];
  render();
}

function placeSelectedOnTable(){
  selectedHand.forEach(c=>{
    if(table.length<5){
      const i = hand.indexOf(c);
      if(i!==-1){ hand.splice(i,1); table.push(c); }
    }
  });
  selectedHand = [];
  render();
}

function returnSelectedFromTable(){
  selectedTable.forEach(c=>{
    const i = table.indexOf(c);
    if(i!==-1){ table.splice(i,1); hand.push(c); }
  });
  selectedTable = [];
  render();
}

function toggleDeckView(){
  const v = document.getElementById('deckView');
  v.style.display = v.style.display==="none"?"block":"none";
  render();
}

function moveDeckSelectedToHand(){
  selectedDeck.forEach(c=>{
    const i = deck.indexOf(c);
    if(i!==-1){ deck.splice(i,1); hand.push(c); }
  });
  selectedDeck=[];
  render();
}

/***************
 RENDER HELPERS
***************/
function makeCardElement(card,selectedList){
  const div = document.createElement("div");
  div.className = "card" + (selectedList.includes(card)?" selected":"");

  const img = document.createElement("img");
  img.src = card.front;
  div.appendChild(img);

  div.onclick = ()=>{
    toggleSelect(card,selectedList);
    cardTapped(card,card.front);
    render();
  };
  return div;
}

/***************
 RENDER ALL AREAS
***************/
function render(){
  updateDeckSize();

  const h = document.getElementById("hand");
  h.innerHTML = "";
  hand.forEach(c=>h.appendChild(makeCardElement(c,selectedHand)));

  const t = document.getElementById("table");
  t.innerHTML = "";
  table.forEach(c=>t.appendChild(makeCardElement(c,selectedTable)));

  const d = document.getElementById("deckCards");
  d.innerHTML = "";
  deck.forEach(c=>d.appendChild(makeCardElement(c,selectedDeck)));
}

/***************
 INIT
***************/
document.getElementById('gameScreen').style.display='none';
document.getElementById('loadScreen').style.display='none';
