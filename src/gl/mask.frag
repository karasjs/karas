#version 100

#ifdef GL_ES
precision mediump float;
#endif

varying vec2 v_texCoords1;
varying vec2 v_texCoords2;

uniform sampler2D u_texture1;
uniform sampler2D u_texture2;

void main() {
  vec4 color1 = texture2D(u_texture1, v_texCoords1);
  vec4 color2 = texture2D(u_texture2, v_texCoords2);
  gl_FragColor = color1 * color2.a;
}
