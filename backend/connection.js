/*
Server() {
	room_tracking = {'room_id': SudokuGame, 'room_id': PokerGame}
	get_user_game(user_id)

}
*/
const ServerInformation = require("./modules/server");

function get_socket_information(socket, callback) {

	let token = socket.handshake.auth.token;
	console.log("ST: ", token);

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

module.exports = function(io, app) {
	console.log("Dsd: ", io.adapter.rooms);
	const server = require("./modules/server.js")(io);

	io.use((socket, next) => {
		console.log("MIDDLE WARE");
		let token = socket.handshake.auth.token;
		get_socket_information(socket, (err) => {
			if (err) {
				console.log("SET SOCKET ERROR: ", err);
				next(new Error("Could not authenticate"));
			} else {
				console.log("SET SOCKET ID: ", socket.data.user);
				next();
			}
		})

	});

	require("./routes/sudoku.js")(io.of("/sudoku"), app, server);
	require("./routes/poker.js")(io.of("/poker"), app, server);
}