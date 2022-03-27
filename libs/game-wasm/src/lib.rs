// TODO: ALL CODE THAT GETS CONFERTED INTO WASM binaries gets put here
pub use self::{ snake::* };

use serde::Serialize;
use lib_game as game;
use wasm_bindgen::prelude::*;
use rand::prelude::*;

mod snake;
mod canvas;

#[wasm_bindgen]
pub struct Game {
    // Dependencies here, maybe you want random num generator?
    rng: ThreadRng,
    game: game::Game,
    canvas: canvas::Canvas,
}

#[wasm_bindgen]
impl Game {
    #[wasm_bindgen(constructor)]
    pub fn new(config: JsValue) -> Self {
        let config: game::Config = config.into_serde().unwrap();

        let mut rng = thread_rng();
        let game = game::Game::new(config, &mut rng);

        let canvas = canvas::Canvas::new("snake-canvas", 100, 100);

        Self { rng, game, canvas }
    }

    pub fn default_config() -> JsValue {
        JsValue::from_serde(&game::Config::default()).unwrap()
    }

    pub fn config(&self) -> JsValue {
        JsValue::from_serde(self.game.config()).unwrap()
    }

    pub fn snake(&self) -> JsValue {
        let snake = Snake::from(self.game.snake());
        JsValue::from_serde(&snake).unwrap()
    }

    pub fn start(&self) {
        self.canvas.ctx.set_fill_style(&"#0000FF".into());
        self.canvas.ctx.fill_rect(5.0, 5.0, 10.0, 10.0);
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
