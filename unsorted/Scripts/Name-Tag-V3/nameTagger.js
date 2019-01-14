"use strict";

// nameTagger.js
//
// Created by Triplelexx on 18/02/14
// Copyright 2018 High Fidelity, Inc.
//
// Running the script creates a text entity that will hover over the user's head showing their display name.
// Names can be modified by pushing to list
//
// Distributed under the Apache License, Version 2.0.
// See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html

(function() { // BEGIN LOCAL_SCOPE
    var utilsPath = Script.resolvePath('/~/developer/libraries/utils.js');
    Script.include(utilsPath);

    var DEBUG_LOGGING = false;
    var NAMETAGS_FACE_CAMERA = false;
    var HEIGHT_ABOVE_HEAD = 0.4;
    var SIZE_Y = 0.1;
    var LETTER_OFFSET = 0.04; // arbitrary value to dynamically change width, could be more accurate by detecting characters
    var LINE_HEIGHT = 0.05;
    var NAMETAG_UPDATE_INTERVAL = 100;
    var AVATAR_CHECK_INTERVAL = 5000;
    var BACKGROUND_MODEL_URL = Script.resolvePath("nametag.fbx");
    var NAMETAGBACKGROUND_DIMENSIONS = {
        x: 0.5,
        y: 0.175,
        z: 0.00277
    };
    var BACKGROUNDTAG_X_MULTIPLIER = 1.25;
    var avatarCheckTimer = Script.setInterval(checkForAvatars, AVATAR_CHECK_INTERVAL);
    var nametagUpdateTimer = Script.setInterval(updateNameTags, NAMETAG_UPDATE_INTERVAL);
    var avatarList = [];
    var overlayList = [];
    var isScriptActive = true;

    var tablet = Tablet.getTablet("com.highfidelity.interface.tablet.system");
    var button = tablet.addButton({
        text: "NameTags",
        isActive: true,
        icon: "icons/tablet-icons/users-i.svg",
        activeIcon: "icons/tablet-icons/users-a.svg"
    });

    function onButtonClicked() {
        if(isScriptActive) {
            deleteAllOverlays();
            Script.clearInterval(avatarCheckTimer);
            Script.clearInterval(nametagUpdateTimer);
            isScriptActive = false;
        } else {
            avatarCheckTimer = Script.setInterval(checkForAvatars, AVATAR_CHECK_INTERVAL);
            nametagUpdateTimer = Script.setInterval(updateNameTags, NAMETAG_UPDATE_INTERVAL);
            avatarList =  AvatarList.getAvatarIdentifiers();
            isScriptActive = true;
        }
        button.editProperties({
            isActive: isScriptActive,
        });
    }

    button.clicked.connect(onButtonClicked);
    Script.scriptEnding.connect(cleanup);

    function createOverlay(UUID, position, orientation, name) {
        position = Vec3.sum(position, {
            x: 0,
            y: HEIGHT_ABOVE_HEAD,
            z: 0
        });
        var overlayID = Overlays.addOverlay("text3d", {
            position: position,
            dimensions: dimensionsFromName(name.length),
            lineHeight: LINE_HEIGHT,
            drawInFront: false,
            isFacingAvatar: true,
            parentID: UUID,
            rotation: Quat.multiply(orientation, Quat.fromVec3Degrees({ x: 0, y: 180, z:0})),
            topMargin: 0.025,
            leftMargin: 0.025,
            backgroundAlpha: 0,
            text: name
        });
        var offsetPosition = Vec3.sum(position, Vec3.multiply( -0.1, Quat.getForward(orientation)));

        var backgroundOverlayID =  Overlays.addOverlay("model", {
            position: offsetPosition,
            url: BACKGROUND_MODEL_URL,
            dimensions: {
                x: NAMETAGBACKGROUND_DIMENSIONS.x,
                y: NAMETAGBACKGROUND_DIMENSIONS.y,
                z: NAMETAGBACKGROUND_DIMENSIONS.z
            },
            parentID: overlayID
        });
        overlayList.push({"overlay": overlayID, "background": backgroundOverlayID});
    }

    function deleteAllOverlays() {
    for(var i in overlayList) {
            Overlays.deleteOverlay(overlayList[i].overlay);
            Overlays.deleteOverlay(overlayList[i].background);
        }
        overlayList = [];
    }

    function cleanup() {
        deleteAllOverlays();
        Script.clearInterval(avatarCheckTimer);
        Script.clearInterval(nametagUpdateTimer);
        tablet.removeButton(button);
    }

    function checkForAvatars() {
        var newAvatarList = AvatarList.getAvatarIdentifiers();

        var myAvatarIndex = newAvatarList.indexOf(null);
        if (myAvatarIndex > -1) {
            newAvatarList.splice(myAvatarIndex, 1);
        }

        var removedAvatarList = avatarList.filter(function(id) {
            return newAvatarList.indexOf(id) === -1;
        });

        removedAvatarList.forEach(function(avatarId) {
            overlayList.forEach(function(id) {
                if(Overlays.getProperty(id.overlay, "parentID") === avatarId) {
                    Overlays.deleteOverlay(id.overlay);
                    Overlays.deleteOverlay(id.background);
                    var index = overlayList.indexOf(id);
                    if (index > -1) {
                        overlayList.splice(index, 1);
                    }
                    log("removed avatar overlay ", id);
                }
            });
        });

        newAvatarList.forEach(function(avatarId) {
            if(avatarId !== null) {
                var newAvatar = true;
                overlayList.forEach(function(id) {
                    if(Overlays.getProperty(id.overlay, "parentID") === avatarId) {
                        newAvatar = false;
                    }
                });
                
                if(newAvatar) {
                    try {
                        var grabbedAvatar = AvatarList.getAvatar(avatarId);
                    } catch(e) {
                        log("error", e);
                    }
                    var newPosition = grabbedAvatar.position;
                    newPosition.y = grabbedAvatar.sensorToWorldMatrix["r1c3"];
                    createOverlay(grabbedAvatar.sessionUUID, newPosition, grabbedAvatar.orientation, grabbedAvatar.displayName);
                }
            }
        });
        avatarList = newAvatarList;
    }

    function updateNameTags() {
        overlayList.forEach(function(id) {
            var parentId = Overlays.getProperty(id.overlay, "parentID");
            try {
                var grabbedAvatar = AvatarList.getAvatar(parentId);
            } catch(e) {
                log("error", e);
            }

            var newPosition = grabbedAvatar.position;
            newPosition.y = grabbedAvatar.sensorToWorldMatrix["r1c3"] + HEIGHT_ABOVE_HEAD;
            var newName = grabbedAvatar.displayName;
            var newRotation = Quat.multiply(grabbedAvatar.orientation, Quat.fromVec3Degrees({ x: 0, y: 180, z:0}));
            if(NAMETAGS_FACE_CAMERA) {
                newRotation = Camera.orientation;
                newRotation = Quat.safeEulerAngles(newRotation);
                newRotation.z = 0;
                newRotation = Quat.fromVec3Degrees(newRotation);
            }
            var newDimensions = dimensionsFromName(newName.length);
            Overlays.editOverlay(id.overlay, {
                text: newName,
                dimensions: newDimensions,
                position: newPosition,
                //rotation: newRotation,
            });
            Overlays.editOverlay(id.background, {
                dimensions: {
                    x: newDimensions.x * BACKGROUNDTAG_X_MULTIPLIER,
                    y: NAMETAGBACKGROUND_DIMENSIONS.y,
                    z: NAMETAGBACKGROUND_DIMENSIONS.z
                },
                rotation: newRotation
            });
        });
    }

    Window.domainChanged.connect(function () {
        cleanup();
        Script.stop();
    });

    function dimensionsFromName(length) {
        return {
            x: LETTER_OFFSET * length,
            y: SIZE_Y,
            z: 0.0
        }
    }

    function log(describer, obj) {
        if(!DEBUG_LOGGING) { return; }
        obj = obj || '';
        print('&======');
        print(describer);
        print(JSON.stringify(obj));
        print('======&');
    }
}()); // END LOCAL_SCOPE
