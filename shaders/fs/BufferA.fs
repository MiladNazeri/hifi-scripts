/**	Player Movement
	
	This buffer keeps track of the players position and velocity.

	Pressing a key will set your goal velocity, and you will accelerate towards that
	velocity non-linearly for smooth starts and stops.

	WASD/arrow keys to move
	Space to use your jetpack.

	If your machine is slower you might need to turn VEL_MAG up so you move faster.

	I used https://www.shadertoy.com/view/MddGzf to figure out how render buffers worked.

	Press R to reset your position
**/
// Math constants
const float PI = 3.14159265359;
const float EPS = 0.0001;

// Texel addresses
const vec2 txPlayerPos = vec2(0.0,0.0);
const vec2 txPlayerVel = vec2(1.0,0.0);

// Texel storage constants
const float KEY_SPACE = 32.5/256.0;
const float KEY_LEFT  = 37.5/256.0;
const float KEY_UP    = 38.5/256.0;
const float KEY_RIGHT = 39.5/256.0;
const float KEY_DOWN  = 40.5/256.0;
const float KEY_W  = 87.5/256.0;
const float KEY_A  = 65.5/256.0;
const float KEY_S  = 83.5/256.0;
const float KEY_D  = 68.5/256.0;
const float KEY_R  = 82.5/256.0;

// Other constants
const float PLAYER_HEIGHT = 1.0;
const float VEL_MAG = 50.0;
const float GRAVITY = -20.0;
const vec3 UP = vec3(0.0, 1.0, 0.0);

// Render buffer helpers
vec4 loadValue(in vec2 re) {
    return texture(iChannel0, (0.5 + re)/iChannelResolution[0].xy, -100.0);
}

float isInside(vec2 p, vec2 c) {
    vec2 d = abs(p-0.5-c) - 0.5;
    return -max(d.x,d.y);
}

void storeValue( in vec2 re, in vec4 va, inout vec4 fragColor, in vec2 fragCoord) {
    fragColor = (isInside(fragCoord, re) > 0.0) ? va : fragColor;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    if(fragCoord.x > 2.0 || fragCoord.y > 1.0) discard;
    
    vec3 playerPos = loadValue(txPlayerPos).xyz;
    vec3 playerVel = loadValue(txPlayerVel).xyz;
    
    if(iFrame == 0 || texture(iChannel1, vec2(KEY_R, 0.25)).x > 0.5) {
        playerPos = vec3(30.0, 10.0, 0.0);
        playerVel = vec3(0);
    }
    
    vec3 goalVelocity = vec3(0.0);
    
    vec2 m = iMouse.xy/iResolution.xy;
    if (iMouse.xy == vec2(0)) {
        m = vec2(0.495, 0.53);
    }
    vec3 w = VEL_MAG*normalize(vec3(cos(2.0*PI*m.x), sin(PI*(m.y-0.5)), sin(2.0*PI*m.x)));
	vec3 u = VEL_MAG*normalize(cross(w,UP));
    
    // WASD/arrow key movement
    if (texture(iChannel1, vec2(KEY_UP, 0.25)).x > 0.5 ||
       texture(iChannel1, vec2(KEY_W, 0.25)).x > 0.5) {
        goalVelocity += w;
    }
    if (texture(iChannel1, vec2(KEY_DOWN, 0.25)).x > 0.5 ||
       texture(iChannel1, vec2(KEY_S, 0.25)).x > 0.5) {
        goalVelocity += -w;
    }
    if (texture(iChannel1, vec2(KEY_RIGHT, 0.25)).x > 0.5 ||
       texture(iChannel1, vec2(KEY_D, 0.25)).x > 0.5) {
        goalVelocity += u;
    }
    if (texture(iChannel1, vec2(KEY_LEFT, 0.25)).x > 0.5 ||
       texture(iChannel1, vec2(KEY_A, 0.25)).x > 0.5) {
        goalVelocity += -u;
    }
    
    // Jetpack
    if (texture(iChannel1, vec2(KEY_SPACE, 0.25)).x > 0.5) {
        goalVelocity += VEL_MAG/2.0*UP;
    } else {
        goalVelocity.y = playerVel.y;
    }
    
    vec3 accel = 15.0*(goalVelocity - playerVel);
    accel += vec3(0, GRAVITY, 0);
    
    playerVel = playerVel + accel * iTimeDelta;
    playerPos += playerVel * iTimeDelta;
    
    if (playerPos.y < PLAYER_HEIGHT) {
        playerPos.y = PLAYER_HEIGHT + EPS;
        playerVel.y = 0.0;
    }
    
    if (dot(playerPos.xz,playerPos.xz) > 100.0*100.0) {
        playerPos.xz = (100.0-EPS)*normalize(playerPos.xz);
        playerVel.xz = vec2(0.0);
    }
    
    fragColor = vec4(0.0); 
    storeValue(txPlayerPos, vec4(playerPos,0.0), fragColor, fragCoord);
    storeValue(txPlayerVel, vec4(playerVel,0.0), fragColor, fragCoord);
}