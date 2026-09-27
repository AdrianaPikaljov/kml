Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6Ill0b0U5QlNZSk41M2FpTk0iLCJqdGkiOiIyMzAzZDQwZC05YmE2LTQ1ZTAtYmYwOS0wMzU4NTYwYzVlYzUiLCJpZCI6NTA0NDE0LCJzdWIiOiJhZHJpc3NzIiwiaXNzIjoiaHR0cHM6Ly9hcGkuY2VzaXVtLmNvbSIsImF1ZCI6IlVudGl0bGVkIiwiaWF0IjoxNzkwNTE2MjUzfQ.GDPXgaL8z2kgT5w4SUtRW3L9fS9yDDc5sWNAP9IOe6A'
var viewer;
var kmlDataSource;
var buildingTileset;
var kmlNahtav = true;

async function init() {
    viewer = new Cesium.Viewer('cesiumContainer', {
        terrain: Cesium.Terrain.fromWorldTerrain(),
        baseLayerPicker: false,
        sceneModePicker: false
    });

    buildingTileset = await Cesium.createOsmBuildingsAsync();
    viewer.scene.primitives.add(buildingTileset);

    kmlDataSource = await Cesium.KmlDataSource.load('kml/map.kml', {
        camera: viewer.scene.camera,
        canvas: viewer.scene.canvas
    });
    viewer.dataSources.add(kmlDataSource);
    viewer.zoomTo(kmlDataSource);

    // Home-nupp viib nüüd otse koju
    var koduEntity = kmlDataSource.entities.values.find(function (e) {
        return e.name === 'kodu';
    });
    if (koduEntity && viewer.homeButton) {
        viewer.homeButton.viewModel.command.beforeExecute.addEventListener(function (commandInfo) {
            commandInfo.cancel = true;
            viewer.flyTo(koduEntity, {
                duration: 1.5,
                offset: new Cesium.HeadingPitchRange(
                    Cesium.Math.toRadians(0),
                    Cesium.Math.toRadians(-35),
                    400
                )
            });
        });
    }
}

init();

//näita/peida ainult KML kihti
document.getElementById('toggle-btn').addEventListener('click', function () {
    if (!kmlDataSource) return;
    if (kmlNahtav) {
        viewer.dataSources.remove(kmlDataSource, false);
    } else {
        viewer.dataSources.add(kmlDataSource);
    }
    kmlNahtav = !kmlNahtav;
});

//näita/peida ainult 3D hooneid
document.getElementById('toggle-buildings-btn').addEventListener('click', function () {
    if (!buildingTileset) return;
    buildingTileset.show = !buildingTileset.show;
});
