const { get_user_information } = require("../utils");
const utils = require("../utils");

module.exports =
    //Parent class to implement shared functionality among different game types
    //Things like joining/leaving/chat/room_codes/hosts/etc
    //Some of these methods should be overridden by the class that implements this
    class Game {
        constructor(io, hostId, playerLimit) {
            if (this.constructor == Game) {
                throw new Error("This class should not be created on its own. Implement it in another class")
            }
            //add errors for player limit = 0 etc
            this.roomCode;
            this.host_id = hostId;
            this.player_limit = playerLimit;
            this.players = [];
            this.status = "pending";
            this.io = io;
        }

        send_message(socket, message) {
            if (message.length > 230) {
                return false;
            }
            let user = socket.user;
            socket.broadcast.to(this.room_code).emit("chat", {"user": user.username, "content": message, "author": false});
            socket.emit("chat", {"user": user.username, "content": message, "author": true});
            return true;
        }

        add_player(user_id) {
            if (this.player.length != this.playerLimit) {
                players.push(user_id);
                return true;
            }
            return false;
        }

        //This can/should be overridden by the implementing class
        //Should return a boolean value to make sure addPlayer informs 
        //The rest of the room
        handle_join(socket) {
            let user = socket.user;
            let success = this.addPlayer(user.id);
            if (success) {

            }
            throw new Error("handleJoin has not been implemented");
        }

        remove_player() {
            let index = this.players.indexOf(playerId);
            if (index > -1) {
                this.players.splice(index, 1);
                io.to(room_code).emit("joined", {"user": socket.user});
                return true;
            }
            return false;
        }

        //This can/should be ovverriden by implementing class
        handle_leave () {
            throw new Error("handleLeave has not been implemented");
        }


        is_ready() {
            return this.players.length == this.playerLimit;
        }

        start() {
            this.status = "started";
            this.handleStart();
        }

        handle_start() {
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

        hasPlayer(userId) {
            this.players.forEach(playerId => {
                if (userId == playerId) {
                    return true;
                }
            })
            return false;
        }
    }
