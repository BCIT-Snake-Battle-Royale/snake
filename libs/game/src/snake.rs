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
    invincibility_timer: usize, // Item team made this change
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
            invincibility_timer: 0, // Set to not invincible to start
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
        self.invincibility_timer > 0
    }

    // Setters below added by item team:

    pub fn decrement_invincibility_timer(&mut self) {
        self.invincibility_timer -= 1
    }

    // Right now, speed update is permanent
    pub fn set_speed(&mut self, speed_effect) {
        self.speed += speed_effect
    }

    pub fn set_is_invincible(&mut self) {
        self.invincibility_timer += 10 // This will need to be adjusted
    }

    // TODO: Don't think we need this?
    // pub fn get_is_alive(&self) -> bool {
    //     self.is_invincible
    // }

}