import { ICustomLayerRenderer, IGeometryRaster, IState, IColoringFunction } from "../ClientsideImageryLayer";
import { defaultGeoTiffRenderer } from "./defaultGeoTiffRenderer";
import { createShader, createProgram, resizeCanvasToDisplaySize, setRectangle, pushRectangle, toWebglRGBA } from "./webglUtils";

let webgl = document.createElement("canvas").getContext("webgl");

let glProgram = null;
function prepareShaders() {
  if (glProgram == null) {
    // Preparo gli shaders che mi serviranno per fare il rendering
    // ----------------------------------------------------------------------------------------------
    let vertexShader = createShader(webgl, webgl.VERTEX_SHADER, vertexShaderSource);
    let fragmentShader = createShader(webgl, webgl.FRAGMENT_SHADER, fragmentShaderSource);
    glProgram = createProgram(webgl, vertexShader, fragmentShader);
  }
}

export const webglGeoTiffRenderer: ICustomLayerRenderer = (element: IGeometryRaster,
  context: CanvasRenderingContext2D,
  state: IState, wmUtils: __esri.webMercatorUtils,
  applyBlur: boolean = true,
  avoidTransparent: boolean = false,
  coloringFunction: IColoringFunction = null) => {

  // Check di uscita anticipata se il raster non cade nei limiti

  {
    let ext = state.extent;
    let rd = element.rasterdata;
    if (rd.xmin > ext.xmax || rd.xmax < ext.xmin || rd.ymax < ext.ymin || rd.ymin > ext.ymax) return;
  }

  // FALLBACK
  if (!webgl) {
    defaultGeoTiffRenderer(element, context, state, wmUtils, applyBlur, avoidTransparent, coloringFunction);
    return;
  }


  prepareShaders();
  // Ridimensiono e pulisco il canvas WebGL
  // ----------------------------------------------
  var pixelRatio = state.pixelRatio;
  var width = state.size[0];
  var height = state.size[1];

  resizeCanvasToDisplaySize(webgl.canvas, width * pixelRatio, height * pixelRatio);
  webgl.viewport(0, 0, width * pixelRatio, height * pixelRatio);

  //abilitazione della funzionalità di blend e specifica dei parametri del blend per risolvere problemi con la colorazione in firefox
  //riferimento: https://stackoverflow.com/questions/56182751/how-to-fix-crossbrowser-issue-with-alpha-blendmode-in-webgl-context
  webgl.enable(webgl.BLEND);
  webgl.blendFuncSeparate(webgl.SRC_ALPHA, webgl.ONE_MINUS_SRC_ALPHA, webgl.ONE, webgl.ONE_MINUS_SRC_ALPHA);

  webgl.clearColor(0.0, 0.0, 0.0, 0.0);
  webgl.clear(webgl.COLOR_BUFFER_BIT);

  // Preparo i buffers per passare i dati agli shareds.
  // ----------------------------------------------------------------------------------------------
  var positionAttributeLocation = webgl.getAttribLocation(glProgram, "a_position");
  var resolutionUniformLocation = webgl.getUniformLocation(glProgram, "u_resolution");
  var colorAttributeLocation = webgl.getAttribLocation(glProgram, "a_color");
  var positionBuffer = webgl.createBuffer();
  var colorBuffer = webgl.createBuffer();

  // webgl.bindBuffer(webgl.ARRAY_BUFFER, positionBuffer);
  // webgl.bindBuffer(webgl.ARRAY_BUFFER, colorBuffer);

  // Calcolo le dimensioni del raster relativamente ai dati
  let xmin = element.rasterdata.xmin;
  let ymin = element.rasterdata.ymin;
  let xmax = element.rasterdata.xmax;
  let ymax = element.rasterdata.ymax;

  let top = [0, 0];
  let bottom = [0, 0];
  state.toScreenNoRotation(top, [xmin, ymax]);
  state.toScreenNoRotation(bottom, [xmax, ymin]);

  if (top[0] > (width * pixelRatio) || top[1] > (height * pixelRatio)) return;
  if (bottom[0] < 0 || bottom[1] < 0) return;

  if (applyBlur) {
    var sw = Math.floor((bottom[0] - top[0]) / element.rasterdata.width);
    (context as any).filter = 'opacity(1) blur(' + (sw * 0.5) + 'px)';
  }

  // Calcolo la posizione dei poligoni che devo disegnare . A
  // ATTENZIONE : Sono sempre triangoli!! quindi per fare un quadrato occorrono 6 vertici


  let rxstep = ((element.rasterdata.xmax - element.rasterdata.xmin) / element.rasterdata.width);
  let rystep = ((-element.rasterdata.ymax + element.rasterdata.ymin) / element.rasterdata.height);

  var positions = [];
  var colors = [];

  element.rasterdata.values.forEach((ras, index) => {
    for (let x = 0; x < element.rasterdata.width; x++) {
      for (let y = 0; y < element.rasterdata.height; y++) {
        let val = ras[y][x];

        if (val === undefined || val === null || isNaN(val) || val == element.rasterdata.no_data_value || val < -1000) continue;

        let gxmin = (xmin + (x) * rxstep);
        let gxmax = (xmin + (x + 1) * rxstep);
        let gymin = (ymax + (y) * rystep);
        let gymax = (ymax + (y + 1) * rystep);

        let p1 = [0, 0];
        let p2 = [0, 0];
        state.toScreenNoRotation(p1, [gxmin, gymax]);
        state.toScreenNoRotation(p2, [gxmax, gymin]);

        if (p1[0] > (width * pixelRatio) || p1[1] > (height * pixelRatio)) continue;
        if (p2[0] < 0 || p2[1] < 0) continue;

        pushRectangle(positions, p1[0], p1[1], p2[0], p2[1]);

        var color = coloringFunction ? toWebglRGBA(coloringFunction(val)) : [0, 0, 0, val];
        colors.push(...color);
        colors.push(...color);
        colors.push(...color);
        colors.push(...color);
        colors.push(...color);
        colors.push(...color);
        // webgl.uniform4f(colorUniformLocation, color[0] / 255, color[1] / 255, color[2] / 255, color[3]);
      }
    }
  });

  webgl.useProgram(glProgram);

  // Buffer dei colori
  webgl.bindBuffer(webgl.ARRAY_BUFFER, colorBuffer);
  webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(colors), webgl.STATIC_DRAW);
  webgl.vertexAttribPointer(colorAttributeLocation, 4, webgl.FLOAT, false, 0, 0)
  webgl.enableVertexAttribArray(colorAttributeLocation);

  // Buffer dei punti
  webgl.bindBuffer(webgl.ARRAY_BUFFER, positionBuffer);
  webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(positions), webgl.STATIC_DRAW);
  webgl.vertexAttribPointer(positionAttributeLocation, 2, webgl.FLOAT, false, 0, 0)
  webgl.enableVertexAttribArray(positionAttributeLocation);

  webgl.uniform2f(resolutionUniformLocation, width * pixelRatio, height * pixelRatio);
  webgl.drawArrays(webgl.TRIANGLES, 0, positions.length / 2);

  context.drawImage(webgl.canvas, 0, 0, width * pixelRatio, height * pixelRatio);
};

var vertexShaderSource = `
attribute vec4 a_color;
attribute vec2 a_position;


uniform vec2 u_resolution;
varying lowp vec4 vColor;

void main() {
   // convert the rectangle from pixels to 0.0 to 1.0
   vec2 zeroToOne = a_position / u_resolution;

   // convert from 0->1 to 0->2
   vec2 zeroToTwo = zeroToOne * 2.0;

   // convert from 0->2 to -1->+1 (clipspace)
   vec2 clipSpace = zeroToTwo - 1.0;

   gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
   vColor = a_color;
}
`;

var fragmentShaderSource = `
// fragment shaders don't have a default precision so we need
// to pick one. mediump is a good default
precision mediump float;

//uniform vec4 u_color;
varying lowp vec4 vColor;

void main() {
    //gl_FragColor = u_color;
    gl_FragColor = vColor;
}
`;
