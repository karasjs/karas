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
    gl_FragColor = vec4(op(color1.r, color2.r), op(color1.g, color2.g), op(color1.b, color2.b), 1.0);
  }
}
