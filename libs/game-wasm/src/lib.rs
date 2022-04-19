// TODO: ALL CODE THAT GETS CONFERTED INTO WASM binaries gets put here
pub use self::{config::*, item::*, snake::*, item::*};

use rand::prelude::*;
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

mod canvas;
mod config;
mod item;
mod snake;

#[wasm_bindgen]
pub struct Game {
    // Dependencies here, maybe you want random num generator?
    rng: ThreadRng,
    snake: Snake,
    canvas: canvas::Canvas,
    config: Config,
    food_item: Item,
    // speed_item: Item,
    // invincibility_item: Item,
}

#[wasm_bindgen]
impl Game {
    #[wasm_bindgen(constructor)]
    pub fn new(config: JsValue) -> Self {
        web_sys::console::log_1(&config);
        let config: Config = config.into_serde().unwrap();
        let mut rng = thread_rng();

        let canvas = canvas::Canvas::new("snake-canvas", config.grid_width, config.grid_height);
        let snake = Snake::new(config.snake_init_pos.0, config.snake_init_pos.1);
        let food_item = Item::new(ItemType::Food);
        // let speed_item = Item::new(ItemType::SpeedModifier);
        // let invincibility_item = Item::new(ItemType::InvincibilityModifier);

        Self {
            rng,
            snake,
            canvas,
            config,
            food_item,
            // speed_item,
            // invincibility_item,
        }
    }

    pub fn default_config() -> JsValue {
        JsValue::from_serde(&Config::default()).unwrap()
    }

    pub fn config(&self) -> JsValue {
        JsValue::from_serde(&self.config).unwrap()
    }

    pub fn snake(&self) -> JsValue {
        JsValue::from_serde(&self.snake).unwrap()
    }

    pub fn start(&mut self) {
        self.render_canvas();
    }

    pub fn render_canvas(&self) {
        // Possibly move this chunk to lib-game-wasm/snake.rs
        // Clear canvas
        self.canvas.clear();
        // Draw snake head
        self.canvas.draw(
            self.snake.get_head().x(),
            self.snake.get_head().y(),
            "#008000", // Green
        );
        // Draw snake tail
        for SnakeSegment { x, y } in &self.snake.tail {
            self.canvas.draw(*x, *y, "#000000");
        }
        // Draw food item
        self.canvas.draw(
            self.food_item.get_x(),
            self.food_item.get_y(),
            "#FF0000", // Red
        );
        // TODO: Different colour for faster vs slower
        // if self.speed_item {
        //     self.canvas.draw(
        //         self.speed_item.get_x(),
        //         self.food_item.get_y(),
        //         "#8E44AD" // Purple
        //     );
        // }
    }

    // Returns a state when called by client: { score, isAlive }
    pub fn tick(&mut self, tick_input: JsValue) -> JsValue {
        let input: TickInput = tick_input.into_serde().unwrap();
        // web_sys::console::log_1(input.direction_vector);
        web_sys::console::log_1(&tick_input);

        self.config.direction_vector = input.direction_vector;
        self.snake.change_direction(self.config.direction_vector);
        self.snake.move_snake();

        // THE COLLISION ZONE....
        self.snake.die_if_out_of_bounds(self.config.grid_width, self.config.grid_height);
        // todo: add collision for item and food and put those things riiight here :D

        if self.snake.get_head().x() == self.food_item.get_x() && self.snake.get_head().y() == self.food_item.get_y() {
            self.food_item.random_move();
        }

        self.snake.truncate_tail();
        // change below part if invincible? not sure how invincible works 0_0
        self.snake.die_if_head_tail_collision();

        // Render
        self.render_canvas();

        self.config()
    }
}

#[wasm_bindgen]
pub fn hello_world() -> String {
    "Hello guys welcome!".into()
}

#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        let result = 2 + 2;
        assert_eq!(result, 4);
    }
}
