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

console.log("test");

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
            this.players = {};
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

        add_player(user_id, callback) {
            if (Object.keys(this.players).length >= PLAYER_LIMIT) {
                callback(new Error("Maximum two players")); 

            } else {
                this.players[user_id] = 0;
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
            delete this.players[user_id];
        }

        make_move(user_id, index, value, callback) {;

            if (DEFAULT_INDEX.includes(index)) {
                callback(new Error("Cannot change base number"));

            } else if (value < 0 || value > 9) {
                callback(new Error("Invalid value"));

            } else if (typeof this.players[user_id] == "int"){

                console.log("CANT FIND ", user_id, this.players);
                callback(new Error("Unknown Player"));
            
            } else if (this.boards[user_id][parseInt(index)] == value) {
                callback(new Error("Nothing Changed"), null);
            } else {
                let current_board = this.boards[user_id];
                this.boards[user_id] = setCharAt(current_board, parseInt(index), value);

                if (value == 0) {
                    this.players[user_id] -= 1;
                } else {
                    this.players[user_id] += 1;
                }

                if (this.boards[user_id] == this.board.solved) {
                    callback(null, true);
                } else {
                    callback(null, null);
                }
                
            }
        }

        add_rematch(user_id, callback) {
            console.log(4, user_id, this.rematch)
            if (!this.rematch.includes(user_id)) {
                console.log(45)
                console.log(this.rematch.length, this.rematch.length+1, PLAYER_LIMIT)
                if (this.rematch.length+1 == PLAYER_LIMIT) {
                    console.log(44)
                    callback(false, true);
                } else {
                    console.log(477)
                    this.rematch.push(user_id);
                    callback(false, false);
                }

            } else {
                console.log(411)
                callback(true, false);
            }
        }

        remove_rematch(user_id) {
            if (this.rematch.includes(user_id)) {
                this.rematch.findIndex(x => this.rematch.splice(x, 1));
            }
        }

        get_opponent(user_id, callback) {
            let opponent = {}
            
            Object.keys(this.players).map(player_id => {
                console.log(player_id);
                if (player_id != user_id) {
                    get_user_information(player_id, (err, user) => {
                        if (err) {
                            callback({});
                        } else {
                            opponent = {"score": this.players[player_id], "user": user};
                            callback(opponent)
                        }
                    })
                    
                } 
            });

        }

        start() {
            this.started = true;
        }

        end() {
            this.started = false;
        }
    }
