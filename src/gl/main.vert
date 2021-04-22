#version 100

attribute vec4 a_position;

attribute vec2 a_texCoords;
varying vec2 v_texCoords;

attribute float a_opacity;
varying float v_opacity;

void main() {
  gl_Position = a_position;
  v_texCoords = a_texCoords;
  v_opacity = a_opacity;
}
