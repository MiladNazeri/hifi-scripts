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


var entityId = "{02744849-34f2-4397-9a51-452bcbaff31a}";
function midiMessageReceived(eventData){
    var props = {position: {"x": eventData.velocity} };
    Entities.editEntity(entityId, props);
    print(JSON.stringify(eventData));
}

Midi.midiMessage.connect(midiMessageReceived);

// Midi.sendMidiMessage(0,1,9,55,100);
// var timer = Script.setInterval(function(){
//     Midi.sendMidiMessage(0  ,1,9,55,100);
// },250);
