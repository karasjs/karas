#version 100

attribute vec4 a_position;

attribute vec2 a_texCoords;
varying vec2 v_texCoords;
varying vec2 v_texCoordsBlur[3];

uniform vec2 u_direction;

void main() {
  gl_Position = a_position;
  v_texCoordsBlur[0] = a_texCoords + vec2(-0.01, -0.01) * u_direction;
  v_texCoordsBlur[1] = a_texCoords;
  v_texCoordsBlur[2] = a_texCoords + vec2(0.01, 0.01) * u_direction;
  v_texCoords = a_texCoords;
}
