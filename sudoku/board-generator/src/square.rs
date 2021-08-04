pub mod square {
    #[derive(Clone, Copy)]
    pub struct Square {
        pub x: i32,
        pub y: i32,
        pub value: i32,
    }
    
    impl PartialEq for Square {
        fn eq(&self, other: &Self) -> bool {
            return self.value == other.value;
        }
    }
}

