/*
    GESTION DES RESERVATIONS (FORMULAIRE, CANVAS, SESSIONSTORAGE)
*/

$(function() {
    // variable qui défini si on est en train de dessiner sur le canvas ou pas
    var draw = false;
    // initialisation du canvas en context 2d + modification du style des tracés 
    var canvas = document.querySelector("canvas");
    var ctx = canvas.getContext("2d");
    ctx.strokeStyle = "red";
    ctx.lineWidth = 0.5;
    // ajout d'une propiété à l'objet ctx qui nous permettrais de savoir si l'on dessine ou pas
    ctx.isDrawing = false;
    
    // création d'un objet timer qui servira à connaitre l'expiration d'une résa
    var timer = {
        minutes: 0,
        secondes: 0,
        // méthode d'initialisation du timer
        initTimer: function(min, sec) {
            this.minutes = min;
            this.secondes = sec;
        },
        // méthode de décompte et d'affichage du timer
        decompte: function() {
            var interval = setInterval(function () {
                if(timer.secondes == 0 && timer.minutes > 0) {
                    timer.minutes --;
                    timer.secondes = 59;
                } 
                else if (timer.secondes > 0) {
                    timer.secondes --;
                }
                // à la fin du decompte remise à zéro de l'interface et des données de réservation
                else {
                    clearInterval(interval);
                    $("#reservation_infos_default").show();
                    $("#actual_reservation").hide();
                    sessionStorage.clear();
                    $("#reservation p").hide();
                    $("#cancel").hide();
                }
                $("#reservation_time").text("Temps restant avant expiration de votre réservation : " + timer.minutes + " min " + timer.secondes + "sec.");
            }, 1000);
        }
    }

    // GESTION CLICK BOUTONS DU BLOC RESERVATION--------------------------------
    // -------------------------------------------------------------------------

    // affichage du canvas pour signer au click du bouton reserver du formulaire
    $("#reserver").click(function(e) {
        e.preventDefault();
        // remise à zéro du canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // remplacement du bouton par le canvas        
        $("#container_canvas").show();
        $(this).hide();
    })

    // remise a zéro du canvas au click du bouton effacer de celui-ci
    $("#effacer").click(function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    })

    // gestion du click du bouton valider du canvas (validation de la reservation)
    $("#valider").click(function(e) {        
        // nettoyage du sessionStorage de toutes infos antécédentes puis création des nouvelles infos de la résa
        if (sessionStorage.length > 0) {sessionStorage.clear()}
        var form = document.querySelector("#reservation form");
        sessionStorage.setItem("station", $("#station_infos h3").text());
        sessionStorage.setItem("adresse", $("#address").text());
        sessionStorage.setItem("nom", form.elements.nom.value);
        sessionStorage.setItem("prenom", form.elements.prenom.value);
        sessionStorage.setItem("hasResa", true);  

        // affichage des infos de résa dans la div en footer
        $("#reservation_infos").text(sessionStorage.getItem("prenom") + " " + sessionStorage.getItem("nom") + " vous avez une réservation à la station : " + sessionStorage.getItem("station"));
        $("#reservation_address").text(sessionStorage.getItem("adresse"));
        $("#reservation_infos_default").hide();
        $("#actual_reservation").show();

        // initialisation du timer qui détermine l'expiration de la résa
        // puis lancement du décompte
        timer.initTimer(20, 0);
        timer.decompte();

        // aprés validation de la réservation
        // remplacement du canvas pas le bouton reserver
        $("#container_canvas").hide();
        $("#reserver").show();
        // Hide du formulaire
        $("#reservation form").hide();
        // affichage d'un message de confirmation
        confirmation();
    });

    // annulation d'une réservation
    $("#cancel").click(function() {
        timer.initTimer(0, 0);
        timer.decompte();
    })
    
    // GESTION SIGNATURE SUR LE CANVAS--------------------------------------
    // ---------------------------------------------------------------------

    // évenements souris
    $("canvas").on("mousedown", function(e) {
        // création d'un nouveau trajet et déplacement du point de départ à la position du curseur
        ctx.beginPath();
        ctx.moveTo(e.offsetX, e.offsetY);
        // on s'apprete à faire un tracé donc passage de la propriété isDrawing à true
        ctx.isDrawing = true;
    });

    $("canvas").on("mousemove", function(e) {
        // vérification que l'on dessine
        if (ctx.isDrawing) {
            tracer(e.offsetX, e.offsetY);
        }
    });

    $("canvas").on("mouseup", function() {
        // fermeture du trajet créé
        ctx.closePath();
        // on à finis notre tracé donc passage de isDrawing à false
        ctx.isDrawing = false;
    });


    // FONCTIONS GENERALES -------------------------------------------------------
    // ---------------------------------------------------------------------------

    // fonction d'affichage d'un message de confirmation pendant 2 secondes
    // puis remise à zéro de l'encadré d'information station
    function confirmation() {
        var confirmation = document.createElement("p");
        confirmation.textContent = "Réservation validée !";
        confirmation.id = "confirmation";
        $("#reservation").append(confirmation);
        setTimeout(function() {
            $("#confirmation").remove();
            $("#reservation").hide();
            $("#station_infos h3").text("Aucune station sélectionné !");
            $("#address").text("Cliquez sur un marqueur de station pour afficher ses informations");
            $("#available_stands").text("");
            $("#available_bikes").text("");
        }, 2000);
    }   

    // fonction de tracer d'une ligne en fonction de coordonnées fournies
    function tracer(x, y) {
        ctx.lineTo(x, y);
        ctx.stroke();
    }
})