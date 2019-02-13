$(function() {
    var slidesIndex = 0;
    var auto_slideshow = true;
    showSlides(slidesIndex);

    // gestion du bouton slide suivante
    $(".next_button").click(function() {
        $("#play-pause_button i").removeClass("fa-pause-circle").addClass("fa-play-circle");
        slidesIndex ++;
        auto_slideshow = false;
        showSlides(slidesIndex);
    });

    // gestion du bouton slide précédente
    $(".previous_button").click(function() {
        $("#play-pause_button i").removeClass("fa-pause-circle").addClass("fa-play-circle");
        slidesIndex --;
        auto_slideshow = false;
        showSlides(slidesIndex);
    });

    // gestion de l'animation du slidehow au clique du bouton play/pause
    $("#play-pause_button").click(function() {
        if ($("i", this).hasClass("fa-pause-circle")) {
            auto_slideshow = false;
            $("i", this).removeClass("fa-pause-circle").addClass("fa-play-circle");
        }
        else {
            auto_slideshow = true;
            $("i", this).removeClass("fa-play-circle").addClass("fa-pause-circle");
            showSlides(slidesIndex);
        }
    });

    function showSlides(index) {
        // vérification de l'index de la slide à afficher
        var finalIndex;
        if (index > ($(".slides").length -1)) {
            finalIndex = 0;
            slidesIndex = 0;
        }
        else if (index < 0) {
            finalIndex = $(".slides").length -1;
            slidesIndex = $(".slides").length -1;
        }
        else {
            finalIndex = index;
        }

        // Affichage de la slide voulu en fonction de l'index
        $(".slides").each(function (elt) {
            if (elt == finalIndex) {
                $(this).css({
                    "display": "flex",
                    "opacity": 0.4
                }).animate({"opacity": 1}, 1000);
            }
            else {
                $(this).css("display", "none");
            }
        });

        // animation de changement de slide toute les 5 secondes
        if (auto_slideshow) {
            slidesIndex ++;
            var slideshow_anime = setTimeout(function() {
                showSlides(slidesIndex);
            }, 5000);
        }
        else {
            clearTimeout(slideshow_anime);
        }
    }
})