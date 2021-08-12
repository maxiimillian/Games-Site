use board_generator::board::board::Board;
use board_generator::help::help;
use board_generator::difficulty::difficulty::Difficulty;
use time::PreciseTime;
use futures::executor::block_on;

fn main() {
    loop {
        let start = PreciseTime::now();
        let board = Board::default(Difficulty::EASY());
        let end = PreciseTime::now();
        board.print();
        println!("{} miliseconds to generate", start.to(end).num_milliseconds());
        board.save_db("./db.db");
        std::process::exit();
    }
}
