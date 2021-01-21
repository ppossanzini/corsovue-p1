export function createShader(gl, type, source) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  gl.deleteShader(shader);
}

export function createProgram(gl, ...shaders) {
  var program = gl.createProgram();

  for (var i in shaders) {
    const shader = shaders[i];
    gl.attachShader(program, shader);
  }

  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  gl.deleteProgram(program);
}


/**
 * Resize a canvas to match the size its displayed.
 * @param {HTMLCanvasElement} canvas The canvas to resize.
 * @return {boolean} true if the canvas was resized.
 * @memberOf module:webgl-utils
 */
export function resizeCanvasToDisplaySize(canvas, width, height) {
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
    return true;
  }
  return false;
}

export function setRectangle(gl, x1, y1, x2, y2) {
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    x1, y2,
    x2, y2,
    x1, y1,
    x1, y1,
    x2, y2,
    x2, y1,
  ]), gl.STATIC_DRAW);
}

export function pushRectangle(array: any[], x1, y1, x2, y2) {
  array.push(
    x1, y2,
    x2, y2,
    x1, y1,
    x1, y1,
    x2, y2,
    x2, y1);
}

export function toWebglRGBA(value: number[]) {
  return [value[0] / 255, value[1] / 255, value[2] / 255, value[3]];
}
