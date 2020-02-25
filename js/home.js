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
        animateInterval: 40,
        pad: true, 
        pauseLength: 5000,
    });
};


$(document).ready(function(){
    const $startupSound = $("audio");
    $(".clickbait button").on("click", function(){
        $(".clickbait").fadeOut(1000);
        $(".hidden").fadeIn(1000);
        setTimeout(function(){
            $startupSound[0].play();
            $(".postWelcome, .welcome").css({"animation": "text-glow 3.5s linear"});
            applyRainbow($(".welcome"),"#000080");
            $(".postWelcome").each(function(){
                applyRainbow($(this),"#ffffff");
            });
        },500);
        setTimeout(function(){
            $(".postWelcome, .welcome").each(function(){
                $(this).pauseRainbow();
            });
        },3000);
    });
});