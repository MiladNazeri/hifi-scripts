// i lOVE THIS:
Twister Bomb
particleVariation1 = Object.assign(particleBaseProps, {
            lifespan: 5,
            radiusSpread: 1.0,
            radiusStart: 0.01,  // making this 1.0 makes a bigger hit
            radiusFinish: 0.01
        });

var tan = Math.abs(Math.tan(radians) * 4000);
                // var tan = Math.tan(radians) * 0.005;

                var newParticleProps = {};
                newParticleProps["position"] = adjustedVector;
                // newParticleProps[EMIT_SPEED] = tan;
                newParticleProps[EMIT_SPEED] = tan;

