#version 100

#ifdef GL_ES
precision mediump float;
#endif

varying vec2 v_texCoords;
uniform sampler2D u_texture;
uniform vec2 u_direction;

void main() {
  gl_FragColor = vec4(0.0);
  placeholder;
}
