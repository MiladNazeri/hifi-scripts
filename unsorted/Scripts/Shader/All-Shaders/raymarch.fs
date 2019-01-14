//  Taken from: https://www.shadertoy.com/view/ldy3DR
//
//  Created by Sam Gondelman on 6/9/2016
//  Copyright 2016 High Fidelity, Inc.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//

uniform float scene = 0.0;

// Raymarching constants
const float TMAX = 250.0;
const int MAX_STEPS = 200;
const float DIST_THRESHOLD = 0.00001;

// Math constants
const float PI = 3.14159265359;
const float EPS = 0.0001;
const float FLT_MAX = 1.0 / 0.000000000001; // hacky but GLSL doesn't have a FLT_MAX by default

vec3 SUN_DIR = normalize(vec3(-0.5, -1.0, -1.0));

#define clamp01(a) clamp(a, 0.0, 1.0)

struct Ray {
    vec3 src;
    vec3 dir;
    float t;
    vec3 pos;
    vec3 nor;
    int matID;
    int iter;
};

// GLSL default parameters don't seem to work so this is for any call to map
// where you don't actually care about the material of what you hit
int junkMatID;

// Primitives
// http://iquilezles.org/www/articles/distfunctions/distfunctions.htm
float sphere(vec3 p, float r) {
    return length(p) - r;
}

float cylinder(vec3 p, float r, float h) {
    vec2 d = abs(vec2(length(p.xz),p.y)) - vec2(r, h);
    return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}

float roundedBox(vec3 p, vec3 dim, float r) {
    vec3 d = abs(p) - dim;
    return length(max(d,vec3(0.0))) - r;
}

// Transformations
vec3 rX(vec3 p, float a) {
    float c = cos(radians(a));
    float s = sin(radians(a));
    vec3 q = p;
    p.y = c * q.y - s * q.z;
    p.z = s * q.y + c * q.z;
    return p;
}

vec3 rY(vec3 p, float a) {
    float c = cos(radians(a));
    float s = sin(radians(a));
    vec3 q = p;
    p.x = c * q.x + s * q.z;
    p.z = -s * q.x + c * q.z;
    return p;
}

float blend(float a, float b, float k) {
    float h = clamp(mix(1.0, (b-a)/k, 0.5), 0.0, 1.0);
    return mix(b, a, h) - k*h*(1.0-h);
}

void propose(inout float val, inout int matID, float proposedVal, int proposedMatID) {
    if (proposedVal < val) {
        val = proposedVal;
        matID = proposedMatID;
    }
}

float map(vec3 p, inout int matID) {
    float res = FLT_MAX;
    
    if (scene == 0.0 || scene > 1.0) {										// weird spheres
        vec3 cen = vec3(0.0);
        vec3 d = 0.5*normalize(vec3(1.0, 0, -1.0));
        vec3 s = 0.4*vec3(0.0, sin(iGlobalTime), 0.0);
        vec3 c = 0.4*vec3(0.0, cos(iGlobalTime), 0.0);
        float disp = 0.03*sin(20.0*p.x+iGlobalTime)*sin(40.0*p.y+iGlobalTime)*sin(60.0*p.z+iGlobalTime);
        disp *= (1.0 - smoothstep(-0.25, 0.25, cos(iGlobalTime/2.0)));
        propose(res, matID, sphere(p-cen, 0.3)+disp, 3);
        propose(res, matID, sphere(p-(cen+d.xyx+s), 0.15), 1);
        propose(res, matID, sphere(p-(cen+d.xyz+c), 0.15), 1);
        propose(res, matID, sphere(p-(cen+0.5*(-s.yxy)+0.5*vec3(0.0,1.0,0.0)), 0.15), 1);
    
        propose(res, matID, sphere(p-(cen+d.zyz-s), 0.15), 2);
        propose(res, matID, sphere(p-(cen+d.zyx-c), 0.15), 2);
        propose(res, matID, sphere(p-(cen+0.5*(s.yxy)+0.5*vec3(0.0,-1.0,0.0)), 0.15), 2);
    } else if (scene == 1.0) {											// horse
        float blendStep = (sin(iGlobalTime) / 2.0) + 0.5;
   
        float foot1 = roundedBox(rY(p-vec3(0.0,0.249,0.0), -45.0), vec3(0.11,0.09,0.12), 0.05);
        float ankle1 = cylinder(rX(rY(p-vec3(-0.15,0.75,-0.15), -50.0), 15.0), 0.09, 0.4);
        float leg1 = cylinder(rX(rY(p-vec3(-0.05,1.65,0.03), 145.0), 35.0), 0.12, 0.6);
        float thigh1 = cylinder(rX(rY(p-vec3(-0.05,2.35,0.13), 75.0), -25.0), 0.3, 0.4);
        float fullleg1 = blend(foot1, ankle1, 0.5*blendStep);
        fullleg1 = blend(fullleg1, leg1, 0.5*blendStep);
        fullleg1 = blend(fullleg1, thigh1, 0.7*blendStep);
    
        float foot2 = roundedBox(rY(p-vec3(0.0-1.5,0.249,0.0+2.0), -25.0), vec3(0.11,0.09,0.12), 0.05);
        float ankle2 = cylinder(rX(rY(p-vec3(-0.15-1.5,0.69,-0.35+2.0), -20.0), 35.0), 0.09, 0.4);
        float leg2 = cylinder(rX(rY(p-vec3(-0.05-1.5,1.59,-0.37+2.0), 145.0), 45.0), 0.12, 0.6);
        float thigh2 = cylinder(rX(rY(p-vec3(-0.05-1.5,2.29,-0.27+2.0), -180.0), -25.0), 0.3, 0.4);
        float fullleg2 = blend(foot2, ankle2, 0.5*blendStep);
        fullleg2 = blend(fullleg2, leg2, 0.5*blendStep);
        fullleg2 = blend(fullleg2, thigh2, 0.7*blendStep);
   
        float bod = cylinder(rX(rY(p-vec3(-0.15-0.25,3.5,-0.35+1.75), -40.0), -45.0), 0.7, 1.0);
        float lowerhalf = blend(fullleg1, bod, 1.3*blendStep);
        lowerhalf = blend(lowerhalf, fullleg2, 1.3*blendStep);
   
        float bod2 = cylinder(rX(rY(p-vec3(-0.4+0.7,5.0,1.4+0.8), -40.0), -10.0), 0.5, 0.8);
        float lowerhalf2 = blend(lowerhalf, bod2, 1.4*blendStep);
   
        float uparm1 = cylinder(rX(rY(p-vec3(-0.05+1.5,4.9,0.53+1.3), 115.0), 70.0), 0.12, 0.75);
        float wrist1 = cylinder(rX(rY(p-vec3(-0.05+2.2,4.45,0.53+1.7), 115.0), -10.0), 0.1, 0.6);
        float hand1 = roundedBox(rX(rY(p-vec3(-0.05+2.15,3.95,0.53+1.65), 115.0), 80.0), vec3(0.11,0.09,0.12), 0.05);    
        float lowerhalf3 = blend(uparm1, lowerhalf2, 1.3*blendStep);
        lowerhalf3 = blend(lowerhalf3, wrist1, 0.5*blendStep);
        lowerhalf3 = blend(lowerhalf3, hand1, 0.4*blendStep);
   
        float uparm2 = cylinder(rX(rY(p-vec3(-0.05,4.9,0.53+2.8), -25.0), -70.0), 0.12, 0.75);
        float wrist2 = cylinder(rX(rY(p-vec3(-0.05+0.3,4.45,0.53+3.5), -25.0), 10.0), 0.1, 0.6);
        float hand2 = roundedBox(rX(rY(p-vec3(-0.05+0.25,3.95,0.53+3.45), -25.0), -80.0), vec3(0.11,0.09,0.12), 0.05);
        lowerhalf3 = blend(uparm2, lowerhalf3, 1.3*blendStep);
        lowerhalf3 = blend(lowerhalf3, wrist2, 0.5*blendStep);
        lowerhalf3 = blend(lowerhalf3, hand2, 0.4*blendStep);
   
        float neck = cylinder(rX(rY(p-vec3(-0.4+0.7,6.3,1.4+0.8), -40.0), 5.0), 0.4, 0.6);
        lowerhalf3 = blend(neck, lowerhalf3, 0.7*blendStep);
   
        float head = roundedBox(rX(rY(p-vec3(-0.4+1.1,7.2,1.4+1.2), -40.0), -15.0), vec3(0.2,0.2,0.65), 0.2);
        float horse = blend(head, lowerhalf3, 0.7*blendStep);
   
        float tail = cylinder(rX(rY(p-vec3(-0.15-1.25,3.5,-0.35+0.75), -40.0), 45.0), 0.15, 0.8);
   
        propose(res, matID, blend(horse, tail, 0.5*blendStep), 1);
    }

    return res;
}

vec3 calculateNormal(vec3 pos) {
    const vec3 e = vec3(EPS, 0.0, 0.0);
    float p = map(pos, junkMatID);
    return normalize(vec3(map(pos + e.xyy, junkMatID) - p,
                          map(pos + e.yxy, junkMatID) - p,
                          map(pos + e.yyx, junkMatID) - p));
}

// Lighting
float directionalLightDiffuse(vec3 nor, vec3 ldir) {
    return clamp01(dot(nor, -ldir));
}

// Coloring different materials
vec3 sky(vec3 dir) {
    return mix(vec3(0.4, 0.7, 0.9),
               vec3(0.23, 0.17, 0.13),
               smoothstep(0.0, 0.7, dir.y)/2.0);
}

vec3 grey(Ray ray) {
    return vec3(0.8);
}

vec3 centerSphere(Ray ray) {
    // Weird colors
    float colStep = smoothstep(-0.25, 0.25, cos(iGlobalTime/2.0));
    vec3 sphereColor = vec3(0.0, 0.5, 0.5);
    float radius = length(ray.pos-vec3(0.0, 1.5, 0.0));
    sphereColor = mix(sphereColor, vec3(0.5, 0.5, 0.0), smoothstep(0.295, 0.3, radius));

    // Beach ball
    float phi = ceil(acos(dot(normalize(ray.pos.xz), vec2(1,0)))/(PI/3.0))+3.0*step(0.0, ray.pos.z);
    vec3 bbColor = vec3(0.0);
    bbColor += vec3(1.0,0.0,0.0)*step(0.5, phi)*step(phi, 1.5);
    bbColor += vec3(1.0)*step(1.5, phi)*step(phi, 2.5);
    bbColor += vec3(0.0,0.0,1.0)*step(2.5, phi)*step(phi, 3.5);
    bbColor += vec3(1.0,0.5,0.0)*step(3.5, phi)*step(phi, 4.5);
    bbColor += vec3(0.75,0.7,0.3)*step(4.5, phi)*step(phi, 5.5);
    bbColor += vec3(0.0,1.0,0.0)*step(5.5, phi)*step(phi, 6.5);

    bbColor = mix(vec3(1.0), bbColor, step(0.01, dot(ray.pos.xz, ray.pos.xz)));

    return mix(sphereColor, bbColor, colStep);
}

vec3 computeColor(Ray ray) {
    vec3 col = vec3(0.0);
    
    // Switch on matID
    if (ray.matID == 0) {
        discard;									// transparent background
//        return sky(ray.dir);								// non-transparent background
    } else if (ray.matID == 1){
        col = grey(ray);
    } else if (ray.matID == 2){
        col = grey(ray);
    } else if (ray.matID == 3){
        col = centerSphere(ray);
    }
    
    // Default lighting
    float sunLight = directionalLightDiffuse(ray.nor, SUN_DIR);
    col = col * (0.8 * sunLight + 0.1);
    
    return col;
}

vec3 raymarch(inout Ray ray) {
    float h = 1.0;
    float t = 0.0;
    for(int i = 0; i < MAX_STEPS; i++) {
        h = map(ray.src + t*ray.dir, ray.matID);
        t += h;
        ray.iter = i;
        if (t > TMAX || h < DIST_THRESHOLD) break;
    }
    ray.t = t;
    ray.pos = ray.src + ray.t*ray.dir;
    ray.nor = calculateNormal(ray.pos);
    int missed = int(step(TMAX, ray.t));
    ray.matID = (1 - missed) * ray.matID;
    ray.nor *= float(1-missed);
    if (scene == 1.0) {
        if (ray.matID == 0) {
            discard;
        } else {
            return normalize(0.5*(ray.nor+1.0));						// Color with normals
        }
    } else {
        return computeColor(ray);
    }
}

vec4 render(Ray ray) {
    vec3 result = raymarch(ray); 
    return vec4(clamp(result, 0.0, 1.0), ray.t);
}

vec4 getProceduralColor() {
    Ray ray;
    ray.pos = vec3(0.0);
    ray.nor = vec3(0.0);
    ray.matID = 0;
    ray.t = 0.0;

    vec3 worldEye = getEyeWorldPos();
    // this will make it movable, scalable, and rotatable
    vec3 ro = _position.xyz;
    vec3 eye = (inverse(iWorldOrientation) * (worldEye - iWorldPosition)) / iWorldScale;

    // fit the map function inside a unit cube
    if (scene == 0.0 || scene > 1.0) {
        ro.y *= 1.4;
        ro.xz *= 1.1;
        eye.y *= 1.4;
        eye.xz *= 1.1;
    } else if (scene == 1.0) {
        ro.x *= 4.4;
        ro.y *= 7.641;
        ro.z *= 4.5761;
        ro.x += 0.1940;
        ro.y += 3.9409;
        ro.z += 1.9712;
        eye.x *= 4.4;
        eye.y *= 7.641;
        eye.z *= 4.5761;
        eye.x += 0.1940;
        eye.y += 3.9409;
        eye.z += 1.9712;
    }

    vec3 rd = normalize(ro - eye);					// ray from camera eye to ro
    ray.src = eye;
    ray.dir = rd;

    return render(ray);
}


float getProceduralColors(inout vec3 diffuse, inout vec3 specular, inout float shininess) {
    vec4 color = getProceduralColor();
    diffuse = color.rgb;
    specular = color.rgb;
    shininess = 0.5;
    return 1.0;
}