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

function midiMessageReceived(eventData){
    print(JSON.stringify(eventData));
}

Midi.midiMessage.connect(midiMessageReceived);

Midi.sendMidiMessage(0,1,9,55,100);
var timer = Script.setInterval(function(){
    Midi.sendMidiMessage(1,1,9,55,100);
},250);
