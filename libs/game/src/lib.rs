pub use crate::{config::*, item::*, snake::*};

use rand::{Rng, RngCore};
use serde::{Deserialize, Serialize};

mod config;
mod item;
mod snake;

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

    pub fn apply_item_effect(item: Item, snake: &mut Snake) {
        match item.item_type {
            SpeedModifier => snake.set_speed(item.get_speed_effect().try_into().unwrap()),
            InvincibilityModifier => snake.set_is_invincible(),
        }
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
