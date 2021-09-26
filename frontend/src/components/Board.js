import { React, useState, Component, useEffect } from "react";

let DEFAULT_BOARD = "0".repeat(81);

class Cell {
    constructor(value, annotations) {
        this.value = value;
        this.annotations = annotations;
    }
}

export default function Board(props) {
    const [board, setBoard] = useState(createBoardJson(props.board_json));
    const [highlightIndex, setHighlightIndex] = useState(82);
    const [annotate, setAnnotate] = useState(false);

    const baseIndexs = getBaseJson(props.board_json);
    const ALLOWED_INPUTS = [0,1,2,3,4,5,6,7,8,9];
    

    function handleEventInput({key}) {
        if (ALLOWED_INPUTS.includes(parseInt(key)) && !(baseIndexs.includes(highlightIndex)) && !(annotate && key == 0)) {
            let cells = [...board];

            if (annotate) {
                let annotations = cells[highlightIndex].annotations;
                if (annotations.includes(key)) {
                    let index = annotations.indexOf(key);

                    if (index > -1) {
                        annotations.splice(index, 1);
                    }
                } else {
                    annotations.push(...key);
                }
                
            } else {
                cells[highlightIndex].value = key;
            }
            
    
            setBoard(cells);
        }
 
    }

    function createBoardJson(board_json) {
        var board_create = [];

        board_json.forEach(square => {
            board_create.push(
                new Cell(square.value, square.candidates)
            );
        })
        return board_create;
    }

    function createBoard(board_string) {
        var board_create = [];
        console.log("hi", props.board_json);
        createBoardJson(props.board_json);

        for (let i = 0; i < board_string.length; i++) {

            board_create.push(
                new Cell(board_string[i], [])
            );

        }
        return board_create;

    }

    function resetBoard() {
        setBoard(createBoardJson(props.board_json))
    }

    function getBaseJson(board_json) {
        let indexs = [];

        board_json.forEach((square, index) => {
            if (square.value != 0) {
                console.log(index, typeof index)
                indexs.push(index.toString());
            }
        })

        return indexs;
    }

    function getBase(board_string) {
        let indexs = [];

        for (let i = 0; i < board_string.length; i++) {
            if (board_string[i] != 0) {
                indexs.push(i.toString());
            }
        }

        return indexs;
    }

    useEffect(() => {
        window.addEventListener("keydown", handleEventInput);
        return () => {
            window.removeEventListener("keydown", handleEventInput);
        };
    });


    function handleCellClick(e) {
        let index = e.currentTarget.getAttribute("data-index")
        console.log(index, e);
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
        })

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
        let square_y = getAxis("y", index)+1;

        if (square_y <= 3) {
            return 1;
        }
        else if (square_y <= 6) {
            return 2;
        } 
        else if (square_y <= 9) {
            return 3;
        }
    }
    function adjacentX(index) {
        let square_x = getAxis("x", index)+1;
        
        if (square_x <= 3) {
            return [1, adjacentY(index)];
        }
        else if (square_x <= 6) {
            return [2, adjacentY(index)];
        } 
        else if (square_x <= 9) {
            return [3, adjacentY(index)];
        }
    }

    function isAdjacentBox(index) {
        let test = adjacentX(index);
        let highlight = adjacentX(highlightIndex);
        
        return test[0] == highlight[0] && test[1] == highlight[1];
    }

    function isAdjacent(index) {
        if (highlightIndex < 0 || highlightIndex > 81 || highlightIndex == null) {
            return false;
        }
        let row = searchSquare("y", index);
        let col = searchSquare("x", index);
        let box = isAdjacentBox(index);

        //console.log(row, col, box, index);
        return row || col || box;
    }



    function createRow(limit) {
        return (
            <tr>
            {board.map((cell, index) => {
                //console.log(limit-9, limit-1)
                if (index >= limit-9 && index <= limit-1) {

                    let highlighted = (index == highlightIndex) ? "highlighted-square" : "";
                    let highlighted_adjacent = isAdjacent(index) ? "highlighted-adjacent" : "";
                    let is_base = (baseIndexs.includes(index.toString())) ? "base-number": "";


                    return (
                        <td key={index} onClick={handleCellClick} data-index={index} className={`${highlighted} ${highlighted_adjacent} ${is_base}`}>
                            {cell.value == "0" ? "" : cell.value}
                            <div class="cell-overlay">
                                {cell.annotations.map((annotation) => {
                                    return <div class="overlay-number">{annotation}</div>
                                })}
                            </div>
                        </td>
                    )
                }
            })}
            </tr>
        )
    }

    return (
        <div className="board-container">
            <table className="board">
                <colgroup><col></col><col></col><col></col></colgroup>
                <colgroup><col></col><col></col><col></col></colgroup>
                <colgroup><col></col><col></col><col></col></colgroup>

                <tbody>
                    {createRow(9)}
                    {createRow(18)}
                    {createRow(27)}
                </tbody>
                <tbody>
                    {createRow(36)}
                    {createRow(45)}
                    {createRow(54)}
                </tbody>
                <tbody>
                    {createRow(63)}
                    {createRow(72)}
                    {createRow(81)}
                </tbody>
            </table>
            <div className="control-bar">
                <button onClick={() => setAnnotate(!annotate)} className={annotate ? "control-button on": "control-button off"} >Annotate</button>
                <button onClick={() => resetBoard()} className="control-button off">Reset</button>
            </div>
        </div>
    )
}
