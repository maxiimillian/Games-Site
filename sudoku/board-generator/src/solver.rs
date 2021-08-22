pub mod strategies {
    use crate::square::square::Square;
    use crate::help::help;
    use crate::board::board;
    use std::collections::HashMap;

    pub fn naked_singles(board: &Vec<Square>) -> HashMap<usize, i32>{
        let mut naked_singles: HashMap<usize, i32> = HashMap::new();
        for index in 0..board.len() {
            let candidates = &board[index].candidates;
            if candidates.len() == 1 {
                naked_singles.insert(index as usize, candidates[0]);
            }
        }

        for (key, value) in &naked_singles {
            println!("{}: {}", key, value);
        }

        return naked_singles;   
    }
    
}