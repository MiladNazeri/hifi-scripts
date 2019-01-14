"use strict";

/*jslint vars: true, plusplus: true*/
/*global Entities, Script, Quat, Vec3, MyAvatar, print*/
// nameTag.js
//
// Created by Triplelexx on 17/01/31
// Copyright 2017 High Fidelity, Inc.
//
// Running the script creates a text entity that will hover over the user's head showing their display name.
//
// Distributed under the Apache License, Version 2.0.
// See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
(function(){

    const CLIENTONLY = false;
    const ENTITY_CHECK_INTERVAL = 5000; // ms = 5 seconds
    const STARTUP_DELAY = 2000; // ms = 2 second
    const OLD_AGE = 3500; // we recreate the entity if older than this time in seconds
    const TTL = 2; // time to live in seconds if script is not running
    const HEIGHT_ABOVE_HEAD = 0.2;
    const HEAD_OFFSET = -0.025;
    const SIZE_Y = 0.075;
    const LETTER_OFFSET = 0.03; // arbitrary value to dynamically change width, could be more accurate by detecting characters
    const LINE_HEIGHT = 0.05;

    var NameDisplayController = {
        nameGroup: [],
        deleteName: function(name){
            var index;
            for(var i = 0; i < this.nameGroup.length; i++){
                index = this.nameGroup.indexOf(name);
                this.nameGroup.splice(index,1);
                break;
            }
        },
        deleteIndex: function(index){
            this.nameGroup.splice(index,1);
        },
        addName: function(avatar, id, name){
            var index = this.nameGroup.length;
            this.nameGroup.push(new NameDisplayMaker(avatar, id, name, index));
        },
    };

    function NameDisplayMaker(avatar, id, name, index) {
        this.nameTagEntityID = Uuid.Null;
        this.lastCheckForEntity = 0;
        this.avatar = avatar;
        this.id = id;
        this.name = name + id;
        this.index = index;
    }

    NameDisplayMaker.prototype.addNameTag() {
        var nameTagPosition = Vec3.sum(this.avatar.getHeadPosition(), Vec3.multiply(HEAD_OFFSET, Quat.getForward(this.avatar.orientation)));
        nameTagPosition.y += HEIGHT_ABOVE_HEAD;
        var nameTagProperties = {
            name: this.avatar.displayName + ' Name Tag',
            type: 'Text',
            text: this.avatar.displayName,
            lineHeight: LINE_HEIGHT,
            parentID: this.avatar.id,
            dimensions: this.dimensionsFromName(),
            position: nameTagPosition
        }
        nameTagEntityID = Entities.addEntity(nameTagProperties, CLIENTONLY);
    }
    NameDisplayMaker.prototype.updateNameTag() {
        var nameTagProps = Entities.getEntityProperties(this.nameTagEntityID);
        var nameTagPosition = Vec3.sum(this.avatar.getHeadPosition(), Vec3.multiply(HEAD_OFFSET, Quat.getForward(this.avatar.orientation)));
        nameTagPosition.y += HEIGHT_ABOVE_HEAD;

        Entities.editEntity(this.parentIDnameTagEntityID, {
            position: this.nameTagPosition,
            dimensions: this.dimensionsFromName(),
            // lifetime is in seconds we add TTL on top of the next poll time
            lifetime: Math.round(nameTagProps.age) + (ENTITY_CHECK_INTERVAL / 1000) + TTL,
            text: this.avatar.displayName
        });
    };
    NameDisplayMaker.prototype.deleteNameTag() {
        if(this.nameTagEntityID !== Uuid.NULL) {
            Entities.deleteEntity(this.nameTagEntityID);
            this.nameTagEntityID = Uuid.NULL;
        }
    }
    NameDisplayMaker.prototype.dimensionsFromName() {
        return {
            x: LETTER_OFFSET * avatar.displayName.length,
            y: SIZE_Y,
            z: 0.0
        }
    };
    NameDisplayMaker.prototype.checkForEntity() {
        var nameTagProps = Entities.getEntityProperties(this.nameTagEntityID);
        // it is possible for the age to not be a valid number, we check for this and return accordingly
        if(nameTagProps.age == -1) {
            return;
        }

        // it's too old or we receive undefined make a new one, otherwise update
        if(nameTagProps.age > OLD_AGE || nameTagProps.age == undefined) {
            this.deleteNameTag();
            this.addNameTag();
        } else {
            this.updateNameTag();
        }
    }
    NameDisplayMaker.prototype.
    NameDisplayMaker.prototype.update() {
        // if no entity we return
        if(this.nameTagEntityID == Uuid.NULL) {
            return;
        }

        if(Date.now() - this.lastCheckForEntity > ENTITY_CHECK_INTERVAL) {
            this.checkForEntity();
            this.lastCheckForEntity = Date.now();
        }
    }
    NameDisplayMaker.prototype.cleanup() {
        this.deleteNameTag();
    }
    NameDisplayMaker.prototype.setup() {
        var self = this;
        // create the name tag entity after a brief delay
        Script.setTimeout(function() {
            self.addNameTag();
        }, STARTUP_DELAY);
        Script.update.connect(this.update);
    }
    NameDisplayMaker.prototype.tearDown() {
        Script.scriptEnding.connect(this.cleanup);

    }

    print(AvatarList.avatarAddedEvent);
    function onAvatarAdded(quuid){
        print("TEST")
        print("ADDED: \n" + quuid);
    };
    AvatarList.avatarAddedEvent.connect(onAvatarAdded)
}())
