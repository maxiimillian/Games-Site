const crypto = require("crypto");
const utils = require("../utils");


module.exports = 
    class Board {
        constructor(code, host_id, difficulty) {
            this.id = crypto.randomBytes(20).toString('hex');;
            this.host = host;
            this.code = code;
            this.players = [host_id];
            this.board = utils.get_board(difficulty);
            this.boards = [{"user": host_id, "board": board.unsolved}];
        }

        add_player(user_id, callback) {
            if (this.players.length > 1) {
                callback(new Error("Maximum two players")); 
            } else {
                this.players.push(user_id);
                this.boards.push({host_id: board.unsolved});
                try {
                    callback(null, utils.get_user_information(user_id));
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
            if (this.board.base_numbers.includes(index)) {
                callback(new Error("Cannot change base number"));

            } else if (value < 0 || value > 9) {
                callback(new Error("Invalid value"));

            } else if (!this.players.includes(user_id)){
                callback(new Error("Unknown Player"));

            } else {
                this.boards.user_id[index] = "value";
                if (this.board.user_id[index] == this.board.solved) {
                    callback(null, true);
                } else {
                    callback();
                }
                
            }
        }
    }
