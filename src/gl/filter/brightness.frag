#version 100

#ifdef GL_ES
precision mediump float;
#endif

varying vec2 v_texCoords;

uniform sampler2D u_texture;
uniform float u_percent;

vec3 premultipliedAlpha(vec4 color) {
  float a = color.a;
  if(a == 0.0) {
    return vec3(0.0, 0.0, 0.0);
  }
  return vec3(color.r / a, color.g / a, color.b / a);
}

float getLuminosity(vec3 color) {
  return 0.3 * color[0] + 0.59 * color[1] + 0.11 * color[2];
}

float clipLowest(float channel, float lowestChannel, float luminosity) {
  return luminosity + ((channel - luminosity) * luminosity) / (luminosity - lowestChannel);
}

float clipHighest(float channel, float highestChannel, float luminosity) {
  return luminosity + ((channel - luminosity) * (1.0 - luminosity)) / (highestChannel - luminosity);
}

vec3 clipColor(vec3 rgb) {
  float luminosity = getLuminosity(rgb);
  float lowestChannel = min(rgb[0], min(rgb[1], rgb[2]));
  float highestChannel = max(rgb[0], max(rgb[1], rgb[2]));
  float r = rgb[0], g = rgb[1], b = rgb[2];
  if(lowestChannel < 0.0) {
    r = clipLowest(r, lowestChannel, luminosity);
    g = clipLowest(g, lowestChannel, luminosity);
    b = clipLowest(b, lowestChannel, luminosity);
  }
  if(highestChannel > 1.0) {
    r = clipHighest(r, highestChannel, luminosity);
    g = clipHighest(g, highestChannel, luminosity);
    b = clipHighest(b, highestChannel, luminosity);
  }
  return vec3(r, g, b);
}

vec3 setLuminosity(vec3 rgb, float luminosity) {
  float delta = luminosity - getLuminosity(rgb);
  float r = rgb[0], g = rgb[1], b = rgb[2];
  return clipColor(vec3(r + delta, g + delta, b + delta));
}

void main() {
  vec4 color = texture2D(u_texture, v_texCoords);
  float a = color.a;
  vec3 res = premultipliedAlpha(color);
  float l = getLuminosity(res);
  l *= u_percent;
  vec3 res2 = setLuminosity(res, l);
  gl_FragColor = vec4(res2 * a, a);
}
