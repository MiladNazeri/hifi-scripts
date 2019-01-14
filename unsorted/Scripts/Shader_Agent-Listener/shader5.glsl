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

uniform float test;

void mainImage( out vec4 fragColor, in vec3 fragCoord ) {

	float p;
	float r;
	vec3 col;
	p = test * 5;
	r = test * 5;
	col = vec3(
		0.5,
		0.7,
		0.2
	);

	// vec3 worldEye = getEyeWorldPos();
    // this will make it movable, scalable, and rotatable
	// vec3 ro = _position.xyz;
    // vec3 eye = (inverse(iWorldOrientation) * (ro - iWorldPosition)) / iWorldScale;
	// vec3 test = (ro - iWorldPosition) / iWorldScale;
	// if (test >= 0.05) {
		// if (ro.x > 1.0) {
		// 	col = vec3(
		// 		1.0,
		// 		0,
		// 		0
		// 	);
		// }
	// 
	col = vec3(
		fragCoord.x + test,
		fragCoord.y + test,
		fragCoord.z + test
	);
	fragColor = vec4(col, 1.0);
}

vec4 getProceduralColor() {
    vec4 result;
    mainImage(result, vec3(_position.xyz));
    return result;
}

float getProceduralColors(inout vec3 diffuse, inout vec3 specular, inout float shininess) {
    specular = vec3(1.0, 1.0, 1.0);
    shininess = 250.0;
    diffuse = getProceduralColor().xyz;
    return 1.0;
}
