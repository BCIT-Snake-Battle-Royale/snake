use wasm_bindgen::JsCast;
use web_sys::window;
use web_sys::{CanvasRenderingContext2d, HtmlCanvasElement};

pub struct Canvas {
    pub canvas: HtmlCanvasElement,
    pub ctx: CanvasRenderingContext2d,
    width: u32,
    height: u32,
}

impl Canvas {
    pub fn new(canvas_id: &str, width: u32, height: u32) -> Canvas {
        let document = window().unwrap().document().unwrap();
        let canvas = document.get_element_by_id(canvas_id).unwrap();
        let canvas: HtmlCanvasElement = canvas
            .dyn_into::<HtmlCanvasElement>()
            .map_err(|_| ())
            .unwrap();

        let ctx: CanvasRenderingContext2d = canvas
            .get_context("2d")
            .unwrap()
            .unwrap()
            .dyn_into::<CanvasRenderingContext2d>()
            .unwrap();

        Self {
            canvas,
            ctx,
            width,
            height,
        }
    }

    pub fn draw(&self, x: u32, y: u32, color: &str) {
        self.ctx.set_fill_style(&color.into());
        self.ctx.fill_rect(f64::from(x), f64::from(y), 10.0, 10.0);
    }

    pub fn clear(&self) {
        self.ctx.set_fill_style(&"FFFFF".into());
        self.ctx
            .fill_rect(0.0, 0.0, f64::from(self.width), f64::from(self.height));
    }
}
