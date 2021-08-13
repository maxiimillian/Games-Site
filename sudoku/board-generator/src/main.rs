use board_generator::board::board::Board;
use board_generator::help::help;
use board_generator::difficulty::difficulty::Difficulty;
use time::PreciseTime;
use futures::executor::block_on;
use std::collections::HashMap;
use std::io;
use std::io::Write;

fn get_amount() -> i32 {
    loop {
        let mut input: String = String::new();

        println!("Enter number of boards for this difficulty");
        io::stdin().read_line(&mut input).expect("Failed to read line");

        match input.trim().parse::<i32>() {
            Ok(n) => return n,
            Err(e) => println!("That's not a valid number {}", e),
        }
    }
}

fn main() {
    let mut boards_to_create: HashMap<&str, i32> = HashMap::new();
    let mut input: String = String::new();

    loop {
        input = "".to_string();
        println!("Enter difficulty (easy, medium, or hard) and type done to continue.");
        io::stdin().read_line(&mut input).expect("Failed to read line");
        io::stdout().flush().unwrap();
        
        match input.to_lowercase().trim() {
            "easy" => {
                let a = get_amount();
                boards_to_create.insert("easy", a);
            },
            "medium" => {
                let a = get_amount();
                boards_to_create.insert("medium", a);
            },
            "hard" => {
                let a = get_amount();
                boards_to_create.insert("hard", a);
            },
            "extreme" => {
                let a = get_amount();
                boards_to_create.insert("extreme", a);
            },
            "done" => {
                break;
            },
            _ => println!("Invalid input"),
        }
    }

    for (difficulty, amount) in boards_to_create {
        let mut d: Difficulty = Difficulty::EASY();
        match difficulty {
            "easy" => d = Difficulty::EASY(),
            "medium" => d = Difficulty::MEDIUM(),
            "hard" => d = Difficulty::HARD(),
            "extreme" => d = Difficulty::EXTREME(),
            x => panic!("Unexpected difficulty!"),
        }
        for _ in 0..amount {
            let start = PreciseTime::now();

            let board = Board::custom(d.clone());
            board.save_db();

            let end = PreciseTime::now();
            
            println!("{} miliseconds to generate", start.to(end).num_milliseconds());
        }
    }

    println!("All boards have been created and outputted to a database file!");
}

