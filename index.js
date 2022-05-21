'use strict';

const port = process.env.PORT || 5000;

const express = require('express');
const app = express();

app.use(express.static(__dirname + '/public/'));

app.listen(port, () => {
    console.log(`Juego PONG en http://localhost:${port}`);
});