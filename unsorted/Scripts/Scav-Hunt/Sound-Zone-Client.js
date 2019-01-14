(function(){

    // 37.3 / -10.5 / 53.6
    var _entityId,
        _currentProps,
        _userData,
        _userdataProperties;

    function Sound_Zone_Client(){

    }

    Sound_Zone_Client.prototype = {
        preload: function(id){
            _entityId = id;
            _currentProps = Entities.getEntityProperties(id);
            _userData = _currentProps.userData;
            _userdataProperties = JSON.parse(userData);
        },
        enterEntity: function(){
            Entities.callEntityServerMethod(_entityId, 'playSound', [JSON.stringify(_userdataProperties.position)]);
        },
        leaveEntity: function(){
            Entities.callEntityServerMethod(_entityId, 'stopSound');            
        },
        unload: function(){

        }
    };

    return new Sound_Zone_Client();
});