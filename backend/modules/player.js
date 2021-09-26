var crypto = require("crypto");

module.exports = {
    Player: class Player {
        constructor(name, socket) {
            this.id = crypto.randomBytes(20).toString('hex');
            this.name = name;
            this.socket = socket;
            this.hand = [];
        }
    }
}