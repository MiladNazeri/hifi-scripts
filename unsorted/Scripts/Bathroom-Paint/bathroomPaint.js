"use strict";

// scriptLoaderEntity.js
//
// Copyright 2018 High Fidelity, Inc.
//
// Runs a script when entered
//
// Distributed under the Apache License, Version 2.0.
// See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html

(function() { // BEGIN LOCAL_SCOPE
    var CLIENT_SCRIPT_URL = "https://hifi-content.s3.amazonaws.com/milad/ROLC/Organize/Projects/Domains/Rust/Bathroom-Paint/fingerPaintMod.js?21";

    scriptLoaderEntity = function() {
    };

    scriptLoaderEntity.prototype = {
        enterEntity: function(entityID) {
            ScriptDiscoveryService.loadScript(CLIENT_SCRIPT_URL);
        },
        leaveEntity: function(entityID) {
            ScriptDiscoveryService.stopScript(CLIENT_SCRIPT_URL);
        }
    };
    return new scriptLoaderEntity();
}); // END LOCAL_SCOPE
