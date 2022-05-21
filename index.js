'use strict';

const port = process.env.PORT || 5000;

// creem sw per al FrontEnd (contingut estàtic)
const express = require('express');
const app = express();

app.use(express.static(__dirname + '/public/'));

const server = app.listen(port, () => {
    console.log(`Juego PONG en http://localhost:${port}`);
});

// definim l'estat del joc
let connections = [];

let currenState = {
    // state: 'WAITING'
    players: [{}, {}],
    ball: {}
}

// creem un servidor de jocs tipus WebSocket
const socket = require('socket.io');
const io = socket(server);

io.socket.on('connect', onConnect);

// definim i tractem els events entrants
function onConnect(socket) {
    connections.push(socket.id);
    console.log('onConnect');
    console.log(`oC: El número de conexiones es: ${connections.length}`);
    console.log('oC: Las conexiones activas son: ', connections);
    console.log(`oC: La conexión actual es: ${socket.id}`);

    if(connections.length > 2){
        console.error('oC: DEMASIADOS JUGADORES CONECTADOS');
        return;
    }

    sendCounter();

    socket.on('start', onStart);
    socket.on('updatePlayer', onUpdatePlayer);
    socket.on('updateBall', onUpdateBall);
    socket.on('disconnect', onDisconnect);

    setInterval(heartBeat, 33);
}

function onStart(state){
    console.log('onStart');
    console.log(`oS: Se ha recibido la siguiente onformación: ${JSON.stringify(state)}`);
    console.log(`oS: El número de conexiones es: ${connections.length}`);

    const index = connections[0]===state.id ? 0 : 1;
    console.log('oS: Iniciando jugador: ', state.id, ' id: ', index);
    const csp = currenState.players[index];
    csp.id = state.id;
    // csp.x = state.x;
    csp.y = state.y;
    csp.width = state.width;
    csp.height = state.height;
    // csp.color = state.color;
    csp.score = state.score;

    console.log('oS: currentState: ', currenState);
}

function onUpdatePlayer(state){
    // buscamos jugador por su socket.id y lo actualizamos
    for(let i=0, found=false; i<currenState.players.length && !found; i++) {
        if(currenState.players[i].id === state.id){
            found = true;
            currenState.players[i].y = state.y;
            currenState.players[i].score = state.score;
        }
    }
}

function onUpdateBall(state){
    // console.log('onUpdateBall', state);
    currenState.ball.x = state.x;
    currenState.ball.y = state.y;
    currenState.ball.speed = state.speed;
    currenState.ball.velocityX = state.velocityX;
    currenState.ball.velocityY = state.velocityY;
}

function onDisconnect() {
    console.log('user disconnected');
    connections = [];
    currenState = {
        // state: 'WAITING',
        players: [{}, {}],
        ball: {}
    }
}

// definimos i tratamos los eventos salientes
function sendCounter(){
    console.log('emitiendo getCounter: ', connections.length);
    io.socket.emit('getCounter', connections.length);
}

function heartBeat(){
    io.socket.emit('heartBeat', currenState);
}