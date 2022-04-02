#version 100

#ifdef GL_ES
precision mediump float;
#endif

varying vec2 v_texCoords;

uniform sampler2D u_texture;
uniform float u_color[4];

void main() {
    vec4 c = texture2D(u_texture, v_texCoords);
    gl_FragColor = vec4(u_color[0] * c.a, u_color[1] * c.a, u_color[2] * c.a, u_color[3] * c.a);
}
