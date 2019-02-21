/*

    Tip jar for QA Desktop/HMD example
    fileName.js
    Created by Milad Nazeri on 2019-01-15
    Copyright 2019 High Fidelity, Inc.

    Distributed under the Apache License, Version 2.0.
    See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html

    Throw and get down!

*/


(function() {    

    // *************************************
    // START INIT
    // *************************************
    // #region INIT
        
    var _entityID = null;

    var destinationName = null;
    var hfcAmount = 0;
    var message = "";

    var tipJar = null;


    // #endregion
    // *************************************
    // END INIT
    // *************************************


    // *************************************
    // START MONEY
    // *************************************
    // #region MONEY
    

    // This function will open a user's tablet and prompt them to pay for VIP status.
    function sendTip(hfcAmount, destinationName, message) {
        var tablet = Tablet.getTablet("com.highfidelity.interface.tablet.system");
        tablet.loadQMLSource("hifi/commerce/common/sendAsset/SendAsset.qml");
        tablet.sendToQml({
            method: 'updateSendAssetQML',
            assetCertID: "",
            amount: 10,
            username: "test",
            message: "test to see if you can see this window correctly in hmd or desktop"
        });
    }
    
    // #endregion
    // *************************************
    // END MONEY
    // *************************************

    // *************************************
    // START OVERLAY
    // *************************************
    // #region OVERLAY
    
    
    var tipJarModel = Script.resolvePath("../resources/models/tipJar_Anim.fbx");

    var tipJarProps = {
        name: "tipjar",
        dimensions: {
            "x": 0.47060835361480713,
            "y": 0.5698657631874084,
            "z": 0.47296142578125
        },
        url: tipJarModel
    };

    function createOverlay() {
        var currentPosition = Entities.getEntityProperties(_entityID, "position").position;
        tipJarProps.parentID = _entityID;
        tipJarProps.position = currentPosition;
        tipJar = Overlays.addOverlay("model", tipJarProps);
    }
    
    
    // #endregion
    // *************************************
    // END OVERLAY
    // *************************************

    // *************************************
    // START ENTITY DEFINITION
    // *************************************
    // #region ENTITY DEFINITION
    

    // Grab the entityID on preload
    function preload(entityID) {
        _entityID = entityID;
        createOverlay();
    }


    // Handle if mouse pressed down on entity
    function clickDownOnEntity(id, event) {
        if (event.button === "Primary") {
            sendTip(hfcAmount, destinationName, message);
        }
    }

    
    function startNearTrigger() {
        sendTip(hfcAmount, destinationName, message);
    }


    // Handle if startFar Trigger pressed down on entity
    function startFarTrigger() {
        sendTip(hfcAmount, destinationName, message);
    }

    
    // Cleans up anything outstanding upon entity closing
    function unload() {
        Overlays.deleteOverlay(tipJar);
    }


    function TipJar() {}
    
    TipJar.prototype = {
        preload: preload,
        clickDownOnEntity: clickDownOnEntity,
        startNearTrigger: startNearTrigger,
        startFarTrigger: startFarTrigger,
        unload: unload
    };

    return new TipJar();
    

    // #endregion
    // *************************************
    // END ENTITY DEFINITION
    // *************************************

});