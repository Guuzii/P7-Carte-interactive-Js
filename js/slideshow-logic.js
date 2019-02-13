$(function() {
    var slidesIndex = 0;
    var auto_slideshow = true;
    showSlides(slidesIndex);

    // gestion du bouton slide suivante
    $(".next_button").click(nextSlide);

    // gestion du bouton slide précédente
    $(".previous_button").click(previousSlide);

    // gestion du changement de slide avec les flèches du clavier
    $("body").keydown(function(e) {
        if (e.keyCode == 39) {
            nextSlide();
        }
        else if (e.keyCode == 37) {
            previousSlide();
        }
    });

    // gestion de l'animation du slidehow au clique du bouton play/pause
    $("#play-pause_button").click(function() {
        if (auto_slideshow) {
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
        var slideshow_anime = setTimeout(function() {
            if (auto_slideshow) {
                slidesIndex ++;
                showSlides(slidesIndex);
            }
            else {
                clearTimeout(slideshow_anime);
            }
        }, 5000);
    }

    // fonctions de changement de slides
    function nextSlide() {
        $("#play-pause_button i").removeClass("fa-pause-circle").addClass("fa-play-circle");
        auto_slideshow = false;
        slidesIndex ++;
        showSlides(slidesIndex);
    }

    function previousSlide() {
        $("#play-pause_button i").removeClass("fa-pause-circle").addClass("fa-play-circle");
        auto_slideshow = false;
        slidesIndex --;
        showSlides(slidesIndex);
    }
})