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
		setTimeout(() => {
			console.log("now");
			socket.emit("test");
		}, 10000);
		
		socket.on("create", (difficulty) => {
			let room_code = utils.generate_room_code(6);

			TokenModel.findOne({token: token}, function (err, tokenObj) {
				if (err || tokenObj == null) {
					socket.emit("Unknown Token");

				} else if (alreadyInRoom(socket)) {
					socket.emit("err", "Already in a room.") 

				} else {

					socket.join(room_code);
					room_track_sudoku[socket.id] = room_code;
		
					let board = new Board(tokenObj.user_id, difficulty);
					boards[room_code] = board;
					
					room.emit("created");
				}
	
			});


		});

		socket.on("join", (room_code) => {
			let room = io.sockets.adapter.room.room_code;
			if (room == null) {
				socket.emit("err", "Room not found");

			} else if (room.length >= SUDOKU_PLAYER_LIMIT) {
				socket.emit("err", "Room is full");

			} else {
				socket.join(room_code);

				utils.get_user_information(user_id, (err, user) => {
					if (err) {
						socket.emit("User Information Error");
						socket.leave(room_code);

					} else {
						room.emit("joined", user);

						if (io.sockets.adapter.room.room_code.length == SUDOKU_PLAYER_LIMIT) {
							let board = boards.room_code;
							room.emit("start", {"unsolved": board.unsolved})
						}
					}


				});
				
			}


		});

		socket.on("move", (room_code, index, value) => {
			let room = io.sockets.adapter.room.room_code;
			if (room == null) {
				socket.emit("err", "Room not found");

			} else {

			}

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
			console.log(room_track[socket.id]);
		})
	});


}