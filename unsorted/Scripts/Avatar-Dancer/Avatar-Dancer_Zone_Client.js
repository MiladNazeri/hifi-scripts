// Avatar-Dancer_Zone_Client.js
//
// Created by Milad Nazeri on 2018-06-19
//
// Copyright 2018 High Fidelity, Inc.
//
// Distributed under the Apache License, Version 2.0.
// See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html

(function() {

    // Dependencies
    // /////////////////////////////////////////////////////////////////////////
    Script.require("../Utilities/Polyfills.js")();

    var Helper = Script.require("../Utilities/Helper.js?" + Date.now()),
        checkIfInNonAligned = Helper.Maths.checkIfInNonAligned,
        makeOriginMinMax = Helper.Maths.makeOriginMinMax,
        vec = Helper.Maths.vec;

    // Log Setup
    // /////////////////////////////////////////////////////////////////////////
    var LOG_CONFIG = {},
        LOG_ENTER = Helper.Debug.LOG_ENTER,
        LOG_UPDATE = Helper.Debug.LOG_UPDATE,
        LOG_ERROR = Helper.Debug.LOG_ERROR,
        LOG_VALUE = Helper.Debug.LOG_VALUE,
        LOG_ARCHIVE = Helper.Debug.LOG_ARCHIVE;

    LOG_CONFIG[LOG_ENTER] = true;
    LOG_CONFIG[LOG_UPDATE] = true;
    LOG_CONFIG[LOG_ERROR] = true;
    LOG_CONFIG[LOG_VALUE] = true;
    LOG_CONFIG[LOG_ARCHIVE] = false;
    var log = Helper.Debug.log(LOG_CONFIG);

    // Init
    // /////////////////////////////////////////////////////////////////////////
    var entityID,
        name,
        self;

    // Consts
    // /////////////////////////////////////////////////////////////////////////
    var HEARTBEAT_INTERVAL = 17,
        ABOVE_VECTOR = vec(0,1,0);

    // Collections
    // /////////////////////////////////////////////////////////////////////////
    var currentProperties = {},
        userData = {},
        userdataProperties = {},
        originMinMax = {},
        position = {},
        rotation = {},
        dimensions = {},
        jointArray = [
            "Hip",
            "RightFoot",
            "LeftHand",
            "RightHand",
            "Head"
        ];

    // Constructors
    // /////////////////////////////////////////////////////////////////////////
    function PositionAndJoint(name, position, rotation, jointIndex) {
        this.name = name;
        this.position = position,
        this.jointIndex = jointIndex;
        this.rotation = rotation;

    }

    // Entity Definition
    // /////////////////////////////////////////////////////////////////////////
    function AvatarDance_Zone_Client() {
        self = this;
    }

    AvatarDance_Zone_Client.prototype = {
        // Begin Entity Methods
        remotelyCallable: [
            "receiveHeartBeat",
            "requestTurnOff",
            "turnOn"
        ],
        preload: function (id) {
            entityID = id;
            currentProperties = Entities.getEntityProperties(entityID, ["name", "userData", "position", "rotation", "dimensions"]);
            name = currentProperties.name;
            position = currentProperties.position;
            rotation = currentProperties.rotation;
            dimensions = currentProperties.dimensions;
            originMinMax = makeOriginMinMax(dimensions);

            userData = currentProperties.userData;
            try {
                userdataProperties = JSON.parse(userData);
            } catch (e) {
                log(LOG_ERROR, "ERROR READING USERDATA", e);
            }
        },
        enterEntity: function () {
            var positionAndJointArray = this.makeJointAndPositionArray();
            log(LOG_ENTER, name + " enterEntity");
            Entities.callEntityServerMethod(entityID, "turnOn", [
                MyAvatar.sessionUUID,
                JSON.stringify(positionAndJointArray)
            ]);
            self.startHeartBeats();
        },
        leaveEntity: function () {
            log(LOG_ENTER, name + " leaveEntity");
            Entities.callEntityServerMethod(entityID, "requestTurnOff", [MyAvatar.sessionUUID]);
        },
        unload: function () {
        },
        // Begin Utility Methods
        makeJointAndPositionArray: function () {
            var positionAndJointArray = [];

            jointArray.forEach(function(joint) {
                var positionToSend = MyAvatar.getJointPosition(joint);
                var rotationToSend = MyAvatar.getJointRotation(joint);
                var jointIndex = MyAvatar.getJointIndex(joint);
                positionAndJointArray.push(
                    new PositionAndJoint(joint, positionToSend, rotationToSend, jointIndex)
                );
            });

            return positionAndJointArray;
        },
        startHeartBeats: function () {
            log(LOG_ENTER, "starting heartBeat timer");
            if (checkIfInNonAligned(MyAvatar.position, position, rotation, originMinMax)) {     
                log(LOG_ENTER, "Inside area");
                var positionAndJointArray = self.makeJointAndPositionArray();

                Entities.callEntityServerMethod(entityID, "receiveHeartBeat", [MyAvatar.sessionUUID,
                    JSON.stringify(positionAndJointArray)]);
                Script.setTimeout(self.startHeartBeats, HEARTBEAT_INTERVAL);
            }
        }

    };

    return new AvatarDance_Zone_Client();
});
