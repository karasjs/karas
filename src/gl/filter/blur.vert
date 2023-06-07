#version 100

attribute vec4 a_position;
attribute vec2 a_texCoords;
varying vec2 v_texCoords;

void main() {
  gl_Position = a_position;
  v_texCoords = a_texCoords;
}
