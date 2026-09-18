const map = new ol.Map({
  target: "map",

  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    })
  ],

  view: new ol.View({
    center: ol.proj.fromLonLat([24.694, 59.4122]),
    zoom: 15
  })
});

const kmlSource = new ol.source.Vector({
  url: "kml/map.kml",
  format: new ol.format.KML({
    extractStyles: true,
    showPointNames: true
  })
});

const kmlLayer = new ol.layer.Vector({
  source: kmlSource
});

map.addLayer(kmlLayer);


// Näitab kogu KML-i
function fitKml() {
  const extent = kmlSource.getExtent();

  if (!ol.extent.isEmpty(extent)) {
    map.getView().fit(extent, {
      padding: [30, 30, 30, 30],
      maxZoom: 17
    });
  }
}

document.getElementById("fitBtn").onclick = fitKml;


// Peidab või näitab KML-i
document.getElementById("toggleBtn").onclick = function() {
  kmlLayer.setVisible(!kmlLayer.getVisible());
};


// KML laadimise teade
kmlSource.on("featuresloadend", function() {
  document.getElementById("status").textContent =
      "KML on edukalt laaditud.";

  fitKml();
});

kmlSource.on("featuresloaderror", function() {
  document.getElementById("status").textContent =
      "KML laadimine ebaõnnestus.";
});


// Objekti nime näitamine klõpsamisel
map.on("singleclick", function(event) {

  const popup = document.getElementById("popup");
  let name = "";

  map.forEachFeatureAtPixel(event.pixel, function(feature) {
    name = feature.get("name");
    return true;
  });

  if (name) {
    popup.innerHTML = "<b>" + name + "</b>";
    popup.style.display = "block";
    popup.style.position = "absolute";
    popup.style.left = event.pixel[0] + 15 + "px";
    popup.style.top = event.pixel[1] + 15 + "px";
  } else {
    popup.style.display = "none";
  }
});
