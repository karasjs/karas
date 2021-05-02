#version 100

#ifdef GL_ES
precision mediump float;
#endif

varying vec2 v_texCoords;

uniform sampler2D u_texture1;
uniform sampler2D u_texture2;

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

vec3 op(vec3 a, vec3 b) {
  float s = getSaturation(a);
  float l = getLuminosity(a);
  return setLuminosity(setSaturation(b, s), l);
}

void main() {
  vec4 color1 = texture2D(u_texture1, v_texCoords);
  vec4 color2 = texture2D(u_texture2, v_texCoords);
  if(color1.a == 0.0) {
    gl_FragColor = color2;
  }
  else if(color2.a == 0.0) {
    gl_FragColor = color1;
  }
  else {
    gl_FragColor = vec4(op(color1.rgb, color2.rgb), 1.0);
  }
}
