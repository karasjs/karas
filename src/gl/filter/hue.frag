#version 100

#ifdef GL_ES
precision mediump float;
#endif

varying vec2 v_texCoords;

uniform sampler2D u_texture;
uniform float u_deg;

vec3 premultipliedAlpha(vec4 color) {
  float a = color.a;
  if(a == 0.0) {
    return vec3(0.0, 0.0, 0.0);
  }
  return vec3(color.r / a, color.g / a, color.b / a);
}

vec3 hueShift(vec3 color, float hue) {
  const vec3 k = vec3(0.57735, 0.57735, 0.57735);
  float cosAngle = cos(hue);
  return vec3(color * cosAngle + cross(k, color) * sin(hue) + k * dot(k, color) * (1.0 - cosAngle));
}

void main() {
  vec4 color = texture2D(u_texture, v_texCoords);
  float a = color.a;
  vec3 res = premultipliedAlpha(color);
  vec3 res2 = hueShift(res, u_deg);
  gl_FragColor = vec4(res2 * a, a);
}
