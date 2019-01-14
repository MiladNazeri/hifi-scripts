template<typeName T>
class Matrix44 {
    public:
        Matrix44() {}
        const T* operator [] (uint8_t i) const {
            return m[i];
        }
        T* operator [] (uint8_t i) const { return m[i]; }
        T m[4][4] = {
            {1,0,0,0},
            {0,1,0,0},
            {0,0,1,0},
            {0,0,0,1}
        };
}

typedef Matrix44<float> Matrix44f;

