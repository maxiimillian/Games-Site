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
        println!("Enter difficulty (easy, medium, or hard) and type done to continue.");
        io::stdin().read_line(&mut input).expect("Failed to read line");
        io::stdout().flush().unwrap();

        input = input.to_lowercase().trim().to_string();

        if input == "easy" {
            boards_to_create.insert("easy", get_amount());
        } else if input == "medium" {
            boards_to_create.insert("medium", get_amount());
        } else if input == "hard" {
            boards_to_create.insert("hard", get_amount());
        } else if input == "done" {
            break;
        } else {
            println!("Invalid input");
        }
    }

    for (difficulty, amount) in boards_to_create {
        for _ in 0..amount {
            let start = PreciseTime::now();

            let board = Board::default();
            board.save_db();

            let end = PreciseTime::now();
            
            println!("{} miliseconds to generate", start.to(end).num_milliseconds());
        }
    }

    println!("All boards have been created and outputted to a database file!");
}

