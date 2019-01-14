(function () {

    var _foundId;
    var currentProps;
    var _userdataProperties;
    var wantDebug = false;

    function searchForLight(lightName, position, searchRadius) {
        Entities.findEntities(position, searchRadius).forEach(function (entityID) {
            var properties = Entities.getEntityProperties(entityID);

            if (properties.name === lightName) {
                _foundId = entityID;
                print("_foundId", _foundId);
            }
        });
    }

    /*
        userData = {
            lightName: "Light-Test",
            searchRadius: 50,
        }
    */

    function Zone_On_Off_Client() {

    }


    Zone_On_Off_Client.prototype = {
        preload: function (id) {
            currentProps = Entities.getEntityProperties(id);
            var userData = currentProps.userData;
            _userdataProperties = JSON.parse(userData);
            searchForLight(_userdataProperties.lightName, currentProps.position, _userdataProperties.searchRadius);
        },
        enterEntity: function () {
            // print("### Caling turnOnLight");
            Entities.callEntityServerMethod(_foundId, 'turnOnLight');
        },
        leaveEntity: function () {
            // print("### Caling turnOffLight");
            Entities.callEntityServerMethod(_foundId, 'turnOffLight');
        }
    }
    return new Zone_On_Off_Client();
})