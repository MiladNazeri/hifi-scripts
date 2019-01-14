/*

    <NAME>
    Created by Milad Nazeri on 2019-01-07
    Copyright 2019 High Fidelity, Inc.

    Distributed under the Apache License, Version 2.0.
    See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html

    <Description>
    TABLET UI JS
    
*/

// *************************************
// START VUE
// *************************************
// #region Vue


Vue.component('<NAME>', {
    props: [''],
    methods: {

    },
    template: /*html*/`
    <div>
    </div>
    `
})


var app = new Vue({
    el: '#app',
    methods: {
        clear: function () {
            EventBridge.emitWebEvent(JSON.stringify({
                type: "CLEAR_LIST"
            }));
        }
    },
    data: {}
});


// #endregion
// *************************************
// END VUE 
// *************************************

// *************************************
// START EVENTBRIDGE
// *************************************
// #region Eventbridge


// Handle incoming tablet messages
function onScriptEventReceived(message) {
    var data;
    try {
        data = JSON.parse(message);
        switch (data.type) {
            case "UPDATE_SOLO":
                app.soloList = data.value;
                break;
            default:
        }
    } catch (e) {
        console.log(e)
        return;
    }

}


// This is how much time to give the Eventbridge to wake up.  This won't be needed in RC78 and will be removed.
// Run when the JS is loaded and give enough time to for EventBridge to come back
var EVENTBRIDGE_SETUP_DELAY = 100;
function onLoad() {
    setTimeout(function () {
        EventBridge.scriptEventReceived.connect(onScriptEventReceived);
        EventBridge.emitWebEvent(JSON.stringify({
            type: "EVENT_BRIDGE_OPEN_MESSAGE"
        }));
    }, EVENTBRIDGE_SETUP_DELAY);
}


// #endregion
// *************************************
// END EVENTBRIDGE
// *************************************

// *************************************
// START MAIN
// *************************************
// #region Main


onLoad();


// #endregion
// *************************************
// END MAIN 
// *************************************
