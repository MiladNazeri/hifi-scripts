function registerPolyfills() {
    if (typeof Object.assign !== 'function') {
        // Must be writable: true, enumerable: false, configurable: true
        Object.defineProperty(Object, "assign", {
            value: function assign(target, varArgs) { // .length of function is 2
                'use strict';
                if (target == null) { // TypeError if undefined or null
                    throw new TypeError('Cannot convert undefined or null to object');
                }

                var to = Object(target);

                for (var index = 1; index < arguments.length; index++) {
                    var nextSource = arguments[index];

                    if (nextSource != null) { // Skip over if undefined or null
                        for (var nextKey in nextSource) {
                            // Avoid bugs when hasOwnProperty is shadowed
                            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                                to[nextKey] = nextSource[nextKey];
                            }
                        }
                    }
                }
                return to;
            },
            writable: true,
            configurable: true
        });
    }
    if (!Array.prototype.findIndex) {
        Object.defineProperty(Array.prototype, 'findIndex', {
            value: function (predicate) {
                // 1. Let O be ? ToObject(this value).
                if (this == null) {
                    throw new TypeError('"this" is null or not defined');
                }

                var o = Object(this);

                // 2. Let len be ? ToLength(? Get(O, "length")).
                var len = o.length >>> 0;

                // 3. If IsCallable(predicate) is false, throw a TypeError exception.
                if (typeof predicate !== 'function') {
                    throw new TypeError('predicate must be a function');
                }

                // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
                var thisArg = arguments[1];

                // 5. Let k be 0.
                var k = 0;

                // 6. Repeat, while k < len
                while (k < len) {
                    // a. Let Pk be ! ToString(k).
                    // b. Let kValue be ? Get(O, Pk).
                    // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
                    // d. If testResult is true, return k.
                    var kValue = o[k];
                    if (predicate.call(thisArg, kValue, k, o)) {
                        return k;
                    }
                    // e. Increase k by 1.
                    k++;
                }

                // 7. Return -1.
                return -1;
            },
            configurable: true,
            writable: true
        });
    }

    colorMix = function(colorA, colorB, mix) {
        var result = {};
        for (var key in colorA) {
            result[key] = (colorA[key] * (1 - mix)) + (colorB[key] * mix);
        }
        return result;
    }
    
    setEntityUserData = function(id, data) {
        var json = JSON.stringify(data)
        Entities.editEntity(id, { userData: json });
    }
    
    // FIXME do non-destructive modification of the existing user data
    getEntityUserData = function(id) {
        var results = null;
        var properties = Entities.getEntityProperties(id, "userData");
        if (properties.userData) {
            try {
                results = JSON.parse(properties.userData);
            } catch(err) {
                logDebug(err);
                logDebug(properties.userData);
            }
        }
        return results ? results : {};
    }
    
    setEntityCustomData = function(customKey, id, data) {
        var userData = getEntityUserData(id);
        if (data == null) {
            delete userData[customKey];
        } else {
            userData[customKey] = data;
        }
        setEntityUserData(id, userData);
    }
    
    getEntityCustomData = function(customKey, id, defaultValue) {
        var userData = getEntityUserData(id);
        if (undefined != userData[customKey]) {
            return userData[customKey];
        } else {
            return defaultValue;
        }
    
    
    // Computes the penetration between a point and a sphere (centered at the origin)
    // if point is inside sphere: returns true and stores the result in 'penetration'
    // (the vector that would move the point outside the sphere)
    // otherwise returns false
    findSphereHit = function(point, sphereRadius) {
        var EPSILON = 0.000001;     //smallish positive number - used as margin of error for some computations
        var vectorLength = Vec3.length(point);
        if (vectorLength < EPSILON) {
            return true;
        }
        var distance = vectorLength - sphereRadius;
        if (distance < 0.0) {
            return true;
        }
        return false;
    }
    
    findSpherePointHit = function(sphereCenter, sphereRadius, point) {
        return findSphereHit(Vec3.subtract(point,sphereCenter), sphereRadius);
    }
    
    findSphereSphereHit = function(firstCenter, firstRadius, secondCenter, secondRadius) {
        return findSpherePointHit(firstCenter, firstRadius + secondRadius, secondCenter);
    }
    
    randFloat = function(low, high) {
        return low + Math.random() * (high - low);
    }
    
    
    randInt = function(low, high) {
        return Math.floor(randFloat(low, high));
    }
    
    
    randomColor = function() {
        return {
                    red: randInt(0, 255),
                    green: randInt(0, 255),
                    blue: randInt(0, 255)
                }
    }
    
    hslToRgb = function(hsl) {
        var r, g, b;
        if (hsl.s == 0) {
            r = g = b = hsl.l; // achromatic
        } else {
            var hue2rgb = function hue2rgb(p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            }
    
            var q = hsl.l < 0.5 ? hsl.l * (1 + hsl.s) : hsl.l + hsl.s - hsl.l * hsl.s;
            var p = 2 * hsl.l - q;
            r = hue2rgb(p, q, hsl.h + 1 / 3);
            g = hue2rgb(p, q, hsl.h);
            b = hue2rgb(p, q, hsl.h - 1 / 3);
        }
    
        return {
            red: Math.round(r * 255),
            green: Math.round(g * 255),
            blue: Math.round(b * 255)
        };
    }

    return {
        colorMix: colorMix,
        hslToRgb: hslToRgb,
    }
}

module.exports = registerPolyfills;