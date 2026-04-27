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
        if (board[row][col].getMarker() !== 0) {
            console.log("Cell already taken!");
            return false;
        }
        board[row][col].addMarker(player);
        return true;
    };

    const printBoard = () => {
        board.forEach(row => {
            console.log(row.map(cell => cell.getMarker()).join(" | "));
        });
    };

    return { getBoard, placeMarker, printBoard };
}

function GameController(player1,player2){
    const game=Gameboard();
    const players=[
        {name:player1,marker:'X'},
        {name:player2,marker:'O'},
    ];

    let activePlayer=players[0];
    function switchPlayer(){
        if(activePlayer.name==players[0].name){
            activePlayer=players[1];
        }else{
            activePlayer=players[0];
        }

    }
    const currentPlayer=()=>activePlayer;
    const board=game.getBoard();
    function cellValue(row,column){
            return board[row][column].getMarker();
        }

    function checkWin(){
        
       for(let i=0;i<board.length;i++){
        const checkRow=board[i].every(cell=>cell.getMarker()!=0&&cell.getMarker()==board[i][0].getMarker());
        if(checkRow===true){
        return activePlayer;
       }
       }

       for(let i=0;i<board.length;i++){
        const checkCol=board.every((row,rowIndex)=>cellValue(rowIndex,i)!=0&&cellValue(0,i)==cellValue(rowIndex,i));
        if(checkCol===true){
        return activePlayer;
       }
       }

       if (cellValue(0,0)===cellValue(1,1)&&cellValue(1,1)===cellValue(2,2)&&cellValue(1,1)!=0){
        return activePlayer;
       }else if (cellValue(0,2)===cellValue(1,1)&&cellValue(1,1)===cellValue(2,0)&&cellValue(1,1)!=0){return activePlayer;}else{return false;}
    }
    function checkDraw(){
        
        for(let i=0;i<board.length;i++){
              const checkRow=board[i].every(cell=>cell.getMarker()!=0);
              if(checkRow===false){return false}

        }return true;

    }
    
    function playRound(row,col){
        
      const validPlay=game.placeMarker(row,col,activePlayer.marker);
       if(validPlay===true){
        const win=checkWin();
        const draw=checkDraw();
        if(win!=false){ return activePlayer.name+' wins!';} else if(draw==true){return 'Game Draw!'}else{switchPlayer(); }
        
       }else{
        return 'INVALID MOVE!';
       }
       
        
    }
    return{playRound,currentPlayer,getBoard: () => game.getBoard()};
}


const grid=document.querySelector('.board');
const cells=document.querySelectorAll('.tile');
const displayMsg=document.querySelector('.message');
const restart=document.querySelector('.restart');
let gameController=GameController('Player 1','Player 2');
let gameActive=true;
cells.forEach(cell=>{
    cell.addEventListener('click',(e)=>{
        if(gameActive==false){return}
        const col=Number(e.target.dataset.col);
        const row=Number(e.target.dataset.row);
        const value=gameController.playRound(row,col);
        render();
        const player=gameController.currentPlayer;
        if(value==undefined){
            displayMsg.textContent=player().name+"'s turn";
            
        }else{
            displayMsg.textContent=value;
            gameActive=false;
        }
    })
})

function render(){
    const board=gameController.getBoard();
    cells.forEach(cell=>{
        const col=Number(cell.dataset.col);
        const row=Number(cell.dataset.row);
        const value=board[row][col].getMarker()
        if(value==0){
            cell.textContent='';
        }else{
            cell.textContent=value;
        }
    })
}

restart.addEventListener('click',()=>{
    gameActive=true;
    const board=gameController.getBoard();
        gameController=GameController('Player 1','Player 2');
        displayMsg.textContent="Player 1's turn";
        render();
    
})
