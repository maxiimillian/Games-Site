const crypto = require("crypto");
const utils = require("../utils");

const DEFAULT_BOARD = {
    id: null,
    unsolved: '385926471472815936169374800058437129723691548914258763231749685897563214546182397',
    solved:   '385926471472815936169374852658437129723691548914258763231749685897563214546182397',
    difficulty: 'easy'
  };

const DEFAULT_INDEX = [1, 4, 8, 10, 80]

function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    console.log(str.length, index+1)
    console.log("1:",str.substring(0,index), "2:", str.substring(index+1, str.length))
    return str.substring(0,index) + chr + str.substring(index+1, str.length);
}

function getIndex(board) {
    let index = [];

    for (let i = 0; i < board.length; i++) {
        if (board[i] != 0) {
            index.push(i);
        }
    }

    console.log("INDEX: ", index);
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
            this.boards = null;
            this.started = false;
        }

        init(callback) {
            utils.get_board(this.difficulty, (err, board) => {
                let host_id = this.host;
                if (err || board == null) {
                    this.board = DEFAULT_BOARD;
                    this.index = DEFAULT_INDEX;
                    this.boards = {host_id: DEFAULT_BOARD.unsolved};
                    callback();
                } else {
                    this.board = board;
                    this.index = getIndex(board);
                    this.boards = {host_id: board.unsolved};
                    callback();
                }
            })
        }

        add_player(user_id, callback) {
            if (this.players.length > 1) {
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

        make_move(user_id, index, value, callback) {
            if (DEFAULT_INDEX.includes(index)) {
                callback(new Error("Cannot change base number"));

            } else if (value < 0 || value > 9) {
                callback(new Error("Invalid value"));

            } else if (!this.players.includes(user_id)){

                console.log("CANT FIND ", user_id, this.players);
                callback(new Error("Unknown Player"));

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

        start() {
            this.started = true;
        }

        end() {
            this.started = false;
        }
    }
