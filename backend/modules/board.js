const crypto = require("crypto");
const utils = require("../utils");

const DEFAULT_BOARD = {
    id: null,
    unsolved: '000260000190300000802509000328000060000080054000000000059003800700000000003605040',
    solved: '537261498194378625862549173328457961671982354945136287459723816716894532283615749',
    difficulty: 'easy'
  };

module.exports = 
    class Board {
        constructor(host_id, difficulty) {
            this.id = crypto.randomBytes(20).toString('hex');;
            this.host = host_id;
            this.players = [host_id];
            this.difficulty = difficulty;
            this.board = DEFAULT_BOARD;
            this.boards = [{"user": host_id, "board": this.board.unsolved}];
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
                this.boards.push({"user": user_id, "board": this.board.unsolved});
                try {
                    utils.get_user_information(user_id, (user) => {
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
