// uniform float red;
//
// float getProceduralColors(vec3 diffuse, vec3 specular, float shininess) {
//     // vec2 position = _position.xz;
//     // position += 0.5;
//     // mainImage(result, position * iWorldScale.xz);
//     diffuse = vec3(0.8,0.0,0.0);
//     specular = vec3(1.0);
//     shininess = 1.0;
//     return 1.0;
// }

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


// const vec3 RED = vec3(1.0, 0.0, 0.0);
// const vec3 GREEN = vec3(0.0, 1.0, 0.0);
// const vec3 BLUE = vec3(0.0, 0.0, 1.0);
uniform float speed = 0.1;
float getProceduralColors(out vec3 diffuse, out vec3 specular, out float shininess)
{
vec3 RED = vec3(abs(sin(20)));
vec3 GREEN = vec3(abs(sin(2)));
vec3 BLUE = vec3(abs(sin(20)));

vec3 p = _position.xyz*iGlobalTime*4 * speed;
vec3 pos = _position.xyz * iWorldScale.xyz;
float noise = snoise(p * speed);
noise = noise/4.0+0.5; //convert to [0,1]
diffuse = aspectCorrectedTexture() * noise;

// if (pos.x > 0) {
//     diffuse = vec3(0.5,0.4,noise);
// }
// if (pos.x < 0) {
//     diffuse = vec3(noise,0.4,noise);
// }
// if (pos.y > 0) {
//     diffuse = vec3(0.5,0.4,noise);
// }
// if (pos.y < 0) {
//     diffuse = vec3(noise,0.4,noise);
// }if (pos.z > 0) {
//     diffuse = vec3(0.5,0.4,noise);
// }
// if (pos.z < 0) {
//     diffuse = vec3(noise,0.4,noise);
// }
// if (_position.x > 200) {
//     diffuse = vec3(noise) *RED;
// }
// if (_position.y > 100) {
//     diffuse = vec3(noise) *GREEN;
// }
// if (_position.z > 50) {
//     diffuse = vec3(noise) *BLUE;
// }


specular = vec3(0);
return 1.0;
}
/*
float getProceduralColors(out vec3 diffuse, out vec3 specular, out float shininess)
{
vec3 RED = vec3(abs(sin(20)));
vec3 GREEN = vec3(abs(sin(2)));
vec3 BLUE = vec3(abs(sin(20)));

vec3 p = _position.xyz*iGlobalTime*4 * speed;
vec3 pos = _position.xyz * iWorldScale.xyz;
float noise = snoise(p * speed);
noise = noise/4.0+0.5; //convert to [0,1]
if (pos.x > 0) {
    diffuse = vec3(0.5,0.4,noise);
}
if (pos.x > 4) {
    diffuse = vec3(noise,0.4,noise);
}
if (int(pos.x) % 4 == 0) {
    diffuse = vec3(noise,0.4,noise);

}
if (pos.y > 2) {
    diffuse = vec3(noise,0.4,noise);

}
if (pos.z < 0) {
    diffuse = vec3(noise,0.4,noise);

}
// if (_position.x > 200) {
//     diffuse = vec3(noise) *RED;
// }
// if (_position.y > 100) {
//     diffuse = vec3(noise) *GREEN;
// }
// if (_position.z > 50) {
//     diffuse = vec3(noise) *BLUE;
// }


specular = vec3(0);
return 1.0;
}
*/

/*
const vec3 RED = vec3(1.0, 0.0, 0.0);
const vec3 GREEN = vec3(0.0, 1.0, 0.0);
const vec3 BLUE = vec3(0.0, 0.0, 1.0);

float getProceduralColors(out vec3 diffuse, out vec3 specular, out float shininess)
{
vec3 p = _position.xyz*iGlobalTime*10000000;
vec3 pos = _position.xyz * iWorldScale.xyz;
float noise = snoise( p);
noise = noise/0.0+0.5; //convert to [0,1]
if (pos.x > 0) {
    diffuse = RED * vec3(noise);
}
if (pos.x > 4) {
    diffuse = RED * p;
}
if (int(pos.x) % 2 == 0) {
    diffuse = BLUE * p;
}
if (pos.y > 0) {
    diffuse = BLUE * vec3(noise);
}
if (pos.z > 0) {
    diffuse = GREEN * vec3(noise);
}
// if (_position.x > 200) {
//     diffuse = vec3(noise) *RED;
// }
// if (_position.y > 100) {
//     diffuse = vec3(noise) *GREEN;
// }
// if (_position.z > 50) {
//     diffuse = vec3(noise) *BLUE;
// }


specular = vec3(0.5);
return 0.2 * noise;
}
*/

/*
const vec3 RED = vec3(1.0, 0.0, 0.0);
const vec3 GREEN = vec3(0.0, 1.0, 0.0);
const vec3 BLUE = vec3(0.0, 0.0, 1.0);

float getProceduralColors(out vec3 diffuse, out vec3 specular, out float shininess)
{
vec3 p = _position.xyz*sin(iGlobalTime*1) + 2;
vec3 pos = _position.xyz * iWorldScale.xyz;
float noise = snoise( p);
noise = noise/0.0+0.1; //convert to [0,1]
if (pos.x > 0) {
    diffuse = RED * vec3(noise);
}
if (pos.x > 4) {
    diffuse = RED * p;
}
if (int(pos.x) % 2 == 0) {
    diffuse = BLUE * p;
}
if (pos.y > 0) {
    diffuse = BLUE * vec3(noise);
}
if (pos.z > 0) {
    diffuse = GREEN * vec3(noise);
}
// if (_position.x > 200) {
//     diffuse = vec3(noise) *RED;
// }
// if (_position.y > 100) {
//     diffuse = vec3(noise) *GREEN;
// }
// if (_position.z > 50) {
//     diffuse = vec3(noise) *BLUE;
// }


specular = vec3(0.5);
return 0.2 * noise;
}

*/

/*
const vec3 RED = vec3(1.0, 0.0, 0.0);
const vec3 GREEN = vec3(0.0, 1.0, 0.0);
const vec3 BLUE = vec3(0.0, 0.0, 1.0);

float getProceduralColors(out vec3 diffuse, out vec3 specular, out float shininess)
{
vec3 RED = vec3(abs(sin(iGlobalTime)));
vec3 GREEN = vec3(abs(sin(iGlobalTime)));
vec3 BLUE = vec3(abs(sin(iGlobalTime)));

vec3 p = _position.xyz*sin(iGlobalTime*1 + 1000) + 2;
vec3 pos = _position.xyz * iWorldScale.xyz;
float noise = snoise( p);
noise = noise/0.0+0.1; //convert to [0,1]
if (pos.x > 0) {
    diffuse = RED * vec3(noise);
}
if (pos.x > 2) {
    diffuse = RED * pos;
}
if (int(pos.x) % 2 == 0) {
    diffuse = BLUE * p;
}
if (pos.y > 0) {
    diffuse = BLUE * vec3(noise);
}
if (pos.z > 0) {
    diffuse = GREEN * vec3(noise);
}
// if (_position.x > 200) {
//     diffuse = vec3(noise) *RED;
// }
// if (_position.y > 100) {
//     diffuse = vec3(noise) *GREEN;
// }
// if (_position.z > 50) {
//     diffuse = vec3(noise) *BLUE;
// }


specular = vec3(1.5);
return 1.0;
}

*/
