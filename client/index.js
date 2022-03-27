import * as game from "lib-game-wasm";

console.log(game.hello_world())
console.log(game.Game.default_config())

let snakeGame = new game.Game(game.Game.default_config());
snakeGame.start();
console.log(snakeGame.config())
console.log(snakeGame.snake())