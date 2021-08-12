pub mod difficulty {
    pub struct Difficulty {
        pub filled_squares_count: i32,
    }

    impl Difficulty {
        fn EASY() -> Difficulty {
            Difficulty {
                filled_squares_count: 50,
            }
        }

        fn MEDIUM() -> Difficulty {
            Difficulty {
                filled_squares_count: 40,
            }
        }

        fn HARD() -> Difficulty {
            Difficulty {
                filled_squares_count: 30,
            }
        }

        fn EXTREME() -> Difficulty {
            Difficulty {
                filled_squares_count: 26,
            }
        }
    }
}