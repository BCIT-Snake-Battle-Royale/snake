use crate::*;

#[derive(Debug, Serialize, Deserialize)]
pub struct Segment {
    pub x: usize,
    pub y: usize,
}

impl Segment {
    pub fn new(x: usize, y: usize) -> Self {
        Self { x, y }
    }
    pub fn x(&self) -> usize {
        self.x
    }

    pub fn y(&self) -> usize {
        self.y
    }
}