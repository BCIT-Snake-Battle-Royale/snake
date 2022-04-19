// TODO: ALL CODE THAT GETS CONFERTED INTO WASM binaries gets put here
pub use self::{config::*, item::*, snake::*};

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

        Self {
            rng,
            snake,
            canvas,
            config,
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
            "#FF0000",
        );
        // Draw snake tail
        // for SnakeSegment { x, y } in &self.snake.tail {
        //     self.canvas.draw(*x, *y, "#000000");
        // }
    }

    // Returns a state when called by client: { score, isAlive }
    pub fn tick(&mut self, tick_input: JsValue) -> JsValue {
        let input: TickInput = tick_input.into_serde().unwrap();
        // web_sys::console::log_1(input.direction_vector);
        web_sys::console::log_1(&tick_input);

        self.config.direction_vector = input.direction_vector;
        // Physics
        // Collisions

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
