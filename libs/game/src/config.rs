use crate::*;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct Config {
    pub grid_width: usize,
    pub grid_height: usize,

    pub snake_init_pos: (usize, usize),
}

impl Default for Config {
    fn default() -> Self {
        Self {
            grid_width: 100,
            grid_height: 100,

            snake_init_pos: (50, 50),
        }
    }
}
