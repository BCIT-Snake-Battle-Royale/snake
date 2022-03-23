use crate::*;

#[derive(Debug, Clone, Serialize)]
pub struct SnakeHead {
    pub x: usize,
    pub y: usize,
}

impl From<&game::SnakeHead> for SnakeHead {
    fn from(snake_head: &game::SnakeHead) -> Self {
        Self {
            x: snake_head.x(),
            y: snake_head.y(),
        }
    }
}

