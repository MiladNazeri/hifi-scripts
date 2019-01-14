(function () {

    "use strict";

    var isActive = false,
        EVENT_BRIDGE_OPEN_MESSAGE = "eventBridgeOpen",
        SET_ACTIVE_MESSAGE = "setActive",
        CLOSE_DIALOG_MESSAGE = "closeDialog",
        CREATE_NEW_CONTROL = "createNewControl",
        DELETE_CONTROL = "deleteControl",
        CREATE_NEW_INPUT = "createInput",
        DELETE_INPUT = "deleteInput",
        CREATE_NEW_FILTER = "createNewFilter",
        DELETE_FILTER = "deleteFilter",
        CREATE_NEW_ENDPOINT = "createNewEndpoint",
        DELETE_ENDPOINT = "deleteEndpoint",
        CREATE_NEW_INPUT_TYPE = "createNewInputType",
        DELETE_INPUT_TYPE = "deleteInputType",        
        UPDATE_UI = "update_ui",
        EVENTBRIDGE_SETUP_DELAY = 500,
        CONTROL_PREFIX = "ctrl_",
        INPUT_PREFIX = "input_",
        FILTER_PREFIX = "filter_",
        ENDPOINT_PREFIX = "endpoint_";


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

    Vue.component('input-card', {
        props: ['title', "input_options", "id", "input"],
        data: function(){
            return {
                picked: "",
                made: false,
                inputTypeMade: false
            }
        },
        mounted(){
            if (this.input){
                console.log("####### input type buttons exists")
                this.inputTypeMade = true;
                this.made = true;

            } else {
                console.log("%%%%% DOEST type buttons exists")
            }
        },
        methods: {
            remove(id){
                console.log("((( in remove:" + id);
                if (this.inputTypeMade = true){
                    this.$parent.deleteInputEntity(id);
                }
                this.$parent.deleteInput(id);
            },
            make(picked, id){
                this.$parent.makeInputEntity(picked, id);
                this.made = true;
                this.inputTypeMade = true;
            },

        },
        template: `
            <div class="card">
                <div class="card-header">
                    {{title}}
                </div>
                <div class="card-body">
                    <div class="form-check" v-for="option in input_options" v-if="!inputTypeMade">
                        <input class="form-check-input" type="radio" v-model="picked"" id="input_radio_ + option" :value="option">
                        <label class="form-check-label" for="input_radio_ + option">
                            {{option}}
                        </label>
                        <br>
                        Picked: {{picked}}
                    </div>
                    <div v-if="inputTypeMade">
                        Input Type: {{input.inputType}}
                        Input EntityId: {{input.entityID}}
                    </div>
                    <button v-on:click="make(picked, id)" v-if="!made">create input entity</button>
                    <button v-on:click="remove(id)">remove</button>
                </div>
            </div>
            `
    })

    Vue.component('filter-card', {
        props: ['title', "id"],
        methods: {
            remove(id){
                this.$parent.deleteFilter(id);
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

    Vue.component('endpoint-card', {
        props: ['title', "id"],
        methods: {
            remove(id){
                this.$parent.deleteEndpoint(id);
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
            currentIDs: {
                control: 0,
                input: 0,
                filter: 0,
                endpoint: 0
            },
            allControls: [],
            allInputs: [],
            allFilters: [],
            allEndpoints: [],
            inputTypes: []
        },
        methods: {
            createControl: function() {
                this.currentIDs.control++;
                this.allControls.push({
                    id: CONTROL_PREFIX + this.currentIDs.control,
                    title: "new control" + this.currentIDs.control
                });
                EventBridge.emitWebEvent(JSON.stringify({
                    type: CREATE_NEW_CONTROL,
                    value: {
                        id: CONTROL_PREFIX + this.currentIDs.control,
                        title: "new control" + this.currentIDs.control
                    }
                }));
            },
            deleteControl: function(id) {
                var index = this.allControls.findIndex(item => {
                    return item.id === id;
                })
                this.allControls.splice(index,1);
                EventBridge.emitWebEvent(JSON.stringify({
                    type: DELETE_CONTROL,
                    value: {
                        id: CONTROL_PREFIX + id
                    }
                }));
            },
            createInput: function() {
                this.currentIDs.input++;
                this.allInputs.push({
                    id: INPUT_PREFIX + this.currentIDs.input,
                    title: "new input" + this.currentIDs.input
                });
                EventBridge.emitWebEvent(JSON.stringify({
                    type: CREATE_NEW_INPUT,
                    value: {
                        input: {
                            id: INPUT_PREFIX + this.currentIDs.input,
                            title: "new Input" + this.currentIDs.input,
                        },
                        currentIDs: this.currentIDs
                    },
                }));
            },
            deleteInput: function(id) {
                var index = this.allInputs.findIndex(item => {
                    return item.id === id;
                })
                this.allInputs.splice(index,1);
                EventBridge.emitWebEvent(JSON.stringify({
                    type: DELETE_INPUT,
                    value: {
                        id: INPUT_PREFIX + id
                    }
                }));
            },
            createFilter: function() {
                this.currentIDs.filter++;
                this.allFilters.push({
                    id: FILTER_PREFIX + this.currentIDs.filter,
                    title: "new Filter" + this.currentIDs.filter
                });
                EventBridge.emitWebEvent(JSON.stringify({
                    type: CREATE_NEW_FILTER,
                    value: {
                        id: FILTER_PREFIX + this.currentIDs.filter,
                        title: "new filter" + this.currentIDs.filter
                    }
                }));
            },
            deleteFilter: function(id) {
                var index = this.allFilters.findIndex(item => {
                    return item.id === id;
                })
                this.allFilters.splice(index,1);
                EventBridge.emitWebEvent(JSON.stringify({
                    type: DELETE_FILTER,
                    value: {
                        id: FILTER_PREFIX + id
                    }
                }));
            },
            createEndpoint: function() {
                this.currentIDs.endpoint++;
                this.allEndpoints.push({
                    id: ENDPOINT_PREFIX + this.currentIDs.endpoint,
                    title: "new endpoint" + this.currentIDs.endpoint
                });
                EventBridge.emitWebEvent(JSON.stringify({
                    type: CREATE_NEW_ENDPOINT,
                    value: {
                        id: ENDPOINT_PREFIX + this.currentIDs.endpoint,
                        title: "new endpoint" + this.currentIDs.endpoint
                    }
                }));
            },
            deleteEndpoint: function(id) {
                var index = this.allEndpoints.findIndex(item => {
                    return item.id === id;
                })
                this.allEndpoints.splice(index,1);
                EventBridge.emitWebEvent(JSON.stringify({
                    type: DELETE_ENDPOINT,
                    value: {
                        id: ENDPOINT_PREFIX + id
                    }
                }));
            },
            makeInputEntity: function(picked, id) {
                var index = this.allInputs.findIndex(item => {
                    return item.id === id;
                })
                
                // var prop = this.allInputs[index];
                var input = {
                    inputType: picked
                };
                this.$set(this.allInputs[index],"input", input)
                // prop.inputType = picked;
                console.log("NEWINPUTS!!:" + JSON.stringify(this.allInputs));
                EventBridge.emitWebEvent(JSON.stringify({
                    type: CREATE_NEW_INPUT_TYPE,
                    value: {
                        id: id,
                        input: input
                    }
                }));
            },
            deleteInputEntity: function(id) {
                console.log("###4 in delete input entity:" + id)
                var index = this.allInputs.findIndex(item => {
                    return item.id === id;
                })
                EventBridge.emitWebEvent(JSON.stringify({
                    type: DELETE_INPUT_TYPE,
                    value: {
                        id: id,
                    }
                }));
            }
            
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
                    app.currentIDs = data.value.currentIDs;
                    app.allControls = data.value.allControls;
                    app.allInputs = data.value.allInputs;
                    app.allFilters = data.value.allFilters;
                    app.allEndpoints = data.value.allEndpoints;
                    app.inputTypes = data.value.inputTypes;
                default:
            }
        } catch (e) {
            return;
        }
    }
    // EventBridge.scriptEventReceived.connect(onScriptEventReceived);

    // EventBridge.emitWebEvent(JSON.stringify(event));

    // setTimeout(function () {
    //  EventBridge.scriptEventReceived.connect(onScriptEventReceived);
    //  }, 500)

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