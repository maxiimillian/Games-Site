
use time::PreciseTime;
use rand::Rng;
use rand::thread_rng;
use rand::seq::SliceRandom;
use std::{fs::OpenOptions, fs::File, io::prelude::*};
use std::io::{BufWriter, Write};
use rand::prelude::*;
use std::fs;
use std::collections::HashMap;

#[derive(Clone, Copy)]
struct Square {
    x: i32,
    y: i32,
    value: i32,
}

#[derive(Clone)]
struct Board {
    squares: Vec<Square>,
    solution: Vec<Square>,
}

fn find_box_y(square: &Square, base_unit: i32) -> i32 {
    if square.y <= base_unit-1 {
        return 1;
    }
    else if square.y <= (base_unit * 2)-1 {
        return 2;
    }
    else if square.y <= (base_unit * 3)-1 {
        return 3;
    }
    return 0;
}

//For finding the x cordinate for the sub-grid of a given square in the board
fn find_box_x(board: &Vec<Square>, square: &Square) -> (i32, i32) {
    let board_length = board.len() as f64;
    let square_side_length = board_length.sqrt() as i32;
    let square_side_length_base_unit: i32 = square_side_length / 3;

    if square.x <= (square_side_length_base_unit)-1 {
        return (1, find_box_y(square, square_side_length_base_unit));
    }
    else if square.x <= (square_side_length_base_unit * 2)-1 {
        return (2, find_box_y(square, square_side_length_base_unit));
    }
    else if square.x <= (square_side_length_base_unit * 3)-1 {
        return (3, find_box_y(square, square_side_length_base_unit));
    }
    
    return (0, 0);
}

fn isValidBox(board: &Vec<Square>, index: usize, option: i32) -> bool {
    let square = &board[index];
    let square_cordinates: (i32, i32) = find_box_x(board, square);
    

    for other_square in board.iter() {
        let other_square_cordinates: (i32, i32) = find_box_x(board, other_square);
        if other_square_cordinates == square_cordinates && (other_square.value == option && other_square.value != 0) && !(square.x == other_square.x && square.y == other_square.y) {
            //println!("\nbox {} {} {} {} {} {} {} {}", option, other_square.x, other_square.y, other_square_cordinates == square_cordinates, other_square.value == option, option != 0, square.x == other_square.x, square.y == other_square.y);
            return false;
        }
    }
    //println!("\nbox true");
    return true;

}

fn isValidRow(board: &Vec<Square>, index: usize, option: i32) -> bool {
    let square = board[index];
    for other_square in board.iter() {
        if (other_square.y == square.y && other_square.x != square.x)  && (other_square.value == option && option != 0) {
            //println!("\nrow {} {} {} {} {}", option, other_square.y == square.y, other_square.x != square.x, other_square.value == option, option != 0);
            return false;
        }
    }
    //println!("\nrow true");
    return true;
}

fn isValidColumn(board: &Vec<Square>, index: usize, option: i32) -> bool {
    let square = board[index];
    for other_square in board.iter() {
        if (other_square.x == square.x && other_square.y != square.y) && (other_square.value == option && option != 0) {
            return false;
        }
    }
   // println!("\ncol true");
    return true;
} 

// WHAT DOES ANY OF IT MEAN OH MY GOD

fn isValid(board: &Vec<Square>, index: usize, option: i32) -> bool {
    for square in board.iter() {
        if isValidColumn(&board, index, option) && isValidRow(&board, index, option) && isValidBox(&board, index, option) { 
            //println!("\n{} is valid", option.to_string());
            return true; 
        } else {
            //println!("\n{} is not valid", option.to_string());
            return false;
        }
    }
    return false;
}

fn random_print(vec: &Vec<i32>) {
    for num in vec.iter() {
        println!("{}", num);
    }
    println!("\n");
}

//PICK RANDOM FROM INDEX
//SET VALUE TO 0 
//SOLVE EVERY POSSIBLE COMBINATION
//IF MORE THAN ONE POSSIBLE, BACK TRACK
//
/*remove_square() {
}*/

fn find_open_squares(board: &Vec<Square>) -> Option<Vec<usize>> {
    let mut open_squares: Vec<usize> = Vec::new();

    for (index, square) in board.iter().enumerate() {
        if square.value == 0 {
            open_squares.push(index);
        }
    }

    if open_squares.len() > 0 {
        //println!("index: {}", open_squares[0]);
        return Some(open_squares);
    } else {
        //println!("\nNone Found");
        return None; 
    }
    

}

//Solutions = 0
//Find empty square
//if no possible squares return
//loop through possible values in this suqare
//if the board is valid we c

//Function returns when we have found a solution or exhausted all possible solutions and keep track of the amount

//if solutions > 1 return false
//Find an empty square
//if no possible squares
//Loop through possible values in that square
//If its valid than we set value to that option
//Call self again
//
//if loop is exhausted return true

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
        //println!("{}",  index);
        let mut options = Vec::new();
        for option in 1..10 {
            if isValid(&board, *index, option) {
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
            if isValid(&board, *index, *option) {
                board[*index].value = *option;
                one_solution_muscle(board, solutions, valid_values);
                board[*index].value = 0;
            }
            
        }
        return false;
        
    }
    return false;
}

fn one_solution(board: &mut Vec<Square>) -> bool {
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

//remove random square
//if one solution
//remove another square
//if not than put square back
//

fn remove_squares(board: &mut Vec<Square>) -> bool {
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
        //std::process::exit(0x100);
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

fn create_board(board: &mut Vec<Square>, index: usize) -> bool {
    let mut square_options: Vec<i32> = (1..10).collect();
    let mut rng = StdRng::from_entropy();
    square_options.shuffle(&mut rng);  

    if index == board.len() {
        return true;
    }
    for option in square_options.iter() {
        if isValid(&board, index, *option) {
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

fn string_to_squares(board_string: &str) -> Vec<Square> {
    let mut squares: Vec<Square> = Vec::new();

    let string_length = board_string.chars().count() as f64;
    let square_side_length = string_length.sqrt() as i32;

    let mut x: i32 = 0;
    let mut y: i32 = 0;

    for value in board_string.chars() {
        squares.push(Square {
            x,
            y,
            value: value as i32 - 0x30,
        });

        x += 1;
        if x % square_side_length == 0 {
            y += 1;
            x = 0;
        }
        
    }
    return squares
}

fn squares_to_string(board: &Vec<Square>) -> String {
    let mut board_string: String = "\n".to_string(); 

    for square in board.iter() {
        board_string = board_string + &square.value.to_string();
    }

    return board_string;
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
        create_board(&mut board, 0);

        let mut solution = board.clone();
        remove_squares(&mut board);
        return Board { squares: board.clone(), solution: solution };
    }
}

impl PartialEq for Square {
    fn eq(&self, other: &Self) -> bool {
        return self.value == other.value;
    }
}

fn print_vec(board: &Vec<Square>) {
    println!("");
    for square in board.iter() {

        if (square.y) % 3 == 0 && square.y != 0{
            print!(" | ");
        }

        if (square.x) % 3 == 0 && square.x != 0 && (square.y+1) == 1 {
            print!("\n{}\n", "=".repeat(32));
        }
        else if (square.y) % 9 == 0 as i32{
            print!("\n\n");
        }
        print!(" {} ", square.value.to_string());


       

    }
    println!("");


}

impl Board {
    fn print(&self) {
        for i in 0..=self.squares.len() {
            println!("{}",  self.squares[i].value.to_string());

            if i+1 % 9 == 0 {
                println!("\n");
            }
        }

    }

    fn save_text(&self)     {
        let f = OpenOptions::new()
        .write(true)
        .append(true)
        .open("test.txt")
        .expect("unable to open file");
        
        let mut f = BufWriter::new(f);
        
        write!(f, "{}{},", squares_to_string(&self.squares), squares_to_string(&self.solution));

    }

}

fn main() {
    //println!("u"); // 716548923205173846384096175000000000000000000000000000163482597972635481548917632
    //                                                716548923295173846384296175629754318437861259851329764163482597972635481548917632
    //let mut squares: Vec<Square> = string_to_squares("146027583070600900900183406501209340009000600760308209690402105000500890350801764");
    
    //let result: bool = one_solution(&mut squares);
   
    //let mut count: i32 = 0;

    let mut counter = 0;
    let mut total = 0;

    loop {
        if counter == 100 {
            break;
        }
        let start = PreciseTime::now();

        let board = Board::default();

        let end = PreciseTime::now();
        board.save_text();
        print_vec(&board.solution);
        print_vec(&board.squares);
        
        let board_str = squares_to_string(&board.squares);
        println!("{}", board_str);
        println!("Completed in {:?} seconds.", start.to(end));
        counter += 1;
        total += start.to(end).num_milliseconds() ;
    }

    println!("AVERAGE {}", total / counter);

    
    //board.generate_puzzle();

    /*loop {
        let mut board = Board::default();
        create_board(&mut board.squares, 0);
        board.save();
    }*/
    //let mut board = Board::default();
    //println!("done");

    
    

}