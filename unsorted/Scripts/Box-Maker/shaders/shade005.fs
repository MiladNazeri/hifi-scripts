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
uniform float uAlphaCutoff = 0.5;

uniform float uZCutOff = -0.20;

uniform float speed = 0.1;

uniform float uSpecular = 1.0;


float getProceduralColors(out vec3 diffuse, out vec3 specular, out float shininess)
{

// if (_position.x < uZCutOff) {
// 		discard;
// 	}
vec3 position = _position.xyz;
/*
    Grab the texture from the iChannel0  Sampler, and make it into a texture, with the position being calculated from the row and the column and the current pixel.

*/
vec4 iTexture = texture(iChannel0, position.xy + sin(iGlobalTime)).rgba;
/*
    If the alpha for the position is less than contrast value, then discard it
*/
if ( iTexture.a < uAlphaCutoff ) {
    discard;
}
/*
    Now applying the fragments color, shine, and returning the emit;
*/
diffuse = iTexture.rgb;
// shininess = uShine;
// return uEmit;

// vec3 randColor = vec3(0.4);

// vec3 p = _position.xyz*iGlobalTime*4 * speed;
// vec3 pos = _position.xyz * iWorldScale.xyz;
// float noise = snoise(p * speed);
// noise = noise/1.0+0.5; //convert to [0,1]

// diffuse = aspectCorrectedTexture();

// 0 -255
shininess = uShine;
specular = vec3(uSpecular,uSpecular, uSpecular);
//emit 0 - 1
return uEmit;
}
