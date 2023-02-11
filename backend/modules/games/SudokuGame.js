const Game = require("./Game");
const utils = require("../../utils");
const Board = require("../board");

function sendGameState(socket, board, opponents) {
  socket.emit("state", board, opponents);
}

module.exports = class SudukoGame extends Game {
  constructor(hostId, playerCount, type, difficulty, time, puzzle) {
    super(hostId, playerCount, type);

    this.boards = {};
    this.puzzle = puzzle;
    this.difficulty = difficulty;
    this.time = time;
    this.sudokuOptions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  }

  static validateOptions(options) {
    return true;
  } 

  getOptions() {
    return {...super.getOptions(), time: this.time, difficulty: this.difficulty}
  }

  getOpponents(player_id) {
    let opponents = [];
    this.players.forEach((opponent_id) => {
      if (opponent_id != player_id) {
        opponents.push(opponent_id);
      }
    });
    return opponents;
  }

  replaceStringValue(current, index, value) {
    current = current.split('');
    current[index] = value;
    return current.join('');
  }

  makeMove(userId, index, value) {
    let success = false;
    let winning = false;

    if (
      index >= 0 &&
      index <= this.boards[userId].unsolved.length &&
      this.sudokuOptions.includes(parseInt(value))
    ) {
      const currentBoard = this.boards[userId].unsolved;
      this.boards[userId].unsolved = this.replaceStringValue(currentBoard, index, value);
      success = true;
    }

    if (this.boards[userId].unsolved == this.puzzle.solved) {
      winning = true;
      this.end();
    }

    return { success, winning };
  }

  //takes in a time in milliseconds and will return after a timeout or the board has been created
  waitForBoard(timeout) {
    return new Promise((resolve, reject) => {
      const start = Date.now();
      while (true) {
        if (this.puzzle) {
          resolve();
        } else if (timeout && Date.now() - start >= timeout) {
          reject(new Error("Board has timed out"));
        }
      }
    });
  }

  add_player(userId) {
    this.boards[userId] = this.puzzle;
    return super.add_player(userId);
  }

  getOpponents() {
    return this.players.map(player => {
      const playerClues = this.puzzle.unsolved.length - (this.boards[player.id].unsolved.match(/0/g) || []).length;
      const totalSpaces = this.puzzle.base_clues.length;
      const score = playerClues - totalSpaces;
      return {id: player.id, score}
    })
  }

  handleRejoin(userId) {
    const board = this.boards[userId];
    if (!!board) {
      this.players.find(player => player.id == userId).status = 'active';
      return {
        success: true,
        board: { board: board.unsolved, base: board.base_clues },
        opponents: this.getOpponents()
      };
    }

    return { success: false, board: null, opponents: null };
  }

  handleJoin(socket) {
    let success = super.handleJoin(socket);
    if (success) {
      e = "";
    }
    //Board might not exist yet
    this.waitForBoard(10000).then(() => {
      if (this.boards[socket.user.id]) {
        let opponents = this.getOpponents(user.id);
        sendGameState(socket, this.boards[socket.user.id], opponents);
      } else {
        this.boards[socket.user.id] = new Board(
          this.puzzle.unsolved,
          null,
          this.puzzle.base_clues
        );
      }
      return true;
    });
    return false;
  }

  handleLeave(socket) {
    let user_id = socket.user.id;
    if (this.boards[useruser_idId]) {
      delete this.boards[user_id];
      return true;
    } else {
      return false;
    }
  }

  handleStart() {
    //Board must always be created before this
    //Since players need to join so no need to wait
    return { board: this.puzzle.unsolved, base: this.puzzle.base_clues };
  }

  //make a Board class that has a boards unsolved state, its indexes, and its solution.
  //start will get this board class from utils.get_board
  //probably need to make this.solution just this.board and then you can copy to boards whenever someone joins
  //this can also just allow Board class to have make_move and it validates against its own indexes

  // prob dont need this but idk yet
  end() {
    super.end();
  }
};
