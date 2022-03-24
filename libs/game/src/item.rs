use crate::*;

#[derive(Debug, Clone, Serialize)]
pub struct Item {
    pub x: usize,
    pub y: usize,
    pub speed_effect: i32,
    pub invincibility: bool,
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

    pub fn x(&self) -> usize {
        self.x
    }

    pub fn y(&self) -> usize {
        self.y
    }

    pub fn speed_effect(&self) -> i32 {
        self.speed_effect
    }

    pub fn invincibility(&self) -> bool {
        self.invincibility
    }
}
