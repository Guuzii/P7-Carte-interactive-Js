function initMap() {
    sessionStorage.clear();

    // initialisation de la map
    var map = new google.maps.Map(document.querySelector("#map"), {            
        center: {lat: 45.763, lng: 4.831},
        zoom: 12,
    });

    // création d'un tableau qui contiendra nos données de stations
    var markers = [];
    
    // récupération des données stations via l'api JCDecaux
    ajaxGet("https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=a21f007be77c403b31239c331c11d5896e759fc0", function(reponse) {
        var stations = JSON.parse(reponse);
        
        // pour chaque station, création d'un marqueur avec toutes les infos stations 
        // puis ajout de celui-ci à notre tableau de marqueurs
        stations.forEach(function(station) {            
            // vérification du status de la station
            if (station.status == "OPEN") {
                var marker = new google.maps.Marker({
                    position: station.position,
                    name: station.name,
                    address: station.address,
                    banking: station.banking,
                    bike_stands: station.bike_stands,
                    available_bike_stands: station.available_bike_stands,
                    available_bikes: station.available_bikes,
                    booked: false,
                    // methode pour vérifier si il y a une réservation sur la station
                    // puis rendre la résa disponible si ce n'est pas le cas                   
                    affichageReservation: function() {
                        if (sessionStorage.getItem("hasResa")) {
                            $("#available_stands").text("Il y a " + this.available_bike_stands + " place(s) disponible(s) pour déposer votre vélo");
                            if (sessionStorage.getItem("station") == this.name) {
                                $("#available_bikes").text("Il y a " + (this.available_bikes - 1) + " vélo(s) disponible(s)");
                            }
                            else {
                                $("#available_bikes").text("Il y a " + this.available_bikes + " vélo(s) disponible(s)");    
                            }
                            $("#reservation").show();
                            $("#reservation form").hide();
                            $("#reservation p").text("Vous avez déja une réservation en cours");
                            $("#reservation p").show();
                        }
                        else if (this.available_bikes < 1) {
                            $("#available_stands").text("Il y a " + this.available_bike_stands + " place(s) disponible(s) pour déposer votre vélo");
                            $("#available_bikes").text("Il y a " + this.available_bikes + " vélo(s) disponible(s)");
                            $("#reservation").show();
                            $("#reservation form").hide();
                            $("#reservation p").text("Il n'y a plus de vélos disponible à la réservation sur cette station");
                            $("#reservation p").show();
                        }
                        else {
                            $("#available_stands").text("Il y a " + this.available_bike_stands + " place(s) disponible(s) pour déposer votre vélo");
                            $("#available_bikes").text("Il y a " + this.available_bikes + " vélo(s) disponible(s)");
                            $("#reservation").show();
                            $("#reservation form").show();
                            $("#reservation p").hide();                           
                        }
                    },
                    map: map
                });
                // ajout d'un event au clique sur les marqueurs pour afficher les infos de la station.
                marker.addListener("click", function(e) {
                    $("#station_infos h3").text(this.name);
                    $("#address").text("Adresse : " + this.address);
                    this.affichageReservation(); 
                    console.log(this.available_bikes);         
                });
                markers.push(marker);
            }            
        });

        // regroupement des marqueurs de notre tableau en cluster suivant le zoom sur la map
        var markerCluster = new MarkerClusterer(map, markers, {
            imagePath: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m"
        });
    });
    
    // RESERVATION
    var minutes;
    var secondes;

    // ajout d'un event au clique du bouton réserver
    $("#confirm").click(function(e) {
        e.preventDefault();
        // initialisation des variable minutes et secondes qui détermine l'expiration de la résa
        minutes = 20;
        secondes = 0;
        var form = document.querySelector("#reservation form");
        // nettoyage du sessionStorage de toutes infos antécédentes puis création des nouvelles infos de la résa
        if (sessionStorage.length > 0) {sessionStorage.clear()}
        sessionStorage.setItem("station", $("#station_infos h3").text());
        sessionStorage.setItem("adresse", $("#address").text());
        sessionStorage.setItem("nom", form.elements.nom.value);
        sessionStorage.setItem("prenom", form.elements.prenom.value);
        sessionStorage.setItem("hasResa", true);        
        // affichage des infos de résa
        $("#reservation_infos").text(sessionStorage.getItem("prenom") + " " + sessionStorage.getItem("nom") + " vous avez une réservation à la station : " + sessionStorage.getItem("station"));
        $("#reservation_address").text(sessionStorage.getItem("adresse"));
        $("#reservation_infos_default").hide();
        $("#actual_reservation").show();
        // lancement du décompte d'expiration résa
        decompte();
        // Hide du formulaire aprés réservation
        $("#reservation form").hide();
        confirmation();
    });

    // function de décompte + affichage de celui-ci
    function decompte() {
        var interval = setInterval(function () {
            if(secondes == 0 && minutes > 0) {
                minutes --;
                secondes = 59;
            } 
            else if (secondes > 0) {
                secondes --;
            }
            else {
                clearInterval(interval);
                $("#reservation_infos_default").show();
                $("#actual_reservation").hide();
                sessionStorage.clear();
            }
            $("#reservation_time").text("Temps restant avant expiration de votre réservation : " + minutes + " min " + secondes + "sec.");
        }, 1000);
    }

    // Fonction d'affichage d'un message de confirmation à la réservation
    function confirmation() {
        var confirmation = document.createElement("p");
        confirmation.textContent = "Réservation validée !";
        confirmation.id = "confirmation";
        $("#reservation").append(confirmation);
        setTimeout(function() {
            $("#confirmation").remove();
        }, 2000);
    }

}
