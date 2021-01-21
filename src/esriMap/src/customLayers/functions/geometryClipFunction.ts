import { IPostProcessingFunction, IGeometryRaster, IPreProcessingFunction } from "../ClientsideImageryLayer";


export const geometryClip: IPreProcessingFunction = function (data: IGeometryRaster, context: CanvasRenderingContext2D, state, webMercatorUtils: __esri.webMercatorUtils) {

  if (data.geometry.spatialReference.isWGS84)
    data.geometry = (webMercatorUtils.geographicToWebMercator(data.geometry) as any) as __esri.Polygon;

  context.beginPath();
  data.geometry.rings.forEach(ring =>
    ring.forEach(element => {
      let point = [0, 0];
      state.toScreenNoRotation(point, element);
      context.lineTo(point[0], point[1])
    }));
  context.closePath();
  context.clip();

  return data;
} as IPreProcessingFunction;
