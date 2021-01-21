import { Esri, geometryClip, ArrayObserver } from "@/esriMap";
import { bilinear_unrolled, bilinear_optimized, nearest, nearest_unrolled, bicubic_optimized } from "./functions/upscalingFunctions";
import { defaultGeoTiffRenderer } from "./renderers/defaultGeoTiffRenderer";

export async function ClientsideImageryLayer(options): Promise<IClientsideImageryLayer> {

  let webMercatorUtils = await Esri.Geometry.Support.webMercatorUtils();

  let ClientsideImageryLayerView = (await Esri.Layers.BaseLayerView2D()).createSubclass({
    // create Web workers to manipulate the raster image
    // Attach property watchers to layer
    attach: function () {
      this._imagesWatcher = this.layer.watch("applyBlur", function () {
        this.requestRender();
      })
    },
    // Detach property watchers from layer
    detach: function () {
      this._imagesWatcher.remove();
      // this._propertyHandle = null;
    },
    async render(renderParameters: { context: Object, stationary: boolean, state: IState }) {
      var state = renderParameters.state;
      var context = renderParameters.context as any;

      var pixelRatio = state.pixelRatio;
      var width = state.size[0];
      var height = state.size[1];

      // exit if scale is too high
      if (this.layer.applyScaleLimit && state.scale > this.layer.renderingScaleLimit) return;

      if (state.rotation !== 0) {
        context.translate(width * pixelRatio * 0.5, height * pixelRatio * 0.5);
        context.rotate((state.rotation * Math.PI) / 180);
        context.translate(- width * pixelRatio * 0.5, -height * pixelRatio * 0.5);
      }

      context.save();

      (this.layer.geometryRasters).forEach(async (element: IGeometryRaster) => {

        { //// CHECK DI USCITA ANTICIPATO
          let ext = state.extent;
          let rd = element.geometry.extent.clone();

          if (rd.spatialReference.isWGS84) {
            let minxy = webMercatorUtils.lngLatToXY(rd.xmin, rd.ymin);
            let maxxy = webMercatorUtils.lngLatToXY(rd.xmax, rd.ymax);


            rd.xmin = minxy[0];
            rd.ymin = minxy[1];
            rd.xmax = maxxy[0];
            rd.ymax = maxxy[1];
          }


          if (rd.xmin > ext.xmax || rd.xmax < ext.xmin || rd.ymax < ext.ymin || rd.ymin > ext.ymax) {
            return;
          }
        }

        if (!element.rasterdata && this.layer.rasterLoader) {
          let rpromise = this.layer.rasterLoader(element.rasterUri, element.minValue, element.maxValue)
          element.rasterdata = rpromise;
          element.rasterdata = this.layer.toWebMercator(await rpromise);

          // Request render.
          this.requestRender();
        }
        else
          if (element.rasterdata && !(element.rasterdata instanceof Promise)) {
            this.createTile(element, context, state);
          }
      });

      context.restore();
    },

    redraw: function () {
      this.requestRender();
    },

    createTile: function (element: IGeometryRaster, context, state) {

      context.save();
      // Chiamate alle funzioni di preprocessing
      this.layer.preProcessingFunctions.forEach((func: IPreProcessingFunction) => {
        element = func(element, context, state, webMercatorUtils) || element;
      });

      if (this.layer.renderer) {
        this.layer.renderer(element, context, state, webMercatorUtils, this.layer.applyBlur, false, this.layer.coloringFunction);
      }

      // Chiamata alle funzioni di postprocessing
      this.layer.postProcessingFunctions.forEach((func: IPostProcessingFunction) => {
        func(element, context, state, webMercatorUtils);
      });
      context.restore();
    },
  })

  let ClientsideImageryLayer = (await Esri.Layers.BaseTileLayer()).createSubclass({
    properties: {
      skipIfNoValue: true,
    },

    preProcessingFunctions: [geometryClip] as Array<IPreProcessingFunction>,
    postProcessingFunctions: [] as Array<IPostProcessingFunction>,
    renderer: defaultGeoTiffRenderer,
    coloringFunction: null as IColoringFunction,
    geometryRasters: [] as IGeometryRaster[],
    applyBlur: false,
    renderingScaleLimit: 30000,
    applyScaleLimit: true,
    rasterLoader: null,

    addImageRaster: function (item: IGeometryRaster) {
      this.geometryRasters.push({
        attributes: item.attributes,
        geometry: item.geometry,
        rasterUri: item.rasterUri,
        rasterdata: item.rasterdata ? this.toWebMercator(item.rasterdata) : null,
        minValue: item.minValue,
        maxValue: item.maxValue
      } as IGeometryRaster);
    },

    toWebMercator: function (rasterdata) {
      if (rasterdata.projection == 4326) {
        let minxy = webMercatorUtils.lngLatToXY(rasterdata.xmin, rasterdata.ymin);
        let maxxy = webMercatorUtils.lngLatToXY(rasterdata.xmax, rasterdata.ymax);

        rasterdata.xmin = minxy[0];
        rasterdata.ymin = minxy[1];
        rasterdata.xmax = maxxy[0];
        rasterdata.ymax = maxxy[1];
      }

      return rasterdata;
    },
    createLayerView(view): IClientsideImageryLayerView {

      let lv = new ClientsideImageryLayerView({
        view: view,
        layer: this
      });

      this.requestRender = () => lv.requestRender();
      return lv;
    },
    redraw() {
      this.requestRender();
    }

  });

  let instance = new ClientsideImageryLayer(options) as IClientsideImageryLayer;
  instance.geometryRasters = [];
  instance.applyBlur = false;
  return instance;
}

export interface IClientsideImageryLayer extends __esri.Layer {
  geometryRasters: Array<IGeometryRaster>;
  addImageRaster(item: IGeometryRaster);
  preProcessingFunctions: Array<IPreProcessingFunction>,
  postProcessingFunctions: Array<IPostProcessingFunction>,
  renderer: ICustomLayerRenderer,
  applyBlur: boolean,
  renderingScaleLimit: 30000,
  applyScaleLimit: true,
  rasterLoader: (uri: string, min, max) => Promise<IRaster>,
  coloringFunction: IColoringFunction,
  requestRender()
  // redraw()
}

export interface IClientsideImageryLayerView extends __esri.LayerView {

}


export interface IGeometryRaster {
  geometry: __esri.Polygon;
  rasterdata: IRaster, // | Promise<IRaster>,
  rasterUri: string,

  attributes?: any,
  _currentScale?: number,
  _tile?: any;

  minValue?: number;
  maxValue?: number;
}

export interface IRaster {
  values: Array<Array<Array<number>>>,
  xmin: number,
  ymin: number,
  xmax: number,
  ymax: number,
  width: number,
  height: number,
  no_data_value: number,
  projection: number,
  normalized: boolean,
  interpolated: boolean,
  cleaned: boolean
}

export interface IPreProcessingFunction {
  (data: IGeometryRaster,
    context: CanvasRenderingContext2D,
    state: {
      toScreenNoRotation(destination, source)
    }, wmUtils: __esri.webMercatorUtils
  ): IGeometryRaster;
}

export interface IPostProcessingFunction {
  (data: IGeometryRaster,
    context: CanvasRenderingContext2D,
    state: IState, wmUtils: __esri.webMercatorUtils);
}

export interface IColoringFunction {
  (data: number): number[]
}

export interface ICustomLayerRenderer {
  (data: IGeometryRaster,
    context: CanvasRenderingContext2D,
    state: IState, wmUtils: __esri.webMercatorUtils,
    applyBlur: boolean,
    avoidTransparent: boolean,
    coloringFunction: IColoringFunction);
}

export interface IState {
  toScreenNoRotation(destination, source),
  // width: number,
  rotation: number,
  scale: number,
  // height: number,
  size: Array<number>,
  center: Array<number>,
  // latitude: number,
  // longitude: number
  pixelRatio: number,
  extent: { xmax: number, xmin: number, ymax: number, ymin: number }
}

export function BindArrayToImagery<T>(from: T[], to: IClientsideImageryLayer,
  filter: { (item: T): boolean } = i => true,
  map: { (item: T): Promise<IGeometryRaster> },
  deep: boolean = false) {
  function removeRaster(_g) {
    if (_g == null) return;
    let $g = _g._$graphic$_;
    let idx = to.geometryRasters.indexOf($g);
    if (idx >= 0) to.geometryRasters.splice(idx, 1);
    _g._$graphic$_ = null;
  }

  async function addRaster(_g) {
    if (_g == null) return;
    if ((_g as any)._$graphic$_) return;
    let $g = (await map(_g)) as IGeometryRaster;
    (_g as any)._$graphic$_ = $g;
    to.addImageRaster($g);
  }

  let observer = new ArrayObserver<T>(from, deep);
  observer.Subscribe((operation, inserted, deleted) => {

    if (deleted)
      deleted.filter(i => filter(i)).forEach((i: any) => {
        if (i instanceof Array)
          i.forEach(element => removeRaster(element));
        else
          removeRaster(i);
      });

    if (inserted)
      inserted.filter(i => filter(i)).forEach(async i => {
        addRaster(i);
      });
  });

  (from).filter(i => filter(i)).forEach(async i => {
    addRaster(i);
  });
}
