import mx from '../math/matrix';

const { calRectPoint, calRectPointWasm, calPoint } = mx;

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
  // gl.enable(gl.DEPTH_TEST);
  // gl.enable(gl.POLYGON_OFFSET_FILL);
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
  program.vertexShader = vertexShader;
  program.fragmentShader = fragmentShader;

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
function loadShader(gl, type, source) {
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

function convertCoords2Gl(x, y, z, w, cx, cy, tz) {
  if(w && w !== 1) {
    x /= w;
    y /= w;
    z /= w;
  }
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
    y = (cy - y) / cy;
  }
  if(tz) {
    z /= -tz;
  }
  if(w === 1) {
    return { x, y, z, w };
  }
  return { x: x * w, y: y * w, z: z * w, w };
}

function createTexture(gl, tex, n, width, height) {
  let texture = gl.createTexture();
  bindTexture(gl, texture, n);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
  // 传入高宽时是绑定fbo，且tex一定为null
  if(width && height) {
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  }
  // 普通将canvas对象作为纹理
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
}

let lastVtPoint, lastVtTex, lastVtOpacity;
/**
 * texCache集满纹理上传占用最多可用纹理单元后，进行批量顺序绘制
 * 将所有dom的矩形顶点（经过transform变换后的）、贴图坐标、透明度存入3个buffer中，
 * 然后相同纹理单元的形成一批，设置uniform的纹理单元号进行绘制，如此循环
 */
function drawTextureCache(gl, list, cx, cy, dx, dy, wasmOp, wasmMe) {
  let length = list.length;
  if(!length) {
    return;
  }
  let vtPoint, vtTex, vtOpacity;
  if(lastVtPoint && lastVtPoint.length === length * 24) {
    vtPoint = lastVtPoint;
  }
  else {
    vtPoint = lastVtPoint = new Float32Array(length * 24);
  }
  if(lastVtTex && lastVtTex.length === length * 12) {
    vtTex = lastVtTex;
  }
  else {
    vtTex = lastVtTex = new Float32Array(length * 12);
  }
  if(lastVtOpacity && lastVtOpacity.length === length * 6) {
    vtOpacity = lastVtOpacity;
  }
  else {
    vtOpacity = lastVtOpacity = new Float32Array(length * 6);
  }
  for(let i = 0; i < length; i++) {
    let item = list[i];
    let { cache, index, wasm } = item;
    let opacity, matrix;
    let { __tw: width, __th: height,
      __tx1: tx1, __ty1: ty1, __tx2: tx2, __ty2: ty2,
      __page: page, __bbox: bbox } = cache;
    if(!i) {
      // canvas需要生成texture，texture则强制不会进来
      if(page.__update) {
        page.genTexture(gl);
      }
      bindTexture(gl, page.texture, 0);
    }
    if(wasm) {
      opacity = wasmOp[index];
    }
    else {
      opacity = item.opacity;
      matrix = item.matrix;
    }
    // 计算顶点坐标和纹理坐标，转换[0,1]对应关系
    let x1, y1, z1, w1, x2, y2, z2, w2, x3, y3, z3, w3, x4, y4, z4, w4;
    // wasm中的matrix和普通js取的方式不一样
    let bx = bbox[0], by = bbox[1];
    let xa = bx + dx, ya = by + height + dy;
    let xb = bx + width + dx, yb = by + dy;
    let t = wasm ? calRectPointWasm(xa, ya, xb, yb, wasmMe, index) : calRectPoint(xa, ya, xb, yb, matrix);
    x1 = t.x1;
    y1 = t.y1;
    z1 = t.z1;
    w1 = t.w1;
    x2 = t.x2;
    y2 = t.y2;
    z2 = t.z2;
    w2 = t.w2;
    x3 = t.x3;
    y3 = t.y3;
    z3 = t.z3;
    w3 = t.w3;
    x4 = t.x4;
    y4 = t.y4;
    z4 = t.z4;
    w4 = t.w4;
    // console.warn(x1,y1,z1,w1,',',x2,y2,z2,w2,',',x3,y3,z3,w3,',',x4,y4,z4,w4);
    // z范围取所有、对角线最大值，只有当非0有值时才求
    let z = Math.max(Math.abs(z1), Math.abs(z2));
    z = Math.max(z, Math.abs(z3));
    z = Math.max(z, Math.abs(z4));
    if(z) {
      z = Math.max(z, Math.sqrt(cx * cx + cy * cy));
    }
    t = convertCoords2Gl(x1, y1, z1, w1, cx, cy, z);
    x1 = t.x; y1 = t.y; z1 = t.z;
    t = convertCoords2Gl(x2, y2, z2, w2, cx, cy, z);
    x2 = t.x; y2 = t.y; z2 = t.z;
    t = convertCoords2Gl(x3, y3, z3, w3, cx, cy, z);
    x3 = t.x; y3 = t.y; z3 = t.z;
    t = convertCoords2Gl(x4, y4, z4, w4, cx, cy, z);
    x4 = t.x; y4 = t.y; z4 = t.z;
    // console.log(x1,y1,z1,w1,',',x2,y2,z2,w2,',',x3,y3,z3,w3,',',x4,y4,z4,w4);
    let j = i * 24;
    vtPoint[j] = x1;
    vtPoint[j + 1] = y1;
    vtPoint[j + 2] = z1;
    vtPoint[j + 3] = w1;
    vtPoint[j + 4] = x4;
    vtPoint[j + 5] = y4;
    vtPoint[j + 6] = z4;
    vtPoint[j + 7] = w4;
    vtPoint[j + 8] = x2;
    vtPoint[j + 9] = y2;
    vtPoint[j + 10] = z2;
    vtPoint[j + 11] = w2;
    vtPoint[j + 12] = x4;
    vtPoint[j + 13] = y4;
    vtPoint[j + 14] = z4;
    vtPoint[j + 15] = w4;
    vtPoint[j + 16] = x2;
    vtPoint[j + 17] = y2;
    vtPoint[j + 18] = z2;
    vtPoint[j + 19] = w2;
    vtPoint[j + 20] = x3;
    vtPoint[j + 21] = y3;
    vtPoint[j + 22] = z3;
    vtPoint[j + 23] = w3;
    j = i * 12;
    vtTex[j] = tx1;
    vtTex[j + 1] = ty1;
    vtTex[j + 2] = tx1;
    vtTex[j + 3] = ty2;
    vtTex[j + 4] = tx2;
    vtTex[j + 5] = ty1;
    vtTex[j + 6] = tx1;
    vtTex[j + 7] = ty2;
    vtTex[j + 8] = tx2;
    vtTex[j + 9] = ty1;
    vtTex[j + 10] = tx2;
    vtTex[j + 11] = ty2;
    j = i * 6;
    vtOpacity[j] = opacity;
    vtOpacity[j + 1] = opacity;
    vtOpacity[j + 2] = opacity;
    vtOpacity[j + 3] = opacity;
    vtOpacity[j + 4] = opacity;
    vtOpacity[j + 5] = opacity;
  }
  // 顶点buffer
  let pointBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vtPoint, gl.STATIC_DRAW);
  let a_position = gl.getAttribLocation(gl.program, 'a_position');
  gl.vertexAttribPointer(a_position, 4, gl.FLOAT, false, 0, 0);
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
  // 纹理单元
  let u_texture = gl.getUniformLocation(gl.program, 'u_texture');
  gl.uniform1i(u_texture, 0);
  gl.drawArrays(gl.TRIANGLES, 0, length * 6);
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
 * i和j为filter和total的纹理单元，3次执行（x/y合起来算1次）需互换单元，来回执行源和结果
 * 由total变为filter时cache会各方向上扩展spread的大小到width/height
 */
function drawBlur(gl, program, tex1, width, height) {
  gl.useProgram(program);
  gl.viewport(0, 0, width, height);
  /**
   * 注意max和ratio的设置，当是100尺寸的正方形时，传给direction的始终为1
   * 当正方形<100时，direction相应地要扩大相对于100的倍数，反之则缩小，如此为了取相邻点坐标时是+-1
   * 当非正方形时，长轴一端为基准值不变，短的要二次扩大比例倍数
   * tex1和tex2来回3次，最后是到tex1
   */
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
  let a_position = gl.getAttribLocation(program, 'a_position');
  gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_position);
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
  let u_texture = gl.getUniformLocation(program, 'u_texture');
  let u_direction = gl.getUniformLocation(program, 'u_direction');
  let recycle = []; // 3次过程中新生成的中间纹理需要回收
  let max = 100 / Math.max(width, height);
  let ratio = width / height;
  for(let n = 0; n < 3; n++) {
    // tex1到tex2
    let tex2 = createTexture(gl, null, 1, width, height);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex2, 0);
    bindTexture(gl, tex1, 0);
    if(width >= height) {
      gl.uniform2f(u_direction, max, 0);
    }
    else {
      gl.uniform2f(u_direction, max * ratio, 0);
    }
    gl.uniform1i(u_texture, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    // tex2到tex1
    let tex3 = createTexture(gl, null, 0, width, height);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex3, 0);
    bindTexture(gl, tex2, 1);
    if(width >= height) {
      gl.uniform2f(u_direction, 0, max * ratio);
    }
    else {
      gl.uniform2f(u_direction, 0, max);
    }
    gl.uniform1i(u_texture, 1);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    recycle.push(tex1);
    recycle.push(tex2);
    tex1 = tex3;
  }
  // 0/1单元都解绑
  bindTexture(gl, null, 0);
  bindTexture(gl, null, 1);
  // 回收
  gl.deleteBuffer(pointBuffer);
  gl.deleteBuffer(texBuffer);
  gl.disableVertexAttribArray(a_position);
  gl.disableVertexAttribArray(a_texCoords);
  recycle.forEach(item => gl.deleteTexture(item));
  return tex1;
}

function drawCm(gl, program, target, source, m, center, size) {
  gl.useProgram(program);
  bindTexture(gl, source.__page.texture, 0);
  gl.viewport(0, 0, size, size);
  let { x: tx1, y: ty1, width: w1, height: h1 } = target;
  let { x: tx2, y: ty2, width: w2, height: h2 } = source;
  let { x: x1, y: y2 } = convertCoords2Gl(tx1, ty1 + h1, 0, 1, center, center);
  let { x: x2, y: y1 } = convertCoords2Gl(tx1 + w1, ty1, 0, 1, center, center);
  let xa = tx2 / size, ya = (size - ty2) / size, xb = (tx2 + w2) / size, yb = (size - ty2 - h2) / size;
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
    xa, ya,
    xa, yb,
    xb, ya,
    xa, yb,
    xb, ya,
    xb, yb,
  ]), gl.STATIC_DRAW);
  let a_texCoords = gl.getAttribLocation(program, 'a_texCoords');
  gl.vertexAttribPointer(a_texCoords, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_texCoords);
  // 纹理单元
  let u_texture = gl.getUniformLocation(program, 'u_texture');
  gl.uniform1i(u_texture, 0);
  // matrix
  let u_m = gl.getUniformLocation(program, 'u_m');
  gl.uniform1fv(u_m, new Float32Array(m));
  gl.drawArrays(gl.TRIANGLES, 0, 6);
  // 回收
  gl.deleteBuffer(pointBuffer);
  gl.deleteBuffer(texBuffer);
  gl.disableVertexAttribArray(a_position);
  gl.disableVertexAttribArray(a_texCoords);
  bindTexture(gl, null, 0);
}

/**
 * 根据total/filter生成overflow
 */
function drawOverflow(gl, program, target, source, center, size) {
  gl.useProgram(program);
  let { x: tx1, y: ty1, width: w1, height: h1, bbox: bbox1 } = target;
  let { x: tx2, y: ty2, bbox: bbox2 } = source;
  let dx = bbox1[0] - bbox2[0], dy = bbox1[1] - bbox2[1];
  gl.viewport(0, 0, size, size);
  let { x: x1, y: y2 } = convertCoords2Gl(tx1, ty1 + h1, 0, 1, center, center);
  let { x: x2, y: y1 } = convertCoords2Gl(tx1 + w1, ty1, 0, 1, center, center);
  let xa = (tx2 + dx) / size, ya = (size - ty2 - dy) / size, xb = (tx2 + w1 + dx) / size, yb = (size - ty2 - h1 - dy) / size;
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
    xa, ya,
    xa, yb,
    xb, ya,
    xa, yb,
    xb, ya,
    xb, yb,
  ]), gl.STATIC_DRAW);
  let a_texCoords = gl.getAttribLocation(program, 'a_texCoords');
  gl.vertexAttribPointer(a_texCoords, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_texCoords);
  // 纹理单元
  let u_texture = gl.getUniformLocation(program, 'u_texture');
  bindTexture(gl, source.__page.texture, 0);
  gl.uniform1i(u_texture, 0);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
  // 回收
  gl.deleteBuffer(pointBuffer);
  gl.deleteBuffer(texBuffer);
  gl.disableVertexAttribArray(a_position);
  gl.disableVertexAttribArray(a_texCoords);
}

function drawMask(gl, program, target, source, temp, center, size) {
  gl.useProgram(program);
  bindTexture(gl, source.__page.texture, 0);
  bindTexture(gl, temp, 1);
  gl.viewport(0, 0, size, size);
  let { x: tx1, y: ty1, width: w1, height: h1 } = target;
  let { x: tx2, y: ty2, width: w2, height: h2 } = source;
  let { x: x1, y: y2 } = convertCoords2Gl(tx1, ty1 + h1, 0, 1, center, center);
  let { x: x2, y: y1 } = convertCoords2Gl(tx1 + w1, ty1, 0, 1, center, center);
  let xa = tx2 / size, ya = (size - ty2) / size, xb = (tx2 + w2) / size, yb = (size - ty2 - h2) / size;
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
  let texBuffer1 = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer1);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    xa, ya,
    xa, yb,
    xb, ya,
    xa, yb,
    xb, ya,
    xb, yb,
  ]), gl.STATIC_DRAW);
  let a_texCoords1 = gl.getAttribLocation(program, 'a_texCoords1');
  gl.vertexAttribPointer(a_texCoords1, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_texCoords1);
  let texBuffer2 = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer2);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    0, 1,
    0, 0,
    1, 1,
    0, 0,
    1, 1,
    1, 0,
  ]), gl.STATIC_DRAW);
  let a_texCoords2 = gl.getAttribLocation(program, 'a_texCoords2');
  gl.vertexAttribPointer(a_texCoords2, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_texCoords2);
  // 纹理单元
  let u_texture1 = gl.getUniformLocation(program, 'u_texture1');
  gl.uniform1i(u_texture1, 0);
  let u_texture2 = gl.getUniformLocation(program, 'u_texture2');
  gl.uniform1i(u_texture2, 1);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
  gl.deleteBuffer(pointBuffer);
  gl.deleteBuffer(texBuffer1);
  gl.deleteBuffer(texBuffer2);
  gl.disableVertexAttribArray(a_position);
  gl.disableVertexAttribArray(a_texCoords1);
  gl.disableVertexAttribArray(a_texCoords2);
  gl.deleteTexture(temp);
  gl.bindTexture(gl.TEXTURE_2D, null);
  bindTexture(gl, null, 0);
  bindTexture(gl, null, 1);
}

function drawMbm(gl, program, tex1, tex2) {
  bindTexture(gl, tex1, 0);
  bindTexture(gl, tex2, 1);
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
  // 纹理单元
  let u_texture1 = gl.getUniformLocation(program, 'u_texture1');
  gl.uniform1i(u_texture1, 0);
  let u_texture2 = gl.getUniformLocation(program, 'u_texture2');
  gl.uniform1i(u_texture2, 1);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
  gl.deleteBuffer(pointBuffer);
  gl.deleteBuffer(texBuffer);
  gl.disableVertexAttribArray(a_position);
  gl.disableVertexAttribArray(a_texCoords);
}

function drawDropShadow(gl, program, frameBuffer, cache, color, w1, w2, h1, h2) {
  gl.useProgram(program);
  let { x, y, width, height, __page: page } = cache;
  let size = page.size, texture = page.texture;
  let xa = x / size, ya = (size - y) / size, xb = (x + width) / size, yb = (size - y - height) / size;
  // 顶点buffer
  let pointBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
  let w = w1 / w2, h = h1 / h2;
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -w, -h,
    -w, h,
    w, -h,
    -w, h,
    w, -h,
    w, h,
  ]), gl.STATIC_DRAW);
  let a_position = gl.getAttribLocation(program, 'a_position');
  gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_position);
  // 纹理buffer
  let texBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    xa, yb,
    xa, ya,
    xb, yb,
    xa, ya,
    xb, yb,
    xb, ya,
  ]), gl.STATIC_DRAW);
  let a_texCoords = gl.getAttribLocation(program, 'a_texCoords');
  gl.vertexAttribPointer(a_texCoords, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_texCoords);
  // 纹理单元
  bindTexture(gl, texture, 0);
  let u_texture = gl.getUniformLocation(program, 'u_texture');
  gl.uniform1i(u_texture, 0);
  // color
  let u_color = gl.getUniformLocation(program, 'u_color');
  gl.uniform1fv(u_color, new Float32Array([color[0] / 255, color[1] / 255, color[2] / 255, color[3]]));
  gl.drawArrays(gl.TRIANGLES, 0, 6);
  // 回收
  gl.deleteBuffer(pointBuffer);
  gl.deleteBuffer(texBuffer);
  gl.disableVertexAttribArray(a_position);
  gl.disableVertexAttribArray(a_texCoords);
  bindTexture(gl, null, 0);
}

function drawDropShadowMerge(gl, target, size, tex1, dx1, dy1, w, h, tex2, dx2, dy2, width, height) {
  let { x, y } = target;
  let center = size * 0.5;
  let { x: x1, y: y2 } = convertCoords2Gl(x + dx1, y + h + dy1, 0, 1, center, center);
  let { x: x2, y: y1 } = convertCoords2Gl(x + w + dx1, y + dy1, 0, 1, center, center);
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
  let a_position = gl.getAttribLocation(gl.program, 'a_position');
  gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_position);
  // 纹理buffer
  let texBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    0, 1,
    0, 0,
    1, 1,
    0, 0,
    1, 1,
    1, 0,
  ]), gl.STATIC_DRAW);
  let a_texCoords = gl.getAttribLocation(gl.program, 'a_texCoords');
  gl.vertexAttribPointer(a_texCoords, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_texCoords);
  // opacity buffer
  let opacityBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, opacityBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([1, 1, 1, 1, 1, 1]), gl.STATIC_DRAW);
  let a_opacity = gl.getAttribLocation(gl.program, 'a_opacity');
  gl.vertexAttribPointer(a_opacity, 1, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_opacity);
  // 纹理单元
  bindTexture(gl, tex1, 0);
  let u_texture = gl.getUniformLocation(gl.program, 'u_texture');
  gl.uniform1i(u_texture, 0);
  gl.drawArrays(gl.TRIANGLES, 0, 6);

  let { x: x3, y: y4 } = convertCoords2Gl(x + dx2, y + height + dy2, 0, 1, center, center);
  let { x: x4, y: y3 } = convertCoords2Gl(x + width + dx2, y + dy2, 0, 1, center, center);
  gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    x3, y3,
    x3, y4,
    x4, y3,
    x3, y4,
    x4, y3,
    x4, y4,
  ]), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, opacityBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([1, 1, 1, 1, 1, 1]), gl.STATIC_DRAW);
  bindTexture(gl, tex2, 0);
  gl.uniform1i(u_texture, 0);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
  bindTexture(gl, null, 0);
  // gl.deleteBuffer(pointBuffer);
  // gl.deleteBuffer(texBuffer);
  // gl.deleteBuffer(opacityBuffer);
}

function drawTex2Cache(gl, program, cache, tex, width, height) {
  gl.useProgram(program);
  let page = cache.__page, size = page.__size;
  gl.viewport(0, 0, size, size);
  let x = cache.x, y = cache.y, center = size * 0.5;
  let { x: x1, y: y2 } = convertCoords2Gl(x, y + height, 0, 1, center, center);
  let { x: x2, y: y1 } = convertCoords2Gl(x + width, y, 0, 1, center, center);
  bindTexture(gl, tex, 0);
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
    0, 1,
    0, 0,
    1, 1,
    0, 0,
    1, 1,
    1, 0,
  ]), gl.STATIC_DRAW);
  let a_texCoords = gl.getAttribLocation(program, 'a_texCoords');
  gl.vertexAttribPointer(a_texCoords, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_texCoords);
  // 透明度buffer
  let opacityBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, opacityBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([1, 1, 1, 1, 1, 1]), gl.STATIC_DRAW);
  let a_opacity = gl.getAttribLocation(gl.program, 'a_opacity');
  gl.vertexAttribPointer(a_opacity, 1, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_opacity);
  // 纹理单元
  let u_texture = gl.getUniformLocation(program, 'u_texture');
  bindTexture(gl, tex, 0);
  gl.uniform1i(u_texture, 0);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
  gl.deleteBuffer(pointBuffer);
  gl.deleteBuffer(texBuffer);
  gl.deleteBuffer(opacityBuffer);
  gl.disableVertexAttribArray(a_position);
  gl.disableVertexAttribArray(a_texCoords);
  gl.disableVertexAttribArray(a_opacity);
  gl.bindTexture(gl.TEXTURE_2D, null);
}

function drawCache2Tex(gl, program, cache, width, height, spread) {
  let { x: tx1, y: ty1, width: w1, height: h1, __page: { texture, size } } = cache;
  gl.useProgram(program);
  gl.viewport(0, 0, width, height);
  // 首先将cache的纹理原状绘制到tex1上，为后续3次循环做准备，注意扩充的spread距离
  let cx = width * 0.5, cy = height * 0.5;
  let { x: x1, y: y2 } = convertCoords2Gl(spread, height - spread, 0, 1, cx, cy);
  let { x: x2, y: y1 } = convertCoords2Gl(width - spread, spread, 0, 1, cx, cy);
  let xa = tx1 / size, ya = (size - ty1) / size, xb = (tx1 + w1) / size, yb = (size - ty1 - h1) / size;
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
    xa, ya,
    xa, yb,
    xb, ya,
    xa, yb,
    xb, ya,
    xb, yb,
  ]), gl.STATIC_DRAW);
  let a_texCoords = gl.getAttribLocation(program, 'a_texCoords');
  gl.vertexAttribPointer(a_texCoords, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_texCoords);
  // opacity buffer
  let opacityBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, opacityBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([1, 1, 1, 1, 1, 1]), gl.STATIC_DRAW);
  let a_opacity = gl.getAttribLocation(gl.program, 'a_opacity');
  gl.vertexAttribPointer(a_opacity, 1, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_opacity);
  // 纹理单元
  let u_texture = gl.getUniformLocation(program, 'u_texture');
  bindTexture(gl, texture, 0);
  gl.uniform1i(u_texture, 0);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
  // gl.deleteBuffer(pointBuffer);
  // gl.deleteBuffer(texBuffer);
  // gl.deleteBuffer(opacityBuffer);
}

function drawSameSize(gl, tex, opacity) {
  let program = gl.programSs;
  gl.useProgram(program);
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
  // 纹理单元
  let u_texture = gl.getUniformLocation(program, 'u_texture');
  gl.uniform1i(u_texture, 0);
  bindTexture(gl, tex, 0);
  let u_opacity = gl.getUniformLocation(program, 'u_opacity');
  gl.uniform1f(u_opacity, opacity);
  gl.drawArrays(gl.TRIANGLES, 0, 6);

  gl.deleteBuffer(pointBuffer);
  gl.deleteBuffer(texBuffer);
  gl.disableVertexAttribArray(a_position);
  gl.disableVertexAttribArray(a_texCoords);
  gl.useProgram(gl.program);
}

function drawOitPlane(gl, structs, list, ppt, cx, cy, dx, dy) {
  let pointBuffer = gl.createBuffer();
  let a_position = gl.getAttribLocation(gl.program, 'a_position');
  let texBuffer = gl.createBuffer();
  let a_texCoords = gl.getAttribLocation(gl.program, 'a_texCoords');
  let opacityBuffer = gl.createBuffer();
  let a_opacity = gl.getAttribLocation(gl.program, 'a_opacity');
  let u_texture = gl.getUniformLocation(gl.program, 'u_texture');
  // 循环所有顺序拼图/平面
  for(let i = 0, len = list.length; i < len; i++) {
    let { isPuzzle, node, target, points } = list[i];
    let { __width: width, __height: height,
      __tx1: tx1, __ty1: ty1, __tx2: tx2, __ty2: ty2,
      __page: page, __bbox: bbox } = target;
    // 固定绑定纹理0号单元
    if(page.__update) {
      page.genTexture(gl);
    }
    bindTexture(gl, page.texture, 0);
    let bx = bbox[0], by = bbox[1];
    let opacity = node.__opacity;
    let matrix = node.__matrixEvent;
    let tw = tx2 - tx1, th = ty2 - ty1;
    // 先按照没有拆分拼图的情况求出节点的四个顶点坐标列表，可能有重复利用hash缓存
    let vtPoint = [], vtTex = [], vtOpacity = [];
    let pHash = [], tHash = [];
    if(isPuzzle) {
      // 拼接三角形，以起点为初始点链接其它所有顶点组成n-2个三角形
      let x0, y0, z0, w0;
      let p = points[0];
      let o = calPoint({
        x: bx + dx + p.px * width,
        y: by + dy + p.py * height,
        z: 0,
        w: 1,
      }, matrix);
      w0 = o.w;
      let t = convertCoords2Gl(o.x, o.y, o.z, w0, cx, cy, ppt);
      x0 = t.x; y0 = t.y; z0 = t.z;
      let tx0 = tx1 + p.px * tw, ty0 = ty1 + p.py * th;
      // 每次循环以第0个点为起点
      for(let j = 1, len = points.length; j < len - 1; j++) {
        vtPoint.push(x0);
        vtPoint.push(y0);
        vtPoint.push(z0);
        vtPoint.push(w0);
        vtTex.push(tx0);
        vtTex.push(ty0);
        vtOpacity.push(opacity);
        // 依次的2个相邻点
        for(let k = j; k < j + 2; k++) {
          let p = points[k];
          let x, y, z, w;
          let hashP = pHash[k];
          if(hashP) {
            x = hashP.x;
            y = hashP.y;
            z = hashP.z;
            w = hashP.w;
          }
          else {
            let o = calPoint({
              x: bx + dx + p.px * width,
              y: by + dy + p.py * height,
              z: 0,
              w: 1,
            }, matrix);
            w = o.w;
            let t = convertCoords2Gl(o.x, o.y, o.z, w, cx, cy, ppt);
            x = t.x; y = t.y; z = t.z;
            pHash[k] = {
              x,
              y,
              z,
              w,
            };
          }
          vtPoint.push(x);
          vtPoint.push(y);
          vtPoint.push(z);
          vtPoint.push(w);
          let tx, ty;
          let hashT = tHash[k];
          if(hashT) {
            tx = hashT.tx;
            ty = hashT.ty;
          }
          else {
            tx = tx1 + p.px * tw;
            ty = ty1 + p.py * th;
            tHash[k] = {
              tx,
              ty,
            };
          }
          vtTex.push(tx);
          vtTex.push(ty);
          vtOpacity.push(opacity);
        }
      }
    }
    else {
      let xa = bx + dx, ya = by + height + dy;
      let xb = bx + width + dx, yb = by + dy;
      let { x1, y1, z1, w1, x2, y2, z2, w2, x3, y3, z3, w3, x4, y4, z4, w4 } = calRectPoint(xa, ya, xb, yb, matrix);
      let t = convertCoords2Gl(x1, y1, z1, w1, cx, cy, ppt);
      x1 = t.x; y1 = t.y; z1 = t.z;
      t = convertCoords2Gl(x2, y2, z2, w2, cx, cy, ppt);
      x2 = t.x; y2 = t.y; z2 = t.z;
      t = convertCoords2Gl(x3, y3, z3, w3, cx, cy, ppt);
      x3 = t.x; y3 = t.y; z3 = t.z;
      t = convertCoords2Gl(x4, y4, z4, w4, cx, cy, ppt);
      x4 = t.x; y4 = t.y; z4 = t.z;
      vtPoint[0] = x1;
      vtPoint[1] = y1;
      vtPoint[2] = z1;
      vtPoint[3] = w1;
      vtPoint[4] = x4;
      vtPoint[5] = y4;
      vtPoint[6] = z4;
      vtPoint[7] = w4;
      vtPoint[8] = x2;
      vtPoint[9] = y2;
      vtPoint[10] = z2;
      vtPoint[11] = w2;
      vtPoint[12] = x4;
      vtPoint[13] = y4;
      vtPoint[14] = z4;
      vtPoint[15] = w4;
      vtPoint[16] = x2;
      vtPoint[17] = y2;
      vtPoint[18] = z2;
      vtPoint[19] = w2;
      vtPoint[20] = x3;
      vtPoint[21] = y3;
      vtPoint[22] = z3;
      vtPoint[23] = w3;
      vtTex[0] = tx1;
      vtTex[1] = ty1;
      vtTex[2] = tx1;
      vtTex[3] = ty2;
      vtTex[4] = tx2;
      vtTex[5] = ty1;
      vtTex[6] = tx1;
      vtTex[7] = ty2;
      vtTex[8] = tx2;
      vtTex[9] = ty1;
      vtTex[10] = tx2;
      vtTex[11] = ty2;
      vtOpacity[0] = opacity;
      vtOpacity[1] = opacity;
      vtOpacity[2] = opacity;
      vtOpacity[3] = opacity;
      vtOpacity[4] = opacity;
      vtOpacity[5] = opacity;
    }
    // 顶点buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vtPoint), gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_position, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_position);
    // 纹理buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vtTex), gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_texCoords, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_texCoords);
    // opacity buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, opacityBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vtOpacity), gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_opacity, 1, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_opacity);
    gl.uniform1i(u_texture, 0);
    gl.drawArrays(gl.TRIANGLES, 0, vtOpacity.length);
  }
  gl.deleteBuffer(pointBuffer);
  gl.deleteBuffer(texBuffer);
  gl.deleteBuffer(opacityBuffer);
  gl.disableVertexAttribArray(a_position);
  gl.disableVertexAttribArray(a_texCoords);
  gl.disableVertexAttribArray(a_opacity);
}

export default {
  initShaders,
  convertCoords2Gl,
  createTexture,
  bindTexture,
  drawTextureCache,
  drawBlur,
  drawOverflow,
  drawMask,
  drawMbm,
  drawCm,
  drawDropShadow,
  drawDropShadowMerge,
  drawTex2Cache,
  drawCache2Tex,
  drawSameSize,
  drawOitPlane,
};
