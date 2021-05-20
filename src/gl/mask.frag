#version 100

#ifdef GL_ES
precision mediump float;
#endif

varying vec2 v_texCoords;

uniform sampler2D u_texture1;
uniform sampler2D u_texture2;

void main() {
  vec4 color1 = texture2D(u_texture1, v_texCoords);
  vec4 color2 = texture2D(u_texture2, v_texCoords);
  float a = color1.a * color2.a;
  gl_FragColor = vec4(color1.rgb * color2.a, a);
}
