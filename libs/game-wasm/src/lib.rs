// TODO: ALL CODE THAT GETS CONFERTED INTO WASM binaries gets put here
use serde::Serialize;
use lib_game as game;
use wasm_bindgen::prelude::*;
use rand::prelude::*;

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
        let game = game::Game::new(config, rng);

        Self { rng, game }
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
