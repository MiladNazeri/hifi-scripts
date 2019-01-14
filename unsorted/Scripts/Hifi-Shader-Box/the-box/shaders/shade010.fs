vec3 aspectCorrectedTexture() {
    vec2 uv;

    if (abs(_position.y) > 0.4999) {
        uv = _position.xz;
    } else if (abs(_position.z) > 0.4999) {
        uv = _position.xy;
    } else {
        uv = _position.yz;
    }
    // uv += 0.5;
    // uv.y = 1.0 - uv.y;
    return texture(iChannel0, uv).rgb;
}
// shine of the value. set from 0-255
uniform float uShine = 1.0;
// Emit, 0-1;
uniform float uEmit = 1.0;
// Since shaders don't support alpha mapping, this is used
uniform float uAlphaCutoff = 0.1;

uniform float uZCutOff = -0.20;

uniform float speed = 0.1;

uniform float uSpecular = 1.0;


float getProceduralColors(out vec3 diffuse, out vec3 specular, out float shininess)
{
specular = _modelNormal.rgb;
if (any(lessThan(specular, vec3(0.0)))) {
    specular = vec3(1.0) + specular;
}

vec3 position = _position.xyz;

vec4 iTexture = texture(iChannel0, position.xy).rgba;

diffuse = vec3(0.4, 1.0, 1.0);

// 0 -255
shininess = uShine;
specular = vec3(uSpecular,uSpecular, uSpecular);
//emit 0 - 1
return uEmit;
}
