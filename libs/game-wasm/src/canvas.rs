use crate::*;
use wasm_bindgen::JsCast;
use web_sys::window;
use web_sys::{CanvasRenderingContext2d, HtmlCanvasElement};

pub struct Canvas {
    pub canvas: HtmlCanvasElement,
    pub ctx: CanvasRenderingContext2d,
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

        canvas.set_width(width);
        canvas.set_height(height);

        Self { canvas, ctx }
    }

    pub fn draw(&self, x: u32, y: u32, color: &str) {
        self.ctx.set_fill_style(&color.into());
        self.ctx.fill_rect(
            f64::from(x),
            f64::from(y),
            f64::from(config::Config::default().segment_size),
            f64::from(config::Config::default().segment_size),
        );
    }

    pub fn clear(&self) {
        self.ctx.set_fill_style(&"#FFFFFF".into());
        self.ctx.fill_rect(
            0.0,
            0.0,
            f64::from(config::Config::default().grid_width),
            f64::from(config::Config::default().grid_height),
        );
    }
}
