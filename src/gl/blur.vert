#version 100

attribute vec4 a_position;

attribute vec2 a_texCoords;
varying vec2 v_texCoords;
varying vec2 v_texCoordsBlur[3];

void main() {
  gl_Position = a_position;
  v_texCoordsBlur[0] = a_texCoords + vec2(0.0, -0.01);
  v_texCoordsBlur[1] = a_texCoords;
  v_texCoordsBlur[2] = a_texCoords + vec2(0.0, 0.01);
  v_texCoords = a_texCoords;
}
