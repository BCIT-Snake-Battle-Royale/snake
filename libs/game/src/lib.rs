pub use crate::{
    snake::*,
    config::*,
    item::*,
};

use serde::{Deserialize, Serialize};
use rand::{RngCore, Rng};

mod config;
mod snake;
mod item;

pub struct Game {
    snake: Snake,
    config: Config,
}

impl Game {
    pub fn new(config: Config, rng: &mut dyn RngCore) -> Self {
        // Perhaps you need Random number generator ^^

        Self {
            snake: Snake::new(config.snake_init_pos.0, config.snake_init_pos.1),
            config,
        }
    }

    pub fn snake(&self) -> &Snake {
        &self.snake
    }

    pub fn config(&self) -> &Config {
        &self.config
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
