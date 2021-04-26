#version 100

#ifdef GL_ES
precision mediump float;
#endif

varying vec2 v_texCoords;
varying vec2 v_texCoordsBlur[3];

uniform sampler2D u_texture;

void main() {
  gl_FragColor = vec4(0.0);
  gl_FragColor += texture2D(u_texture, v_texCoordsBlur[0]) * 0.3;
  gl_FragColor += texture2D(u_texture, v_texCoordsBlur[1]) * 0.4;
  gl_FragColor += texture2D(u_texture, v_texCoordsBlur[2]) * 0.3;
//  gl_FragColor = texture2D(u_texture, v_texCoords);
//  gl_FragColor += vec4(0.0, 0.0, 1.0, 1.0) * 0.1;
}
