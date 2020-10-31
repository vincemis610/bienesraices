let map;
let map2;
let labelIndex = 0;
let markers = [];
let latitude = document.getElementById('lat');
let longitude = document.getElementById('lng');

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 23.177344219626473, lng: -101.95622051939245 },
        zoom: 4
    });

    google.maps.event.addListener(map, "click", (event) => {
        addMarker(event.latLng, map);
        console.log('Lat',event.latLng.lat());
        console.log('Lng',event.latLng.lng());
        latitude.innerText = event.latLng.lat();
        longitude.innerText = event.latLng.lng()
        document.getElementById('latlng').style.display = 'inline';
    });
}

// Adds a marker to the map.
function addMarker(location) {
    clearMarkers();
    const marker = new google.maps.Marker({
      position: location,
      map: map,
    });
    markers.push(marker);
}

setMapOnAll = (map) => {
    for (let i = 0; i < markers.length; i++) { 
        markers[i].setMap(map);
    } 
} 

/* LIMPIAR MARCADOR */
clearMarkers = () => {
    setMapOnAll(null);
}