// Avatar Dancer
//
// Created by Milad Nazeri on 2018-06-19
//
// Copyright 2018 High Fidelity, Inc.
//
// Distributed under the Apache License, Version 2.0.
// See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html

(function () {

    // Dependencies
    // /////////////////////////////////////////////////////////////////////////
    Script.require("../Utilities/Polyfills.js")();
    var Helper = Script.require("../Utilities/Helper.js?" + Date.now());

    var fireEvery = Helper.Functional.fireEvery(),
        makeColor = Helper.Color.makeColor,
        vec = Helper.Maths.vec;
        // smoothAmount = 10,
        // smoothing = Helper.Maths.smoothing,
        // smoothRange = Helper.Maths.smoothRange(MyAvatar.position, smoothAmount, smoothing);

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

    // Consts
    // /////////////////////////////////////////////////////////////////////////
    var IN_FRONT_OF = 0.25,
        LOCAL_OFFSET = vec(0, 0, -2);

    // Collections
    // /////////////////////////////////////////////////////////////////////////
    var allEnts = [],
        entities = {},
        jointArray = [
            "LeftFoot",
            "RightFoot",
            "LeftHand",
            "RightHand",
            "Head"
        ],
        jointObject = {},
        particles = [],
        particleBaseProps = {
            type: "ParticleEffect",
            isEmitting: true,
            lifespan: 5.0,
            maxParticles: 6717,
            textures: "http://hifi-content.s3.amazonaws.com/alan/dev/Particles/Bokeh-Particle.png",
            emitRate: 400,
            emitSpeed: 0.1,
            speedSpread: 0,
            emitDimensions: {
                x: 0.01,
                y: 0.01,
                z: 0.01
            },
            emitOrientation: {
                x: 0,
                y: 0,
                z: 0
            },
            emitterShouldTrail: true,
            particleRadius: 0,
            radiusSpread: 0.05,
            radiusStart: 0.05,
            radiusFinish: 0.01,
            color: {
                red: 200,
                blue: 0,
                green: 255
            },
            colorSpread: {
                red: 0,
                blue: 0,
                green: 0
            },
            colorStart: {
                red: 255,
                blue: 33,
                green: 33
            },
            colorFinish: {
                red: 239,
                blue: 255,
                green: 13
            },
            emitAcceleration: {
                x: 0.01,
                y: 0.01,
                z: 0.01
            },
            accelerationSpread: {
                x: 0.01,
                y: 0.01,
                z: 0.01
            },
            alpha: 0.6000000238418579,
            alphaSpread: 0,
            alphaStart: 0.09000000357627869,
            alphaFinish: 0,
            polarStart: 0,
            polarFinish: 1.02974,
            azimuthStart: -180.00000500895632,
            azimuthFinish: 180.00000500895632
        },
        particleVariation1 = Object.assign(particleBaseProps, {
            lifespan: 1.0,
            radiusSpread: 0.01,
            radiusStart: 0.01,
            radiusFinish: 0.01
        });

    // Constructors
    // /////////////////////////////////////////////////////////////////////////
    function EntityObject(id, position, rotation) {
        this.id = id;
        this.position = position;
        this.rotation = rotation;
    }

    // Procedural
    // /////////////////////////////////////////////////////////////////////////

    // grab individual joint position and orientation
    function grabJointPositionAndRotation(name) {
        var poseObject = {
            position: null,
            rotation: null
        };

        poseObject.position = MyAvatar.getJointPosition(name);
        poseObject.rotation = MyAvatar.getJointRotation(name);
        return poseObject;
    }

    function getAllJointPose() {
        for (var name in jointObject) {
            jointObject[name] = grabJointPositionAndRotation(name);
        }
    }

    function updateAllEntityPositionAndRotation() {
        getAllJointPose();
        for (var name in entities) {
            updateEntityPositionAndRotation(name);
        }
    }

    function updateEntityPositionAndRotation(joint) {
        var pose = jointObject[joint],
            localOffset = LOCAL_OFFSET,
            worldOffset = VEC3.multiplyQbyV(MyAvatar.orientation, localOffset),
            entityPropertyUpdate = {};

        entities[joint].position = VEC3.sum(
            pose.position,
            worldOffset
        );
        entities[joint].rotation = pose.rotation;

        entityPropertyUpdate.position = entities[joint].position;
        entityPropertyUpdate.rotation = entities[joint].rotation;

        if (fireEvery(6)) {
            Entities.editEntity(entities[joint].id, entityPropertyUpdate);
        };
    }

    function createJointBoxes() {
        jointArray.forEach(function (joint) {
            var name,
                entID,
                boxPosition,
                boxRotation,
                color,
                stringified,
                userData = {},
                BOX_WIDTH = 0.08,
                BOX_HEIGHT = 0.08,
                BOX_DEPTH = 0.08,
                localOffset = LOCAL_OFFSET,
                worldOffset = VEC3.multiplyQbyV(jointObject[joint].rotation, localOffset);

            boxPosition = VEC3.sum(
                jointObject[joint].position,
                worldOffset
            );
            boxRotation = jointObject[joint].rotation;

            userData.grabbableKey = { grabbable: false };
            stringified = JSON.stringify(userData);
            name = joint;
            entID = createJointBoxEntity(
                name,
                boxPosition,
                boxRotation,
                vec(BOX_WIDTH, BOX_HEIGHT, BOX_DEPTH),
                color,
                stringified
            );
            entities[joint] = new EntityObject(entID, boxPosition, boxRotation);
            allEnts.push(entID);
        });
    }

    function createJointBoxEntity(name, position, rotation, dimensions, color, userData) {
        name = name || 1;
        dimensions = dimensions || vec(1, 1, 1);
        color = color || makeColor(1, 1, 1);
        userData = userData || {};
        var properties = {
            name: name,
            type: "Box",
            position: position,
            rotation: rotation,
            locked: false,
            dimensions: dimensions,
            color: color,
            visible: true,
            collisionless: true,
            userData: userData
        };
        var id = Entities.addEntity(properties);
        return id;
    }

    function createJointParticles() {
        jointArray.forEach(function (joint) {
            var name,
                entID,
                particlePosition,
                boxRotation,
                color,
                stringified,
                userData = {},
                BOX_WIDTH = 0.1,
                BOX_HEIGHT = 0.1,
                BOX_DEPTH = 0.1,
                localOffset = LOCAL_OFFSET,
                worldOffset = VEC3.multiplyQbyV(jointObject[joint].rotation, localOffset);

            particlePosition = VEC3.sum(
                jointObject[joint].position,
                worldOffset
            );

            boxRotation = jointObject[joint].rotation;

            userData.grabbableKey = { grabbable: false };
            stringified = JSON.stringify(userData);
            name = joint;
            entID = createJointParticleEntity(
                name,
                particlePosition,
                boxRotation,
                vec(BOX_WIDTH, BOX_HEIGHT, BOX_DEPTH),
                color,
                stringified,
                entities[joint].id,
                particleVariation1
            );
            particles.push(entID);
            allEnts.push(entID);
        });
    }

    function createJointParticleEntity(name, position, rotation, dimensions, color, userData, parentID, particleType) {
        name = name || 1;
        dimensions = dimensions || vec(1, 1, 1);
        color = color || makeColor(1, 1, 1);
        userData = userData || {};
        particleType.name = name;
        particleType.position = position;
        particleType.rotation = rotation;
        particleType.parentID = parentID;

        var id = Entities.addEntity(particleType);
        return id;
    }

    Script.update.connect(onUpdate);

    function onUpdate() {
        updateAllEntityPositionAndRotation();
    }

    // Main
    // /////////////////////////////////////////////////////////////////////////

    // Joint object to grab position and rotations 
    jointArray.forEach(function (name) {
        jointObject[name] = {
            position: null,
            rotation: null
        };
    });

    getAllJointPose();
    createJointBoxes();
    createJointParticles();

    // Cleanup
    // /////////////////////////////////////////////////////////////////////////
    function scriptEnding() {
        allEnts.forEach(function (ent) {
            Entities.deleteEntity(ent);
        });

        Script.update.disconnect(onUpdate);
    }

    Script.scriptEnding.connect(scriptEnding);

})();