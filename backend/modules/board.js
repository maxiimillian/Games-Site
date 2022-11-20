const crypto = require("crypto");
const { get_user_information } = require("../utils");
const utils = require("../utils");

const DEFAULT_BOARD = {
    id: null,
    unsolved: '385926471472815936169374800058437129723691548914258763231749685897563214546182397',
    solved:   '385926471472815936169374852658437129723691548914258763231749685897563214546182397',
    difficulty: 'easy'
  };

const DEFAULT_INDEX = [1, 4, 8, 10, 80]

const PLAYER_LIMIT = 2;

function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;

    return str.substring(0,index) + chr + str.substring(index+1, str.length);
}

function getIndex(board) {
    let index = [];
    let board_characters = board.split('');

    for (let i = 0; i < board.length; i++) {
        if (board_characters[i] != '0') {
            index.push(i);
        }
    }

    return index;
}

module.exports = 
    class Board {
        constructor({unsolved = null, solved = null, baseClues = null}) {
            this.unsolved = unsolved;
            this.solved = solved
            this.baseClues = baseClues;
        }

        create(difficulty) {
            try {
                utils.get_board(difficulty, (err, board) => {
                    if (err || board == null) {
                        throw err;
                    } else {
                        this.unsolved = board.unsolved;
                        this.solved = board.solved;
                        this.baseClues = getIndex(board.unsolved);
                    }
                })
            } catch (err) {
                this.set_default();
            }
        }

        init(player_ids, callback) {
            try {
                utils.get_board(this.difficulty, (err, board) => {
                    let host_id = this.host;
                    if (err || board == null) {
                        throw err;
                    } else {
                        this.board = board;
                        this.index = getIndex(board.unsolved);
                        this.boards[host_id] = board.unsolved;
                        this.players[host_id] = 0;

                        player_ids.forEach(player_id => {
                            this.players[player_id] = 0;
                            this.boards[player_id] = board.unsolved;
                        })

                        callback();
                    }
                })
            } catch (err) {
                this.set_default();
                callback();
            }

        }

        set_default() {
            this.board = DEFAULT_BOARD;
            this.index = getIndex(DEFAULT_BOARD);
            this.boards[this.host] = DEFAULT_BOARD.unsolved;
            this.players[this.host] = 0;
        }

        set_board(board) {
            if (board) {
                if (
                    board.id 
                    && board.solved 
                    && board.unsolved 
                    && board.difficulty)
                {
                    this.board = board;
                } else {
                    throw new Error("Board isn't valid");
                }
            }
        }


    }
