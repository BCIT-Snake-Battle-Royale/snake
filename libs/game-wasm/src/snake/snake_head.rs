use crate::*;

#[derive(Debug, Clone, Serialize)]
pub struct SnakeHead {
    pub x: usize,
    pub y: usize,
}

impl From<&game::Segment> for SnakeHead {
    fn from(snake_head: &game::Segment) -> Self {
        Self {
            x: snake_head.x(),
            y: snake_head.y(),
        }
    }
}

