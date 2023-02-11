const { get_user_information } = require("../../utils");
const utils = require("../../utils");

class Player {
  constructor(id) {
    this.id = id;
    this.status = "active";
  }
}

module.exports =
  //Parent class to implement shared functionality among different game types
  //Things like joining/leaving/chat/room_codes/hosts/etc
  //Some of these methods should be overridden by the class that implements this
  class Game {
    constructor(hostId, playerCount, type) {
      if (this.constructor == Game) {
        throw new Error(
          "This class should not be created on its own. Implement it in another class"
        );
      }
      //add errors for player limit = 0 etc
      this.type = type;
      this.roomCode;
      this.hostId = hostId;
      this.playerCount = playerCount;
      this.players = [];
      this.status = "pending";
      this.rematchTracker = {};
      this.rematchVoteThreshold = 100;
    }

    //override this
    static validateOptions() {}

    //override this with the custom options for each game,
    //probably good idea to super() it as well for future proofing
    getOptions() {
      return { playerCount: this.playerCount}
    }

    add_player(userId) {
      let success = false;
      let starting = false;
      let startingInformation;

      if (this.players.length != this.playerCount) {
        this.players.push(new Player(userId));
        this.rematchTracker[userId] = false; //prepare rematch tracker
        success = true;
        if (this.players.length == this.playerCount) {
          startingInformation = this.start();
          starting = true;
        }
      }
      return { success, starting, startingInformation };
    }

    remove_player(userId) {
      let index = this.players.findIndex((player) => player.id == userId);
      if (index > -1) {
        this.players.splice(index, 1);
        return true;
      }
      return false;
    }

    is_ready() {
      return this.players.length == this.playerCount;
    }

    change_rematch(playerId) {
      this.rematchTracker[playerId] = !this.rematchTracker[playerId]
      const totalVotes = Object.keys(this.rematchTracker).length;
      let votesForRematch = 0;
      for (const [playerId, wantsRematch] of Object.entries(this.rematchTracker)) {
        if (wantsRematch) votesForRematch += 1;
      }

      const votePercentage = (votesForRematch / totalVotes) * 100;
      return {success: true, startGame: votePercentage >= this.rematchVoteThreshold}
    }

    start() {
      this.status = "started";
      const info = this.handleStart();
      return info;
    }

    // prob dont need this but idk yet
    end() {
      this.status = "ended";
      return this.handleEnd();
    }

    //override this with child
    handleStart() {
      console.log("here for some reason");
    }

    handleRejoin() {}

    handleDisconnect(userId) {
      let success = false;
      let closeGame = true;
      const player = this.players.find((player) => player.id == userId);
      if (!!player) {
        success = true;
        player.status = "inactive";
      }

      for (const player of this.players) {
        if (player.status == "active") closeGame = false;
      }

      return { success, closeGame };
    }

    //override this with child
    handleEnd() {}

    hasPlayer(userId) {
      for (const player of this.players) {
        if (userId == player.id) return true;
      }
      return false;
    }
  };
