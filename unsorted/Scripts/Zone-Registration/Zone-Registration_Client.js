// DJ_Dispatch_Zone_Client.js
//
// Created by Milad Nazeri on 2018-06-19
//
// Copyright 2018 High Fidelity, Inc.
//
// Distributed under the Apache License, Version 2.0.
// See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html

/* global AccountServices */

(function () {
    // Init 
    var entityID,
        self;

    // Collections
    var currentProperties = {},
        userData = {};

    // Entity Definition
    function ZoneRegistration_Client() {
        self = this;
    }

    ZoneRegistration_Client.prototype = {
        remotelyCallable: [
        ],
        preload: function (id) {
            entityID = id;
        },
        enterEntity: function () {
            Entities.callEntityServerMethod(entityID, "sendInput", [AccountServices.username]);
        },
        leaveEntity: function () {
        },
        unload: function () {
        }
    };

    return new ZoneRegistration_Client();
});
