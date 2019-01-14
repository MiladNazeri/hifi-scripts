Midi.thruModeEnable(false);
Midi.broadcastEnable(false);
Midi.typeNoteOffEnable(true);
Midi.typeNoteOnEnable(true);
Midi.typePolyKeyPressureEnable(false);
Midi.typeControlChangeEnable(true);
Midi.typeProgramChangeEnable(true);
Midi.typeChanPressureEnable(false);
Midi.typePitchBendEnable(true);
Midi.typeSystemMessageEnable(false);

var midiInDeviceList = Midi.listMidiDevices(false);
var midiOutDeviceList = Midi.listMidiDevices(true);

print(JSON.stringify(midiInDeviceList));
print(JSON.stringify(midiOutDeviceList));

var date = Date.now();
var entityId = "{02744849-34f2-4397-9a51-452bcbaff31a}";
function midiMessageReceived(eventData){
    // console.log("here")

    var dateTest = Date.now();
    if (dateTest-date > 20){
        var props = {
            dimensions: {
                "x": Math.sin(eventData.velocity / 4099) * 100,
                "y": Math.cos(eventData.velocity / 4000) * 1,
                "z": Math.cos(eventData.velocity / 4000) * 10 + (eventData.velocity/10)
            },
            position: {
                "x": (Math.sin(eventData.velocity / 1000) / 2) + (eventData.velocity/10),
                "y": Math.cos(eventData.velocity / 1000) / 2- 10,
                "z": Math.cos(eventData.velocity / 1000) / 2 + (eventData.velocity/10)
            }
        };
        Entities.editEntity(entityId, props);
        // print(JSON.stringify(eventData));
        date = Date.now();
    }

}

Midi.midiMessage.connect(midiMessageReceived);

// Midi.sendMidiMessage(0,1,9,55,100);
// var timer = Script.setInterval(function(){
//     Midi.sendMidiMessage(0  ,1,9,55,100);
// },250);
