use crate::*;

enum ItemType {
    SpeedModifier,
    InvincibilityModifier,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Item {
    pub item_type: ItemType,
    pub x: usize,
    pub y: usize,
    pub speed_effect: i32,
}

impl Item {
    pub fn new(x: usize, y: usize, speed_effect: i32, invincibility: bool) -> Item {
        Self {
            x,
            y,
            speed_effect,
            invincibility,
        }
    }

    pub fn get_x(&self) -> usize {
        self.x
    }

    pub fn get_y(&self) -> usize {
        self.y
    }

    pub fn get_speed_effect(&self) -> i32 {
        self.speed_effect
    }

    pub fn get_item_type(&self) -> ItemType {
        self.item_type
    }

}
