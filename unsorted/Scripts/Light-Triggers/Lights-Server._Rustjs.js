(function () {
    var _entityId;
    var maxLightIntensity;
    var minLightIntensity = 0;
    var lightOnTime;
    var lightStayOnAfterTime;
    var lightOffTime;
    var _userdataProperties;
    var lightOnTimer = null;
    var lightOffTimer = null;
    var currentLightIntensity;
    var currentProps;
    var intensityOnInterval;
    var intensityOffInterval;
    var lightName;
    var searchRadius = 20;
    var searchPosition;
    var _foundEntityID;
    var lightOnInterval;
    var lightOffInterval;
    // print("### Caling turnOffLight Server Script");

    function lightFadeOnHandler() {
        if (lightOffTimer) {
            Script.clearInterval(lightOffTimer);
            lightOffTimer = null;
        }
        if (currentLightIntensity <= maxLightIntensity) {
            // print("changing props");
            currentLightIntensity = currentLightIntensity += intensityOnInterval;
            // print("currentLightIntensity", currentLightIntensity);            
            var props = {
                intensity: currentLightIntensity
            };
            Entities.editEntity(_entityId, props);
        }
        if (currentLightIntensity >= maxLightIntensity) {
            // print("stopping");
            currentLightIntensity = maxLightIntensity;
            Script.clearInterval(lightOnTimer);
            lightOnTimer = null;
        }
    }

    function lightFadeOffHandler() {
        if (lightOnTimer) {
            Script.clearInterval(lightOnTimer);
            lightOnTimer = null;
        }
        // print("calling lightFadOffHandler");
        if (currentLightIntensity >= minLightIntensity) {
            currentLightIntensity = currentLightIntensity -= intensityOnInterval;
            // print("changing props");
            // print("currentLightIntensity", currentLightIntensity);
            var props = {
                intensity: currentLightIntensity < minLightIntensity ? minLightIntensity : currentLightIntensity
            };
            Entities.editEntity(_entityId, props);
        }
        if (currentLightIntensity <= minLightIntensity) {
            // print("stopping");
            currentLightIntensity = minLightIntensity;
            var props = {
                intensity: currentLightIntensity
            };
            Entities.editEntity(_entityId, props);
            Script.clearInterval(lightOffTimer);
            lightOffTimer = null;
        }
    }

    /*
        userData = {
            maxLightIntensity: 1000,
            lightOnTime: 2000,
            lightStayOnAfterTime: 2000,
            lightOffTime: 2000,
        }
    */

    function Light_On_Off_Server() {

    }

    Light_On_Off_Server.prototype = {
        remotelyCallable: [
            'turnOnLight',
            'turnOffLight',
            'setLightEntityId'
        ],
        preload: function (entityID) {
            _entityId = entityID;
            currentProps = Entities.getEntityProperties(entityID);
            var userData = currentProps.userData;
            _userdataProperties = JSON.parse(userData);
            currentLightIntensity = currentProps.intensity;
            maxLightIntensity = _userdataProperties.maxLightIntensity;
            minLightIntensity = _userdataProperties.minLightIntensity || 0;
            lightOnTime = _userdataProperties.lightOnTime;
            lightStayOnAfterTime = _userdataProperties.lightStayOnAfterTime;
            lightOffTime = _userdataProperties.lightOffTime;
            lightName = _userdataProperties.lightName;
            intensityOnInterval =  maxLightIntensity / lightOnTime;
            intensityOffInterval = maxLightIntensity / lightOffTime;
            lightOnInterval = intensityOnInterval / lightOnTime;
            lightOffInterval = intensityOffInterval / lightOffTime;
        },
        turnOnLight: function () {
            // print("#### Calling turn on light:");
            currentProps = Entities.getEntityProperties(_entityId);
            // print("#### currentProps:", JSON.stringify(currentProps));           
            currentLightIntensity = currentProps.intensity;
            // print("$$$ currentLightIntensity in turnOnLIght", currentLightIntensity);
            lightOnTimer = Script.setInterval(lightFadeOnHandler, lightOnInterval);
        },
        turnOffLight: function () {
            // print("#### Calling turn Off light:");
            currentProps = Entities.getEntityProperties(_entityId);
            currentLightIntensity = currentProps.intensity;
            // print("$$$ currentLightIntensity in turnOffLIght", currentLightIntensity);
           
            lightOffTimer = Script.setInterval(lightFadeOffHandler, lightOffInterval);
        }

    }

    function onScriptEnding() {
        if (lightOnTimer !== null) {
            Script.clearInterval(lightOnTimer);
        }

        if (lightOffTimer !== null) {
            Script.clearInterval(lightOffTimer);
        }

    }

    Script.scriptEnding.connect(onScriptEnding);

    return new Light_On_Off_Server();

});