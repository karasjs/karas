#version 100

attribute vec4 a_position;

attribute vec2 a_texCoords1;
attribute vec2 a_texCoords2;
varying vec2 v_texCoords1;
varying vec2 v_texCoords2;

void main() {
  gl_Position = a_position;
  v_texCoords1 = a_texCoords1;
  v_texCoords2 = a_texCoords2;
}
