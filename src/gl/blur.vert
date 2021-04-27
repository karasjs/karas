#version 100

attribute vec4 a_position;

attribute vec2 a_texCoords;
varying vec2 v_texCoordsBlur[3];

uniform vec2 u_direction;

void main() {
  gl_Position = a_position;
  // 示范，纹理坐标一个方向上进行3核大小的颜色取值相加，权重由frag控制，外部动态生成时按照核大小动态添加
//  v_texCoordsBlur[0] = a_texCoords + vec2(-0.01, -0.01) * u_direction;
//  v_texCoordsBlur[1] = a_texCoords;
//  v_texCoordsBlur[2] = a_texCoords + vec2(0.01, 0.01) * u_direction;
}
