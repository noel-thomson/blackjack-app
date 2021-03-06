let gameOn; let activePlayer; let scores; let cardValue; let cardSrc;
let drawnCard; let drawnCards; let holdCount; let drawCount;

const suits = ['C', 'D', 'H', 'S'];
const faces = ['J', 'Q', 'K', 'N'];
const cardDisplay = document.querySelector('.card');
const miniCards = document.getElementsByClassName('drawn-card');
const click = new Audio('./sounds/click.wav');
const drawOne = new Audio('./sounds/draw-one.wav');
const bust = new Audio('./sounds/bust.wav');
const winner = new Audio('./sounds/winner.wav');

document.querySelector('.btn-draw').addEventListener('click', function () {
  if (gameOn) {
    playDrawOne();
    drawCount[activePlayer]++;
    cardValue = Math.floor(Math.random() * 10) + 1;
    determineCardSrc(cardValue);
    appendMiniCard(cardSrc);
    initialAceValue(cardValue);
    drawnCards[activePlayer].push(cardValue); // push cardValue into arr
    determineAceConversion(cardValue); // determine if ace value should change
    console.log('0: ' + drawnCards[0]);
    console.log('1: ' + drawnCards[1]);
    gameLogic(cardValue, scores);
  } else {
    playWinner();
  }
});

document.querySelector('.btn-hold').addEventListener('click', function () {
  if (gameOn) {
    if (drawCount[activePlayer] < 2) {
      playBust();
      return;
    }

    holdCount[activePlayer]++;
    playClick();
    if (holdCount[activePlayer] > 0 && (scores[0] > 0 && scores[1] > 0)) {
      gameEnd();
      gameOn = false;
      return;
    }

    switchPlayer();
  }

  playClick();
});

document.querySelector('.btn-new').addEventListener('click', function () {
  playClick();
  init();
});

init();

function init() {
  gameOn = true;
  activePlayer = 0;
  scores = [0, 0];
  drawnCards = [
    playerOne = [], // cardValue(s)
    playerTwo = [], // cardValue(s)
  ];
  holdCount = [0, 0];
  drawCount = [0, 0];
  resetDom();
}

function determineCardSrc() { // requires cardValue
  if (cardValue === 10) {
    faceValue = Math.floor(Math.random() * 3) + 1;
    suitValue = Math.floor(Math.random() * 3) + 1;
    face = faces[faceValue];
    suit = suits[suitValue];
    cardSrc = './cards/' + cardValue + face + suit + '.png';
    cardDisplay.src = cardSrc;
    cardDisplay.style.display = 'block';
  } else {
    suitValue = Math.floor(Math.random() * 3) + 1;
    suit = suits[suitValue];
    cardSrc = './cards/' + cardValue + suit + '.png';
    cardDisplay.src = cardSrc;
    cardDisplay.style.display = 'block';
  }
}

function appendMiniCard() { // requires cardSrc
  drawnCard = document.createElement('img');
  if (activePlayer === 0) {
    document.getElementById('drawn-cards-0').appendChild(drawnCard);
  } else {
    document.getElementById('drawn-cards-1').appendChild(drawnCard);
  }

  drawnCard.src = cardSrc;
  drawnCard.classList.add('drawn-card');
}

function initialAceValue() { // requires cardValue
  if (cardValue === 1 && scores[activePlayer] < 11) {
    cardValue = 11;
  }
}

function determineAceConversion() { // requires cardValue
  let index = drawnCards[activePlayer].indexOf(11); // find index of 11
  if (scores[activePlayer] + cardValue > 21 && index !== -1) { // -1 if no 11 in array
    drawnCards[activePlayer][index] = 1; // edit array value 11 to 1
    let sum = 0;
    for (var i = 0; i < (drawnCards[activePlayer].length - 1); i++) {
      sum += drawnCards[activePlayer][i];
    } // recalculate score (omitting current cardValue)

    scores[activePlayer] = sum;
  }
}

function gameLogic() { // requires cardValue and scores
  if (scores[activePlayer] + cardValue === 21) {
    playWinner();
    scores[activePlayer] += cardValue;
    document.querySelector('#current-' + activePlayer).textContent = 'Winner';
    document.querySelector('#score-' + activePlayer).textContent = scores[activePlayer];
    gameOn = false;
    document.querySelector('#current-' + activePlayer).classList.add('winner-text');
  } else if (scores[activePlayer] + cardValue > 21) {
    setTimeout(function () {
      playWinner();
    }, 300);

    playBust();
    scores[activePlayer] += cardValue;
    document.querySelector('#current-' + activePlayer).textContent = 'Bust';
    document.querySelector('#score-' + activePlayer).textContent = scores[activePlayer];
    if (activePlayer === 0) {
      document.querySelector('.player-0-panel').classList.remove('active');
      document.querySelector('.player-1-panel').classList.add('active');
      document.querySelector('#current-' + 1).textContent = 'Winner';
      document.querySelector('#current-' + 1).classList.add('winner-text');
    } else if (activePlayer === 1) {
      document.querySelector('.player-1-panel').classList.remove('active');
      document.querySelector('.player-0-panel').classList.add('active');
      document.querySelector('#current-' + 0).textContent = 'Winner';
      document.querySelector('#current-' + 0).classList.add('winner-text');
    }

    gameOn = false;
  } else if (scores[activePlayer] + cardValue < 21) {
    scores[activePlayer] += cardValue;
    document.querySelector('#score-' + activePlayer).textContent = scores[activePlayer];
  }
}

function gameEnd() {
  if (scores[0] > scores[1]) {
    playWinner();
    document.querySelector('#current-' + 0).textContent = 'Winner';
    document.querySelector('.player-1-panel').classList.remove('active');
    document.querySelector('.player-0-panel').classList.add('active');
    document.querySelector('#current-' + 0).classList.add('winner-text');
  } else if (scores[1] > scores[0]) {
    playWinner();
    document.querySelector('#current-' + 1).textContent = 'Winner';
    document.querySelector('.player-0-panel').classList.remove('active');
    document.querySelector('.player-1-panel').classList.add('active');
    document.querySelector('#current-' + 1).classList.add('winner-text');
  } else if (scores[0] = scores[1]) {
    playWinner();
    document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active');
    document.querySelector('#current-' + 0).textContent = 'Draw';
    document.querySelector('#current-' + 1).textContent = 'Draw';
    document.querySelector('#current-' + 0).classList.add('draw-text');
    document.querySelector('#current-' + 1).classList.add('draw-text');
  }
}

function switchPlayer() {
  if (activePlayer === 0) {
    activePlayer = 1;
  } else {
    activePlayer = 0;
  }

  document.querySelector('.player-0-panel').classList.toggle('active');
  document.querySelector('.player-1-panel').classList.toggle('active');
  cardDisplay.style.display = 'none';
}

function resetDom() {
  cardDisplay.style.display = 'none';
  document.getElementById('score-0').textContent = '0';
  document.getElementById('score-1').textContent = '0';
  document.getElementById('current-0').textContent = 'Player 1';
  document.getElementById('current-1').textContent = 'Player 2';
  document.querySelector('.player-0-panel').classList.remove('winner');
  document.querySelector('.player-1-panel').classList.remove('winner');
  document.querySelector('.player-0-panel').classList.remove('active');
  document.querySelector('.player-1-panel').classList.remove('active');
  document.querySelector('.player-0-panel').classList.add('active');
  document.getElementById('current-0').classList.remove('winner-text');
  document.getElementById('current-1').classList.remove('winner-text');
  document.getElementById('current-0').classList.remove('draw-text');
  document.getElementById('current-1').classList.remove('draw-text');
  while (miniCards[0]) {
    miniCards[0].parentNode.removeChild(miniCards[0]);
  }
}

function playClick() {
  click.play();
}

function playBust() {
  bust.play();
}

function playDrawOne() {
  drawOne.play();
}

function playWinner() {
  winner.play();
}

// myParent.insertBefore(myElement, myParent.firstElementChild); <-- add to beginning
// myParent.removeChild(myElement); <-- remove specific element
// myParent.replaceChild(replaceMe, newElement); <-- replace element with another
