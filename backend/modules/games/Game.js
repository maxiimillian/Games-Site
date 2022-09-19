const { get_user_information } = require("../utils");
const utils = require("../utils");

module.exports = 
    class Game {
        constructor(roomCode, nameSpace, hostId, playerLimit) {
            this.roomCode = roomCode;
            this.nameSpace = nameSpace;
            this.hostId = hostId;
            this.playerLimit = playerLimit;
            this.players = [];
            this.status = "pending";
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

        start() {
            this.status = "started";
        }

        // prob dont need this but idk yet
        end() {
            this.status = "ended";
        }

    }
