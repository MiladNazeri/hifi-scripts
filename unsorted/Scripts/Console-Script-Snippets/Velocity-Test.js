var ballID = "{1f587381-6b0b-4570-a17e-a62ee38f0f1b}";
var counter = 0;
var scriptInt = null;
var vec = {};
vec.x = 0;
vec.y = 0;
vec.z = 0;
var BPM = 2.3333333;
var miliSec = 500;
scriptInt = Script.setInterval(function() {
    print("running int func");
    var props = {};
    if (counter % 2 === 0) {
        print("0")
        vec.x = BPM;
        props.velocity = vec;
        Entities.editEntity(ballID, props);
    } else {
        print("!0")
        vec.x = -BPM;
        props.velocity = vec;
        Entities.editEntity(ballID, props);
    }
    counter++;
}, miliSec);


var counter = 0;
var interval = 100;
var intervalRef;
function functionToCall() {
    counter++;
    print(counter);
    if(counter === 10) {
        Script.clearInterval(intervalRef)
    }
}
intervalRef = Script.setInterval(functionToCall(),interval);