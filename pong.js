//Recuperem el canvas
const cvs = document.getElementById('pong_canvas');
const ctx = cvs.getContext('2d');

//rectangle fons
ctx.fillStyle = 'BLACK';
ctx.fillRect(10, 20, 150, 200);

//cercle
ctx.fillStyle = 'WHITE';
ctx.beginPath();
ctx.arc(60,70,10,0,2*Math.PI);
ctx.closePath();
ctx.fill();

ctx.fillStyle = 'BLUE';
ctx.font = '45px impact';
ctx.fillText("Saludos", 100, 200);