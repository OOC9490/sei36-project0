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
        pauseLength: 150,
    });
}

$(document).ready(function(){
    const $startupSound = $("audio");
    $(".clickbait button").on("click", function(){
        $(".clickbait").fadeOut(1000);
        $(".hidden").fadeIn(1000);
        setTimeout(function(){
            $startupSound[0].play();
            $(".postWelcome").css({"animation": "text-glow 3.5s linear"});
            $(".welcome").css({"animation": "text-glow 3.5s linear"});
            applyRainbow($(".welcome"),"#000080");
            $(".postWelcome p").each(function(){
                applyRainbow($(this),"#ffffff");
            });
        },750);
        setTimeout(function(){
            $(".welcome").pauseRainbow();
            $(".postWelcome p").each(function(){
                $(this).pauseRainbow();
            });
        },3500);
    });
});