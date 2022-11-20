module.exports = class ServerInformation {
    constructor(io) {
        this.room_tracker = {};
        this.io = io;
    }

    //game MUST inhereit from Game class
    add_game(game) {
        while (true) {
            let room_code = utils.generate_room_code(6);
            if (!this.room_tracker[room_code]) {
                game.room_code = room_code;
                this.room_tracker[room_code] = game;
                return room_code;
            }
        }
    }

    get_game(room_code) {
        return this.room_tracker[room_code];
    }

    get_room_code_by_user_id(user_id) {
        for (let [room_code, game] of Object.entries(room_tracker)) {
            if (game.hasPlayer(user_id)) {
                return room_code;
            }
        }

        return null;
    }

    add_player_to_game(room_code, socket) {
        let user_id = socket.user.id;
        let room = io.adapter.rooms.get(room_code);

        //For when game is created but no ones joined, meaning the socket room doesnt yet exist
        //Need to check that room_code isn't null incase user_id also doesnt exist in room track
        if (!room && this.get_room_code_by_user_id(user_id) == room_code && room_code) { 
            socket.join(room_code);
            room = io.adapter.rooms.get(room_code);
        }
        
        if (room_code == null) {
            socket.emit("err", "Room not found");
        } else if (server.get_room_code_by_user_id(user_id) == room_code && room_code ) { // for rejoining after leaving the game, second condition to protect against user_id not existing and null room code	
            socket.join(room_code);
            send_game_state(socket, user_id, room_code);
        } else if (room.length >= game.player_limit) {
            socket.emit("err", "Room is full");
        } else {
            let game = this.get_game(room_code);
            let success = game.add_player(user_id);
            if (success) {
                io.to(room_code).emit("joined", user);
                if (game.is_ready()) {
                    game.start();
                }
            } else {
                socket.leave(room_code);
            }
        }
    }

    get_game_for_room(room_code) {
        return
    }
}

/**
 * 		socket.on("join", (room_code) => {
			let success = server.addPlayerToGame(room_code);

			let game = server.getGame(room_code);
			if (game) {
				game.addPlayer(socket);
			}

			let user_id = socket.user.id;
			let room = io.adapter.rooms.get(room_code);
			//For when game is created but no ones joined, meaning the socket room doesnt yet exist
			//Need to check that room_code isn't null incase user_id also doesnt exist in room track
			if (!room && server.getRoomCodeForUser(user_id) == room_code && room_code) { 
				console.log(room_track_sudoku);
				socket.join(room_code);
				room = io.adapter.rooms.get(room_code);
			}
			
			if (room == null) {
				socket.emit("err", "Room not found");
			} else if (server.getRoomCodeForUser(user_id) == room_code && room_code ) { // for rejoining after leaving the game, second condition to protect against user_id not existing and null room code	
				socket.join(room_code);
				send_game_state(socket, user_id, room_code);
			} else if (room.length >= game.player_limit) {
				socket.emit("err", "Room is full");
			} else {
				game.add_player(user_id);
				if (sucess) {

				}
				boards[room_code].add_player(user_id, (err, user) => {
					if (err) {
						console.log("ERR", err, user);
						socket.emit("err", "error");
						console.log(129012);
					} else {
						console.log(6);
						socket.join(room_code);
						room_track_sudoku[user_id] = room_code;

						io.to(room_code).emit("joined", user);

						if (io.adapter.rooms.get(room_code).size == SUDOKU_PLAYER_LIMIT) {
							console.log(8);
							boards[room_code].start();
							io.to(room_code).emit("start", {"board": board.board.unsolved, "base": board.index})
						}
					}
				})
			}
		});
 */