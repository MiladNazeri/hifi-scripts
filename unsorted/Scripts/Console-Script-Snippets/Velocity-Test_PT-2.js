var ballID = "{e0481d4d-e3de-44ef-b77d-2830ea6eda0a}";
var boundaryID1 = "{2d76a83a-3854-4b68-b523-c4c1480a9a0d}";
var boundaryID2 = "{0c382dfa-741e-4c81-9145-90baaa423834}";
var bound1Pos = Entities.getEntityProperties(boundaryID1, ["position"]).position;
var bound2Pos = Entities.getEntityProperties(boundaryID2, ["position"]).position;
var difference = Vec3.subtract(bound1Pos,bound2Pos);

var counter = 0;
var scriptInt = null;
var vec = {};
vec.x = 0;
vec.y = 0;
vec.z = 0;
var BPM = 2.3333333;
var miliSec = 500;
Entities.editEntity(ballID, { position: bound2Pos});
scriptInt = Script.setInterval(function() {
    print("running int func");
    var props = {};
    if (counter % 2 === 0) {
        print("0");
        vec = Vec3.multiply(BPM,difference);
        props.velocity = vec;
        Entities.editEntity(ballID, props);
    } else {
        print("!0")
        vec = Vec3.multiply(-BPM,difference);
        props.velocity = vec;
        Entities.editEntity(ballID, props);
    }
    counter++;
}, miliSec);
