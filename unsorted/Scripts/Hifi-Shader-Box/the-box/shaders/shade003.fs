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

uniform float speed = 0.1;

float getProceduralColors(out vec3 diffuse, out vec3 specular, out float shininess)
{
vec3 randColor = vec3(0.4);

vec3 p = _position.xyz*iGlobalTime*4 * speed;
vec3 pos = _position.xyz * iWorldScale.xyz;
float noise = snoise(p * speed);
noise = noise/1.0+0.5; //convert to [0,1]
diffuse = aspectCorrectedTexture() * noise;

// 0 -255
shininess = 100.0;
specular = vec3(0.3, 0.5, 0.7);
//emit 0 - 1
return 1.0;
}
