/*
uniform float emit = 0.0;
uniform vec3 hide = vec3(.4);
uniform vec2 threshold = vec2(0.59,0.6);
uniform vec3 diffuse_color = vec3(0.0, 1.0, 0.0);
uniform float diffuse_intensity = 1.0;
uniform float specular_hardness = 346.0;
uniform float specular_intensity = 0.5405405759811401;
uniform vec3 specular_color = vec3(1.0, 0.0, 0.5043444633483887);
uniform bool wade = true;
uniform vec3 cutoff = vec3(0.0);
// HIFI PROCEDURAL_V1
vec4 xxgetProceduralColor() {
    vec3 diffuse = diffuse_color * diffuse_intensity;
    return vec4(diffuse,1);
}

const vec4 BLUE = vec4(0.0, 0.0, 1.0, 1.0);
const vec4 YELLOW = vec4(1.0, 1.0, 0.0, 1.0);
uniform vec3 iSize = vec3(1.0,2.0,4.0);
uniform float iSpeed = 0.5;

vec4 getNoiseColor() {
    float intensity = 0.0;
    vec3 position = _position.xyz;
    position = normalize(position);
    float time = iGlobalTime * iSpeed;
    for (int i = 0; i < 4; ++i) {
        float modifier = pow(2, i);
        vec3 noisePosition = position * iSize * .5 * modifier;
        float noise = snoise(vec4(noisePosition, time));
        noise /= modifier;
        intensity += noise;
    }
    intensity /= 2.0; intensity += 0.5;
    return (intensity * BLUE) + (1.0 - intensity) * YELLOW;
}

float aspect(vec2 v) {
    return v.x / v.y;
}

#ifdef asodifjsodi
vec3 aspectCorrectedTexture() {
    vec2 uv;

    if (abs(_position.y) > 0.4999) {
        uv = _position.xz;
    } else if (abs(_position.z) > 0.4999) {
        uv = _position.xy;
    } else {
        uv = _position.yz;
    }
    uv += 0.5;
    uv.y = 1.0 - uv.y;
    return texture(iChannel0, uv).rgb;
}
#endif

// HIFI PROCEDURAL_V2
float getProceduralColors(inout vec3 diffuse, inout vec3 specular, inout float shininess) {

    specular = specular_color * specular_intensity;
    diffuse = diffuse_color * diffuse_intensity;
    shininess = specular_hardness * ( 128.0 / 510.0 );
    //if (length(_position.xyz - iWorldPosition.xyz) > .0) discard;
    vec4 noiseColor = getNoiseColor();

    if (hide.w != 0.0 && iChannelResolution[0].x != 0) {
       diffuse = aspectCorrectedTexture();
    }
    //if (_normal.z < 0) discard;
    if (cutoff.x != 0.0 && _position.x > cutoff.x)
        discard;
    if (cutoff.y != 0.0 && _position.y > cutoff.y)
        discard;
    if (cutoff.z != 0.0 && _position.z > cutoff.z)
        discard;
    if (abs(_position.x) > hide.x && abs(_position.y) > hide.y && abs(_position.z) > hide.z) {
        shininess *= (noiseColor.r + noiseColor.g);
        diffuse /= noiseColor.g;//3.0;//vec3(0.0);
        specular *= noiseColor.rgb;
        if (noiseColor.r < threshold.r && noiseColor.b > threshold.g) discard;
        //discard;
        //return emit == 0.0 ? 1.0 : 0.0;
        return wade ? emit : 2000.0;
    }

    return emit;
}
*/

const vec3 RED = vec3(1.0, 0.0, 0.0);
const vec3 GREEN = vec3(0.0, 1.0, 0.0);
const vec3 BLUE = vec3(0.0, 0.0, 1.0);

float getProceduralColors(out vec3 diffuse, out vec3 specular, out float shininess)
{
diffuse = BLUE;
specular = vec3(0.0, 0.0, 0.0);
shininess = DEFAULT_SHININESS;
return 1.0;
}
