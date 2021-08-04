import { React, useState, Component } from "react";
import Square from "./Square";

class Square_C {
    constructor(x, y, value) {
        this.x = x;
        this.y = y;
        this.value = value;
    } 
}

export default class Board extends Component {
    createBoard = () => {
        var board = [];

        for (let i = 0; i < this.props.size; i++) {

            for (let j = 0; j < this.props.size; j++) {
                console.log("E");
                board.push(new Square(i, j, 0));
            }
        }
        console.log(board);
        return board;
    }

    handleValueChange(e) {
        
    }

    render() {
        var board = this.createBoard();

        return (
            <div>
                {board.map(square => {
                    console.log("e");
                    return <Square handleChange={this.handleValueChange} value={square.value} x={square.x} y={square.y} />
                })}
            </div>
        )
    }
}