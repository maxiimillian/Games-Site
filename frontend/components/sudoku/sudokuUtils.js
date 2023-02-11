/*
Helpful functions for sudoku-related things since both the display (Board)
and the connection handler (Sudoku) will need access to these
*/

function searchSquare(axis, index, highlightIndex, board) {
  let highlight = 0;
  let test = 0;

  let x = 0;
  let y = 0;

  function which_axis() {
    if (axis == "x") return x;
    if (axis == "y") return y;
  }
  ``;

  board.map((cell, i) => {
    if (i == highlightIndex) highlight = which_axis();
    if (i == index) test = which_axis();

    x += 1;
    if (x % 9 == 0) {
      y += 1;
      x = 0;
    }
  });

  return highlight == test;
}

function getAxis(axis, index, board) {
  let x = 0;
  let y = 0;

  for (let i = 0; i < board.length; i++) {
    if (i == index) {
      if (axis == "x") return x;
      else if (axis == "y") return y;
    }

    x += 1;
    if (x % 9 == 0) {
      y += 1;
      x = 0;
    }
  }
}

function adjacentY(index, board) {
  let square_y = getAxis("y", index, board) + 1;

  if (square_y <= 3) {
    return 1;
  } else if (square_y <= 6) {
    return 2;
  } else if (square_y <= 9) {
    return 3;
  }
}
function adjacentX(index, board) {
  let square_x = getAxis("x", index, board) + 1;

  if (square_x <= 3) {
    return [1, adjacentY(index, board)];
  } else if (square_x <= 6) {
    return [2, adjacentY(index, board)];
  } else if (square_x <= 9) {
    return [3, adjacentY(index, board)];
  }
}

function isAdjacentBox(index, highlightIndex, board) {
  let test = adjacentX(index, board);
  let highlight = adjacentX(highlightIndex, board);

  return test[0] == highlight[0] && test[1] == highlight[1];
}

export const isAdjacent = (index, highlightIndex, board) => {
  if (highlightIndex < 0 || highlightIndex > 81 || highlightIndex == null) {
    return false;
  }
  let row = searchSquare("y", index, highlightIndex, board);
  let col = searchSquare("x", index, highlightIndex, board);
  let box = isAdjacentBox(index, highlightIndex, board);

  return row || col || box;
};
