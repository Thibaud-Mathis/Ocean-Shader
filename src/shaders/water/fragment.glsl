uniform vec3 u_DepthColor;
uniform vec3 u_SurfaceColor;
varying float vElevation;
uniform float u_ColorMultiplier;
uniform float u_ColorOffset;

void main() {
    // gl_FragColor = vec4(1.,0.3,0.,1.);
    vec3 color = mix(u_DepthColor, u_SurfaceColor, vElevation * u_ColorMultiplier + u_ColorOffset);
    gl_FragColor = vec4(color,1.);
} 