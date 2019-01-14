let fs = require('fs');
let path = require('path');

let models = require('./models.json');

// Max numver to split by after it handles the atp and non models
let MAX_PER_JSON = process.argv[2] || 75;
// what the model files will be called in case you don't want them to just models.json
let BASE_NAME = process.argv[3] || "models";

let baseJSON = {
    "DataVersion": 28907,
    "Entities": [],
    "Id": "{b2b05f96-4ea0-42f9-a774-4ff0b58f13f6}",
    "Version": 93
};
let finalModelJSONS = [];

let structureHashMapCount = {};
let nonModelHashMapCount = {};
let structureHashMap = {};
structureHashMap.nonModel = [];
structureHashMap.atp = [];

console.log("entities length", models.Entities.length);
models.Entities.forEach(model => {
    let modelURL = model.modelURL;
    // not a model
    if (!modelURL) {
        structureHashMap.nonModel.push(model);
        return;
    }
    // is an atp url
    if (modelURL.includes("atp")) {
        structureHashMap.atp.push(model);
        return;
    }
    // is a model
    if (!structureHashMap[modelURL]){
        structureHashMap[modelURL] = [];
    }
    structureHashMap[modelURL].push(model);
});
let structureKeys = Object.keys(structureHashMap);
let nonModelKeys = structureKeys.splice(0, 2);

// Get a count for all the model JSONS and the non model ones
structureKeys.forEach(key => {
    structureHashMapCount[key] = structureHashMap[key].length;
});

nonModelKeys.forEach(key => {
    nonModelHashMapCount[key] = structureHashMap[key].length;
});

function sortNumber(a, b) {
    var aKey = Object.keys(a)[0];
    var bKey = Object.keys(b)[0];
    return b[bKey] - a[aKey];
}

var keys = Object.keys(structureHashMapCount)
    .reduce(function(prev, curr){
        var structObject = {};
        structObject[curr] = structureHashMapCount[curr];
        prev.push(structObject);
        return prev;
    }, [])
    .sort(sortNumber)

// function to create actual json
function createModelJSON(modelData){
    let finalJSON = {...baseJSON, ...{"Entities": modelData}};
    return JSON.stringify(finalJSON);
};


// Go through StructureHashMap and first make json of the non models and the atp stuff
finalModelJSONS.push(createModelJSON(structureHashMap["nonModel"]));
finalModelJSONS.push(createModelJSON(structureHashMap["atp"]));

// Now go through StructureHashMap and create groups that don't go over the max totals

let currentCount = 0; 
let tempModelArray = [];

while(keys.length > 0) {
    var keyFirst = Object.keys(keys[0]);
    if (keys[0][keyFirst] + currentCount <= MAX_PER_JSON ) {
        currentCount += keys[0][keyFirst];
        tempModelArray = tempModelArray.concat(structureHashMap[keyFirst]);
        keys.shift();
    } else {
        finalModelJSONS.push(createModelJSON(tempModelArray));
        tempModelArray = [];

        currentCount = 0;
    }
}

finalModelJSONS.push(createModelJSON(tempModelArray));
tempModelArray = [];

finalModelJSONS.forEach((json, index) => {
    var entitiesLength = JSON.parse(json).Entities.length
    fs.writeFileSync(path.join(__dirname, 'out', `${BASE_NAME}_${index}.json`), json);
})