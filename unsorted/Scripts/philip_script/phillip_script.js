// test script to transform controller data from avatar space into sensor space.

var VELOCITY_MULTIPLIER = 5.0;
var TRIGGER_ON = 0.9;
var TRIGGER_OFF = 0.5;
var SMOOTH_VELOCITY = 0.9;
var SMOOTH_ROTATION = 0.9;
var LEFT = 0;
var RIGHT = 1;

var MAX_SENSOR_CHANGE = 0.10;

var previousSensorPosition = [];
var previousPose = [];
var smoothedVelocity = [];
var smoothedRotation = [];
var isGrabbing = [false, false];
var motorOn = false;

// *************************************
// START LOCOMOTION
// *************************************
// #region LOCOMOTION


function resetMotor() {
    MyAvatar.motorTimescale = 100.0;
    MyAvatar.motorVelocity = Vec3.ZERO;
    MyAvatar.motorReferenceFrame = "world";
}


// #endregion
// *************************************
// END LOCOMOTION
// *************************************
function update(dt) {
    [LEFT, RIGHT].forEach(function(hand){
        var gripValue = Controller.getValue((hand === 0) ? Controller.Standard.LeftGrip : Controller.Standard.RightGrip );
        var squeezed = gripValue > TRIGGER_ON;
        var released = gripValue < TRIGGER_OFF;
        var justStarted = false;
        if (squeezed && !isGrabbing[hand]) {
            print("Grab!");
            isGrabbing[hand] = true;
            justStarted = true;
            smoothedVelocity[hand] = Vec3.ZERO;
            smoothedRotation[hand] = Quat.angleAxis(0, Quat.getUp(MyAvatar.orientation));
        }
        if (squeezed) {
            // controller poses are in avatar space
            var pose = Controller.getPoseValue((hand == 1) ? Controller.Standard.RightHand : Controller.Standard.LeftHand);
            var sensorToWorldMatrix = MyAvatar.getSensorToWorldMatrix();
            var worldToSensorMatrix = Mat4.inverse(sensorToWorldMatrix);
            var avatarToWorldMatrix = Mat4.createFromRotAndTrans(MyAvatar.orientation, MyAvatar.position);
            //var worldToAvatarMatrix = Mat4.inverse(avatarToWorldMatrix);
            var sensorPosition = Mat4.transformPoint(
                worldToSensorMatrix, 
                Mat4.transformPoint(avatarToWorldMatrix, pose.translation)
            );

            if (!justStarted) {
                var sensorDelta = Vec3.subtract(previousSensorPosition[hand], sensorPosition);

                if (Vec3.length(sensorDelta) < MAX_SENSOR_CHANGE) {
                    // transform sensorDelta into world space.
                    var worldDelta = Mat4.transformVector(sensorToWorldMatrix, sensorDelta);
                    // convert worldDelta into a velocity to apply the the avatar motor
                    smoothedVelocity[hand] = Vec3.sum(
                        Vec3.multiply(smoothedVelocity[hand], SMOOTH_VELOCITY), 
                        Vec3.multiply(
                            Vec3.multiply(
                                worldDelta, 
                                1 / dt * VELOCITY_MULTIPLIER), 
                            1.0 - SMOOTH_VELOCITY)
                    );

                    // Rotate your body the way you are rotating your hand, only a bit smoother
                    var previousAzimuth = Quat.getFront(previousPose[hand].rotation);
                    previousAzimuth.y = 0;
                    var currentAzimuth = Quat.getFront(pose.rotation);
                    currentAzimuth.y = 0;
                    smoothedRotation[hand] = Quat.mix(Quat.rotationBetween(currentAzimuth, previousAzimuth), smoothedRotation[hand], SMOOTH_ROTATION);
                    MyAvatar.orientation = Quat.multiply(MyAvatar.orientation, smoothedRotation[hand]);
                } else {
                    // Something went wrong, and we suddenly got a big change in the sensor position!
                    print("sensorDelta Error " + Vec3.length(sensorDelta));
                }

            }
            previousPose[hand] = pose;
            previousSensorPosition[hand] = sensorPosition;
        }

        if (isGrabbing[hand] && released) {
            isGrabbing[hand] = false;
            smoothedVelocity[hand] = Vec3.ZERO;
            print("Release!");
        }
    });
    // Add up and apply motor forces
    if (isGrabbing[LEFT] || isGrabbing[RIGHT]) {
        MyAvatar.motorVelocity = Vec3.sum(smoothedVelocity[LEFT], smoothedVelocity[RIGHT]);
        MyAvatar.motorTimescale = dt;
        MyAvatar.motorReferenceFrame = "world";
        motorOn = true;
    }
    // Reset motor if both hands are released 
    if (motorOn && !isGrabbing[LEFT] && !isGrabbing[RIGHT]) {
        print("Reset Motor");
        resetMotor();
        motorOn = false;
    }
}


// *************************************
// START CLEANUP
// *************************************
// #region CLEANUP


function scriptEnding() {
    resetMotor();
}


Script.update.connect(update);
Script.scriptEnding.connect(scriptEnding);


// #endregion
// *************************************
// END CLEANUP
// *************************************

