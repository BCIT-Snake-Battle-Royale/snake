use crate::*;

#[derive(Debug, Serialize, Deserialize)]
pub struct SnakeSegment {
    pub x: usize,
    pub y: usize,
}

impl SnakeSegment {
    pub fn x(&self) -> usize {
        self.x
    }

    pub fn y(&self) -> usize {
        self.y
    }
}