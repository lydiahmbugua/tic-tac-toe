const grid = document.querySelector('.board');
const cells = document.querySelectorAll('.tile');
const displayMsg = document.querySelector('.message');
const restart = document.querySelector('.restart');
const play = document.querySelector('.info');
const form = document.querySelector('.form');
const right = document.querySelector('.right');
let player1Name = document.querySelector('.player1-name');
let player2Name = document.querySelector('.player2-name');
let gameActive = false; 
let game;
let player1;
let player2;
let round;
let player1score = 0;
let player2score = 0;
let roundNo = 0;
let playerOne = document.querySelector('.player1-score');
let playerTwo = document.querySelector('.player2-score');


function Cell() {
    let value = 0;
    const addMarker = (player) => { value = player; };
    const getMarker = () => value;
    return { addMarker, getMarker };
}

function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const placeMarker = (row, col, player) => {
        if (board[row][col].getMarker() !== 0) return false;
        board[row][col].addMarker(player);
        return true;
    };

    return { getBoard, placeMarker };
}

function GameController(p1Name, p2Name) {
    const gameboard = Gameboard();
    const players = [
        { name: p1Name, marker: 'X' },
        { name: p2Name, marker: 'O' },
    ];

    let activePlayer = players[0];

    function switchPlayer() {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const currentPlayer = () => activePlayer;
    const board = gameboard.getBoard();

    function cellValue(row, col) {
        return board[row][col].getMarker();
    }

    function checkWin() {
        for (let i = 0; i < 3; i++) {
            if (board[i].every(cell => cell.getMarker() !== 0 && cell.getMarker() === board[i][0].getMarker())) {
                return activePlayer;
            }
        }
        for (let i = 0; i < 3; i++) {
            if (board.every((row, ri) => cellValue(ri, i) !== 0 && cellValue(ri, i) === cellValue(0, i))) {
                return activePlayer;
            }
        }
        if (cellValue(1, 1) !== 0) {
            if (cellValue(0, 0) === cellValue(1, 1) && cellValue(1, 1) === cellValue(2, 2)) return activePlayer;
            if (cellValue(0, 2) === cellValue(1, 1) && cellValue(1, 1) === cellValue(2, 0)) return activePlayer;
        }
        return false;
    }

    function checkDraw() {
        return board.every(row => row.every(cell => cell.getMarker() !== 0));
    }

    function playRound(row, col) {
        const validPlay = gameboard.placeMarker(row, col, activePlayer.marker);

        if (!validPlay) {
            return 'INVALID MOVE! Please try again.';
        }

        const win = checkWin();
        const draw = checkDraw();

        if (win) {
            if (activePlayer.name === player1) {
                player1score++;
                playerOne.textContent = player1score;
            } else {
                player2score++;
                playerTwo.textContent = player2score;
            }
            roundNo++;
            return { result: activePlayer.name + ' wins!', roundOver: true };
        }

        if (draw) {
            roundNo++;
            return { result: 'Draw!', roundOver: true }; 
        }

        switchPlayer();
        return { result: null, roundOver: false };
    }

    return { playRound, currentPlayer, getBoard: () => gameboard.getBoard() };
}

function roundCheck(resultMessage) {
    displayMsg.textContent = resultMessage;
    render(); // show the final board state

    if (roundNo >= Number(round)) {
        
        gameActive = false;
        if (player1score === player2score) {
            displayMsg.textContent = "It's a draw overall!";
        } else if (player1score > player2score) {
            displayMsg.textContent = `${player1} WINS!!!`;
        } else {
            displayMsg.textContent = `${player2} WINS!!!`;
        }
    } else {
        gameActive = false; 
        setTimeout(() => {
            game = GameController(player1, player2);
            gameActive = true;
            render();
            displayMsg.textContent = `${player1}'s Turn — Round ${roundNo + 1} of ${round}`;
        }, 1200); 
    }
}

cells.forEach(cell => {
    cell.addEventListener('click', (e) => {
        if (!gameActive) return;

        const col = Number(e.target.dataset.col);
        const row = Number(e.target.dataset.row);
        const outcome = game.playRound(row, col);

        if (typeof outcome === 'string') {
            displayMsg.textContent = outcome;
            return;
        }

        const { result, roundOver } = outcome;

        if (roundOver) {
            gameActive = false; 
            roundCheck(result);
        } else {
            render();
            displayMsg.textContent = `${game.currentPlayer().name}'s turn`;
        }
    });
});

function render() {
    const board = game.getBoard();
    cells.forEach(cell => {
        const col = Number(cell.dataset.col);
        const row = Number(cell.dataset.row);
        const value = board[row][col].getMarker();
        cell.textContent = value !== 0 ? value : '';
    });
}

restart.addEventListener('click', () => {
    player1score = 0;
    player2score = 0;
    roundNo = 0;
    playerOne.textContent = player1score;
    playerTwo.textContent = player2score;
    game = GameController(player1, player2);
    gameActive = true;
    render();
    displayMsg.textContent = `${player1}'s turn`;
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    player1 = document.querySelector('#player1').value.trim();
    player2 = document.querySelector('#player2').value.trim();
    round = document.querySelector('input[name="rounds"]:checked').value;

    form.style.display = 'none';
    right.classList.remove('hidden');
    player1Name.textContent = player1;
    player2Name.textContent = player2;

    player1score = 0;
    player2score = 0;
    roundNo = 0;
    playerOne.textContent = player1score;
    playerTwo.textContent = player2score;

    game = GameController(player1, player2);
    gameActive = true;
    render();
    displayMsg.textContent = `${player1}'s Turn`;
});
