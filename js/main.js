//object for managing game logic
const tictactoe = {
    scoreCard: { 1: [0, 0], 2: [0, 0], 3: [0, 0], 4: [0, 0], 5: [0, 0], 6: [0, 0], 7: [0, 0], 8: [0, 0] },
    tilesFilled: { "147": false, "15": false, "168": false, "24": false, "2578": false, "26": false, "348": false, "35": false, "367": false},
    started: false,
    currentPlayer: 0, //0 for player "X", 1 for player "O"
    leadingPlayer: 0,
    currentMoves: 0,
    drawCheck: false,
    aiHasMoved: false,

    coinFlip: function(){
        return ((Math.random() > 0.5) ? this.leadingPlayer = 1 : this.leadingPlayer = 0);
    },

    checkWinDraw: function( boxId, player ){
        this.tilesFilled[boxId] = true;
        for (let i = 0; i < boxId.length; i++){
            const winState = boxId[i];
            this.scoreCard[ winState ][ player ] += 1;
            if(this.scoreCard[ winState ][ player ] === 3){
                return ui.endOfGameMsg(this.currentPlayer, this.drawCheck);
            };
        };
        if(this.currentMoves === 9){
            this.drawCheck = true;
            return ui.endOfGameMsg(this.currentplayer, this.drawCheck);
        };
        this.currentPlayer = 1 - player;
        ui.playerTurnMsg(this.currentPlayer);
        if(this.currentPlayer === 1){this.aiTurn()};
        this.aiHasMoved = false;
    },

    resetGame: function(){
        this.drawCheck = false;
        this.currentMoves = 0;
        this.currentPlayer = this.coinFlip();
        Object.keys(this.scoreCard).forEach(number => this.scoreCard[number] = [0,0]);
        Object.keys(this.tilesFilled).forEach(key => this.tilesFilled[key] = false);
        ui.playerTurnMsg(this.currentPlayer);
        this.aiHasMoved = false;
        if(this.leadingPlayer === 1){this.aiTurn()};
    },

    aiTurn: function(){
        if(this.currentPlayer === 1){
            if( this.aiWinOrDenyPlayer(1,2,0) ){return}; //AI prioritises winning over anything else
            if( this.aiWinOrDenyPlayer(0,2,0) ){return}; //AI then checks for any possible player winning situations
            if( this.aiWinOrDenyPlayer(1,1,1) ){return}; //AI then checks for any moves that would set up a possible win (so it ignores any lines on the board that already have no chance of winnning)
            if( this.aiHasMoved === false ){this.aiOpeningOrRandomMove();}; // AI's predetermined first moves or it's in a position where it can't find a winning path
        };
    },

    aiWinOrDenyPlayer: function(playerToCheck, valueToCheck, lengthToCheck){
        if($('#2578').is(':empty') && this.currentMoves > 1){
            $('#2578').click();
            return true;
        };// this forces the most optimal move, taking the centre after a corner on the leading move, if the human doesn't take it
        const tilesNotFilled = Object.keys(this.tilesFilled).filter(key => this.tilesFilled[key] === false);
        // scoreKeyArray stores the keys in scoreCard to be checked based on the conditions passed in
        const scoreKeyArray = Object.keys(this.scoreCard).filter(key => this.scoreCard[key][playerToCheck] === valueToCheck);
        if ( scoreKeyArray.length > 0){
            for(let i = 0; i < scoreKeyArray.length; i++){
                const tileId = scoreKeyArray[i];
                const affectedTiles = tilesNotFilled.filter(element => element.includes(tileId));
                if( affectedTiles.length > lengthToCheck){
                    $(`#${affectedTiles[Math.floor( Math.random() * affectedTiles.length)]}`).click();
                    return this.aiHasMoved = true; // causes aiTurn function to stop (to prevent the ai from making multiple moves)
                };
            };
        };// confirms whether moving on a tile that match the gamestate being checked for is a viable move
        return false; // lets aiTurn keep going if a move is not made
    },

    aiOpeningOrRandomMove: function(){
        const $middleTile = $('#2578');
        const $cornerTiles = [];
        $('#147, #168, #348, #367').each(function(){
            if($(this).is(':empty')){
                $cornerTiles.push($(this));
            };
        });
        const $randomCornerTile = $cornerTiles[Math.floor( Math.random() * $cornerTiles.length )];
        if(this.leadingPlayer === 1 && this.currentMoves < 1){
            //The AI is the first to move, it will aim for the corners
            $randomCornerTile.click();
        }else{
            //If the AI is second it will aim for the middle tile or take a corner, if the player takes the middle tile going first
            if($middleTile.is(':empty')){
                $middleTile.click();
            }else if($cornerTiles.length > 0){
                $randomCornerTile.click();
            }else{
                $('.box:empty').eq(0).click();
            };
        };
    }
};

//object for interacting with the user interface
const ui ={
    players: ["X", "O", "DRAW"],
    $audio: {},
    numberOfGames: 1,

    startGame: function(){
        $('#uimessages').html(`Loading...`).fadeIn(250);
        setTimeout(function(){
            $(".ingame, #gameboard, .box").css({"opacity":1}).removeClass("disabled");
            ui.$audio["boot"].trigger("play");
            ui.playerTurnMsg(tictactoe.currentPlayer);
            tictactoe.started = true;
            tictactoe.aiTurn();
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
        let gameState = "";
        if( draw ){
            $("#endGame").html("It is a draw!<br>Play again?");
            player = 2;
            gameState = "draw";
        }else{
            $("#endGame").html(`${this.players[player]} won!<br>Play again?`);
            gameState = "win";
        };
        this.$audio[gameState].trigger("play");
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
        if( $( divId ).width() < $(".container").width()){
            $( divId ).css({"width":`${$(".container").width()}`});
            $(`.endGameOverlay`).css({"margin-left":"100vw"});
        }else{
            $( divId ).css({"width":"0"});
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
    $("audio").each(function(){
        ui.$audio[$(this).attr("id")] = $(this);
    });

    $("button:not(#gamestart), .closebutton").on("click", function(){
        if(tictactoe.started){ui.$audio["press"].trigger("play");};
        ui.buttonCheck( $(this).attr("value") );
    });

    $("#gamestart").on("click", function(){
        $(this).css({"display":"none"});
        ui.buttonCheck( $(this).attr("value") );
    });
    
    $("#gameboard").on("click", "div[class*='box']", function(){
        ui.$audio["play"].trigger("play");
        if( tictactoe.started && $(this).hasClass("used") === false){
            ui.drawSymbol( tictactoe.currentPlayer, $(this));
            tictactoe.currentMoves += 1;
            tictactoe.checkWinDraw( $(this).attr("id"), tictactoe.currentPlayer);
        };
    });
});