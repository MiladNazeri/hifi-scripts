var pos = { x: 48, y: -10, z: -35};

Agent.isAvatar = true;

Avatar.position = pos;

Agent.isListeningToAudioStream = true;

var messageChannel = "Avatar-Listener";

function onUpdate(){
    Messages.sendMessage(messageChannel, JSON.stringify(Agent.lastReceivedAudioLoudness));
}


Script.update.connect(onUpdate)

Script.scriptEnding.connect(onUpdate);