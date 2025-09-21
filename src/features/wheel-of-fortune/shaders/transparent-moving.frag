uniform float time;
uniform vec3 color;
uniform sampler2D map;
uniform float opacity;
uniform float speed;
uniform float waveIntensity;
uniform float transparency;
uniform float textureScale;
uniform float textureRotation;
uniform float textureOffsetX;
uniform float textureOffsetY;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

// Función para crear ondas de movimiento
float wave(vec2 pos, float frequency, float amplitude, float speed) {
  return sin(pos.x * frequency + time * speed) * amplitude;
}

// Función para crear efecto de distorsión
vec2 distortion(vec2 uv, float intensity) {
  float wave1 = wave(uv, 3.0, intensity * 0.1, speed);
  float wave2 = wave(uv, 5.0, intensity * 0.05, speed * 1.5);
  
  return uv + vec2(wave1, wave2);
}

// Función para crear efecto de pulso
float pulse(float t, float frequency) {
  return 0.5 + 0.5 * sin(t * frequency);
}

// Función para aplicar transformaciones de textura
vec2 applyTextureTransform(vec2 uv) {
  // Centrar las coordenadas UV
  vec2 centeredUv = uv - 0.5;
  
  // Aplicar rotación
  float cosRot = cos(textureRotation);
  float sinRot = sin(textureRotation);
  vec2 rotatedUv = vec2(
    centeredUv.x * cosRot - centeredUv.y * sinRot,
    centeredUv.x * sinRot + centeredUv.y * cosRot
  );
  
  // Aplicar escala (multiplicar por textureScale para que coincida con Three.js)
  rotatedUv *= textureScale;
  
  // Aplicar offset
  rotatedUv += vec2(textureOffsetX, textureOffsetY);
  
  // Volver a centrar
  return rotatedUv + 0.5;
}

void main() {
  // Crear efecto de movimiento con distorsión
  vec2 distortedUv = distortion(vUv, waveIntensity);
  
  // Aplicar transformaciones de textura
  vec2 transformedUv = applyTextureTransform(distortedUv);
  
  // Aplicar textura si está disponible
  vec4 textureColor = texture2D(map, transformedUv);
  
  // Crear efecto de transparencia variable
  float alpha = opacity * transparency;
  
  // Añadir efecto de pulso para mayor dinamismo
  float pulseEffect = pulse(time, 2.0);
  alpha *= (0.7 + 0.3 * pulseEffect);
  
  // Crear efecto de gradiente radial para mayor profundidad
  float radialGradient = 1.0 - length(vUv - 0.5) * 2.0;
  alpha *= (0.5 + 0.5 * radialGradient);
  
  // Mezclar color base con textura
  vec3 finalColor = mix(color, textureColor.rgb, textureColor.a);
  
  // Añadir efecto de brillo sutil basado en la normal
  float fresnel = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
  finalColor += fresnel * 0.2;
  
  gl_FragColor = vec4(finalColor, alpha);
}
