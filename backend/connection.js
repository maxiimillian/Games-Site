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

	io.on("connection", (socket) => {
		console.log('connection');
	});

	const poker = io.of("/poker");
	const sudoku = io.of("/sudoku");

	sudoku.use((socket, next) => {
		console.log("sudoky called");
		let token = socket.handshake.auth.token;
		console.log(token);
        TokenModel.findOne({token: token}, function (err, tokenObj) {
            if (err || tokenObj == null) {
				console.log("sud invalid...	", err)
                next(new Error("Invalid Token"));
            } else {
				next();
			}

        });
	});

	sudoku.on("connection", socket => {
		console.log("connected to sudoku");
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
					console.log(board)
					boards[room_code] = board;
					socket.emit("created", room_code);

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
						console.log(room, board, room_code, socket.id, room_track_sudoku);
						socket.emit("err", "Room not found");
		
					} else if (!board.started) {
						console.log(board, boards);
						socket.emit("err", "Room not started");
					} else {
						console.log("1");
						TokenModel.find({token: socket.handshake.auth.token}, (err, tokenObj) => {
							if (err) {
								console.log("12");
								socket.emit("err", "Something went wrong");
							} else {
								console.log("15");
								board.make_move(tokenObj.user_id, index, value, (err, result) => {
									if (err) {
										console.log("16");
										console.log(err, result);
										socket.emit("err", err);
									} else {
										if (result) {
											console.log("18");
											sudoku.to(room_code).emit("Winner", tokenObj.user_id);
										} else {
											console.log("199");
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

		socket.on("disconnect", () => {
			console.log("disconnecting")
			sudoku.to(room_track_sudoku[socket.id]).emit("user disconnected", {});
			delete room_track_sudoku[socket.id];
		})
	});

	poker.use((socket, next) => {
		console.log("poker called");
		let token = socket.handshake.auth.token;

        TokenModel.findOne({token: token}, function (err, tokenObj) {
            if (err || tokenObj == null) {
				console.log("her4");
                next(new Error("Invalid Token"));
            } else {
				console.log("here3")
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
			console.log(socket.rooms);
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