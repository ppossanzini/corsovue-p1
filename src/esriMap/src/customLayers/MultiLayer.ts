/* Multilayer è un layer con caratteristiche di rendering multiplo per i graphics */

import { Esri } from "@/esriMap";

export async function MultiLayer(options): Promise<IMultiLayer> {

  let webMercatorUtils = await Esri.Geometry.Support.webMercatorUtils();

  let MultilayerView = (await Esri.Layers.BaseLayerView2D()).createSubclass({
    // create Web workers to manipulate the raster image
    // Attach property watchers to layer
    attach: function () {
      this._imagesWatcher = this.layer.watch("graphics", function () {
        this.requestRender();
      })
    },
    // Detach property watchers from layer
    detach: function () {
      this._propertyHandle.remove();
      this._propertyHandle = null;
    },

    preRenderingCallBack: null,
    renderingCallBack: null,

    // Funzione di HitTest
    async hitTest(x, y): Promise<__esri.Graphic> {
      let hitTestBuffer = this.layer.hitTestBuffer;

      let g = this.layer.graphics.find(e => {
        let xy = e["_screenPoint"];
        if (xy) {
          return (xy[0] - hitTestBuffer) <= x &&
            (xy[0] + hitTestBuffer) >= x &&
            (xy[1] - hitTestBuffer) <= y &&
            (xy[1] + hitTestBuffer) >= y;
        }
        return false;
      });
      return g;
    },
    render(renderParameters: { context: CanvasRenderingContext2D, stationary: boolean, state: IState }) {
      var state = renderParameters.state;
      var context = renderParameters.context as any;

      context.save();

      // ROTATE the context with map;
      context.translate(state.width * 0.5, state.height * 0.5);
      context.rotate((state.rotation * Math.PI) / 180);
      context.translate(-state.width * 0.5, -state.height * 0.5);

      let prerender = (this.preRenderingCallBack || this.layer.preRenderingCallBack) as PreRenderingFunctionDelegate;
      let grender = (this.renderingCallBack || this.layer.renderingCallBack) as RenderingFunctionDelegate;
      context.imageSmoothingEnabled = true;
      if (prerender) prerender(context, state);

      if (grender)
        (this.layer.graphics).forEach((element: __esri.Graphic) => {

          if (element.geometry.type == "point") {
            var point = element.geometry as __esri.Point;
            if (point.spatialReference.isWGS84) {
              point = webMercatorUtils.geographicToWebMercator(element.geometry) as __esri.Point;
              // Salvo le coordinate convertite in WebMercatore per non doverle ricalcolare.
              element.geometry = point;
            }

            var xy = [0, 0];

            state.toScreenNoRotation(xy, [point.x, point.y]);
            // Salvo la posizione del graphic nello schermo per la funzione di HitTest
            element["_screenPoint"] = xy;
            // xy[0] = Math.round(xy[0]);
            // xy[1] = Math.round(xy[1]);

            if (xy[0] > 0 && xy[1] > 0 && xy[0] < state.width && xy[1] < state.height)
              grender(new RenderingHelper(context, xy), element);
          }

        });
      context.restore();
    },
  });

  let coll = await Esri.Core.Collection();
  let MultilayerConstructor = (await Esri.Layers.BaseTileLayer()).createSubclass({
    properties: {
      skipIfNoValue: true,
    },
    preRenderingCallBack: null,
    renderingCallBack: null,
    hitTestBuffer: 5,
    graphics: coll,
    createLayerView(view) {
      return new MultilayerView({
        view: view,
        layer: this
      });
    }
  });
  return new MultilayerConstructor(options) as IMultiLayer;
}

class RenderingHelper {
  public context: CanvasRenderingContext2D;

  private xy: number[] = null;

  constructor(context: CanvasRenderingContext2D, xy: number[]) {
    this.context = context;
    this.xy = xy;
  }

  public drawCircle(radius: number,
    fillStyle: string | CanvasGradient | CanvasPattern,
    strokeStyle: string | CanvasGradient | CanvasPattern, strokeWidth: number = 2) {
    this.context.lineWidth = strokeWidth;
    this.context.beginPath();
    this.context.arc(this.xy[0], this.xy[1], radius, 0, 2 * Math.PI);

    if (strokeStyle) {
      this.context.strokeStyle = strokeStyle;
      this.context.stroke();
    }

    if (fillStyle) {
      this.context.fillStyle = fillStyle;
      this.context.fill();
    }
  }

  public drawRect(width: number, height: number,
    fillStyle: string | CanvasGradient | CanvasPattern,
    strokeStyle: string | CanvasGradient | CanvasPattern, strokeWidth: number = 2) {

    this.context.lineWidth = strokeWidth;
    if (fillStyle) {
      this.context.fillStyle = fillStyle;
      this.context.fillRect(this.xy[0] - width / 2, this.xy[1] - height / 2, width, height);
    }
    if (strokeStyle) {
      this.context.strokeStyle = strokeStyle;
      this.context.strokeRect(this.xy[0] - width / 2, this.xy[1] - height / 2, width, height);
    }
  }

  public drawText(value: string,
    font: string,
    fillStyle: string | CanvasGradient | CanvasPattern,
    strokeStyle: string | CanvasGradient | CanvasPattern,
    width: number,
    offsetx?: number, offsety?: number, strokeWidth: number = 2) {

    this.context.lineWidth = strokeWidth;
    if (font) this.context.font = font;
    if (fillStyle) this.context.fillStyle = fillStyle;
    if (strokeStyle) this.context.strokeStyle = strokeStyle;

    let x = this.xy[0] - (width || 0) / 2;
    let y = this.xy[1];

    if (typeof (offsetx) === "number") x = x + offsetx;
    if (typeof (offsety) === "number") y = y + offsety;

    this.context.fillText(value, x, y, width);
    if (strokeStyle) this.context.strokeText(value, x, y, width);
  }

}


interface RenderingFunctionDelegate {
  (rendering: RenderingHelper, graphic: __esri.Graphic)
}

interface PreRenderingFunctionDelegate {
  (context: CanvasRenderingContext2D, state: IState)
}

export interface IMultiLayer {
  graphics: __esri.Collection<__esri.Graphic>,
  preRenderingCallBack: PreRenderingFunctionDelegate,
  renderingCallBack: RenderingFunctionDelegate
}

export interface IMultiLayerView {
  preRenderingCallBack: PreRenderingFunctionDelegate,
  renderingCallBack: RenderingFunctionDelegate
}

interface IState {
  toScreenNoRotation(destination, source),
  width: number,
  rotation: number,
  scale: number,
  height: number,
  latitude: number,
  longitude: number
}
