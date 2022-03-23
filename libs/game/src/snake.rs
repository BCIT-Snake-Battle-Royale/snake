use crate::*;
pub use snake_head::*;
pub use snake_segment::*;

mod snake_head;
mod snake_segment;

#[derive(Debug, Deserialize, Serialize)]
pub struct Snake {
    head: SnakeHead,
    segments: Vec<SnakeSegment>
}

impl Snake {
    pub fn new(x: usize, y: usize) -> Self {
        Self {
            head: SnakeHead::new(x, y),
            segments: vec![],
        }
    }

    pub fn get_head(&self) -> &SnakeHead {
        &self.head
    }

    pub fn get_segments(&self) -> &[SnakeSegment] {
        &self.segments
    }
}