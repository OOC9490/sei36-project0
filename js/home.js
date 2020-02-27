const applyRainbow = function( $element, paddingColor ){
    $element.rainbow({	
        colors: [
            '#FF0000',
            '#f26522',
            '#fff200',
            '#00a651',
            '#28abe2',
            '#6868ff',
            paddingColor
        ],
        animate: true,
        animateInterval: 80,
        pad: true, 
        pauseLength: 5000,
    });
};


$(document).ready(function(){
    const $startupSound = $("audio");
    $(".clickbait button").on("click", function(){
        $(".clickbait").fadeOut(500);
        $(".hidden").fadeIn(500);
        setTimeout(function(){
            $startupSound.trigger("play");
            $(".postWelcome, .welcome").css({"animation": "text-glow 3.5s linear"});
            $(".smallContainer").css({"animation":"bounce 3.5s ease"});
            applyRainbow($(".welcome"),$(".welcome").css("color"));
            $(".postWelcome").each(function(){
                applyRainbow($(this),$(this).css("color"));
            });
        },500);
        setTimeout(function(){
            $(".postWelcome, .welcome").each(function(){
                $(this).pauseRainbow();
            });
        },3200);
    });
});