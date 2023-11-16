// Import necessary modules
import prompt from 'prompt-sync';
import chalk from 'chalk';

// Set up user prompt function
const userPrompt = prompt();

// Define chalk styles for different cell states
const bomb = chalk.bgRed.white;
const bombStrikethrough = chalk.bgRed.white.strikethrough.bold;
const noBomb = chalk.bgWhite.black;
const close = chalk.bgYellowBright.red;

// Initialize grid dimensions and bomb count
let col = 10;
let row = 20;
let grid;
let totalBombCount;
let errArr;

// Define the Cell class to represent each cell in the grid
class Cell {
    constructor() {
        this.bomb = false;
        this.revealed = false;
        this.num = 0;
        this.flagged = false;
    }
}

// Function to set up the game
function setup() {
    // Predefining some variables
    errArr = []
    col = 10;
    row = 20;

    // Prompt user for grid dimensions
    console.clear();
    console.log(chalk.magentaBright("Welcome to Minesweeper. The goal is simple and that is to flag all the bombs and open all the empty cells. Since this is a console-based game you just have to provide indexes and according to that, it will flag or open that cell. `i` is the index of rows shown on the left and `j` is the index of columns shown on top. Eg. `5.5`, `1.8` If you want to flag a particular cell then also add `f` as an argument to the input eg. `5.2.f`, `8.6.f`. Every other input except these will be rendered moot. You will be asked some questions and you can skip them by just hitting the Enter key. Enjoy the game ☺\n\n"));
    const ro = userPrompt('Please provide the number of rows: ');
    if (!isNaN(parseInt(ro))) {
        row = parseInt(ro);
    }
    const co = userPrompt('Please provide the number of columns: ');
    if (!isNaN(parseInt(co))) {
        col = parseInt(co);
    }

    // Validate grid dimensions
    if (row < 1 || col < 1) {
        setup();
    }

    // Initialize the grid and randomly place bombs
    grid = new Array(row);
    for (let i = 0; i < row; i++) {
        grid[i] = new Array(col);
    }
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            grid[i][j] = new Cell();
        }
    }
    let bombLoc = [];
    totalBombCount = Math.ceil((row * col) * 0.15);
    while (bombLoc.length < totalBombCount) {
        let i = Math.floor(Math.random() * row);
        let j = Math.floor(Math.random() * col);
        if (!bombLoc.includes(`${i}${j}`)) {
            bombLoc.push(`${i}${j}`);
            grid[i][j].bomb = true;
        }
    }

    // Count the number of neighboring bombs for each cell
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            grid[i][j].num = countNeighbours(i, j);
        }
    }
}

// Initialize the game
setup();

// Function to count the number of neighboring bombs for a given cell
function countNeighbours(i, j) {
    if (grid[i][j].bomb) {
        return -1;
    }
    let total = 0;
    for (let m = -1; m <= 1; m++) {
        for (let n = -1; n <= 1; n++) {
            const iIndex = m + i;
            const jIndex = n + j;
            if (iIndex > -1 && iIndex < row && jIndex > -1 && jIndex < col) {
                if (grid[iIndex][jIndex].bomb) {
                    total++;
                }
            }
        }
    }
    return total;
}

// Function to display the game grid
function showGrid() {
    let sg = "\n   ";
    // Display column indices
    for (let i = 0; i < col; i++) {
        if (i > 8) {
            sg += `${i + 1}`;
        } else {
            sg += `${i + 1} `;
        }
    }
    sg += '\n';
    // Display grid content
    for (let i = 0; i < row; i++) {
        if (i < 9) {
            sg += `${i + 1}  `;
        } else {
            sg += `${i + 1} `;
        }
        for (let j = 0; j < col; j++) {
            // Display cell content based on its state
            if (grid[i][j].revealed) {
                if (grid[i][j].bomb) {
                    if (i == errArr[0] && j == errArr[1]) {
                        sg += bombStrikethrough("X ");
                    } else if (grid[i][j].flagged) {
                        sg += close("F ");
                    } else {
                        sg += bomb("X ");
                    }
                } else {
                    sg += noBomb(`${grid[i][j].num} `);
                }
            } else if (grid[i][j].flagged) {
                sg += close("F ");
            } else {
                sg += close("  ");
            }
        }
        // Display row indices
        if (i < 9) {
            sg += `  ${i + 1}\n`;
        } else {
            sg += ` ${i + 1}\n`;
        }
    }
    // Display column indices again
    sg += "   ";
    for (let i = 0; i < col; i++) {
        if (i > 8) {
            sg += `${i + 1}`;
        } else {
            sg += `${i + 1} `;
        }
    }
    sg += '\n';
    return sg;
}

// Function to reveal a cell and potentially trigger flood fill
function reveal(i, j) {
    const cell = grid[i][j];
    cell.revealed = true;
    if (cell.num === 0) {
        floodFill(i, j);
    }
    // Check for win condition
    let rev = 0;
    for (let m = 0; m < row; m++) {
        for (let n = 0; n < col; n++) {
            if (grid[m][n].revealed) {
                rev++;
            }
        }
    }
    let bombsFlagged = col * row - rev;
    if (totalBombCount === bombsFlagged) {
        // Display win message and prompt for next action
        console.clear();
        console.log(showGrid());
        console.log("\n\nCongratulations you won!!");
        const choice = userPrompt("Please select an option. Type `e` for exit and `r` for restarting the game : ");
        if (choice.toLowerCase() === 'e') {
            process.exit(0);
        } else {
            setup();
        }
    }
}

// Function to perform flood fill for revealing connected empty cells
function floodFill(i, j) {
    for (let m = -1; m <= 1; m++) {
        for (let n = -1; n <= 1; n++) {
            const iIndex = m + i;
            const jIndex = n + j;
            if (iIndex > -1 && iIndex < row && jIndex > -1 && jIndex < col) {
                if (!grid[iIndex][jIndex].bomb && !grid[iIndex][jIndex].revealed) {
                    reveal(iIndex, jIndex);
                }
            }
        }
    }
}

// Main game loop
while (true) {
    console.clear();
    console.log(showGrid());
    const name = userPrompt('Provide an index (i, j, f) : ');
    if (name.toLowerCase() === 'e') {
        console.clear();
        break;
    } else if (name.toUpperCase() === 'R') {
        setup();
    } else {
        const [i, j, f] = name.split(".");
        if (
            (i === undefined || i.length === 1 || i.length === 2) &&
            (j === undefined || j.length === 1 || j.length === 2) &&
            (f === undefined || f.length === 1)
        ) {
            try {
                const cell = grid[parseInt(i) - 1][parseInt(j) - 1];
                if (cell.revealed) {
                    continue;
                } else if (f === 'f') {
                    if (cell.flagged) {
                        cell.flagged = false;
                    } else {
                        cell.flagged = true;
                    }
                } else if (!cell.flagged) {
                    // Reveal cell and handle bomb scenario
                    reveal(parseInt(i) - 1, parseInt(j) - 1);
                    if (cell.bomb) {
                        // Reveal all cells after hitting a bomb
                        for (let s = 0; s < row; s++) {
                            for (let t = 0; t < col; t++) {
                                grid[s][t].revealed = true;
                            }
                        }
                        errArr.push(parseInt(i) - 1, parseInt(j) - 1);
                        console.clear();
                        console.log(showGrid());
                    }
                }
            } catch (error) { }
        }
    }
}
