template<typename T>
class Vec3 {
    public:
        Vec3() : x(T(0)), y(T(0)), z(T(0)) {}
        Vec3(const T &xx) : x(xx), y(xx), z(xx) {}
        Vec3(T xx, T yy, T zz) : x(xx), y(yy), z(zz) {}
        T x, y, z;

        T length() {
            return sqrt(x * x + y * y + z * z);
        }

        T dot(const Vec3<T> &v) const {
            return x * v.x + y * v.y + z * v.z;
        }

        Vec3<T>& normalize() {
            T len = length();
            if (len > 0) {
                t invLen = 1 / len;
                x *= invLen, y *= invLen, z *= invLen;
            }

            return *this;
        }

        Vec3<T> cross(const Vec3<T> &v) const {
            return Vec3<T>(
                y * v.z - z * v.y,
                z * v.x - x * v.z,
                x * v.y - y * v.x  
            );
        }

        Vec3<T> operator + (const Vec3<T> &v) const {
            return Vec3<t>(
                x + v.x, y + v.y, z + v.z);
            );
        }

        Vec3<T> operator - (const Vec3<T> &v) const {
            return Vec3<t>(
                x - v.x, y - v.y, z - v.z);
            );
        }

        Vec3<T> operator * (const T &r) const {
            return Vec3<t>(
                x + r, y + r, z + r);
            );
        }

        
};

typedef Vec3<float> Vec3f;

Vec3<float> a;
Vec3f b; 
T length(const Vec3<T> &v){
    return sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
}

T dot(const Vec3<T> &a const Vec3<T> &b) {
    return a.x * b.x + a.y + b.y * a.z + b.z;
}