/*

    <APP NAME>
    Created by Milad Nazeri on <DATE>
    Copyright 2019 High Fidelity, Inc.

    Distributed under the Apache License, Version 2.0.
    See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html

    <DESCRIPTION>
    
*/

(function () {
    // *************************************
    // START UTILITY FUNCTIONS
    // *************************************
    // #region Utilty




    // #endregion
    // *************************************
    // END UTILITY FUNCTIONS
    // *************************************

    // *************************************
    // START MAPPING FUNCTIONS
    // *************************************
    // #region Mapping

    


    // #endregion
    // *************************************
    // STOP MAPPING FUNCTIONS
    // *************************************

    // *************************************
    // START SOLO FUNCTIONS
    // *************************************
    // #region Solo




    // #endregion
    // *************************************
    // STOP SOLO FUNCTIONS
    // *************************************

    // *************************************
    // START OVERLAY FUNCTIONS
    // *************************************
    // #region Overlay




    // #endregion
    // *************************************
    // STOP OVERLAY FUNCTIONS
    // *************************************

    // *************************************
    // START TABLET FUNCTIONS
    // *************************************
    // #region Tablet


    var BUTTON_NAME = "<NAME>";
    var URL = Script.resolvePath('./resources/<NAME>_ui.html');
    var appUi = Script.require('appUi');

    var ui = new appUi({
        buttonName: BUTTON_NAME,
        home: URL,
        graphicsDirectory: Script.resolvePath("./resources/images/icons/"),
        onOpened: onOpened,
        onClosed: onClosed,
        onMessage: onMessage
    });

    // Function for appUi to call when opened
    function onOpened() {
    }


    // Function for appUi to call when closed    
    function onClosed() {
    }


    // Handles incoming tablet messages
    function onMessage(data) {
        switch (data.type) {
            case "EVENT_BRIDGE_OPEN_MESSAGE":
                updateUI();
                break;
            default:
        }
    }


    // Handles how the UI gets updated
    function updateUI() {
        ui.sendToHtml({
            type: "UPDATE_SOLO",
            value: avatarNames
        });
    }

    // #endregion 
    // *************************************
    // STOP TABLET FUNCTIONS
    // *************************************

    // *************************************
    // START CLEANUP
    // *************************************
    // #region Cleanup


    // Called when the script is closing
    function scriptFinished() {
    }


    Script.scriptEnding.connect(scriptFinished);


    // #endregion
    // *************************************
    // STOP CLEANUP
    // *************************************

})();
