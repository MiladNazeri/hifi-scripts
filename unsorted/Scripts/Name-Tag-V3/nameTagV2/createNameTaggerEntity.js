"use strict";
//
// createNameTaggerEntity.js
//
// Created by Triplelexx on 18/02/22
// Copyright 2018 High Fidelity, Inc.
//
// Distributed under the Apache License, Version 2.0.
// See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html

(function() { // BEGIN LOCAL_SCOPE
    var ENTITY_SCRIPT_URL = Script.resolvePath("scriptLoaderEntity.js?v=" + Date.now());
    var START_OFFSET = 5;

    var startPosition = Vec3.sum(MyAvatar.position, Vec3.multiply(START_OFFSET, Quat.getFront(MyAvatar.orientation)));

    var nameTaggerID = Entities.addEntity({
        type: "Box",
        name: "Name Tagger",
        position: startPosition,
        dimensions: {
            x: 5,
            y: 5,
            z: 5
        },
        dynamic: false,
        ignoreForCollisions: true,
        script: ENTITY_SCRIPT_URL,
        lifetime: -1,
        userData: JSON.stringify({
            grabbableKey: {
                grabbable: false
            }
        })
    });

    Script.scriptEnding.connect(function() {
        Entities.deleteEntity(nameTaggerID);
    });
}()); // END LOCAL_SCOPE
