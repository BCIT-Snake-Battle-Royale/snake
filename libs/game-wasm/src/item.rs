use crate::*;
use rand::Rng;
use rand::rngs::StdRng;

#[derive(Debug, Clone, Serialize, Deserialize, Copy, PartialEq)]
pub enum ItemType {
    Food,
    SpeedModifier,
    InvincibilityModifier,
    Bomb,
}

#[derive(Debug, Clone, Serialize, Deserialize, Copy, PartialEq)]
pub enum SpeedEffect {
    Faster,
    Slower,
    None,
}

// Diff seed int for diff item types
fn get_random_val(item_type: ItemType) -> u32 {
    // let mut rng = StdRng::seed_from_u64
    //     (item_type as u64);
    let mut rng = thread_rng();
    let random_positions: Vec<u32> = (0..500).step_by(20).collect();
    let vec_length = random_positions.len();
    let index = rng.gen_range(0..vec_length);
    return random_positions[index];
}

// If item type is SpeedModifier, randomly set speef effect to faster or slower, else set to none
fn random_speed_effect(item_type: ItemType) -> SpeedEffect {
    if item_type == ItemType::SpeedModifier {
        let mut rng = thread_rng();
        let val: u32 = rng.gen_range(0..2);
        if val == 0 {
            SpeedEffect::Faster
        } else {
            SpeedEffect::Slower
        }
    } else {
        SpeedEffect::None
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, Copy)]
pub struct Item {
    pub item_type: ItemType,
    pub x: u32,
    pub y: u32,
    pub speed_effect: SpeedEffect,
    // rng: StdRng,
}

impl Item {
    pub fn new(
        item_type: ItemType,
    ) -> Item { // Self?
        let x = get_random_val(item_type);
        let y = get_random_val(item_type);
        let speed_effect = random_speed_effect(item_type);

        Self {
            item_type,
            x,
            y,
            speed_effect,
        }      
    }

    pub fn reset_effect(&mut self) {
        self.speed_effect = random_speed_effect(ItemType::SpeedModifier);
    }

    pub fn set_x(&mut self, x_val: u32) {
        self.x = x_val
    }

    pub fn get_x(&self) -> u32 {
        self.x
    }

    pub fn set_y(&mut self, y_val: u32) {
        self.y = y_val
    }

    pub fn get_y(&self) -> u32 {
        self.y
    }

    pub fn set_speed_effect(&mut self, new_speed_effect: SpeedEffect) {
        self.speed_effect = new_speed_effect
    }

    pub fn get_speed_effect(&self) -> SpeedEffect {
        self.speed_effect
    }

    pub fn get_item_type(&self) -> ItemType {
        self.item_type
    }

    pub fn check_collision(&self, x: u32, y: u32) -> bool {
        self.x == x && self.y == y
    }

    fn check_item_vec_collision(&self, items: &Vec<Item>) -> bool {
        for item in items {
            if self.check_collision(item.x, item.y) {
                return true;
            } 
        }

        return false;
    }

    pub fn random_move(&mut self, snake: &mut snake::Snake, items: Vec<Item>) {
        self.x = get_random_val(self.item_type);
        self.y = get_random_val(self.item_type);

        let segment_size = config::Config::default().segment_size;
        let grid_width = config::Config::default().grid_width;
        let grid_height = config::Config::default().grid_height;

        let ph_x = self.x;
        let ph_y = self.y;

        while snake.check_full_collision(self.x, self.y) || self.check_item_vec_collision(&items) {
            // check the next spot to the right of the random spot (or wrap around grid if no spots to the right are available)
            self.x = (self.x + segment_size) % grid_width;
            
            // if all spots on a given row are occupied, go down a row (or wrap around)
            if self.x == ph_x {
                self.y = (self.y + segment_size) % grid_height;
            }

            // this is hit if every single spot in the board is occupied (at which point it gives up and stops trying)
            if self.y == ph_y {
                break;
            }
        }
    }
}
