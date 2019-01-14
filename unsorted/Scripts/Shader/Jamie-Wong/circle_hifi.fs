const int MAX_MARCHING_STEPS = 255;
const float MIN_DIST = 0.0;
const float MAX_DIST  = 100.0;
const float EPSILON = 0.0001;

float sphereSDF(vec3 samplePoint) {
    return length(samplePoint) - 1.0;
}

float sceneSDF(vec3 samplePoint) {
    return sphereSDF(samplePoint);
}

float shortestDistanceToSurface(vec3 eye, vec3 marchingDirection, float start, float end) {
    float depth = start;
    for (int i = 0; i < MAX_MARCHING_STEPS; i++){
        float dist = sceneSDF(eye + depth * marchingDirection);
        if (dist < EPSILON) {
            return depth;
        }
        depth += dist;
        if (depth >= end) {
            return end;
        }
    }
    return end;
}

vec3 rayDirection(float fieldOfView, vec2 size, vec2 fragCoord) {
    vec2 xy = fragCoord - size / 2.0;
    float z = size.y  / tan(radians(fieldOfView) / 2.0);
    return normalize(vec3(xy, -z));
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    vec3 worldEye = getEyeWorldPos();
    // vec3 ro = _position.xyz;
    // vec3 eye = (inverse(iWorldOrientation) * (worldEye - iWorldPosition)) / iWorldScale;

    vec3 dir = rayDirection(45.0, iWorldScale.xz / 2, fragCoord);
    vec3 eye = vec3(0.0, 0.0, 5.0);
    float dist = shortestDistanceToSurface(eye, dir, MIN_DIST, MAX_DIST);

    if (dist > MAX_DIST - EPSILON) {

        // discard;
        fragColor = vec4(0.0, 0.0, 0.0, 1.0);
        return;
    }

    fragColor = vec4(1.0, 0.0, 0.0, 0.0);

}

vec4 getProceduralColor() {
    vec4 result;
    vec2 position = _position.xz;
    
    mainImage(result, position * iWorldScale.xz);
 
    return result;
}

float getProceduralColors(inout vec3 diffuse, inout vec3 specular, inout float shininess) {
    vec4 color = getProceduralColor();
    diffuse = color.rgb;
    specular = color.rgb;
    shininess = 0.5;
    return 1.0;
}