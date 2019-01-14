vec4 getProceduralColor() {
    // set intensity to a sine wave with a frequency of 1 Hz
    float intensity = sin(iGlobalTime * 3.14159 * 2.0);

    // Raise the wave to move between 0 and 2
    intensity += 1.0;

    // Reducce the amplitude to between 0 and 1
    intensity /= 2.0;

    // Set the base color to blue
    vec3 color = vec3(0.0, 0.0, 1.0);

    // Multiply by the intensity
    color *= intensity;

    // return the color as a vec 4
    return vec4(color, 1.0);
}
