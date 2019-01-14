function convertObject(object){
    var newObject = {};
    for (var key in object) {
        if (!object[key]) {
            continue;
        }
        newObject[key] = object[key]
        if ( typeof object[key] === "object" ) {
            newObject[key] = convertObject(object[key]);
        }
        if ( typeof object[key] === "number") {
            newObject[key] = object[key].toFixed(3);
        }

    }
    return newObject;
}