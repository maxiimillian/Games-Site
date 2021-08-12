

pub mod board {

    use crate::square::square::Square;
    use crate::help::help;

    use rusqlite::{params, Connection, Result, OpenFlags};
    use futures::executor::block_on;
    use time::PreciseTime;
    use rand::Rng;
    use rand::thread_rng;
    use rand::seq::SliceRandom;
    use std::{fs::OpenOptions, fs::File, io::prelude::*};
    use std::io::{BufWriter, Write};
    use rand::prelude::*;
    use std::collections::HashMap;

    #[derive(Clone)]
    pub struct Board {
        pub squares: Vec<Square>,
        pub solution: Vec<Square>,
    }
    
    impl Default for Board {
        #[tokio::main]
        async fn default() -> Board {
            let mut board: Vec<Square> = Vec::new();
            let mut solution = board.clone();

            for x in 0..9 {
                for y in 0..9 {
                    board.push(Square {
                        x,
                        y,
                        value: 0,
                    });
                }   
            }
            
            loop {
                println!("Calling...");
                create_board(&mut board, 0);
        
                solution = board.clone();
                
                let result: bool = remove_squares(&mut board);
                if result {
                    break;
                }
            }


            return Board { squares: board.clone(), solution: solution };
        }
    }
    
    impl Board {
        pub fn print(&self) {
            help::print_vec(&self.squares);
        }
    
        pub fn save_db(&self, path: &str) -> Result<()> {
            let conn = Connection::open(path).expect("Could not connect");
            conn.execute(
                "CREATE TABLE IF NOT EXISTS boards (
                    id INT PRIMARY KEY,
                    unsolved TEXT UNIQUE,
                    solved TEXT
                )", [],
            )?;

            conn.execute(
                "INSERT INTO boards (unsolved, solved) VALUES (?1, ?2)",
                params![help::squares_to_string(&self.squares), help::squares_to_string(&self.solution)],
            )?;

            Ok(())
        }

        pub fn save_text(&self)     {
            let f = OpenOptions::new()
            .write(true)
            .append(true)
            .open("test.txt")
            .expect("unable to open file");
            
            let mut f = BufWriter::new(f);
            
            write!(f, "{}{},", help::squares_to_string(&self.squares), help::squares_to_string(&self.solution));
    
        }
    
    }
    
    fn find_open_squares(board: &Vec<Square>) -> Option<Vec<usize>> {
        let mut open_squares: Vec<usize> = Vec::new();
    
        for (index, square) in board.iter().enumerate() {
            if square.value == 0 {
                open_squares.push(index);
            }
        }
    
        if open_squares.len() > 0 {
            return Some(open_squares);
        } else {
            return None; 
        }
        
    
    }
    
    fn create_board(board: &mut Vec<Square>, index: usize) -> bool {
        let mut square_options: Vec<i32> = (1..10).collect();
        let mut rng = StdRng::from_entropy();
        square_options.shuffle(&mut rng);  
    
        if index == board.len() {
            return true;
        }
        for option in square_options.iter() {
            let future = help::isValid(&board, index, *option);
            if block_on(future) {
                board[index].value = *option;
                if create_board(board, index+1) {
                    return true;
                } else {
                    board[index].value = 0;
                }
            }
        }
        return false;
    }
    
    fn find_random_filled_squares(board: &Vec<Square>) -> Vec<usize> {
        let mut random_squares: Vec<usize> = Vec::new();
        let mut rng = StdRng::from_entropy();
    
        for (index, square) in board.iter().enumerate() {
            if square.value != 0 {
                random_squares.push(index);
            }
        }
    
        random_squares.shuffle(&mut rng);
        return random_squares;
    }

    pub fn remove_squares(board: &mut Vec<Square>) -> bool {
        let random_index: Vec<usize> = find_random_filled_squares(&board);

        let mut option: i32 = 0;
        let mut solutions: i32 = 0;
        
        if random_index.len() < 25 {
            return true;
        } 

        for index in random_index.iter() {
            option = board[*index].value;

            board[*index].value = 0;

            if !one_solution(board) {
                board[*index].value = option;
                continue
            }
            
            if remove_squares(board) {
                return true;
            } else {
                board[*index].value = option;
            }

        }
        return false;
    }
        
    
    //Finds all combinations that the current unsolved board allows
    fn find_valid_values(board: &Vec<Square>) -> Option<HashMap<usize, Vec<i32>>> {
        let mut valid_values = HashMap::new();
        let result = find_open_squares(&board);
        let mut empty_squares: Vec<usize> = Vec::new();
    
    
        match result {
            Some(zero_index) => empty_squares = zero_index,
            None => {
                return None;
            }
        }
    
        for index in &empty_squares {
            let mut options = Vec::new();
            for option in 1..10 {
                //println!("find valid");
                let future = help::isValid(&board, *index, option);
                if block_on(future) {
                    options.push(option);
                }
                
            }
            
            valid_values.insert(*index, options);
            
        }
    
        return Some(valid_values);
    
    
    }
    
    fn one_solution_muscle(board: &mut Vec<Square>, solutions: &mut i32, valid_values: &HashMap<usize, Vec<i32>>) -> bool {
        let result = find_open_squares(&board);
        let mut empty_squares: Vec<usize> = Vec::new();
    
    
        match result {
            Some(zero_index) => empty_squares = zero_index,
            None => {
               
                *solutions = *solutions + 1;
                //println!("\n\n S:{} \n\n", solutions);
                return true;
            }
        }
        //println!("{:?}", &empty_squares);
        for index in &empty_squares {
            //println!("{}",  index);
            for option in valid_values[index].iter() {
                //println!("one sol");
                let future = help::isValid(&board, *index, *option);
                if block_on(future) {
                    //println!("its valid!");
                    board[*index].value = *option;
                    one_solution_muscle(board, solutions, valid_values);
                    board[*index].value = 0;
                }
                
            }
            return false;
            
        }
        return false;
    }
    
    pub fn one_solution(board: &mut Vec<Square>) -> bool {
        let mut solutions: i32 = 0;
        let valid_values = find_valid_values(&board);
        let mut board_to_solve: Vec<Square> = board.clone();

        match valid_values {
            Some(values) => one_solution_muscle(&mut board_to_solve, &mut solutions, &values),
            None => return false,
        };
        if solutions == 1 {
            //println!("only 1");
            return true;
        } else {
            //println!("more than 1");
            return false;
        }
    }
}

