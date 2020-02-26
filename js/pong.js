// classes
class Vector{
    constructor(x = 0, y = 0){
        this.x = x;
        this.y = y;
    };
    get length(){
        return Math.sqrt( this.x * this.x + this.y * this.y ); //hypotenuse
    };
    set length(value){
        const factor = value / this.length;
        this.x *= factor;
        this.y *= factor;
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

        this.players = [
            new Player,
            new Player
        ];
        
        this.players[0].pos.x = 20; //Player1
        this.players[1].pos.x = canvas.width - 20;  //Player2
        this.players.forEach(player => player.pos.y = canvas.height / 2);

        //AI speed
        this.players[1].vel.y = 200;

        let lastTime;
        const callback = (millis) => {
            if(lastTime){
                this.update((millis - lastTime) / 1000 );
            };
            lastTime = millis;
            requestAnimationFrame(callback);
        };
        callback();
        this.resetBall();
    };

    resetBall(){
        this.ball.pos.x = this.canvas.width / 2;
        this.ball.pos.y = this.canvas.height / 2;
        this.ball.vel.x = 0;
        this.ball.vel.y = 0;
    };

    startBall(){
        if( this.ball.vel.x === 0 && this.ball.vel.y === 0){
            const direction = Math.random() < 0.5 ? 1 : -1;
            this.ball.vel.x = 75 * direction;
            this.ball.vel.y = 75 * direction;
            this.ball.vel.length = 150;
        };
    };

    hitPlayer(player, ball){
        if( player.left < ball.right && player.right > ball.left && player.top < ball.bottom && player.bottom > ball.top ){
            ball.vel.x = -ball.vel.x;
            ball.vel.length *= 1.05; //increases the ball's speed every time a paddle hits it
        };
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
            //scoring
            const playerId = this.ball.left < 0 ? 1 : 0;
            this.players[playerId].score += 1;
            console.log(this.players[playerId].score);
            this.resetBall();
        };
        if( this.ball.top < 0 || this.ball.bottom > this.canvas.height){
            this.ball.vel.y = -this.ball.vel.y;
        };
        if( this.players[1].top < 0 || this.players[1].bottom > this.canvas.height){
            this.players[1].vel.y = -this.players[1].vel.y;
        };

        this.players.forEach(player => this.hitPlayer( player, this.ball) );
        
        this.boardRefresh();
    }; 
}; //game's main class

//some setup stuff
const canvas = document.getElementById("pong");
const pong = new Pong(canvas);

$(canvas).on("mousemove",function(event){
    pong.players[0].pos.y = (event.offsetY / 4) + 10;
});

$(canvas).on("click", function(){
    pong.startBall();
});



