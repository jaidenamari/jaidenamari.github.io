export const vertexShader = `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const fragmentShader = `
  precision highp float;
  
  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uSmokeIntensity;
  uniform float uSmokeSpeed;
  uniform float uSmokeDensity;
  uniform float uDotMatrixIntensity;
  uniform float uDotMatrixScale;
  uniform float uVignetteIntensity;
  uniform float uParticleGlow;
  uniform vec3 uBaseColor;
  uniform vec3 uAccentColor1;
  uniform vec3 uAccentColor2;
  
  varying vec2 vUv;
  
  // Simplex 2D noise
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
      + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
      dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
  
  // Fractal Brownian Motion for smoke with density control
  float fbm(vec2 p, float density) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    
    for(int i = 0; i < 6; i++) {
      value += amplitude * snoise(p * frequency);
      frequency *= 2.0;
      amplitude *= 0.5;
    }
    
    // Apply density transformation
    value = value * 0.5 + 0.5;
    value = pow(value, 1.0 / max(density, 0.1));
    value = value * 2.0 - 1.0;
    
    return value;
  }
  
  // 8x8 Bayer dithering matrix
  float bayerDither(vec2 coord) {
    int x = int(mod(coord.x, 8.0));
    int y = int(mod(coord.y, 8.0));
    int index = x + y * 8;
    
    float dither[64];
    dither[0] = 0.0; dither[1] = 32.0; dither[2] = 8.0; dither[3] = 40.0;
    dither[4] = 2.0; dither[5] = 34.0; dither[6] = 10.0; dither[7] = 42.0;
    dither[8] = 48.0; dither[9] = 16.0; dither[10] = 56.0; dither[11] = 24.0;
    dither[12] = 50.0; dither[13] = 18.0; dither[14] = 58.0; dither[15] = 26.0;
    dither[16] = 12.0; dither[17] = 44.0; dither[18] = 4.0; dither[19] = 36.0;
    dither[20] = 14.0; dither[21] = 46.0; dither[22] = 6.0; dither[23] = 38.0;
    dither[24] = 60.0; dither[25] = 28.0; dither[26] = 52.0; dither[27] = 20.0;
    dither[28] = 62.0; dither[29] = 30.0; dither[30] = 54.0; dither[31] = 22.0;
    dither[32] = 3.0; dither[33] = 35.0; dither[34] = 11.0; dither[35] = 43.0;
    dither[36] = 1.0; dither[37] = 33.0; dither[38] = 9.0; dither[39] = 41.0;
    dither[40] = 51.0; dither[41] = 19.0; dither[42] = 59.0; dither[43] = 27.0;
    dither[44] = 49.0; dither[45] = 17.0; dither[46] = 57.0; dither[47] = 25.0;
    dither[48] = 15.0; dither[49] = 47.0; dither[50] = 7.0; dither[51] = 39.0;
    dither[52] = 13.0; dither[53] = 45.0; dither[54] = 5.0; dither[55] = 37.0;
    dither[56] = 63.0; dither[57] = 31.0; dither[58] = 55.0; dither[59] = 23.0;
    dither[60] = 61.0; dither[61] = 29.0; dither[62] = 53.0; dither[63] = 21.0;
    
    float threshold = 0.0;
    for(int i = 0; i < 64; i++) {
      if(i == index) {
        threshold = dither[i] / 64.0;
        break;
      }
    }
    return threshold;
  }
  
  void main() {
    vec2 uv = vUv;
    vec2 screenCoord = gl_FragCoord.xy;
    
    // Base color with slight teal bias
    vec3 color = uBaseColor;
    
    // Smoke layer using fBM with density control
    if(uSmokeIntensity > 0.0) {
      vec2 smokeUV = uv * 2.5;
      smokeUV += uTime * uSmokeSpeed * 0.015;
      
      float smoke1 = fbm(smokeUV, uSmokeDensity);
      float smoke2 = fbm(smokeUV * 1.3 + vec2(uTime * uSmokeSpeed * 0.008, uTime * uSmokeSpeed * 0.005), uSmokeDensity);
      float smoke = (smoke1 + smoke2) * 0.5;
      smoke = smoke * 0.5 + 0.5;
      
      vec3 smokeColor = mix(uAccentColor1, uAccentColor2, smoke);
      color += smokeColor * smoke * uSmokeIntensity * 0.25;
    }
    
    // Dot matrix dithering
    if(uDotMatrixIntensity > 0.0) {
      vec2 dotCoord = screenCoord / uDotMatrixScale;
      float dither = bayerDither(dotCoord);
      
      float luminance = dot(color, vec3(0.299, 0.587, 0.114));
      float ditherResult = step(dither * 0.6, luminance + 0.15);
      
      color = mix(color, color * (0.7 + ditherResult * 0.5), uDotMatrixIntensity);
    }
    
    // Floating particle glow spots
    if(uParticleGlow > 0.0) {
      for(int i = 0; i < 8; i++) {
        float fi = float(i);
        vec2 particlePos = vec2(
          sin(uTime * 0.03 + fi * 1.7) * 0.3 + 0.5 + cos(fi * 2.3) * 0.2,
          cos(uTime * 0.025 + fi * 2.1) * 0.3 + 0.5 + sin(fi * 1.9) * 0.2
        );
        
        float dist = distance(uv, particlePos);
        float glow = exp(-dist * 8.0) * 0.3;
        
        vec3 glowColor = mod(fi, 2.0) < 1.0 ? uAccentColor1 : uAccentColor2;
        color += glowColor * glow * uParticleGlow;
      }
    }
    
    // Vignette
    if(uVignetteIntensity > 0.0) {
      vec2 vignetteUV = uv * (1.0 - uv.yx);
      float vignette = vignetteUV.x * vignetteUV.y * 15.0;
      vignette = pow(vignette, uVignetteIntensity * 0.5);
      color *= vignette;
    }
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

export interface ShaderUniforms {
  uTime: number;
  uResolution: [number, number];
  uSmokeIntensity: number;
  uSmokeSpeed: number;
  uSmokeDensity: number;
  uDotMatrixIntensity: number;
  uDotMatrixScale: number;
  uVignetteIntensity: number;
  uParticleGlow: number;
  uBaseColor: [number, number, number];
  uAccentColor1: [number, number, number];
  uAccentColor2: [number, number, number];
}

export const defaultUniforms: ShaderUniforms = {
  uTime: 0,
  uResolution: [1920, 1080],
  uSmokeIntensity: 0.8,
  uSmokeSpeed: 1.0,
  uSmokeDensity: 1.0,
  uDotMatrixIntensity: 0.4,
  uDotMatrixScale: 2.0,
  uVignetteIntensity: 0.6,
  uParticleGlow: 0.6,
  uBaseColor: [0.04, 0.04, 0.06],
  uAccentColor1: [0.06, 0.81, 0.62],
  uAccentColor2: [1.0, 0.0, 1.0],
};

