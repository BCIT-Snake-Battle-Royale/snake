use serde::Deserialize;

use crate::*;

#[derive(Debug, Copy, Clone, Serialize, Deserialize)]
pub struct SnakeSegment {
    pub x: u32,
    pub y: u32,
}

impl SnakeSegment {
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

// impl From<&game::Segment> for SnakeSegment {
//     fn from(snake_seg: &game::Segment) -> Self {
//         Self {
//             x: snake_seg.x(),
//             y: snake_seg.y(),
//         }
//     }
// }
