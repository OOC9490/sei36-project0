const canvas = document.querySelector("canvas");

canvas.width = $(window).width();
canvas.height = $(window).height() - 185;

let cxt = canvas.getContext("2d");

cxt.fillStyle = "#000";
cxt.fillRect(0, 0, canvas.width, canvas.height)

