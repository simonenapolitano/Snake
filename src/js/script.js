const board = document.getElementById('board');
const context = board.getContext('2d');

const rows = 16;
const col = 16;

const tileSize = 32;

const boardWidth = rows * tileSize;
const boardHeight = rows * tileSize;

const startPosX = tileSize * col / 2;
const startPosY = tileSize * rows / 2;

let lastTime = performance.now();

let gameover = false;
let win = false;

let apple = {
    x: Math.floor(Math.random() * col) * tileSize,
    y: Math.floor(Math.random() * rows) * tileSize,
    eaten : false
}

let snake = {
    x : startPosX, //the x of the head
    y : startPosY, //the y of the head
    body: {
        x: [],
        y: []
    },
    direction: 'down',
    newDirection: 'down'
}

window.onload = function(){
    board.width = boardWidth;
    board.height = boardHeight;

    drawGrid(1, tileSize, tileSize);

    context.fillStyle = '#00FF00';
    context.fillRect(snake.x, snake.y, tileSize, tileSize);
    apple.eaten = true;
    document.addEventListener('keydown', moveSnake);
    
    setInterval(update, 200); //chiama l'update ogni 500 ms = 0.5 secondi
}

function update(){
    //controlla se esce fuori dal campo oppure se colpisce se stesso
    gameover = checkSelfCollision();
    //controlla se il serpente ha riempito tutto lo schermo
    if(snake.body.x.length + 1 == col*rows){
        win = true;
        
    }
    if(win){
        context.fillStyle = '#00FF00';
        context.font = '60px sans-serif';
        context.fillText('you win!', tileSize, 45); 
        return;
    }
        
    if((snake.x < 0 || snake.x >= boardWidth || snake.y < 0 || snake.y >= boardHeight)){
        gameover = true;
    }

    if(gameover){
        context.fillStyle = 'red';
        context.font = '60px sans-serif';
        context.fillText('game over', tileSize, 45); 
        return;
    }
    let currentHeadX = snake.x;
    let currentHeadY = snake.y;
    
    snake.direction = snake.newDirection;

    snake.y += snake.direction == 'up'? -tileSize : snake.direction == 'down'? tileSize : 0;
    snake.x += snake.direction == 'right'? tileSize : snake.direction == 'left'? -tileSize : 0;

    context.clearRect(0, 0, boardWidth, boardHeight);

    if(checkAppleEaten(snake, apple)){
        addBody();
        apple.eaten = true;
    }
    
    context.fillStyle = '#00FF00';
    for (let i = snake.body.x.length - 1; i > 0; i--) {
        snake.body.x[i] = snake.body.x[i - 1]; //copia le posizioni per far muovere il corpo
        snake.body.y[i] = snake.body.y[i - 1]; 
    }

    if (snake.body.x.length > 0) {
        snake.body.x[0] = currentHeadX;
        snake.body.y[0] = currentHeadY;
    }
    
    
    for(let i = 0; i < snake.body.x.length; i++){
        context.fillRect(snake.body.x[i], snake.body.y[i], tileSize, tileSize);
    }
    context.fillStyle = '#00d300ff';
    context.fillRect(snake.x, snake.y, tileSize, tileSize);
    
    if(apple.eaten){
        apple.x = Math.floor(Math.random() * col) * tileSize;
        apple.y = Math.floor(Math.random() * rows) * tileSize;
        //mentre la mela viene generata sopra il serpente, rigenera la posizione
        for (let i = 0; i < body.x.length; i++) {
            while((apple.x == snake.x || apple.x == snake.body.x[i]) && (apple.y == snake.y || apple.y == snake.body.y[i])){ 
                apple.x = Math.floor(Math.random() * col) * tileSize;
                apple.y = Math.floor(Math.random() * rows) * tileSize;
            }
        }
        
        apple.eaten = false;
        drawApple();
    } else if(!apple.eaten){
        drawApple();
    }
    drawGrid(1, tileSize, tileSize);
    
}

function drawApple(){
    context.fillStyle = '#FF0000';
    context.fillRect(apple.x, apple.y, tileSize, tileSize);
}

function checkAppleEaten(a, b){
    return  a.x < b.x + tileSize &&
            a.x + tileSize > b.x &&
            a.y < b.y + tileSize &&
            a.y + tileSize > b.y;
}

function checkSelfCollision(){
    for(let i = 0; i < snake.body.x.length; i++){
        if(snake.x == snake.body.x[i] && snake.y == snake.body.y[i]){
            return true;
        }
    }
    return false;
}

function moveSnake(e){
    const newDir = e.code == 'ArrowUp' ? 'up' : e.code == 'ArrowDown' ? 'down' : e.code == 'ArrowLeft' ? 'left' : e.code == 'ArrowRight' ? 'right' : snake.direction;
    if(snake.body.x.length > 0){
        //controlla se la nuova direzione è opposta a quella attuale(quindi andrebbe contro a una sua parte del corpo)
        if((newDir == 'up' && snake.direction == 'down') || (newDir == 'down' && snake.direction == 'up') || (newDir == 'left' && snake.direction == 'right') || (newDir == 'right' && snake.direction == 'left')){
            return;
        }
    }

    snake.newDirection = newDir;

    if(gameover && (e.code == 'ArrowUp' || e.code == 'ArrowDown' || e.code == 'ArrowLeft' || e.code == 'ArrowRight')){
        resetGame();
    }
}

function addBody(){
    if(snake.body.x.length == 0){
        snake.body.x.push(snake.x);
        snake.body.y.push(snake.y);
    } else if(snake.body.x.length > 0){
        snake.body.x.push(snake.body.x[snake.body.x.length - 1]);
        snake.body.y.push(snake.body.y[snake.body.y.length - 1]);
    }
}

function resetGame(){
    snake.x = startPosX;
    snake.y = startPosY;
    snake.direction = 'down';
    snake.body.x = [];
    snake.body.y = [];
    gameover = false;
}

function drawGrid(lineWidth, tileWidth, tileHeight){
    context.strokeStyle = '#000';
    context.lineWidth = lineWidth;

    let width = boardWidth;
    let height = boardHeight;

    for(let i = 0; i < width; i+= tileWidth){
        context.beginPath();
        context.moveTo(i, 0);
        context.lineTo(i, height);
        context.stroke();
    }
    for(let j = 0; j < height; j+= tileHeight){
        context.beginPath();
        context.moveTo(0, j);
        context.lineTo(width, j);
        context.stroke();
    }
}