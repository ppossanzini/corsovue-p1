import { IRaster } from "../ClientsideImageryLayer";

// Bilinear interpolation for Raster data
export const rasterNormalize = function (data: IRaster, min?: number, max?: number, enabled: boolean = true): IRaster {

  // if (data.normalized) return data;

  // Elimino la normalizzazione per Crop e calcolo la normalizzazione per campo.
  // if (!enabled) {
  //   max = -100;
  //   min = 100;

  //   for (let k = 0; k < data.values.length; k++)
  //     for (let x = 0; x < data.width; x++)
  //       for (let y = 0; y < data.height; y++) {
  //         let val = data.values[k][y][x];
  //         let r = (val - min) / (max - min)
  //         max = Math.max(max, r);
  //         min = Math.min(min, r);
  //       }
  // }

  if (min != null && max != null)
    for (let k = 0; k < data.values.length; k++)
      for (let x = 0; x < data.width; x++)
        for (let y = 0; y < data.height; y++) {
          let val = data.values[k][y][x];
          let r = (val - min) / (max - min)
          data.values[k][y][x] = Math.min(Math.max(r, 0), 1);
        }

  // data.normalized = true;
  return data;
}


