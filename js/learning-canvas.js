const canvas = document.querySelector("#homeBG");

canvas.width = $(window).width();
canvas.height = $(window).height() - 185;

let cxt = canvas.getContext("2d");

// //rectangle
// cxt.fillStyle = "#000";
// cxt.fillRect(0, 0, canvas.width, canvas.height)

// //line
// cxt.beginPath()
// cxt.strokeStyle = "#fff";
// cxt.moveTo( 50, 100 );
// cxt.lineTo( 300, 400 );
// cxt.stroke();

// //arc or Circle

// cxt.beginPath();
// cxt.arc( 300, 300, 30, 0, Math.PI * 2, false);
// cxt.strokeStyle = "#87ceeb";
// cxt.stroke();

//animating basic shape

// let x = Math.random() * canvas.width;
// let y = Math.random() * canvas.height;
// let xSpeed = (Math.random() - 0.5) * 20;
// let ySpeed = (Math.random() - 0.5) * 20;
// let radius = 30;

// const animate = function(){
//     requestAnimationFrame(animate); //creates an update loop
//     cxt.clearRect(0, 0, canvas.width, canvas.height) //clears the canvas
//     cxt.beginPath();
//     cxt.arc( x, y, radius, 0, Math.PI * 2, false);
//     cxt.strokeStyle = "#87ceeb";
//     cxt.stroke();

//     if ( x + radius > canvas.width || x - radius < 0 ){
//         xSpeed *= -1;
//     }
//     if ( y + radius > canvas.height || y - radius < 0 ){
//         ySpeed *= -1;
//     }

//     x += xSpeed;
//     y += ySpeed;
// };
// animate();

//creating a class

function Circle(x, y, xVel, yVel, radius){
    this.x = x;
    this.y = y;
    this.xVel = xVel;
    this.yVel = yVel;
    this.radius = radius;
    this.colour = `#${(Math.random()*0xFFFFFF<<0).toString(16)}`

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
        this.draw();
    };
};

const circleArray = [];
for( let i = 0; i < 50; i++){
    let radius = 10;
    let x = Math.random() * (canvas.width - radius * 2) + radius;
    let y = Math.random() * (canvas.height - radius * 2) + radius;
    let xVel = (Math.random() - 0.5) * 20;
    let yVel = (Math.random() - 0.5) * 20;
    circleArray.push(new Circle( x, y, xVel, yVel, radius));
};

const animate = function(){
    requestAnimationFrame(animate); //creates an update loop
    cxt.clearRect(0, 0, canvas.width, canvas.height) //clears the canvas
    circleArray.forEach(element => element.update());
};

animate();