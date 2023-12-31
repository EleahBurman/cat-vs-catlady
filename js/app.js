/*-------------------------------- Constants --------------------------------*/
const winningCombos = [
  //across wins
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  //column wins
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  //diagonal wins
  [0, 4, 8],
  [2, 4, 6]
];

/*---------------------------- Variables (state) ----------------------------*/
let board, winner, tie, aiGameMode;
let currentPlayer = null;
let currentAiPlayer = null; // Track the current player for AI
let scoreBoard = {
  catWins: 0,
  catLadyWins: 0,
  ties: 0
};
let isFirstComputerMove = true;
let isComputerTurn = false;
/*------------------------ Cached Element References ------------------------*/
const human = document.getElementById('human');
const computer = document.getElementById('computer');
const startScreen = document.querySelector('.start-screen');
const vsHumanOrComputer = document.querySelector('.vs-human-or-computer');
const gamePlay = document.querySelector('.game-play');
const catButton = document.getElementById('cat');
const catLadyButton = document.getElementById('catlady');
const squareEls = document.querySelectorAll('.sqr');
const messageEl = document.querySelector('#message');
const resetBtn = document.getElementById('reset-btn');
const lightDarkButton = document.querySelector('.light-dark-btn')
const resetWithAiBtn = document.getElementById('reset-with-ai-btn');
const catScore = document.getElementById('catScore');
const catLadyScore = document.getElementById('catLadyScore');
const tieScore = document.getElementById('tieScore'); // Added tieScore element
const gameBoardEl = document.querySelector('.board');
const body = document.querySelector('body')

/*----------------------------- Event Listeners -----------------------------*/
catButton.addEventListener('click', () => selectPlayer('cat'));
catLadyButton.addEventListener('click', () => selectPlayer('catlady'));
squareEls.forEach(function (squareEl) {
  squareEl.addEventListener('click', handleClick);
});
resetBtn.addEventListener('click', init);
resetWithAiBtn.addEventListener('click', initWithAi);
computer.addEventListener('click', () => {
  initWithAi();
});
human.addEventListener('click', () => {
  vsHumanOrComputer.style.display = 'none'; // Show the vs-human-or-computer section
  startScreen.style.display = 'block'; // Hide the game-play section
});
// Add an event listener to a parent element that contains '.sqr' elements
document.querySelector('.board').addEventListener('mouseover', function (event) {
  // Check if the event target is an '.sqr' element
  if (event.target.classList.contains('sqr')) {
    // Apply the hover effect styles here
    event.target.style.backgroundColor = '#6c76ff';
    event.target.style.zIndex = '2';
  }
});

// Add another event listener to remove the hover effect when the mouse leaves
document.querySelector('.board').addEventListener('mouseout', function (event) {
  // Check if the event target is an '.sqr' element
  if (event.target.classList.contains('sqr')) {
    // Remove the hover effect styles here
    event.target.style.backgroundColor = 'transparent';
    event.target.style.zIndex = '0';
  }
});
//lightdark button to click for a light mode versus dark mode
lightDarkButton.addEventListener('click', light)
/*-------------------------------- Functions --------------------------------*/
function selectPlayer(player) {
  startScreen.style.display = 'block';
  vsHumanOrComputer.style.display = 'none';

  if (player === 'computer') {
    currentPlayer = 'computer'; // Set currentPlayer to 'computer'
    currentAiPlayer = 'catlady'; // Set currentAiPlayer to 'catlady'
  } else {
    currentPlayer = player;
  }
  startGame();
}

function startGame() {
  vsHumanOrComputer.style.display = 'none';
  startScreen.style.display = 'none';
  gamePlay.style.display = 'block';
  buildGame();
}

function buildGame() {
  board = [null, null, null, null, null, null, null, null, null];
  turn = (currentPlayer === 'catlady') ? 1 : -1;
  winner = false;
  tie = false;
  emptyCells = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  updateScoreBoard();
  render();
}

function init() {
  aiGameMode = false;
  buildGame();
}

function initWithAi() {
  aiGameMode = true;
  currentAiPlayer = 'catlady'; // Set currentAiPlayer to 'catlady'
  currentPlayer = currentAiPlayer; // Set currentPlayer to AI player
  board = [null, null, null, null, null, null, null, null, null];
  vsHumanOrComputer.style.display = 'none';
  gamePlay.style.display = 'block';
  handleAiTurn(); // Make the AI take the first turn
}

function handleAiTurn() {
  console.log("AI is taking its turn");
  isComputerTurn = true; // Disable human interaction

  if (!winner) {
    const emptySquareEls = Array.from(squareEls).filter((squareEl) => {
      const idx = parseInt(squareEl.id.substring(2));
      return board[idx] === null;
    });

    if (emptySquareEls.length > 0) {
      setTimeout(() => {
        const aiSquareEl = emptySquareEls[Math.floor(Math.random() * emptySquareEls.length)];
        const aiIdx = parseInt(aiSquareEl.id.substring(2));
        placePiece(aiIdx);
        checkForTie();
        checkForWinner();
        switchPlayerTurn();
        render();
        isComputerTurn = false; // Re-enable human interaction

        if (isFirstComputerMove) {
          setTimeout(() => {
            isFirstComputerMove = false;
          }, 0);
        }
      }, isFirstComputerMove ? 500 : 2000);
    }
  }
}


function render() {
  updateBoard();
  updateMessage();
}

function updateBoard() {
  board.forEach(function (boardVal, idx) {
    if (boardVal === null) {
      squareEls[idx].textContent = ' ';
      squareEls[idx].style.backgroundColor = 'transparent';
    } else if (boardVal === 1) {
      squareEls[idx].textContent = 'Cat Lady';
      squareEls[idx].innerHTML = `<img src="../assets/images/frustratedwoman.jpg" alt="a frustrated woman">`;
    } else if (boardVal === -1) {
      squareEls[idx].textContent = 'Cat';
      squareEls[idx].innerHTML = `<img src="../assets/images/winkingcat.jpg" alt="a square cat">`;
    }
  });
}

function updateMessage() {
  if (!winner && !tie) {
    messageEl.innerHTML = `${currentPlayer === 'catlady' ? 'Cat Lady' : 'Cat'}, it's your turn! 🐾 Be paw-sitive!`;
  } else if (!winner && tie) {
    messageEl.innerHTML = `We can't all be purrfect. 🙀 Play again?`;
  } else {
    messageEl.innerHTML = `${currentPlayer === 'catlady' ? 'Cat Lady' : 'Cat'} wins! 😻 You're the cat's meow! Let's play!`;
  }
}

function handleClick(evt) {
  if (isComputerTurn || !currentPlayer || board[parseInt(evt.target.id.substring(2))] !== null || winner) {
    return;
  }
  const idx = parseInt(evt.target.id.substring(2));
  placePiece(idx);
  checkForTie();
  checkForWinner();
  switchPlayerTurn();
  render();
  if (aiGameMode && !winner && currentPlayer === currentAiPlayer) {
    handleAiTurn();
  }
}

function placePiece(idx) {
  board[idx] = (currentPlayer === 'catlady') ? 1 : -1;
}

function checkForTie() {
  if (board.includes(null)) {
    return;
  }
  tie = true;
  scoreBoard.ties++;
  updateScoreBoard();
}

function checkForWinner() {
  winningCombos.forEach(function (combo) {
    if (Math.abs(board[combo[0]] + board[combo[1]] + board[combo[2]]) === 3) {
      winner = true;
      if (currentPlayer === 'catlady') {
        scoreBoard.catLadyWins++;
      } else {
        scoreBoard.catWins++;
      }
      updateScoreBoard();
      confetti.start(1500);
    }
  });
}

function updateScoreBoard() {
  catScore.textContent = scoreBoard.catWins;
  catLadyScore.textContent = scoreBoard.catLadyWins;
  tieScore.textContent = scoreBoard.ties;
}

function switchPlayerTurn() {
  if (winner === true) {
    return;
  }
  currentPlayer = (currentPlayer === 'catlady') ? 'cat' : 'catlady';
}

function light(){
  body.classList.toggle('light')
  if (body.classList.contains('light')){
    lightDarkButton.innerText = 'Light Mode'
    lightDarkButton.classList.toggle('light-color')
  } else {
    lightDarkButton.innerText = 'Dark Mode'
    lightDarkButton.classList.toggle('dark-color')
  }
  const headerOne = document.querySelector('h1')
  headerOne.classList.toggle('light')
  const headerTwo = document.querySelector('h2#message')
  headerTwo.classList.toggle('light')
}

function checkLightPref() {
  if (
    window.matchMedia('(prefers-color-scheme:light)').matches &&
    body.className !== 'light'
  ) {
    light()
  }
}
checkLightPref()