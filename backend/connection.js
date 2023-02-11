/*
Server() {
	room_tracking = {'room_id': SudokuGame, 'room_id': PokerGame}
	get_user_game(user_id)

}
*/
const ServerInformation = require("./modules/server");
const createNamespace = require("./routes/createNamespace.js");

module.exports = function (io, app) {
  const server = new ServerInformation();
  const namespaces = [
    { file: "./routes/sudoku.js", route: "/sudoku" },
    { file: "./routes/poker.js", route: "/poker" },
  ];

  namespaces.forEach((namespace) => {
    const conn = createNamespace(io.of(namespace.route), app, server);
    require(namespace.file)(conn, app, server);
  });
};
