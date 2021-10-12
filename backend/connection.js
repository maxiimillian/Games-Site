const TokenModel = require('./models/Token');
const utils = require("./utils");
const Table = require("./modules/table");
const Board = require("./modules/board");
const { get_user_id, get_user_information } = require('./utils');

module.exports = function(io) {
	
	function alreadyInRoom(socket) {
		if (socket.rooms.size > 1) {
			return true
		}
		return false;
	}

	let room_track_sudoku = {};
	let room_track_poker = {};
	let tables = [];
	let boards = {};
	const SUDOKU_PLAYER_LIMIT = 2;
	
	const poker = io.of("/poker");
	const sudoku = io.of("/sudoku");

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

			let room_code = utils.generate_room_code(6);
			let token = socket.handshake.auth.token;

			TokenModel.findOne({token: token}, function (err, tokenObj) {
				if (err || tokenObj == null) {
					socket.emit("Unknown Token");

				} else if (alreadyInRoom(socket)) {
					socket.emit("err", "Already in a room.") 

				} else {

					socket.join(room_code);
					room_track_sudoku[tokenObj.user_id] = room_code;
		
					let board = new Board(tokenObj.user_id, difficulty);

					board.init(() => {
						boards[room_code] = board;
						socket.emit("created", room_code);
					});

				}
	
			});


		});

		socket.on("join", (room_code) => {
			let room = sudoku.adapter.rooms.get(room_code);
			let token = socket.handshake.auth.token;
			
			TokenModel.find({token:token}, (err, tokenObj) => {
				if (err) {
					socket.emit("err", "Something went wrong");
				} else if (room == null) {
					socket.emit("err", "Room not found");
	
				} else if (room.length >= SUDOKU_PLAYER_LIMIT) {
					socket.emit("err", "Room is full");
	
				} else {
					utils.get_user_information(tokenObj.user_id, (err, user) => {
						if (err) {
							socket.emit("User Information Error");
							socket.leave(room_code);
	
						} else {
							let board = boards[room_code];
							boards[room_code].add_player(tokenObj.user_id, (err, user_information) => {
								if (err) {
									console.log("ERR", err, user_information);
									socket.emit("error");
								} else {
									socket.join(room_code);
									room_track_sudoku[tokenObj.user_id] = room_code;
									sudoku.to(room_code).emit("joined", user_information);
	
									if (sudoku.adapter.rooms.get(room_code).size == SUDOKU_PLAYER_LIMIT) {
										boards[room_code].start();
										sudoku.to(room_code).emit("start", {"board": board.board.unsolved})
									}
								}
							})
	
						}
	
	
					});
					
				}
			})



		});

		socket.on("move", ( index, value) => {
			let token = socket.handshake.auth.token;

			TokenModel.find({token:token}, (err, tokenObj) => {
				if (err) {
					socket.emit("err", "Something went wrong")
				} else {
					let room_code = room_track_sudoku[tokenObj.user_id];
					let room = sudoku.adapter.rooms.get(room_code);
					let board = boards[room_code];
		
					console.log("move", index, value);
					if (room == null || board == null) {
						socket.emit("err", "Room not found");
		
					} else if (!board.started) {
						socket.emit("err", "Room not started");
					} else {
						TokenModel.find({token: socket.handshake.auth.token}, (err, tokenObj) => {
							if (err) {
								socket.emit("err", "Something went wrong");
							} else {
								board.make_move(tokenObj.user_id, index, value, (err, result) => {
									if (err) {
										socket.emit("err", err);
									} else {
										if (result) {
											socket.emit("Winner", "win");
											socket.broadcast.to(room_code).emit("Winner", "lose");
										} else {
											socket.emit("Success", index, value);
											socket.broadcast.to(room_code).emit("Filled square");
										}
									}
								});
							}
						});
		
					}
				}

			})


		});

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
			sudoku.to(room_track_sudoku[socket.id]).emit("user disconnected", {});
			delete room_track_sudoku[socket.id];
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