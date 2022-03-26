use crate::*;
pub use item::*;
pub use segment::*;

mod segment;

#[derive(Debug, Deserialize, Serialize)]
pub struct Snake {
    head: Segment,
    tail: Vec<Segment>,
    // direction: Direction,
    item_queue: Vec<Item>,
    score: usize,
    speed: usize,
    is_invincible: bool,
    is_alive: bool
}

impl Snake {
    pub fn new(x: usize, y: usize) -> Self {
        Self {
            head: Segment::new(x, y),
            tail: Vec::new(),
            // direction: Direction,
            item_queue: Vec::new(),
            score: 0,
            speed: 1,    // defaulted to 1 for now
            is_invincible: true,
            is_alive: true,
        }
    }

    pub fn get_head(&self) -> &Segment {
        &self.head
    }

    pub fn get_tail(&self) -> &Vec<Segment> {
        &self.tail
    }

    pub fn get_item_queue(&self) -> &Vec<Item> {
        &self.item_queue
    }

    pub fn get_score(&self) -> usize {
        self.score
    }

    pub fn get_speed(&self) -> usize {
        self.speed
    }

    pub fn get_is_invincible(&self) -> bool {
        self.is_invincible
    }

    pub fn get_is_alive(&self) -> bool {
        self.is_invincible
    }
}