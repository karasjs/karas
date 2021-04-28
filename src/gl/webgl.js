import mx from '../math/matrix';

const calPoint = mx.calPoint;

/**
 * 初始化 shader
 * @param gl GL context
 * @param vshader vertex shader (string)
 * @param fshader fragment shader (string)
 * @return program, if the program object was created and successfully made current
 */
function initShaders(gl, vshader, fshader) {
  let program = createProgram(gl, vshader, fshader);
  if(!program) {
    throw new Error('Failed to create program');
  }

  // 要开启透明度，用以绘制透明的图形
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  return program;
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
  bindTexture(gl, texture, n);
  // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, -1);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
  if(width || height) {
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, tex);
  }
  else {
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, tex);
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
  // let u_texture = gl.getUniformLocation(gl.program, 'u_texture' + n);
  // gl.uniform1i(u_texture, n);
}

function deleteTexture(gl, tex) {
  gl.deleteTexture(tex);
}

/**
 * texCache集满纹理上传占用最多可用纹理单元后，进行批量顺序绘制
 * 将所有dom的矩形顶点（经过transform变换后的）、贴图坐标、透明度存入3个buffer中，
 * 然后相同纹理单元的形成一批，设置uniform的纹理单元号进行绘制，如此循环
 * @param gl
 * @param list
 * @param hash
 * @param cx
 * @param cy
 */
function drawTextureCache(gl, list, hash, cx, cy) {
  let vtPoint = [], vtTex = [], vtOpacity = [];
  let lastChannel; // 上一个dom的单元号
  let record = [0]; // [num, channel]每一批的数量和单元号记录
  let stack = [record]; // 所有批的数据记录集合
  list.forEach((item, i) => {
    let [cache, opacity, matrix, dx, dy] = item;
    if(i) {
      let channel = hash[cache.page.uuid];
      // 和上一个单元号不同时，生成新的批次记录
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
    let { x, y, width, height, page, bbox } = cache;
    // 计算顶点坐标和纹理坐标，转换[0,1]对应关系
    let bx = bbox[0], by = bbox[1];
    let [x1, y1] = convertCoords2Gl(bx - 1 + (dx || 0), by - 1 + height + (dy || 0), cx, cy);
    let [x2, y2] = convertCoords2Gl(bx - 1 + width + (dx || 0), by - 1 + (dy || 0), cx, cy);
    [x1, y1] = calPoint([x1, y1], matrix);
    [x2, y2] = calPoint([x2, y2], matrix);
    vtPoint.push(x1, y1, x1, y2, x2, y1, x1, y2, x2, y1, x2, y2);
    let tx1 = x / page.width, ty1 = (y + height) / page.height;
    let tx2 = (x + width) / page.width, ty2 = y / page.height;
    vtTex.push(tx1, ty1, tx1, ty2, tx2, ty1, tx1, ty2, tx2, ty1, tx2, ty2);
    vtOpacity.push(opacity, opacity, opacity, opacity, opacity, opacity);
    record[0]++;console.log(opacity);
  });
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
  // 纹理单元
  let u_texture = gl.getUniformLocation(gl.program, 'u_texture');
  let count = 0;
  // 循环按批次渲染
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
  gl.disableVertexAttribArray(a_position);
  gl.disableVertexAttribArray(a_texCoords);
  gl.disableVertexAttribArray(a_opacity);
}

/**
 * https://www.w3.org/TR/2018/WD-filter-effects-1-20181218/#feGaussianBlurElement
 * 根据cacheTotal生成cacheFilter，按照css规范的优化方法执行3次，避免卷积核扩大3倍性能慢
 * x/y方向分开执行，加速性能，计算次数由d*d变为d+d，d为卷积核大小
 * spread由d和sigma计算得出，d由sigma计算得出，sigma即css的blur()参数
 * 规范的优化方法对d的值分奇偶优化，这里再次简化，d一定是奇数，即卷积核大小
 * i和j为total和filter的纹理单元，3次执行（x/y合起来算1次）需互换单元，来回执行源和结果
 * 由total变为filter时cache会各方向上扩展spread的大小到width/height
 * 因此第一次绘制时坐标非1，后面则固定1
 * @param gl
 * @param program
 * @param frameBuffer
 * @param texCache
 * @param tex1 初次绘制目标纹理
 * @param tex2 初次绘制源纹理
 * @param i 初次绘制目标纹理单元
 * @param j 初次绘制源纹理单元
 * @param width
 * @param height
 * @param cx
 * @param cy
 * @param spread
 * @param d
 * @param sigma
 */
function drawBlur(gl, program, frameBuffer, texCache, tex1, tex2, i, j, width, height, cx, cy, spread, d, sigma) {
  // 第一次将total绘制到blur上，此时尺寸存在spread差值，因此不加模糊防止坐标计算问题，仅作为扩展纹理尺寸
  let [x1, y2] = convertCoords2Gl(spread, height - spread, cx, cy);
  let [x2, y1] = convertCoords2Gl(width - spread, spread, cx, cy);
  // 顶点buffer
  let pointBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    x1, y1,
    x1, y2,
    x2, y1,
    x1, y2,
    x2, y1,
    x2, y2,
  ]), gl.STATIC_DRAW);
  let a_position = gl.getAttribLocation(program, 'a_position');
  gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_position);
  // 纹理buffer
  let texBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    0, 0,
    0, 1,
    1, 0,
    0, 1,
    1, 0,
    1, 1,
  ]), gl.STATIC_DRAW);
  let a_texCoords = gl.getAttribLocation(program, 'a_texCoords');
  gl.vertexAttribPointer(a_texCoords, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_texCoords);
  // direction全0，即无模糊
  let u_direction = gl.getUniformLocation(program, 'u_direction');
  gl.uniform2f(u_direction, 0, 0);
  // 纹理单元
  let u_texture = gl.getUniformLocation(program, 'u_texture');
  gl.uniform1i(u_texture, j);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
  // fbo绑定切换纹理对象和单元索引，同时注意不能向源纹理绘制，因为源是cacheTotal，需要重新生成一个，y方向再来一次
  let tex3 = createTexture(gl, null, j, width, height);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex3, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1,
    -1, 1,
    1, -1,
    -1, 1,
    1, -1,
    1, 1,
  ]), gl.STATIC_DRAW);
  /**
   * 反复执行共3次，坐标等均不变，只是切换fbo绑定对象和纹理单元
   * 注意max和ratio的设置，当是100尺寸的正方形时，传给direction的始终为1
   * 当正方形<100时，direction相应地要扩大相对于100的倍数，反之则缩小，如此为了取相邻点坐标时是+-1
   * 当非正方形时，长轴一端为基准值不变，短的要二次扩大比例倍数
   */
  let max = 100 / Math.max(width, height);
  let ratio = width / height;
  for(let k = 0; k < 3; k++) {
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex3, 0);
    if(width >= height) {
      gl.uniform2f(u_direction, max, 0);
    }
    else {
      gl.uniform2f(u_direction, max * ratio, 0);
    }
    gl.uniform1i(u_texture, i);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex1, 0);
    if(width >= height) {
      gl.uniform2f(u_direction, 0, max * ratio);
    }
    else {
      gl.uniform2f(u_direction, 0, max);
    }
    gl.uniform1i(u_texture, j);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
  // 回收
  gl.deleteBuffer(pointBuffer);
  gl.deleteBuffer(texBuffer);
  gl.disableVertexAttribArray(a_position);
  gl.disableVertexAttribArray(a_texCoords);
  deleteTexture(gl, tex3);
  return tex1;
}

function drawMask(gl, i, j) {
  // 顶点buffer
  let pointBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1,
    -1, 1,
    1, -1,
    -1, 1,
    1, -1,
    1, 1,
  ]), gl.STATIC_DRAW);
  let a_position = gl.getAttribLocation(gl.programMask, 'a_position');
  gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_position);
  // 纹理buffer
  let texBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    0, 0,
    0, 1,
    1, 0,
    0, 1,
    1, 0,
    1, 1,
  ]), gl.STATIC_DRAW);
  let a_texCoords = gl.getAttribLocation(gl.programMask, 'a_texCoords');
  gl.vertexAttribPointer(a_texCoords, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_texCoords);
  // 纹理单元
  let u_texture1 = gl.getUniformLocation(gl.programMask, 'u_texture1');
  gl.uniform1i(u_texture1, j);
  let u_texture2 = gl.getUniformLocation(gl.programMask, 'u_texture2');
  gl.uniform1i(u_texture2, i);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
  gl.deleteBuffer(pointBuffer);
  gl.deleteBuffer(texBuffer);
  gl.disableVertexAttribArray(a_position);
  gl.disableVertexAttribArray(a_texCoords);
}

export default {
  initShaders,
  createTexture,
  bindTexture,
  deleteTexture,
  drawTextureCache,
  drawBlur,
  drawMask,
};
