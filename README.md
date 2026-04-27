# Tic Tac Toe

A browser-based Tic Tac Toe game built with vanilla JavaScript, HTML, and CSS. This project was built using the **factory function** and **module pattern** to keep game logic separated from display logic.

---

## How to Play

1. Open `index.html` in your browser.
2. Player 1 plays as **X**, Player 2 plays as **O**.
3. Players take turns clicking a tile on the board.
4. The first player to get 3 in a row — horizontally, vertically, or diagonally — wins.
5. If all 9 tiles are filled with no winner, the game ends in a draw.
6. Click **Restart** at any time to reset the board and start a new game.

---


## Architecture

The game is split into three factory functions and a DOM controller, each with a single responsibility.

### `Cell`
Manages the state of a single square on the board. Each cell has a private `value` (defaulting to `0` for empty) and exposes two methods: `addMarker` to claim the cell and `getMarker` to read its current value.

### `Gameboard`
Creates and manages the 3x3 board as a 2D array of `Cell` objects. Exposes methods to get the board, place a marker on a specific cell, and print the board to the console.

### `GameController`
Handles all game logic — player turns, win detection, and draw detection. Accepts two player names as arguments and tracks the active player. Exposes `playRound` to process a move and `currentPlayer` to read whose turn it is.

Win detection covers all possible winning conditions:
- 3 rows
- 3 columns
- 2 diagonals

### DOM Controller
Sits at the bottom of `index.js` and connects the game logic to the browser. Handles click events on tiles, updates the board display after each move, shows win and draw messages, and manages the restart button.

---

## Key Concepts Used

- **Factory functions** — all game objects are created using factory functions instead of classes or constructors.
- **Module pattern** — each factory exposes only the methods needed by the outside world; internal state stays private via closures.
- **Separation of concerns** — game logic lives in `GameController` and `Gameboard`; display logic lives in the DOM controller.
- **Data attributes** — each tile uses `data-row` and `data-col` attributes so click handlers can identify which cell was clicked without querying the DOM structure.

---

## Possible Extensions

- Allow players to enter custom names before the game starts
- Track scores across multiple rounds
- Highlight the winning combination of tiles
- Add an AI opponent for single player mode
