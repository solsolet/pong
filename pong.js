//Declaració de constants
const FRAME_PER_SECOND = 50;
const COMPUTER_LEVEL = 0.1;

const NUM_BALLS = 5;

const BG_COLOR = 'BLACK'; //background

const FONT_COLOR = 'WHITE';
const FONT_FAMILY = 'impact';
const FONT_SIZE = '45px';

const PADDLE_RIGHT_COLOR = 'RED';
const PADDLE_LEFT_COLOR = 'WHITE';
const PADDLE_WIDTH = '20';
const PADDLE_HEIGHT = '100';

const BALL_COLOR = 'WHITE';
const BALL_RADIUS = '10';
const BALL_DELTA_VELOCITY = 0.5;
const BALL_VELOCITY = 5;

const NET_COLOR = 'WHITE';
const NET_WIDTH = 4;
const NET_HEIGHT = 10;
const NET_PADDING = 15;

//Recuperem el canvas
const cvs = document.getElementById('pong_canvas');
const ctx = cvs.getContext('2d');

//Obj del juego
//declarem la red
const net = {
    x: cvs.width/2 - NET_WIDTH/2,
    y: 0,
    width: NET_WIDTH,
    height: NET_HEIGHT,
    padding: NET_PADDING,
    color: NET_COLOR
}
//bola
const ball = {
    x: cvs.width/2,
    y: cvs.height/2 /*- BALL_RADIUS*/,
    radius: BALL_RADIUS,
    speed: BALL_VELOCITY,
    velocityX: BALL_VELOCITY,
    velocityY: BALL_VELOCITY,
    color: BALL_COLOR
}
//jugador
const playerA = {
    x: 0,
    y: cvs.height/2 - PADDLE_HEIGHT/2, //pala centrada enmig
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    color: PADDLE_LEFT_COLOR,
    score: 0
}
const playerB = {
    x: cvs.width - PADDLE_WIDTH,
    y: cvs.height/2 - PADDLE_HEIGHT/2, //pala centrada enmig
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    color: PADDLE_RIGHT_COLOR,
    score: 0
}
//definim jugadors
let localPlayer = playerA;
let computer = playerB;

/* //rectangle fons
ctx.fillStyle = 'BLACK';
ctx.fillRect(10, 20, 150, 200);

//cercle
ctx.fillStyle = 'WHITE';
ctx.beginPath();
ctx.arc(60,70,10,0,2*Math.PI);
ctx.closePath();
ctx.fill();

//text
ctx.fillStyle = 'BLUE';
ctx.font = '45px impact';
ctx.fillText("Saludos", 200, 200); */

//HELPER CANVAS
function drawRect(x,y,w,h, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x,y,r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0,2*Math.PI);
    ctx.closePath();
    ctx.fill();
}

function drawText(text, x, y, color=FONT_COLOR, fontSize=FONT_SIZE, fontFamily=FONT_FAMILY){
    ctx.fillStyle = color;
    ctx.font = `${fontSize} ${fontFamily}`;
    ctx.fillText(text, x, y);
}






//HELPERS PONG
function clearCanvas(){
    drawRect(0,0,cvs.width,cvs.height,'BLACK');
}
function drawNet(){
    for(let i=0; i<=cvs.height; i+=net.padding){
        drawRect(net.x, net.y+i, net.width, net.height, net.color);
    }
}

function drawScore() {
    drawText(localPlayer.score, cvs.width/4, cvs.height/5, 'WHITE');
    drawText(computer.score, 3*cvs.width/4, cvs.height/5, 'WHITE');
}

function drawPaddle(paddle){
    drawRect(paddle.x, paddle.y, paddle.width, paddle.height, paddle.color);
} 

function drawBall(){
    drawCircle(ball.x,ball.y,ball.radius, ball.color);
}

function updateComputer(){
    computer.y += ball.y - (computer.y+computer.height/2) * COMPUTER_LEVEL;
}

function collision(b, p){ //bola i pala
    b.top = b.y - b.radius;
    b.bottom = b.y +b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom;
}

function update(){
    //actualizamos la posición de la bola
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    //IA: actualizamos la posición del ocmputador
    updateComputer();

    // si la bola golpea los laterales rebota
    if(ball.y+ball.radius > cvs.height || ball.y-ball.radius < 0){
        ball.velocityY = -ball.velocityY;
    }

    let whatPlayer = (ball.x < cvs.width/2) ? playerA : playerB;

    if(collision(ball, whatPlayer)){
        let collidePoint = ball.y - whatPlayer.y + whatPlayer.height/2;
        collidePoint = collidePoint/whatPlayer.height/2;
        //calcule l'angle en rad
        const anglePad = collidePoint * Math.PI/4;
        const direction = (ball.x < cvs.width/2) ? 1 : -1; //MEdiacapabilities o algo en lloc de cvs

        ball.velocityX = direction * ball.speed * Math.cos(anglePad);
        ball.velocityY = ball.speed * Math.sin(anglePad);

        //cada vez le damos a la pala incrementamos la velocidad de la bola
        ball.speed += BALL_DELTA_VELOCITY;
    }
}

function render() { //codi refactoritzat
    clearCanvas();
    drawNet();

    drawScore();

    drawPaddle(localPlayer);
    drawPaddle(computer);

    drawBall();
    //drawText('Saludos',200,100); //no li passem color i ixiran per defecte
}

function drawBoard(){
    clearCanvas();
    drawNet();

    drawScore();

    drawPaddle(localPlayer);
    drawPaddle(computer);
}

var gameLoopId;

function gameLoop(){
    update();
    render();
}

function initGameLoop(){
    gameLoopId = setInterval(gameLoop, 1000/FRAME_PER_SECOND);
}

function play() {
    drawBoard();
    initGameLoop();
}

play();