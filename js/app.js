/*-------------------------------- Constants --------------------------------*/
const winningCombos = [
  //across wins
  [0,1,2], 
  [3,4,5], 
  [6,7,8], 
  //column wins
  [0,3,6], 
  [1,4,7], 
  [2,5,8], 
  //diagonal wins
  [0,4,8], 
  [2,4,6]]


/*---------------------------- Variables (state) ----------------------------*/
let board, turn, winner, tie, cat, catlady
let currentPlayer=null
let scoreBoard = {
  catWins: 0,
  catLadyWins: 0,
  ties: 0
}




/*------------------------ Cached Element References ------------------------*/
const startScreen = document.querySelector('.start-screen')
const gamePlay = document.querySelector('.game-play')
const catButton = document.getElementById('cat')
const catLadyButton = document.getElementById('catlady')
const squareEls = document.querySelectorAll('.sqr')
const messageEl = document.querySelector('#message')
//reset button
const resetBtn = document.getElementById('reset-btn')
const catScore = document.getElementById('catScore')
const catLadyScore = document.getElementById('catLadyScore')
const gameBoardEl = document.querySelector('.board')

/*----------------------------- Event Listeners -----------------------------*/
catButton.addEventListener('click', () => selectPlayer('cat'))
catLadyButton.addEventListener('click', () => selectPlayer('catlady'))
//square els targeting the item clickSquare to invote click and handle Click function
squareEls.forEach(function(squareEl){
  squareEl.addEventListener('click', handleClick)
})
//listens for the click of a reset button
resetBtn.addEventListener('click', init) 


/*-------------------------------- Functions --------------------------------*/
function selectPlayer (player){
  currentPlayer = player
  startGame()
}
function startGame(){
  startScreen.style.display='none'
  gamePlay.style.display='block'
  init()
}


function init (){
  board = [null, null, null, null, null, null, null, null, null]
  turn = (currentPlayer === 'catlady') ? 1 : -1
  winner = false
  tie = false
  updateScoreBoard()
  render ()
}

function render(){
  updateBoard()
  updateMessage()
}

function updateBoard(){
  board.forEach(function (boardVal, idx){
    //if boardVal is null then this happens
    if (boardVal === null) {
      //should display nothing
      squareEls[idx].textContent = ' '
      squareEls[idx].style.backgroundColor = 'transparent'
    }
    //if boardVal is -1 then this happens
    else if (boardVal === 1) {
      //should display X
      squareEls[idx].textContent = 'Cat Lady'
      squareEls[idx].innerHTML =`<img src="../assets/images/frustratedwoman.jpg" alt="a frustrated woman">`
    }
    //if boardVal is 1 then this happens
    else if (boardVal === -1) {
      //should display O
      squareEls[idx].textContent = 'Cat'
      squareEls[idx].innerHTML =`<img src="../assets/images/winkingcat.jpg" alt="a square cat">`
    }
  })
}

function updateMessage(){
  if (!winner && !tie) {
    //condition ? resultIfTruthy : result if falsy
    messageEl.innerHTML = `${turn === 1 ? 'Cat Lady' : 'Cat'}, it's your turn! 🐾 Be paw-sitive!`
  }
  else if (!winner && tie) {
    messageEl.innerHTML = `We can't all be purrfect. 🙀 Play again?`
  }
  else {
    messageEl.innerHTML = `${turn === 1 ? 'Cat Lady' : 'Cat'} wins! 😻 You're the cat's meow! Lets play!`
  }
}
//function called handleClick with event parameter
function handleClick(evt) {
  if (!currentPlayer || board[parseInt(evt.target.id.substring(2))] || winner) {
    return;
  }
  placePiece(parseInt(evt.target.id.substring(2)));
  checkForTie();
  checkForWinner();
  switchPlayerTurn();
  render();
}

//create function called placePiece that accepts an index parameter
function placePiece(idx){
  // let board array at the index update to current value of turn
  board [idx] = turn
}

function checkForTie(){
  if(board.includes(null)){
    return
  }
  tie = true
  scoreBoard.ties++
}

function checkForWinner() {
  winningCombos.forEach(function(combo) {
    if (Math.abs(board[combo[0]] + board[combo[1]] + board[combo[2]]) === 3) {
      winner = true;
      if (turn === 1) {
        scoreBoard.catLadyWins++;
      } else {
        scoreBoard.catWins++;
      }
      updateScoreBoard()
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
  if (winner === true){
    return
  }
  turn = (currentPlayer === 'catlady') ? 1 : -1
}

