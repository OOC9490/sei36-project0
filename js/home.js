//background canvas set up
const canvas = document.querySelector("#homeBG");

canvas.width = $(window).width();
canvas.height = $(window).height() - 185;

let cxt = canvas.getContext("2d");

//mouse position tracker
const mouse = {
    x: undefined,
    y: undefined
};

window.addEventListener("mousemove",function(event){
    mouse.x = event.x;
    mouse.y = event.y;
});

//resizing browser
window.addEventListener("resize",function(){
    canvas.width = $(window).width();
    canvas.height = $(window).height() - 185;
    init();
});

//color pallette
const colorArray = [
    "#74b3a8",
    "#d9fff9",
    "#bffff4",
    "#b37962",
    "#ffd1bf"
];

function Circle(x, y, xVel, yVel, radius){
    this.x = x;
    this.y = y;
    this.xVel = xVel;
    this.yVel = yVel;
    this.radius = radius;
    this.colour = colorArray[Math.floor(Math.random() * colorArray.length)];
    this.maxRadius = 40;
    this.minRadius = this.radius;

    this.draw = function(){
        cxt.beginPath();
        cxt.arc( this.x, this.y, this.radius, 0, Math.PI * 2, false);
        cxt.strokeStyle = this.colour;
        cxt.stroke();
        cxt.fillStyle = this.colour;
        cxt.fill();
    };

    this.update = function(){
        if ( this.x + this.radius > canvas.width || this.x - this.radius < 0 ){
            this.xVel *= -1;
        }
        if ( this.y + this.radius > canvas.height || this.y - this.radius < 0 ){
            this.yVel *= -1;
        }
    
        this.x += this.xVel;
        this.y += this.yVel;

        //interactivity, checks for circles that are 50px within the mouse's position
        if( mouse.x - this.x < 50 && mouse.x - this.x > -50 && mouse.y - this.y < 50 && mouse.y - this.y > -50){
            if( this.radius < this.maxRadius ){this.radius += 2;};
        }else if( this.radius > this.minRadius ){
            this.radius -= 2;
        };

        this.draw();
    };
};

let circleArray = [];
const init = function(){
    circleArray = [];
    for( let i = 0; i < 200; i++){
        let radius = Math.random() * 3 + 2;
        let x = Math.random() * (canvas.width - radius * 2) + radius;
        let y = Math.random() * (canvas.height - radius * 2) + radius;
        let xVel = (Math.random() - 0.5) * 4;
        let yVel = (Math.random() - 0.5) * 4;
        circleArray.push(new Circle( x, y, xVel, yVel, radius));
    };
}

const animate = function(){
    requestAnimationFrame(animate); //creates an update loop
    cxt.clearRect(0, 0, canvas.width, canvas.height) //clears the canvas
    circleArray.forEach(element => element.update());
};

init();
animate();