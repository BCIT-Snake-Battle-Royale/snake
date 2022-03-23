pub use crate::{
    snake::*,
    config::*,
};

use serde::{Deserialize, Serialize};
use rand::{RngCore, Rng};

mod config;
mod snake;

pub struct Game {
    snake: Snake,
}

impl Game {
    pub fn new(config: Config, rng: &mut dyn RngCore) -> Self {
        // Perhaps you need Random number generator ^^

        Self {
            snake: Snake::new(config.snake_init_pos.0, config.snake_init_pos.1)
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
