# Minesweeper Console Game

Welcome to the Minesweeper Console Game! This classic Minesweeper game is implemented in JavaScript and runs in a console environment.

## Overview

Minesweeper is a single-player puzzle game where the objective is to clear a rectangular grid containing hidden "mines" or bombs. The player must reveal all cells without bombs and flag the cells containing bombs. The game is won when all safe cells are revealed, and lost if a cell with a bomb is uncovered.

## How to Play

1. **Provide Grid Dimensions:**
   - Upon starting the game, you will be prompted to enter the number of rows and columns for the game grid.
   - Example: `Please provide the number of rows:` (Enter the desired number and press Enter)

2. **Input Format:**
   - You will provide input in the format `i.j.f` where:
     - `i` is the row index.
     - `j` is the column index.
     - `f` is an optional flag to mark/unmark a cell.
   - Example: `5.5` (Reveal cell in the 5th row, 5th column), `1.8.f` (Flag cell in the 1st row, 8th column)

3. **Winning the Game:**
   - The game is won when all non-bomb cells are revealed and flagged correctly.

4. **Losing the Game:**
   - The game is lost if a cell with a bomb is revealed. In this case, all cells will be revealed.

5. **Restart or Exit:**
   - During the game, you can type `r` to restart the game or `e` to exit the application.

## How to Run

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/ben-benston/node-minesweeper.git
   ```

2. **Navigate to the Project Directory:**
   ```bash
   cd minesweeper-console
   ```

3. **Install Dependencies:**
   - Make sure you have Node.js installed.
   ```bash
   npm install
   ```

4. **Run the Game:**
   ```bash
   node index.mjs
   ```

## Author

This Minesweeper Console Game was created by Ben Benston.

## License

This project is licensed under the [MIT License](LICENSE).
