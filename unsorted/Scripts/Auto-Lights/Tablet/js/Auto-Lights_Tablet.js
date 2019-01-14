var id_speed_control = $("#speed_control");
var id_pitch_control = $("#pitch_control");
var id_yaw_control = $("#yaw_control");
var id_roll_control = $("#roll_control");
var id_falloff_control = $("#falloff_control");
var id_exponent_control = $("#exponent_control");
var id_cutoff_control = $("#cutoff_control");
var id_intensity1_control = $("#intensity1_control");
var id_intensity2_control = $("#intensity2_control");
var id_red1_control = $("#red1_control");
var id_green1_control = $("#green1_control");
var id_blue1_control = $("#blue1_control");
var id_red2_control = $("#red2_control");
var id_green2_control = $("#green2_control");
var id_blue2_control = $("#blue2_control");

var id_update = $("#update");

id_update.on("click", function() {
    var event = {
        type: "update",
        speed_control: id_speed_control.val(),
        pitch_control: id_pitch_control.val(),
        yaw_control: id_yaw_control.val(),
        roll_control: id_roll_control.val(),
        falloff_control: id_falloff_control.val(),
        exponent_control: id_exponent_control.val(),
        cutoff_control: id_cutoff_control.val(),
        intensity1_control: id_intensity1_control.val(),
        intensity2_control: id_intensity2_control.val(),
        red1_control: id_red1_control.val(),
        blue1_control: id_blue1_control.val(),
        green1_control: id_green1_control.val(),
        red2_control: id_red2_control.val(),
        blue2_control: id_blue2_control.val(),
        green2_control: id_green2_control.val()
    };
    EventBridge.emitWebEvent(JSON.stringify(event));
});