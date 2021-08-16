import { React, useState, Component, useEffect } from "react";


class Square {
    constructor(x, y, value) {
        this.x = x;
        this.y = y;
        this.value = value;
    } 
}

export default function Board(props) {
    const [board, setBoard] = useState(createBoard(props.board_string));
    const [highlightIndex, setHighlightIndex] = useState(82);
    const baseIndexs = getBase(props.board_string);
    const ALLOWED_INPUTS = [0,1,2,3,4,5,6,7,8,9];

    function handleEventInput({key}) {
        console.log("base", baseIndexs, highlightIndex, baseIndexs.includes("11"));
        if (ALLOWED_INPUTS.includes(parseInt(key)) && !(baseIndexs.includes(highlightIndex))) {
            let cells = [...board];
            cells[highlightIndex] = key;
    
            setBoard(cells);
        }
 
    }

    function createBoard(board_string) {
        var board_create = [];
        var x = 0;
        var y = 0;

        for (let i = 0; i < board_string.length; i++) {

            board_create.push(
                board_string[i]
            );
            x += 1;
            if (x % 9 == 0) {
                y += 1;
                x = 0;
            }

        }
        return board_create;

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
        let index = e.target.getAttribute("data-index")

        setHighlightIndex(index);

    }

    function handleCellChange(e, index) {
        let new_input = e.nativeEvent.data
        
        if (ALLOWED_INPUTS.includes(parseInt(new_input))) {
            let cells = [...board];
            cells[index] = new_input;
    
            setBoard(cells);
        }


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
        if (highlightIndex < 0 || highlightIndex > 81) return false; 
        let row = searchSquare("y", index);
        let col = searchSquare("x", index);
        let box = isAdjacentBox(index);

        //console.log(row, col, box, index);
        return row || col || box;
    }



    function createRow(limit) {
        return (
            <tr>
            {board.map((value, index) => {
                //console.log(limit-9, limit-1)
                if (index >= limit-9 && index <= limit-1) {

                    let highlighted = (index == highlightIndex) ? "highlighted-square" : "";
                    let highlighted_adjacent = isAdjacent(index) ? "highlighted-adjacent" : "";
                    let is_base = (baseIndexs.includes(index.toString())) ? "base-number": "";


                    return (
                        <td key={index} onClick={handleCellClick} data-index={index} className={`${highlighted} ${highlighted_adjacent} ${is_base}`}>
                            {value == "0" ? "" : value}
                        </td>
                    )
                }
            })}
            </tr>
        )
    }

    return (
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
    )
}
