const crypto = require("crypto");
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

    for (let i = 0; i < board.length; i++) {
        if (board[i] != 0) {
            index.push(i);
        }
    }

    return index;
}

module.exports = 
    class Board {
        constructor(host_id, difficulty) {
            this.id = crypto.randomBytes(20).toString('hex');;
            this.host = host_id;
            this.players = [host_id];
            this.difficulty = difficulty;
            this.board = null;
            this.index = null;
            this.boards = {};
            this.started = false;
            this.rematch = [];
        }

        init(callback) {
            try {
                utils.get_board(this.difficulty, (err, board) => {
                    this.set_default();
                    callback();
                    return;
                    let host_id = this.host;
                    if (err || board == null) {
                        throw err;
                    } else {
                        this.board = board;
                        this.index = getIndex(board);
                        this.boards[host_id] = board.unsolved;

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

        add_player(user_id, callback) {
            if (this.players.length >= PLAYER_LIMIT) {
                callback(new Error("Maximum two players")); 
            } else {
                this.players.push(user_id);
                this.boards[user_id] = this.board.unsolved;
                try {
                    utils.get_user_information(user_id, (err, user) => {
                        if (err) {
                            throw err;
                        }
                        callback(null, user)
                    })
                } catch (err) {
                    callback(err);
                }
                
            }
        }

        remove_player(user_id) {
            this.players.map(player_id, index => {
                if (player_id == user_id) {
                    this.players.splice(index, 1);
                }
            })
        }

        make_move(user_id, index, value, callback) {;
            if (DEFAULT_INDEX.includes(index)) {
                callback(new Error("Cannot change base number"));

            } else if (value < 0 || value > 9) {
                callback(new Error("Invalid value"));

            } else if (!this.players.includes(user_id)){

                console.log("CANT FIND ", user_id, this.players);
                callback(new Error("Unknown Player"));
            
            } else if (this.boards[user_id][parseInt(index)] == value) {
                callback(new Error("Nothing Changed"), null);
            } else {
                let current_board = this.boards[user_id];
                this.boards[user_id] = setCharAt(current_board, parseInt(index), value);

                if (this.boards[user_id] == this.board.solved) {
                    callback(null, true);
                } else {
                    callback(null, null);
                }
                
            }
        }

        add_rematch(user_id, callback) {
            if (this.rematch.includes(user_id)) {
                this.rematch.push(user_id);

                if (this.rematch.length >= PLAYER_LIMIT) {
                    callback(true, true);
                } else {
                    callback(true, false);
                }

            } else {
                callback(false, false);
            }
        }

        remove_rematch(user_id) {
            if (this.rematch.includes(user_id)) {
                this.rematch.findIndex(x => this.rematch.splice(x, 1));
            }
        }

        start() {
            this.started = true;
        }

        end() {
            this.started = false;
        }
    }
