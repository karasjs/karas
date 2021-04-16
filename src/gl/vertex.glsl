#version 100

attribute vec4 a_position;

attribute vec2 a_texCoords;
varying vec2 v_texCoords;

attribute mat4 a_matrix;

attribute float a_opacity;
varying float v_opacity;

attribute float a_index;
varying float v_index;

void main() {
  gl_Position = a_position;
  v_texCoords = a_texCoords;
  v_opacity = a_opacity;
  v_index = a_index;
}
