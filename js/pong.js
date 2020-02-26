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
    //use getters to be able to calculate the edges of the drawn shapes
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

class Player extends Rectangle{
    constructor(){
        super(10,40);
        this.score = 0;
        this.vel = new Vector;
    }
}; // player paddles

class Pong{
    constructor(canvas){
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.ball = new Ball;
        this.ball.pos.x = 100;
        this.ball.pos.y = 50;
        this.ball.vel.x = 100;
        this.ball.vel.y = 100;

        this.players = [
            new Player,
            new Player
        ];
        
        this.players[0].pos.x = 20; //Player1
        this.players[1].pos.x = canvas.width - 20;  //Player2
        this.players.forEach(player => player.pos.y = canvas.height / 2);

        //AI speed
        this.players[1].vel.y = 100;

        let lastTime;
        const callback = (millis) => {
            if(lastTime){
                this.update((millis - lastTime) / 1000 );
            };
            lastTime = millis;
            requestAnimationFrame(callback);
        };
        callback();
    };

    collision(){

    };

    boardRefresh(){
        this.context.fillStyle = "#000";
        this.context.fillRect(0, 0 , this.canvas.width, this.canvas.height);
        this.drawRect(this.ball);
        this.players.forEach(player => this.drawRect(player));
    };

    // a generic function for drawing the ball
    drawRect(rect){
        this.context.fillStyle = "#fff";
        this.context.fillRect(rect.left, rect.top, rect.size.x, rect.size.y);
    };

    update(dt) {
        this.ball.pos.x += this.ball.vel.x * dt;
        this.ball.pos.y += this.ball.vel.y * dt;
        this.players[1].pos.y += this.players[1].vel.y * dt;
    
        //collision detection with the edges of the canvas
        if( this.ball.left < 0 || this.ball.right > this.canvas.width){
            this.ball.vel.x = -this.ball.vel.x;
        }
        if( this.ball.top < 0 || this.ball.bottom > this.canvas.height){
            this.ball.vel.y = -this.ball.vel.y;
        }
        if( this.players[1].top < 0 || this.players[1].bottom > this.canvas.height){
            this.players[1].vel.y = -this.players[1].vel.y;
        }
        
        this.boardRefresh();
    }; 
}; //game's main class

//some setup stuff
const canvas = document.getElementById("pong");
const pong = new Pong(canvas);

canvas.addEventListener("mousemove",function(event){
    pong.players[0].pos.y = (event.offsetY / 4) + 10;
})



