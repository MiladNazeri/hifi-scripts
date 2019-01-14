(function () {

    console.log("starting BathroomServer with messages");

    var fingerPaintChannel = "fingerPaintChannel";

    var fingerPaintServerChannel = "fingerPaintServerChannel";

    
    function BathroomServer() {

    }

    BathroomServer.prototype = {
        remotelyCallable: [
            "addPaint",
            "editPaint",
            "deletePaint",
            "deleteClosest"
        ],
        addPaint: function (props) {
            console.log("addPaint Called");
            console.log("props sending:", props);
            var entityID = Entities.addEntity(props);
            Messages.sendMessage(fingerPaintChannel, JSON.stringify({
                type: "ENTITYID",
                value: entityID
            }));
        },
        editPaint: function (id, props) {
            console.log("edit Paint Called");
            Entities.editEntity(id, props);
        },
        deletePaint: function (id) {
            console.log("delete Paint Called");
            Entities.deleteEntity(id);
        },
        deleteClosest: function (position, ERASE_SEARCH_RADIUS) {
            console.log("deleteClosest Called");
            var entities,
                entitiesLength,
                properties,
                i,
                pointsLength,
                j,
                distance,
                found = false,
                foundID,
                foundDistance = ERASE_SEARCH_RADIUS;

            // Find entities with bounding box within search radius.
            entities = Entities.findEntities(position, ERASE_SEARCH_RADIUS);

            // Fine polyline entity with closest point within search radius.
            for (i = 0, entitiesLength = entities.length; i < entitiesLength; i += 1) {
                properties = Entities.getEntityProperties(entities[i], ["type", "position", "linePoints"]);
                if (properties.type === "PolyLine") {
                    var basePosition = properties.position;
                    Messages.sendMessage(fingerPaintChannel, JSON.stringify({
                        type: "BASEPOSITION",
                        value: basePosition
                    }));
                    for (j = 0, pointsLength = properties.linePoints.length; j < pointsLength; j += 1) {
                        distance = Vec3.distance(position, Vec3.sum(basePosition, properties.linePoints[j]));
                        if (distance <= foundDistance) {
                            found = true;
                            foundID = entities[i];
                            foundDistance = distance;
                        }
                    }
                }
            }

            // Delete found entity.
            if (found) {
                Entities.deleteEntity(foundID);
            }
        }
    };
    
    var bathroomServer = new BathroomServer();

    Messages.subscribe(fingerPaintServerChannel);
    Messages.messageReceived.connect(onMessage);

    function onMessage(channel, message, sender) {
        if (channel === fingerPaintServerChannel) {
            // console.log("message sent to FPS message", channel, message, sender);
            var varNewValue;
            var id;
            message = JSON.parse(message);
            if (message.type === "addPaint") {
                varNewValue = message.props;
                bathroomServer.addPaint(varNewValue);
            }
            if (message.type === "editPaint") {
                varNewValue = message.props;
                id = message.id;
                bathroomServer.editPaint(id, varNewValue);
            }
            if (message.type === "deletePaint") {
                id = message.entityID;
                bathroomServer.deletePaint(id, varNewValue);
            }
            if (message.type === "deleteClosest") {
                var position = message.position;
                var ERASE_SEARCH_RADIUS = message.ERASE_SEARCH_RADIUS;
                bathroomServer.deleteClosest(position, ERASE_SEARCH_RADIUS);
            }

        }

    }

    return bathroomServer; 

});