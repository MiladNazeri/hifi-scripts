// DJ_Dispatch_Zone_Server.js
//
// Created by Milad Nazeri on 2018-06-19
//
// Copyright 2018 High Fidelity, Inc.
//
// Distributed under the Apache License, Version 2.0.
// See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html

(function () {
    // Init 
    var entityID,
        url = "",
        event = null,
        self;

    // Collections
    var currentProperties = {},
        userData = {},
        userdataProperties = {};

    // Entity Definition
    function ZoneRegistration_Server() {
        self = this;
    }

    ZoneRegistration_Server.prototype = {
        remotelyCallable: [
            "sendInput"
        ],
        preload: function (id) {
            entityID = id;
            currentProperties = Entities.getEntityProperties(entityID);

            userData = currentProperties.userData;
            try {
                userdataProperties = JSON.parse(userData);
                url = userdataProperties.url;
                event = userdataProperties.event;
            } catch (e) {
                //
            }
        },
        encodeURLParams: function (params) {
            var paramPairs = [];
            for (var key in params) {
                paramPairs.push(key + "=" + params[key]);
            }
            return paramPairs.join("&");
        },
        sendInput: function (is, param) {
            var userName = param[0];

            var paramString = this.encodeURLParams({
                userName: userName,
                date: new Date(),
                event: event
            });
        
            var request = new XMLHttpRequest();
            request.open('GET', url + "?" + paramString);
            request.timeout = 10000;
            request.send();
        },
        unload: function () {
        }
    };

    return new ZoneRegistration_Server();
});
