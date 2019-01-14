(function(){
    var WEARABLE_SEARCH_RADIUS = 10;

    var _foundEntityID = -1;
    var _passMarketplaceID;
    var _userdataProperties;

    var foundValidTestable = false;


    var stopDancing;
    var danceInterval = 5000;

    var verificationSuccess = function(entityID) {
        print ("You may enter - verification passed for entity: " + entityID);
        Wallet.ownershipVerificationSuccess.disconnect(verificationSuccess);
        Wallet.ownershipVerificationFailed.disconnect(verificationFailed);
    };

    var verificationFailed = function(entityID) {
        print ("You may not enter - verification failed for entity: " + entityID);
        Window.location.handleLookupString(_backupLocation);
        Wallet.ownershipVerificationSuccess.disconnect(verificationSuccess);
        Wallet.ownershipVerificationFailed.disconnect(verificationFailed);
    };

    var verifyAvatarOwnership = function(entityID) {
        Wallet.proveAvatarEntityOwnershipVerification(entityID);
    };

    var searchForMatchingMarketplaceItem = function() {
        Entities.findEntitiesByType('Model', MyAvatar.position, WEARABLE_SEARCH_RADIUS).forEach(function(entityID) {
            var properties = Entities.getEntityProperties(entityID, ['marketplaceID', 'certificateID', 'parentID']);
            if (properties.marketplaceID === _passMarketplaceID && properties.parentID === MyAvatar.sessionUUID){
                _foundEntityID = entityID;
                foundValidTestable = true;
                verifyAvatarOwnership(_foundEntityID);
                Wallet.ownershipVerificationSuccess.connect(verificationSuccess);
                Wallet.ownershipVerificationFailed.connect(verificationFailed);
            }
        });
    };

    var NoDanceZone = function(){

    };

    NoDanceZone.prototype = {

        preload: function(entityID) {
            _userdataProperties = JSON.parse(Entities.getEntityProperties(entityID, 'userData').userData);
            _passMarketplaceID = _userdataProperties.marketplaceID; 
                      
        },

        enterEntity: function() {
            foundValidTestable = false;
            searchForMatchingMarketplaceItem();
            console.log("foundValidTestable", foundValidTestable);
            if (!foundValidTestable){
                if (MyAvatar.isFlying()) {
                    MyAvatar.restoreAnimation();
                }
                stopDancing = Script.setInterval(function(){
                    if (MyAvatar.isFlying()){
                        MyAvatar.restoreAnimation();
                    }
                }, danceInterval);
            }
        },
        leaveEntity: function(){
            if(stopDancing){
                Script.clearInterval(stopDancing);
            }
        }
    };

    return new NoDanceZone();

});