var id_size_factor = $("#size_factor");
var id_offset_multiplier = $("#offset_multiplier");
var id_keys = $("#keys");
var id_key_offset = $("#key_offset");
var id_key_x_size_multiplier = $("#key_x_size_multiplier");
var id_key_y_size_multiplier = $("#key_y_size_multiplier");
var id_key_z_size_multiplier = $("#key_z_size_multiplier");
var id_color_frequency = $("#color_frequency");
var id_x_size_multiplier = $("#x_size_multiplier");
var id_y_size_divider = $("#y_size_divider");
var id_y_size_multiplier = $("#y_size_multiplier");
var id_octaves = $("#octaves");


var id_update = $("#update");

var config = {
    size_factor: 0.125,
    offset_multiplier: 0.15,
    keys: 88,
    key_offset: 20,
    key_x_size_multiplier: 0.1,
    key_y_size_multiplier: 1.0,        
    key_z_size_multiplier: 0.1,        
    color_frequency: 0.3,
    x_size_multiplier: 1.25,
    y_size_divider: 3,
    y_size_multiplier: 2,
    octaves: 8
}

console.log(JSON.stringify(config))
$(document).ready(() => {
    console.log("TEST ON READY")
    id_size_factor.val(config.size_factor);
    id_offset_multiplier.val(config.offset_multiplier);
    id_keys.val(config.keys);
    id_key_offset.val(config.key_offset)
    id_key_x_size_multiplier.val(config.key_x_size_multiplier)
    id_key_y_size_multiplier.val(config.key_y_size_multiplier)
    id_key_z_size_multiplier.val(config.key_z_size_multiplier)
    id_color_frequency.val(config.color_frequency)
    id_x_size_multiplier.val(config.x_size_multiplier)
    id_y_size_divider.val(config.y_size_divider)
    id_y_size_multiplier.val(config.y_size_multiplier)
    id_octaves.val(config.octaves)
})

id_update.on("click", function() {
    var event = {
        type: "update",
        config: {
            size_factor: id_size_factor.val(),
            offset_multiplier: id_offset_multiplier.val(),
            keys: id_keys.val(),
            key_offset: id_key_offset.val(),
            key_x_size_multiplier: id_key_x_size_multiplier.val(),
            key_y_size_multiplier: id_key_y_size_multiplier.val(),
            key_z_size_multiplier: id_key_z_size_multiplier.val(),
            color_frequency: id_color_frequency.val(),
            x_size_multiplier: id_x_size_multiplier.val(),
            y_size_divider: id_y_size_divider.val(),
            y_size_multiplier: id_y_size_multiplier.val(),
            octaves: id_octaves.val()
        }

    };
    EventBridge.emitWebEvent(JSON.stringify(event));
});