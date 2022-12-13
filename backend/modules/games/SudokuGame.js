const Game = require("./Game");
const utils = require("../../utils");
const Board = require ("../board");

function send_game_state(socket, board, opponents) {
    socket.emit("state", board, opponents);
}

module.exports = 
    class SudukoGame extends Game {
        constructor(nameSpace, host_id, player_limit, difficulty, time) {
            super(nameSpace, host_id, player_limit);
            console.log("SG D: ", difficulty);
            this.boards = {};
            this.puzzle = new Board().create(difficulty);
            this.difficulty = difficulty;
            this.time = time;
        }

        get_opponents(player_id) {
            let opponents = [];
            this.players.forEach(opponent_id => {
                if (opponent_id != player_id) {
                    opponents.push(opponent_id);
                }
            })
            return opponents;
        }

        //takes in a time in milliseconds and will return after a timeout or the board has been created
        wait_for_board(timeout) {
            const start = Date.now();

            function waitForBoardPromise(resolve, reject) {
                if (this.puzzle.unsolved) {
                    resolve();
                } else if (timeout && (Date.now() - start) >= timeout) {
                    reject(new Error("Board has timed out"));
                } else {
                    setTimeout(waitForBoardPromise.bind(this, resolve, reject), 20);
                }
            }

            return new Promise(waitForBoardPromise);
        }

        handle_join(socket) {
            let success = super.handleJoin(socket);
            if (success) {
                e = ""
            }
            //Board might not exist yet
            this.wait_for_board(10000).then(() => {
                if (this.boards[socket.user.id]) {
                    let opponents = this.getOpponents(user.id);
					send_game_state(socket, this.boards[socket.user.id], opponents);
                } else {
                    this.boards[socket.user.id] = new Board(this.puzzle.unsolved, null, this.puzzle.base_clues);
                }
                return true;
            });
            return false;
        }

        handle_leave(socket) {
            let user_id = socket.user.id;
            if (this.boards[useruser_idId]) {
                delete this.boards[user_id];
                return true;
            } else {
                return false;
            }
            
        }

        handle_start() {
            //Board must always be created before this 
            //Since players need to join so no need to wait
            this.io.to(this.roomCode).emit("start", {"board": this.puzzle.unsolved, "base": this.puzzle.base_clues})
        }

        //make a Board class that has a boards unsolved state, its indexes, and its solution.
        //start will get this board class from utils.get_board
        //probably need to make this.solution just this.board and then you can copy to boards whenever someone joins
        //this can also just allow Board class to have make_move and it validates against its own indexes 

        // prob dont need this but idk yet
        end() {

        }

    }
