const utils = require("../utils");
const Game = require("./games/Game");

module.exports = function (io) {
  class ServerInformation {
    constructor() {
      this.roomTracker = {};
    }

    //game MUST inhereit from Game class
    add_game(game) {
      if (!game.prototype instanceof Game) return false;
      while (true) {
        let room_code = utils.generate_room_code(6);
        if (!this.roomTracker[room_code]) {
          game.room_code = room_code;
          this.roomTracker[room_code] = game;
          return room_code;
        }
      }
    }

	remove_game(roomCode) {
		delete this.roomTracker[roomCode];
	}

    get_game(room_code) {
      return this.roomTracker[room_code];
    }

    get_room_code_by_user_id(userId) {
      for (let [roomCode, game] of Object.entries(this.roomTracker)) {
        if (game.hasPlayer(userId)) {
          return roomCode;
        }
      }

      return null;
    }
  }
  return new ServerInformation();
};
