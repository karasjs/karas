#version 100

#ifdef GL_ES
precision mediump float;
#endif

varying vec2 v_texCoordsBlur[3];

uniform sampler2D u_texture;

void main() {
  gl_FragColor = vec4(0.0);
  // 示范，一个方向上进行3核大小颜色权重相加，坐标由vert控制，外部动态生成时按照核大小动态添加
//  gl_FragColor += texture2D(u_texture, v_texCoordsBlur[0]) * 0.3;
//  gl_FragColor += texture2D(u_texture, v_texCoordsBlur[1]) * 0.4;
//  gl_FragColor += texture2D(u_texture, v_texCoordsBlur[2]) * 0.3;
}
