// Loome kaardi
const map = L.map("map").setView([59.4122, 24.694], 15);

// Lisame OpenStreetMap kaardi
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);


// Laeme KML-faili
const kmlLayer = omnivore.kml("kml/map.kml")
    .on("ready", function() {

      // Näitame kogu KML-i
      map.fitBounds(kmlLayer.getBounds());

      document.getElementById("status").textContent =
          "KML on edukalt laaditud.";
    })
    .on("error", function() {

      document.getElementById("status").textContent =
          "KML laadimine ebaõnnestus.";
    })
    .addTo(map);


// Näita kogu KML-i
function fitKml() {

  if (kmlLayer.getBounds().isValid()) {
    map.fitBounds(kmlLayer.getBounds());
  }
}


// Näita minu asukohta
function findMe() {
  map.locate({
    setView: true,
    maxZoom: 17
  });
}


// Kui asukoht leiti
map.on("locationfound", function(event) {

  L.marker(event.latlng)
      .addTo(map)
      .bindPopup("Sinu asukoht")
      .openPopup();
});


// Kui asukohta ei leitud
map.on("locationerror", function() {

  alert("Asukohta ei saanud määrata.");
});
