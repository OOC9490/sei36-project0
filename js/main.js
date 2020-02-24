//object for managing game logic
const tictactoe = {
    scoreCard: { 1: [0, 0], 2: [0, 0], 3: [0, 0], 4: [0, 0], 5: [0, 0], 6: [0, 0], 7: [0, 0], 8: [0, 0] },
    started: false,
    currentPlayer: 0, //0 for player "X", 1 for player "O"
    currentMoves: 0,
    drawCheck: false,

    coinFlip: function(){
        return ((Math.random() > 0.5) ? 1 : 0);
    },

    checkWinDraw: function( boxId, player ){
        for (let i = 0; i < boxId.length; i++){
            const winState = boxId[i];
            this.scoreCard[ winState ][ player ] += 1;
            if(this.scoreCard[ winState ][ player ] === 3){
                return ui.endOfGameMsg(this.currentPlayer, this.drawCheck);
            }
        };
        if(this.currentMoves === 9){
            this.drawCheck = true;
            return ui.endOfGameMsg(this.drawCheck);
        };
        this.currentPlayer = 1 - player;
        ui.playerTurnMsg(this.currentPlayer);
    },

    resetGame: function(){
        this.drawCheck = false;
        this.currentMoves = 0;
        this.currentPlayer = this.coinFlip();
        Object.keys(this.scoreCard).forEach(number => this.scoreCard[number] = [0,0]);
        ui.playerTurnMsg(this.currentPlayer);
    },
};

//object for interacting with the user interface
const ui ={
    players: ["X", "O", "DRAW"],
    $audio: null,
    numberOfGames: 1,

    startGame: function(){
        $('#uimessages').html(`Loading...`).fadeIn(250);
        setTimeout(function(){
            $(".ingame").css({"opacity":1}).removeClass("disabled");
            $("#gameboard").css({"opacity":1}).removeClass("disabled");
            ui.$audio[1].play();
            ui.playerTurnMsg(tictactoe.currentPlayer);
            tictactoe.started = true;
        },2000);
    },

    restart: function(){
        $(".endGameOverlay").fadeOut(1000).addClass("disabled");
        $("#gameboard").removeClass("disabled");
        $(".box").removeClass("used").html("");
        tictactoe.resetGame();
    },

    drawSymbol: function( player, $boxPressed ){
        $boxPressed.addClass("used");
        $boxPressed.html(`${this.players[player]}`);
    },

    endOfGameMsg( player, draw ){
        $("#gameboard").addClass("disabled");
        $(".endGameOverlay").fadeIn(1000).removeClass("disabled");
        if( draw ){
            $("#endGame").html("It is a draw!<br>Play again?");
            player = 2;
        }else{
            $("#endGame").html(`${this.players[player]} won!<br>Play again?`);
        };
        this.updateScore( this.numberOfGames, player )
    },

    playerTurnMsg: function( player ){
        $('#uimessages').fadeOut(250).html(`It is ${this.players[player]}'s turn!`).fadeIn(250);
    },

    buttonCheck: function( buttonValue ){
        switch( buttonValue ){
            case "gamestart":
                tictactoe.coinFlip();
                this.startGame();
                break;
            case "restart":
                this.restart();
                break;
            case "scoreboard":
                this.showOrHideScore("#results");
                break;
        };
    },

    showOrHideScore: function( divId ){
        if( $( divId ).width() <= ($(window).width() / 2)){
            $( divId ).css({"width":`${$(".container").width()}`});
            $(`.endGameOverlay`).css({"margin-left":"100vw"});
        }else{
            $(divId).css({"width":"0"});
            $(`.endGameOverlay`).css({"margin-left":"0"});
        };
    },
    
    updateScore: function( gameNumber, player ){
        if( this.numberOfGames % 15 === 0 ){
            $("#score tr").not(":first").empty();
            return this.updateScore( gameNumber, player)
        }else{
            $('#score tr:last').after(`<tr>
            <td class="rounds">GAME ${gameNumber}</td>
            <td class="winners">${this.players[player]}</td>
            </tr>`);
            this.numberOfGames++;
        };
    },
};

$(document).ready(function(){
    ui.$audio = $("audio");
    $("button:not(#gamestart), .closebutton").on("click", function(){
        if(tictactoe.started){ui.$audio[0].play();};
        ui.buttonCheck( $(this).attr("value") );
    });

    $("#gamestart").on("click", function(){
        $(this).css({"opacity":0, "pointer-events":"none"});
        ui.buttonCheck( $(this).attr("value") );
    });
    
    $(".box").on("click", function(){
        ui.$audio[2].play();
        if( tictactoe.started && $(this).hasClass("used") === false){
            ui.drawSymbol( tictactoe.currentPlayer, $(this));
            tictactoe.currentmoves++;
            tictactoe.checkWinDraw( $(this).attr("id"), tictactoe.currentPlayer);
        };
    });
});