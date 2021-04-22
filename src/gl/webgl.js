import mx from '../math/matrix';

const calPoint = mx.calPoint;

/**
 * 初始化 shader
 * @param gl GL context
 * @param vshader vertex shader (string)
 * @param fshader fragment shader (string)
 * @param k
 * @return true, if the program object was created and successfully made current
 */
function initShaders(gl, vshader, fshader, k = 'program') {
  let program = createProgram(gl, vshader, fshader);
  if(!program) {
    throw new Error('Failed to create program');
  }

  gl.useProgram(program);
  gl[k] = program;
  // 要开启透明度，用以绘制透明的图形
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  return true;
}

/**
 * Create the linked program object
 * @param gl GL context
 * @param vshader a vertex shader program (string)
 * @param fshader a fragment shader program (string)
 * @param kv
 * @param kf
 * @return created program object, or null if the creation has failed
 */
function createProgram(gl, vshader, fshader, kv = 'vertexShader', kf = 'fragmentShader') {
  // Create shader object
  let vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader);
  let fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader);
  if(!vertexShader || !fragmentShader) {
    return null;
  }

  // Create a program object
  let program = gl.createProgram();
  if(!program) {
    return null;
  }

  // Attach the shader objects
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl[kv] = vertexShader;
  gl[kf] = fragmentShader;

  // Link the program object
  gl.linkProgram(program);

  // Check the result of linking
  let linked = gl.getProgramParameter(program, gl.LINK_STATUS);
  if(!linked) {
    let error = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    gl.deleteShader(fragmentShader);
    gl.deleteShader(vertexShader);
    throw new Error('Failed to link program: ' + error);
  }
  return program;
}

/**
 * Create a shader object
 * @param gl GL context
 * @param type the type of the shader object to be created
 * @param source shader program (string)
 * @return created shader object, or null if the creation has failed.
 */
export function loadShader(gl, type, source) {
  // Create shader object
  let shader = gl.createShader(type);
  if(shader == null) {
    throw new Error('unable to create shader');
  }

  // Set the shader program
  gl.shaderSource(shader, source);

  // Compile the shader
  gl.compileShader(shader);

  // Check the result of compilation
  let compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if(!compiled) {
    let error = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error('Failed to compile shader: ' + error);
  }

  return shader;
}

function convertCoords2Gl(x, y, cx, cy) {
  if(x === cx) {
    x = 0;
  }
  else {
    x = (x - cx) / cx;
  }
  if(y === cy) {
    y = 0;
  }
  else {
    y = (y - cy) / cy;
  }
  return [x, y];
}

function createTexture(gl, tex, n, width, height) {
  let texture = gl.createTexture();
  // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, -1);
  // gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
  if(width) {
    gl.activeTexture(gl['TEXTURE' + n]);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, tex);
  }
  else {
    bindTexture(gl, texture, n);
    // gl.activeTexture(gl['TEXTURE' + n]);
    // gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, tex);
    // let u_texture = gl.getUniformLocation(gl.program, 'u_texture' + n);
    // gl.uniform1i(u_texture, n);
  }
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  return texture;
}

function bindTexture(gl, texture, n) {
  gl.activeTexture(gl['TEXTURE' + n]);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  let u_texture = gl.getUniformLocation(gl.program, 'u_texture' + n);
  gl.uniform1i(u_texture, n);
}

function deleteTexture(gl, tex) {
  gl.deleteTexture(tex);
}

function drawTextureCache(gl, list, hash, cx, cy) {
  let vtPoint = [], vtTex = [], vtOpacity = [];
  let lastChannel;
  let record = [0]; // [num, channel]
  let stack = [record];
  list.forEach((item, i) => {
    let [cache, opacity, matrix, dx, dy] = item;
    if(i) {
      let channel = hash[cache.page.uuid];
      if(lastChannel !== channel) {
        lastChannel = channel;
        record = [0, lastChannel];
        stack.push(record);
      }
    }
    else {
      lastChannel = hash[cache.page.uuid];
      record[1] = lastChannel;
    }
    let { coords: [x, y], sx1, sy1, width, height, fullSize } = cache;
    // 计算顶点坐标和纹理坐标，转换[0,1]对应关系
    let [x1, y1] = convertCoords2Gl(sx1 - 1 + dx, sy1 - 1 + dy + height, cx, cy);
    let [x2, y2] = convertCoords2Gl(sx1 - 1 + dx + width, sy1 - 1 + dy, cx, cy);
    [x1, y1] = calPoint([x1, y1], matrix);
    [x2, y2] = calPoint([x2, y2], matrix);
    vtPoint.push(x1, y1, x1, y2, x2, y1,  x1, y2, x2, y1, x2, y2);
    let tx1 = (x - 1) / fullSize, ty1 = (y - 1 + height) / fullSize;
    let tx2 = (x - 1 + width) / fullSize, ty2 = (y - 1) / fullSize;
    vtTex.push(tx1, ty1, tx1, ty2, tx2, ty1, tx1, ty2, tx2, ty1, tx2, ty2);
    vtOpacity.push(opacity, opacity, opacity, opacity, opacity, opacity);
    record[0]++;
  });
  let [pointBuffer, texBuffer, opacityBuffer] = initVertexBuffers(gl, vtPoint, vtTex, vtOpacity);
  let u_texture = gl.getUniformLocation(gl.program, 'u_texture');
  let count = 0;
  stack.forEach(record => {
    let [num, channel] = record;
    gl.uniform1i(u_texture, channel);
    num *= 6;
    gl.drawArrays(gl.TRIANGLES, count, num);
    count += num;
  });
  gl.deleteBuffer(pointBuffer);
  gl.deleteBuffer(texBuffer);
  gl.deleteBuffer(opacityBuffer);
}

function initVertexBuffers(gl, vtPoint, vtTex, vtOpacity) {
  // 顶点buffer
  let pointBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vtPoint), gl.STATIC_DRAW);
  let a_position = gl.getAttribLocation(gl.program, 'a_position');
  gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_position);
  // 纹理buffer
  let texBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vtTex), gl.STATIC_DRAW);
  let a_texCoords = gl.getAttribLocation(gl.program, 'a_texCoords');
  gl.vertexAttribPointer(a_texCoords, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_texCoords);
  // opacity buffer
  let opacityBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, opacityBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vtOpacity), gl.STATIC_DRAW);
  let a_opacity = gl.getAttribLocation(gl.program, 'a_opacity');
  gl.vertexAttribPointer(a_opacity, 1, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_opacity);
  return [pointBuffer, texBuffer, opacityBuffer];
}

export default {
  initShaders,
  createTexture,
  bindTexture,
  deleteTexture,
  drawTextureCache,
};
