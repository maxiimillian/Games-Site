var crypto = require("crypto");
const Card = require("./card");
var player = require("./player");



module.exports = 
    class Table {
        constructor(host) {
            this.id = crypto.randomBytes(20).toString('hex');
            this.host = host;
            this.players = [];
            this.deck = this.create_deck();
        }

        create_deck() {
            let suites = ["Ace", "Heart", "Spade", "Club"];
            let cards = []

            suites.map(suite => {
                for (let i = 0; i <= 13; i++) {
                    let card = new Card(suite, i);
                    cards.push(card)
                }
            });

            this.deck = cards;
        }

        shuffle_deck() {
            for (let _ = 0; _ < 100; _++) {
                let first_index = Math.floor(Math.random() * this.deck.length-1) + 1;
                let second_index = Math.floor(Math.random() * this.deck.length-1) + 1;

                [this.deck[first_index], this.deck[second_index]] = [this.deck[second_index], this.deck[first_index]];
            }
        }

        deal() {
            this.players.map(player => {
                player.hand = [];
            })

            for (let _ = 0; _ < 5; _++) {
                this.players.map(player => {
                    player.hand.push(deck.pop());
                })
            }
        }

        add_player() {
            this.players.push();
        }


    }


