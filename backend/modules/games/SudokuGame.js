const Game = require("./Game");

module.exports = 
    class SudukoGame extends Game {
        constructor(roomCode, nameSpace, hostId, playerLimit, difficulty, time) {
            super(roomCode, nameSpace, hostId, playerLimit);
            this.boards = {};
            this.solution = {};
            this.difficulty = difficulty;
            this.time = time;
        }

        addPlayer(playerId) {
            if (this.player.length != this.playerLimit) {
                players.push(playerId);
                return true; 
            }
            return false;
        }

        removePlayer() {
            let index = this.players.indexOf(playerId);
            if (index > -1) {
                this.players.splice(index, 1);
                return true;
            }
            return false;
        }


        isReady() {
            return this.players.length == this.playerLimit;
        }

        //make a Board class that has a boards unsolved state, its indexes, and its solution.
        //start will get this board class from utils.get_board
        //probably need to make this.solution just this.board and then you can copy to boards whenever someone joins
        //this can also just allow Board class to have make_move and it validates against its own indexes 
        
        start() {
            this.status = "started";
            utils.get_board(this.difficulty, (err, board) => {
                if (err || !board) {
                    callback(err, null);
                } else {
                    this.boar
                    callback(null, board);
                }
            })
        }

        // prob dont need this but idk yet
        end() {
            this.status = "ended";
        }

    }
