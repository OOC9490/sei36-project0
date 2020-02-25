const canvas = document.querySelector("canvas");

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

let x = Math.random() * canvas.width;
let y = Math.random() * canvas.height;
let xSpeed = (Math.random() - 0.5) * 20;
let ySpeed = (Math.random() - 0.5) * 20;
let radius = 30;

const animate = function(){
    requestAnimationFrame(animate); //creates an update loop
    cxt.clearRect(0, 0, canvas.width, canvas.height) //clears the canvas
    cxt.beginPath();
    cxt.arc( x, y, radius, 0, Math.PI * 2, false);
    cxt.strokeStyle = "#87ceeb";
    cxt.stroke();

    if ( x + radius > canvas.width || x - radius < 0 ){
        xSpeed *= -1;
    }
    if ( y + radius > canvas.height || y - radius < 0 ){
        ySpeed *= -1;
    }

    x += xSpeed;
    y += ySpeed;
};

animate();
//creating a class

function Circle(x,y){
    this.x = x;
    this.y = y;

    this.draw = function(){
        cxt.beginPath();
        cxt.arc( this.x, this.y, radius, 0, Math.PI * 2, false);
        cxt.strokeStyle = "#87ceeb";
        cxt.stroke();
    };

    this.update = function(){
        if ( x + radius > canvas.width || x - radius < 0 ){
            xSpeed *= -1;
        }
        if ( y + radius > canvas.height || y - radius < 0 ){
            ySpeed *= -1;
        }
    
        x += xSpeed;
        y += ySpeed;
    };
};


