const INPUT = false;
const OUTPUT = true;
const ENABLE = true;
const DISABLE = false;

module.exports = function(config) {
    // Midi
    var config = config || {};
    var midiInDevice = config.midiInDevice;
    var midiOutDevice = config.midiOutDevice;
    var midiChannel = config.midiChannel;
    var midiEventReceived = config.midiEventReceived;
    var midiInDeviceId = -1;
    var midiOutDeviceId = -1;
    var midiInDeviceList = [];
    var midiOutDeviceList = [];

    function midiHardwareResetReceieved(){
        seedMidiInputsList();
        seedMidiOutputsList();
        getMidiDeviceIds();
        unblockMidiDevice();
    }

    function unblockMidiDevice(){
        Midi.unblockMidiDevice(midiOutDevice, OUTPUT);
        Midi.unblockMidiDevice(midiInDevice, INPUT);
    }

    function midiConfig(){
        Midi.thruModeEnable(DISABLE);
        Midi.broadcastEnable(DISABLE);
        Midi.typeNoteOffEnable(ENABLE);
        Midi.typeNoteOnEnable(ENABLE);
        Midi.typePolyKeyPressureEnable(DISABLE);
        Midi.typeControlChangeEnable(ENABLE);
        Midi.typeProgramChangeEnable(ENABLE);
        Midi.typeChanPressureEnable(DISABLE);
        Midi.typePitchBendEnable(DISABLE);
        Midi.typeSystemMessageEnable(DISABLE);
        midiHardwareResetReceieved();
    }

    function seedMidiInputsList(){
        var midiInDevices = Midi.listMidiDevices(INPUT);
        midiInDeviceList = midiInDevices;
    }
    
    function seedMidiOutputsList(){
        var midiOutDevices = Midi.listMidiDevices(OUTPUT);
        midiOutDeviceList = midiOutDevices;
    }
    
    function getMidiDeviceIds(){
        for (var i = 0; i < midiInDeviceList.length; i++){
            if (midiInDeviceList[i] == midiInDevice){
                midiInDeviceId = i;
            }
        }
        for (var i = 0; i < midiOutDeviceList.length; i++){
            if (midiOutDeviceList[i] == midiOutDevice){
                midiOutDeviceId = i + 1;
            }
        }
    }
    
    function getMidiInputs(){
        if (midiInDeviceList.length === 0) {
            seedMidiInputsList();
        }
        return midiInDeviceList;
    }

    function getMidiOutputs(){
        if (midiOutDeviceList.length === 0) {
            seedMidiOutputsList();
        }
        return midiOutDeviceList;
    }
    
    function registerMidiEventREceived(newMidiEventReceived){
        midi.midiMessage.disconnect(midiEventReceived);
        Midi.midiMessage.connect(newMidiEventReceived);
    }

    function registerNewConfig(newConfig){
        config = newConfig;
    }

    function setup (){
        midiConfig();
        Midi.midiReset.connect(midiHardwareResetReceieved);
        Midi.midiMessage.connect(midiEventReceived);
    }
    
    function tearDown (){
        Midi.midiReset.disconnect(midiHardwareResetReceived);
        Midi.midiMessage.disconnect(midiEventReceived);
    }

    return {
        getMidiInputs: getMidiInputs,
        getMidiOutputs: getMidiOutputs,
        unblockMidiDevice: unblockMidiDevice,
        midiHardwareResetReceieved: midiHardwareResetReceieved,
        registerNewConfig: registerNewConfig,
        setup: setup,
        tearDown: tearDown
    }
}
