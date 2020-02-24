//object for managing game logic
const tictactoe = {
    scoreCard: { 1: [0, 0], 2: [0, 0], 3: [0, 0], 4: [0, 0], 5: [0, 0], 6: [0, 0], 7: [0, 0], 8: [0, 0] },
    started: false,
    currentPlayer: 0, //0 for player "X", 1 for player "O"
    currentmoves: 0,

    coinFlip: function(){
        return ((Math.random() > 0.5) ? 1 : 0);
    },

    checkWinDraw: function( boxId, player ){

    },
};

//object for interacting with the user interface
const ui ={
    players: ["X", "O"],

    startGame: function(){

    },

    drawSymbol: function( player, boxPressed ){

    },
};

$(document).ready(function(){
    const $audio = $("audio");
    $("button:not(#gamestart), .closebutton, .box").on("click", function(){
        if(tictactoe.started){$audio[0].play();};
    });

    $("#gamestart").on("click", function(){
        $audio[1].play();
        tictactoe.started = true;
        ui.startGame();
    });
    
    $(".box").on("click", function(){
        if( tictactoe.started && $(this).hasClass("used") === false){
            $(this).addClass("used");
            ui.drawSymbol( tictactoe.currentPlayer, $(this));
            tictactoe.currentmoves++;
            tictactoe.checkWinDraw( $(this).attr("id"), tictactoe.currentPlayer);
        };
    });
});