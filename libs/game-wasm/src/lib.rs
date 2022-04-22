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
    has_speed_item: bool,
    speed_item: Item,
    has_bomb_item: bool,
    bomb_item: Item,
    has_invincibility_item: bool,
    invincibility_item: Item,
}

#[wasm_bindgen]
impl Game {
    #[wasm_bindgen(constructor)]
    pub fn new(config: JsValue) -> Self {
        web_sys::console::log_1(&config);
        let config: Config = config.into_serde().unwrap();
        let mut rng = thread_rng();

        let canvas = canvas::Canvas::new("snake-canvas", config.grid_width, config.grid_height);
        let mut snake = Snake::new(config.snake_init_pos.0, config.snake_init_pos.1);
        let mut food_item = Item::new(ItemType::Food);
        food_item.random_move(&mut snake, vec![]);
        let mut speed_item = Item::new(ItemType::SpeedModifier);
        speed_item.random_move(&mut snake, vec![food_item]);
        let has_speed_item = false;
        let has_bomb_item = false;
        let mut bomb_item = Item::new(ItemType::Bomb);
        bomb_item.random_move(&mut snake, vec![food_item, speed_item]);
        let has_invincibility_item = false;
        let invincibility_item = Item::new(ItemType::InvincibilityModifier);

        Self {
            rng,
            snake,
            canvas,
            config,
            food_item,
            has_speed_item,
            speed_item,
            has_bomb_item,
            bomb_item,
            has_invincibility_item,
            invincibility_item,
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
        

        // change snake color depending on whether snake is alive (green if yes, dark bug colour if no)
        // if alive and invincible, change colour to a bluish green. teal, you might even call it
        let snake_color = if self.snake.get_is_alive() { 
            if self.snake.is_invincible() { "#419971" } else { "#008000" }
        } else { "#313312" };

        // Draw snake head
        self.canvas.draw(
            self.snake.get_head().x(),
            self.snake.get_head().y(),
            snake_color,
        );
        // Draw snake tail
        for SnakeSegment { x, y } in &self.snake.tail {
            self.canvas.draw(*x, *y, snake_color);
        }
        // Draw food item
        self.canvas.draw(
            self.food_item.get_x(),
            self.food_item.get_y(),
            "#FF0000", // Red (apple)
        );
        // TODO: Different colour for faster vs slower
        if self.has_speed_item {
            if self.speed_item.get_speed_effect() == SpeedEffect::Slower {
                self.canvas.draw(
                    self.speed_item.get_x(),
                    self.speed_item.get_y(),
                    "#c48adb" // Light purple for slower
                );
            } else {
                self.canvas.draw(
                    self.speed_item.get_x(),
                    self.speed_item.get_y(),
                    "#9932CC" // Dark purple for faster
                );
            }
        }
        if self.has_bomb_item {
            self.canvas.draw(
                self.bomb_item.get_x(),
                self.bomb_item.get_y(),
                "#000000" // Black
            );
        }
        if self.has_invincibility_item {
            self.canvas.draw(
                self.invincibility_item.get_x(),
                self.invincibility_item.get_y(),
                "#c2962f" // Gold
            );
        }
    }

    // Returns a state when called by client: { score, isAlive }
    pub fn tick(&mut self, tick_input: JsValue) -> JsValue {
        let input: TickInput = tick_input.into_serde().unwrap();
        // web_sys::console::log_1(input.direction_vector);
        web_sys::console::log_1(&tick_input);

        if self.snake.get_is_alive() {
            self.config.direction_vector = input.direction_vector;
            self.snake.change_direction(self.config.direction_vector);
            self.snake.move_snake();

            if self.snake.is_invincible() {
                self.snake.decrement_invincibility_timer()
            }

            // THE COLLISION ZONE....
            self.snake.die_if_out_of_bounds(self.config.grid_width, self.config.grid_height);

            // If no speed item, maybe show one (can't be too often)
            if !self.has_speed_item {
                // 10% of the time, show the current speed item
                let rand_int: u32 = rand::thread_rng().gen_range(0..100);
                if rand_int < 10 {
                    self.has_speed_item = true;
                }  
            } else {
                // If there is a speed item already and there's a collision, slow down or speed up snake
                if self.snake.check_head_collision(self.speed_item.get_x(), self.speed_item.get_y()) {
                    let speed_effect: SpeedEffect = self.speed_item.get_speed_effect();

                    if speed_effect == SpeedEffect::Faster {
                        self.config.increase_speed();
                    } else { // Else if slower
                        self.config.decrease_speed();
                    }
                    
                    // Reset/update speed_item
                    self.has_speed_item = false;
                    self.speed_item.random_move(&mut self.snake, vec![self.bomb_item, self.invincibility_item, self.food_item]);
                    self.speed_item.reset_effect();
                }
            }

            // If no bomb item, maybe show one (can't be too often)
            if !self.has_bomb_item {
                // 1% of the time, show the current speed item
                let rand_int: u32 = rand::thread_rng().gen_range(0..1000);
                if rand_int < 10 {
                    self.has_bomb_item = true;
                }  
            } else {
                if self.snake.check_head_collision(self.bomb_item.get_x(), self.bomb_item.get_y()) {
                    // only die if the snake is not invincible upon collision
                    if !self.snake.is_invincible() {
                        self.snake.die();
                    }

                    // move bomb regardless of whether the bomb really did kill the snake
                    self.bomb_item.random_move(&mut self.snake, vec![self.speed_item, self.invincibility_item, self.food_item]);
                    self.has_bomb_item = false;
                }
            }

            // If no invincibility item, maybe show one (can't be too often)
            if !self.has_invincibility_item {
                // 1% of the time, show the current speed item
                let rand_int: u32 = rand::thread_rng().gen_range(0..1000);
                if rand_int < 10 {
                    self.has_invincibility_item = true;
                }  
            } else {
                if self.snake.check_head_collision(self.invincibility_item.get_x(), self.invincibility_item.get_y()) {
                    self.has_invincibility_item = false;
                    self.snake.set_invincible();
                    self.invincibility_item.random_move(&mut self.snake, vec![self.speed_item, self.bomb_item, self.food_item])
                }
            }

            if self.snake.check_head_collision(self.food_item.get_x(), self.food_item.get_y()) {
                self.food_item.random_move(&mut self.snake, vec![self.speed_item, self.invincibility_item, self.bomb_item]);
                self.snake.increment_score();
            }

            // get rid of the excess tail
            self.snake.truncate_tail();

            // if snake is not invincible, die if the head hits the tail 
            if !self.snake.is_invincible() {
                self.snake.die_if_head_tail_collision();
            }

        } else {
            // snake dying process takes 5 seconds
            self.config.set_speed((5000 / self.snake.get_score()).try_into().unwrap());
            if self.snake.death_process() {
                // reduce tick rate to an absurdly high number because we shouldn't bother trying to tick anymore
                self.config.set_speed(100000);
            }
        }

        // Render
        self.render_canvas();

        // update snake size
        self.config.snake_score = self.snake.get_score();
        self.config.snake_is_alive = self.snake.get_is_alive();

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
