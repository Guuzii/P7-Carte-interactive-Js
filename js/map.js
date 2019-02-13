
function initMap() {
    var lyon = {lat: 45.763, lng: 4.837};

    var map = new google.maps.Map(
        document.querySelector("#map"), 
        {
            center: lyon,
            zoom: 13
        }
    );

    var marker = new google.maps.Marker({position: lyon, map: map});
}

console.log($("footer"));

