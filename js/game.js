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
    const f=new Image(); f.src=c.front;
    const b=new Image(); b.src=c.back;
  });
}
preloadImages();

/***************
 GAME STATE
***************/
let deck=[], hand=[], table=[];
let selectedHand=[], selectedTable=[], selectedDeck=[];

/***************
 START / LOAD / SAVE
***************/
function startNewGame(){
  deck=[...cardImages];
  shuffle(deck);
  hand=[]; table=[];
  selectedHand=[]; selectedTable=[]; selectedDeck=[];
  render();
  document.getElementById('startScreen').style.display='none';
  document.getElementById('gameScreen').style.display='block';
}

function saveGame(){
  const state = { deck, hand, table, selectedHand, selectedTable };
  localStorage.setItem('savedGame', JSON.stringify(state));
  alert('Partita salvata!');
}

function loadGame(){
  const saved = localStorage.getItem('savedGame');
  if(saved){
    const state = JSON.parse(saved);
    deck=state.deck; hand=state.hand; table=state.table;
    selectedHand=state.selectedHand; selectedTable=state.selectedTable;
    render();
    document.getElementById('startScreen').style.display='none';
    document.getElementById('gameScreen').style.display='block';
  } else {
    alert('Nessuna partita salvata.');
  }
}

/***************
 UTILS
***************/
function shuffle(array){
  for(let i=array.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [array[i],array[j]]=[array[j],array[i]];
  }
}

function updateDeckSize(){
  document.getElementById("deckSize").innerText=deck.length;
}

function toggleSelect(card,list){
  const i=list.indexOf(card);
  if(i===-1) list.push(card);
  else list.splice(i,1);
}

/***************
 CORE ACTIONS
***************/
function shuffleDeck(){ shuffle(deck); render(); }
function drawCard(){ if(!deck.length) return; hand.push(deck.shift()); render(); }
function toggleDeckView(){ const v=document.getElementById("deckView"); v.style.display=v.style.display==="none"?"block":"none"; render(); }

function putSelectedBottom(){ selectedHand.forEach(c=>{ let i=hand.indexOf(c); if(i!==-1){hand.splice(i,1);deck.push(c);} }); selectedHand=[]; render(); }
function placeSelectedOnTable(){ selectedHand.forEach(c=>{ if(table.length<5){ let i=hand.indexOf(c); if(i!==-1){hand.splice(i,1);table.push(c);} } }); selectedHand=[]; render(); }
function returnSelectedFromTable(){ selectedTable.forEach(c=>{ let i=table.indexOf(c); if(i!==-1){table.splice(i,1);hand.push(c);} }); selectedTable=[]; render(); }
function moveDeckSelectedToHand(){ selectedDeck.forEach(c=>{ let i=deck.indexOf(c); if(i!==-1){deck.splice(i,1);hand.push(c);} }); selectedDeck=[]; render(); }

/***************
 DOUBLE-TAP CARD ZOOM
***************/
let lastTap=0;
function cardTapped(card,imgSrc){
  const now=Date.now();
  if(now-lastTap<300){ openZoom(imgSrc); }
  lastTap=now;
}

/***************
 FULLSCREEN
***************/
function toggleFullScreen(){
  if(!document.fullscreenElement){
    document.documentElement.requestFullscreen().catch(()=>{});
    document.getElementById("fullscreenBtn").innerText="Esci Schermo Intero";
  } else {
    document.exitFullscreen();
    document.getElementById("fullscreenBtn").innerText="Schermo Intero";
  }
}

/***************
 ZOOM
***************/
function openZoom(src){
  document.getElementById("zoomImg").src=src;
  document.getElementById("zoomOverlay").style.display="flex";
}
function closeZoom(){ document.getElementById("zoomOverlay").style.display="none"; }

/***************
 RENDER HELPERS
***************/
function makeCardElement(card,selectedList){
  const div=document.createElement("div");
  div.className="card"+(selectedList.includes(card)?" selected":"");
  const img=document.createElement("img");
  img.src=card.front; div.appendChild(img);
  div.onclick=()=>{
    toggleSelect(card,selectedList);
    cardTapped(card,card.front);
    render();
  };
  return div;
}

function render(){
  updateDeckSize();
  const h=document.getElementById("hand"); h.innerHTML=""; hand.forEach(c=>h.appendChild(makeCardElement(c,selectedHand)));
  const t=document.getElementById("table"); t.innerHTML=""; table.forEach(c=>t.appendChild(makeCardElement(c,selectedTable)));
  const d=document.getElementById("deckCards"); d.innerHTML=""; deck.forEach(c=>d.appendChild(makeCardElement(c,selectedDeck)));
}

/***************
 INIT
***************/
deck=[...cardImages];
shuffle(deck);
