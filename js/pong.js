// classes
class Vector{
    constructor(x = 0, y = 0){
        this.x = x;
        this.y = y;
    };
};

class Rectangle{
    constructor(w,h){
        this.pos = new Vector;
        this.size = new Vector(w,h);
    };
};

class Ball extends Rectangle{
    constructor(){
        super(5,5);
        this.vel = new Vector;
    }
};

//some setup stuff
let canvas = document.getElementById("pong");
const context = canvas.getContext("2d");
const headerFooterValue = 185;

const ball = new Ball;
ball.pos.x = 100;
ball.pos.y = 50;
ball.vel.x = 50;
ball.vel.y = 50;

let lastTime;

const callback = function(millis){
    if(lastTime){
        update((millis - lastTime) / 1000);
    }
    // debugger;
    lastTime = millis;
    requestAnimationFrame(callback);
}//time calculator

const update = function(dt){
    ball.pos.x += ball.vel.x * dt;
    ball.pos.y += ball.vel.y * dt;

    //collision
    if( ball.pos.x < 0 || ball.pos.x > canvas.width){
        ball.vel.x *= -1;
    }
    if( ball.pos.y < 0 || ball.pos.y > canvas.height){
        ball.vel.y *= -1;
    }

    context.fillStyle = "#000";
    context.fillRect(0, 0 , canvas.width, canvas.height);

    context.fillStyle = "#fff";
    context.fillRect(ball.pos.x, ball.pos.y, ball.size.x, ball.size.y);
    requestAnimationFrame(update);
}; //movement of the ball is relative to the time difference between update callbacks

callback();


