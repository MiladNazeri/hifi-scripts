
var AVERAGING_RATIO = 0.05;
var LOUDNESS_FLOOR = 11.0;
var LOUDNESS_SCALE = 2.8 / 5.0;
console.log(LOUDNESS_SCALE);
var LOG2 = Math.log(2.0);
console.log(LOG2);
var AUDIO_PEAK_DECAY = 0.02;
var myData = {}; // we're not includied in ExtendedOverlay.get.


// Users.getAvatarGain(null) Users.getAvatarGain(uuid) or something

function updateAudioLevel(avatarData) {

    // scale audio
    function scaleAudio(val) {
        var audioLevel = 0.0;
        if (val <= LOUDNESS_FLOOR) {
            audioLevel = val / LOUDNESS_FLOOR * LOUDNESS_SCALE;
        } else {
            audioLevel = (val - (LOUDNESS_FLOOR - 1)) * LOUDNESS_SCALE;
        }
        if (audioLevel > 1.0) {
            audioLevel = 1;
        }
        return audioLevel;
    }
    console.log("test");
    console.log(scaleAudio(1));
    console.log(scaleAudio(1));
    // the VU meter should work similarly to the one in AvatarInputs: log scale, exponentially averaged
    // But of course it gets the data at a different rate, so we tweak the averaging ratio and frequency
    // of updating (the latter for efficiency too).
    var audioLevel = 0.0;
    var avgAudioLevel = 0.0;

    var data = avatarData.sessionUUID === "" ? myData : ExtendedOverlay.get(avatarData.sessionUUID); // previous[uuid].accumulated level or live

    if (data) {
        // we will do exponential moving average by taking some the last loudness and averaging
        data.accumulatedLevel = AVERAGING_RATIO * (data.accumulatedLevel || 0) + (1 - AVERAGING_RATIO) * (avatarData.audioLoudness);

        // add 1 to insure we don't go log() and hit -infinity.  Math.log is
        // natural log, so to get log base 2, just divide by ln(2).
        audioLevel = scaleAudio(Math.log(data.accumulatedLevel + 1) / LOG2);

        // decay avgAudioLevel
        avgAudioLevel = Math.max((1 - AUDIO_PEAK_DECAY) * (data.avgAudioLevel || 0), audioLevel);

        // data.avgAudioLevel = avgAudioLevel;
        // data.audioLevel = audioLevel;

        // now scale for the gain.  Also, asked to boost the low end, so one simple way is
        // to take sqrt of the value.  Lets try that, see how it feels.
        avgAudioLevel = Math.min(1.0, Math.sqrt(avgAudioLevel * (sessionGains[avatarData.sessionUUID] || 0.75)));
    }

    live[uuid].audioLoudness = audioLevel;
    live[uuid].accumulatedLevel = accumulatedLevel;
    live[uuid].avgAudioLevel = avgAudioLevel;

    return audioLevel;

    // var param = {};
    // var level = [audioLevel, avgAudioLevel];
    // var userId = avatarData.sessionUUID;
    // param[userId] = level;
    // sendToQml({ method: 'updateAudioLevel', params: param });
}