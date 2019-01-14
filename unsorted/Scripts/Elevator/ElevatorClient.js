(function() {

    var _entityId;
    var _foundId;
    var currentProps;
    var _userdataProperties;
    var wantDebug = false;

    function searchForElevator(elevatorName, position, searchRadius) {

        Entities.findEntities(position, searchRadius).forEach(function(entityID) {
            var properties = Entities.getEntityProperties(entityID);
            if (properties.name === elevatorName) {
                print("found elevator!");
                _foundId = entityID;
            }
        });
    }
    /*
        userData = {
            {
                "grabbableKey": {
                    "grabbable": true
            }
    }

        }
    */

    function ElevatorClient() {

    }

    ElevatorClient.prototype = {
        preload: function(id) {
            _entityId = id;
            currentProps = Entities.getEntityProperties(id);
            var userData = currentProps.userData;
            _userdataProperties = JSON.parse(userData);
            searchForElevator(_userdataProperties.elevatorName, currentProps.position, _userdataProperties.searchRadius);
        },
        enterEntity: function() {
            print("entering Entity");
            Entities.callEntityServerMethod(_foundId, 'moveElevator');
        },
        leaveEntity: function() {
            print("leaving Entity");
            Entities.callEntityServerMethod(_foundId, 'moveElevator');
        }
    }

    return new ElevatorClient();
})

/* globals Script Entities Vec3 */