// "maxLightIntensity": 22,
// "interval": 40


(function(){
    var id;
    var maxLightIntensity;
    var currentLightIntensity;
    var interval;
    var lightTimer = null;


    function getProps(entityID) {
        var properties = Entities.getEntityProperties(entityID).userData;
        var data = JSON.parse(properties);
        if (properties) {
            maxLightIntensity = data.maxLightIntensity;
            interval = data.interval;
        }
    }

    function onLightTimer(){
        currentLightIntensity = Math.abs(Math.sin(Date.now())) * maxLightIntensity;
        Entities.editEntity(id, {
            intensity: currentLightIntensity
        });
    }

    this.preload = function(entityID) {
        id = entityID;
        getProps(id);
        lightTimer = Script.setInterval(onLightTimer, interval);

    };

    this.unload = function() {
        Script.clearInterval(lightTimer);
    };

});