float plot(vec2 st, float pct){
	return smoothstep(pct - 0.1, pct, st.y) - smoothstep(pct, pct + 0.2, st.y);
}

void mainImage( out vec4 fragColor, in vec3 fragCoord ) {
	vec2 st = fragCoord.xz;

	float y = st.x;

	vec3 color = vec3(y);

	// Plot a line
	float pct = plot(st, y);
	color = (1.0 - pct) * color + pct * vec3(0.0, 1.0, 0.0);

	fragColor = vec4(color, 1.0);
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

