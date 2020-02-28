// classes
class Vector{
    constructor(x = 0, y = 0){ //assigning values here defaults to zero
        this.x = x;
        this.y = y;
    };
    get speed(){
        return Math.sqrt( this.x * this.x + this.y * this.y ); 
    }; // hypotenuse of a triangle formula. This is used to normalise the speed of the ball based on the vertical and horizontal direction of the ball.
    set speed(value){
        const factor = value / this.speed;
        this.x *= factor;
        this.y *= factor;
    };
};

class Rectangle{
    constructor(w,h){
        this.pos = new Vector;
        this.size = new Vector(w,h);
    };
    //use getters to be able to calculate the edges of the objects that utilise this class to instantiate
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
        super(8,8);
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
        this.ballRadius = this.ball.size.x / 2; //going to be used to help with collision detection
        this.hitTopOrBottom = false;
        this.players = [
            new Player,
            new Player
        ];
        this.players[0].pos.x = 20; //Player1
        this.players[1].pos.x = canvas.width - 20;  //Player2
        this.players.forEach(player => player.pos.y = canvas.height / 2);
        this.difficulty = "easy";
        this.players[1].vel.y = 100; //how fast the AI moves
        this.cpuSize = {
            easy: 40,
            mid: 80,
            crazy: 40
        };

        let lastTime;
        const updateLoop = (milliseconds) => {
            if(lastTime && !this.paused){
                this.update((milliseconds - lastTime) / 1000 );
            };
            lastTime = milliseconds;
            requestAnimationFrame(updateLoop); //a canvas method that loops the given function
        };
        updateLoop(); //updateLoop needs to be called to begin the game

        //array for storing pixel patterns of scores
        //1 indicates a turned on array and 0 is off
        //these get converted to images for rendering
        //each "row" of the are composed of a triplet of 0's and 1's
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
            canvas.height = this.pxSize * 5; //height of the image to be made
            canvas.width = this.pxSize * 3; //width of the image to be made
            const ctxt = canvas.getContext("2d");
            ctxt.fillStyle = "#fff";
            //filling the canvas with reference to the one or zero
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
    }; //centres the ball after every score

    startBall(){
        if( this.ball.vel.x === 0 && this.ball.vel.y === 0){
            const direction = Math.random() < 0.5 ? 1 : -1;
            this.ball.vel.x = 75 * direction;
            this.ball.vel.y = 75 * direction;
            this.ball.vel.speed = 200;
        };
    }; //gets the ball moving after a click, only if it is stationary

    hitPlayer(player, ball){
        if( player.left < ball.right && player.right > ball.left && player.top < ball.bottom && player.bottom > ball.top && this.hitTopOrBottom === false){
            const currentSpeed = ball.vel.speed;
            if( player.top < ball.bottom || player.bottom > ball.top ){
                this.hitTopOrBottom = true;
                setTimeout(() => {
                    this.hitTopOrBottom = false;
                },200);
            }; // turns off hit detection briefly to prevent the ball from travelling "into the paddle"
            ball.vel.x = -ball.vel.x;
            ball.vel.y += 300 * (Math.random() - 0.5); // changes the angle the ball is bounced when hit by a paddle
            ball.vel.speed = currentSpeed * 1.05; //increases the ball's speed every time a paddle hits it
            $audio["bounce"].trigger("play");
        };
    };

    //constantly clears, redraws the canvas and the given shapes
    boardRefresh(){
        this.context.fillStyle = "#000";
        this.context.fillRect(0, 0 , this.canvas.width, this.canvas.height);
        this.drawRect(this.ball);
        this.players.forEach(player => this.drawRect(player));
        this.drawScore();
    };

    // a generic function for drawing rectangle-based objects
    drawRect(rect){
        this.context.fillStyle = "#fff";
        this.context.fillRect(rect.left, rect.top, rect.size.x, rect.size.y);
    };
    
    //updating player scores on the canvas
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

    // Computer player's movement
    pcMove(difficulty, difInTime){
        switch(difficulty){
            case "crazy": return this.players[1].pos.y = this.ball.pos.y;
            default: return this.players[1].pos.y += this.players[1].vel.y * difInTime;
        };
    };

    update(dt) {
        this.ball.pos.x += this.ball.vel.x * dt;
        this.ball.pos.y += this.ball.vel.y * dt;
        this.pcMove(this.difficulty, dt);
    
        //collision detection with the edges of the canvas
        if( this.ball.left < 0 || this.ball.right > this.canvas.width){
            this.ball.vel.x = -this.ball.vel.x;
            //scoring
            const playerId = this.ball.left < 0 ? 1 : 0;
            this.players[playerId].score += 1;
            this.resetBall();
        };
        if( this.ball.top < 0 || this.ball.bottom > this.canvas.height){
            this.ball.vel.y = -this.ball.vel.y;
            $audio["bounce"].trigger("play");
        };
        
        if( this.players[1].top < 0 || this.players[1].bottom > this.canvas.height){
            if( this.players[1].top < 0){
                this.players[1].pos.y += this.ballRadius;
            }else{
                this.players[1].pos.y -= this.ballRadius;
            };//prevents the cpu player from going out of bounds when on "crazy" difficulty
            this.players[1].vel.y = -this.players[1].vel.y;
        };

        this.players.forEach(player => this.hitPlayer( player, this.ball) );
        
        this.boardRefresh();
    }; 
}; //game's main class

//some setup stuff
const canvas = document.getElementById("pong");
const $diffLevel = $(".diffText");
const $audio = {};
const pong = new Pong(canvas);
$diffLevel.text(pong.difficulty);

$(canvas).on("mousemove",function(event){
    //scale helps align the player's pointer/ tap position with their paddle
    const scale = event.offsetY / event.target.getBoundingClientRect().height;
    pong.players[0].pos.y = canvas.height * scale;
});

//mobile support
canvas.addEventListener("touchmove", function(event){
    const scale = event.touches[0].screenY / event.touches[0].target.getBoundingClientRect().height;
    pong.players[0].pos.y = canvas.height * scale;
    console.log(event);
});

//this is a generic full screen function, it will work for desktop browsers too, included for better mobile support
const toggleFullScreen = function($button) {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
        $button.text("exit fullscreen")
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen(); 
        $button.text("fullscreen")
      };
    };
};

//mobile support end

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
    const level = $(this).text()
    $diffLevel.text(level);
    pong.difficulty = level;
    pong.players[1].size.y = pong.cpuSize[level];
});

$("#fullscreen").on("click", function(){
    toggleFullScreen($(this));
});
