(function() {

    var _entityID;
    var _this;

    var log = Script.require('https://hifi-content.s3.amazonaws.com/milad/ROLC/d/ROLC_High-Fidelity/02_Organize/O_Projects/Repos/hifi-content/developerTools/sharedLibraries/easyLog/easyLog.js')
    

    function Entity() {

    }

    Entity.prototype = {

        // REQUIRED FUNCTIONS
        preload: function(entityID) {
            // runs when this script is refreshed or a
            // client connects to a domain where this entity is present
            _entityID = entityID;
            _this = this;
        },

        unload: function () {
            // triggered when avatar leaves the domain where entity is present
            // clear any intervals
            // clear any listeners
            // reset anything else that needs to be
        },

        // EVENT LISTENERS FOR THE ENTITY

        /* 
            Entity Event Listener Notes: 
                For mouse/trigger click on an entity to do an action
                    Use: startNearTrigger + startFarTrigger + clickReleaseOnEntity
        */

        // MOUSECLICK METHODS - not triggered by controller
        // params are: entityID, event PointerEvent (https://docs.highfidelity.com/api-reference/globals#PointerEvent)
        // https://docs.highfidelity.com/api-reference/namespaces/entities#.clickDownOnEntity
        clickReleaseOnEntity: function (entityID, pointerEvent) {
            log("#001: clickReleaseOnEntity");
            if (pointerEvent.isPrimaryButton) {} // will only work on left mouse click release event (see PointerEvent)
        },
        clickDownOnEntity: function (entityID, pointerEvent) {
            log("#002: clickDownOnEntity");

        },
        holdingClickOnEntity: function (entityID, pointerEvent) {
            log("#003: holdingClickOnEntity");
        },
        
        mouseMoveOnEntity: function (entityID, pointerEvent) {
            log("#004: mouseMoveOnEntity");
        },
        mousePressOnEntity: function (entityID, event) {
            log("#005: mousePressOnEntity")
        },
        mouseReleaseOnEntity: function (entityID, event) {
            log("#006: mouseReleaseOnEntity")
        },
        mouseDoublePressOffEntity: function (pointerEvent) {
            log("#007: mouseDoublePressOffEntity")
        },

        hoverEnterEntity: function (entityID, pointerEvent) {
            log("#008: hoverEnterEntity")
        },
        hoverLeaveEntity: function (entityID, pointerEvent) {
            log("#009: hoverLeaveEntity")
        },
        hoverOverEntity: function (entityID, pointerEvent) {
            log("#010: hoverOverEntity")
        },

        // COLLISION METHODS
        // Avatar collision with this entity
        leaveEntity: function (userID) {
            log("#011: leaveEntity")
        },
        enterEntity: function (userID) {
            log("#012: enterEntity")

        }, // https://docs.highfidelity.com/api-reference/namespaces/entities#.enterEntity

        // Entity (idB) collision with this entity (idA)
        // Collision properties https://docs.highfidelity.com/api-reference/globals#Collision
        collisionWithEntity: function (idA, idB, collision) {
            log("#013: collisionWithEntity")
            log("idA", idA)
            log("idB", idB)
            log("collision", collision)

        }, // https://docs.highfidelity.com/api-reference/namespaces/entities#.collisionWithEntity

        // DELETE
        // triggered when entity is deleted
        deletingEntity: function (entityID) {},

        // CONTROLLER METHODS
        // params are: entityID, string "<"left" || "right">,<MyAvatar.UUID>" ex "left,userID"
        // https://docs.highfidelity.com/api-reference/namespaces/controller

        // Far Trigger Entity methods
        startFarTrigger: function (entityID, handUserID) {
            log("#014: startFarTrigger")
        },
        continueFarTrigger: function (entityID, handUserID) {
            log("#015: continueFarTrigger");
        },
        stopFarTrigger: function (entityID, handUserID) {
            log("#016: stopFarTrigger")
        },

        // Near trigger Entity methods
        startNearTrigger: function (entityID, handUserID) {
            log("#017: startNearTrigger")

        },
        continueNearTrigger: function (entityID, handUserID) {
            log("#018: continueNearTrigger")

        },
        stopNearTrigger: function (entityID, handUserID) {
            log("#019: stopNearTrigger")
        },

        // distanceGrab
        startDistanceGrab: function (entityID, handUserID) {
            log("#020: startDistanceGrab")
        },
        continueDistanceGrab: function (entityID, handUserID) {
            log("#021: continueDistanceGrab")
        },

        // distanceGrab
        startNearGrab: function (entityID, handUserID) {
            log("#022: startNearGrab")
        },
        continueNearGrab: function (entityID, handUserID) {
            log("#023: continueNearGrab")

        },

        // releases the trigger
        releaseGrab: function (entityID, handUserID) {
            log("#024: releaseGrab")

        },

        // Equip
        startEquip: function (entityID, handUserID) {
            log("#025: startEquip")

        },
        continueEquip: function (entityID, handUserID) {
            log("#026: continueEquip")

        },
        releaseEquip: function (entityID, handUserID) {
            log("#027: releaseEquip")
        }
    }

    return new Entity();

});