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

var HEIGHT_ABOVE_HEAD = 0.4;
var SIZE_Y = 0.1;
var LETTER_OFFSET = 0.04; // arbitrary value to dynamically change width, could be more accurate by detecting characters
var LINE_HEIGHT = 0.05;
var MACRO_URL = "https://script.google.com/macros/s/AKfycbznP3xSTSjmXNs8PzzOjRCe_lUPkhR-4t8gjLnqPAzFW5RD-hs/exec";
var checkTimer = Script.setInterval(checkForAvatars, 5000);
var avatarList = AvatarList.getAvatarIdentifiers();
var overlayList = [];
var nameList = [];
var running = true;

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
     if(running) {
        deleteAllOverlays();
        Script.clearInterval(checkTimer);
        running = false;
     } else {
        checkTimer = Script.setInterval(checkForAvatars, 5000);
        avatarList =  AvatarList.getAvatarIdentifiers();
        requestRemoteNameList();
        running = true;
     }
     button.editProperties({
        isActive: running,
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
        for (var i in req.response) {
        }
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
        visible: true,
        parentID: UUID,
        rotation: Quat.multiply(orientation, Quat.fromVec3Degrees({ x: 0, y: 180, z:0})),
        topMargin: 0.025,
        leftMargin: 0.025,
        backgroundColor: { red: 50, green: 200, blue: 250},
        alpha: 0.25,
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
    Script.clearInterval(checkTimer);
    tablet.removeButton(button);
}

function checkForAvatars() {
    var newAvatarList = AvatarList.getAvatarIdentifiers();

    var removedAvatarList = avatarList.filter(function(id){
         return newAvatarList.indexOf(id) === -1;
    });

    removedAvatarList.forEach(function(avatarId){
        overlayList.forEach(function(id){
            if(Overlays.getProperty(id, "parentID") === avatarId) {
                Overlays.deleteOverlay(id);
                log("removed avatar overlay ", id);
            }
        });
    });

    updateNameTags();
    avatarList = newAvatarList;
}

function updateNameTags() {
    avatarList.forEach(function(avatarId){
        if(avatarId === null) {
            // was MyAvatar
            return;
        }

        var newAvatar = true;
        overlayList.forEach(function(id){
            if(Overlays.getProperty(id, "parentID") === avatarId) {
                newAvatar = false;
            }
        });

        if(newAvatar) {
            log("new avatar", avatarId);
            try {
                var grabbedAvatar = AvatarList.getAvatar(avatarId);
            } catch(e) {
                log("error", e);
            }
            var newPosition = grabbedAvatar.position;
            newPosition.y = grabbedAvatar.sensorToWorldMatrix["r1c3"];
            createOverlay(grabbedAvatar.sessionUUID, newPosition, grabbedAvatar.orientation, grabbedAvatar.displayName + "yo");
            return;
        }
    });

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
                log("setting name", grabbedAvatar.displayName);
                newName =  nameList[i].name + " " + nameList[i].company;
                log("newname", newName);
            }
        }
        Overlays.editOverlay(id, {
            text: newName,
            dimensions: dimensionsFromName(newName.length),
            position: newPosition,
            rotation: Quat.multiply(grabbedAvatar.orientation, Quat.fromVec3Degrees({ x: 0, y: 180, z:0}))
        });
    });
}

function dimensionsFromName(length) {
    return {
        x: LETTER_OFFSET * length,
        y: SIZE_Y,
        z: 0.0
    }
}

function log(describer, obj) {
    obj = obj || '';
    print('&======');
    print(describer);
    print(JSON.stringify(obj));
    print('======&');
}
