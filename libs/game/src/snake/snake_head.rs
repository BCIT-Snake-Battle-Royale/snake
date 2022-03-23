use crate::*;

#[derive(Debug, Serialize, Deserialize)]
pub struct SnakeHead {
    pub x: usize,
    pub y: usize,
}

impl SnakeHead {
    pub fn new(x: usize, y: usize) -> SnakeHead {
        Self { x, y }
    }

    pub fn x(&self) -> usize {
        self.x
    }

    pub fn y(&self) -> usize {
        self.y
    }
}