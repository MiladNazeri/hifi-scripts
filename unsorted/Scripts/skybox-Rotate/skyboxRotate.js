(function(){

    var _entityId;
    var props;
    var updateTimer;
    var updateTime = 1000;

    function SkyBoxMod(){

    }

    function getProps(){
        props = Entities.getEntityProperties(_entityId, ['color', 'orientation']);
    }

    function updateHandler(){
        getProps();
        var newProps = {
            color: pickRandomColor,
            orientation: pickRandomRotation
        };
        Entities.editEntity(_entityId, newProps);
    }

    var pickRandomColor = function(){
        var randomRed = Math.floor(Math.random() * 255);
        var randomGreen = Math.floor(Math.random() * 255);
        var randomBlue = Math.floor(Math.random() * 255);
		
        return {red: randomRed, green: randomGreen, blue: randomBlue};
    };

    var pickRandomRotation = function(){
        var randomRotX = 0; // Math.random();
        var randomRotY = 0; // Math.random();
        var randomRotZ = 0; // Math.random();
        var randomRotW = 0; Math.random() * 0.5;
        return ({x: randomRotX, y: randomRotY, z: randomRotZ, w: randomRotW});
    };

    SkyBoxMod.prototype = {
        preload: function(id) {
            _entityId = id;
            updateTimer = Script.setInterval(updateHandler, updateTime);
        },
        unload: function(){

        }
    };


    Script.scriptEnding.connect(function(){
        Script.clearInterval(updateTimer);
    });

    return new SkyBoxMod();
});