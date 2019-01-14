(function(){

    var _entityId,
        soundURL,
        soundObject,
        soundPlaying;

    soundURL = "https://s3.amazonaws.com/hifi-public/sounds/Drums/deepdrum1.wav";
    soundObject = SoundCache.getSound(soundURL);

    function Sound_Zone_Server(){

    }

    Sound_Zone_Server.prototype = {
        remotelyCallable: [
            'playSound',
            'stopSound'
        ],
        preload: function(id){
            _entityId = id;

        },
        playSound: function(position){
            Audio.playSound(soundObject,{
                position: JSON.parse(position),
                volume: 1.0,
                loop: false
            });
        },
        stopSound: function(){
            soundObject.stop();
        },
        unload: function(){

        }
    };

    return new Sound_Zone_Server();
});