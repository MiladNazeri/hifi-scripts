//  Taken from: https://www.shadertoy.com/view/ldy3DR
//
//  Created by Sam Gondelman on 6/9/2016
//  modified by milad
//  Copyright 2016 High Fidelity, Inc.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//

// Uniforms
    uniform float scene = 0.0;
    uniform float spinner = 0.14;
    uniform float sphereRadiusFactor = 0.04;
    uniform int MAX_STEPS = 200;
    uniform float speed1 = 0.01;
    uniform float speed2 = 0.01;
    uniform float pulse = 0.03;
    uniform float xDispMultiply = 20.0;
    uniform float xDispSpeedMultiply = 0.1;
    uniform float yDispMultiply = 40.0;
    uniform float yDispSpeedMultiply = 0.4;
    uniform float zDispMultiply = 0.4;
    uniform float zDispSpeedMultiply = 0.4;
    uniform float radiusSize_01 = 0.2;
    uniform float gravity = 0.09;
    uniform float distanceToFall = 8.5;
    uniform float repeatX = 0.0;
    uniform float repeatY = 0.0;
    

// Raymarching constants
    const float TMAX = 250.0;
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

    float plane(vec3 p) {
        return p.y;
    }

    float sphere(vec3 p, float r) {
        return length(p) - r * sphereRadiusFactor;
    }

    float cylinder(vec3 p, float r, float h) {
        vec2 d = abs(vec2(length(p.xz),p.y)) - vec2(r, h);
        return min(max(d.x,d.y),0.0) + length(max(d,0.0));
    }

    float roundedBox(vec3 p, vec3 dim, float r) {
        vec3 d = abs(p) - dim;
        return length(max(d,vec3(0.0))) - r;
    }

// Noise
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
// Transformations
    float random (in vec2 _st) {
        return fract(sin(dot(_st.xy,
                            vec2(12.9898,78.233)))*
            43758.5453123);
    }

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

    vec3 repeat(vec3 p, vec3 r) {
        // float rand = 0.10 * perlinNoise2D(vec2(p.xy), 2.0, 2.0, 3, 1);
        p = abs(p);
        return vec3(
                    p.x - (r.x * floor(p.x/r.x)) - 0.5*r.x,
                    p.y - (r.y * floor(p.y/r.y)) - 0.5*r.y,
                    p.z - (r.z * floor(p.z/r.z)) - 0.5*r.z
                    );
    //    return mod(p, r) - 0.5*r;
    }

// Drawing
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
            // vec3 d = 0.5*normalize(vec3(1.0, 0.00, -1.00));
            vec3 d = 0.5*normalize(vec3(-1.0, 0.0, 1.0));
            // vec3 s = 0.4*vec3(0.0, 0.0, 0.0);
            vec3 s = 0.4*vec3(0.0, pow(sin(iGlobalTime * speed1),3), 0.0);

            // vec3 c = 0.4*vec3(0.0, 0.0, 0.0);
            vec3 c = 0.1*vec3(0.0, cos(iGlobalTime * speed2), 0.0);
            // vec3 c2 = 0.4*vec3(0.0, cos(mod(iGlobalTime, PI/2), 0.0);

            // vec3 c2 = vec3(0.0, cos(mod(iGlobalTime * speed2, 3.14159/2.0)), 0.0);

            // float disp = 0.03*sin(20.0*p.x+iGlobalTime)*sin(40.0*p.y+iGlobalTime)*sin(60.0*p.z+iGlobalTime);
            float disp = 
                pulse * 
                sin(xDispMultiply*p.x+iGlobalTime * xDispSpeedMultiply) *
                sin(yDispMultiply*p.y+iGlobalTime * yDispSpeedMultiply) * 
                sin(zDispMultiply*p.z+iGlobalTime * zDispSpeedMultiply);

            disp *= (spinner - smoothstep(-1.0, 0.0, cos(iGlobalTime/3.0)));
            // disp *= (0.03 - smoothstep(-1.0, 0.0, cos(iGlobalTime*3.0)));
            // disp *= (5.0 - smoothstep(1.0, -1.0, cos(iGlobalTime/30000.0)));
            // disp *= (spinner - smoothstep(1.0, -1.0, cos(iGlobalTime/30000.0)));
            // propose(res, matID, cylinder(p+(cen + c.y + -0.2) + vec3(0.2,0.0,0.0), 0.2, 0.2) + disp * 0.04, 1);
            // p.y = p.y + gravity * iGlobalTime * iGlobalTime;
            float time = mod(iGlobalTime, distanceToFall);
            propose(res, matID, 
                sphere(
                    repeat(
                        p - (cen - vec3(0, gravity * time * time, 0) + vec3(abs(s.y), 0.0, 0.0) + disp), 
                        vec3(1.0, 1.0, 0.0)), 
                    (abs(s.y) * 10.0) + 2.4), 
                1);
            propose(res, matID, 
                sphere(
                    repeat(
                        p - (cen - vec3(s.y, gravity * time * time, s.y) + vec3(0.2, 0.2, abs(c.y)) + disp), 
                        vec3(1.0, 1.0, 0.0)), 
                    (abs(s.y) * 10.0) + 0.4), 
                1);
            propose(res, matID, 
                sphere(
                    repeat(
                        p - (cen - vec3(s.y, gravity * time * time, s.y) + vec3(abs(c.y), 0.2, 0.0) + disp), 
                        vec3(1.0, 1.0, 0.0)), 
                    (abs(s.y) * 10.0) + 1.4), 
                1);
            propose(res, matID, 
                sphere(
                    repeat(
                        p - (cen - vec3(s.y, gravity * time * time, s.y) + vec3(0.8, 0.4, abs(c.y)) + disp), 
                        vec3(1.0, 1.0, 0.0)), 
                    (abs(s.y)* 10.0) + 0.8), 
                1);
            
            
            // propose(res, matID, 
            //     sphere(
            //         repeat(
            //             p - (cen - vec3(0, gravity * time * time, 0) + vec3(0.3, 0.40, 0.3) + disp), 
            //             vec3(0.3, 0.0, 0.0)), 
            //         0.4), 
            //     1);
            
           
            // propose(res, matID, sphere(p-(cen+d.xyx+c2) + vec3(0.0,-0.4,0.0) + disp, radiusSize_01), 1);
            // propose(res, matID, sphere(p-(cen+0.5*(c2.xyx)+0.5*vec3(0.0,1.0,0.0)), 0.15), 2);
            
            // propose(res, matID, sphere(p-(cen+0.5*(-s.xyy)+0.5*vec3(0.0,1.0,0.0)), 0.15), 1);

            // propose(res, matID, sphere(p-(cen+d.xyz+s), 0.15), 1);
            // propose(res, matID, sphere(p-cen, 0.15)+disp, 1);
            // propose(res, matID, sphere(p-cen, 0.15)+disp, 1);
            // propose(res, matID, sphere(p-(cen+d.xyz + s), 0.15), 1);
            // propose(res, matID, sphere(p-(cen + d.xyz) + disp, 0.15), 1);
            // propose(res, matID, sphere(p-(cen + d.xyz) + disp, 0.15), 1);

            // propose(res, matID, sphere(p-(cen+d.xyz + c), 0.15), 1);
            // propose(res, matID, sphere(p-(cen+d.xyz+c)+disp, 0.15), 1);
            // propose(res, matID, sphere(p-(cen+0.5*(-s.yxy)+0.5*vec3(0.0,1.0,0.0))+disp, 0.15), 1);
        
            // propose(res, matID, sphere(p-(cen+d.zyz-s)+disp, 0.15), 2);
            // propose(res, matID, sphere(p-(cen+d.zyx-c)+disp, 0.15), 2);
            // propose(res, matID, sphere(p-(cen+0.5*(s.yxy)+0.5*vec3(0.0,-1.0,0.0))+disp, 0.15), 2);
        } else if (scene == 1.0) {											// horse
            vec3 cen = vec3(0.0);
            vec3 d = 0.5*normalize(vec3(0.0, 1.00, -1.00));
            // vec3 s = 0.4*vec3(0.0, 0.0, 0.0);
            vec3 s = 0.25*vec3(0.0, sin(iGlobalTime / 8), 0.0);
            vec3 c = 0.4*vec3(0.0, 0.0, 0.0);
            // vec3 c = 0.4*vec3(0.0, cos(iGlobalTime), 0.0);
            float disp = 0.03*sin(20.0*p.x+iGlobalTime)*sin(40.0*p.y+iGlobalTime)*sin(60.0*p.z+iGlobalTime);
            disp *= (spinner - smoothstep(-1.0, 0.0, cos(iGlobalTime/3.0)));
            // disp *= (0.03 - smoothstep(-1.0, 0.0, cos(iGlobalTime*3.0)));
            // disp *= (5.0 - smoothstep(1.0, -1.0, cos(iGlobalTime/30000.0)));
            // disp *= (spinner - smoothstep(1.0, -1.0, cos(iGlobalTime/30000.0)));
            // propose(res, matID, sphere(p-cen, 0.4)+disp, 1);
            // propose(res, matID, sphere(p-cen, 0.4)+disp, 1);
            propose(res, matID, sphere(p-(cen+d.xyx+s)+disp, 0.15), 1);
            // propose(res, matID, sphere(p-(cen+d.xyz+c)+disp, 0.15), 1);
            // propose(res, matID, sphere(p-(cen+0.5*(-s.yxy)+0.5*vec3(0.0,1.0,0.0))+disp, 0.15), 1);
        
            // propose(res, matID, sphere(p-(cen+d.zyz-s)+disp, 0.15), 2);
            // propose(res, matID, sphere(p-(cen+d.zyx-c)+disp, 0.15), 2);
            // propose(res, matID, sphere(p-(cen+0.5*(s.yxy)+0.5*vec3(0.0,-1.0,0.0))+disp, 0.15), 2);
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
    // nor - normalized ray, ldir - light direction
    float directionalLightDiffuse(vec3 nor, vec3 ldir) {
        return clamp01(dot(nor, -ldir));
    }

// Coloring different materials
    vec3 sky(vec3 dir) {
        return mix(vec3(0.4, 0.7, 0.9),
                vec3(0.23, 0.17, 0.13),
                smoothstep(0.0, 0.7, dir.y)/2.0);
    }

    vec3 red(Ray ray) {
        return vec3(0.8, 0.0, 0.0);
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

// Rendering functions

    vec3 computeColor(Ray ray) {
        vec3 col = vec3(0.0);
        
        // Switch on matID
        if (ray.matID == 0) {
            discard;									// transparent background
        //        return sky(ray.dir);								// non-transparent background
        } else if (ray.matID == 1){
            col = red(ray);
        } else if (ray.matID == 2){
            col = red(ray);
        } else if (ray.matID == 3){
            col = centerSphere(ray);
        }
        
        // Default lighting
        float sunLight = directionalLightDiffuse(ray.nor, SUN_DIR);
        col = col * (0.5 * sunLight + 0.07);
        
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

        return computeColor(ray);
        // if (scene == 1.0) {
        //     if (ray.matID == 0) {
        //         discard;
        //     } else {
        //         return normalize(0.5*(ray.nor+1.0));						// Color with normals
        //     }
        // } else {
        //     return computeColor(ray);
        // }
    }

    vec4 render(Ray ray) {
        vec3 result = raymarch(ray); 
        return vec4(clamp(result, 0.0, 1.0), ray.t);
    }

// Final output Functions
    vec4 getProceduralColor() {
        Ray ray;
        ray.pos = vec3(0.0);
        ray.nor = vec3(0.0);
        ray.matID = 0;
        ray.t = 0.0;

        // iGlobalTime = in seconds
        // iWorldScale = the dimensions of the object being rendered
        // iWorldPosition = The position of the object being rendered
        // iWorldOrientation = the Orientation of the object being rendered
        /*
            vec3 _normalWS;
            vec3 _normalMS;
            vec4 _color;
            vec2 _texCoord0;
            vec4 _positionMS;
            vec4 _positionES;
        */

        vec3 worldEye = getEyeWorldPos();
        // this will make it movable, scalable, and rotatable
        vec3 ro = _position.xyz;
        vec3 eye = (inverse(iWorldOrientation) * (worldEye - iWorldPosition)) / iWorldScale;

        vec3 rd = normalize(ro - eye);					// ray from camera eye to ro
        ray.src = ro;
        ray.dir = rd;

        return render(ray);
        // return vec4(0.0, 1.0, 0.0, 0.0);
    }


    float getProceduralColors(inout vec3 diffuse, inout vec3 specular, inout float shininess) {
        vec4 color = getProceduralColor();
        diffuse = color.rgb;
        specular = color.rgb;
        shininess = 0.5;
        return 1.0;
    }