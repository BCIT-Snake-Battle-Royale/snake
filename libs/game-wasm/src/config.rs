use crate::*;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct Config {
    pub grid_width: u32,
    pub grid_height: u32,
    pub segment_size: u32,
    pub snake_init_pos: (u32, u32),
    pub direction_vector: i32,
    pub tickrate: u32,
    pub snake_score: usize, 
    pub snake_is_alive: bool,
}

impl Default for Config {
    fn default() -> Self {
        Self {
            grid_width: 500,
            grid_height: 500,
            segment_size: 10,
            snake_init_pos: (250, 250),
            direction_vector: 0,
            tickrate: 100,
            snake_score: 0,
            snake_is_alive: true,
        }
    }
}

impl Config {
    pub fn decrease_speed(&mut self) {
        if (self.tickrate - 25) >= 10 {
            self.tickrate += 25
        }
    }

    pub fn increase_speed(&mut self) {
        if (self.tickrate - 25) >= 10 {
            self.tickrate -= 25
        }
    }

    pub fn set_speed(&mut self, speed: u32) {
        self.tickrate = speed;
    }
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct TickInput {
    pub direction_vector: i32,
}

impl Default for TickInput {
    fn default() -> Self {
        Self {
            direction_vector: 0,
        }
    }
}
