#version 100

#ifdef GL_ES
precision mediump float;
#endif

varying vec2 v_texCoords;
varying float v_opacity;

uniform sampler2D u_texture;

void main() {
  float opacity = v_opacity;
  // alpha 为 0 的点，不绘制，直接跳过
  if(opacity <= 0.0) {
    discard;
  }
  // 限制一下 opacity 在 [0.0, 1.0] 区间内
  opacity = clamp(opacity, 0.0, 1.0);
  vec4 color = texture2D(u_texture, v_texCoords);
  gl_FragColor = vec4(color.rgb, color.a * opacity);
}
