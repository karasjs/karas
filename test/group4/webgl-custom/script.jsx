function initShaders(gl, vshader, fshader) {
  let program = createProgram(gl, vshader, fshader);
  if (!program) {
    console.error('无法创建程序对象');
    return false;
  }

  gl.useProgram(program);

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
  // 创建着色器对象
  let vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader);
  let fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader);
  if (!vertexShader || !fragmentShader) {
    return null;
  }

  // 创建程序对象
  let program = gl.createProgram();
  if (!program) {
    return null;
  }

  // 为程序对象分配顶点着色器和片元着色器
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  // 连接着色器
  gl.linkProgram(program);

  // 检查连接
  let linked = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!linked) {
    let error = gl.getProgramInfoLog(program);
    console.error('无法连接程序对象: ' + error);
    gl.deleteProgram(program);
    gl.deleteShader(fragmentShader);
    gl.deleteShader(vertexShader);
    return null;
  }
  return program;
}

/**
 * 创建着色器对象
 * @param gl GL context
 * @param type the type of the shader object to be created
 * @param source shader program (string)
 * @return created shader object, or null if the creation has failed.
 */
function loadShader(gl, type, source) {
  // 创建着色器对象
  let shader = gl.createShader(type);
  if(shader == null) {
    console.error('无法创建着色器');
    return null;
  }

  // 设置着色器源代码
  gl.shaderSource(shader, source);

  // 编译着色器
  gl.compileShader(shader);

  // 检查着色器的编译状态
  let compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if(!compiled) {
    let error = gl.getShaderInfoLog(shader);
    console.error('Failed to compile shader: ' + error);
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

class $custom extends karas.Geom {
  render(renderMode, ctx, dx, dy) {
    let res = super.render(renderMode, ctx, dx, dy);
    if(renderMode === karas.mode.WEBGL) {
      let gl = ctx;
      let vSource = `attribute vec4 a_position;
void main() {
  gl_Position = a_position;
}`;
      let fSource = `precision mediump float;
void main() {
  gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
}`;
      let p = initShaders(gl, vSource, fSource);
      let pointBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1, 1,
        -1, 0.5,
        -0.5, 1,
        -1, 0.5,
        -0.5, 1,
        -0.5, 0.5,
      ]), gl.STATIC_DRAW);
      let a_position = gl.getAttribLocation(p, 'a_position');
      gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(a_position);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      gl.deleteBuffer(pointBuffer);
      gl.disableVertexAttribArray(a_position);
      gl.useProgram(gl.program);
    }
    return res;
  }
}
karas.Geom.register('$custom', $custom);

let o = karas.render(
  <webgl width="360" height="360">
    <$custom style={{margin:20,width:100,height:100,background:'#F00',filter:'blur(1)',rotateZ:30}}/>
    <div>aaa</div>
  </webgl>,
  '#test'
);
