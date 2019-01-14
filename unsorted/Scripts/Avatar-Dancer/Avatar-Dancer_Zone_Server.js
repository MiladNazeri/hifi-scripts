// Avatar-Dancer_Zone_Server.js
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
        inFrontOf = Helper.Avatar.inFrontOf,
        fireEvery = Helper.Functional.fireEvery(),
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
        name = null,
        DEBUG = false,
        box = null,
        self = null,
        box = null;

    // Consts
    // /////////////////////////////////////////////////////////////////////////
    var HEARTBEAT_CHECK_INTERVAL = 2500,
        HEARTBEAT_TIMEOUT = 2000,
        ABOVE_VECTOR = vec(0,1,0),
        IS_EMITTING = "isEmitting",
        LIFESPAN = "lifespan",
        MAX_PARTICLES = "maxParticles",
        TEXTURES = "textures",
        EMIT_RATE = "emitRate",
        EMIT_SPEED = "emitSpeed",
        SPEED_SPREAD = "speedSpread",
        EMIT_DIMENSIONS = "emitDimensions",
        EMIT_ORIENTATION = "emitOrientation",
        EMITTER_SHOULD_TRAIL = "emitterShouldTrail",
        PARTICLE_RADIUS = "particleRadius",
        RADIUS_SPREAD = "radiusSpread",
        RADIUS_START = "radiusStart",
        RADIUS_FINISH = "radiusFinish",
        COLOR = "color",
        COLOR_SPREAD = "colorSpread",
        COLOR_START = "colorStart",
        COLOR_FINISH = "colorFinish",
        EMIT_ACCELERATION = "emitAcceleration",
        ACCELERATION_SPREAD = "accelerationSpread",
        ALPHA = "alpha",
        ALPHA_SPREAD = "alphaSpread",
        ALPHA_START = "alphaStart",
        ALPHA_FINISH = "alphaFinish",
        POLOR_START = "polarStart",
        POLOR_FINISH = "polarFinish",
        AZIMUTH_START = "azimuthStart",
        AZIMUTH_FINISH = "azimuthFinish";

    // Collections
    // /////////////////////////////////////////////////////////////////////////
    var currentProperties = {},
        avatarsInZone = {},

        userData = {},
        position = {},
        rotation = {},
        dimensions = {},
        userdataProperties = {},
        jointArray = [
            "LeftFoot",
            "RightFoot",
            "LeftHand",
            "RightHand",
            "Head"
        ],
        toRadian = Math.PI / 180,
        toDegree = 180 / Math.PI,
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
            lifespan: 7,
            radiusSpread: 0.003,
            radiusStart: 0.06,
            radiusFinish: 0.060
        }),
        moveVector = vec(0,0,0);
    
    function createParticle() {
        var particleVariation1 = Object.assign(particleBaseProps, {
            lifespan: 3.5,
            radiusSpread: 0.01,
            radiusStart: 0.06,
            radiusFinish: 0.001
        });

        radius = 1;
        var degreesToMove = 5;
    }

    var angle = 0;
    var radius = 1;
    var radians = angle * toRadian;
    var degreesToMove = 2;
    var radiansToMove = degreesToMove * toRadian;

    function onUpdate(delta) {
        // if (!fireEvery(20)) {
        //     return;
        // }
        for (var key in avatarsInZone) {
            avatarsInZone[key].particles.forEach(function(particle, index) {
                moveVector.x = avatarsInZone[key].positionAndJointArray[index].position.x + Math.cos(radians) * radius;
                moveVector.y = avatarsInZone[key].positionAndJointArray[index].position.y + Math.tan(radians) * radius * 0.05;
                // moveVector.y = avatarsInZone[key].positionAndJointArray[index].position.y;
                moveVector.z = avatarsInZone[key].positionAndJointArray[index].position.z + Math.sin(radians) * radius;

                var adjustedVector = VEC3.multiplyQbyV(
                    avatarsInZone[key].positionAndJointArray[index].rotation, 
                    moveVector
                );

                // var tan = Math.abs(Math.tan(radians) * 100);
                var tan = (Math.tan(radians) * 0.5) / 128;

                var newParticleProps = {};
                newParticleProps["colorStart"] = {};
                newParticleProps["colorEnd"] = {};
                newParticleProps["position"] = adjustedVector;
                newParticleProps["colorStart"].green = tan;
                newParticleProps["colorStart"].red = tan;

                // newParticleProps["position"] = adjustedVector;
                
                // newParticleProps[PARTICLE_RADIUS] = tan;
                // newParticleProps[LIFESPAN] = tan;
                // newParticleProps[SPEED_SPREAD] = tan;
                // newParticleProps[MAX_PARTICLES] = tan;
                newParticleProps[EMIT_RATE] = tan * 100;
                newParticleProps[EMIT_SPEED] = tan;
                // newParticleProps[EMIT_DIMENSIONS] = tan;
                // newParticleProps[EMIT_ORIENTATION] = tan;
                // newParticleProps[EMITTER_SHOULD_TRAIL] = tan;
                // newParticleProps[EMITTER_SHOULD_TRAIL] = tan;
                // newParticleProps[PARTICLE_RADIUS] = tan;
                // newParticleProps[RADIUS_SPREAD] = tan;
                // newParticleProps[RADIUS_START] = tan;
                // newParticleProps[RADIUS_FINISH] = tan;
                // newParticleProps[COLOR] = tan;
                // newParticleProps[COLOR_SPREAD] = tan;
                // newParticleProps[COLOR_START] = tan;
                // newParticleProps[COLOR_FINISH] = tan;
                // newParticleProps[EMIT_ACCELERATION] = tan;
                // newParticleProps[ACCELERATION_SPREAD] = tan;
                // newParticleProps[ALPHA] = tan;
                // newParticleProps[ALPHA_SPREAD] = tan;
                newParticleProps[ALPHA_START] = tan;
                newParticleProps[ALPHA_FINISH] = Math.pow(tan, 5);
                // newParticleProps[POLOR_START] = tan;
                // newParticleProps[POLOR_FINISH] = tan;
                newParticleProps[AZIMUTH_START] = radians * radians;
                newParticleProps[AZIMUTH_FINISH] = tan;
                log(LOG_ARCHIVE, "moveVector", moveVector);

                Entities.editEntity(particle, newParticleProps);
                radians -= radiansToMove;
            });
        }
    }

    // Entity Definition
    // /////////////////////////////////////////////////////////////////////////
    function AvatarDance_Zone_Server() {
        self = this;
    }

    AvatarDance_Zone_Server.prototype = {
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
            
            userData = currentProperties.userData;
            try {
                userdataProperties = JSON.parse(userData);
            } catch (e) {
                log(LOG_ERROR, "ERROR READING USERDATA", e);
            }
        },
        unload: function () {
            // Entities.deleteEntity(box);
            // Script.update.disconnect(onUpdate);

        },
        // Begin Utility Methods
        createJointParticleEntity: function(name, position, parentID, parentJointIndex, particleType, orientation) {
            log(LOG_ENTER, "in createJointParticleEntity");
            name = name || 1;
            // dimensions = dimensions || vec(1, 1, 1);

            // particleType.parentID = parentID; 
            // particleType.parentJointIndex = parentJointIndex;
            particleType.position = position;
            particleType.name = name;
            particleType.serverScripts = Script.resolvePath('./Avatar-Dancer_Zone_Empty_Server.js');

            // particleType.localPosition = localOffset;
            // log(LOG_VALUE, "parentJointIndex", parentJointIndex);
            // log(LOG_VALUE, "particleType", particleType)
            var id = Entities.addEntity(particleType);
            return id;
        },
        heartBeatHelper: function () {
            log(LOG_ARCHIVE, "in heartBeatHelper");
            log(LOG_ARCHIVE, "Avatars in Zone", avatarsInZone, null, 5000);
            var now = Date.now(),
                avatars = Object.keys(avatarsInZone);
            avatars.forEach(function(avatar) {
                var timeToCheck = now - avatarsInZone[avatar];
                if (timeToCheck > HEARTBEAT_TIMEOUT) {
                    avatarsInZone[avatar].particles.forEach(function(particle) {
                        log(LOG_VALUE, "About to delete particle from heartBeatHelper");
                        Entities.deleteEntity(particle);
                    });
                    delete avatarsInZone[avatar];
                } 
            });
        },
        receiveHeartBeat: function (id, parameter) {
            log(LOG_ARCHIVE, "in receiveHeartBeat");

            var avatarID = parameter[0],
                positionAndJointArray = JSON.parse(parameter[1]);

            log(LOG_ARCHIVE, "in receiveHEartBeats: avatarsInZone", avatarsInZone)
            avatarsInZone[avatarID].lastHeartBeat = Date.now();
            avatarsInZone[avatarID].positionAndJointArray = positionAndJointArray;
            Script.setTimeout(function() {
                self.heartBeatHelper();
            }, HEARTBEAT_CHECK_INTERVAL);
        },
        requestTurnOff: function(id, parameter) {
            log(LOG_ARCHIVE, "in requestTurnOff");
            var avatarID = parameter[0];
            avatarsInZone[avatarID].particles.forEach(function(particle) {
                log(LOG_VALUE, "About to delete particle from requestTurnOff");
                Entities.deleteEntity(particle);
            });
            delete avatarsInZone[avatarID];

            log(LOG_VALUE, "Avatars in Zone", avatarsInZone);
        },
        turnOn: function (id, parameter) {
            log(LOG_ENTER, name + " turnOn", parameter);
            
            var avatarID = parameter[0],
                positionAndJointArray = JSON.parse(parameter[1]);

            if (!avatarsInZone[avatarID]) {
                avatarsInZone[avatarID] = {};
            }
            log(LOG_VALUE, "avatrsinZone", avatarsInZone);
            avatarsInZone[avatarID].lastHeartBeat = Date.now();
            avatarsInZone[avatarID].particles = [];
            avatarsInZone[avatarID].positionAndJointArray;
            positionAndJointArray.forEach(function(positionAndJoint) {
                log(LOG_VALUE, "positionAndJoint", positionAndJoint);
                avatarsInZone[avatarID].particles.push(
                    this.createJointParticleEntity(
                        "Particle_" + positionAndJoint.name + avatarID,
                        positionAndJoint.position,
                        avatarID,
                        positionAndJoint.jointIndex,
                        particleVariation1,
                        positionAndJoint.rotation
                    )
                );
            }, this);

            Script.update.connect(onUpdate);            


            log(LOG_VALUE, "Avatars in Zone", avatarsInZone);
        }
    };

    return new AvatarDance_Zone_Server();
});
