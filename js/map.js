/*
    CREATION DE LA MAP ET DES MARQUEURS DE STATIONS
    (utilisation de l'api googlemaps)
*/

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
                    // methode pour afficher les infos stations 
                    // puis vérifier si il y a une réservation sur la station
                    // et la rendre possible si ce n'est pas le cas                   
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
                            $("#cancel").show();
                        }
                        else if (this.available_bikes < 1) {
                            $("#available_stands").text("Il y a " + this.available_bike_stands + " place(s) disponible(s) pour déposer votre vélo");
                            $("#available_bikes").text("Il y a " + this.available_bikes + " vélo(s) disponible(s)");
                            $("#reservation").show();
                            $("#reservation form").hide();
                            $("#reservation p").text("Il n'y a plus de vélos disponible à la réservation sur cette station");
                            $("#reservation p").show();
                            $("#cancel").hide();
                        }
                        else {
                            $("#available_stands").text("Il y a " + this.available_bike_stands + " place(s) disponible(s) pour déposer votre vélo");
                            $("#available_bikes").text("Il y a " + this.available_bikes + " vélo(s) disponible(s)");
                            $("#reservation").show();
                            $("#reservation form").show();
                            $("#reservation p").hide();
                            $("#cancel").hide();                          
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
        // utilisation d'un plug-in de l'api google maps
        var markerCluster = new MarkerClusterer(map, markers, {
            imagePath: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m"
        });
    });

}
