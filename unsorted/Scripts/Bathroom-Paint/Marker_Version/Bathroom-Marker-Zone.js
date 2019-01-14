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

    function hasMarker(name){
        var attachments = MyAvatar.getaAttachmentData();
        for (var i = 0; i < attachments.length; i++) {
            if (attachments[i].name.indexOf(name) > -1){
                Entities.deleteEntity(attachments[i].id);
            }
        }
    }

    scriptLoaderEntity.prototype = {
        enterEntity: function(entityID) {
            //
        },
        leaveEntity: function(entityID) {
            hasMarker("marker");
        }
    };
    return new scriptLoaderEntity();
}); // END LOCAL_SCOPE
