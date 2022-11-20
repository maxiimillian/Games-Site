/*
Server() {
	room_tracking = {'room_id': SudokuGame, 'room_id': PokerGame}
	get_user_game(user_id)

}
*/
const ServerInformation = require("./modules/server");

function get_socket_information(socket, callback) {

	let token = socket.handshake.auth.token;

	TokenModel.findOne({token: token}, function (err, tokenObj) {
		if (err || tokenObj == null) {
			next(new Error("Invalid Token"));
		} else {
			socket.data.user = {"token": token, "id": userId, "profile": user};
			next();
		}

	});
}

module.exports = function(io, app) {
	const server = new ServerInformation(io);

	io.use((socket, next) => {
		let token = socket.handshake.auth.token;
		get_socket_information(socket, () => {
			next();
		})

	});

	require("./routes/sudoku.js")(io.of("/sudoku"), app, server);
	require("./routes/poker.js")(io.of("/poker"), app, server);
}