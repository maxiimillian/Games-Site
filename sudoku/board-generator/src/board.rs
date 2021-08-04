

pub mod board {

    use crate::square::square::Square;
    use crate::help::help;
    
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
        fn default() -> Board {
            let mut board: Vec<Square> = Vec::new();
            for x in 0..9 {
                for y in 0..9 {
                    board.push(Square {
                        x,
                        y,
                        value: 0,
                    });
                }   
            }
            let start = PreciseTime::now();
            
            create_board(&mut board, 0);
    
            let end = PreciseTime::now();
    
            let mut solution = board.clone();
    
            let start_two = PreciseTime::now();
            remove_squares(&mut board);
            let end_two = PreciseTime::now();
    
            println!("{}",start.to(end).num_milliseconds() as f64);
            println!("{}",start_two.to(end_two).num_milliseconds() as f64);
            return Board { squares: board.clone(), solution: solution };
        }
    }
    
    impl Board {
        pub fn print(&self) {
            help::print_vec(&self.squares);
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
            if help::isValid(&board, index, *option) {
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
    
    fn find_random_squares(board: &Vec<Square>) -> Vec<usize> {
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
        let available_squares: Vec<usize> = find_random_squares(&board);
        let mut solutions: i32 = 0;
    
        let mut option: i32 = 0;
        let result = find_open_squares(&board);
    
        let mut open_squares: Vec<usize> = Vec::new();
    
        match result {
            Some(open_squares_r) => open_squares = open_squares_r,
            None => (),
        }
    
        if open_squares.len() > 45 {
            return true;
        } 
    
        for index in available_squares.iter() {
            option = board[*index].value;
            board[*index].value = 0;
    
            if !one_solution(board) {
                board[*index].value = option;
            }
    
            if remove_squares(board) {
                return true;
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
                if help::isValid(&board, *index, option) {
                    options.push(option);
                }
                
            }
            
            valid_values.insert(*index, options);
            
        }
    
        return Some(valid_values);
    
    
    }
    
    fn one_solution_muscle(board: &mut Vec<Square>, solutions: &mut i32, valid_values: &HashMap<usize, Vec<i32>>) {
        let result = find_open_squares(&board);
        let mut empty_squares: Vec<usize> = Vec::new();
    
    
        match result {
            Some(zero_index) => empty_squares = zero_index,
            None => {
               
                *solutions = *solutions + 1;
                //println!("\n\n S:{} \n\n", solutions);
                return;
            }
        }
        //println!("{:?}", &empty_squares);
        for index in &empty_squares {
            //println!("{}",  index);
            for option in valid_values[index].iter() {
                if help::isValid(&board, *index, *option) {
                    board[*index].value = *option;
                    one_solution_muscle(board, solutions, valid_values);
                    board[*index].value = 0;
                }
                
            }
            return;
            
        }
        return;
    }
    
    pub fn one_solution(board: &mut Vec<Square>) -> bool {
        let mut solutions: i32 = 0;
        let valid_values = find_valid_values(&board);
    
        match valid_values {
            Some(values) => one_solution_muscle(board, &mut solutions, &values),
            None => return false,
        };
        
        if solutions == 1 {
            return true;
        } else {
            return false;
        }
    }
}

