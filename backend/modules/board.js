const crypto = require("crypto");
const utils = require("../utils");

const DEFAULT_BOARD = {
    id: null,
    unsolved: '000260000190300000802509000328000060000080054000000000059003800700000000003605040',
    solved: '537261498194378625862549173328457961671982354945136287459723816716894532283615749',
    difficulty: 'easy'
  };

const DEFAULT_INDEX = [1, 4, 8, 10, 80]

function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substring(0,index) + chr + str.substring(index+1);
}

module.exports = 
    class Board {
        constructor(host_id, difficulty) {
            this.id = crypto.randomBytes(20).toString('hex');;
            this.host = host_id;
            this.players = [host_id];
            this.difficulty = difficulty;
            this.board = DEFAULT_BOARD;
            this.boards = {host_id: this.board.unsolved};
            this.started = false;
        }

        async init(callback) {
            let response = await utils.get_board(utils.get_board(this.difficulty))
            console.log(response);
            this.board = response;
            callback(this.board);
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
                this.boards[user_id] = setCharAt(current_board, index, value);

                if (this.boards[user_id][index] == this.board.solved) {
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
