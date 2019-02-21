function preload(entityID) {
    _entityID = entityID;
    log("about to get latest userData");
    getLatestUserData();
    var options = {};
    function callback(error, result) {
        if (error){
            console.log(error)
        }

        console.log(JSON.stringify(result))
    }
    var METAVERSE_BASE = Account.metaverseServerURL;
    var url = METAVERSE_BASE + '/api/v1/commerce/balance';
    options.uri = url;
    options.method = "POST";
    // var url = "https://highfidelity.com/api/v1/commerce/history";

    request(options, callback);
}