use crate::*;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct Config {
    pub grid_width: usize,
    pub grid_height: usize,
    pub snake_segment: u32,
    pub snake_init_pos: (u32, u32),
}

impl Default for Config {
    fn default() -> Self {
        Self {
            grid_width: 100,
            grid_height: 100,
            snake_segment: 10,
            snake_init_pos: (250, 250),
        }
    }
}
