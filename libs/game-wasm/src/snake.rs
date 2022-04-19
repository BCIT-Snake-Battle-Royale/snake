use crate::*;

pub use self::segment::*;
pub use canvas::Canvas;

mod segment;

#[derive(Debug, Clone, Serialize)]
pub struct Snake {
    pub head: Segment,
    pub tail: Vec<Segment>,
}

impl From<&game::Snake> for Snake {
    fn from(snake: &game::Snake) -> Self {
        let tail = snake.get_tail().iter().map(Segment::from).collect();

        let head = Segment::from(snake.get_head());

        Self { head, tail }
    }
}
