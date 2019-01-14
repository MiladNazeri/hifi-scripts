(function() {

    /*
Reference: http://jsfiddle.net/BB3JK/47/
*/

    // $('select').each(function(){
    //     var $this = $(this), numberOfOptions = $(this).children('option').length;
    //     console.log("options:" + numberOfOptions)
    //     $this.addClass('select-hidden'); 
    //     $this.wrap('<div class="select"></div>');
    //     $this.after('<div class="select-styled"></div>');

    //     var $styledSelect = $this.next('div.select-styled');
    //     $styledSelect.text($this.children('option').eq(0).text());
    
    //     var $list = $('<ul />', {
    //         'class': 'select-options'
    //     }).insertAfter($styledSelect);
    
    //     for (var i = 0; i < numberOfOptions; i++) {
    //         $('<li />', {
    //             text: $this.children('option').eq(i).text(),
    //             rel: $this.children('option').eq(i).val()
    //         }).appendTo($list);
    //     }
    
    //     var $listItems = $list.children('li');
    
    //     $styledSelect.click(function(e) {
    //         console.log("select")
    //         e.stopPropagation();
    //         $('div.select-styled.active').not(this).each(function(){
    //             console.log("hiding");
    //             $(this).removeClass('active').next('ul.select-options').hide();
    //         });
    //         console.log("toggle");
    //         $(this).toggleClass('active').next('ul.select-options').toggle();
    //     });
    
    //     $listItems.click(function(e) {
    //         console.log("list")
    //         e.stopPropagation();
    //         $styledSelect.text($(this).text()).removeClass('active');
    //         $this.val($(this).attr('rel'));
    //         $list.hide();
    //         //console.log($this.val());
    //     });
    
    //     $(document).click(function() {
    //         console.log("doc")
    //         $styledSelect.removeClass('active');
    //         $list.hide();
    //     });

    // });
    "use strict";

    // Consts
    // /////////////////////////////////////////////////////////////////////////
    var EVENT_BRIDGE_OPEN_MESSAGE = "eventBridgeOpen",
        UPDATE_UI = "update_ui",
        TRY_DANCE = "try_dance",
        STOP_DANCE = "stop_dance",
        START_DANCING = "start_dancing",
        REMOVE_DANCE = "remove_dance",
        ADD_DANCE = "add_dance",
        PREVIEW_DANCE = "preview_dance",
        PREVIEW_DANCE_STOP = "preview_dance_stop",
        CLEAR_ALL_DANCES = "clear_all_dances",
        UPDATE_DANCE_ARRAY = "update_dance_array",
        CURRENT_DANCE = "current_dance",
        EVENTBRIDGE_SETUP_DELAY = 200;

    // Components
    // /////////////////////////////////////////////////////////////////////////
    Vue.component('current', {
        props: {
            current: { type: Object}
        },
        methods: {
        },
        computed: {
            formatedMessage() {
                // console.log("FORMATTED MESSAGES")
                var extraInfo = this.current.extraInfo;
                extraInfo = convertObject(extraInfo);
                return JSON.stringify(extraInfo)
                .replace(/\\n/g, "\n ")
                .replace(/\"/g, "\n")
                .replace(/\\t/g, "\n ")
                .split(",")
                .join(", ")
                // .split("}").join("\n\n")
                .replace(/"/g,"\n");
            },
            formatedTopMaterial() {
                // console.log("FORMATTED MESSAGES")
                var topMaterial = this.current.topMaterial;
                topMaterial = convertObject(topMaterial);
                return JSON.stringify(topMaterial)
                .replace(/\\n/g, "\n ")
                .replace(/\"/g, "\n")
                .replace(/\\t/g, "\n ")
                .split(",")
                .join(", ")
                // .split("}").join("\n\n")
                .replace(/"/g,"\n");
            }
        },
        template:`
            <div class="card">
                <div class="card-header">
                    <h4> Current Entity </h4>
                </div>
                <div class="card-body">
                    <div>
                        pressedID = {{current.pressedID}}
                    </div>
                    <br>
                    <div>
                        pressedMeshPart = {{current.pressedMeshPart}}
                    </div>
                    <br>
                    <div>
                        extraInfo = {{formatedMessage}}
                    </div>
                    <br>
                    <div>
                        meshPartString = {{current.meshPartString}}
                    </div>
                    <br>
                    <br>
                    <div>
                        topMaterial = {{formatedTopMaterial}}
                    </div>
                </div>
            </div>
        `
    })

    Vue.component('dance-list', {
        props: {
            dances: { type: Array}
        },
        methods: {
            startDancing(){
                EventBridge.emitWebEvent(JSON.stringify({
                    type: START_DANCING
                }));
            },
            removeDance(index){
                EventBridge.emitWebEvent(JSON.stringify({
                    type: REMOVE_DANCE,
                    value: index
                }));
            },
            onBlur(){
                EventBridge.emitWebEvent(JSON.stringify({
                    type: UPDATE_DANCE_ARRAY,
                    value: this.dances
                }));
                // alert(console.log(this.$parent.settings.danceArray))
            }
        },
        template:`
        <div class="accordian" id="dance-accordian">
            <div class="card">
                <div class="card-header">
                    <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseOne">
                    <h4>Dance List - click to open/close</h4>
                        
                    </button>
                    <br>
                    
                </div>
                <div id="collapseOne" class="collapse show" data-parent="#dance-accordian">
                    <div class="card-body">
                        <draggable :dances="dances">
                            <transition-group name="list-complete">
                                <div v-for="(dance, index) in dances" 
                                    v-bind:key="(dance.name + index)"
                                    class="list-complete-item" 
                                >
                                    <form class="form-inline">
                                                <h3> {{dance.name}}</h3>
                                                <div class="input-group mb-3 ">
                                                    <div class="input-group-prepend">
                                                        <span class="input-group-text">Start Frame</span>
                                                    </div>
                                                    <input type="text" col-sm-1 v-on:blur="onBlur" v-model="dance.startFrame" class="form-control" placeholder="start frame">
                                                </div>

                                                <div class="input-group mb-3">
                                                    <div class="input-group-prepend">
                                                        <span class="input-group-text">End Frame</span>
                                                    </div>
                                                    <input type="text" v-on:blur="onBlur" v-model="dance.endFrame" class="form-control" placeholder="end frame">
                                                </div>

                                                <div class="input-group mb-3">
                                                    <div class="input-group-prepend">
                                                        <span class="input-group-text">Duration</span>
                                                    </div>
                                                    <input type="text" v-on:blur="onBlur" v-model="dance.duration" class="form-control" placeholder="duration">
                                                </div>
                                                <div class="input-group mb-3">
                                                    <div class="input-group-prepend">
                                                        <span class="input-group-text">fps</span>
                                                    </div>
                                                    <input type="text" v-on:blur="onBlur" v-model="dance.fps" class="form-control" placeholder="fps">
                                                </div>
                                        <div>
                                            <button class="btn-sm btn-primary mt-1 mr-1" v-on:click="removeDance(index)">Remove</button>
                                        </div>
                                    </form>
                                </div>
                            </transition-group>
                        </draggable>
                        <div>
                            <button class="btn-sm btn-primary mt-1 mr-1" v-on:click="startDancing()">start Dance</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `
    })

    Vue.component('dance', {
        props: {
            dance: { type: Object}
        },
        methods: {
            addDance(){
                EventBridge.emitWebEvent(JSON.stringify({
                    type: ADD_DANCE,
                    value: this.dance
                }));
            },
            tryDance(){
                EventBridge.emitWebEvent(JSON.stringify({
                    type: TRY_DANCE,
                    value: this.dance
                }));
            },
            previewDance(){
                // console.log("preview Dance")
                EventBridge.emitWebEvent(JSON.stringify({
                    type: PREVIEW_DANCE,
                    value: this.dance
                }));
            },
            previewDanceStop(){
                // console.log("preview Dance Stop")
                EventBridge.emitWebEvent(JSON.stringify({
                    type: PREVIEW_DANCE_STOP,
                    value: this.dance
                }));
            },
        },
        template:`
            <div class="card">
                <div class="card-header">
                    {{ dance.name }}
                </div>
                <div class="card-body">
                    <button class="btn-sm btn-primary mt-1 mr-1" v-on:mouseover="previewDance()" v-on:mouseleave="previewDanceStop()" v-on:click="addDance()">Add Dance!</button>
                </div>
            </div>
        `
    })

    // App
    // /////////////////////////////////////////////////////////////////////////
    var app = new Vue({
        el: '#app',
        data: {
            settings: {
                ui: {
                    currentDance: false,
                    danceList: false
                }
            }
        }
    });

    // Procedural
    // /////////////////////////////////////////////////////////////////////////

    function convertObject(object){
        var newObject = {};
        for (var key in object) {
            if (!object[key]) {
                continue;
            }
            newObject[key] = object[key]
            if ( typeof object[key] === "object" ) {
                newObject[key] = convertObject(object[key]);
            }
            if ( typeof object[key] === "number") {
                newObject[key] = object[key].toFixed(3);
            }

        }
        return newObject;
    }

    function onScriptEventReceived(message) {
        var data;
        try {
            data = JSON.parse(message);
            switch (data.type) {
                case UPDATE_UI:
                    if (data.update.slice === CURRENT_DANCE) {
                        app.settings.currentDance = data.value.currentDance;
                    } else {
                        app.settings = data.value;
                    }
                    break;
                default:
            }
        } catch (e) {
            console.log(e)
            return;
        }
    }
    
    function onLoad() {
        
        // Initial button active state is communicated via URL parameter.
        // isActive = location.search.replace("?active=", "") === "true";

        // setTimeout(function () {
        //     // Open the EventBridge to communicate with the main script.
        //     // Allow time for EventBridge to become ready.
        //     EventBridge.scriptEventReceived.connect(onScriptEventReceived);
        //     EventBridge.emitWebEvent(JSON.stringify({
        //         type: EVENT_BRIDGE_OPEN_MESSAGE
        //     }));
        // }, EVENTBRIDGE_SETUP_DELAY);
    }

    // App
    // /////////////////////////////////////////////////////////////////////////    
    onLoad();

}());
