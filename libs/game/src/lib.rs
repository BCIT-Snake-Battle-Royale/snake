pub use crate::{
    snake::*
};

mod snake;

pub struct Game {
    snake: Snake,
}

impl Game {
    pub fn new() -> Self {
        Self {
            snake: Snake::new(0, 0)
        }
    }

    pub fn hello_world() {
        println!("Hello world!");
    }
}

#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        let result = 2 + 2;
        assert_eq!(result, 4);
    }
}
