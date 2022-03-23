use crate::*;

pub struct SnakeHead {
    pub x: usize,
    pub y: usize,
}

impl SnakeHead {
    pub fn new(x: usize, y: usize) -> SnakeHead {
        Self { x, y }
    }
}