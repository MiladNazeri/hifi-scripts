(function () {
    var DISTANCE = 1.5;
    var FPS = 60;

    var overlay;
    var autoplay;

    var OVERLAY_PROPERTIES = {
        name: "Web Overlay",
        maxFPS: FPS,
        locked: true,
        alpha: 1.0
    };

    var WebOverlaySpawner = function () { };
    WebOverlaySpawner.prototype = {
        preload: function (entityID) {
            
            var overlayProperties = OVERLAY_PROPERTIES;
            overlayProperties.position = Entities.getEntityProperties(entityID, 'position').position;
            overlayProperties.parentID = entityID;
            overlayProperties.dpi = JSON.parse(Entities.getEntityProperties(entityID, 'userData').userData).dpi;
            autoplay = JSON.parse(Entities.getEntityProperties(entityID, 'userData').userData).autoplay;
            overlayProperties.dimensions = JSON.parse(Entities.getEntityProperties(entityID, 'userData').userData).dimensions;
            overlayProperties.url = JSON.parse(Entities.getEntityProperties(entityID, 'userData').userData).url;
            print(overlayProperties.url);
            overlay = Overlays.addOverlay('web3d', overlayProperties);
        },
        unload: function () {
            Overlays.editOverlay(overlay, { 'url': 'https://highfidelity.com' });
            Script.setTimeout(function () {
                Overlays.deleteOverlay(overlay);
            }, 1000);
        }
    };
    return new WebOverlaySpawner();
});