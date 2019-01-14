"use strict";

// scriptLoaderEntity.js
//
// Created by Triplelexx on 18/02/22
// Copyright 2018 High Fidelity, Inc.
//
// Runs a script when entered
//
// Distributed under the Apache License, Version 2.0.
// See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html

(function() { // BEGIN LOCAL_SCOPE
    var CLIENT_SCRIPT_URL = Script.resolvePath("nameTagRemoteMap_v2.js?v=" + Date.now());

    scriptLoaderEntity = function() {
    };

    scriptLoaderEntity.prototype = {
        enterEntity: function(entityID) {
            ScriptDiscoveryService.loadScript(CLIENT_SCRIPT_URL);
        }
    };
    return new scriptLoaderEntity();
}); // END LOCAL_SCOPE
