// checkers.js
const readline = require('readline');


/** The state of the game */
var state = {
  over: false,
  turn: 'b',
  board: [
    ['w',null,'w',null,'w',null,'w',null,'w',null,'w'],
    [null,'w',null,'w',null,'w',null,'w',null,'w'],
    ['w',null,'w',null,'w',null,'w',null,'w',null,'w'],
    [null,'w',null,'w',null,'w',null,'w',null,'w'],
    [null, null, null, null, null, null, null, null,null,null],
    [null, 'w', null, null, null, null, null, null,null,null],
    ['b',null,'b',null,'b',null,'b',null,'b',null],
    [null,'b',null,'b',null,'b',null,'b',null,'b'],
    ['b',null,'b',null,'b',null,'b',null,'b',null],
    [null,'b',null,'b',null,'b',null,'b',null,'b']
  ]
}

/** @function getLegalMoves
  * returns a list of legal moves for the specified
  * piece to make.
  * @param {String} piece - 'b' or 'w' for black or white pawns,
  *    'bk' or 'wk' for white or black kings.
  * @param {integer} x - the x position of the piece on the board
  * @param {integer} y - the y position of the piece on the board
  * @returns {Array} the legal moves as an array of objects.
  */
function getLegalMoves(piece, x, y) {
  var moves = [];
  switch(piece) {
    case 'b': // black can only move down the board diagonally
      checkSlide(moves, x-1, y-1);
      checkSlide(moves, x+1, y-1);
      checkJump(moves, {captures:[],landings:[]}, piece, x, y);
      break;
    case 'w':  // white can only move up the board diagonally
      checkSlide(moves, x-1, y+1);
      checkSlide(moves, x+1, y+1);
      checkJump(moves, {captures:[],landings:[]}, piece, x, y);
      break;
    case 'bk': // kings can move diagonally any direction
    case 'wk': // kings can move diagonally any direction
      checkSlide(moves, x-1, y+1);
      checkSlide(moves, x+1, y+1);
      checkSlide(moves, x-1, y-1);
      checkSlide(moves, x+1, y-1);
      checkJump(moves, {captures:[],landings:[]}, piece, x, y);
      break;
  }
  return moves;
}

/** @function checkSlide
  * A helper function to check if a slide move is legal.
  * If it is, it is added to the moves array.
  * @param {Array} moves - the list of legal moves
  * @param {integer} x - the x position of the movement
  * @param {integer} y - the y position of the movement
  */
function checkSlide(moves, x, y) {
  // Check square is on grid
  if(x < 0 || x > 9 || y < 0 || y > 9) return;
  // check square is unoccupied
  if(state.board[y][x]) return;
  // legal move!  Add it to the move list
  moves.push({type: 'slide', x: x, y: y});
}

/** @function copyJumps
  * A helper function to clone a jumps object
  * @param {Object} jumps - the jumps to clone
  * @returns The cloned jump object
  */
function copyJumps(jumps) {
  // Use Array.prototype.slice() to create a copy
  // of the landings and captures array.
  var newJumps = {
    landings: jumps.landings.slice(),
    captures: jumps.captures.slice()
  }
  return newJumps;
}

/** @function checkJump
  * A recursive helper function to determine legal jumps
  * and add them to the moves array
  * @param {Array} moves - the moves array
  * @param {Object} jumps - an object describing the
  *  prior jumps in this jump chain.
  * @param {String} piece - 'b' or 'w' for black or white pawns,
  *    'bk' or 'wk' for white or black kings
  * @param {integer} x - the current x position of the piece
  * @param {integer} y - the current y position of the peice
  */
function checkJump(moves, jumps, piece, x, y) {
  switch(piece) {
    case 'b': // black can only move down the board diagonally
      checkLanding(moves, copyJumps(jumps), piece, x-1, y-1, x-2, y-2);
      checkLanding(moves, copyJumps(jumps), piece, x+1, y-1, x+2, y-2);
      break;
    case 'w':  // white can only move up the board diagonally
      checkLanding(moves, copyJumps(jumps), piece, x-1, y+1, x-2, y+2);
      checkLanding(moves, copyJumps(jumps), piece, x+1, y+1, x+2, y+2);
      break;
    case 'bk': // kings can move diagonally any direction
    case 'wk': // kings can move diagonally any direction
      checkLanding(moves, copyJumps(jumps), piece, x-1, y+1, x-2, y+2);
      checkLanding(moves, copyJumps(jumps), piece, x+1, y+1, x+2, y+2);
      checkLanding(moves, copyJumps(jumps), piece, x-1, y-1, x-2, y-2);
      checkLanding(moves, copyJumps(jumps), piece, x+1, y-1, x+2, y-2);
      break;
  }
}

/** @function checkLanding
  * A helper function to determine if a landing is legal,
  * if so, it adds the jump sequence to the moves list
  * and recursively seeks additional jump opportunities.
  * @param {Array} moves - the moves array
  * @param {Object} jumps - an object describing the
  *  prior jumps in this jump chain.
  * @param {String} piece - 'b' or 'w' for black or white pawns,
  *    'bk' or 'wk' for white or black kings
  * @param {integer} cx - the 'capture' x position the piece is jumping over
  * @param {integer} cy - the 'capture' y position of the peice is jumping over
  * @param {integer} lx - the 'landing' x position the piece is jumping onto
  * @param {integer} ly - the 'landing' y position of the peice is jumping onto
  */
function checkLanding(moves, jumps, piece, cx, cy, lx, ly) {
  // Check landing square is on grid
  if(lx < 0 || lx > 9 || ly < 0 || ly > 9) return;
  // Check landing square is unoccupied
  if(state.board[ly][lx]) return;
  // Check capture square is occuped by opponent
  if((piece == 'b' || piece == 'bk') && (state.board[cy][cx] == 'b' || state.board[cy][cx] == 'bk' || state.board[cy][cx] == null)) return;
  if((piece == 'w' || piece == 'wk') && (state.board[cy][cx] == 'w' || state.board[cy][cx] == 'wk' || state.board[cy][cx] == null)) return;
  // legal jump! add it to the moves list
  jumps.captures.push({x: cx, y: cy});
  jumps.landings.push({x: lx, y: ly});
  moves.push({
    type: 'jump',
    captures: jumps.captures.slice(),
    landings: jumps.landings.slice()
  });
  // check for further jump opportunities
  checkJump(moves, jumps, piece, lx, ly);
}

/**@function ApplyMove
 * Checks if a typed move is legal
 * @param x - initial x position of a piece
 * @param y - initial y position of a piece
 * @param move - a move typed by a player
 * @returns {boolean}
 */
function isLegalMove(x, y, move){
  var legalMoves = getLegalMoves(state.turn, x, y);

  for(var i = 0; i < legalMoves.length; i++){
    if(legalMoves[i].type === move.type){
      if(legalMoves[i].type === "slide" && legalMoves[i].x === move.x && legalMoves[i].y === move.y)
        return true;
      if(legalMoves[i].type === "jump"){
        //TODO check captures and landings
        return true;
      }
    }
  }
  console.log("This is an illegal move. Try 'getLegalMoves' function for help.");
  return false;
}

/** @function ApplyMove
  * A function to apply the selected move to the game
  * @param {object} move - the move to apply.
  */
function applyMove(x, y, move) {
  // TODO: Apply the move
  if(state.board[y][x] !== state.turn){
    console.log("Nice try, but it's opponent's turn.");
    return;
  }

  if(!isLegalMove(x, y, move))
    return;

  if (move.type === "slide") {
    state.board[move.y][move.x] = state.board[y][x];
    state.board[y][x] = null;
  }
  else {
    move.captures.forEach(function(square){
      state.board[square.y][square.x] = null;
    });
    var index = move.landings.length - 1;
    state.board[move.landings[index].y][move.landings[index].x] = state.board[y][x];
    state.board[y][x] = null;
  }
  nextTurn();
  checkForVictory();
}

// TODO: Check for victory
function checkForVictory() {
  var wCount = 0;
  var bCount = 0;
  for (y = 0; y < 10; y++) {
    for (x = 0; x < 10; x++) {
      if (state.board[y][x] === "w" || state.board[y][x] === "wk") {
        wCount++;
      }
      if (state.board[y][x] === "b" || state.board[y][x] === "bk") {
        bCount++;
      }
    }
  }
  if(wCount == 0) {
    state.over = true;
    return "black wins";
  }
  if (bCount == 0){
    state.over = false;
    return "white wins";
  }
  return null;
}

// TODO: Start the next turn
function nextTurn() {
  if(state.turn === "b") {
    state.turn = "w";
  } else {
    state.turn = "b";
  }
}

/**
 * Printing function implemented by me on 8/28
 */
function printBoard() {
  console.log("     a   b   c   d   e   f   g   h   i   j");
  var boardLine = "|";
  for (y = 0; y < 10; y++){
    for (x = 0; x < 10; x++){
      if(state.board[y][x] === 'b' || state.board[y][x] === 'bk')
        boardLine += " \u263B ";
      else if (state.board[y][x] === 'w' || state.board[y][x] === 'wk')
        boardLine += " \u263A ";
      else
        boardLine += "   ";
      boardLine += "|";
    }
    console.log(y, boardLine);
    boardLine = "|";
  }
}

/**
 * Printing function implemented in class
 */
function printBoard2(){
  console.log("   a b c d e f g h i j")
  state.board.forEach(function(row, index){
    var ascii = row.map(function(square){
      if(!square) return '_';
      else return square;
    }).join('|');
    console.log(index, ascii);
  });
}

function main(){
  //initialize readline
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  //print the board
  printBoard();
  //offer instructions
  console.log(state.turn + "'s turn");
  rl.question("Pick a piece to move, (letter, number)", function(answer) {
    //Figure out whate piece the user asked to move
    var match = /([a-j]),?\s?([0-9])/.exec(answer);
    if(match) {
      var x = match[1].charCodeAt(0) - 97;
      var y = parseInt(match[2]);
      var piece = state.board[y][x];
      var moves = getLegalMoves(piece, x, y);
      moves.forEach(function(move){
        if(move.type === "slide") {
          console.log("You can slide to " + String.fromCharCode(97 + move.x) + ", " + move.y);
        } else {
          var logString = "You can jump to";
          move.landings.forEach(function(landing) {
            logString += " " + String.fromCharCode(97 + landing.x) + "," + landing.y;
          });
          logString += " capturing opponent's pieces on";
          move.captures.forEach(function(capture){
            logString += " " + String.fromCharCode(97 + capture.x) + "," + capture.y;
          });
          console.log(logString);
        }
      })
    }
  });
};

main();

//printBoard();