import inject from '../util/inject';

const VERTEX = `
attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

varying vec2 vTextureCoord;
uniform mat3 projectionMatrix;

void main(void)
{
  gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
  vTextureCoord = aTextureCoord;
}`;

const FRAGMENT = `
#ifdef GL_ES
precision mediump float;
#endif
varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform vec2 uOffset;
uniform vec4 filterClamp;

void main(void)
{
  vec4 color = vec4(0.0);

  // Sample top left pixel
  color += texture2D(uSampler, clamp(vec2(vTextureCoord.x - uOffset.x, vTextureCoord.y + uOffset.y), filterClamp.xy, filterClamp.zw));

  // Sample top right pixel
  color += texture2D(uSampler, clamp(vec2(vTextureCoord.x + uOffset.x, vTextureCoord.y + uOffset.y), filterClamp.xy, filterClamp.zw));

  // Sample bottom right pixel
  color += texture2D(uSampler, clamp(vec2(vTextureCoord.x + uOffset.x, vTextureCoord.y - uOffset.y), filterClamp.xy, filterClamp.zw));

  // Sample bottom left pixel
  color += texture2D(uSampler, clamp(vec2(vTextureCoord.x - uOffset.x, vTextureCoord.y - uOffset.y), filterClamp.xy, filterClamp.zw));

  // Average
  color *= 0.25;

  gl_FragColor = color;
}`;

function initShaders(gl, vshader, fshader) {
  let program = createProgram(gl, vshader, fshader);
  if (!program) {
    inject.error('Failed to create program');
    return false;
  }

  gl.useProgram(program);
  gl.program = program;

  return true;
}

function createProgram(gl, vshader, fshader) {
  let vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader);
  let fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader);
  if (!vertexShader || !fragmentShader) {
    return null;
  }

  let program = gl.createProgram();
  if (!program) {
    return null;
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  gl.linkProgram(program);

  let linked = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!linked) {
    let error = gl.getProgramInfoLog(program);
    inject.error('Failed to link program: ' + error);
    gl.deleteProgram(program);
    gl.deleteShader(fragmentShader);
    gl.deleteShader(vertexShader);
    return null;
  }
  return program;
}

function loadShader(gl, type, source) {
  let shader = gl.createShader(type);
  if (shader == null) {
    inject.error('unable to create shader');
    return null;
  }

  gl.shaderSource(shader, source);

  gl.compileShader(shader);

  let compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!compiled) {
    let error = gl.getShaderInfoLog(shader);
    inject.error('Failed to compile shader: ' + error);
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function initVertexBuffers(gl) {
  let vertices = new Float32Array([
    -1, 1, 0.0, 1.0,
    -1, -1, 0.0, 0.0,
    1, 1, 1.0, 1.0,
    1, -1, 1.0, 0.0
  ]);
  let vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  let FSIZE = Float32Array.BYTES_PER_ELEMENT;
  let aPosition = gl.getAttribLocation(gl.program, 'aVertexPosition');
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, FSIZE * 4, 0);
  gl.enableVertexAttribArray(aPosition);
  let aTexCoord = gl.getAttribLocation(gl.program, 'aTextureCoord');
  gl.vertexAttribPointer(aTexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);

  let projectionMatrix = gl.getUniformLocation(gl.program, 'projectionMatrix');
  gl.uniformMatrix3fv(projectionMatrix, false, new Float32Array(
    [ 1, 0, 0,
      0, 1, 0,
      0, 0, 1 ]));
  gl.enableVertexAttribArray(aTexCoord);
  return {
    aPosition,
    aTexCoord,
  };
}

function initLocation(gl) {
  let uSampler = gl.getUniformLocation(gl.program, 'uSampler');
  let uOffset = gl.getUniformLocation(gl.program, 'uOffset');
  let uClamp = gl.getUniformLocation(gl.program, 'filterClamp');
  return {
    uSampler,
    uOffset,
    uClamp,
  };
}

function createAndSetupTexture(gl) {
  let texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // 设置材质，这样我们可以对任意大小的图像进行像素操作
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  return texture;
}

class KawaseBlurFilter {
  constructor(webgl, blur = 1, quality = 4) {
    this.webgl = webgl;
    let gl = this.gl = webgl.ctx;
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, -1);
    initShaders(gl, VERTEX, FRAGMENT);
    this.vertexLocations = initVertexBuffers(gl);
    this.textureLocations = initLocation(gl);
    this._pixelSize = { x: 0, y: 0 };
    this.pixelSize = 1;
    this._kernels = null;
    this._blur = blur;
    this.quality = quality;
    // 创建两个纹理绑定到帧缓冲
    this.textures = [];
    this.framebuffers = [];
  }

  initBuffers(gl, width, height) {
    for (let i = 0; i < 2; i++) {
      let texture = createAndSetupTexture(gl);
      this.textures.push(texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      // 创建一个帧缓冲
      let fbo = gl.createFramebuffer();
      this.framebuffers.push(fbo);
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      // 绑定纹理到帧缓冲
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    }
  }

  draw(image, uOffsetArray, clear) {
    let { uOffset, uClamp } = this.textureLocations;
    let { gl } = this;
    gl.uniform2f(uOffset, uOffsetArray[0], uOffsetArray[1]);
    gl.viewport(0, 0, image.width, image.height);
    gl.uniform4f(uClamp, 0, 0, image.width, image.height);
    if (clear) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  apply(target, width, height) {
    let { gl } = this;
    this.initBuffers(gl, width, height);
    let { uSampler } = this.textureLocations;
    gl.uniform1i(uSampler, 0);
    let originalImageTexture = createAndSetupTexture(gl);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, target.canvas);

    let uvX = this._pixelSize.x / width;
    let uvY = this._pixelSize.y / height;
    let offset;
    let last = this._quality - 1;
    // 从原始图像开始
    gl.bindTexture(gl.TEXTURE_2D, originalImageTexture);
    for (let i = 0; i < last; i++) {
      offset = this._kernels[i] + 0.5;
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffers[i % 2]);
      let uOffsetArray = new Float32Array([ offset * uvX, offset * uvY ]);
      this.draw(target.canvas, uOffsetArray, false);
      gl.bindTexture(gl.TEXTURE_2D, this.textures[i % 2]);
    }
    offset = this._kernels[last] + 0.5;
    let uOffsetArray = new Float32Array([ offset * uvX, offset * uvY ]);
    this.draw(target.canvas, uOffsetArray, true);
    this.webgl.draw();
    target.ctx.clearRect(0, 0, width, height);
    target.ctx.drawImage(gl.canvas, 0, 0);
    target.draw();
    return this;
  }

  /**
   * Auto generate kernels by blur & quality
   * @private
   */
  _generateKernels() {
    let blur = this._blur;
    let quality = this._quality;
    let kernels = [ blur ];

    if (blur > 0) {
      let k = blur;
      let step = blur / quality;

      for (let i = 1; i < quality; i++) {
        k -= step;
        kernels.push(k);
      }
    }

    this._kernels = kernels;
  }

  /**
   * The kernel size of the blur filter, for advanced usage.
   *
   * @member {number[]}
   * @default [0]
   */
  get kernels() {
    return this._kernels;
  }

  set kernels(value) {
    if (Array.isArray(value) && value.length > 0) {
      this._kernels = value;
      this._quality = value.length;
      this._blur = Math.max.apply(Math, value);
    } else {
      // if value is invalid , set default value
      this._kernels = [ 0 ];
      this._quality = 1;
    }
  }

  /**
   * Sets the pixel size of the filter. Large size is blurrier. For advanced usage.
   *
   * @member {PIXI.Point|number[]}
   * @default [1, 1]
   */
  set pixelSize(value) {
    if (typeof value === 'number') {
      this._pixelSize.x = value;
      this._pixelSize.y = value;
    } else if (Array.isArray(value)) {
      this._pixelSize.x = value[0];
      this._pixelSize.y = value[1];
    } else {
      // if value is invalid , set default value
      this._pixelSize.x = 1;
      this._pixelSize.y = 1;
    }
  }

  get pixelSize() {
    return this._pixelSize;
  }

  /**
   * The quality of the filter, integer greater than `1`.
   *
   * @member {number}
   * @default 3
   */
  get quality() {
    return this._quality;
  }

  set quality(value) {
    this._quality = Math.max(1, Math.round(value));
    this._generateKernels();
  }

  /**
   * The amount of blur, value greater than `0`.
   *
   * @member {number}
   * @default 4
   */
  get blur() {
    return this._blur;
  }

  set blur(value) {
    this._blur = value;
    this._generateKernels();
  }

  clear() {
    let gl = this.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }
}

function gaussBlur(target, webgl, blur, width, height) {
  return new KawaseBlurFilter(webgl, blur).apply(target, width, height);
}

export default {
  gaussBlur,
};
