const TokenModel = require('./models/Token');
const utils = require("./utils");
const Table = require("./modules/table");
const Board = require("./modules/board");
const { get_user_id, get_user_information } = require('./utils');

module.exports = function(io) {

	let room_track_sudoku = {};
	let room_track_poker = {};
	let tables = [];
	let boards = {};

	const SUDOKU_PLAYER_LIMIT = 2;
	const DIFFICULTIES = ["easy", "medium", "hard", "extreme"];
	
	const poker = io.of("/poker");
	const sudoku = io.of("/sudoku");

	function get_socket_information(socket, callback) {

		let token = socket.handshake.auth.token;

		TokenModel.findOne({token: token}, (err, tokenObj) => {
			let room_code = room_track_sudoku[tokenObj.user_id];

			if (!err && tokenObj) {
				utils.get_user_information(tokenObj.user_id, (err, user) => {
					if (err || user == null) {
						callback(tokenObj.token, tokenObj.user_id, null, room_code);
					} else {
						callback(tokenObj.token, tokenObj.user_id, user, room_code);
					}
				});
				return;
				
			}

			callback(null, null, null, room_code);
		})
	}
	
	function send_game_state(socket, user_id, room_code) {
		console.log(boards, room_code);
		board = boards[room_code];

		board.get_opponent(user_id, (opponent) => {
			socket.emit("state", 
			board.boards[user_id], 
			opponent
			)
		})

	}

	function alreadyInRoom(socket) {
		if (socket.rooms.size > 1) {
			return true
		}
		return false;
	}

	sudoku.use((socket, next) => {
		let token = socket.handshake.auth.token;

        TokenModel.findOne({token: token}, function (err, tokenObj) {
            if (err || tokenObj == null) {
                next(new Error("Invalid Token"));
            } else {
				next();
			}

        });
	});

	sudoku.on("connection", socket => {
		socket.on("create", (difficulty) => {
			difficulty = difficulty.toLowerCase()

			if (!DIFFICULTIES.includes(difficulty)) {
				socket.emit("err", "Invalid Difficulty");
				return;
			}

			let room_code = utils.generate_room_code(6);

			get_socket_information(socket, (token, user_id) => {
				if (token == null) {
					socket.emit("Unknown Token");

				} else if (alreadyInRoom(socket)) {
					socket.emit("err", "Already in a room.") 

				} else {
					socket.join(room_code);
					room_track_sudoku[user_id] = room_code;
		
					let board = new Board(user_id, difficulty);

					board.init(() => {
						boards[room_code] = board;
						socket.emit("created", room_code);
					});

				}
			})

		});

		socket.on("join", (room_code) => {

			get_socket_information(socket, (token, user_id, user) => {
				let room = sudoku.adapter.rooms.get(room_code);
				console.log(room_track_sudoku[user_id], room_code);
				console.log(room);
				if (room == null) {
					socket.emit("err", "Room not found");
	
				} else if (user_id == null) {
					socket.emit("err", "user not found")

				} else if (room_track_sudoku[user_id] == room_code) {
					send_game_state(socket, user_id, room_code);
					socket.join(room_code);
					console.log(room);

				} else if (room.length >= SUDOKU_PLAYER_LIMIT) {
					socket.emit("err", "Room is full");
	
				} else if (user == null) {
					socket.emit("User Information Error");

				} else {
					let board = boards[room_code];
					boards[room_code].add_player(user_id, (err, user) => {
						if (err) {
							console.log("ERR", err, user);
							socket.emit("error");
						} else {
							socket.join(room_code);
							room_track_sudoku[user_id] = room_code;

							sudoku.to(room_code).emit("joined", user);

							if (sudoku.adapter.rooms.get(room_code).size == SUDOKU_PLAYER_LIMIT) {
								boards[room_code].start();
								sudoku.to(room_code).emit("start", {"board": board.board.unsolved})
							}
						}
					})
					
				}
			});
		});

		socket.on("move", ( index, value) => {

			get_socket_information(socket, (token, user_id, user, room_code) => {
				let room = sudoku.adapter.rooms.get(room_code);
				let board = boards[room_code];

				if (room == null || board == null) {
					console.log("e: ", room_code, room, sudoku.adapter.rooms, board, ": e");
					socket.emit("err", "Room not found");
	
				} else if (!board.started) {
					socket.emit("err", "Room not started");
				} else {
					console.log("oi: ", user_id)
					board.make_move(user_id, index, value, (err, result) => {
						
						if (err) {
							socket.emit("err", err);
						} else {
							if (result) {
								socket.emit("Winner", "win");
								socket.broadcast.to(room_code).emit("Winner", "lose");
							} else {
								socket.emit("move", index, value);

								if (value == 0) {
									socket.broadcast.to(room_code).emit("Filled square", "subtract");
								} else {
									socket.broadcast.to(room_code).emit("Filled square", "add");
								}
								
							}
						}
					});
	
				}
			});
		});

		socket.on("rematch", (status) => {
			get_socket_information(socket, (token, user_id, user, room_code) => {
				if (status == "y") {
					boards[room_code].add_rematch(user_id, (err, confirmed) => {
						if (err) {
							socket.emit("err", "something went wrong");
						} else {
							//if confirmed then create a game and send link to both,
							//probably need the reconnect for this cause the host is gonna get added 
							//when they join on redirect
						}
					}); 
				} else if (status == "n") {
					boards[room_code].remove_rematch(user_id);
				} else {
					socket.emit("err", "invalid status");
					return
				}

				socket.broadcast.to(room_code).emit("rematch", status);
			})

		})

		socket.on("chat", (message) => {
			let token = socket.handshake.auth.token;

			TokenModel.find({token:token}, (err, tokenObj) => {
				if (err) {
					socket.emit("err", "Could not send");
				} else {
					let room_code = room_track_sudoku[tokenObj.user_id];
					utils.get_user_information(tokenObj.user_id, (err, user) => {
						if (err) {
							socket.emit("err", "Could not send");
						} else {
							socket.broadcast.to(room_code).emit("chat", {"user": user.username, "content": message, "author": false});
							socket.emit("chat", {"user": user.username, "content": message, "author": true});
						}
					})
					
				}
			})

			
		});

		socket.on("disconnect", () => {
			get_socket_information(socket, (token, user_id, user, room_code) => {
				sudoku.to(room_track_sudoku[socket.id]).emit("user disconnected", user);
				let room = sudoku.adapter.rooms.get(room_code);

				if (!room && boards[room_code]) {
					let board = boards[room_code];

					Object.keys(board.players).map(player_id => {
						delete room_track_sudoku[player_id];
					})

					delete boards[room_code];
				}
			});

		})
	});


	poker.use((socket, next) => {
		let token = socket.handshake.auth.token;

        TokenModel.findOne({token: token}, function (err, tokenObj) {
            if (err || tokenObj == null) {
                next(new Error("Invalid Token"));
            } else {
				next();
			}

        });
	});

	poker.on('connection', socket => {
		socket.on("create", () => {
			let room_code = utils.generate_room_code(6);

			if (alreadyInRoom(socket)) {
				socket.emit("Already in a room.")
				return;
			}

			socket.join(room_code);
			room_track_poker[socket.id] = room_code;
		});

		socket.on("join", (code) => {
			if (poker.rooms.includes(code)) {
				if (alreadyInRoom(socket)) {
					socket.emit("Already in a room.")
					return;
				}

				socket.join(code);

				room_track[socket.id] = room_code;
			} else {
				socket.emit("Unknown Room");
			}
		})

		socket.on("disconnect", () => {
			console.log(socket.id);
			console.log(room_track_poker[socket.id]);
		})
	});


}