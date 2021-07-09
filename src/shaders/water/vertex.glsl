uniform float u_bigWavesElevations;
uniform vec2 u_bigWavesFrequency;
uniform float u_time;
uniform float u_bigWaveSpeed;

varying float vElevation;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    float elevationX = sin(modelPosition.x * u_bigWavesFrequency.x + u_time * u_bigWaveSpeed) *
                       sin(modelPosition.z * u_bigWavesFrequency.y + u_time * u_bigWaveSpeed) * 
                       u_bigWavesElevations;

    modelPosition.y = elevationX;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    vElevation = elevationX;

    gl_Position = projectedPosition;
}