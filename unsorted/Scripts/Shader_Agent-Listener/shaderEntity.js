(function(){
    var _entity;

    var messageChannel = "Avatar-Listener";


    function onMessageReceived(chan, mesg){
        var message = Number(mesg);
        console.log("message Received", message);
        var userData = {
            "ProceduralEntity": {
                "shaderUrl": "https://hifi-content.s3.amazonaws.com/milad/ROLC/Organize/Projects/Domains/Rust/Shader/shader.glsl",
                "version": 2,
                "uniforms": {
                    "test": message
                }
            }
        }

        var props = {
            userData: JSON.stringify(userData)
        }
        Entities.getEntityProperties(_entity, props);
    }

    this.preload = function(id){
        _entity = id;
        Messages.subscribe(messageChannel)
        Messages.messageReceived.connect(onMessageReceived);

    }
    this.unload = function(){
        Messages.unsubscribe(messageChannel)
    }

})