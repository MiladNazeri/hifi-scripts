"use strict";

// nameTagRemoteMap.js
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
    var NAMETAGS_FACE_CAMERA = true;
    var HEIGHT_ABOVE_HEAD = 0.4;
    var SIZE_Y = 0.1;
    var LETTER_OFFSET = 0.04; // arbitrary value to dynamically change width, could be more accurate by detecting characters
    var LINE_HEIGHT = 0.05;
    var MACRO_URL = "https://script.google.com/macros/s/AKfycbznP3xSTSjmXNs8PzzOjRCe_lUPkhR-4t8gjLnqPAzFW5RD-hs/exec";
    var NAMETAG_UPDATE_INTERVAL = 100;
    var AVATAR_CHECK_INTERVAL = 5000;
    var avatarCheckTimer = Script.setInterval(checkForAvatars, AVATAR_CHECK_INTERVAL);
    var nametagUpdateTimer = Script.setInterval(updateNameTags, NAMETAG_UPDATE_INTERVAL);
    var avatarList = [];
    var overlayList = [];
    var nameList = [];
    var isScriptActive = true;

    var TWEEN_SPEED = 0.01;

    var tweenPosition = 0;
    var startColor = randomColor();
    var endColor = randomColor();

    nameList.push({
        name:"Lexx",
        company: "Lexx Inc"
    });

    nameList.push({
        name:"MeowLAD",
        company: "Lad Inc"
    });

    requestRemoteNameList();

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
            requestRemoteNameList();
            isScriptActive = true;
        }
        button.editProperties({
            isActive: isScriptActive,
        });
    }

    button.clicked.connect(onButtonClicked);
    Script.scriptEnding.connect(cleanup);

    function requestRemoteNameList() {
        var req = new XMLHttpRequest();
        req.responseType = 'json';
        req.open("GET", MACRO_URL, false);
        req.send();

        if (req.status == 200) {
            nameList = req.response;
        } else {
            log("Error loading name list data");
            log("Error status", req.status);
            log("Error text", req.statusText);
            log("Error code", req.errorCode);
        }
    }

    function createOverlay(UUID, position, orientation, name) {
        var overlay = Overlays.addOverlay("text3d", { 
            position: Vec3.sum(position, {
                x: 0,
                y: HEIGHT_ABOVE_HEAD,
                z: 0
            }),
            dimensions: dimensionsFromName(name.length),
            lineHeight: LINE_HEIGHT,
            drawInFront: true,
            parentID: UUID,
            rotation: Quat.multiply(orientation, Quat.fromVec3Degrees({ x: 0, y: 180, z:0})),
            topMargin: 0.025,
            leftMargin: 0.025,
            backgroundAlpha: 0,
            text: name
        });
        overlayList.push(overlay);
    }

    function deleteAllOverlays() {
    for(var i in overlayList) {
            Overlays.deleteOverlay(overlayList[i]);
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

        var removedAvatarList = avatarList.filter(function(id){
            return newAvatarList.indexOf(id) === -1;
        });

        removedAvatarList.forEach(function(avatarId){   
            overlayList.forEach(function(id){
                if(Overlays.getProperty(id, "parentID") === avatarId) {
                    Overlays.deleteOverlay(id);
                    var index = overlayList.indexOf(id);
                    if (index > -1) {
                        overlayList.splice(index, 1);
                    }
                    log("removed avatar overlay ", id);
                }
            });
        });

        newAvatarList.forEach(function(avatarId){
            if(avatarId !== null) {
                var newAvatar = true;
                overlayList.forEach(function(id){
                    if(Overlays.getProperty(id, "parentID") === avatarId) {
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
        if (tweenPosition < 1) {
            tweenPosition += TWEEN_SPEED;
        } else {
            // after tween completion reset to zero and flip values to ping pong 
            tweenPosition = 0;
            for (var component in startColor) {
                var storedColor = startColor[component];
                startColor[component] = endColor[component];
                //endColor[component] = storedColor;
            }
            endColor = randomColor();
        }
        overlayList.forEach(function(id){
            var parentId = Overlays.getProperty(id, "parentID");
            try {
                var grabbedAvatar = AvatarList.getAvatar(parentId);
            } catch(e) {
                log("error", e);
            }

            var newPosition = grabbedAvatar.position;
            newPosition.y = grabbedAvatar.sensorToWorldMatrix["r1c3"] + HEIGHT_ABOVE_HEAD;
            var newName = grabbedAvatar.displayName;
            for(var i in nameList) {
                if(grabbedAvatar.displayName == nameList[i].name) {
                    newName =  nameList[i].name + " " + nameList[i].company;
                }
            }
            var newRotation = Quat.multiply(Camera.orientation, Quat.fromVec3Degrees({ x: 0, y: 180, z:0}));
            if(NAMETAGS_FACE_CAMERA) {
                newRotation = Camera.orientation;
            }
            Overlays.editOverlay(id, {
                text: newName,
                dimensions: dimensionsFromName(newName.length),
                position: newPosition,
                rotation: newRotation,
                color: colorMix(startColor, endColor, easeIn(tweenPosition))
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
