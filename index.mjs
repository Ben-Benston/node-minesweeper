import prompt from 'prompt-sync';
const userPrompt = prompt();
import chalk from 'chalk';

const bomb = chalk.bgRed.white
const bombS = chalk.bgRed.white.strikethrough.bold
const noBomb = chalk.bgWhite.black
const close = chalk.bgYellowBright.red

let col = 10
let row = 20
let grid;
let totalBombCount;

class Cell {
    constructor() {
        this.bomb = false
        this.revealed = false;
        this.num = 0
        this.flagged = false;
    }
}

function setup() {
    col = 10
    row = 20
    console.clear();
    console.log(chalk.magentaBright("Welcome to Minesweeper. The goal is simple and that is to flag all the bombs and open all the empty cells. Since this is a console-based game you just have to provide indexes and according to that, it will flag or open that cell. `i` is the index of rows shown on the left and `j` is the index of columns shown on top. Eg. `5,5`, `1,8` If you want to flag a particular cell then also add `f` as an argument to the input eg. `5,2,f`, `8,6,f`. Every other input except these will be rendered moot. You will be asked some questions and you can skip them by just hitting the Enter key. Enjoy the game ☺\n\n"));

    const ro = userPrompt('Please provide the number of rows: ');
    if (!isNaN(parseInt(ro))) {
        row = parseInt(ro);
    }

    const co = userPrompt('Please provide the number of columns: ');
    if (!isNaN(parseInt(co))) {
        col = parseInt(co);
    }

    if (row < 1 || col < 1) {
        setup()
    }

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

    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            grid[i][j].num = countNeighbours(i, j);
        }
    }
}

setup()

function countNeighbours(i, j) {
    if (grid[i][j].bomb) {
        return -1
    }
    let total = 0;
    for (let m = -1; m <= 1; m++) {
        for (let n = -1; n <= 1; n++) {
            const iIndex = m + i
            const jIndex = n + j
            if (iIndex > -1 && iIndex < row && jIndex > -1 && jIndex < col) {
                if (grid[iIndex][jIndex].bomb)
                    total++
            }
        }
    }
    return total
}

let errArr = []
function showGrid() {
    let sg = "\n   "
    for (let i = 0; i < col; i++) {
        if (i > 8) {
            sg += `${i + 1}`
        }
        else {
            sg += `${i + 1} `
        }
    }
    sg += '\n'
    for (let i = 0; i < row; i++) {
        if (i < 9) {
            sg += `${i + 1}  `
        }
        else {
            sg += `${i + 1} `
        }
        for (let j = 0; j < col; j++) {
            if (grid[i][j].revealed) {
                if (grid[i][j].bomb) {
                    if (i === errArr[0] && j == errArr[1])
                        sg += bombS("X ")
                    else if (grid[i][j].flagged)
                        sg += close("F ")
                    else
                        sg += bomb("X ")
                }
                else
                    sg += noBomb(`${grid[i][j].num} `)
            }
            else if (grid[i][j].flagged) {
                sg += close("F ")
            }
            else {
                sg += close("  ")
            }
        }
        if (i < 9) {
            sg += `  ${i + 1}\n`
        }
        else {
            sg += ` ${i + 1}\n`
        }
    }
    sg += "   "
    for (let i = 0; i < col; i++) {
        if (i > 8) {
            sg += `${i + 1}`
        }
        else {
            sg += `${i + 1} `
        }
    }
    sg += '\n'
    return sg;
}

function reveal(i, j) {
    const cell = grid[i][j]
    cell.revealed = true;
    if (cell.num == 0) {
        floodFill(i, j)
    }
    let rev = 0;
    for (let m = 0; m < row; m++) {
        for (let n = 0; n < col; n++) {
            if (grid[m][n].revealed) {
                rev++
            }
        }
    }
    let bombsFlagged = col * row - rev
    if (totalBombCount === bombsFlagged) {
        console.clear()
        console.log(showGrid())
        console.log("\n\nCongratulations you won!!")
        const choice = userPrompt("Please select an option. Type `e` for exit and `r` for restarting the game : ")
        if (choice.toLowerCase() === 'e') {
            process.exit(0)
        }
        else {
            setup()
        }
    }
}

function floodFill(i, j) {
    for (let m = -1; m <= 1; m++) {
        for (let n = -1; n <= 1; n++) {
            const iIndex = m + i
            const jIndex = n + j
            if (iIndex > -1 && iIndex < row && jIndex > -1 && jIndex < col) {
                if (!grid[iIndex][jIndex].bomb && !grid[iIndex][jIndex].revealed) {
                    reveal(iIndex, jIndex)
                }
            }
        }
    }
}

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
            (i == undefined || i.length === 1 || i.length === 2) &&
            (j == undefined || j.length === 1 || j.length === 2) &&
            (f == undefined || f.length === 1)
        ) {
            try {
                const cell = grid[parseInt(i) - 1][parseInt(j) - 1];
                if (cell.revealed) continue;
                else if (f === 'f') {
                    if (cell.flagged) cell.flagged = false;
                    else cell.flagged = true;
                } else if (!cell.flagged) {
                    reveal(parseInt(i) - 1, parseInt(j) - 1);
                    if (cell.bomb) {
                        // Reveal all cells after hitting a bomb
                        for (let s = 0; s < row; s++) {
                            for (let t = 0; t < col; t++) {
                                grid[s][t].revealed = true;
                            }
                        }
                        errArr.push(parseInt(i) - 1, parseInt(j) - 1)
                        console.clear();
                        console.log(showGrid());
                    }
                }
            } catch (error) { }
        }
    }
}


