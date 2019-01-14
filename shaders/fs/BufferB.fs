/** Raymarching

	The scene is defined in map() and colored in computeColor().

	There are 4 different scenes (change the SCENE variable below).

	You can turn on effects by changing the macros below.

	Works great on the machines with GTX 970s with everything on,
	but on slower machines:

*** DON'T TURN ON SHADOWS IF REFLECTIONS OR REFRACTIONS ARE ON ***
	it'll take forever to compile. 

	Reflections and refractions are done in render().

	Camera motion is in mainImage().

	Click and drag to move the camera
	Hold P to show 3rd person
	Hold N to draw normals
	Hold H on SCENE 3 to turn off horse blending
**/
#define USE_REFLECTIONS 0
#define NUM_REFLECTIONS 1
#define USE_REFRACTIONS 0
#define USE_SHADOWS 0
#define USE_DAYNIGHT 1

// Scenes:
// 0 - balls (reflective + refractive)
// 1 - temple (reflective)
// 2 - tentacles (refractive)
// 3 - horse (reflective)
#define SCENE 3

// Math constants
    const float PI = 3.14159265359;
    const float EPS = 0.0001;
    const float FLT_MAX = 1.0 / 0.000000000001; // hacky but GLSL doesn't have a FLT_MAX by default

// Raymarching constants
    const float TMAX = 250.0;
    const int MAX_STEPS = 200;
    const float DIST_THRESHOLD = 0.00001;

// Texel addresses
    const vec2 txPlayerPos = vec2(0.0,0.0);

// Texel storage constants
    const float KEY_N  = 78.5/256.0;
    const float KEY_P  = 80.5/256.0;
    const float KEY_H  = 72.5/256.0;

// Other constants
    const vec3 UP = vec3(0.0, 1.0, 0.0);
    const float DAY_LENGTH = 5.0;
    const float GRID_SIZE = 0.75;

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

// I wrote these primitive equations and CSG operations for my CS123 final
// Primitives
float plane(vec3 p) {
    return p.y;
}

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
    float h = clamp(mix(1.0, (b-a)/k, 0.5), 0.0, 1.0);
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
	// This doesn't work for some reason?
    //    float overridden = step(val, proposedVal);
    //    val = overridden * proposedVal + (1.0-overridden) * val;
    //    matID = int(overridden * float(proposedMatID) + (1.0-overridden) * float(matID));
    if (proposedVal < val) {
        val = proposedVal;
        matID = proposedMatID;
    }
}

float map(vec3 p, inout int matID, vec3 playerPos, bool drawPlayer, bool drawRefractive) {
    float res = FLT_MAX;
    
#if (SCENE == 0) || (SCENE > 3)
    // spheres
    vec3 cen = vec3(0.0, 1.5, 0.0);
    vec3 d = 0.5*normalize(vec3(1.0, 0, -1.0));
    vec3 s = 0.4*vec3(0.0, sin(iTime), 0.0);
    vec3 c = 0.4*vec3(0.0, cos(iTime), 0.0);
    float disp = 0.03*sin(20.0*p.x+iTime)*sin(40.0*p.y+iTime)*sin(60.0*p.z+iTime);
    disp *= (1.0 - smoothstep(-0.25, 0.25, cos(iTime/2.0)));
    propose(res, matID, sphere(p-cen, 0.3)+disp, 3);
    propose(res, matID, sphere(p-(cen+d.xyx+s), 0.15), 1);
    propose(res, matID, sphere(p-(cen+d.xyz+c), 0.15), 1);
    propose(res, matID, sphere(p-(cen+0.5*(-s.yxy)+0.5*vec3(0.0,1.0,0.0)), 0.15), 1);
    
    // refractive spheres
    if (drawRefractive) {
        propose(res, matID, sphere(p-(cen+d.zyz-s), 0.15), 2);
    	propose(res, matID, sphere(p-(cen+d.zyx-c), 0.15), 2);
    	propose(res, matID, sphere(p-(cen+0.5*(s.yxy)+0.5*vec3(0.0,-1.0,0.0)), 0.15), 2);
    }
    
    // reflective cylinder
    propose(res, matID, cylinder(p-vec3(0), 4.0, .15), 1);

#elif (SCENE == 1)
    //temple    
    float pillars = intersectionDist(cylinder(p-vec3(-50.0, 2.5, 0.0), 8.0, 2.5),
                                     cylinder(repeat(p-vec3(0.0,2.5,0.0), vec3(5,0,5)), 0.25, 2.5));    
    float temple = subtractionDist(sphere(p-vec3(-50.0, 0.0, 0.0), 10.0),
                                   cylinder(p-vec3(-50.0, 2.3, 0.0), 11.0, 2.5));
    propose(res, matID, blend(pillars, temple, 1.4), 6); 

#elif (SCENE == 2)
    if (drawRefractive) {
        // blob arm        
        float arm = cylinder(p-vec3(-50.0, 0.201, 0.0), 5.0, 0.1);
        for (int i = 0; i < 11; i++) {
            arm = blend(arm, sphere(p-vec3(-50.0+4.0*float(i)/10.0*cos(float(i+1)+iTime), i+1,
                                           4.0*float(i)/10.0*sin(float(i+1)+iTime)),
                                    float(10-i)/20.0 + 0.1), 1.0-float(i)/15.0);
        }
        propose(res, matID, arm, 2);
    }
    
#elif (SCENE == 3)
    // HORSE
    float blendStep = step(texture(iChannel1, vec2(KEY_H, 0.25)).x, 0.5);
    
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

#endif

    // ground plane
    propose(res, matID, plane(p-vec3(0.0,-1.0,0.0)), 4);
    
    // rounded box grid    
    vec3 v = repeat(p, vec3(GRID_SIZE,0.0,GRID_SIZE));
    vec3 f = p - v;
    float h = 30.0*perlinNoise2D(f.xz, 0.01, 1.0, 2, 37);
    h *= clamp(exp((dot(f.xz,f.xz) - 102.0*102.0)/20000.0)-1.0, 0.0, 1.0);
	propose(res, matID, roundedBox(v, vec3(0.7*GRID_SIZE/2.0,max(0.0, h),0.7*GRID_SIZE/2.0), 0.1), 4);
    
    // player
    if (drawPlayer) {
        propose(res, matID, sphere(p-playerPos, 0.25), 5);
    }
    
    return res;
}

// Lighting
float directionalLightDiffuse(vec3 nor, vec3 ldir) {
    return clamp(dot(nor, -ldir), 0.0, 1.0);
}

float pointLightDiffuse(vec3 pos, vec3 nor, vec3 lpos, vec3 func) {
    vec3 ldir = normalize(pos - lpos);
    float dist = length(pos - lpos);
    float atten = min(1.0/dot(func, vec3(1, dist, dist*dist)), 1.0);
    return atten * clamp(dot(nor, -ldir), 0.0, 1.0);
}

// Effects
float softshadow(vec3 pos, vec3 ldir, vec3 playerPos) {
#if USE_SHADOWS
    float res = 1.0;
    float t = 0.01;
    for(int i = 0; i < 16; i++) {
        float h = map(pos - ldir*t, junkMatID, playerPos, true, true);
        res = min(res, 7.0*h/t);
        t += clamp(h, 0.05, 5.0);
        if (h < EPS) break;
    }
    return clamp(res, 0.0, 1.0);
#else
    return 1.0;
#endif
}

// Coloring different materials
vec3 sky(vec3 dir, vec3 SUN_DIR) {
    float day = step(dot(dir, SUN_DIR), 0.0);
    
    float daylightStep = smoothstep(0.5, -0.5, dot(dir, SUN_DIR));
    vec3 col =  (1.0-daylightStep)*vec3(0) + daylightStep*vec3(0.5, 0.8, 1.0);
    
    float sunStep = smoothstep(-0.996, -0.997, dot(dir, SUN_DIR));
    col = (1.0-sunStep)*col + sunStep*vec3(1.0, 0.75, 0.0);
    
    float moonStep = smoothstep(0.996, 0.997, dot(dir, SUN_DIR));
    col = (1.0-moonStep)*col + moonStep*vec3(0.9);
    
    // Stars based on method from https://www.shadertoy.com/view/ldXXDj
    // Doesn't work on linux?
    col += 0.5*smoothstep(0.89+0.03*cos(iTime),0.94,
                          texture(iChannel2, 5.0*dir.xz).x)*(1.0-daylightStep)*(1.0-moonStep);

    return col;
}

vec3 ground(Ray ray) {
    // Blue/black stripes
    float stripeStep = step(GRID_SIZE, mod(ray.pos.z, GRID_SIZE*2.0));
    vec3 col = stripeStep*vec3(0.0, 0.0, 1.0) + (1.0 - stripeStep)*vec3(0.0);
    vec3 disp = ray.pos - vec3(30.0, 10.0, 0.0);
    float radStep = smoothstep(0.0, 200.0, dot(disp.xz, disp.xz));

    // Random color per box
    vec3 v = repeat(ray.pos, vec3(GRID_SIZE,0.0,GRID_SIZE));
    vec3 f = ray.pos - v;
    vec3 randCol = vec3(perlinNoise2D(f.xz, 0.01, 1.0, 1, 37),
               		    perlinNoise2D(f.xz, 0.01, 1.0, 1, 87),
               			perlinNoise2D(f.xz, 0.01, 1.0, 1, 137));
    col = radStep*randCol + (1.0-radStep)*col;

    // White boundary line
    float d = sqrt(dot(f.xz,f.xz));
    float boundStep = smoothstep(96.0, 100.0, d)*(1.0-smoothstep(100.0, 104.0, d));
    col = boundStep * vec3(1.0) + (1.0 - boundStep) * col;
    
    return col;
}

vec3 centerSphere(Ray ray) {
    // Weird colors
    float colStep = smoothstep(-0.25, 0.25, cos(iTime/2.0));
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

vec3 player(Ray ray, vec3 playerPos) {
    vec3 col = vec3(0.45);
    
    // Lines
    float th = fract(ray.pos.y-playerPos.y);
    col = mix(vec3(0.6), col, smoothstep(0.0, 0.006, th)*(1.0-smoothstep(0.994, 1.0, th)));
    float offset = mod(floor(ray.pos.y-playerPos.y),2.0)*0.5;
    float phi = fract(fract(acos(dot(normalize(ray.nor.xz), vec2(1,0)))/(PI/5.0))+offset);
    col = mix(vec3(0.65), col, smoothstep(0.0, 0.025, phi)*(1.0-smoothstep(0.975, 1.0, phi)));

    // Eye
    vec2 m = iMouse.xy/iResolution.xy;
    vec3 w = -normalize(vec3(cos(2.0*PI*m.x), sin(PI*(m.y-0.5)), sin(2.0*PI*m.x)));
    vec3 r = normalize(ray.pos - playerPos);
    
    float eyeStep1 = smoothstep(0.95, 0.959, dot(r, w));
    col = mix(col, vec3(0.1), eyeStep1);
    float eyeStep2 = smoothstep(0.96, 0.999, dot(r, w));
    col = mix(col, vec3(1.0,0.0,0.0), eyeStep2);
    float eyeStep3 = smoothstep(0.998, 1.0, dot(r, w));
    col = mix(col, vec3(1.0,1.0,0.0), eyeStep3);
    
    return col;
}

vec3 temple(Ray ray) {
    vec3 col = vec3(0.55, 0.25, 0.25);
    
    // Lines
    float th = fract(ray.pos.y*4.0);
    float heightStep = step(ray.pos.y, 4.8);
    col = mix(vec3(0.0), col, smoothstep(0.0, 0.05, th)*(1.0-smoothstep(0.95, 1.0, th)*heightStep));
    float offset = mod(floor(ray.pos.y*4.0),2.0)*0.5;
    float phi = fract(fract(acos(dot(normalize(ray.nor.xz), vec2(1,0)))/(PI/5.0))+offset);
    col = mix(vec3(0.0), col, smoothstep(0.0, 0.0, phi)*(1.0-smoothstep(0.95, 1.0, phi))*heightStep);

    col = mix(vec3(0.7), col, heightStep);
    
    return col;
}

vec3 computeColor(Ray ray, vec3 playerPos, vec3 SUN_DIR) {
    vec3 col = vec3(0.0);
    
    // Switch on matID
    // a return -> different/no lighting
    // no return -> default lighting
 	if (ray.matID == 0) {
    	return sky(ray.dir, SUN_DIR);
    } else if (ray.matID == 1){			// reflective balls
        col = vec3(0.8);
    } else if (ray.matID == 2){			// glass balls
        col = vec3(0.8);
    } else if (ray.matID == 3){
		col = centerSphere(ray);
    } else if (ray.matID == 4) {
        col = ground(ray);
    } else if (ray.matID == 5) {
        col = player(ray, playerPos);
    } else if (ray.matID == 6) {
        col = temple(ray);
    }
    
    // Default lighting
    float sunLight = directionalLightDiffuse(ray.nor, SUN_DIR);
    float sunShadow = softshadow(ray.pos, SUN_DIR, playerPos);
    
    float moonLight = directionalLightDiffuse(ray.nor, -SUN_DIR);
    float moonShadow = softshadow(ray.pos, -SUN_DIR, playerPos);
#if (SCENE != 1)
    col = col * (sunLight * sunShadow + 0.4 * moonLight * moonShadow);
#else
    vec3 lightPos = vec3(-50.0, 2.0, 0.0);
    float templeLight = pointLightDiffuse(ray.pos, ray.nor, lightPos, vec3(1.0, 0.0, 0.0));
    //float templeShadow = softshadow(ray.pos, normalize(ray.pos-lightPos));
    col = col * (sunLight * sunShadow + 0.6 * moonLight * moonShadow + templeLight);
#endif
    
    return col;
}

bool isReflective(int matID) {
    return (matID == 1 || matID == 6);
}

bool isRefractive(int matID) {
    return (matID == 2);
}

vec3 calculateNormal(vec3 pos, vec3 playerPos) {
    const vec3 e = vec3(EPS, 0.0, 0.0);
	float p = map(pos, junkMatID, playerPos, true, true);
	return normalize(vec3(map(pos + e.xyy, junkMatID, playerPos, true, true) - p,
           				  map(pos + e.yxy, junkMatID, playerPos, true, true) - p,
                          map(pos + e.yyx, junkMatID, playerPos, true, true) - p));
}

vec3 raymarch(inout Ray ray, vec3 playerPos, bool drawPlayer, bool drawRefractive, vec3 SUN_DIR) {
    float h = 1.0;
    float t = 0.0;
    for(int i = 0; i < MAX_STEPS; i++) {
        h = map(ray.src + t*ray.dir, ray.matID, playerPos, drawPlayer, drawRefractive);
        t += h;
        ray.iter = i;
        if (t > TMAX) break;
    }
    int missed = int(step(TMAX, t));
    ray.matID = (1- missed) * ray.matID;
    ray.t = float(missed)*TMAX + float(1-missed)*t;
    ray.pos = ray.src + ray.t*ray.dir;
    ray.nor = calculateNormal(ray.pos, playerPos);
    if (texture(iChannel1, vec2(KEY_N, 0.25)).x > 0.5)			// Color with normals
        return normalize(0.5*(ray.nor+1.0));
    return computeColor(ray, playerPos, SUN_DIR);
}

vec4 render(Ray ray, vec3 playerPos, bool thirdPerson, vec3 SUN_DIR) {
    vec3 result = raymarch(ray, playerPos, thirdPerson, true, SUN_DIR);
    float t1 = ray.t;
    
#if USE_REFLECTIONS
    // Reflections
    const float REFL_COEF = 0.4;
    float rc = REFL_COEF;
    for (int i = 0; i < NUM_REFLECTIONS; i++) {
        if (!isReflective(ray.matID)) break;
        
        ray.dir = reflect(ray.dir, ray.nor);
        ray.src = ray.pos + EPS*ray.dir;
        result += raymarch(ray, playerPos, true, true, SUN_DIR)*rc;
        rc *= REFL_COEF;
    }
#endif
    
#if USE_REFRACTIONS
    // Refraction
    if (isRefractive(ray.matID)) {
        ray.dir = refract(ray.dir, ray.nor, 1.0/1.2);
        ray.src = ray.pos + EPS*ray.dir;
        result += raymarch(ray, playerPos, true, false, SUN_DIR);
    }
#endif
    
    return vec4(clamp(result, 0.0, 1.0), t1);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
	vec2 uv = fragCoord.xy / iResolution.xy;
    vec2 p = -1.0+2.0*uv; 						// Pixel space of the focal plane
	p.x *= iResolution.x/iResolution.y;
    
    Ray ray;
    ray.pos = vec3(0.0);
    ray.nor = vec3(0.0);
    ray.matID = 0;
    ray.t = 0.0;
    
    #if USE_DAYNIGHT
    vec3 SUN_DIR = normalize(vec3(0, cos(iTime/DAY_LENGTH), sin(iTime/DAY_LENGTH)));
    #else
    vec3 SUN_DIR = normalize(vec3(-1));
    #endif
    vec3 playerPos = texture(iChannel0, (txPlayerPos+0.5)/iChannelResolution[0].xy).xyz;		// world space camera location
    
	// camera	
	float d = 5.5; 								// Distance between eye and focal plane
    vec2 m = iMouse.xy/iResolution.xy;
    if (iMouse.xy == vec2(0)) {
        m = vec2(0.495, 0.53);
    }
    vec3 w = normalize(vec3(cos(2.0*PI*m.x), sin(PI*(m.y-0.5)), sin(2.0*PI*m.x)));
	vec3 u = normalize(cross(w,UP));
	vec3 v = normalize(cross(u,w));
    ray.dir = normalize(p.x*u + p.y*v + d*w);
    ray.src = playerPos;
    
    bool thirdPerson = texture(iChannel1, vec2(KEY_P, 0.25)).x > 0.5;
    if (thirdPerson) {							// Third person
        ray.src -= 5.0*w;
        ray.src.y = max(0.2, ray.src.y);
    }
            
	fragColor = render(ray, playerPos, thirdPerson, SUN_DIR);
}