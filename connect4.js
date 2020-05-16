/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

let WIDTH = 7;
let HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 *    set "board" to empty HEIGHT x WIDTH matrix array
 */

function makeBoard() {
  for (let i = 0; i < HEIGHT; i++) {
    const row = [];
    for (let j = 0; j < WIDTH; j++) {
      row.push(null);
    }
    board.push(row);
  }
}

// makeHtmlBoard: make HTML table and row of column tops. */
function makeHtmlBoard() {

  // get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.getElementById("board");

  // CREATES TOP OF TABLE WITH ID & CLICKABLE EVENT LISTENER
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // Creates table rows & columns with IDS "Y-X"
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

// findSpotForCol: given column x, return top empty y (null if filled)
function findSpotForCol(x) {
  for (let i = 5; i >= 0; i--) {
    if (board[i][x] == null) {
      return i;
    }
  }
}

//placeInTable: update DOM to place piece into HTML table of board 
function placeInTable(y, x) {
  // create div and insert into correct table cell
    const divPiece = document.createElement("div");
    let newClass = "p" + currPlayer;
    divPiece.classList.add('piece', newClass);
    const newInsertion = document.getElementById(`${y}-${x}`);
    newInsertion.append(divPiece);
}

// endGame: announce game end
function endGame(msg) {
  alert(msg);
  document.querySelector("#column-top").removeEventListener("click", handleClick);
}

// handleClick: handle click of column top to play piece
function handleClick(evt) {
  // get x from ID of clicked cell
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  placeInTable(y, x);
  board[y].splice(x, 1, currPlayer);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  // check if all cells in board are filled; if so call, call endGame
  if (board.every(row => row.every(val => val))) {
    return endGame("Tie Game");
  }
  

  // switch players 1 <---> 2
    currPlayer === 1 ? currPlayer = 2 : currPlayer = 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */
function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  //Checks for possible winning combinations
  for (let y = 0; y < HEIGHT; y++) {
    //Runs loop through rows
    for (let x = 0; x < WIDTH; x++) {
      //Checks each column in the row
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      //Checks horizontal matched by adding to X
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      //Checks vertical matches by adding to Y
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      //Checks diagnally to the right by adding to both X & Y
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
      //Checks diagnally to the left by subtracting from X and adding to Y

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
