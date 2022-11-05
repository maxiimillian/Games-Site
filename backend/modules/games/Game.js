const { get_user_information } = require("../utils");
const utils = require("../utils");

module.exports =
    //Parent class to implement shared functionality among different game types
    //Things like joining/leaving/chat/room_codes/hosts/etc
    //Some of these methods should be overridden by the class that implements this
    class Game {
        constructor(io, roomCode, nameSpace, hostId, playerLimit) {
            if (this.constructor == Game) {
                throw new Error("This class should not be created on its own. Implement it in another class")
            }
            //add errors for player limit = 0 etc
            this.roomCode = roomCode;
            this.nameSpace = nameSpace;
            this.hostId = hostId;
            this.playerLimit = playerLimit;
            this.players = [];
            this.status = "pending";
            this.io = io;
        }

        sendMessage(socket, message) {
            if (message.length > 230) {
                return false;
            }
            let user = socket.user;
            socket.broadcast.to(this.room_code).emit("chat", {"user": user.username, "content": message, "author": false});
            socket.emit("chat", {"user": user.username, "content": message, "author": true});
            return true;
        }

        addPlayer(socket) {
            if (this.player.length != this.playerLimit) {
                players.push(socket.user.id);
                socket.join(this.room_code);
                if (this.handleJoin(socket)) {
                    io.to(room_code).emit("joined", {"user": socket.user});
                }

                return true; 
            }
            return false;
        }

        //This can/should be overridden by the implementing class
        //Should return a boolean value to make sure addPlayer informs 
        //The rest of the room
        handleJoin() {
            throw new Error("handleJoin has not been implemented");t
        }

        removePlayer() {
            let index = this.players.indexOf(playerId);
            if (index > -1) {
                this.players.splice(index, 1);
                io.to(room_code).emit("joined", {"user": socket.user});
                return true;
            }
            return false;
        }

        //This can/should be ovverriden by implementing class
        handleLeave () {
            throw new Error("handleLeave has not been implemented");
        }


        isReady() {
            return this.players.length == this.playerLimit;
        }

        start() {
            this.status = "started";
            this.handleStart();
        }

        handleStart() {
            throw new Error("handleStart has not been implemented");
        }

        // prob dont need this but idk yet
        end() {
            this.status = "ended";
            this.handleStart();
        }

        handleEnd() {
            throw new Error("handleEnd has not been implemented");
        }

    }
