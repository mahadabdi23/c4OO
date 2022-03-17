class Game {
    constructor(HEIGHT = 6, WIDTH = 7, playerOne, playerTwo) {
        this.HEIGHT = HEIGHT;
        this.WIDTH = WIDTH;
        this.board = [];
        this.top = document.createElement('tr');
        this.makeBoard();
        this.makeHTMLBoard();
        this.gameWon = false;

        this.players = [playerOne, playerTwo];
        this.currPlayer = playerOne;
    };
    makeBoard() {
        for (let y = 0; y < this.HEIGHT; y++) { this.board.push(Array.from({ length: this.WIDTH })) }
    };
    makeHTMLBoard() {

        const board = document.getElementById('board');
        board.innerHTML = '<table id="board"></table>'
        // make column tops (clickable area for adding a piece to that column)
        this.top.setAttribute('id', 'column-top');
        this.top.addEventListener('click', this.handleGameClick);

        for (let x = 0; x < this.WIDTH; x++) {
            const headCell = document.createElement('td');
            headCell.setAttribute('id', x);
            this.top.append(headCell);
        }

        board.append(this.top);

        // make main part of this.board
        for (let y = 0; y < this.HEIGHT; y++) {
            const row = document.createElement('tr');

            for (let x = 0; x < this.WIDTH; x++) {
                const cell = document.createElement('td');
                cell.setAttribute('id', `${y}-${x}`);
                row.append(cell);
            }

            board.append(row);
        }
    };
    findSpotForCol(x) {
        for (let y = this.HEIGHT - 1; y >= 0; y--) {
            if (!this.board[y][x]) {
                return y;
            }
        }
        return null;
    };
    placeInTable(y, x) {


        const piece = document.createElement('div');
        piece.classList.add('piece');
        piece.style.backgroundColor = this.currPlayer.playerColor;
        piece.style.top = -50 * (y + 2);

        const spot = document.getElementById(`${y}-${x}`);
        spot.append(piece);
    };
    endGame(msg) {
        alert(msg);
    };

    handleClick(evt) {

        // get x from ID of clicked cell
        if (!this.gameWon) {
            const x = +evt.target.id;

            // get next spot in column (if none, ignore click)
            const y = this.findSpotForCol(x);
            if (y === null) {
                return;
            }
            // place piece in this.board and add to HTML table
            this.board[y][x] = this.currPlayer;

            this.placeInTable(y, x);

            // check for win
            if (this.checkForGameWin()) {
                this.gameWon = true;
                return this.endGame(`Player ${this.currPlayer} won!`);
            }

            // check for tie
            if (this.board.every(row => row.every((cell) => { cell }))) {
                return endGame('Tie!');
            }

            // switch players
            this.currPlayer = this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
        }
        else {
            return this.endGame(`Player ${this.currPlayer} won!`);
        }
    };
    handleGameClick = this.handleClick.bind(this);
    checkForWin() {

        function _win(cells) {

            // Check four cells to see if they're all color of current player
            //  - cells: list of four (y, x) cells
            //  - returns true if all are legal coordinates & all match currPlayer
            return cells.every(
                ([y, x]) =>
                    y >= 0 &&
                    y < this.HEIGHT &&
                    x >= 0 &&
                    x < this.WIDTH &&
                    this.board[y][x] === this.currPlayer
            );
        }
        const _winGame = _win.bind(this)

        for (let y = 0; y < this.HEIGHT; y++) {
            for (let x = 0; x < this.WIDTH; x++) {
                // get "check list" of 4 cells (starting here) for each of the different
                // ways to win
                const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
                const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
                const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
                const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

                // find winner (only checking each win-possibility as needed)
                if (_winGame(horiz) || _winGame(vert) || _winGame(diagDR) || _winGame(diagDL)) {
                    return true;
                }
            }
        }
    }
    checkForGameWin = this.checkForWin.bind(this);
}

class player {
    constructor(playerColor) {
        this.playerColor = playerColor
    }
}

const startNewGameButton = document.getElementById('start-new-game-button').addEventListener('click', (evt) => {
    const playerOneColor = document.getElementById('player-one-color').value;
    const playerOne = new player(playerOneColor);
    const playerTwoColor = document.getElementById('player-two-color').value;
    const playerTwo = new player(playerTwoColor);
    new Game(6, 7, playerOne, playerTwo);
})