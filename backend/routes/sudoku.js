const TokenModel = require('../models/Token');
const utils = require("../utils");
const Board = require("../modules/board");
const SudokuGame = require("../modules/games/SudokuGame");
const { get_user_information } = require('../utils');


module.exports = function(io, app, server) {
    let room_track_sudoku = {};
	let boards = {};

	const SUDOKU_PLAYER_LIMIT = 2;
	const DIFFICULTIES = ["easy", "medium", "hard", "extreme", "test"];

	function get_socket_information(socket, callback) {
		let token = socket.handshake.auth.token;
	
		TokenModel.findOne({token: token}, function (err, token_obj) {
			let user_id = token_obj.user_id;
	
			if (err || token_obj == null) {
				callback(new Error("Invalid Token"));
			} else {
				socket.data.user = {"token": token, "id": user_id};
				callback();
			}
	
		});
	}

	function create_game(user_id, difficulty, time, player_count, callback) {
		difficulty = difficulty.toLowerCase()
		
		if (!DIFFICULTIES.includes(difficulty)) {
			callback(null, null)
			return;
		}
		console.log("C D: ", difficulty);

		let sudoku_game = new SudokuGame(io, user_id, player_count, difficulty, time);
		let room_code = server.add_game(sudoku_game);

		callback(null, room_code);
	}

	function cleanup_game(room_code) {
		let room = io.adapter.rooms.get(room_code);

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

		console.log("S D: ", difficulty);
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
					create_game(user_id, difficulty, time, player_count, (game_err, room_code) => {
						if (game_err) {
							res.status(400).json({success:false, message: "400 <Something went wrong>"});
							res.end();
						} else {
							res.status(200).json({success:true, message: room_code, code: room_code});
							res.end();
						}
					});
				}
			});

		}
	});


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
				res.status(200).json({success:true, details: details})
			})
		} else {
			res.status(400).json({success:false, message: "Game not found"});
		}
	});

	io.use((socket, next) => {
		get_socket_information(socket, (err) => {
			if (err) {
				next(new Error("Could not authenticate"));
			} else {
				next();
			}
		})

	});

	io.on("connection", socket => {
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

		//NOTE: It might be better to have add_player in the game class
		//And server could offer methods like is_player_in_game to do the 
		//checks. Game could also user server.io directly but im not sure if
		//its a good idea to have it used like that
		socket.on("join", (room_code) => {
			server.add_player_to_game(room_code, socket);
		});

		socket.on("move", ( index, value) => {

			get_socket_information(socket, (token, user_id, user, room_code) => {
				let room = io.adapter.rooms.get(room_code);
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

											io.to(old_room_code).emit("redirect", {"board": board.board.unsolved, "base": board.index}, room_code);
											io.in(old_room_code).socketsJoin(room_code);
											io.in(old_room_code).socketsLeave(old_room_code);
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
				io.to(room_track_sudoku[socket.id]).emit("user disconnected", user);
			});
		})
	});

}
