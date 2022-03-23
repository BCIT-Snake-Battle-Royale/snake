// TODO: ALL CODE THAT GETS CONFERTED INTO WASM binaries gets put here
pub use self::{ snake::* };

use serde::Serialize;
use lib_game as game;
use wasm_bindgen::prelude::*;
use rand::prelude::*;

mod snake;

#[wasm_bindgen]
pub struct Game {
    // Dependencies here, maybe you want random num generator?
    rng: ThreadRng,
    game: game::Game,
}

#[wasm_bindgen]
impl Game {
    #[wasm_bindgen(constructor)]
    pub fn new(config: JsValue) -> Self {
        let config: game::Config = config.into_serde().unwrap();

        let mut rng = thread_rng();
        let game = game::Game::new(config, &mut rng);

        Self { rng, game }
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
