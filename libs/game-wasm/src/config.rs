use crate::*;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct Config {
    pub grid_width: u32,
    pub grid_height: u32,

    pub snake_init_pos: (u32, u32),
}

impl Default for Config {
    fn default() -> Self {
        Self {
            grid_width: 100,
            grid_height: 100,

            snake_init_pos: (0, 0),
        }
    }
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct TickInput {
    direction_vector: (i32, i32),
}
