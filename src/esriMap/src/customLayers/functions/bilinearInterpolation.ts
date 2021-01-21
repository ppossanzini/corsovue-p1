import { IPostProcessingFunction, IGeometryRaster, IRaster } from "../ClientsideImageryLayer";


// Bilinear interpolation for Raster data
export const rasterBilinearInterpolation = function (data: IRaster, enabled: boolean = true, steps: number = 3): IRaster {


  let result = Object.assign({}, data);
  if (!enabled) return result;

  result.values = new Array(data.values.length);
  for (let k = 0; k < steps; k++) {
    for (let index = 0; index < data.values.length; index++) {
      const lay = data.values[index];
      let destination = new Array(data.height);

      for (var l = 0; l < data.height; l++)
        destination[l] = new Array(data.width);

      for (let x = 0; x < data.width; x++)
        for (let y = 0; y < data.height; y++) {
          let value = lay[y][x];
          if (!value || isNaN(value)) {

            let values = 0;
            if (x > 0 && isFinite(lay[y][x - 1])) { value = (isFinite(value) ? value : 0) + lay[y][x - 1]; values++; }
            if (x < data.width - 1 && isFinite(lay[y][x + 1])) { value = (isFinite(value) ? value : 0) + lay[y][x + 1]; values++; }
            if (y > 0 && isFinite(lay[y - 1][x])) { value = (isFinite(value) ? value : 0) + lay[y - 1][x]; values++; }
            if (y < data.height - 1 && isFinite(lay[y + 1][x])) { value = (isFinite(value) ? value : 0) + lay[y + 1][x]; values++; }

            destination[y][x] = (value) / values;
          }
          else
            destination[y][x] = value;
        }

      result.values[index] = destination;
    }

    data = result;
    // result = Object.assign({}, data);
  }

  return result;
}

