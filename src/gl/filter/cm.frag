#version 100

#ifdef GL_ES
precision mediump float;
#endif

varying vec2 v_texCoords;

uniform sampler2D u_texture;
uniform float u_m[20];

void main() {
  vec4 c = texture2D(u_texture, v_texCoords);
  if(c.a > 0.0) {
    c.rgb /= c.a;
  }
  vec4 result;
  result.r = (u_m[0] * c.r);
  result.r += (u_m[1] * c.g);
  result.r += (u_m[2] * c.b);
  result.r += (u_m[3] * c.a);
  result.r += u_m[4];

  result.g = (u_m[5] * c.r);
  result.g += (u_m[6] * c.g);
  result.g += (u_m[7] * c.b);
  result.g += (u_m[8] * c.a);
  result.g += u_m[9];

  result.b = (u_m[10] * c.r);
  result.b += (u_m[11] * c.g);
  result.b += (u_m[12] * c.b);
  result.b += (u_m[13] * c.a);
  result.b += u_m[14];

  result.a = (u_m[15] * c.r);
  result.a += (u_m[16] * c.g);
  result.a += (u_m[17] * c.b);
  result.a += (u_m[18] * c.a);
  result.a += u_m[19];

  gl_FragColor = vec4(result.rgb * result.a, result.a);
}
