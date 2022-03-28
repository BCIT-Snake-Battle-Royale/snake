use crate::*;
pub use item::*;
pub use segment::*;

mod segment;

// the user story says it can only be left/right but
// i'm thinking we gotta have up/down just so we can
// know which direction; we'll just have to make it so
// turning can only be a relative left/right
// #[wasm_bindgen] // idrk what this line does but it was in game of life a lot but it's causing compile errors akljdh
#[repr(u8)]
#[derive(Debug, Deserialize, Serialize, Clone, Copy, PartialEq, Eq)]
pub enum Direction {
    Up = 0,
    Right = 1,
    Down = 2,
    Left = 3,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Snake {
    head: Segment,
    tail: Vec<Segment>,
    direction: Direction,
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
            direction: Direction::Up, // defaulted to up for now
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

    fn get_new_segment(old_x: usize, old_y: usize, dir: Direction) -> Segment {
       let (x, y) = match dir {
           Direction::Up => (old_x, old_y - 1),
           Direction::Down => (old_x, old_y + 1),
           Direction::Left => (old_x - 1, old_y),
           Direction::Right => (old_x + 1, old_y)
       };
       
       Segment::new(x, y)
    }

    pub fn tick(&mut self) {        
        // todo: check for key press and change direction
        
        // todo: check for collision with wall and then Die

        // this moves the snake
        self.tail.insert(0, self.head);
        self.tail.truncate(self.score);
        self.head = snake::Snake::get_new_segment(self.head.x(), self.head.y(), self.direction);
    }
}