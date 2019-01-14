//  Taken from: https://www.shadertoy.com/view/XsV3zG
//
//  Created by Sam Gondelman on 6/9/2016
//  Copyright 2016 High Fidelity, Inc.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//

// Just draws the leftmost island (without noise), tree + apple, and fence
#define TEST 0

#define USE_SHADOWS 0

// Math constants
const float PI = 3.14159265359;
const float EPS = 0.0001;
const float FLT_MAX = 1.0 / 0.000000000001; // hacky but GLSL doesn't have a FLT_MAX by default

// Raymarching constants
const float TMAX = 400.0;
const int MAX_STEPS = 250;
const float DIST_THRESHOLD = 0.00001;

// Other constants/helpers
const vec3 UP = vec3(0.0, 1.0, 0.0);
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

// Perlin Noise
float hash(float n) { return fract(sin(n)*753.5453123); }

float interpolatedNoise2D(vec2 xy, int seed) {
    vec2 p = floor(xy);
    vec2 f = fract(xy);
    f = f*f*(3.0-2.0*f);

    float n = dot(vec3(p.xy, seed), vec3(1, 157, 141));
    return mix(mix(hash(n+  0.0), hash(n+  1.0),f.x),
               mix(hash(n+157.0), hash(n+158.0),f.x),f.y);
}

float perlinNoise2D(vec2 xy, float freq, float amp, int octaves, int seed){
    float total = 0.0;
    float totalScale = 0.0;
    // current freq, amp, scale
    vec3 currFAS = vec3(freq, amp, amp);
    for(int i = 0; i < 5; i++){
        total += interpolatedNoise2D(abs(xy) * currFAS.x, seed) * currFAS.y;
        totalScale += currFAS.z;
        currFAS *= vec3(2.0, 0.5, 0.5);
        if (i >= octaves) break;
    }
    return amp * (total / totalScale);
}

float interpolatedNoise3D(vec3 xyz, int seed) {
    vec3 p = floor(xyz);
    vec3 f = fract(xyz);
    f = f*f*(3.0-2.0*f);

    float n = dot(vec4(p, seed), vec4(1, 433, 157, 141));
    return mix(mix(mix(hash(n+  0.0), hash(n+  1.0),f.x),
                   mix(hash(n+157.0), hash(n+158.0),f.x),f.z),
               mix(mix(hash(n+433.0), hash(n+434.0),f.x),
                   mix(hash(n+590.0), hash(n+591.0),f.x),f.z), f.y);
}

float perlinNoise3D(vec3 xyz, float freq, float amp, int octaves, int seed){
    float total = 0.0;
    float totalScale = 0.0;
    // current freq, amp, scale
    vec3 currFAS = vec3(freq, amp, amp);
    for(int i = 0; i < 5; i++){
        total += interpolatedNoise3D(abs(xyz) * currFAS.x, seed) * currFAS.y;
        totalScale += currFAS.z;
        currFAS *= vec3(2.0, 0.5, 0.5);
        if (i >= octaves) break;
    }
    return amp * (total / totalScale);
}

// Primitives
// http://iquilezles.org/www/articles/distfunctions/distfunctions.htm
float sphere(vec3 p, float r) {
    return length(p) - r;
}

float box(vec3 p, vec3 dim) {
    vec3 d = abs(p) - dim;
    return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}

float roundedbox(vec3 p, vec3 dim, float r) {
    vec3 d = abs(p) - dim;
    return length(max(d,vec3(0.0))) - r;
}

float cylinder(vec3 p, float r, float h) {
    vec2 d = abs(vec2(length(p.xz),p.y)) - vec2(r, h);
    return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}

float cone(vec3 p, float r, float h) {
    float d1 = -p.y - h;
    float q = p.y - h;
    float si = 0.5*r/h;
    float d2 = max(sqrt(dot(p.xz,p.xz)*(1.0-si*si)) + q*si, q);
    return length(max(vec2(d1,d2),0.0)) + min(max(d1,d2), 0.);
}

float triangularPrism(vec3 p, vec2 h, float theta) {
    vec3 q = abs(p);
    return max(q.z-h.y,max(q.x*sin(radians(theta))+p.y*0.5,-p.y)-h.x*0.5);
}

// CSG operations
float intersectionDist(float d1, float d2) {
    return max(d1, d2);
}

float subtractionDist(float d1, float d2) {
    return max(d1, -d2);
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
    float h = clamp01(mix(1.0, (b-a)/k, 0.5));
    return mix(b, a, h) - k*h*(1.0-h);
}

// On linux, mod doesn't work as expected for negative numbers
vec3 repeat(vec3 p, vec3 r) {
    p = abs(p);
    return vec3(p.x - (r.x * floor(p.x/r.x)) - 0.5*r.x,
                p.y - (r.y * floor(p.y/r.y)) - 0.5*r.y,
                p.z - (r.z * floor(p.z/r.z)) - 0.5*r.z);
//    return mod(p, r) - 0.5*r;
}

void propose(inout float val, inout int matID, float proposedVal, int proposedMatID) {
    if (proposedVal < val) {
        val = proposedVal;
        matID = proposedMatID;
    }
}

float map(vec3 p, inout int matID) {
    float res = FLT_MAX;
    
    // islands offset
    vec3 ip = p;
    ip.y += 0.8;
    
#if !TEST
    ip.y -= perlinNoise2D(ip.xz, 1.0, 0.3, 1, 697);
    ip.y += (perlinNoise2D(ip.xz+vec2(50.0), 0.5, 5.0, 3, 769)-4.1)*(1.0-smoothstep(6.9, 7.5, ip.y));
#endif
    
    // left island
    propose(res, matID, blend(cone(rX(ip, 180.0), 10.0, 7.5),
                              cylinder(p-vec3(0.0, 6.5, 0.0), 13.0, 0.15), 3.0), 3);
        
#if !TEST  
    propose(res, matID, blend(cone(rX(ip-vec3(1.0, 2.5, -12.0), 180.0), 5.5, 5.0),
                              cylinder(p-vec3(1.0, 6.5, -12.0), 7.0, 0.15), 3.0), 3);
    propose(res, matID, blend(cone(rX(ip-vec3(5.0, 4.5, -18.0), 180.0), 4.0, 3.0),
                              cylinder(p-vec3(5.0, 6.5, -18.0), 5.0, 0.15), 3.0), 3);
    
    // right island
    propose(res, matID, blend(cone(rX(ip-vec3(23.0, 2.5, -40.0), 180.0), 6.0, 5.0),
                              cylinder(p-vec3(23.0, 6.4, -40.0), 6.95, 0.2), 3.0), 3);
    propose(res, matID, blend(cone(rX(ip-vec3(18.0, 4.25, -45.0), 180.0), 4.0, 3.25),
                              cylinder(p-vec3(18.0, 6.4, -45.0), 4.45, 0.2), 3.0), 3);
    
    // house
    vec3 z = rY(vec3(0,0,1), 50.0);
    float cyl1 =  cylinder(rX(rY(p-vec3(-1.0, 10.9, -3.0)+24.0*z, 35.0), 90.0), 22.1, 5.0);
    float cyl2 =  cylinder(rX(rY(p-vec3(-1.0, 10.9, -3.0)-24.0*z, 35.0), 90.0), 22.1, 5.0);
    float house = box(rY(p-vec3(-1.0, 10.5, -3.0), 35.0), vec3(2.0, 3.0, 2.0));
    house = subtractionDist(house, cyl1);
    house = subtractionDist(house, cyl2);
    propose(res, matID, house, 4);
    float roof = blend(triangularPrism(rY(p-vec3(-1.0, 14.0, -3.0), 35.0),
                                        vec2(1.0,2.0), 20.0),
                       cylinder(rX(rY(p-vec3(-1.0, 14.4, -3.0), 35.0), 90.0),
                                0.2, 1.7), 0.6);
    propose(res, matID, roof, 5);
    
    // chimney
    propose(res, matID, roundedbox(rY(p-vec3(-0.8, 13.5, -1.0), 35.0), vec3(0.15, 1.2, 0.15), 0.05), 6);
    
    // door
    propose(res, matID, box(rY(p-vec3(-1.0, 8.5, -5.0), 35.0), vec3(0.4, 1.05, 0.4)), 7);
    propose(res, matID, sphere(p-vec3(-1.0, 8.5, -5.52), 0.05), 8);
    
    // bridge
    vec3 x = rY(vec3(1,0,0), 50.0);
    vec3 cen = vec3(-10.5,7.5,0.0)+36.89*x;
    vec3 bp = p + vec3(0.0, 0.05, 0.0);
    vec2 offset = vec2(iGlobalTime/35.0, iGlobalTime/30.0);
    bp.y += perlinNoise2D(bp.xz+offset, 0.1+0.05*sin(iGlobalTime/6.0)+0.05*cos(iGlobalTime/7.0),
                          2.0, 1, 537)*(max(0.0, 1.0-dot(bp.xz-cen.xz,bp.xz-cen.xz)/59.0));
    float bridge = box(rY(bp-cen, 40.0), vec3(0.75,1.5,7.8));
    float planks = box(repeat(rY(bp-vec3(-10.5,7.5,0.0), 40.0), vec3(0.0,0.0,0.3)),
                       vec3(0.5,0.05,0.125));
    propose(res, matID, intersectionDist(planks, bridge), 9);
    
    // bridge ropes
    propose(res, matID, cylinder(rX(rY(bp-cen+0.45*z, 40.0), 90.0), 0.01, 7.7), 9);
    propose(res, matID, cylinder(rX(rY(bp-cen-0.45*z, 40.0), 90.0), 0.01, 7.7), 9);
    
    propose(res, matID, cylinder(rX(rY(bp-cen-0.25*x+0.47*z-UP, 40.0), 90.0), 0.03, 8.25), 9);
    propose(res, matID, cylinder(rX(rY(bp-cen-0.47*z-UP, 40.0), 90.0), 0.03, 8.4), 9);
    
    float ropes1 = cylinder(repeat(rY(bp-vec3(-10.5,8.0,0.0)+0.47*z, 40.0), vec3(0.0,0.0,0.9)), 0.02, 0.5);
    float ropes2 = cylinder(repeat(rY(bp-vec3(-10.5,8.0,0.0)-0.47*z, 40.0), vec3(0.0,0.0,0.9)), 0.02, 0.5);
    propose(res, matID, intersectionDist(ropes1, bridge), 9);
    propose(res, matID, intersectionDist(ropes2, bridge), 9);
    
    float disp = (sin(p.x*p.y)*sin(p.z*p.x))/40.0;
    propose(res, matID, cylinder(rX(rY(p-cen+8.25*x+0.55*z-0.5*UP, 60.0), 30.0), 0.07, 0.6)+disp, 9);
    propose(res, matID, cylinder(rX(rY(p-cen+8.3*x-0.54*z-0.5*UP, 75.0), -15.0), 0.07, 0.6)+disp, 9);
    propose(res, matID, cylinder(rX(rY(p-cen-8.25*x+0.43*z-0.5*UP, 30.0), 30.0), 0.07, 0.65)+disp, 9);
    propose(res, matID, cylinder(p-cen-8.4*x-0.47*z-0.5*UP, 0.07, 0.6)+disp, 9);

    
    // right tree
    for (int i = 0; i < 4; i++) {
        float fi = float(i);
        vec3 tp = p;
        vec2 add = vec2(sin(p.y+fi/4.0*2.0*PI+2.0*PI*hash(36.0*fi)),
                        cos(p.y+fi/4.0*2.0*PI+2.0*PI*hash(83.0*fi)))/4.0;
        float ystep = smoothstep(8.5, 11.0, p.y);
        tp.xz += add*ystep;
        propose(res, matID, cylinder(rX(rY(tp-vec3(27.0, 10.0, -42.0), 180.0*(fi-1.0)/4.0*ystep), 40.0*ystep),
                                 0.07+(max(11.5-p.y, 0.0))/10.0, 4.0), 9);
    }
    
    // right fence
    for(int i = 0; i < 6; i++) {
        float fi = float(i);
    	vec3 off = rY(vec3(1.0,0.0,0.0), 15.0*fi-40.0);
    	vec3 nextOff = rY(vec3(1.0,0.0,0.0), 15.0*float(i+1)-40.0);
    	propose(res, matID, cylinder(p-vec3(23.0, 7.75, -40.0)-6.7*off, 0.07, 0.6), 9);
        vec3 hc = rX(rY(p-vec3(23.0, 7.75, -40.0)-6.7*(off+nextOff)/2.0, 180.0 - (15.0*(fi+0.5)-40.0)), 90.0);
        float a1 = 7.0*sin(fi*2320.0);
        float a2 = 7.0*sin(fi*235.0);
        a1 = mix(a1, -15.0, step(4.5, fi));
        a2 = mix(a2, -25.0, step(4.5, fi));
        propose(res, matID, cylinder(rX(hc, a1), 0.04, 0.87), 9);
        propose(res, matID, cylinder(rX(hc, a2)-vec3(0.0,0.0,0.4*step(fi, 4.5)), 0.04,
                                     0.87+0.1*step(4.5, fi)), 9);
    }

#endif
    
    // left tree
    for (int i = 0; i < 5; i++) {
        float fi = float(i);
        vec3 tp = p;
        vec2 add = vec2(sin(p.y+fi/5.0*2.0*PI+2.0*PI*hash(50.0*fi)),
                        cos(p.y+fi/5.0*2.0*PI+2.0*PI*hash(50.0*fi)))/4.0;
        float ystep = smoothstep(9.0, 11.5, p.y);
        tp.xz += add*ystep;
        propose(res, matID, cylinder(rX(rY(tp-vec3(6.0, 10.5, 8.0), 360.0*fi/5.0*ystep), 40.0*ystep),
                                 0.1+(max(11.5-p.y, 0.0))/10.0, 5.0), 9);
    }
    
    // left fence
    for(int i = 0; i < 4; i++) {
        float fi = float(i);
    	vec3 off = rY(vec3(1.0,0.0,0.0), 8.0*fi-170.0);
    	vec3 nextOff = rY(vec3(1.0,0.0,0.0), 8.0*float(i+1)-170.0);
    	propose(res, matID, cylinder(p-vec3(0.0, 7.75, 0.0)-12.5*off, 0.07, 0.6), 9);
        vec3 hc = rX(rY(p-vec3(0.0, 7.75, 0.0)-12.5*(off+nextOff)/2.0, 180.0 - (8.0*(fi+0.5)-170.0)), 90.0);
        float a1 = 7.0*sin(fi*2320.0);
        float a2 = 7.0*sin(fi*235.0);
        a1 = mix(a1, -15.0, step(2.5, fi));
        a2 = mix(a2, -25.0, step(2.5, fi));
        propose(res, matID, cylinder(rX(hc, a1), 0.04, 0.87), 9);
        propose(res, matID, cylinder(rX(hc, a2)-vec3(0.0,0.0,0.4*step(fi, 2.5)), 0.04,
                                     0.87+0.1*step(2.5, fi)), 9);
    }
    
    // apple
    float t = max(0.0, iGlobalTime -10.0);
    float appleY = min(0.5*9.81*t*t, 5.0);
    propose(res, matID, sphere(p-vec3(8.0, 12.65-appleY, 7.6), 0.15), 10);
    
    return res;
}

// Lighting
float directionalLightDiffuse(vec3 nor, vec3 ldir) {
    return clamp01(dot(nor, -ldir));
}

// Effects
float softshadow(vec3 pos, vec3 ldir) {
#if USE_SHADOWS
    float res = 1.0;
    float t = 0.01;
    for(int i = 0; i < 25; i++) {
        float h = map(pos - ldir*t, junkMatID);
        res = min(res, 7.0*h/t);
        t += clamp(h, 0.007, 5.0);
        if (h < EPS) break;
    }
    return clamp01(res);
#else
    return 1.0;
#endif
}

// Coloring different materials
vec3 sky(vec3 dir) {
    return mix(vec3(0.4, 0.7, 0.9),
               vec3(0.23, 0.17, 0.13),
               smoothstep(0.0, 0.7, dir.y)/2.0);
}

vec3 islands(Ray ray) {
    float topStep = smoothstep(0.0, 0.2, ray.nor.y+perlinNoise2D(ray.pos.xz, 5.0, 0.4, 1, 157));
    
    // grass
    vec3 col = mix(vec3(0.38, 0.2, 0.0), vec3(0.0, 0.8, 0.2), topStep);    
    
    // rocky detail
    col = mix(vec3(0.46, 0.3, 0.2), col, (topStep+smoothstep(0.01, 0.25, abs(ray.nor.y+0.707)))/2.0);
    col = mix (col, vec3(0.75, 0.60, 0.36), (1.0-topStep)*perlinNoise2D(ray.pos.xz, 0.1, 0.7, 1, 987));
    
    return col;
}

vec3 house(Ray ray) {
    vec3 col = vec3(1.0);
    
    // windows
    float g = 4.0/3.0;
    vec3 w = repeat(rY(ray.pos, 35.0) - vec3(g/3.0, g/1.25, g/3.0), vec3(g, 2.0, g)) + vec3(g/2.0);
    float winStep = step(g/2.0, w.x)*step(0.4, w.y)*step(g/2.0, w.z);
    col = mix(vec3(0.0, 0.6, 0.0), col, 1.0-winStep);

    w = repeat(rY(ray.pos, 35.0) - vec3(g/1.25, g/1.25, g/1.25), vec3(g, 2.0, g)) + vec3(g/2.0);
    winStep = step(g/2.0, w.x)*step(0.4, w.y)*step(g/2.0, w.z);
    col = mix(vec3(0.0, 0.6, 0.0), col, 1.0-winStep);
    
    col = mix(vec3(1.0), col, step(9.5, ray.pos.y));
    
    // bottom moulding
    float botStep = step(8.0, ray.pos.y);
    col = mix(vec3(0.3, 0.5, 0.0), col, botStep);
    
    return col;
}

vec3 roof(Ray ray) {
    vec3 col = vec3(1.0);
    
    // tan roof
    col = mix(col, vec3(0.9, 0.7, 0.5), step(0.3, ray.nor.y));
    
    // roof lines
    float g = 1.0/2.0;
    vec3 w = repeat(rY(ray.pos + vec3(g), 35.0), vec3(g)) + vec3(g/2.0);
    float lineStep = smoothstep(0.0, 0.02, w.z)*smoothstep(g, g-0.02, w.z);
    col = mix(vec3(0.6, 0.4, 0.2), col, lineStep);

    // round windows
    vec3 x = rY(vec3(2.0, 0.0, 0.0), 55.0);
    vec3 p = ray.pos-vec3(-1.0, 14.4, -3.0)+x;
    float dist2 = dot(p, p);
    float roundStep = step(dist2, 0.16);
    p = ray.pos-vec3(-1.0, 14.4, -3.0)-x;
    dist2 = dot(p, p);
    roundStep += step(dist2, 0.16);
    col = mix(col, vec3(0.0, 0.6, 0.0), roundStep);
    
 	return col;
}

vec3 chimney(Ray ray) {
    vec3 col = vec3(1.0, 0.0, 0.0);
    
    // bricks
    float g = 1.0/7.0;
    float offset = mod(floor(ray.pos.y/g),2.0)*g/2.0;
    vec3 w = repeat(rY(ray.pos + vec3(g), 35.0) - vec3(offset, 0.0, offset), vec3(g)) + vec3(g/2.0);
    float lineStep = smoothstep(0.0, 0.02, w.x)*smoothstep(g, g-0.02, w.x)*
        smoothstep(0.0, 0.02, w.y)*smoothstep(g, g-0.02, w.y)*
        smoothstep(0.0, 0.02, w.z)*smoothstep(g, g-0.02, w.z);
    col = mix(vec3(0.35, 0.2, 0.1), col, lineStep);
    
    col = mix(vec3(0.0), col, 1.0-smoothstep(0.95, 0.99, ray.nor.y));
    
    return col;
}

vec3 door() {
    return vec3(0.0, 0.5, 0.6);
}

vec3 doorknob(Ray ray) {
    vec3 col = vec3(1.0, 0.84, 0.0);
    vec3 z = rY(vec3(0,0,1), 55.0);
    col = mix(vec3(0.0), col, smoothstep(0.0, 0.2, abs(ray.nor.y))*smoothstep(0.0, 0.2, abs(dot(ray.nor, z))));
    return col;
}

vec3 wood(Ray ray) {
    vec3 col = vec3(0.6, 0.4, 0.2);    
    col *= perlinNoise2D(ray.pos.xz, 5.0, 1.0, 1, 487);    
    return col;
}

vec3 apple(Ray ray) {
    vec3 col = vec3(0.8, 0.25, 0.0);
    col *= perlinNoise3D(ray.nor, 4.0, 1.0, 1, 487)*1.75;
    return col;
}

vec3 computeColor(Ray ray) {
    vec3 col = vec3(0.0);
    
    // Switch on matID
    // a return -> different/no lighting
    // no return -> default lighting
    if (ray.matID == 0) {
    	return sky(ray.dir);
    } else if (ray.matID == 2) {
        col = vec3(0.5);
    } else if (ray.matID == 3) {
        col = islands(ray);
    } else if (ray.matID == 4) {
        col = house(ray);
    } else if (ray.matID == 5) {
        col = roof(ray);
    } else if (ray.matID == 6) {
        col = chimney(ray);
    } else if (ray.matID == 7) {
        col = door();
    } else if (ray.matID == 8) {
        col = doorknob(ray);
    } else if (ray.matID == 9) {
        col = wood(ray);
    } else if (ray.matID == 10) {
        col = apple(ray);
    }
    
    // Default lighting
    float sunLight = directionalLightDiffuse(ray.nor, SUN_DIR);
    float sunShadow = softshadow(ray.pos, SUN_DIR);

    col = col * (0.8 * sunLight * sunShadow + 0.1);
    
    return col;
}

vec3 calculateNormal(vec3 pos) {
    const vec3 e = vec3(EPS, 0.0, 0.0);
    float p = map(pos, junkMatID);
    return normalize(vec3(map(pos + e.xyy, junkMatID) - p,
                          map(pos + e.yxy, junkMatID) - p,
                          map(pos + e.yyx, junkMatID) - p));
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
    return computeColor(ray);
}

vec4 render(Ray ray) {
    vec3 res = raymarch(ray);
    float t1 = mix(ray.t, TMAX, step(float(ray.matID), 0.5));    
    return vec4(clamp01(res), t1);
}

vec4 getProceduralColor() {
    Ray ray;
    ray.pos = vec3(0.0);
    ray.nor = vec3(0.0);
    ray.matID = 0;
    ray.t = 0.0;

    vec3 worldEye = getEyeWorldPos();
    vec3 ro = iWorldOrientation * (_position.xyz * iWorldScale) + iWorldPosition;	// world position of the current fragment
    vec3 eye = worldEye;

    ro += vec3(130.0, 5.0, -16.0);
    eye += vec3(130.0, 5.0, -16.0);

    vec3 rd = normalize(ro - eye);							// ray from camera eye to ro
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