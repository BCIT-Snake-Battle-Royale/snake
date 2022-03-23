use crate::*;

#[derive(Debug, Clone, Serialize)]
pub struct SnakeSegment {
    pub x: usize,
    pub y: usize,
}

impl From<&game::SnakeSegment> for SnakeSegment {
    fn from(snake_seg: &game::SnakeSegment) -> Self {
        Self {
            x: snake_seg.x(),
            y: snake_seg.y(),
        }
    }
}
