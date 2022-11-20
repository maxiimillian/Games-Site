const Game = require("./Game");
const utils = require("../utils");

function send_game_state(socket, board, opponents) {
    socket.emit("state", board, opponents);
}

module.exports = 
    class SudukoGame extends Game {
        constructor(roomCode, nameSpace, hostId, playerLimit, difficulty, time) {
            super(roomCode, nameSpace, hostId, playerLimit);
            this.boards = {};
            this.puzzle = new Board().create();
            this.difficulty = difficulty;
            this.time = time;
        }

        get_opponents(playerId) {
            let opponents = [];
            this.players.forEach(opponentId => {
                if (opponentId != playerId) {
                    opponents.push(opponentId);
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
            let success = super().handleJoin(socket);
            if (success) {

            }
            //Board might not exist yet
            this.wait_for_board(10000).then(() => {
                if (this.boards[socket.user.id]) {
                    let opponents = this.getOpponents(user.id);
					send_game_state(socket, this.boards[socket.user.id], opponents);
                } else {
                    this.boards[socket.user.id] = new Board(this.puzzle.unsolved, null, this.puzzle.baseClues);
                }
                return true;
            });
            return false;
        }

        handle_leave(socket) {
            let userId = socket.user.id;
            if (this.boards[userId]) {
                delete this.boards[userId];
                return true;
            } else {
                return false;
            }
            
        }

        handle_start() {
            //Board must always be created before this 
            //Since players need to join so no need to wait
            this.io.to(this.roomCode).emit("start", {"board": this.puzzle.unsolved, "base": this.puzzle.baseClues})
        }

        //make a Board class that has a boards unsolved state, its indexes, and its solution.
        //start will get this board class from utils.get_board
        //probably need to make this.solution just this.board and then you can copy to boards whenever someone joins
        //this can also just allow Board class to have make_move and it validates against its own indexes 

        // prob dont need this but idk yet
        end() {

        }

    }
