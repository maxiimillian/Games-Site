const TokenModel = require("../models/Token");
const utils = require("../utils");
const Board = require("../modules/board");
const SudokuGame = require("../modules/games/SudokuGame");
const { get_user_information } = require("../utils");

module.exports = function (io, app, server) {
  const SUDOKU_PLAYER_LIMIT = 2;
  const DIFFICULTIES = ["easy", "medium", "hard", "extreme", "test"];

  function roomExists(roomCode) {
    return !!io.adapter.rooms.has(roomCode);
  }

  function send_game_state(socket, user_id, room_code) {
    board = boards[room_code];

    if (!board) {
      socket.emit("err", "Game does not exist");
    } else {
      board.get_opponent(user_id, (opponent) => {
        socket.emit(
          "state",
          { board: board.boards[user_id], base: board.index },
          opponent
        );
      });
    }
  }

  app.get("/sudoku/details/:code", (req, res) => {
    let room_code = req.params["code"];
    let game = server.get_game(room_code);

    if (game) {
      details = {};
      details["time"] = game.time;
      details["players"] = game.player_limit;
      details["difficulty"] = game.difficulty;

      get_user_information(game.host_id, (err, user) => {
        if (err) {
          details["host"] = "Unknown";
        } else {
          details["host"] = user.username;
        }
        res.status(200).json({ success: true, details: details });
      });
    } else {
      res.status(400).json({ success: false, message: "Game not found" });
    }
  });

  io.on("connection", (socket) => {
    socket.on("move", (index, value) => {
      const userId = socket.data.user.id;
      const roomCode = server.get_room_code_by_user_id(userId);

      if (!roomExists(roomCode)) {
        return;
      }

      let { success, winning } = server
        .get_game(roomCode)
        .makeMove(userId, index, value);

      if (success) {
        const action = value == 0 ? "subtract" : "add";
        socket.emit("move", index, value);
        socket.broadcast.to(roomCode).emit("filled", action);
      }

      if (winning) {
        socket.emit("winner", "win");
        socket.broadcast.to(roomCode).emit("winner", "lose");
      }
    });
  });
};
