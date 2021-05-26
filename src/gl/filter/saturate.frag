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

float getSaturation(vec3 rgb) {
  return max(rgb[0], max(rgb[1], rgb[2])) - min(rgb[0], min(rgb[1], rgb[2]));
}

vec3 setSaturation(vec3 rgb, float saturation) {
  float r = rgb[0], g = rgb[1], b = rgb[2];
  float maxC = 0.0, minC = 0.0, midC = 0.0;
  int maxI = 0, minI = 0, midI = 0;
  if(r >= g && r >= b) {
    maxI = 0;
    maxC = r;
    if(g >= b) {
      minI = 2;
      midI = 1;
      minC = b;
      midC = g;
    }
    else {
      minI = 1;
      midI = 2;
      minC = g;
      midC = b;
    }
  }
  else if(g >= r && g >= b) {
    maxI = 1;
    maxC = g;
    if(r >= b) {
      minI = 2;
      midI = 0;
      minC = b;
      midC = r;
    }
    else {
      minI = 0;
      midI = 2;
      minC = r;
      midC = b;
    }
  }
  else if(b >= r && b >= g) {
    maxI = 2;
    maxC = b;
    if(r >= g) {
      minI = 1;
      midI = 0;
      minC = g;
      midC = r;
    }
    else {
      minI = 0;
      midI = 1;
      minC = r;
      midC = g;
    }
  }
  vec3 result = vec3(r, g, b);
  if(maxC > minC) {
    midC = (midC - minC) * saturation / (maxC - minC);
    maxC = saturation;
  }
  else {
    maxC = midC = 0.0;
  }
  minC = 0.0;
  if(maxI == 0) {
    result[0] = maxC;
  }
  else if(maxI == 1) {
    result[1] = maxC;
  }
  else if(maxI == 2) {
    result[2] = maxC;
  }
  if(minI == 0) {
    result[0] = minC;
  }
  else if(minI == 1) {
    result[1] = minC;
  }
  else if(minI == 2) {
    result[2] = minC;
  }
  if(midI == 0) {
    result[0] = midC;
  }
  else if(midI == 1) {
    result[1] = midC;
  }
  else if(midI == 2) {
    result[2] = midC;
  }
  return result;
}

void main() {
  vec4 color = texture2D(u_texture, v_texCoords);
  float a = color.a;
  vec3 res = premultipliedAlpha(color);
  float s = getSaturation(res);
  s *= u_percent;
  vec3 res2 = setSaturation(res, s);
  gl_FragColor = vec4(res2 * a, a);
}
