#version 100

#ifdef GL_ES
precision mediump float;
#endif

varying vec2 v_texCoords;

uniform sampler2D u_texture1;
uniform sampler2D u_texture2;

float op(float a, float b) {
  return max(a, b);
}

vec3 premultipliedAlpha(vec4 color) {
  float a = color.a;
  if(a == 0.0) {
    return vec3(0.0, 0.0, 0.0);
  }
  return vec3(color.r / a, color.g / a, color.b / a);
}

float alphaCompose(float a1, float a2, float a3, float c1, float c2, float c3) {
  return (1.0 - a2 / a3) * c1 + a2 / a3 * ((1.0 - a1) * c2 + a1 * c3);
}

void main() {
  vec4 color1 = texture2D(u_texture1, v_texCoords);
  vec4 color2 = texture2D(u_texture2, v_texCoords);
  if(color1.a == 0.0) {
    gl_FragColor = color2;
  }
  else if(color2.a == 0.0) {
    gl_FragColor = color1;
  }
  else {
    vec3 bottom = premultipliedAlpha(color1);
    vec3 top = premultipliedAlpha(color2);
    vec3 res = vec3(op(bottom.r, top.r), op(bottom.g, top.g), op(bottom.b, top.b));
    float a = color1.a + color2.a - color1.a * color2.a;
    gl_FragColor = vec4(
    alphaCompose(color1.a, color2.a, a, bottom.r, top.r, res.r) * a,
    alphaCompose(color1.a, color2.a, a, bottom.g, top.g, res.g) * a,
    alphaCompose(color1.a, color2.a, a, bottom.b, top.b, res.b) * a,
    a
    );
  }
}
