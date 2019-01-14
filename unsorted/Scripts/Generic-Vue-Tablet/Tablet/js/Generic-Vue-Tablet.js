(function () {

    "use strict";

    var isActive = false,
        EVENT_BRIDGE_OPEN_MESSAGE = "eventBridgeOpen",
        SET_ACTIVE_MESSAGE = "setActive",
        CLOSE_DIALOG_MESSAGE = "closeDialog",
        UPDATE_UI = "update_ui",
        EVENTBRIDGE_SETUP_DELAY = 500;

    Vue.component('control-card', {
        props: ['title', "id"],
        methods: {
            remove(id){
                this.$parent.deleteControl(id);
            } 
        },
        template: `
            <div class="card">
                <div class="card-header">
                    {{title}}
                </div>
                <div class="card-body">
                    <p class="card-text">With supporting text below as a natural lead-in to additional content.{{id}}</p>
                    <button v-on:click="remove(id)">remove</button>
                </div>
            </div>
            `
    })

    var app = new Vue({
        el: '#app',
        data: {
        },
        methods: {
        } 
    });

    function onScriptEventReceived(message) {
        var data;
        console.log("message!!" + message);
        try {
            data = JSON.parse(message);
            switch (data.type) {
                case UPDATE_UI:
                    console.log("in update ui");
                default:
            }
        } catch (e) {
            return;
        }
    }

    function onLoad() {
        
        // Initial button active state is communicated via URL parameter.
        isActive = location.search.replace("?active=", "") === "true";

        setTimeout(function () {
            // Open the EventBridge to communicate with the main script.
            // Allow time for EventBridge to become ready.
            EventBridge.scriptEventReceived.connect(onScriptEventReceived);
            EventBridge.emitWebEvent(JSON.stringify({
                type: EVENT_BRIDGE_OPEN_MESSAGE
            }));
        }, EVENTBRIDGE_SETUP_DELAY);
    }

    onLoad();

}());