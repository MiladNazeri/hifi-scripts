//  midiButton.js
//
//  Created by Bruce Brown on 8/8/17.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//

(function() {
    function MidiButton() {
        this.clicked = false
        return;
    }

    var white = {red:255, green:255, blue:255};
    var black = {red:0, green:0, blue:0};
    var blue = {red:0, green:0, blue:255};    

    MidiButton.prototype = {
        preload: function(entityID) {
            this.entityID = entityID;
            var properties = Entities.getEntityProperties(entityID, ['userData']),
                userData = properties.userData && JSON.parse(properties.userData);
        },
        unload: function(entityID) {
        },
        receivedMidiEvent: function(entityID){
            var properties = Entities.getEntityProperties(entityID, ['userData']);
            userData = properties.userData && JSON.parse(properties.userData);
            if(userData.midiEvent.type == 9 && userData.midiEvent.velocity != 0){
                Entities.editEntity(entityID, { color: blue});
            } else {
                Entities.editEntity(entityID, { color: {red: userData.color.red, green: userData.color.green, blue: userData.color.blue}});
            }
        },
        enterEntity: function(entityID){
            var properties = Entities.getEntityProperties(entityID, ['userData']),
            userData = properties.userData && JSON.parse(properties.userData);
            Entities.editEntity(entityID, { color: blue});
            Midi.sendMidiMessage(userData.midiEvent.device, userData.midiEvent.channel, 9, userData.midiEvent.note, 50);
        },
        leaveEntity: function(entityID){
            var properties = Entities.getEntityProperties(entityID, ['userData']),
            userData = properties.userData && JSON.parse(properties.userData);
            Entities.editEntity(entityID, { color: {red: userData.color.red, green: userData.color.green, blue: userData.color.blue}});
            Midi.sendMidiMessage(userData.midiEvent.device, userData.midiEvent.channel, 8, userData.midiEvent.note, 50);
        },
        hoverEnterEntity: function(entityID){
            var properties = Entities.getEntityProperties(entityID, ['userData']),
            userData = properties.userData && JSON.parse(properties.userData);
            Entities.editEntity(entityID, { color: blue});
            Midi.sendMidiMessage(userData.midiEvent.device, userData.midiEvent.channel, 9, userData.midiEvent.note, 50);
        },
        hoverLeaveEntity: function(entityID){
            var properties = Entities.getEntityProperties(entityID, ['userData']),
            userData = properties.userData && JSON.parse(properties.userData);
            Entities.editEntity(entityID, { color: {red: userData.color.red, green: userData.color.green, blue: userData.color.blue}});
            Midi.sendMidiMessage(userData.midiEvent.device, userData.midiEvent.channel, 8, userData.midiEvent.note, 50);
        },
        clickDownOnEntity: function(entityID, mouseEvent) { 
            var properties = Entities.getEntityProperties(entityID, ['userData']),
            userData = properties.userData && JSON.parse(properties.userData);
            Entities.editEntity(entityID, { color: blue});
            this.clicked = false;
            Midi.sendMidiMessage(userData.midiEvent.device, userData.midiEvent.channel, 9, userData.midiEvent.note, 50);
        },
        clickReleaseOnEntity: function(entityID, mouseEvent) { 
            var properties = Entities.getEntityProperties(entityID, ['userData']),
            userData = properties.userData && JSON.parse(properties.userData);
            Entities.editEntity(entityID, { color: {red: userData.color.red, green: userData.color.green, blue: userData.color.blue}});
            this.clicked = false;
            Midi.sendMidiMessage(userData.midiEvent.device, userData.midiEvent.channel, 8, userData.midiEvent.note, 50);
        }     
    };
    return new MidiButton();
});