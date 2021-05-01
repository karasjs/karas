#version 100

#ifdef GL_ES
precision mediump float;
#endif

varying vec2 v_texCoords;

uniform sampler2D u_texture1;
uniform sampler2D u_texture2;

float hue2rgb(float p, float q, float t) {
  if(t < 0.0) {
    t += 1.0;
  }
  else if(t > 1.0) {
    t -= 1.0;
  }
  if(t < 1.0 / 6.0) {
    return p + (q - p) * 6.0 * t;
  }
  if(t < 1.0 / 2.0) {
    return q;
  }
  if(t < 2.0 / 3.0) {
    return p + (q - p) * (2.0 / 3.0 - t) * 6.0;
  }
  return p;
}

vec3 op(vec3 a, vec3 b) {
  float maxB = max(b[0], max(b[1], b[2]));
  float minB = min(b[0], min(b[1], b[2]));
  float cb = maxB - minB;
  float hb;
  if(cb == 0.0) {
    hb = 0.0;
  }
  else {
    if(b[0] == maxB) {
      float segment = (b[1] - b[2]) / cb;
      float shift = 0.0;
      if(segment < 0.0) {
        shift = 6.0;
      }
      hb = segment + shift;
    }
    else if(b[1] == maxB) {
      hb = 2.0 + (b[2] - b[0]) / cb;
    }
    else {
      hb = 4.0 + (b[0] - b[1] / cb);
    }
    hb /= 6.0;
  }
  float maxA = max(a[0], max(a[1], a[2]));
  float minA = min(a[0], min(a[1], a[2]));
  float la = (maxA + minA) * 0.5;
  float sa = 0.0;
  if(maxA != minA) {
    if(la < 0.5) {
      sa = (maxA - minA) / (maxA + minA);
    }
    else {
      sa = (maxA - minA) / (2.0 - (maxA + minA));
    }
  }
  if(sa == 0.0) {
    return vec3(la, la, la);
  }
  float q = la < 0.5 ? la * (1.0 + sa) : la + sa - la * sa;
  float p = 2.0 * la - q;
  return vec3(hue2rgb(p, q, hb + 1.0 / 3.0), hue2rgb(p, q, hb), hue2rgb(p, q, hb - 1.0 / 3.0));
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
