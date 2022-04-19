use crate::*;

#[derive(Debug, Clone, Serialize)]
pub struct Segment {
    pub x: u32,
    pub y: u32,
}

impl From<&game::Segment> for Segment {
    fn from(snake_seg: &game::Segment) -> Self {
        Self {
            x: snake_seg.x(),
            y: snake_seg.y(),
        }
    }
}
