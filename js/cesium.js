// Loome 3D vaataja ilma Cesium ion kontota
// (kasutame OpenStreetMap kihte ja lihtsat ellipsoidi reljeefi)
const viewer = new Cesium.Viewer("cesiumContainer", {
    baseLayerPicker: false,
    geocoder: false,
    homeButton: true,
    sceneModePicker: true,
    navigationHelpButton: false,
    animation: false,
    timeline: false,
    fullscreenButton: false,
    terrainProvider: new Cesium.EllipsoidTerrainProvider(),
    baseLayer: new Cesium.ImageryLayer(
        new Cesium.UrlTemplateImageryProvider({
            url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            subdomains: ["a", "b", "c"],
            credit: "© OpenStreetMap contributors"
        })
    )
});

let kmlDataSource;

// Laeme KML-faili
Cesium.KmlDataSource.load("kml/map.kml", {
    camera: viewer.scene.camera,
    canvas: viewer.scene.canvas
})
    .then(function (dataSource) {
        kmlDataSource = dataSource;
        viewer.dataSources.add(dataSource);

        // Näitame kogu KML-i (kaldu vaatega, et oleks 3D efekt)
        viewer.flyTo(dataSource, {
            offset: new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-45), 0)
        });

        document.getElementById("status").textContent =
            "KML on edukalt laaditud.";
    })
    .catch(function () {
        document.getElementById("status").textContent =
            "KML laadimine ebaõnnestus.";
    });


// Näita kogu KML-i
function fitKml() {
    if (kmlDataSource) {
        viewer.flyTo(kmlDataSource, {
            offset: new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-45), 0)
        });
    }
}


// Näita minu asukohta
function findMe() {
    if (!navigator.geolocation) {
        alert("Asukohta ei saanud määrata.");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        function (position) {
            const lon = position.coords.longitude;
            const lat = position.coords.latitude;

            viewer.entities.add({
                position: Cesium.Cartesian3.fromDegrees(lon, lat),
                point: {
                    pixelSize: 12,
                    color: Cesium.Color.fromCssColorString("#2563eb"),
                    outlineColor: Cesium.Color.WHITE,
                    outlineWidth: 2
                },
                label: {
                    text: "Sinu asukoht",
                    font: "14px Arial",
                    pixelOffset: new Cesium.Cartesian2(0, -20)
                }
            });

            viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(lon, lat, 1200)
            });
        },
        function () {
            alert("Asukohta ei saanud määrata.");
        }
    );
}