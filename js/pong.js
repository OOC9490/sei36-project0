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
        this.paused = false;
        this.ball = new Ball;
        this.players = [
            new Player,
            new Player
        ];
        this.players[0].pos.x = 20; //Player1
        this.players[1].pos.x = canvas.width - 20;  //Player2
        this.players.forEach(player => player.pos.y = canvas.height / 2);
        this.difficulty = "crazy";
        let lastTime;
        const callback = (millis) => {
            if(lastTime && !this.paused){
                this.update((millis - lastTime) / 1000 );
            };
            lastTime = millis;
            requestAnimationFrame(callback);
        };
        callback();

        //array for storing pixel patterns of scores
        //1 indicates a turned on array and 0 is off
        //these get converted to images for rendering
        this.pxSize = 5;
        this.pxPatterns = [
            "111101101101111",
            "010010010010010",
            "111001111100111",
            "111001111001111",
            "101101111001001",
            "111100111001111",
            "111100111101111",
            "111001001001001",
            "111101111101111",
            "111101111001111"
        ].map(pattern => {
            const canvas = document.createElement("canvas");
            canvas.height = this.pxSize * 5;
            canvas.width = this.pxSize * 3;
            const ctxt = canvas.getContext("2d");
            ctxt.fillStyle = "#fff";
            //filling the pixel with reference to the one or zero
            pattern.split("").forEach((fill, i) =>{
                if( fill === "1" ){
                    ctxt.fillRect(
                        (i % 3) * this.pxSize,
                        Math.floor((i / 3)) * this.pxSize,
                        this.pxSize,
                        this.pxSize);
                };
            });
            return canvas;
        });

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
            this.ball.vel.length = 200;
        };
    };

    hitPlayer(player, ball){
        if( player.left < ball.right && player.right > ball.left && player.top < ball.bottom && player.bottom > ball.top ){
            const currentSpeed = ball.vel.length;
            ball.vel.x = -ball.vel.x;
            ball.vel.y += 100 * (Math.random() - 0.5); // changes the angle the ball is bounced when hit by a paddle
            ball.vel.length = currentSpeed * 1.05; //increases the ball's speed every time a paddle hits it
            $audio["bounce"].trigger("play");
        };
    };

    boardRefresh(){
        this.context.fillStyle = "#000";
        this.context.fillRect(0, 0 , this.canvas.width, this.canvas.height);
        this.drawRect(this.ball);
        this.players.forEach(player => this.drawRect(player));
        this.drawScore();
    };

    // a generic function for drawing the ball
    drawRect(rect){
        this.context.fillStyle = "#fff";
        this.context.fillRect(rect.left, rect.top, rect.size.x, rect.size.y);
    };
    
    //updating player scores
    drawScore(){
        const align = this.canvas.width / 3;
        const numberSpace = this.pxSize * 4;
        this.players.forEach((player,index) => {
            const chars = player.score.toString().split(""); //turn the players' scores to chars
            const leftOffset = align * (index + 0.75) + (numberSpace * chars.length / 2) * this.pxSize / 30; //sets up the space to draw the numbers on
            chars.forEach((char,position) => {
                this.context.drawImage(this.pxPatterns[parseInt(char)],
                leftOffset + position * numberSpace, 10);
            });
        });
    };

    update(dt) {
        this.ball.pos.x += this.ball.vel.x * dt;
        this.ball.pos.y += this.ball.vel.y * dt;
    
        //collision detection with the edges of the canvas
        if( this.ball.left < 0 || this.ball.right > this.canvas.width){
            this.ball.vel.x = -this.ball.vel.x;
            //scoring
            const playerId = this.ball.left < 0 ? 1 : 0;
            $audio["bounce"].trigger("play");
            this.players[playerId].score += 1;
            this.resetBall();
        };
        if( this.ball.top < 0 || this.ball.bottom > this.canvas.height){
            this.ball.vel.y = -this.ball.vel.y;
            $audio["bounce"].trigger("play");
        };
        this.players[1].pos.y = this.ball.pos.y;
        // if( this.players[1].top < 0 || this.players[1].bottom > this.canvas.height){
        //     this.pla
        //     this.players[1].vel.y = -this.players[1].vel.y;
        // };

        this.players.forEach(player => this.hitPlayer( player, this.ball) );
        
        this.boardRefresh();
    }; 
}; //game's main class

//some setup stuff
const canvas = document.getElementById("pong");
const $diffLevel = $(".diffText");

const pong = new Pong(canvas);
const $audio = {};
$diffLevel.text(pong.difficulty);

$(canvas).on("mousemove",function(event){
    pong.players[0].pos.y = (event.offsetY / 4);
});

$(canvas).on("click", function(){
    pong.startBall();
});
$("audio").each(function(){
    $audio[$(this).attr("id")] = $(this);
});
$(".menu").on("click", function(){
    if(pong.paused){
        $(".endGameOverlay").fadeOut(250);
        $audio["unpause"].trigger("play");
        pong.paused = false;
    }else{
        pong.paused = true;
        $(".endGameOverlay").fadeIn(500);
        $audio["pause"].trigger("play");
    };
});
$(".difficulty").on("click", function(){
    pong.difficulty = $(this).text();
    $diffLevel.text($(this).text());
});






