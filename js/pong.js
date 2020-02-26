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
    get left(){
        return this.pos.x - this.size.x / 2;
    };
    get right(){
        return this.pos.x + this.size.x / 2;
    }; 
    get top(){
        return this.pos.y - this.size.y / 2;
    };
    get bottom(){
        return this.pos.y + this.size.y / 2;
    };
};

class Ball extends Rectangle{
    constructor(){
        super(5,5);
        this.vel = new Vector;
    };
};

//some setup stuff
let canvas = document.getElementById("pong");
const context = canvas.getContext("2d");
const headerFooterValue = 200;

const ball = new Ball;
ball.pos.x = 100;
ball.pos.y = 50;
ball.vel.x = 1;
ball.vel.y = 1;

const update = function(){
    ball.pos.x += ball.vel.x;
    ball.pos.y += ball.vel.y;

    //collision, puts the ball in bounds before redirection
    if( ball.left < 0 || ball.right > canvas.width){
        ball.vel.x = -ball.vel.x;
    }
    if( ball.top < 0 || ball.bottom > canvas.height){
        ball.vel.y = -ball.vel.y;
    }

    context.fillStyle = "#000";
    context.fillRect(0, 0 , canvas.width, canvas.height);

    context.fillStyle = "#fff";
    context.fillRect(ball.pos.x, ball.pos.y, ball.size.x, ball.size.y);
    requestAnimationFrame(update);
}; //movement of the ball is relative to the time difference between update callbacks

// callback();
update();


