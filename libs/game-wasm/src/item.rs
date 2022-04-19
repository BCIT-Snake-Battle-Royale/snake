use crate::*;
use rand::thread_rng;
use rand::Rng;

#[derive(Debug, Clone, Serialize, Deserialize, Copy, PartialEq)]
pub enum ItemType {
    Food,
    SpeedModifier,
    InvincibilityModifier,
}

#[derive(Debug, Clone, Serialize, Deserialize, Copy)]
pub enum SpeedEffect {
    Faster,
    Slower,
    None,
}

fn get_random_val() -> u32 {
    let random_positions: Vec<u32> = (0..500).step_by(20).collect();
    let vec_length = random_positions.len();
    let index = rand::thread_rng().gen_range(0..vec_length);
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

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Item {
    pub item_type: ItemType,
    pub x: u32,
    pub y: u32,
    pub speed_effect: SpeedEffect,
}

impl Item {
    pub fn new(
        new_item_type: ItemType,
    ) -> Item {
        Self {
            item_type: new_item_type,
            x: get_random_val(),
            y: get_random_val(),
            speed_effect: random_speed_effect(new_item_type),
        }      
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

    pub fn random_move(&mut self) {
        self.x = get_random_val();
        self.y = get_random_val();
    }
}
