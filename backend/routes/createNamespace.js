const TokenModel = require("../models/Token");
const utils = require("../utils");
const Board = require("../modules/board");
const SudokuGame = require("../modules/games/SudokuGame");
const { get_user_information } = require("../utils");
// TODO add create game to this so can be used for rematch
// TODO the join game doesnt seem to start game any more but
// TODO it registers the joins

// Takes in a namespace and adds event handlers for shared game events
// join / leave / chat / auth / etc
module.exports = createNameSpace = (io, app, server) => {
  function roomExists(roomCode) {
    return !!io.adapter.rooms.has(roomCode);
  }

  function sanitizeOptions(options) {
    // could be used to make options lowercase or something
    return options;
  }

  const gameTypes = {
    'sudoku': SudokuGame,
  }

  const createGame = {
    'sudoku': async (userId, type, options) => {
      const board = await Board.create(options.difficulty);
      const sudokuGame = new SudokuGame(userId, parseInt(options.playerCount), type, options.difficulty, options.time, board);
      const roomCode = server.add_game(sudokuGame);

      return roomCode;
    },
  }

  async function create_game(
    userId,
    type,
    options,
    callback
  ) {
    options = sanitizeOptions(options);
    if (!gameTypes[type]) {
      callback("Invalid Types", null);
      return;
    }

    if (!gameTypes[type].validateOptions(options)) {
      callback("Invalid Options", null);
      return;
    }
    
    const roomCode = await createGame[type](userId, type, options);
    callback(null, roomCode);
    return;
  }

  const get_socket_information = (socket, callback) => {
    const token = socket.handshake.auth.token;
    TokenModel.findOne({ token }, function (err, token_obj) {
      if (err || !token_obj) {
        callback(new Error("Invalid Token"));
      } else {
        const user_id = token_obj.user_id;
        utils.get_user_information(user_id, (err, user) => {
          if (err || !user) callback(new Error("Invalid User Id"))
          else callback(null, { token: token, id: user_id, profile: user})
        })
      }
      return;
    });
  };

  //User creates game with this http request and connects to it through a socket
  app.post(`${io.name}/create`, (req, res) => {
    const options = req.body;
    const token = req.body.auth;
    const type = io.name.substring(1); //name of route minus the /

    utils.get_user_id(token, (err, userId) => {
      if (err) {
        res
          .status(401)
          .json({ success: false, message: "401 <Missing Authentication>" });
        res.end();
        return;
      }
  
      create_game(
        userId,
        type,
        options,
        (gameErr, roomCode) => {
          if (gameErr || !roomCode) {
            res.status(400).json({
              success: false,
              message: "400 <Something went wrong>",
            });
            res.end();
            return;
          } else {
            res
              .status(200)
              .json({ success: true, message: roomCode, code: roomCode });
            res.end();
            return;
          }
        });
    })
  });

  io.use((socket, next) => {
    get_socket_information(socket, (err, user) => {
      if (err) {
        next(new Error("Could not authenticate"));
      } else {
        socket.data.user = user;
        next();
      }
    });
  });

  io.on("connection", (socket) => {
    socket.on("join", (roomCode) => {
      if (!roomExists[roomCode]) {
        if (server.get_game(roomCode)) {
          socket.join(roomCode); // socket room doesnt exist until someone joins
        } else {
          return;
        }
      }

      const userId = socket.data.user.id;
      const game = server.get_game(roomCode);

      if (game.hasPlayer(userId)) {
        let { success, board, opponents } = server.get_game(roomCode).handleRejoin(userId);
        if (success) socket.emit("state", board, opponents);
      } else {;
        const { success, starting, startingInformation } = game.add_player(
          socket.data.user.id
        );
        if (success) {
          io.to(roomCode).emit("joined", socket.user);
          socket.join(roomCode);
        }
        if (starting) {
          io.to(roomCode).emit("start", startingInformation);
        }
      }
    });

    socket.on("rematch", () => {
      const userId = socket.data.user.id;
      const roomCode = server.get_room_code_by_user_id(userId);
      if (!roomCode) {
        socket.emit('error', 'Invalid room code');
        return;
      }
      let { success, startGame } = server.get_game(roomCode).change_rematch(userId);

      if (startGame) {
        const oldGame = server.get_game(roomCode);
        server.remove_game(roomCode);
        create_game(
          oldGame.hostId,
          oldGame.type,
          oldGame.getOptions(),
          (gameErr, newRoomCode) => {
            if (gameErr || !newRoomCode) {
              io.to(newRoomCode).emit("error", "Could not create new game");
            } else {
              io.in(roomCode).socketsJoin(newRoomCode);
              io.in(roomCode).socketsLeave(roomCode);

              const board = server.get_game(newRoomCode).puzzle;
              io.to(newRoomCode).emit("redirect", { success: true, board: board.unsolved, base: board.base_clues}, newRoomCode);
              server.get_game(newRoomCode).start();
            }
          })
      } else if (success) {
        // potentially inform other player if 1 person rematches in future
      }
    });

    socket.on("chat", (message) => {
      const user = socket.data.user;
      const roomCode = server.get_room_code_by_user_id(user.id);
      if (!roomExists(roomCode)) {
        return;
      }
      console.log(user);
      socket.broadcast
        .to(roomCode)
        .emit("chat", { user: user.profile, content: message, author: false });
      socket.emit("chat", { user: user.profile, content: message, author: true });
    });

    socket.on("disconnect", () => {
      if (!socket.data.user) return; // TODO: figure out how/why its calling disconnect when joining and not having user
      const room_code = server.get_room_code_by_user_id(socket.data.user.id);
      if (!room_code) return; // May happen if server restarts

      server.get_game(room_code).handleDisconnect(socket.data.user.id);
      if (room_code) {
        io.to(room_code).emit("left", socket.data.user);
      }
    });
  });

  return io;
};
