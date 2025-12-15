const board = document.getElementById('board');
const context = board.getContext('2d');

const rows = 16;
const col = 16;

const tileSize = 32;

const boardWidth = rows * tileSize;
const boardHeight = rows * tileSize;

let lastTime = 0;


let apple = {
    x: Math.floor(Math.random() * col) * tileSize,
    y: Math.floor(Math.random() * rows) * tileSize,
    eaten : false
}

let snake = {
    x : 0, //the x of the head
    y : 0, //the y of the head
    body: {
        x: [],
        y: []
    },
    direction: 'down'
}

window.onload = function(){
    board.width = boardWidth;
    board.height = boardHeight;

    drawGrid(1, tileSize, tileSize);
    context.fillStyle = '#FF0000';
    context.fillRect(snake.x, snake.y, tileSize, tileSize);
    apple.eaten = true;
    document.addEventListener('keydown', moveSnake);
    
    setInterval(update, 500); //chiama l'update ogni 500 ms = 0.5 secondi
}

function update(currentTime){
    let currentHeadX = snake.x;
    let currentHeadY = snake.y;
    switch(snake.direction){
        case 'up':
            snake.y -= tileSize;
            break;
        case 'down':
            snake.y += tileSize;
            break;
        case 'right':
            snake.x += tileSize;
            break;
        case 'left':
            snake.x -= tileSize;
            break;
    }
    context.clearRect(0, 0, boardWidth, boardHeight);
    
    context.fillStyle = '#FF0000';
    for (let i = 0; i < snake.body.x.length; i++) {
        if(snake.body.x.length > 0){
            context.fillRect(snake.body.x[snake.body.x.lenght - i - 1], snake.body.y[snake.body.x.lenght - i - 1], tileSize, tileSize);
        } else {
            context.fillRect(snake.x, snake.y, tileSize, tileSize);
        }
        /*snake.body.x[i] = currentHeadX;
        snake.body.y[i] = currentHeadY;*/
        //context.fillRect(snake.body.x[i], snake.body.y[i], tileSize, tileSize);
    }
    context.fillRect(snake.x, snake.y, tileSize, tileSize);
    if(checkAppleEaten(snake, apple)){
        addBody();
        apple.eaten = true;
    }
    if(apple.eaten){
        //addBody(); 
        apple.x = Math.floor(Math.random() * col) * tileSize;
        apple.y = Math.floor(Math.random() * rows) * tileSize;
        apple.eaten = false;
        drawApple();
    } else if(!apple.eaten){
        drawApple();
    }
    drawGrid(1, tileSize, tileSize);
    const deltaTime = (currentTime - lastTime)/1000;
    lastTime = currentTime;
}

function drawApple(){
    context.fillStyle = '#00FF00';
    context.fillRect(apple.x, apple.y, tileSize, tileSize);
}

function checkAppleEaten(a, b){
    return  a.x < b.x + tileSize &&
            a.x + tileSize > b.x &&
            a.y < b.y + tileSize &&
            a.y + tileSize > b.y;
}

function moveSnake(e){
    switch(e.code){
        case 'ArrowUp':
            snake.direction = 'up';
            break;
        case 'ArrowDown':
            snake.direction = 'down';
            break;
        case 'ArrowLeft':
            snake.direction = 'left';
            break;
        case 'ArrowRight':
            snake.direction = 'right';
            break;
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