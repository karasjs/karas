import inject from '../util/inject';
import mx from '../math/matrix';

const calPoint = mx.calPoint;

/**
 * 初始化 shader
 * @param gl GL context
 * @param vshader vertex shader (string)
 * @param fshader fragment shader (string)
 * @return true, if the program object was created and successfully made current
 */
export function initShaders(gl, vshader, fshader) {
  let program = createProgram(gl, vshader, fshader);
  if(!program) {
    inject.error('Failed to create program');
    return false;
  }

  gl.useProgram(program);
  gl.program = program;
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
 * @return created program object, or null if the creation has failed
 */
function createProgram(gl, vshader, fshader) {
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
  gl.vertexShader = vertexShader;
  gl.fragmentShader = fragmentShader;

  // Link the program object
  gl.linkProgram(program);

  // Check the result of linking
  let linked = gl.getProgramParameter(program, gl.LINK_STATUS);
  if(!linked) {
    let error = gl.getProgramInfoLog(program);
    inject.error('Failed to link program: ' + error);
    gl.deleteProgram(program);
    gl.deleteShader(fragmentShader);
    gl.deleteShader(vertexShader);
    return null;
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
    inject.error('unable to create shader');
    return null;
  }

  // Set the shader program
  gl.shaderSource(shader, source);

  // Compile the shader
  gl.compileShader(shader);

  // Check the result of compilation
  let compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if(!compiled) {
    let error = gl.getShaderInfoLog(shader);
    inject.error('Failed to compile shader: ' + error);
    gl.deleteShader(shader);
    return null;
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

function initVertexBuffers(gl, infos, hash, cx, cy) {
  let count = 0;
  let count2 = 0;
  let length = 0;
  infos.forEach(info => {
    length += info.length;
  });
  let vtPoint = new Float32Array(length * 12);
  let vtTex = new Float32Array(length * 12);
  let vtOpacity = new Float32Array(length * 6);
  let vtIndex = new Float32Array(length * 6);
  infos.forEach(info => {
    info.forEach(item => {
      let [cache, opacity, matrix, dx, dy] = item;
      let { coords: [x, y], sx1, sy1, width, height, fullSize } = cache;
      // 计算顶点坐标和纹理坐标，转换[0,1]对应关系
      let [x1, y1] = convertCoords2Gl(sx1 - 1 + dx, sy1 - 1 + dy + height, cx, cy);
      let [x2, y2] = convertCoords2Gl(sx1 - 1 + dx + width, sy1 - 1 + dy, cx, cy);
      [x1, y1] = calPoint([x1, y1], matrix);
      [x2, y2] = calPoint([x2, y2], matrix);
      vtPoint[count] = x1;
      vtPoint[count + 1] = y1;
      vtPoint[count + 2] = x1;
      vtPoint[count + 3] = y2;
      vtPoint[count + 4] = x2;
      vtPoint[count + 5] = y1;
      vtPoint[count + 6] = x1;
      vtPoint[count + 7] = y2;
      vtPoint[count + 8] = x2;
      vtPoint[count + 9] = y1;
      vtPoint[count + 10] = x2;
      vtPoint[count + 11] = y2;
      let tx1 = (x - 1) / fullSize, ty1 = (y - 1 + height) / fullSize;
      let tx2 = (x - 1 + width) / fullSize, ty2 = (y - 1) / fullSize;
      vtTex[count] = tx1;
      vtTex[count + 1] = ty1;
      vtTex[count + 2] = tx1;
      vtTex[count + 3] = ty2;
      vtTex[count + 4] = tx2;
      vtTex[count + 5] = ty1;
      vtTex[count + 6] = tx1;
      vtTex[count + 7] = ty2;
      vtTex[count + 8] = tx2;
      vtTex[count + 9] = ty1;
      vtTex[count + 10] = tx2;
      vtTex[count + 11] = ty2;
      vtOpacity[count2] = opacity;
      vtOpacity[count2 + 1] = opacity;
      vtOpacity[count2 + 2] = opacity;
      vtOpacity[count2 + 3] = opacity;
      vtOpacity[count2 + 4] = opacity;
      vtOpacity[count2 + 5] = opacity;
      let index = hash[cache.page.uuid];
      vtIndex[count2] = index;
      vtIndex[count2 + 1] = index;
      vtIndex[count2 + 2] = index;
      vtIndex[count2 + 3] = index;
      vtIndex[count2 + 4] = index;
      vtIndex[count2 + 5] = index;
      count += 12;
      count2 += 6;
    });
  });
  const PER = 6;
  // 顶点buffer
  let pointBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vtPoint, gl.STATIC_DRAW);
  let a_position = gl.getAttribLocation(gl.program, 'a_position');
  gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_position);
  // 纹理buffer
  let texBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vtTex, gl.STATIC_DRAW);
  let a_texCoords = gl.getAttribLocation(gl.program, 'a_texCoords');
  gl.vertexAttribPointer(a_texCoords, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_texCoords);
  // opacity buffer
  let opacityBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, opacityBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vtOpacity, gl.STATIC_DRAW);
  let a_opacity = gl.getAttribLocation(gl.program, 'a_opacity');
  gl.vertexAttribPointer(a_opacity, 1, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_opacity);
  // 索引buffer
  let indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vtIndex, gl.STATIC_DRAW);
  let a_index = gl.getAttribLocation(gl.program, 'a_index');
  gl.vertexAttribPointer(a_index, 1, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_index);
  return [PER, length, pointBuffer, texBuffer, opacityBuffer, indexBuffer];
}

// y反转
function revertMatrixY(matrix) {
  matrix[1] = -matrix[1];
  matrix[5] = -matrix[5];
  matrix[9] = -matrix[9];
  matrix[13] = -matrix[13];
}

function drawTextureCache(gl, infos, hash, cx, cy) {
  let [n, count, pointBuffer, texBuffer, opacityBuffer, indexBuffer] = initVertexBuffers(gl, infos, hash, cx, cy);
  if(n < 0 || count < 0) {
    inject.error('Failed to set the positions of the vertices');
    return;
  }
  gl.drawArrays(gl.TRIANGLES, 0, n * count);
  gl.deleteBuffer(pointBuffer);
  gl.deleteBuffer(texBuffer);
  gl.deleteBuffer(opacityBuffer);
  gl.deleteBuffer(indexBuffer);
}

export default {
  initShaders,
  createTexture,
  bindTexture,
  deleteTexture,
  drawTextureCache,
};
