import { bicubic_optimized } from "../functions/upscalingFunctions";
import { ICustomLayerRenderer, IState, IColoringFunction, IGeometryRaster } from "../ClientsideImageryLayer";

export const defaultGeoTiffRendererViaImage: ICustomLayerRenderer = (element: IGeometryRaster,
  context: CanvasRenderingContext2D,
  state: IState, wmUtils: __esri.webMercatorUtils,
  applyBlur: boolean = true,
  avoidTransparent: boolean, coloringFunction: IColoringFunction = null) => {
  let xmin = element.rasterdata.xmin;
  let ymin = element.rasterdata.ymin;
  let xmax = element.rasterdata.xmax;
  let ymax = element.rasterdata.ymax;

  let top = [0, 0];
  let bottom = [0, 0];
  state.toScreenNoRotation(top, [xmin, ymax]);
  state.toScreenNoRotation(bottom, [xmax, ymin]);

  element.rasterdata.values.forEach((ras, index) => {


    let orw = element.rasterdata.width;
    let orh = element.rasterdata.height;

    // metto su una image il raster che mi interessa considerando solo 1 degli indici RGB
    let rasterimage = context.createImageData(orw, orh);
    for (let y = 0; y < orh; y++) {
      for (let x = 0; x < orw; x++) {
        var idx = (x + y * orw) * 4;
        rasterimage.data[idx + 3] = ras[y][x] * 255;
      }
    }

    let dw = Math.floor(Math.abs(bottom[0] - top[0]));
    let dh = Math.floor(Math.abs(bottom[1] - top[1]));
    // creo una immagine delle dimensioni di destinazione
    let destinationImage = context.createImageData(dw, dh);
    let destinationdata = destinationImage.data
    for (let y = 0; y < dh; y++) {
      for (let x = 0; x < dw; x++) {
        var idx = (x + y * dw) * 4;
        let result = bicubic_optimized(rasterimage.data, (x / dw) * orw, (y / dh) * orh, 3, orw);
        destinationImage.data[idx + 3] = result;
        destinationImage[idx] = 200;      // R
        destinationImage[idx + 1] = 200;  // G
        // destinationImage[idx + 2] = 0;  // B
        // destinationImage[idx + 3] = 0;  // A
      }
    }

    // let result = bilinear_optimized(rasterimage.data, 0, 0, 0, 300);
    context.putImageData(rasterimage, 100, 150);
    context.putImageData(destinationImage, top[0], top[1]);
  });
}
