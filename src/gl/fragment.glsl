#version 100

#ifdef GL_ES
precision mediump float;
#endif

varying vec2 v_texCoords;
varying float v_opacity;
varying float v_index;

uniform sampler2D u_texture0;
uniform sampler2D u_texture1;
uniform sampler2D u_texture2;
uniform sampler2D u_texture3;
uniform sampler2D u_texture4;
uniform sampler2D u_texture5;
uniform sampler2D u_texture6;
uniform sampler2D u_texture7;
uniform sampler2D u_texture8;
uniform sampler2D u_texture9;
uniform sampler2D u_texture10;
uniform sampler2D u_texture11;
uniform sampler2D u_texture12;
uniform sampler2D u_texture13;
uniform sampler2D u_texture14;
uniform sampler2D u_texture15;

void main() {
  vec4 color;
  int index;
  float opacity;
  index = int(v_index);
  opacity = v_opacity;
  if(index == 0) {
    color = texture2D(u_texture0, v_texCoords);
  }
  else if(index == 1) {
    color = texture2D(u_texture1, v_texCoords);
  }
  else if(index == 2) {
    color = texture2D(u_texture2, v_texCoords);
  }
  else if(index == 3) {
    color = texture2D(u_texture3, v_texCoords);
  }
  else if(index == 4) {
    color = texture2D(u_texture4, v_texCoords);
  }
  else if(index == 5) {
    color = texture2D(u_texture5, v_texCoords);
  }
  else if(index == 6) {
    color = texture2D(u_texture6, v_texCoords);
  }
  else if(index == 7) {
    color = texture2D(u_texture7, v_texCoords);
  }
  else if(index == 8) {
    color = texture2D(u_texture8, v_texCoords);
  }
  else if(index == 9) {
    color = texture2D(u_texture9, v_texCoords);
  }
  else if(index == 10) {
    color = texture2D(u_texture10, v_texCoords);
  }
  else if(index == 11) {
    color = texture2D(u_texture11, v_texCoords);
  }
  else if(index == 12) {
    color = texture2D(u_texture12, v_texCoords);
  }
  else if(index == 13) {
    color = texture2D(u_texture13, v_texCoords);
  }
  else if(index == 14) {
    color = texture2D(u_texture14, v_texCoords);
  }
  else if(index == 15) {
    color = texture2D(u_texture15, v_texCoords);
  }
  // 限制一下 alpha 在 [0.0, 1.0] 区间内
  float alpha = clamp(opacity, 0.0, 1.0);
  // alpha 为 0 的点，不绘制，直接跳过
  if(alpha <= 0.0) {
    discard;
  }
  gl_FragColor = vec4(color.rgb, color.a * alpha);
}
