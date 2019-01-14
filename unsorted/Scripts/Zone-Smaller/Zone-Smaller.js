(function () {

    var desiredAvatarScale;
    var _userdataProperties;
    var currentProps;
    var _entityID;
    
    function getUserData(id){
        currentProps = Entities.getEntityProperties(id);
        var userData = currentProps.userData;
        _userdataProperties = JSON.parse(userData);
        desiredAvatarScale = _userdataProperties.desiredAvatarScale;
        Settings.setValue("Egypt-Old-Scale", MyAvatar.scale);
        Settings.setValue("Egypt-desiredAvatarScale", desiredAvatarScale);
    }

    function Zone_Smaller_Client() {

    }

    /*
        userData = {
            "desiredAvatarScale": 0.2
        }
    */
    Zone_Smaller_Client.prototype = {

        preload: function (id) {
            _entityID = id;
            getUserData(id);
            print("### entity ID", id);

        },
        enterEntity: function () {
            getUserData(_entityID);
            MyAvatar.scale = Settings.getValue("Egypt-desiredAvatarScale");           
        },
        leaveEntity: function () {
            print("### Caling turnOffLight");
            MyAvatar.scale = Settings.getValue("Egypt-Old-Scale");
        }
    }
    return new Zone_Smaller_Client();
})