#version 100

#ifdef GL_ES
precision mediump float;
#endif

varying vec2 v_texCoords;

uniform sampler2D u_texture;
uniform float u_opacity;

void main() {
  gl_FragColor = texture2D(u_texture, v_texCoords) * u_opacity;
}
