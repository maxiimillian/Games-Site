/*
Server() {
	room_tracking = {'room_id': SudokuGame, 'room_id': PokerGame}
	get_user_game(user_id)

}
*/
const ServerInformation = require("./modules/server");

module.exports = function(io, app) {
	const server = new ServerInformation();
	require("./routes/sudoku.js")(io.of("/sudoku"), app, server);
	require("./routes/poker.js")(io.of("/poker"), app, server);
}