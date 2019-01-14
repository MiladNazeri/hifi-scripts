var rightRotation = Quat.fromPitchYawRollDegrees(0,0,300)
var leftRotation = Quat.fromPitchYawRollDegrees(0,0,-300)
MyAvatar.setJointRotation("RightArm", rightRotation);
MyAvatar.setJointRotation("LeftArm", leftRotation);
