import { IPostProcessingFunction, IGeometryRaster, IPreProcessingFunction, IState } from "../ClientsideImageryLayer";


declare var fx;
declare var Texture;

export const lensBlurFilter: IPostProcessingFunction = function (data: IGeometryRaster, context: CanvasRenderingContext2D, state: IState, webMercatorUtils: __esri.webMercatorUtils) {

  let imagedata = context.getImageData(0, 0, state.size[0], state.size[1]);
  let canvas = fx.canvas();
  // var img = Texture.initFromBytes(state.width, state.height, imagedata.data);
  let text = canvas.texture(imagedata);
  canvas.draw(text).lensBlur(10, -1, 0).update();

  imagedata.data.set(canvas.getPixelArray(), 0);

  context.putImageData(imagedata, 0, 0);
} as IPostProcessingFunction;
