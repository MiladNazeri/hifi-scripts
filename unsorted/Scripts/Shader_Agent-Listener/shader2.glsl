// https://www.shadertoy.com/view/Md2GRc
/*
    {
        "ProceduralEntity": {
            "shaderUrl": "file:///C:/msys64/home/ajthy/code/hifi/examples/fractal_lines_of_symmetry.glsl",
            "version": 2,
            "uniforms": {
            }
        }
    }
*/
{"x":-33.258304595947266,"y":4990.18212890625,"z":-19.042888641357422}
uniform float test;


vec3 hsv(in float h, in float s, in float v)
{
	return mix(
		vec3(1.0), 
		clamp(
			(abs(
				fract(
					h + vec3(3, 2, 1) 
					/ 3.0
				) 
			* 6.0 - 3.0) 
		- 1.0), 
		0.0 , 
		1.0), s) * v;
}

vec3 formula(in vec2 p, in vec2 c)
{
	const float n = 2.0;
	const int iters = 12;

	float time = iGlobalTime*0.1;
	vec3 col = vec3(0);
	float t = 1.0;
	float dpp = dot(p, p);
	float lp = sqrt(dpp);
	float r = smoothstep(0.0, 0.2, lp);

	for (int i = 0; i < iters; i++) {
		// The transformation
		p = abs(mod(p/dpp + c, n) - n/2.0);

		dpp = dot(p, p);
		lp = sqrt(dpp);

		//Shade the lines of symmetry black
#if 0
		// Get constant width lines with fwidth()
		float nd = fwidth(dpp);
		float md = fwidth(lp);
		t *= smoothstep(0.0, 0.5, abs((n/2.0-p.x)/nd*n))
		   * smoothstep(0.0, 0.5, abs((n/2.0-p.y)/nd*n))
		   * smoothstep(0.0, 0.5, abs(p.x/md))
		   * smoothstep(0.0, 0.5, abs(p.y/md));
#else
		// Variable width lines
		t *= smoothstep(0.0, 0.01, abs(n/2.0-p.x)*lp)
		   * smoothstep(0.0, 0.01, abs(n/2.0-p.y)*lp)
		   * smoothstep(0.0, 0.01, abs(p.x)*2.0)
		   * smoothstep(0.0, 0.01, abs(p.y)*2.0);
#endif

		// Fade out the high density areas, they just look like noise
		r *= smoothstep(0.0, 0.2, lp);

		// Add to colour using hsv
		col += hsv(1.0 - max(p.x, p.y) + t*2.0 + time, 2.0-lp+t, r);

	}

	return (-cos(col/4.0)*0.5 + 0.5)*(t);
}

void mainImage( out vec4 fragColor, in vec3 fragCoord ) {

    // vec2 iResolution = vec2(1024.0, 1024.0);
	// vec2 iResolution = vec2(1024.0, 1024.0);
	// vec2 p = fragCoord.xy / iResolution.xy;
	// vec2 p = -1.0 + 2.0 * fragCoord.xy / iResolution.xy;
	// p.x *= iResolution.x / iResolution.y;
	// p *= 2.0;
	// const vec2 e = vec2(0.06545465634, -0.05346356485);
	// vec2 c = iGlobalTime*e;
	//c = 8.0*iMouse.xy/iResolution.xy;
	// float d = 1.0;
	// )
	float p;
	float r;
	vec3 col;
	if (test > 0.08){
		p = sin(test * 1000) * 100;
		r = cos(test * 100);
		col = vec3(
			fragCoord.x * r, 
			fragCoord.z / p + r, 
			fragCoord.z + p 
		);
	} else if (test < 0.08 && test > 0.05 ) {
		p = sin(iGlobalTime) * 20;
		r = cos(iGlobalTime) * 20;
		col = vec3(
			fragCoord.y * p, 
			fragCoord.z / p + r, 
			fragCoord.y * p 
		);
	} else if (test < 0.04 && test > 0.01 ) {
		p = sin(iGlobalTime) * 2;
		r = cos(iGlobalTime) * 2;
		col = vec3(
			fragCoord.x * r * r, 
			fragCoord.y / p + r, 
			fragCoord.z * p 
		);
	} else {
		p = 0;
		r = 0;
		col = vec3(
			fragCoord.x * r, 
			fragCoord.x / p + r, 
			fragCoord.x * p 
		);
	}


	// const float blursamples = 4.0;
	// float sbs = sqrt(blursamples);
	// float mbluramount = 1.0/iResolution.x/length(e)/blursamples*2.0;
	// float aabluramount = 1.0/iResolution.x/sbs*4.0;
	// for (float b = 0.0; b < blursamples; b++) {
	// 	col += formula(
	// 		p + vec2(mod(b, sbs)*aabluramount, b/sbs*aabluramount),
	// 		c + e*mbluramount*b);
	// }
	// col /= blursamples;

	fragColor = vec4(col, 1.0);
}

vec4 getProceduralColor() {
    vec4 result;
    // vec2 position = vec2(0, 0) + _position.xz;
    // mainImage(result, position * iWorldScale.xz);
    mainImage(result, vec3(_position.xyz));
    return result;
}

float getProceduralColors(inout vec3 diffuse, inout vec3 specular, inout float shininess) {
    specular = vec3(1.0, 1.0, 1.0);
    shininess = 1.0;
    diffuse = getProceduralColor().xyz;
    return 1.0;
}
