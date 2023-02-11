import { React, useState, useEffect, useContext } from "react";
import ControlButton from "../common/ControlButton";

import styles from "../../styles/board.module.scss";
import NumberButton from "../buttons/NumberButton";
import { isAdjacent } from "./sudokuUtils";

const BOARD_DEFAULT = "0".repeat(81);
const BOARD_DEFAULT_INDEX = [];

class Cell {
  constructor(value, annotations) {
    this.value = value;
    this.annotations = annotations;
  }
}

/**
 *
 * Takes in an array of Cell objects to represent the board (board) and an array of Index's that are the base numbers of the puzzle (base)
 * Takes in a method handleInput for entering numbers and handleAnnotate for entering annotations
 */
export default function Board(props) {
  const [board, setBoard] = useState(props.board);
  const [startingBoard, setStartingBoard] = useState(null);
  const [baseIndex, setBaseIndex] = useState(props.base);
  const [highlightIndex, setHighlightIndex] = useState(82);
  const [annotate, setAnnotate] = useState(false);
  const [invalidIndex, setInvalidIndex] = useState([]);

  const ALLOWED_INPUTS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  useEffect(() => {
    window.addEventListener("keydown", handleEventInput);
    return () => {
      window.removeEventListener("keydown", handleEventInput);
    };
  }, [highlightIndex, annotate]);

  useEffect(() => {
    setBoard(props.board);
  }, [props.board]);

  useEffect(() => {
    setBaseIndex(props.base);
  }, [props.base]);

  function createNumberButtons(numberSet) {
    return numberSet.map((number) => {
      return (
        <NumberButton key={number} number={number} handleClick={handleInput} />
      );
    });
  }

  function sortLowToHigh(a, b) {
    return a - b;
  }

  function handleEventInput({ key }) {
    handleInput(key);
  }

  function handleInput(key) {
    if (
      ALLOWED_INPUTS.includes(parseInt(key)) &&
      !baseIndex.includes(highlightIndex) &&
      !(annotate && key == 0) &&
      highlightIndex >= 0 &&
      highlightIndex < 82 &&
      board[highlightIndex].value != key
    ) {
      let cells = [...board];

      if (annotate) {
        //Although this isn't needed for the server it should be handled outside since changing the input will rerender the componenent
        //And clear the annotations
        props.handleAnnotate(key, highlightIndex);
      } else {
        props.handleInput(key, highlightIndex);
      }

      setBoard(cells);
    }
  }

  function createBoardJson(board_json) {
    var board_create = [];

    board_json.forEach((square) => {
      board_create.push(new Cell(square.value, square.candidates));
    });
    return board_create;
  }

  function createBoard(board) {
    var board_create = [];
    if (typeof board == "string") {
      for (let i = 0; i < board.length; i++) {
        board_create.push(new Cell(board[i], []));
      }
      return board_create;
    } else if (typeof board == "object") {
      return createBoardJson(board);
    } else {
      return createBoard(BOARD_DEFAULT);
    }
  }

  function resetBoard() {
    board.map((square, index) => {
      props.handleInput(square.value, index);
    });
  }

  function handleCellClick(e) {
    let index = e.currentTarget.getAttribute("data-index");

    setHighlightIndex(index);
  }

  function searchSquare(axis, index) {
    let highlight = 0;
    let test = 0;

    let x = 0;
    let y = 0;

    function which_axis() {
      if (axis == "x") return x;
      if (axis == "y") return y;
    }

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

  function getAxis(axis, index) {
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

  function adjacentY(index) {
    let square_y = getAxis("y", index) + 1;

    if (square_y <= 3) {
      return 1;
    } else if (square_y <= 6) {
      return 2;
    } else if (square_y <= 9) {
      return 3;
    }
  }
  function adjacentX(index) {
    let square_x = getAxis("x", index) + 1;

    if (square_x <= 3) {
      return [1, adjacentY(index)];
    } else if (square_x <= 6) {
      return [2, adjacentY(index)];
    } else if (square_x <= 9) {
      return [3, adjacentY(index)];
    }
  }

  function isAdjacentBox(index) {
    let test = adjacentX(index);
    let highlight = adjacentX(highlightIndex);

    return test[0] == highlight[0] && test[1] == highlight[1];
  }

  function createCell(cell, index) {
    let highlighted = index == highlightIndex ? "highlighted-square" : "";
    let highlighted_adjacent = isAdjacent(index, highlightIndex)
      ? "highlighted-adjacent"
      : "";
    let is_base = baseIndex.includes(index.toString()) ? "base-number" : "";
    let annotate_number = 0;

    return (
      <div
        key={index}
        onClick={handleCellClick}
        data-index={index}
        className={`${highlighted} ${highlighted_adjacent} ${is_base}`}
      >
        <span>{cell.value == "0" ? "" : cell.value}</span>
        <div class="cell-overlay">
          {cell.annotations.map((annotation) => {
            annotate_number += 1;
            return (
              <div key={annotate_number} class="overlay-number">
                {annotation}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function createHtmlBoard(board_str) {
    return (
      <div
        className={`${styles["board"]} ${
          props.waiting ? styles["fade-out"] : null
        }`}
      >
        {createRow(9)}
        {createRow(18)}
        {createRow(27)}
        {createRow(36)}
        {createRow(45)}
        {createRow(54)}
        {createRow(63)}
        {createRow(72)}
        {createRow(81)}
      </div>
    );
  }

  function createRow(limit) {
    return (
      <div className={styles["row"]}>
        {board.map((cell, index) => {
          if (index >= limit - 9 && index <= limit - 1) {
            let highlighted =
              index == highlightIndex ? "highlighted-square" : "";
            let highlighted_adjacent = isAdjacent(index, highlightIndex, board)
              ? "highlighted-adjacent"
              : "";
            let is_base = baseIndex.includes(index) ? "base-number" : "";
            let is_invalid = invalidIndex.includes(index.toString())
              ? "invalid-number"
              : "";

            let annotate_number = 0;

            return (
              <div
                key={index}
                onClick={handleCellClick}
                data-index={index}
                className={`${styles["cell"]} ${styles[highlighted]} ${styles[highlighted_adjacent]} ${styles[is_base]} ${styles[is_invalid]}`}
              >
                {cell.value == "0" ? "" : cell.value}
                <div className={styles["cell-overlay"]}>
                  {cell.annotations
                    .slice()
                    .sort(sortLowToHigh)
                    .map((annotation) => {
                      annotate_number += 1;
                      return (
                        <div
                          key={annotate_number}
                          className={styles["overlay-number"]}
                        >
                          {annotation}
                        </div>
                      );
                    })}
                </div>
              </div>
            );
          }
        })}
      </div>
    );
  }

  let scoreText;
  let total;

  if (startingBoard) {
    total = (startingBoard.match(/0/g) || []).length;
  } else {
    total = 0;
  }

  return (
    <div className={styles["center-board-container"]}>
      <div className={styles["board-container"]}>
        {createHtmlBoard(board)}
        <div className="number-buttons">
          {createNumberButtons(Array.from(new Array(9), (x, i) => i + 1))}
        </div>
        <div
          className={`${styles["control-bar"]} ${
            props.waiting ? styles["fade-out"] : null
          }`}
        >
          {scoreText}
          <ControlButton
            handleClick={() => setAnnotate(!annotate)}
            name={"Annotate"}
          />
          <ControlButton
            handleClick={() => props.handleReset()}
            name={"Reset"}
          />
        </div>
      </div>
    </div>
  );
}
