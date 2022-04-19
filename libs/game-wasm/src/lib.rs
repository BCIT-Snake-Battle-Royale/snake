// TODO: ALL CODE THAT GETS CONFERTED INTO WASM binaries gets put here
pub use self::snake::*;

use gloo_events::EventListener;
use lib_game as game;
use rand::prelude::*;
use serde::Serialize;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;

mod canvas;
mod snake;

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
        let mut game = game::Game::new(config, &mut rng);

        let canvas = canvas::Canvas::new("snake-canvas", 500, 500);

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
        self.canvas.ctx.fill_rect(250.0, 250.0, 10.0, 10.0);
        self.keydown_event_listener();
    }

    pub fn tick(&self) {
        let snake = Snake::from(self.game.snake());
        // Possibly move this chunk to lib-game-wasm/snake.rs
        // Clear canvas
        self.canvas.clear();
        // Draw snake head
        self.canvas.draw(snake.head.x, snake.head.y, "#FF0000");
        // Draw snake tail
        for Segment { x, y } in snake.tail {
            self.canvas.draw(x, y, "#000000");
        }
    }

    pub fn keydown_event_listener(&mut self) {
        let window = web_sys::window().expect("Window does not exist.");
        let document = window.document().expect("Document expected on Window.");

        let mut dir: usize;

        let on_keydown = EventListener::new(&document, "keydown", move |event| {
            let keyboard_event = event.clone().dyn_into::<web_sys::KeyboardEvent>().unwrap();
            let key_code = &keyboard_event.key();

            match key_code.as_str() {
                "ArrowUp" => dir = 0,
                "ArrowRight" => dir = 1,
                "ArrowDown" => dir = 2,
                "ArrowLeft" => dir = 3,
                _ => panic!("Wrong direction provided."),
            };

            document
                .get_element_by_id("debug-text")
                .unwrap()
                .set_inner_html(self.game.snake().get_direction().as_str());
        });

        // Keeps the EventListener alive forever, so it will never be dropped
        on_keydown.forget();
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
