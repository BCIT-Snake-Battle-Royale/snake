use crate::*;

pub use self::snake_head::*;
pub use self::snake_segment::*;

mod snake_head;
mod snake_segment;

#[derive(Debug, Clone, Serialize)]
pub struct Snake {
    pub head: SnakeHead,
    pub segments: Vec<SnakeSegment>,
}

impl From<&game::Snake> for Snake {
    fn from(snake: &game::Snake) -> Self {
        let segments = snake
            .get_segments()
            .iter()
            .map(SnakeSegment::from)
            .collect();
        
        let head = SnakeHead::from(snake.get_head());

        Self { head, segments }
    }
}
