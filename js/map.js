function initMap() {
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
                        if (this.booked) {
                            $("#available_stands").text("Il y a " + this.available_bike_stands + " place(s) disponible(s) pour déposer votre vélo");
                            $("#available_bikes").text("Il y a " + this.available_bikes + " vélo(s) disponible(s)");
                            $("#reservation form").replaceWith("<p>Vous avez actuellement une réservation en cours sur cette station</p>");
                            $("#reservation").show();
                        }
                        else {
                            $("#available_stands").text("Il y a " + this.available_bike_stands + " place(s) disponible(s) pour déposer votre vélo");
                            $("#available_bikes").text("Il y a " + this.available_bikes + " vélo(s) disponible(s)");
                            $("#reservation").show();                            
                        }
                    },
                    map: map
                });
                // ajout d'un event au clique sur les marqueurs pour afficher les infos de la station.
                marker.addListener("click", function(e) {
                    $("#station_infos h3").text(this.name);
                    $("#address").text("Adresse : " + this.address);
                    this.affichageReservation();          
                });
                markers.push(marker);
            }            
        });

        // regroupement des marqueurs de notre tableau en cluster suivant le zoom sur la map
        var markerCluster = new MarkerClusterer(map, markers, {
            imagePath: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m"
        });
    });
    
    var minutes;
    var secondes;

    $("#confirm").click(function(e) {
        e.preventDefault();
        minutes = 20;
        secondes = 0;
        var form = document.querySelector("#reservation form");
        if (sessionStorage.length > 0) {sessionStorage.clear()}
        sessionStorage.setItem("station", $("#station_infos h3").text());
        sessionStorage.setItem("adresse", $("#address").text());
        sessionStorage.setItem("nom", form.elements.nom.value);
        sessionStorage.setItem("prenom", form.elements.prenom.value);
        decompte();
        /*$("#reservation_infos").replaceWith(
            "<p>Vous avez une réservation au nom de " + sessionStorage.getItem("prenom") + " " +sessionStorage.getItem("nom") + ", à la station : " + sessionStorage.getItem("station") + "</p>" + 
            "<p>" + sessionStorage.getItem("adresse") + "</p>");*/
        $("#reservation_infos").text(sessionStorage.getItem("prenom") + " " + sessionStorage.getItem("nom") + " vous avez une réservation à la station : " + sessionStorage.getItem("station"));
        $("#reservation_address").text(sessionStorage.getItem("adresse"));
    });

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
            }
            $("#reservation_time").text("Temps restant avant expiration de votre réservation : " + minutes + " min " + secondes + "sec.");
        }, 1000);
    }
}
