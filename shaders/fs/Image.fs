/** Depth Aware Fast Approximation Anti-Aliasing
	
	This was an implementation I devised for the Ray project in CS123, somewhat
	optimized for GLSL.

	Based on differences in depths between neighboring pixels, a pixel is blurred
	horizontally, vertically, or both.

	Hold B to turn off anti-aliasing for comparison
	Hold V to visualize the edges that will be blurred
	Hold M to draw the depth
**/
// Other constants
const float TMAX = 250.0;

// Texel storage constants
const float KEY_M  = 77.5/256.0;
const float KEY_B  = 66.5/256.0;
const float KEY_V  = 86.5/256.0;

void mainImage(out vec4 fragColor, in vec2 fragCoord) {    
	vec4 col = texture(iChannel0, fragCoord/iChannelResolution[0].xy);

    if (texture(iChannel1, vec2(KEY_M, 0.25)).x > 0.5) {					// Depth
        fragColor = vec4(vec3(0.75*pow(col.w/TMAX, 0.25)),1.0);
    } else if (texture(iChannel1, vec2(KEY_B, 0.25)).x < 0.5) {			// FXAA
        vec4 middle = col;
        vec4 left = texture(iChannel0, (fragCoord+vec2(-1,0))/iChannelResolution[0].xy);
        vec4 right = texture(iChannel0, (fragCoord+vec2(1,0))/iChannelResolution[0].xy);
        vec4 top = texture(iChannel0, (fragCoord+vec2(0,-1))/iChannelResolution[0].xy);
        vec4 bottom = texture(iChannel0, (fragCoord+vec2(0,1))/iChannelResolution[0].xy);

        float h = abs((left.w-middle.w)/(right.w-middle.w));
        float v = abs((top.w-middle.w)/(bottom.w-middle.w));

        const float EDGE_THRESHOLD = 5.0;
        const int BLUR_RADIUS = 5;

        vec4 result = vec4(0.0);
        float xRadius = float(BLUR_RADIUS)*step(EDGE_THRESHOLD, h);
        float yRadius = float(BLUR_RADIUS)*step(EDGE_THRESHOLD, v);

        if (texture(iChannel1, vec2(KEY_V, 0.25)).x > 0.5) {				// AA edges
            fragColor = vec4(col.xyz, 1.0);
            float xStep = step(0.5, xRadius);
            float yStep = step(0.5, yRadius);
            fragColor.z = xStep + fragColor.z*(1.0-xStep);
            fragColor.y = yStep + fragColor.y*(1.0-yStep);
            return;
        }

        float total = 0.0;
        for (int y = -BLUR_RADIUS; y <= BLUR_RADIUS; y++) {
            for (int x = -BLUR_RADIUS; x <= BLUR_RADIUS; x++) {
                float weightx = 1.0 - abs(float(x)/float(BLUR_RADIUS))*step(0.5, xRadius);
                float weighty = 1.0 - abs(float(y)/float(BLUR_RADIUS))*step(0.5, yRadius);
                float weight = weightx*weighty;
                float xx = float(x)*step(0.5, xRadius);
                float yy = float(y)*step(0.5, yRadius);
                result += texture(iChannel0, (fragCoord+vec2(xx,yy))/iChannelResolution[0].xy)*weight;
                total += weight;
            }
        }
        result /= total;
        fragColor = vec4(result.xyz, 1.0);
    } else {																// Normal
        fragColor = vec4(col.xyz, 1.0);
    }
}