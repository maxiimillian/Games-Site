const TokenModel = require('./models/Token');
const utils = require("./utils");

module.exports = function(io) {
	
	function alreadyInRoom(socket) {
		if (socket.rooms.size > 1) {
			return true
		}
		return false;
	}

	let room_track = {}
	let tables = []

	io.on("connection", (socket) => {
		console.log('connection');
	});

	const poker = io.of("/poker");
	const sudoku = io.of("/sudoku");

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
			room_track[socket.id] = room_code;
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