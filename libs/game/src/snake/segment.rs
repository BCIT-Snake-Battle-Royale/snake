use crate::*;

#[derive(Debug, Serialize, Deserialize, Copy, Clone)]
pub struct Segment {
    pub x: u32,
    pub y: u32,
}

impl Segment {
    pub fn new(x: u32, y: u32) -> Self {
        Self { x, y }
    }
    pub fn x(&self) -> u32 {
        self.x
    }

    pub fn y(&self) -> u32 {
        self.y
    }
}
