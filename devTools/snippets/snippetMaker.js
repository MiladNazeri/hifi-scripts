/*
    EXAMPLE snipppet output
    "easyLog": {
     "scope": "javascript",
     "prefix": "h-l",
     "body": [
         "var log = Script.require('https://hifi-content.s3.amazonaws.com/milad/ROLC/d/ROLC_High-Fidelity/02_Organize/O_Projects/Repos/hifi-content/developerTools/sharedLibraries/easyLog/easyLog.js')",
         ""
     ],
     "description": "Log output to console"
    }
*/

// WRITE the JS snippet here.  add \ for anything that shouldn't be an actual template literal
var snippet = `
test \${1:name};
test \${2:name};
`

var NAME = "test";
var SCOPE = "javascript";
var PREFIX = "t-1";
var BODY = bodyMaker(snippet);
var DESCRIPTION = "test description"; 

function bodyMaker(snippet) {
    return snippet.split('\n'); 
}

function makeSnippet(name, scope, prefix, body, description){
    var object = {};
    object[name] = {};
    object[name].scope = scope;
    object[name].prefix = prefix;
    object[name].body = body;
    object[name].description = description;
    return object;
}

var finalSnippet = JSON.stringify(makeSnippet(NAME, SCOPE, PREFIX, BODY, DESCRIPTION), null, 4);

console.log(finalSnippet);
