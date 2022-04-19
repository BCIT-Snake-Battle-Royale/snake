use crate::*;
pub use item::*;
pub use segment::*;

mod segment;

// the user story says it can only be left/right but
// i'm thinking we gotta have up/down just so we can
// know which direction; we'll just have to make it so
// turning can only be a relative left/right
// #[wasm_bindgen] // idrk what this line does but it was in game of life a lot but it's causing compile errors akljdh
#[repr(u16)]
#[derive(Debug, Deserialize, Serialize, Clone, Copy, PartialEq, Eq)]
pub enum Direction {
    Up = 0,
    Right = 90,
    Down = 180,
    Left = 270,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Snake {
    head: Segment,
    tail: Vec<Segment>,
    direction: Direction,
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
            direction: Direction::Up, // defaulted to up for now
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

    // makes a segment at coordinates according to given direction
    fn get_new_segment(old_x: usize, old_y: usize, dir: Direction) -> Segment {
        let (x, y) = match dir {
            Direction::Up => (old_x, old_y - 1),
            Direction::Down => (old_x, old_y + 1),
            Direction::Left => (old_x - 1, old_y),
            Direction::Right => (old_x + 1, old_y)
        };
        
        Segment::new(x, y)
    }

    // adds head to the front of the tail and then creates a new head according to direction
    // (this function should be called AFTER changing the direction of the snake)
    pub fn move_snake(&mut self) {
        self.tail.insert(0, self.head);
        self.head = snake::Snake::get_new_segment(self.head.x(), self.head.y(), self.direction);
    }

    // shrink the tail according to the user's score 
    // (called after moving the snake, and after checking for and eating any food at the new head position)
    pub fn truncate_tail(&mut self) {
        self.tail.truncate(self.score);
    }

    pub fn die_on_out_of_bounds(&mut self, grid_width: usize, grid_height: usize) {
        // because the head's x and y are usize, any negative coordinates should overflow
        // into being positive; ergo, only checking if x/y is greater than width/height
        if self.head.x >= grid_width || self.head.y >= grid_height {
            self.is_alive = false
        }
    }

    // if the head has the same coords as any part of the tail, Die !
    pub fn die_on_head_tail_collision(&mut self) {
        for seg in &self.tail {
            if self.head.x == seg.x && self.head.y == seg.y {
                self.is_alive = false
            }
        }
    }

    // this can be used to check for item collision for example
    pub fn check_head_collision(&mut self, x: usize, y: usize) -> bool {
        if self.head.x == x && self.head.y == y {
            return true;
        }

        return false;
    }

    // use this before placing items because items should not spawn inside of the snake
    pub fn check_full_collision(&mut self, x: usize, y: usize) -> bool {
        for seg in &self.tail {
            if seg.x == x && seg.y == y {
                return true;
            }
        }

        return self.check_head_collision(x, y);
    }

    // i'm not exactly sure where the food pickup is?
    // so here's an implementation of picking it up which does not require the snake to know what food is
    pub fn eat_food_on_collision(&mut self, food_x: usize, food_y: usize) {
        if self.check_head_collision(food_x, food_y) {
            self.score += 1
        }
    }

    // Right now, speed update is permanent
    pub fn set_speed(&mut self, speed_effect: usize) {
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