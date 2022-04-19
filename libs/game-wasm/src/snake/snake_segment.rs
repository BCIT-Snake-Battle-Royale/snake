use serde::Deserialize;

use crate::*;

#[derive(Debug, Copy, Clone, Serialize, Deserialize)]
pub struct SnakeSegment {
    pub x: usize,
    pub y: usize,
}

impl SnakeSegment {
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

// impl From<&game::Segment> for SnakeSegment {
//     fn from(snake_seg: &game::Segment) -> Self {
//         Self {
//             x: snake_seg.x(),
//             y: snake_seg.y(),
//         }
//     }
// }
