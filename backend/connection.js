const TokenModel = require('./models/Token');
const utils = require("./utils");
const Table = require("./modules/table");
const Board = require("./modules/board");
const { get_user_id, get_user_information } = require('./utils');

module.exports = function(io, app) {
	console.log("== IO LOADED == ");
	let room_track_sudoku = {};
	let room_track_poker = {};
	let tables = [];
	let boards = {};

	const SUDOKU_PLAYER_LIMIT = 2;
	const DIFFICULTIES = ["easy", "medium", "hard", "extreme", "test"];
	
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

	function create_game(user_id, difficulty, time, player_count, callback) {
		difficulty = difficulty.toLowerCase()

		if (!DIFFICULTIES.includes(difficulty)) {
			callback(null, null)
			return;
		}

		let board = new Board(user_id, difficulty, time, player_count);
		let room_code = utils.generate_room_code(6);

		callback(null, board, room_code);
	}

	function cleanup_game(room_code) {
		let room = sudoku.adapter.rooms.get(room_code);

		if (!room && boards[room_code]) {
			let board = boards[room_code];

			Object.keys(board.players).map(player_id => {
				delete room_track_sudoku[player_id];
			})

			delete boards[room_code];
		}
	}
	
	function send_game_state(socket, user_id, room_code) {
		board = boards[room_code];
		
		if (!board) {
			socket.emit("err", "Game does not exist");
		} else {
			board.get_opponent(user_id, (opponent) => {
				console.log("sending state....", board.boards[user_id]);
				socket.emit("state", 
				{"board": board.boards[user_id], "base": board.index}, 
				opponent
				)
			})
		}
	}

	function alreadyInRoom(token) {
		utils.get_user_id(token, (user_err, user_id) => {
			//console.log(user_err)
			if (room_track_sudoku[user_id]) {
				return true;
			} else {
				return false;
			}
		});
	}


	//User creates game with this http request and connects to it through a socket
	app.post("/sudoku/create", (req, res) => {
		let difficulty = req.body.difficulty;
		let time = req.body.time;
		let player_count = req.body.player_count;
		let token = req.body.auth;

		if (token == null) {
			res.status(401).json({success:false, message: "401 <Missing Authentication>"});
			res.end();
		} else if (alreadyInRoom(token)) {
			res.status(401).json({success:false, message: "401 <Already in a room>"});
			res.end();
		} else {
			utils.get_user_id(token, (user_err, user_id) => {
				if (user_err) {
					res.status(400).json({success:false, message: "400 <Something went wrong>"});
					res.end();
				} else {
					create_game(user_id, difficulty, time, player_count, (game_err, board, room_code) => {
						if (game_err) {
							res.status(400).json({success:false, message: "400 <Something went wrong>"});
							res.end();
						} else {
							room_track_sudoku[user_id] = room_code;
							
							board.init([], async () => {
								boards[room_code] = board;
								room_track_sudoku[user_id] = room_code;

								res.status(200).json({success:true, message: room_code, code: room_code});
								res.end();
							});
						}
					});
				}
			});

		}
	});


	app.get("/sudoku/details/:code", (req, res) => {
		let code = req.params["code"];
		console.log("requesting code => ", code);
		let details = {"time": null, "players": null, "difficulty": null, "host": null}

		let board = boards[code];
		console.log("getting details");
		if (board) {
			details["time"] = board.time;
			details["players"] = board.max_player_count;
			details["difficulty"] = board.difficulty;

			console.log(details);

			get_user_information(board.host, (err, user) => {
				if (err) {
					details["host"] = "Unknown";
				} else {
					details["host"] = user.username;
				}
				console.log(details);
				res.status(200).json({success:true, details: details})
			})
			

			
		} else {
			res.status(400).json({success:false, message: "Game not found"});
		}
	});

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
		/*socket.on("create", (difficulty) => {
			get_socket_information(socket, (token, user_id) => {
				if (token == null) {
					socket.emit("Unknown Token");

				} else if (alreadyInRoom(socket)) {
					socket.emit("err", "Already in a room.") ;

				} else {
					create_game(user_id, difficulty, (err, board, room_code) => {
						if (err) {
							socket.emit("err", "Something went wrong");
						} else {
							socket.join(room_code);
							room_track_sudoku[user_id] = room_code;
							
							board.init(() => {
								boards[room_code] = board;
								//console.log("ok")
								socket.emit("created", room_code);
							});
						}

					});
				}
			});

		});*/

		socket.on("join", (room_code) => {
			//console.log(room_track_sudoku);
			socket.emit("err", "test");
			get_socket_information(socket, (token, user_id, user) => {
				let room = sudoku.adapter.rooms.get(room_code);

				//For when game is created but no ones joined, meaning the socket room doesnt yet exist
				//Need to check that room_code isn't null incase user_id also doesnt exist in room track
				if (!room && room_track_sudoku[user_id] == room_code && room_code) { 
					console.log(room_track_sudoku);
					socket.join(room_code);
					room = sudoku.adapter.rooms.get(room_code);
					//console.log("r", room);
				}

				console.log("room: ", room, room_code)
				
				if (room == null) {
					console.log("TRYING TO JOIN1");
					socket.emit("err", "Room not found");
					console.log(4244);
				} else if (user_id == null) {
					console.log("TRYING TO JOIN2");
					socket.emit("err", "user not found")
					console.log(134);
					// for rejoining after leaving the game, second condition to protect against user_id not existing and null room code	
				} else if (room_track_sudoku[user_id] == room_code && room_code && boards[room_code].started ) { 
					console.log("TRYING TO JOIN3");
					socket.join(room_code);
					send_game_state(socket, user_id, room_code);
					boards[room_code].start();
				} else if (room.length >= SUDOKU_PLAYER_LIMIT) {
					console.log("TRYING TO JOIN4");
					socket.emit("err", "Room is full");
					console.log(421313);
				} else if (user == null) {
					console.log("TRYING TO JOIN5");
					socket.emit("err", "User Information Error");
					console.log(93243244);
				} else {
					console.log(4);
					let board = boards[room_code];
					boards[room_code].add_player(user_id, (err, user) => {
						if (err) {
							console.log("ERR", err, user);
							socket.emit("err", "error");
							console.log(129012);
						} else {
							console.log(6);
							socket.join(room_code);
							room_track_sudoku[user_id] = room_code;

							sudoku.to(room_code).emit("joined", user);

							if (sudoku.adapter.rooms.get(room_code).size == SUDOKU_PLAYER_LIMIT) {
								console.log(8);
								boards[room_code].start();
								sudoku.to(room_code).emit("start", {"board": board.board.unsolved, "base": board.index})
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
					socket.emit("err", "Room not found");
	
				} else if (!board.started) {
					socket.emit("err", "Room not started");
				} else {
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
			get_socket_information(socket, (
				token, user_id, user, old_room_code) => {

				if (status) {
					boards[old_room_code].add_rematch(user_id, (err, confirmed) => {
						if (err) {
							socket.emit("err", "something went wrong");

						} else if (confirmed) {
							console.log("creating rematch")
							let old_board = boards[old_room_code];

							create_game(old_board.host, old_board.difficulty, old_board.time, old_board.max_player_count,
								(err, board, room_code) => {
									if (err) {
										socket.emit("err", "Something went wrong");
									} else {
										let old_players = Object.keys(old_board.players);
										console.log("g", old_players);
										board.init(old_players, async() => {
											boards[room_code] = board;
											
											await Object.keys(old_board.players).map(player => {
												room_track_sudoku[player] = room_code;
												board.boards[player] = board.boards[board.host];
											})

											sudoku.to(old_room_code).emit("redirect", {"board": board.board.unsolved, "base": board.index}, room_code);
											sudoku.in(old_room_code).socketsJoin(room_code);
											sudoku.in(old_room_code).socketsLeave(old_room_code);
											boards[room_code].start();
										});
									}
							});
						}
					}); 
				} else if (!status) {
					boards[old_room_code].remove_rematch(user_id);

				} else {
					socket.emit("err", "invalid status");
					return

				}

				socket.broadcast.to(old_room_code).emit("rematch", status);
			})

		})

		socket.on("chat", (message) => {
			get_socket_information(socket, (token, user_id, user, room_code) => {
				
				if (!room_code || !user_id) {
					socket.emit("err", "couldnt send");
					
				} else {
					socket.broadcast.to(room_code).emit("chat", {"user": user.username, "content": message, "author": false});
					socket.emit("chat", {"user": user.username, "content": message, "author": true});
				}
			})
		});

		socket.on("disconnect", () => {
			get_socket_information(socket, (token, user_id, user, room_code) => {
				sudoku.to(room_track_sudoku[socket.id]).emit("user disconnected", user);
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
			//console.log(socket.id);
			//console.log(room_track_poker[socket.id]);
		})
	});


}