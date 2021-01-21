import { ICustomLayerRenderer, IGeometryRaster, IState, IColoringFunction } from "../ClientsideImageryLayer";

export const defaultGeoTiffRenderer: ICustomLayerRenderer = (element: IGeometryRaster,
  context: CanvasRenderingContext2D,
  state: IState, wmUtils: __esri.webMercatorUtils,
  applyBlur: boolean = true,
  avoidTransparent: boolean = false,
  coloringFunction: IColoringFunction = null) => {

  let xmin = element.rasterdata.xmin;
  let ymin = element.rasterdata.ymin;
  let xmax = element.rasterdata.xmax;
  let ymax = element.rasterdata.ymax;

  let top = [0, 0];
  let bottom = [0, 0];
  state.toScreenNoRotation(top, [xmin, ymax]);
  state.toScreenNoRotation(bottom, [xmax, ymin]);

  if (applyBlur) {
    var sw = Math.floor((bottom[0] - top[0]) / element.rasterdata.width);
    (context as any).filter = 'opacity(1) blur(' + (sw * 0.5) + 'px)';
  }

  context.globalCompositeOperation = "source-over";
  let rxstep = ((element.rasterdata.xmax - element.rasterdata.xmin) / element.rasterdata.width);
  let rystep = ((-element.rasterdata.ymax + element.rasterdata.ymin) / element.rasterdata.height);

  element.rasterdata.values.forEach((ras, index) => {
    for (let x = 0; x < element.rasterdata.width; x++) {
      for (let y = 0; y < element.rasterdata.height; y++) {
        let val = ras[y][x];

        if (!val || val == element.rasterdata.no_data_value || val < -1000) continue;

        let gxmin = (xmin + (x) * rxstep);
        let gxmax = (xmin + (x + 1) * rxstep);
        let gymin = (ymax + (y) * rystep);
        let gymax = (ymax + (y + 1) * rystep);

        let p1 = [0, 0];
        let p2 = [0, 0];
        state.toScreenNoRotation(p1, [gxmin, gymax]);
        state.toScreenNoRotation(p2, [gxmax, gymin]);

        var color = coloringFunction ? coloringFunction(val) : [0, 0, 0, val];

        context.fillStyle = `rgba(${color[0]},${color[1]},${color[2]}, ${color[3]})`
        context.fillRect(p1[0], p1[1], p2[0] - p1[0], p2[1] - p1[1]);
      }
    }
  });

  // if (applyBlur && avoidTransparent) {
  //   // Il blur applica di suo delle trasparenze,
  //   // imposto a opaco la banda alfa.
  //   var idata = context.getImageData(top[0], top[1], bottom[0] - top[0], bottom[1] - top[1]);
  //   var il = idata.width * idata.height;
  //   // var ih = idata.height;
  //   var imgdata = idata.data;
  //   for (var x = 0; x < il; x++)
  //   {
  //     let idx = x * 4 + 3;
  //     imgdata[idx] = imgdata[idx]>0? 255:0;
  //   }

  //   context.putImageData(idata, top[0], top[1]);
  // }
};
