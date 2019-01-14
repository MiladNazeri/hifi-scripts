(function () {

    print("### loadig client script");
    var _entityId;

    function searchForLight(lightName, position, searchRadius) {
        print("lightName serching for:", lightName);
        print("lightName position for:", position);

        Entities.findEntities(position, searchRadius).forEach(function (entityID) {
            print("entityId", entityID);
            var properties = Entities.getEntityProperties(entityID);
            print(JSON.stringify(properties));
            print("props name", properties.name);
            print("lightName", lightName);
            
            if (properties.name === lightName) {
                return entityID;
            }
        });
    }

    function Light_On_Off_Client() {

    }

    Light_On_Off_Client.prototype = {
        remotelyCallable: [
            'getLightEntity'
        ],
        getLightEntity: function(lightName, position, searchRadius){
            print("calling getLightEntity");
            Entities.callEntityServerMethod(_entityId, 'setLightEntityId', [searchForLight(lightName, position, searchRadius)]);
        },
        preload: function (id) {
            _entityId = id;
            print("### entity ID", id);

        },
        enterEntity: function () {
            print("### Caling turnOnLight");
            Entities.callEntityServerMethod(_entityId, 'turnOnLight');
        },
        leaveEntity: function () {
            print("### Caling turnOffLight");
            Entities.callEntityServerMethod(_entityId, 'turnOffLight');
        }
    }
    return new Light_On_Off_Client();
})