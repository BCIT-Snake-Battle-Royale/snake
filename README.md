# Snake wasm

### How to start the project?

1. Ensure you have wasm-pack and target of "wasm-unknown-unknown"

2. Navigate to "/libs/game-wasm" and compile the "pkg" wasm binaries
  - run "wasm-pack build"
  - Check that there is a folder with wasm and js files in "/libs/game-wasm/pkg"

3. Navigate to "/client" and install node dependencies and that you have latest node version "16.14.2"
  - run "npm install"
  - run "npm run start"
  - Navigate to "localhost:8080" and see that you are connected to wasm!