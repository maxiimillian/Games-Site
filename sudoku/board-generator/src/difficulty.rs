pub mod difficulty {

    #[derive(Clone)]
    pub struct Difficulty {
        pub filled_squares_count: i32,
    }

    impl Difficulty {
        pub fn EASY() -> Difficulty {
            Difficulty {
                filled_squares_count: 50,
            }
        }

        pub fn MEDIUM() -> Difficulty {
            Difficulty {
                filled_squares_count: 40,
            }
        }

        pub fn HARD() -> Difficulty {
            Difficulty {
                filled_squares_count: 30,
            }
        }

        pub fn EXTREME() -> Difficulty {
            Difficulty {
                filled_squares_count: 26,
            }
        }
    }
}

