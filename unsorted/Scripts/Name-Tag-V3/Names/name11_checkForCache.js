"use strict";

/*jslint vars: true, plusplus: true*/
/*global Entities, Script, Quat, Vec3, MyAvatar, print*/
// nameTag.js
//
// Created by Triplelexx on 17/01/31
// Modified by Milad Nazeri on 01/21/18
// Copyright 2017 High Fidelity, Inc.
//
// Running the script creates a text entity that will hover over the user's head showing their display name.
//
// Distributed under the Apache License, Version 2.0.
// See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html

const CLIENTONLY = false;
const ENTITY_CHECK_INTERVAL = 5000; // ms = 5 seconds
const STARTUP_DELAY = 2000; // ms = 2 second
const OLD_AGE = 3500; // we recreate the entity if older than this time in seconds
const TTL = 2; // time to live in seconds if script is not running
const HEIGHT_ABOVE_HEAD = 0.4;
const HEAD_OFFSET = -0.025;
const NAMETAG_OFFSET = 0.05;
const SIZE_Y = 0.075;
const LETTER_OFFSET = 0.03; // arbitrary value to dynamically change width, could be more accurate by detecting characters
const LINE_HEIGHT = 0.05;
const DEBUG_LOG = true;
const BACKGROUND_MODEL_URL = "http://hifi-content.s3.amazonaws.com/milad/Names/nameplate2.fbx";
const NAMETAGBACKGROUND_DIMENSIONS = {
    x: 0.2,
    y: 0.15,
    z: 0.00277
};
const BACKGROUNDTAG_X_MULTIPLIER = 1.75;
var avatarCheckInterval;
var currentAvatarList;
var removeAvatarList;
var grabbedAvatarList;

Agent.isAvatar = true;
Avatar.skeletonModelURL = "http://hifi-content.s3.amazonaws.com/ozan/dev/avatars/invisible_avatar/invisible_avatar.fst";

function log(describer, obj) {
    if(!DEBUG_LOG) { return; }
    obj = obj || '';
    print('&======');
    print(describer);
    print(JSON.stringify(obj));
    print('======&');
}

if (!Function.prototype.bind) { // check if native implementation available
  Function.prototype.bind = function(){
    var fn = this, args = Array.prototype.slice.call(arguments),
        object = args.shift();
    return function(){
      return fn.apply(object,
        args.concat(Array.prototype.slice.call(arguments)));
    };
  };
}

var NameDisplayController = {
    nameGroup: {},
    deleteName: function(id){
        if (this.nameGroup[id]) {
            log("Deleting Name ", id)
            delete this.nameGroup[id];
        }
    },
    addName: function(avatar, id, name){
        var newNameGroupMember;

        if (!this.nameGroup[id]) {
            log("Adding Name ", id)
            newNameGroupMember = new NameDisplayMaker(avatar, id, name);
            this.nameGroup[id] = newNameGroupMember;
            this.nameGroup[id].setup();
        }
    }
};

function filterNullVec(array){
    return array.filter(function(vector){
        if (vector.x === 0 && vector.y === 0 && vector.z === 0){
            return false;
        } else {
            return true;
        }
    })
}

function NameDisplayMaker(avatar, id, name) {
    this.nameTagEntityID = Uuid.Null;
    this.nameTagBackgroundEntityID = Uuid.Null;
    this.lastCheckForEntity = Date.now();
    this.avatar = avatar;
    this.id = id;
    this.name = name;
    this.addNameTag = function() {
        var nameTagPosition = this.getNameTagPosition();
        var dimensionsFromName = this.dimensionsFromName();

        var nameTagBackgroundProperties = {
            name: this.avatar.displayName + ' Name Tag Background',
            type: 'Model',
            modelURL: BACKGROUND_MODEL_URL,
            parentID: this.avatar.sessionUUID,
            dimensions: {
                x: dimensionsFromName.x * BACKGROUNDTAG_X_MULTIPLIER,
                y: NAMETAGBACKGROUND_DIMENSIONS.y,
                z: NAMETAGBACKGROUND_DIMENSIONS.z
            },
            position: nameTagPosition,
            lifetime: (ENTITY_CHECK_INTERVAL / 1000) + TTL
        }

        this.nameTagBackgroundEntityID = Entities.addEntity(nameTagBackgroundProperties, CLIENTONLY);

        nameTagPosition.z += NAMETAG_OFFSET;

        var nameTagProperties = {
            name: this.avatar.displayName + ' Name Tag',
            type: 'Text',
            text: this.avatar.displayName,
            textColor:{
                red: 0,
                green: 0,
                blue: 0
            },
            backgroundColor: {
                red: 255,
                green: 255,
                blue: 255
            },
            lineHeight: LINE_HEIGHT,
            parentID: this.nameTagBackgroundEntityID,
            dimensions: this.dimensionsFromName(),
            position: nameTagPosition,
            lifetime: (ENTITY_CHECK_INTERVAL / 1000) + TTL
        }
        this.nameTagEntityID = Entities.addEntity(nameTagProperties, CLIENTONLY);
        log("Added Name tag" + this.nameTagEntityID);
        Script.update.connect(this.update.bind(this));
    }
    this.deleteNameTag = function() {
        if(this.nameTagEntityID !== Uuid.NULL) {
            log("Deleting Name Tag", this.nameTagBackgroundEntityID);
            Entities.deleteEntity(this.nameTagBackgroundEntityID);
            this.nameTagEntityID = Uuid.NULL;
            this.nameTagBackgroundEntityID = Uuid.NULL;
        }
    }
    this.dimensionsFromName = function() {
        return {
            x: LETTER_OFFSET * this.avatar.displayName.length,
            y: SIZE_Y,
            z: 0.0
        }
    }
    this.getNameTagPosition = function() {
        var headPosition = this.avatar.sensorToWorldMatrix["r1c3"];
        var newPosition = this.avatar.position
        newPosition.y = headPosition;
        newPosition.y += HEIGHT_ABOVE_HEAD;

        return Vec3.sum(newPosition, Vec3.multiply(HEAD_OFFSET, Quat.getForward(this.avatar.orientation)));
    }
    this.checkForEntity = function() {
        EntityViewer.queryOctree()
        var nameTagAge = Entities.getEntityProperties(this.nameTagEntityID, "age").age;

        // it's too old make a new one, otherwise update
        if(nameTagAge > OLD_AGE) {
            this.cleanup();
        } else {
            this.updateNameTag();
        }
    }
    this.updateNameTag = function() {
        if(this.avatar.displayName == "") {
            this.cleanup();
        }
        var nameTagAge = Entities.getEntityProperties(this.nameTagEntityID, "age").age;
        var nameTagPosition = this.getNameTagPosition();
        var dimensionsFromName = this.dimensionsFromName();

        Entities.editEntity(this.nameTagBackgroundEntityID, {
            name: this.avatar.displayName + ' Name Tag Background',
            position: nameTagPosition,
            rotation: Quat.getForward(this.avatar.orientation),
            dimensions: {
                x: dimensionsFromName.x * BACKGROUNDTAG_X_MULTIPLIER,
                y: NAMETAGBACKGROUND_DIMENSIONS.y,
                z: NAMETAGBACKGROUND_DIMENSIONS.z
            },
            // lifetime is in seconds we add TTL on top of the next poll time
            lifetime: Math.round(nameTagAge) + (ENTITY_CHECK_INTERVAL / 1000) + TTL,
        });

        nameTagPosition.z += NAMETAG_OFFSET;

        Entities.editEntity(this.nameTagEntityID, {
            name: this.avatar.displayName + ' Name Tag',
            dimensions: dimensionsFromName,
            position: nameTagPosition,
            rotation: Quat.getForward(this.avatar.orientation),
            // lifetime is in seconds we add TTL on top of the next poll time
            lifetime: Math.round(nameTagAge) + (ENTITY_CHECK_INTERVAL / 1000) + TTL,
            text: this.avatar.displayName
        });
    }
    this.update = function() {
        // if no entity we return
        if(this.nameTagEntityID == Uuid.NULL) {
            return;
        }

        if(Date.now() - this.lastCheckForEntity > ENTITY_CHECK_INTERVAL) {
            this.checkForEntity();
            this.lastCheckForEntity = Date.now();
        }
    }
    this.cleanup = function() {
        log("Cleanup", this.nameTagEntityID);
        this.deleteNameTag();
        NameDisplayController.deleteName(this.id);
        Script.update.disconnect(this.update);
    }
    this.setup = function() {
        log("Running NameDisplayMaker Setup");
        var self = this;
        Script.setTimeout(function() {
           self.addNameTag();
        }, STARTUP_DELAY);
        Script.scriptEnding.connect(this.cleanup);
    }
}

function onAvatarCheckInterval() {
    currentAvatarList = AvatarList.getAvatarIdentifiers();
    log("currentAvatarLists", currentAvatarList);
    removeAvatarList = Object.keys(NameDisplayController.nameGroup);
    log("removeAvatarList", removeAvatarList);

    removeAvatarList = removeAvatarList.filter(function(id){
       log("currentAvatarList.indexOf(id)", currentAvatarList.indexOf(id));
        return currentAvatarList.indexOf(id) === -1;
    });
    log("Filtered removeAvatarList", removeAvatarList);
    removeAvatarList.forEach(function(id){
        NameDisplayController.deleteName(id);
    })
    log("currentAvatarLists", currentAvatarList);
    for (var i = 0; i < currentAvatarList.length; i++) {

        var currentAvatar = currentAvatarList[i];

        var grabbedAvatar = AvatarList.getAvatar(currentAvatar);
        log("grabbedAvatar.sessionUUID", grabbedAvatar.sessionUUID)
        log("Agent.sessionUUID", Agent.sessionUUID)

        if( grabbedAvatar.sessionUUID == Agent.sessionUUID) {
            log("the same, continuing");
            continue;
        }

        // If we don't have this sessionUUID in our nameGroup, add it
        if(!NameDisplayController.nameGroup[grabbedAvatar.sessionUUID]){
            NameDisplayController.addName(grabbedAvatar, grabbedAvatar.sessionUUID, grabbedAvatar.displayName);
        }
    }
}

function setup() {
    log("Running Setup");
    avatarCheckInterval = Script.setInterval(onAvatarCheckInterval, ENTITY_CHECK_INTERVAL);
}

function tearDown() {
    log("Running TearDown");
    Script.clearInterval(avatarCheckInterval);
}

setup();
Script.scriptEnding.connect(tearDown);
